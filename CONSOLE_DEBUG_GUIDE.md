# Console Error Debug Guide

This document helps identify and fix empty console errors in your Next.js application.

## What You've Set Up

1. **Console Error Filter** (`lib/console-error-filter.ts`):
   - Intercepts empty console calls and reports their location
   - Only active in development mode

2. **Console Debugger** (`components/console-debugger.tsx`):
   - Tracks and counts empty console calls
   - Provides stack traces for debugging

3. **Enhanced Global Error Handler** (`components/global-error-handler.tsx`):
   - Catches empty promise rejections and error events
   - Provides detailed logging for debugging

4. **Safe Browser Utils** (`lib/safe-browser-utils.ts`):
   - Provides safe alternatives to browser APIs
   - Prevents SSR/hydration issues

## Common Causes of Empty Console Errors

### 1. Undefined Variables in Console Calls
```tsx
// BAD
console.log(undefinedVariable)
console.error(null)
console.warn('')

// GOOD
console.log('Variable value:', undefinedVariable)
console.error('Error occurred:', error || 'Unknown error')
console.warn('Warning:', message || 'Empty warning')
```

### 2. Empty Promise Rejections
```tsx
// BAD
Promise.reject()
Promise.reject(null)
Promise.reject('')

// GOOD
Promise.reject(new Error('Specific error message'))
```

### 3. Async/Await Without Proper Error Handling
```tsx
// BAD
async function badFunction() {
  const data = await fetch('/api/data')
  // If fetch fails, might cause empty error
}

// GOOD
async function goodFunction() {
  try {
    const response = await fetch('/api/data')
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Fetch failed:', error)
    throw error
  }
}
```

### 4. SSR/Hydration Issues
```tsx
// BAD - accessing window/document without checking
const width = window.innerWidth
document.cookie = 'token=value'

// GOOD - safe access
import { safeWindow, safeDocument } from '@/lib/safe-browser-utils'

const width = safeWindow.innerWidth
safeDocument.setCookie('token', 'value')
```

## How to Debug

1. **Open Browser DevTools**
2. **Look for messages like:**
   - `🚨 Empty console.log call #X detected at:`
   - `🚨 Empty Promise Rejection Caught:`
   - `🚨 Empty Error Event Caught:`

3. **Follow the stack traces** to find the exact location of the empty console calls

## Next.js Specific Issues

### Middleware Console Logging
Your middleware is logging on every request. Consider reducing verbosity:

```tsx
// Current (very verbose)
console.log('🔐 Middleware token check:', {...})

// Better (only log when needed)
if (DEBUG_CONFIG.LOG_MIDDLEWARE) {
  console.log('🔐 Middleware token check:', {...})
}
```

### API Client Logging
Your API client has extensive logging. Consider:

```tsx
// In lib/config.ts, add middleware logging control
export const DEBUG_CONFIG = {
  // ... existing config
  LOG_MIDDLEWARE: false, // Set to true only when debugging auth issues
  LOG_EVERY_REQUEST: false, // Set to true only when debugging API issues
}
```

## To Monitor Empty Console Errors

1. **Check Browser Console** - Look for 🚨 warnings
2. **Check Terminal** - Next.js server logs
3. **Use React DevTools** - Check for component errors

## Recommended Next Steps

1. **Review API Error Handling**:
   - Ensure all API calls have proper error handling
   - Never reject promises with empty values

2. **Review Console Logging**:
   - Audit all console.log/error/warn calls
   - Ensure they always have meaningful messages

3. **Review Async Operations**:
   - Add proper try/catch blocks
   - Handle network errors gracefully

4. **Consider Reducing Debug Verbosity**:
   - Disable unnecessary logging in development
   - Use conditional logging based on debug flags

## Testing the Fix

1. **Refresh your application**
2. **Open browser DevTools console**
3. **Navigate through different pages**
4. **Look for the 🚨 warnings** - they will show you exactly where empty console calls are happening

The console debugger will now help you identify the exact source of empty console errors!
