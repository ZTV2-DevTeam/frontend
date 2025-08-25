"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
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
import { getPlatformInfo, shouldUseNativeInput, getInputAttributes } from "@/lib/platform-utils"

interface SystemDatePickerProps {
  date?: Date
  onSelect?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  /** Force native input usage (overrides platform detection) */
  forceNative?: boolean
  /** Minimum date allowed */
  min?: Date
  /** Maximum date allowed */
  max?: Date
}

export function SystemDatePicker({
  date,
  onSelect,
  placeholder = "Válassz dátumot",
  disabled = false,
  className,
  forceNative,
  min,
  max
}: SystemDatePickerProps) {
  const [inputValue, setInputValue] = React.useState(
    date ? format(date, "yyyy-MM-dd") : ""
  )
  const [isOpen, setIsOpen] = React.useState(false)
  const useNative = shouldUseNativeInput(forceNative)
  const platform = getPlatformInfo()

  React.useEffect(() => {
    if (date) {
      setInputValue(format(date, "yyyy-MM-dd"))
    } else {
      setInputValue("")
    }
  }, [date])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    
    if (value) {
      const parsedDate = new Date(value)
      if (!isNaN(parsedDate.getTime())) {
        onSelect?.(parsedDate)
      }
    } else {
      onSelect?.(undefined)
    }
  }

  const handleCalendarSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setInputValue(format(selectedDate, "yyyy-MM-dd"))
    } else {
      setInputValue("")
    }
    onSelect?.(selectedDate)
    setIsOpen(false)
  }

  // Native input for mobile and when preferred
  if (useNative || platform.isMobile) {
    return (
      <Input
        type="date"
        value={inputValue}
        onChange={handleInputChange}
        disabled={disabled}
        min={min ? format(min, "yyyy-MM-dd") : undefined}
        max={max ? format(max, "yyyy-MM-dd") : undefined}
        className={cn(
          "bg-transparent [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer",
          // iOS/Safari specific styling
          platform.isIOS && "[&::-webkit-datetime-edit]:color-inherit",
          // Android specific styling  
          platform.isAndroid && "text-base", // Prevent zoom on Android
          className
        )}
        placeholder={placeholder}
        {...getInputAttributes('date')}
      />
    )
  }

  // Custom picker for desktop
  return (
    <div className="flex gap-2">
      <Input
        type="date"
        value={inputValue}
        onChange={handleInputChange}
        disabled={disabled}
        min={min ? format(min, "yyyy-MM-dd") : undefined}
        max={max ? format(max, "yyyy-MM-dd") : undefined}
        className={cn(
          "flex-1 bg-transparent [&::-webkit-calendar-picker-indicator]:opacity-100",
          className
        )}
        placeholder={placeholder}
      />
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            disabled={disabled}
            className="bg-transparent shrink-0"
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar 
            mode="single" 
            selected={date} 
            onSelect={handleCalendarSelect}
            locale={hu}
            initialFocus
            disabled={(date) => {
              if (min && date < min) return true
              if (max && date > max) return true
              return false
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

interface SystemTimePickerProps {
  time?: string
  onTimeChange?: (time: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  /** Force native input usage (overrides platform detection) */
  forceNative?: boolean
  /** Time step in minutes (e.g., 15 for 15-minute intervals) */
  step?: number
  /** Show seconds */
  showSeconds?: boolean
}

export function SystemTimePicker({
  time = "",
  onTimeChange,
  placeholder = "Válassz időt",
  disabled = false,
  className,
  forceNative,
  step = 1,
  showSeconds = false
}: SystemTimePickerProps) {
  const useNative = shouldUseNativeInput(forceNative)
  const platform = getPlatformInfo()

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onTimeChange?.(e.target.value)
  }

  const setCurrentTime = () => {
    const now = new Date()
    const hours = now.getHours().toString().padStart(2, '0')
    const minutes = now.getMinutes().toString().padStart(2, '0')
    const seconds = now.getSeconds().toString().padStart(2, '0')
    const currentTime = showSeconds ? `${hours}:${minutes}:${seconds}` : `${hours}:${minutes}`
    onTimeChange?.(currentTime)
  }

  return (
    <div className="flex gap-2">
      <Input
        type="time"
        value={time}
        onChange={handleTimeChange}
        disabled={disabled}
        step={showSeconds ? step : step * 60}
        className={cn(
          "flex-1 bg-transparent [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer",
          // iOS/Safari specific styling for better UX
          platform.isIOS && "[&::-webkit-datetime-edit]:color-inherit",
          // Android specific styling
          platform.isAndroid && "text-base", // Prevent zoom
          className
        )}
        placeholder={placeholder}
        data-format="24"
        style={{ 
          WebkitAppearance: 'none',
          MozAppearance: 'textfield'
        }}
        {...getInputAttributes('time')}
      />
      
      {/* Quick action button to set current time */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={setCurrentTime}
        disabled={disabled}
        className="bg-transparent shrink-0 text-xs"
        title="Jelenlegi idő beállítása"
      >
        Most
      </Button>
    </div>
  )
}

interface SystemDateTimePickerProps {
  date?: Date
  onSelect?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  /** Force native input usage (overrides platform detection) */
  forceNative?: boolean
  /** Time step in minutes */
  timeStep?: number
  /** Minimum date allowed */
  min?: Date
  /** Maximum date allowed */
  max?: Date
  /** Show seconds in time */
  showSeconds?: boolean
}

export function SystemDateTimePicker({
  date,
  onSelect,
  placeholder = "Válassz dátumot és időt",
  disabled = false,
  className,
  forceNative,
  timeStep = 15,
  min,
  max,
  showSeconds = false
}: SystemDateTimePickerProps) {
  const [dateTimeValue, setDateTimeValue] = React.useState(
    date ? format(date, showSeconds ? "yyyy-MM-dd'T'HH:mm:ss" : "yyyy-MM-dd'T'HH:mm") : ""
  )
  const useNative = shouldUseNativeInput(forceNative)
  const platform = getPlatformInfo()

  React.useEffect(() => {
    if (date) {
      setDateTimeValue(format(date, showSeconds ? "yyyy-MM-dd'T'HH:mm:ss" : "yyyy-MM-dd'T'HH:mm"))
    } else {
      setDateTimeValue("")
    }
  }, [date, showSeconds])

  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setDateTimeValue(value)
    
    if (value) {
      const parsedDate = new Date(value)
      if (!isNaN(parsedDate.getTime())) {
        onSelect?.(parsedDate)
      }
    } else {
      onSelect?.(undefined)
    }
  }

  const setCurrentDateTime = () => {
    const now = new Date()
    const currentDateTime = format(now, showSeconds ? "yyyy-MM-dd'T'HH:mm:ss" : "yyyy-MM-dd'T'HH:mm")
    setDateTimeValue(currentDateTime)
    onSelect?.(now)
  }

  // For mobile or when native is preferred, use datetime-local input
  if (useNative || platform.isMobile) {
    return (
      <div className="flex gap-2">
        <Input
          type="datetime-local"
          value={dateTimeValue}
          onChange={handleDateTimeChange}
          disabled={disabled}
          min={min ? format(min, showSeconds ? "yyyy-MM-dd'T'HH:mm:ss" : "yyyy-MM-dd'T'HH:mm") : undefined}
          max={max ? format(max, showSeconds ? "yyyy-MM-dd'T'HH:mm:ss" : "yyyy-MM-dd'T'HH:mm") : undefined}
          step={showSeconds ? timeStep : timeStep * 60}
          className={cn(
            "flex-1 bg-transparent [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer",
            platform.isIOS && "[&::-webkit-datetime-edit]:color-inherit",
            platform.isAndroid && "text-base",
            className
          )}
          placeholder={placeholder}
          data-format="24"
          style={{ 
            WebkitAppearance: 'none',
            MozAppearance: 'textfield'
          }}
          {...getInputAttributes('datetime-local')}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={setCurrentDateTime}
          disabled={disabled}
          className="bg-transparent shrink-0 text-xs"
          title="Jelenlegi dátum és idő beállítása"
        >
          Most
        </Button>
      </div>
    )
  }

  // For desktop, use separate date and time inputs for better UX
  const handleDateChange = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      onSelect?.(undefined)
      return
    }

    const newDate = new Date(selectedDate)
    if (date) {
      // Preserve existing time
      newDate.setHours(date.getHours(), date.getMinutes(), date.getSeconds())
    }
    onSelect?.(newDate)
  }

  const handleTimeChange = (timeValue: string) => {
    if (!date) {
      // Create new date with today's date and selected time
      const today = new Date()
      const [hours, minutes, seconds = 0] = timeValue.split(':').map(Number)
      if (!isNaN(hours) && !isNaN(minutes)) {
        const newDate = new Date(today)
        newDate.setHours(hours, minutes, isNaN(seconds) ? 0 : seconds, 0)
        onSelect?.(newDate)
      }
    } else {
      // Update existing date's time
      const [hours, minutes, seconds = 0] = timeValue.split(':').map(Number)
      if (!isNaN(hours) && !isNaN(minutes)) {
        const newDate = new Date(date)
        newDate.setHours(hours, minutes, isNaN(seconds) ? 0 : seconds, 0)
        onSelect?.(newDate)
      }
    }
  }

  const currentTime = date ? format(date, showSeconds ? "HH:mm:ss" : "HH:mm") : ""

  return (
    <div className="flex gap-2">
      <SystemDatePicker
        date={date}
        onSelect={handleDateChange}
        disabled={disabled}
        min={min}
        max={max}
        className="flex-1"
        forceNative={false} // Use custom calendar for desktop
      />
      <SystemTimePicker
        time={currentTime}
        onTimeChange={handleTimeChange}
        disabled={disabled}
        step={timeStep}
        showSeconds={showSeconds}
        className="flex-1"
        forceNative={false}
      />
    </div>
  )
}
