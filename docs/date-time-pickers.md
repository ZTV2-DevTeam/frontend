# Cross-Platform Date and Time Pickers

This project includes comprehensive date and time picker components that provide native system integration and familiar user experiences across Android, iOS, macOS, and Windows platforms.

## Overview

We provide two sets of date/time picker components:

### 1. System-Native Pickers (Recommended)
- **SystemDatePicker** - Platform-adaptive date selection
- **SystemTimePicker** - Native time input with 24-hour format
- **SystemDateTimePicker** - Combined date and time selection

### 2. Custom Styled Pickers
- **DatePicker** - Custom calendar popover
- **DatePickerWithInput** - Native input + calendar button
- **DateTimePicker** - Custom date and time combination
- **TimePicker** - Custom time input

## Key Features

### ✅ Cross-Platform Support
- **Android**: Uses native date/time inputs for familiar UX
- **iOS**: Leverages system date/time wheels and 24-hour format
- **macOS**: Native date picker integration with system preferences
- **Windows**: System date/time picker with Windows styling
- **Linux**: Fallback to enhanced web inputs

### ✅ 24-Hour Format Everywhere
- Enforced 24-hour time format across all platforms
- No AM/PM confusion
- Consistent time display and input

### ✅ Platform Detection
- Automatic platform detection and adaptation
- Mobile-first approach for touch devices
- Desktop enhancements for mouse/keyboard users

### ✅ Accessibility
- Full keyboard navigation
- Screen reader support
- High contrast mode support
- Reduced motion support

### ✅ Localization
- Hungarian localization by default
- Platform-aware locale detection
- Customizable date formats

## Usage Examples

### Basic System Date Picker
```tsx
import { SystemDatePicker } from '@/components/ui/date-time-components'

function MyComponent() {
  const [date, setDate] = useState<Date | undefined>()
  
  return (
    <SystemDatePicker
      date={date}
      onSelect={setDate}
      placeholder="Válassz dátumot"
    />
  )
}
```

### System Time Picker with 15-minute Steps
```tsx
import { SystemTimePicker } from '@/components/ui/date-time-components'

function MyComponent() {
  const [time, setTime] = useState("09:00")
  
  return (
    <SystemTimePicker
      time={time}
      onTimeChange={setTime}
      step={15}
      placeholder="Válassz időt"
    />
  )
}
```

### Combined Date and Time
```tsx
import { SystemDateTimePicker } from '@/components/ui/date-time-components'

function MyComponent() {
  const [dateTime, setDateTime] = useState<Date | undefined>()
  
  return (
    <SystemDateTimePicker
      date={dateTime}
      onSelect={setDateTime}
      timeStep={15}
      placeholder="Válassz dátumot és időt"
    />
  )
}
```

### Force Native Inputs
```tsx
<SystemDatePicker
  date={date}
  onSelect={setDate}
  forceNative={true} // Always use native inputs
/>
```

### With Min/Max Constraints
```tsx
<SystemDatePicker
  date={date}
  onSelect={setDate}
  min={new Date()} // No past dates
  max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)} // Max 30 days
/>
```

## Component API

### SystemDatePicker Props
```typescript
interface SystemDatePickerProps {
  date?: Date
  onSelect?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  forceNative?: boolean // Override platform detection
  min?: Date // Minimum selectable date
  max?: Date // Maximum selectable date
}
```

### SystemTimePicker Props
```typescript
interface SystemTimePickerProps {
  time?: string // Format: "HH:mm" or "HH:mm:ss"
  onTimeChange?: (time: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  forceNative?: boolean
  step?: number // Time step in minutes
  showSeconds?: boolean
}
```

### SystemDateTimePicker Props
```typescript
interface SystemDateTimePickerProps {
  date?: Date
  onSelect?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  forceNative?: boolean
  timeStep?: number // Time step in minutes
  min?: Date
  max?: Date
  showSeconds?: boolean
}
```

## Platform-Specific Behaviors

### Mobile Devices (iOS/Android)
- Always uses native `input[type="date"]`, `input[type="time"]`, `input[type="datetime-local"]`
- Leverages platform's native date/time selection UI
- Optimized touch targets (44px minimum on iOS)
- Prevents zoom on Android (16px font size)

### Desktop (Windows/Mac/Linux)
- Hybrid approach: native input + custom calendar popover
- Enhanced keyboard navigation
- Better mouse interaction
- Custom styling while maintaining native functionality

### Automatic Detection
```typescript
import { getPlatformInfo } from '@/lib/platform-utils'

const platform = getPlatformInfo()
// Returns: { isMobile, isIOS, isAndroid, isMac, isWindows, isLinux, supportsNativePickers, preferNativePickers }
```

## Styling and Customization

### CSS Classes
The components use Tailwind CSS classes and can be customized:

```tsx
<SystemDatePicker
  className="w-full max-w-sm border-2 border-blue-500"
  date={date}
  onSelect={setDate}
/>
```

### Platform-Specific Styling
Custom CSS is automatically applied for platform-specific enhancements:

- iOS: Enhanced calendar picker indicator, native font smoothing
- Android: Zoom prevention, optimized padding
- Windows: System font integration
- Dark mode: Automatic color scheme detection

## Best Practices

### When to Use System Pickers
✅ **Use SystemDatePicker/SystemTimePicker for:**
- Mobile-first applications
- Forms where users expect native behavior
- Accessibility-critical interfaces
- Cross-platform applications
- When consistency with system UI is important

### When to Use Custom Pickers
✅ **Use DatePicker/DateTimePicker for:**
- Desktop-focused applications
- When you need heavy customization
- Calendar-heavy interfaces (event planning, scheduling)
- When visual consistency with your design system is critical

### Time Format Guidelines
- **Always use 24-hour format** for clarity
- Use 15-minute steps for most scheduling applications
- Enable seconds only when precision is required
- Provide "current time" quick actions

### Accessibility Guidelines
- Always provide meaningful labels
- Use appropriate ARIA attributes
- Test with keyboard navigation
- Test with screen readers
- Support high contrast mode

## Browser Support

| Browser | Native Date | Native Time | Native DateTime |
|---------|------------|-------------|-----------------|
| Chrome (Android) | ✅ | ✅ | ✅ |
| Safari (iOS) | ✅ | ✅ | ✅ |
| Safari (macOS) | ✅ | ✅ | ✅ |
| Chrome (Windows) | ✅ | ✅ | ✅ |
| Edge (Windows) | ✅ | ✅ | ✅ |
| Firefox | ⚠️ Limited | ⚠️ Limited | ❌ |

**Note**: Firefox has limited native picker support. Our components provide graceful fallbacks.

## Testing

### Platform Testing
Test your date/time pickers on:
- [ ] iPhone (Safari)
- [ ] Android device (Chrome)
- [ ] Windows (Chrome/Edge)
- [ ] macOS (Safari/Chrome)
- [ ] Desktop Firefox (fallback behavior)

### Accessibility Testing
- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] High contrast mode
- [ ] Zoom levels (up to 200%)

### Functionality Testing
- [ ] Date selection and validation
- [ ] Time input with 24-hour format
- [ ] Min/max date constraints
- [ ] Form integration and validation
- [ ] Touch interaction on mobile

## Migration Guide

### From Custom Pickers to System Pickers
```tsx
// Before
<DateTimePicker 
  date={date} 
  onSelect={setDate} 
  showTime={true} 
/>

// After  
<SystemDateTimePicker 
  date={date} 
  onSelect={setDate} 
/>
```

### Adding Platform Detection
```tsx
// Before
<DatePicker date={date} onSelect={setDate} />

// After - with automatic platform optimization
<SystemDatePicker date={date} onSelect={setDate} />

// Or with manual control
<SystemDatePicker 
  date={date} 
  onSelect={setDate} 
  forceNative={shouldUseNative} 
/>
```

## Support

For issues or questions:
1. Check the demo components for working examples
2. Verify browser support for your target platforms
3. Test with platform detection utilities
4. Review accessibility guidelines

The system is designed to provide the best possible user experience on each platform while maintaining consistency in functionality and 24-hour time format across all devices.
