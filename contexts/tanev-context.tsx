'use client'

/**
 * Shared Tanév (school year) context.
 *
 * Loads all Tanévek + the active Tanév once per app lifetime and exposes helpers
 * so every page uses the same "current vs archived" rules. See the multi-Tanév
 * plan for the semantics (Stáb filters to active-Tanév `osztalyok`; other data
 * menus visually separate archived-Tanév records).
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { apiClient, type TanevSchema } from '@/lib/api'
import { useAuth } from '@/contexts/auth-context'

export interface TanevRefLike {
  id?: number
  is_active?: boolean
  display_name?: string
}

export interface TanevGrouping<T> {
  /** Records tagged with the active Tanév, or with no Tanév reference at all. */
  active: T[]
  /** Records tagged with an archived (non-active) Tanév, grouped by Tanév id. */
  archived: Array<{
    tanev: { id: number; display_name: string; is_active: boolean }
    items: T[]
  }>
}

interface TanevContextValue {
  loading: boolean
  error: string | null
  /** All Tanév records known to the backend. */
  tanevek: TanevSchema[]
  /** The single active Tanév, if configured. */
  activeTanev: TanevSchema | null
  /** IDs of Osztaly records that belong to the active Tanév. */
  activeOsztalyIds: Set<number>
  /**
   * True only for the active Tanév. Records without a tanev reference are
   * treated as active (safe legacy default; see plan §4.5).
   */
  isActiveTanev: (tanev?: TanevRefLike | number | null) => boolean
  /**
   * Split a list into an active bucket + one bucket per archived Tanév id,
   * sorted so the most recent archived Tanév appears first.
   */
  groupByTanev: <T>(
    items: readonly T[],
    getTanev: (item: T) => TanevRefLike | null | undefined,
  ) => TanevGrouping<T>
  refresh: () => Promise<void>
}

const TanevContext = createContext<TanevContextValue | undefined>(undefined)

export function TanevProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [tanevek, setTanevek] = useState<TanevSchema[]>([])
  const [activeTanev, setActiveTanev] = useState<TanevSchema | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!isAuthenticated) {
      setTanevek([])
      setActiveTanev(null)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const all = await apiClient.getSchoolYears().catch((err) => {
        console.warn('Failed to load school years:', err)
        return [] as TanevSchema[]
      })
      let active: TanevSchema | null = all.find((t) => t.is_active) ?? null
      if (!active) {
        try {
          active = await apiClient.getActiveSchoolYear()
        } catch {
          active = null
        }
      }
      setTanevek(all)
      setActiveTanev(active)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ismeretlen hiba'
      console.error('TanevProvider load error:', message)
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    load()
  }, [load])

  const activeOsztalyIds = useMemo(() => {
    const ids = new Set<number>()
    if (activeTanev?.osztalyok && Array.isArray(activeTanev.osztalyok)) {
      for (const id of activeTanev.osztalyok) ids.add(id)
    }
    return ids
  }, [activeTanev])

  const activeTanevId = activeTanev?.id ?? null

  const isActiveTanev = useCallback(
    (tanev?: TanevRefLike | number | null): boolean => {
      // Legacy safe default: missing reference is treated as active.
      if (tanev === undefined || tanev === null) return true
      if (typeof tanev === 'number') {
        return activeTanevId != null && tanev === activeTanevId
      }
      if (typeof tanev.is_active === 'boolean') return tanev.is_active
      if (typeof tanev.id === 'number' && activeTanevId != null) {
        return tanev.id === activeTanevId
      }
      // Reference present but unusable — treat as active to avoid hiding data.
      return true
    },
    [activeTanevId],
  )

  const tanevById = useMemo(() => {
    const map = new Map<number, TanevSchema>()
    for (const t of tanevek) map.set(t.id, t)
    return map
  }, [tanevek])

  const groupByTanev = useCallback(
    <T,>(
      items: readonly T[],
      getTanev: (item: T) => TanevRefLike | null | undefined,
    ): TanevGrouping<T> => {
      const active: T[] = []
      const archivedMap = new Map<number, T[]>()
      for (const item of items) {
        const ref = getTanev(item)
        if (isActiveTanev(ref ?? null)) {
          active.push(item)
        } else {
          const id = ref && typeof ref.id === 'number' ? ref.id : -1
          const bucket = archivedMap.get(id) ?? []
          bucket.push(item)
          archivedMap.set(id, bucket)
        }
      }

      const archived: TanevGrouping<T>['archived'] = []
      for (const [id, bucketItems] of archivedMap) {
        const record = id >= 0 ? tanevById.get(id) : undefined
        archived.push({
          tanev: {
            id,
            display_name: record?.display_name ?? 'Ismeretlen tanév',
            is_active: false,
          },
          items: bucketItems,
        })
      }
      archived.sort((a, b) => {
        const ta = tanevById.get(a.tanev.id)
        const tb = tanevById.get(b.tanev.id)
        // Most recent first (by end_year, then start_year).
        const endDiff = (tb?.end_year ?? 0) - (ta?.end_year ?? 0)
        if (endDiff !== 0) return endDiff
        return (tb?.start_year ?? 0) - (ta?.start_year ?? 0)
      })

      return { active, archived }
    },
    [isActiveTanev, tanevById],
  )

  const value = useMemo<TanevContextValue>(
    () => ({
      loading,
      error,
      tanevek,
      activeTanev,
      activeOsztalyIds,
      isActiveTanev,
      groupByTanev,
      refresh: load,
    }),
    [loading, error, tanevek, activeTanev, activeOsztalyIds, isActiveTanev, groupByTanev, load],
  )

  return <TanevContext.Provider value={value}>{children}</TanevContext.Provider>
}

export function useTanev(): TanevContextValue {
  const ctx = useContext(TanevContext)
  if (!ctx) {
    throw new Error('useTanev must be used within a TanevProvider')
  }
  return ctx
}
