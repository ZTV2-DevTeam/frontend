"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  DatePicker, 
  DatePickerWithInput, 
  DateTimePicker, 
  TimePicker,
  SystemDatePicker,
  SystemTimePicker,
  SystemDateTimePicker 
} from '@/components/ui/date-time-components'
import { getPlatformInfo } from '@/lib/platform-utils'

export function SystemDateTimePickerDemo() {
  const [simpleDate, setSimpleDate] = useState<Date | undefined>(new Date())
  const [inputDate, setInputDate] = useState<Date | undefined>(new Date())
  const [dateTime, setDateTime] = useState<Date | undefined>(new Date())
  const [time, setTime] = useState("09:00")
  
  // System picker states
  const [systemDate, setSystemDate] = useState<Date | undefined>(new Date())
  const [systemTime, setSystemTime] = useState("14:30")
  const [systemDateTime, setSystemDateTime] = useState<Date | undefined>(new Date())
  
  // Force native toggle
  const [forceNative, setForceNative] = useState(false)
  const [showSeconds, setShowSeconds] = useState(false)
  
  const platform = getPlatformInfo()

  return (
    <div className="space-y-6 p-6">
      {/* Platform Information */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Detection</CardTitle>
          <CardDescription>
            Current platform information and picker preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {platform.isMobile && <Badge variant="default">Mobile</Badge>}
            {platform.isIOS && <Badge variant="secondary">iOS</Badge>}
            {platform.isAndroid && <Badge variant="secondary">Android</Badge>}
            {platform.isMac && <Badge variant="secondary">macOS</Badge>}
            {platform.isWindows && <Badge variant="secondary">Windows</Badge>}
            {platform.isLinux && <Badge variant="secondary">Linux</Badge>}
            {platform.supportsNativePickers && <Badge variant="outline">Native Support</Badge>}
            {platform.preferNativePickers && <Badge variant="destructive">Prefers Native</Badge>}
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="force-native"
                checked={forceNative}
                onCheckedChange={(checked) => setForceNative(checked === true)}
              />
              <Label htmlFor="force-native">Force Native Inputs</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="show-seconds"
                checked={showSeconds}
                onCheckedChange={(checked) => setShowSeconds(checked === true)}
              />
              <Label htmlFor="show-seconds">Show Seconds</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Native Pickers */}
      <Card>
        <CardHeader>
          <CardTitle>System-Native Date and Time Pickers</CardTitle>
          <CardDescription>
            Cross-platform pickers that adapt to user's platform for familiar UX.
            Uses native inputs on mobile and system-preferred formats.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* System Date Picker */}
          <div className="space-y-2">
            <Label>SystemDatePicker - Platform-adaptive date selection</Label>
            <SystemDatePicker
              date={systemDate}
              onSelect={setSystemDate}
              placeholder="Válassz dátumot"
              className="max-w-sm"
              forceNative={forceNative}
            />
            <p className="text-sm text-muted-foreground">
              Selected: {systemDate ? systemDate.toLocaleDateString('hu-HU') : 'None'}
            </p>
          </div>

          {/* System Time Picker */}
          <div className="space-y-2">
            <Label>SystemTimePicker - Native time input (24-hour format)</Label>
            <SystemTimePicker
              time={systemTime}
              onTimeChange={setSystemTime}
              placeholder="Válassz időt"
              className="max-w-sm"
              forceNative={forceNative}
              step={15}
              showSeconds={showSeconds}
            />
            <p className="text-sm text-muted-foreground">
              Selected: {systemTime || 'None'}
            </p>
          </div>

          {/* System DateTime Picker */}
          <div className="space-y-2">
            <Label>SystemDateTimePicker - Combined date and time</Label>
            <SystemDateTimePicker
              date={systemDateTime}
              onSelect={setSystemDateTime}
              placeholder="Válassz dátumot és időt"
              className="max-w-sm"
              forceNative={forceNative}
              timeStep={15}
              showSeconds={showSeconds}
            />
            <p className="text-sm text-muted-foreground">
              Selected: {systemDateTime ? 
                `${systemDateTime.toLocaleDateString('hu-HU')} ${systemDateTime.toTimeString().slice(0, showSeconds ? 8 : 5)}` : 
                'None'
              }
            </p>
          </div>

        </CardContent>
      </Card>

      {/* Original Pickers for Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Original Date and Time Pickers</CardTitle>
          <CardDescription>
            Custom-styled pickers with calendar popover. Good for desktop-focused applications.
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

      {/* Usage Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">When to use System Pickers:</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Mobile-first applications</li>
                <li>Forms where users expect native behavior</li>
                <li>When accessibility is a priority</li>
                <li>Cross-platform applications</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">When to use Custom Pickers:</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Desktop-focused applications</li>
                <li>When you need custom styling</li>
                <li>Calendar-heavy interfaces</li>
                <li>When you need more control over the UI</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Platform Features:</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li><strong>Mobile:</strong> Automatically uses native inputs for better UX</li>
                <li><strong>Desktop:</strong> Hybrid approach with native input + calendar popover</li>
                <li><strong>24-hour format:</strong> Enforced across all platforms</li>
                <li><strong>Accessibility:</strong> Full keyboard navigation and screen reader support</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
