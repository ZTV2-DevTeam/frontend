"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface CalendarProps {
  className?: string
}

function Calendar({ className }: CalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date())
  
  const today = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
  const startDate = new Date(firstDayOfMonth)
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay())
  
  const days = []
  const currentDateTemp = new Date(startDate)
  
  for (let i = 0; i < 42; i++) {
    days.push(new Date(currentDateTemp))
    currentDateTemp.setDate(currentDateTemp.getDate() + 1)
  }
  
  const monthNames = [
    "Január", "Február", "Március", "Április", "Május", "Június",
    "Július", "Augusztus", "Szeptember", "Október", "November", "December"
  ]
  
  const dayNames = ["V", "H", "K", "Sze", "Cs", "P", "Szo"]
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(new Date(currentYear, currentMonth + (direction === 'next' ? 1 : -1), 1))
  }
  
  return (
    <div className={cn("p-3", className)}>
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigateMonth('prev')}
          className="h-7 w-7"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-sm font-medium">
          {monthNames[currentMonth]} {currentYear}
        </h3>
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigateMonth('next')}
          className="h-7 w-7"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const isCurrentMonth = day.getMonth() === currentMonth
          const isToday = day.toDateString() === today.toDateString()
          
          return (
            <Button
              key={index}
              variant={isToday ? "default" : "ghost"}
              className={cn(
                "h-8 w-8 p-0 text-xs",
                !isCurrentMonth && "text-muted-foreground opacity-50",
                isToday && "bg-primary text-primary-foreground"
              )}
            >
              {day.getDate()}
            </Button>
          )
        })}
      </div>
    </div>
  )
}

Calendar.displayName = "Calendar"

export { Calendar }
