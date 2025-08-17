# Standardized Date and Time Picker Components

This document outlines the new standardized date and time picker components that should be used throughout the application. All components use 24-hour format by default and provide consistent Hungarian localization.

## Available Components

### 1. DatePicker
A simple date picker with calendar popup.

```tsx
import { DatePicker } from "@/components/ui/date-time-components"

// Basic usage
const [date, setDate] = useState<Date | undefined>(new Date())

<DatePicker
  date={date}
  onSelect={setDate}
  placeholder="Válassz dátumot"
  disabled={false}
  className="w-full"
/>
```

### 2. DatePickerWithInput
A date picker that combines a native date input with a calendar popup.

```tsx
import { DatePickerWithInput } from "@/components/ui/date-time-components"

<DatePickerWithInput
  date={date}
  onSelect={setDate}
  placeholder="Válassz dátumot"
  disabled={false}
  inputProps={{ required: true }}
/>
```

### 3. DateTimePicker
A combined date and time picker with calendar and time input.

```tsx
import { DateTimePicker } from "@/components/ui/date-time-components"

<DateTimePicker
  date={dateTime}
  onSelect={setDateTime}
  placeholder="Válassz dátumot és időt"
  showTime={true}
  timeStep={15} // 15-minute intervals
/>
```

### 4. TimePicker
A time picker with current time button (24-hour format).

```tsx
import { TimePicker } from "@/components/ui/date-time-components"

const [time, setTime] = useState("09:00")

<TimePicker
  time={time}
  onTimeChange={setTime}
  placeholder="Válassz időt"
  step={15} // 15-minute intervals
/>
```

## Migration Guide

### Replace native date inputs:
```tsx
// OLD - Don't use
<Input
  type="date"
  value={dateString}
  onChange={(e) => setDateString(e.target.value)}
/>

// NEW - Use this instead
<DatePicker
  date={date}
  onSelect={setDate}
  placeholder="Válassz dátumot"
/>
```

### Replace native time inputs:
```tsx
// OLD - Don't use
<Input
  type="time"
  value={timeString}
  onChange={(e) => setTimeString(e.target.value)}
/>

// NEW - Use this instead
<TimePicker
  time={timeString}
  onTimeChange={setTimeString}
  placeholder="Válassz időt"
/>
```

### Update state management:
```tsx
// For date values, prefer Date objects over strings
interface FormData {
  // OLD
  date: string
  
  // NEW - Better type safety
  date: Date | undefined
}

// Convert to API format when submitting
const apiData = {
  date: formData.date ? formData.date.toISOString().split("T")[0] : ""
}
```

## Features

### 24-Hour Format
All time inputs use 24-hour format (HH:mm) by default. No AM/PM confusion.

### Hungarian Localization
- Date formats: `yyyy. MM. dd.` (e.g., "2025. 01. 15.")
- Hungarian month/day names in calendar
- Consistent placeholder text in Hungarian

### Built-in Helpers
- "Ma" (Today) button for quick date selection
- "Most" (Now) button for current time
- Clock icon for visual clarity
- Calendar icon for date pickers

### Keyboard Accessibility
- Full keyboard navigation
- Tab support
- Enter/Space activation
- Arrow key navigation in calendar

### Form Integration
- Works with form validation
- Proper focus management
- Required field support
- Error state handling

## Implementation Status

### ✅ Completed
- [x] Core date/time picker components created
- [x] Hungarian localization implemented
- [x] 24-hour format enforced
- [x] Updated filming form (`app/app/forgatasok/uj/page.tsx`)

### 🔄 To Be Updated
The following components still use native date/time inputs and should be migrated:

1. **Absence Management** (`components/absence-management.tsx`)
   - Lines 633, 644, 685, 695 - date inputs
   
2. **Absence Filters** (`components/absence-filters.tsx`)
   - Lines 158, 167 - date range filters
   
3. **First Steps Wizard** (`components/first-steps-wizard.tsx`)
   - Lines 395, 404 - date inputs
   
4. **Equipment Schedule Viewer** (`components/equipment-schedule-viewer.tsx`)
   - Line 130 - date input
   
5. **Create Forgatas Form** (`components/create-forgatas-form.tsx`)
   - Lines 257, 272, 284 - date and time inputs

### Migration Priority
1. **High Priority**: Forms and user-facing inputs
2. **Medium Priority**: Filters and search components
3. **Low Priority**: Admin/debug components

## Best Practices

### 1. Consistent Naming
- Use `date` for Date objects
- Use `dateString` for string representations
- Use `time` for time strings (HH:mm format)

### 2. Validation
```tsx
// Validate date selection
const isValidDate = (date: Date | undefined): boolean => {
  return date ? !isNaN(date.getTime()) : false
}

// Validate time format
const isValidTime = (time: string): boolean => {
  return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)
}
```

### 3. Default Values
```tsx
// Set sensible defaults
const [date, setDate] = useState<Date | undefined>(new Date()) // Today
const [time, setTime] = useState(new Date().toTimeString().slice(0, 5)) // Current time
```

### 4. API Integration
```tsx
// Always format dates for API calls
const submitForm = async () => {
  const apiData = {
    date: selectedDate?.toISOString().split("T")[0], // YYYY-MM-DD
    start_time: startTime, // HH:mm
    end_time: endTime // HH:mm
  }
  
  await apiClient.post('/endpoint', apiData)
}
```

## Testing

### Manual Testing Checklist
- [ ] Calendar popup opens/closes correctly
- [ ] Date selection updates state
- [ ] Time input accepts valid 24-hour format
- [ ] "Ma" button sets today's date
- [ ] "Most" button sets current time
- [ ] Keyboard navigation works
- [ ] Form validation triggers properly
- [ ] Hungarian text displays correctly

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Support

For questions about implementing these components:
1. Check this documentation first
2. Look at the filming form implementation as reference
3. Consult the component source code in `components/ui/`
4. Follow the existing patterns in working components
