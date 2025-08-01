# Authentication Implementation

This document describes the JWT-based authentication system implemented for ZTV2.

## Features

- ✅ JWT token-based authentication
- ✅ Protected routes with automatic redirects
- ✅ Persistent login state (localStorage + cookies)
- ✅ Automatic token refresh
- ✅ User profile management
- ✅ Logout functionality
- ✅ Login form with error handling
- ✅ Loading states and user feedback

## API Integration

The system integrates with your backend API using the OpenAPI specification you provided:

### Endpoints Used
- `POST /api/login` - User authentication
- `GET /api/profile` - Get current user profile
- `POST /api/refresh-token` - Refresh JWT token
- `POST /api/logout` - User logout
- `GET /api/test-auth` - Test authentication
- `GET /api/dashboard` - Protected dashboard endpoint

### Authentication Flow
1. User enters credentials on `/login` page
2. Credentials sent to `/api/login` endpoint
3. On success, JWT token stored in localStorage and cookies
4. User redirected to `/app/iranyitopult` (dashboard)
5. Protected routes check authentication status
6. Token automatically refreshed when needed

## Configuration

### API URL Configuration
Update the API URL in `lib/config.ts` or use environment variables:

```typescript
// lib/config.ts
export const API_CONFIG = {
  BASE_URL: 'http://your-api-server:port',
  // ... rest of config
}
```

Or create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://your-api-server:port
```

### Protected Routes
All routes under `/app/*` are automatically protected. Users must be authenticated to access them.

## Components

### AuthProvider (`contexts/auth-context.tsx`)
- Manages authentication state
- Provides login, logout, and refresh functionality
- Handles user profile data

### ProtectedRoute (`components/protected-route.tsx`)
- Wrapper component for protected pages
- Redirects unauthenticated users to login
- Shows loading spinner during auth check

### LoginForm (`components/login-form.tsx`)
- Handles user authentication
- Form validation and error display
- Redirects to dashboard on success

### NavUser (`components/nav-user.tsx`)
- Displays current user information in sidebar
- Logout functionality
- User avatar with initials

## Usage

### Login
1. Navigate to `/login`
2. Enter username and password
3. Click "Bejelentkezés"
4. On success, redirected to dashboard

### Logout
1. Click user avatar in sidebar
2. Select "Log out"
3. Redirected to login page

### Adding New Protected Routes
New routes under `/app/*` are automatically protected. No additional configuration needed.

## Error Handling

- Login errors are displayed to the user
- Network errors are caught and handled gracefully
- Token refresh failures automatically log out the user
- Protected routes redirect to login on authentication failure

## Security Features

- JWT tokens stored securely
- Automatic token cleanup on logout
- Protected route middleware
- CSRF protection via SameSite cookies
- Secure cookie flags for production

## Testing

To test the authentication:

1. Start your backend API server
2. Update the API URL in configuration
3. Start the frontend: `npm run dev`
4. Navigate to `http://localhost:3000`
5. Try logging in with valid credentials

## Troubleshooting

### Common Issues

1. **Login not working**: Check API URL configuration
2. **CORS errors**: Ensure backend allows frontend origin
3. **Token not persisting**: Check localStorage and cookie settings
4. **Redirects not working**: Verify middleware configuration

### Debug Tips

- Check browser console for API errors
- Verify network requests in browser dev tools
- Check localStorage for jwt_token
- Ensure backend API is running and accessible
