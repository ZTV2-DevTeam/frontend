"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SystemTimePicker, SystemDateTimePicker } from "@/components/ui/system-date-time-picker"
import { getPlatformInfo } from "@/lib/platform-utils"
import { use24HourFormat } from "@/lib/24hour-format-enforcer"

export default function TimeFormatTestPage() {
  const [nativeTime, setNativeTime] = useState("")
  const [systemTime, setSystemTime] = useState("")
  const [systemDateTime, setSystemDateTime] = useState<Date | undefined>()
  const [zenTestTime, setZenTestTime] = useState("")
  const platform = getPlatformInfo()

  // Enforce 24-hour format across all time inputs
  use24HourFormat()

  const setCurrentTime = () => {
    const now = new Date()
    const timeString = now.toTimeString().slice(0, 5) // HH:MM format
    setNativeTime(timeString)
    setSystemTime(timeString)
    setZenTestTime(timeString)
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>24-Hour Format Test - Enhanced for Zen Browser</CardTitle>
          <CardDescription>
            Comprehensive test for 24-hour format enforcement across different browsers and implementations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Platform Info */}
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Platform Detection:</h3>
            <ul className="text-sm space-y-1">
              <li>Mobile: {platform.isMobile ? '✅' : '❌'}</li>
              <li>iOS: {platform.isIOS ? '✅' : '❌'}</li>
              <li>Android: {platform.isAndroid ? '✅' : '❌'}</li>
              <li>Mac: {platform.isMac ? '✅' : '❌'}</li>
              <li>Windows: {platform.isWindows ? '✅' : '❌'}</li>
              <li>Supports Native Pickers: {platform.supportsNativePickers ? '✅' : '❌'}</li>
              <li>Prefers Native Pickers: {platform.preferNativePickers ? '✅' : '❌'}</li>
            </ul>
          </div>

          {/* Browser Detection */}
          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <h3 className="font-semibold mb-2">Browser Information:</h3>
            <p className="text-sm">User Agent: {typeof window !== 'undefined' ? window.navigator.userAgent : 'N/A'}</p>
          </div>

          {/* Set Current Time Button */}
          <div className="flex gap-2">
            <Button onClick={setCurrentTime} variant="outline">
              Set All to Current Time
            </Button>
          </div>

          {/* Enhanced Native HTML time input */}
          <div className="space-y-2">
            <Label htmlFor="zen-test-time">
              Zen Browser Optimized Time Input
            </Label>
            <Input
              id="zen-test-time"
              type="time"
              value={zenTestTime}
              onChange={(e) => setZenTestTime(e.target.value)}
              step="900"
              lang="en-GB"
              data-format="24"
              data-hour-format="24"
              className="max-w-xs force-24hour [&::-webkit-datetime-edit-ampm-field]:hidden [&::-webkit-datetime-edit-ampm-field]:!w-0 [&::-webkit-datetime-edit-ampm-field]:!opacity-0"
              style={{ 
                WebkitAppearance: 'none',
                MozAppearance: 'textfield'
              } as React.CSSProperties}
            />
            <p className="text-sm text-muted-foreground">
              Value: {zenTestTime || 'Not set'}
            </p>
          </div>

          {/* Native HTML time input (enhanced for 24h format) */}
          <div className="space-y-2">
            <Label htmlFor="native-time">
              Standard Enhanced Time Input
            </Label>
            <Input
              id="native-time"
              type="time"
              value={nativeTime}
              onChange={(e) => setNativeTime(e.target.value)}
              step="900"
              lang="en-GB"
              data-format="24"
              className="max-w-xs"
              style={{ 
                WebkitAppearance: 'none',
                MozAppearance: 'textfield'
              } as React.CSSProperties}
            />
            <p className="text-sm text-muted-foreground">
              Value: {nativeTime || 'Not set'}
            </p>
          </div>

          {/* System Time Picker */}
          <div className="space-y-2">
            <Label>System Time Picker</Label>
            <div className="max-w-xs">
              <SystemTimePicker
                time={systemTime}
                onTimeChange={setSystemTime}
                step={15}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Value: {systemTime || 'Not set'}
            </p>
          </div>

          {/* System DateTime Picker */}
          <div className="space-y-2">
            <Label>System DateTime Picker</Label>
            <div className="max-w-md">
              <SystemDateTimePicker
                date={systemDateTime}
                onSelect={setSystemDateTime}
                timeStep={15}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Value: {systemDateTime ? systemDateTime.toLocaleString('hu-HU', { hour12: false }) : 'Not set'}
            </p>
          </div>

          {/* Instructions */}
          <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
            <h3 className="font-semibold mb-2">Testing Instructions for Zen Browser:</h3>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>All time pickers above should display in 24-hour format (00:00 - 23:59)</li>
              <li>There should be NO AM/PM indicators visible anywhere</li>
              <li>Clicking on time inputs should open system pickers in 24-hour format</li>
              <li>The "Zen Browser Optimized" input has the most aggressive 24-hour enforcement</li>
              <li>Try refreshing the page and testing again</li>
              <li>Test with different system locale settings</li>
            </ol>
          </div>

          {/* Troubleshooting */}
          <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg">
            <h3 className="font-semibold mb-2">If you still see AM/PM:</h3>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>Check your system's regional settings - set them to use 24-hour format</li>
              <li>Clear your browser cache and cookies</li>
              <li>Try opening the page in an incognito/private window</li>
              <li>Check if Zen browser has any specific locale overrides in settings</li>
              <li>Report the issue with your browser version and OS details</li>
            </ol>
          </div>

          {/* Current time for reference */}
          <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
            <h3 className="font-semibold mb-2">Reference:</h3>
            <p className="text-sm">
              Current time (24h format): <strong>{new Date().toLocaleTimeString('en-GB')}</strong>
            </p>
            <p className="text-sm">
              Current date and time: <strong>{new Date().toLocaleString('hu-HU', { hour12: false })}</strong>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
