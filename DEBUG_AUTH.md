# Authentication Debug Guide

## Changes Made

1. **Flexible Response Handling** - Now handles both nested and direct response structures
2. **Detailed Console Logging** - Added console logs at every step to track the auth flow
3. **Alternative Field Names** - Supports both camelCase and snake_case (accessToken/access_token)
4. **Better Error Messages** - More descriptive error logging with full context

## How to Debug

### 1. Open Browser Console
Press F12 or right-click → Inspect → Console tab

### 2. Attempt Login
You should see these logs in order:
- `Attempting login with: { identifier: "..." }`
- `Login response received: { ... }` ← Check this to see your actual backend response
- `Parsed auth data: { hasAccessToken: true, hasRefreshToken: true, hasUser: true }`
- `Tokens stored, setting admin state`
- `Login successful, admin state updated`
- `Form submission started`
- `Login successful, navigating to dashboard`
- `ProtectedRoute check: { isAuthenticated: true, loading: false, hasAdmin: true }`
- `Authenticated, rendering protected content`

### 3. If Login Fails
Check the console for:
- `Login error details:` - Shows the exact error from backend
- Network tab (F12 → Network) - Check the actual HTTP response

## Common Issues & Fixes

### Issue: Response structure doesn't match
**Solution:** The code now handles multiple formats:
- `response.accessToken` OR `response.access_token`
- `response.data.accessToken` OR direct `response.accessToken`
- `response.user` OR the response itself as user object

### Issue: Redirect not working
**Solution:** Added 100ms delay and `replace: true` to ensure state updates before navigation

### Issue: ProtectedRoute blocking access
**Solution:** Added detailed logging to see exact auth state during route protection

## Backend Response Expected Formats

The code now supports any of these formats:

### Format 1 (Nested):
```json
{
  "data": {
    "accessToken": "...",
    "refreshToken": "...",
    "user": { ... }
  }
}
```

### Format 2 (Direct):
```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "user": { ... }
}
```

### Format 3 (Snake Case):
```json
{
  "access_token": "...",
  "refresh_token": "...",
  "user": { ... }
}
```

### Format 4 (User as root):
```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "id": "...",
  "email": "...",
  "firstName": "...",
  ...
}
```

## Next Steps

If you still see issues after these changes:
1. Share the exact console logs from a failed login attempt
2. Share the Network tab response from the login API call
3. Check localStorage (Application tab → Local Storage) to verify tokens are stored
