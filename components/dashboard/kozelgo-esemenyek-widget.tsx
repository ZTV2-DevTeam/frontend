"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { apiClient } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import { format, parseISO } from "date-fns"
import { hu } from "date-fns/locale"
import { ChevronDown, ChevronUp, MapPin, User, Info, Wrench, CalendarIcon, Clock } from "lucide-react"

export function KozelgoEsemenyekWidget() {
  const router = useRouter()
  const { user } = useAuth()
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  useEffect(() => {
    async function fetchUpcoming() {
      try {
        setLoading(true)
        const today = new Date().toISOString().split('T')[0]
        const data = await apiClient.getFilmingSessionsOptimized(today)
        const sorted = data.sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time_from}`)
          const dateB = new Date(`${b.date}T${b.time_from}`)
          return dateA.getTime() - dateB.getTime()
        })
        setSessions(sorted)
        if (sorted.length > 0) {
          setExpandedId(sorted[0].id)
        }
      } catch (error) {
        console.error("Error fetching sessions:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchUpcoming()
  }, [])

  const isUserAssigned = (session: any) => {
    if (!session.assignment || !session.assignment.assigned_users) return false
    return session.assignment.assigned_users.some((u: any) => u.id === user?.user_id)
  }

  const getStatusInfo = (session: any) => {
    if (!session.assignment) {
      return { label: "PISZKOZAT", dotClass: "bg-slate-500", textClass: "text-slate-500", borderClass: "border-slate-500/20" }
    }
    if (session.assignment.finalized) {
      return { label: "VÉGLEGESÍTVE", dotClass: "bg-emerald-500", textClass: "text-emerald-500", borderClass: "border-emerald-500/20" }
    }
    return { label: "PISZKOZAT", dotClass: "bg-purple-500", textClass: "text-purple-500", borderClass: "border-purple-500/20" }
  }

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold flex items-center gap-2">
        Közelgő események
      </h2>
      
      {loading ? (
        <Card>
          <CardContent className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </CardContent>
        </Card>
      ) : sessions.length === 0 ? (
        <Card>
          <CardContent className="text-center text-muted-foreground py-8">
            Nincsenek közelgő események.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sessions.map(session => {
            const assigned = isUserAssigned(session)
            const status = getStatusInfo(session)
            const isExpanded = expandedId === session.id
            const sessionDate = parseISO(session.date)
            
            const monthShort = format(sessionDate, 'MMM', { locale: hu }).toUpperCase().replace('.', '')
            const dayStr = format(sessionDate, 'dd')
            const dayOfWeek = format(sessionDate, 'EEEEEE', { locale: hu })
            
            return (
              <div 
                key={session.id} 
                className={`rounded-xl border transition-colors overflow-hidden ${
                  assigned 
                    ? `border-blue-500/30 bg-blue-500/[0.02] dark:bg-blue-500/[0.05]` 
                    : `border-border bg-card`
                }`}
              >
                <div 
                  className="p-4 flex flex-row items-center gap-4 cursor-pointer"
                  onClick={() => toggleExpand(session.id)}
                >
                  {/* Left Date Box */}
                  <div className="flex flex-col items-center justify-center bg-muted/60 dark:bg-[#252528] rounded-xl w-16 h-16 shrink-0 border border-border/30">
                    <span className="text-2xl font-bold leading-none">{dayStr}</span>
                    <span className="text-[10px] text-muted-foreground uppercase font-medium mt-1">{monthShort}.</span>
                  </div>

                  {/* Right Info */}
                  <div className="flex-1 min-w-0 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <div className={`w-2 h-2 rounded-full ${status.dotClass}`}></div>
                        <span className={`text-[10px] font-bold tracking-wider ${status.textClass}`}>
                          {status.label}
                        </span>
                      </div>
                      <h4 className="font-bold text-lg leading-none mb-1.5 truncate">
                        {session.name}
                      </h4>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <span className="capitalize">{dayOfWeek}.</span>
                        <span>{session.time_from.substring(0, 5)} - {session.time_to.substring(0, 5)}</span>
                      </div>
                    </div>
                    
                    <div className="pl-4">
                      {isExpanded ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-1">
                    <div className="border-t border-border/50 pt-4 space-y-5">
                      
                      {session.description && (
                        <div>
                          <h5 className="text-sm font-semibold mb-1 text-foreground">Leírás</h5>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{session.description}</p>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                        <div>
                          <h5 className="text-sm font-semibold mb-2 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" /> Időpont
                          </h5>
                          <p className="text-sm text-muted-foreground pl-6">
                            {session.time_from.substring(0, 5)} - {session.time_to.substring(0, 5)}
                          </p>
                        </div>

                        {session.location && (
                          <div>
                            <h5 className="text-sm font-semibold mb-2 flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" /> Helyszín
                            </h5>
                            <p className="text-sm text-muted-foreground pl-6">{session.location.name}</p>
                          </div>
                        )}

                        {(session.szerkeszto || session.contact_person) && (
                          <div>
                            <h5 className="text-sm font-semibold mb-2 flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" /> Szervező
                            </h5>
                            <div className="text-sm text-muted-foreground pl-6">
                              <div className="font-medium text-foreground">
                                {session.szerkeszto ? session.szerkeszto.full_name : session.contact_person.name}
                              </div>
                              <div className="mt-0.5">
                                {session.szerkeszto ? session.szerkeszto.email : (session.contact_person.email || session.contact_person.phone)}
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {session.equipment_details && session.equipment_details.length > 0 && (
                          <div>
                            <h5 className="text-sm font-semibold mb-2 flex items-center gap-2">
                              <Wrench className="h-4 w-4 text-muted-foreground" /> Szükséges eszközök
                            </h5>
                            <div className="flex flex-wrap gap-1.5 pl-6">
                              {session.equipment_details.map((eq: any) => (
                                <Badge key={eq.id} variant="outline" className="font-normal text-xs bg-muted/30 whitespace-nowrap">
                                  {eq.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="pt-4 flex w-full">
                        <Button 
                          variant="secondary" 
                          className="w-full bg-muted/50 hover:bg-muted/80 text-foreground border border-border/50"
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/app/forgatasok/${session.id}`)
                          }}
                        >
                          További részletek
                        </Button>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
