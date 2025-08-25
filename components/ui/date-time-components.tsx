// Cross-platform Date and Time Picker Components
// Use these components throughout the application for consistent date/time input

// RECOMMENDED: System-native components for best user experience
// These automatically adapt to the user's platform (Android, iOS, Mac, Windows)
export { 
  SystemDatePicker, 
  SystemTimePicker, 
  SystemDateTimePicker 
} from "./system-date-time-picker"

// LEGACY: Custom-styled components (use only when specific styling is needed)
export { DatePicker, DatePickerWithInput } from "./date-picker"
export { DateTimePicker, TimePicker } from "./datetime-picker"

// ALTERNATIVE: For simple forms, you can also use native HTML inputs directly:
// <Input type="date" /> <Input type="time" /> <Input type="datetime-local" />

/**
 * Quick Migration Guide:
 * 
 * OLD: import { DatePicker } from "@/components/ui/date-time-components"
 * NEW: import { SystemDatePicker } from "@/components/ui/date-time-components"
 * 
 * Benefits of System components:
 * - Native platform experience (iOS wheels, Android native, Windows system picker)
 * - Better accessibility and keyboard support
 * - 24-hour format everywhere
 * - No JavaScript dependencies
 * - Faster loading and better performance
 */

// Re-export Calendar for direct use if needed
export { Calendar } from "./calendar"
