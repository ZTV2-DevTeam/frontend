"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { DatePicker, DatePickerWithInput, DateTimePicker, TimePicker } from '@/components/ui/date-time-components'

export function DateTimePickerDemo() {
  const [simpleDate, setSimpleDate] = useState<Date | undefined>(new Date())
  const [inputDate, setInputDate] = useState<Date | undefined>(new Date())
  const [dateTime, setDateTime] = useState<Date | undefined>(new Date())
  const [time, setTime] = useState("09:00")

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Standardized Date and Time Pickers</CardTitle>
          <CardDescription>
            All components use 24-hour format and Hungarian localization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Simple Date Picker */}
          <div className="space-y-2">
            <Label>DatePicker - Simple date selection</Label>
            <DatePicker
              date={simpleDate}
              onSelect={setSimpleDate}
              placeholder="Válassz dátumot"
              className="w-full max-w-sm"
            />
            <p className="text-sm text-muted-foreground">
              Selected: {simpleDate ? simpleDate.toLocaleDateString('hu-HU') : 'None'}
            </p>
          </div>

          {/* Date Picker with Input */}
          <div className="space-y-2">
            <Label>DatePickerWithInput - Native input + calendar</Label>
            <DatePickerWithInput
              date={inputDate}
              onSelect={setInputDate}
              placeholder="Válassz dátumot"
              className="max-w-sm"
            />
            <p className="text-sm text-muted-foreground">
              Selected: {inputDate ? inputDate.toLocaleDateString('hu-HU') : 'None'}
            </p>
          </div>

          {/* Date Time Picker */}
          <div className="space-y-2">
            <Label>DateTimePicker - Date and time combined</Label>
            <DateTimePicker
              date={dateTime}
              onSelect={setDateTime}
              placeholder="Válassz dátumot és időt"
              showTime={true}
              timeStep={15}
              className="max-w-sm"
            />
            <p className="text-sm text-muted-foreground">
              Selected: {dateTime ? 
                `${dateTime.toLocaleDateString('hu-HU')} ${dateTime.toTimeString().slice(0, 5)}` : 
                'None'
              }
            </p>
          </div>

          {/* Time Picker */}
          <div className="space-y-2">
            <Label>TimePicker - Time only (24-hour format)</Label>
            <TimePicker
              time={time}
              onTimeChange={setTime}
              placeholder="Válassz időt"
              step={15}
              className="max-w-sm"
            />
            <p className="text-sm text-muted-foreground">
              Selected: {time || 'None'}
            </p>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}
