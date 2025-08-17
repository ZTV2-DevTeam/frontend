"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Clock } from "lucide-react"
import { hu } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateTimePickerProps {
  date?: Date
  onSelect?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  showTime?: boolean
  timeStep?: number
}

export function DateTimePicker({
  date,
  onSelect,
  placeholder = "Válassz dátumot és időt",
  disabled = false,
  className,
  showTime = true,
  timeStep = 15
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date)
  const [timeValue, setTimeValue] = React.useState(
    date ? format(date, "HH:mm") : ""
  )

  React.useEffect(() => {
    setSelectedDate(date)
    if (date) {
      setTimeValue(format(date, "HH:mm"))
    } else {
      setTimeValue("")
    }
  }, [date])

  const handleDateSelect = (newDate: Date | undefined) => {
    if (!newDate) {
      setSelectedDate(undefined)
      onSelect?.(undefined)
      return
    }

    const updatedDate = new Date(newDate)
    
    if (timeValue && showTime) {
      const [hours, minutes] = timeValue.split(':').map(Number)
      if (!isNaN(hours) && !isNaN(minutes)) {
        updatedDate.setHours(hours, minutes, 0, 0)
      }
    }
    
    setSelectedDate(updatedDate)
    onSelect?.(updatedDate)
  }

  const handleTimeChange = (time: string) => {
    setTimeValue(time)
    
    if (selectedDate && time) {
      const [hours, minutes] = time.split(':').map(Number)
      if (!isNaN(hours) && !isNaN(minutes)) {
        const updatedDate = new Date(selectedDate)
        updatedDate.setHours(hours, minutes, 0, 0)
        setSelectedDate(updatedDate)
        onSelect?.(updatedDate)
      }
    }
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const getCurrentTime = () => {
    const now = new Date()
    const hours = now.getHours().toString().padStart(2, '0')
    const minutes = now.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }

  const setCurrentTime = () => {
    const currentTime = getCurrentTime()
    handleTimeChange(currentTime)
  }

  const setToday = () => {
    const today = new Date()
    if (showTime && timeValue) {
      const [hours, minutes] = timeValue.split(':').map(Number)
      if (!isNaN(hours) && !isNaN(minutes)) {
        today.setHours(hours, minutes, 0, 0)
      }
    }
    setSelectedDate(today)
    onSelect?.(today)
  }

  return (
    <div className="flex gap-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            data-empty={!selectedDate}
            disabled={disabled}
            className={cn(
              "data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal bg-transparent",
              className
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate 
              ? showTime 
                ? format(selectedDate, "yyyy. MM. dd. HH:mm", { locale: hu })
                : format(selectedDate, "yyyy. MM. dd.", { locale: hu })
              : <span>{placeholder}</span>
            }
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex">
            <Calendar 
              mode="single" 
              selected={selectedDate} 
              onSelect={handleDateSelect}
              locale={hu}
              initialFocus 
            />
            {showTime && (
              <div className="flex flex-col gap-2 p-3 border-l">
                <div className="text-sm font-medium">Időpont</div>
                <div className="flex gap-2">
                  <Input
                    type="time"
                    value={timeValue}
                    onChange={(e) => handleTimeChange(e.target.value)}
                    className="w-24 bg-transparent"
                    step={timeStep * 60}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={setCurrentTime}
                    className="bg-transparent"
                  >
                    <Clock className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={setToday}
                  className="bg-transparent text-xs"
                >
                  Ma
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleClose}
                  className="text-xs"
                >
                  Kész
                </Button>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

interface TimePickerProps {
  time?: string
  onTimeChange?: (time: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  step?: number
}

export function TimePicker({
  time = "",
  onTimeChange,
  placeholder = "Válassz időt",
  disabled = false,
  className,
  step = 15
}: TimePickerProps) {
  const getCurrentTime = () => {
    const now = new Date()
    const hours = now.getHours().toString().padStart(2, '0')
    const minutes = now.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }

  const setCurrentTime = () => {
    const currentTime = getCurrentTime()
    onTimeChange?.(currentTime)
  }

  return (
    <div className="flex gap-2">
      <Input
        type="time"
        value={time}
        onChange={(e) => onTimeChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cn("bg-transparent flex-1", className)}
        step={step * 60}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={setCurrentTime}
        disabled={disabled}
        className="bg-transparent shrink-0"
      >
        <Clock className="h-4 w-4" />
      </Button>
    </div>
  )
}
