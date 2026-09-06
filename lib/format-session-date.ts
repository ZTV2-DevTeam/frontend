// Shared helpers for displaying a Forgatás's date/time range, including
// accurate rendering of multi-day (több napos) sessions.
import { format } from "date-fns"
import { hu } from "date-fns/locale"

export interface SessionDateRangeLike {
  date: string
  end_date?: string
  is_multi_day?: boolean
  time_from?: string
  time_to?: string
}

export const isSessionMultiDay = (session: SessionDateRangeLike): boolean => {
  if (typeof session.is_multi_day === "boolean") return session.is_multi_day
  return !!session.end_date && session.end_date !== session.date
}

/** Format a single date string as "yyyy. MMMM dd. (EEEE)". Falls back to the raw string on error. */
export const formatSessionDate = (dateStr: string): string => {
  try {
    return format(new Date(dateStr), "yyyy. MMMM dd. (EEEE)", { locale: hu })
  } catch {
    return dateStr
  }
}

/** Format "HH:MM:SS" (or "HH:MM") as "HH:MM". */
export const formatSessionTime = (timeStr: string): string => {
  try {
    const [hours, minutes] = timeStr.split(":")
    return `${hours}:${minutes}`
  } catch {
    return timeStr
  }
}

/**
 * Format a session's date as a single day ("yyyy. MMMM dd. (EEEE)") or, for
 * multi-day sessions, as a range ("yyyy. MMMM dd. (EEEE) – yyyy. MMMM dd. (EEEE)").
 */
export const formatSessionDateRange = (session: SessionDateRangeLike): string => {
  if (isSessionMultiDay(session) && session.end_date) {
    return `${formatSessionDate(session.date)} – ${formatSessionDate(session.end_date)}`
  }
  return formatSessionDate(session.date)
}

/**
 * Format a session's time range. For multi-day sessions this includes the
 * start/end dates so it's unambiguous which day each time belongs to.
 */
export const formatSessionTimeRange = (session: SessionDateRangeLike): string => {
  if (!session.time_from || !session.time_to) return ""
  if (isSessionMultiDay(session) && session.end_date) {
    try {
      const startDateShort = format(new Date(session.date), "MM.dd.", { locale: hu })
      const endDateShort = format(new Date(session.end_date), "MM.dd.", { locale: hu })
      return `${startDateShort} ${formatSessionTime(session.time_from)} – ${endDateShort} ${formatSessionTime(session.time_to)}`
    } catch {
      // fall through to simple format below
    }
  }
  return `${formatSessionTime(session.time_from)} - ${formatSessionTime(session.time_to)}`
}
