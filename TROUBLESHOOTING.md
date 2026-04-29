# Troubleshooting: Email Notifications & Admin Routes

## Issue 1: Email Notifications Not Sending

### Symptoms
- "Your message has been saved, but the email notification could not be sent"
- User doesn't receive confirmation email
- Admin doesn't receive notification email

### Root Causes

#### 1. SMTP Credentials Not Set
**Problem**: `SMTP_USER` or `SMTP_PASS` environment variables are missing

**Diagnosis**:
```bash
# Check Render environment variables
# Dashboard → Settings → Environment
# Look for: SMTP_USER, SMTP_PASS
```

**Solution**:
1. Go to Render Dashboard → Your Service → Environment
2. Add/verify these variables:
   - `SMTP_HOST`: `smtp.gmail.com`
   - `SMTP_PORT`: `587`
   - `SMTP_SECURE`: `true`
   - `SMTP_USER`: Your Gmail address
   - `SMTP_PASS`: Your Gmail app-specific password (NOT your regular password)

#### 2. Invalid Gmail App Password
**Problem**: Using regular Gmail password instead of app-specific password

**Solution**:
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Factor Authentication (if not enabled)
3. Go to [App passwords](https://myaccount.google.com/apppasswords)
4. Select "Mail" and "Windows Computer"
5. Generate new password (16 characters)
6. Use this 16-character password as `SMTP_PASS` in Render
7. **Important**: Remove spaces if any

#### 3. SMTP Connection Issues
**Problem**: Server can't connect to Gmail SMTP

**Diagnosis** (Check Render logs):
```
Error: SMTP connection timeout
Error: Invalid credentials
Error: Network unreachable
```

**Solution**:
- Verify network access (Render can reach Gmail)
- Check port 587 is not blocked (it should be open)
- Verify TLS/SSL settings:
  - Port: 587 (not 465)
  - Secure: `true`

#### 4. Company Notification Email Missing
**Problem**: `COMPANY_NOTIFICATION_EMAIL` not set

**Solution**:
1. Add to Render environment variables
2. Set to the email where you want notifications (usually same as SMTP_USER)

### Testing Email Locally

```bash
# Test email service in development
cd backend
npm run dev

# In your frontend, submit a contact form
# Check console logs for email debugging
```

### Testing Email on Render

1. Check Render logs:
   ```
   Dashboard → Services → nexyrasoft-backend → Logs
   ```

2. Look for:
   - ✓ "Email sent successfully to..."
   - ✗ "Email attempt failed..."
   - ✗ "CRITICAL: Contact email delivery failed"

3. Test endpoint directly:
   ```bash
   curl -X POST https://your-backend.onrender.com/api/contact \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "your-email@gmail.com",
       "phone": "+1234567890",
       "message": "This is a test message to verify email service."
     }'
   ```

### Email Service Improvements (Already Applied)

✅ **Retry Logic**: Attempts to send email up to 2 times with exponential backoff
✅ **Better Error Logging**: Clear error messages for debugging
✅ **Graceful Failure**: Message is saved in DB even if email fails
✅ **Transporter Reuse**: Creates transporter efficiently

---

## Issue 2: Admin Route Not Found in Vercel

### Symptoms
- Navigate to `/admin` → 404 error or blank page
- `/admin/login` works but subsequent navigation fails
- API calls to admin endpoints return 404

### Root Causes

#### 1. Incorrect API URL on Vercel
**Problem**: `VITE_API_URL` not set or points to wrong backend

**Diagnosis**:
1. Open DevTools (F12) → Console
2. Look for: `[API] GET https://...` 
3. Check if URL is correct

**Solution**:
1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Add/update `VITE_API_URL`:
   ```
   VITE_API_URL=https://nexyrasoft-backend-xxxxx.onrender.com/api
   ```
3. Replace `xxxxx` with your Render service ID
4. Redeploy on Vercel

#### 2. Backend Admin Routes Not Deployed
**Problem**: Backend deployed but admin routes missing

**Diagnosis**:
```bash
# Test backend admin endpoint directly
curl https://your-backend.onrender.com/api/dashboard \
  -H "Authorization: Bearer <your-jwt-token>"
```

Expected response:
- 200: Dashboard data (if authenticated)
- 401: Token missing/invalid
- 403: Not admin

If getting 404, route isn't deployed.

**Solution**:
1. Verify backend routes in `backend/src/routes/`
2. Check `backend/src/app.ts` has all routes registered
3. Rebuild backend on Render:
   ```bash
   # In Render Dashboard
   Services → nexyrasoft-backend → Manual Deploy
   ```

#### 3. Authentication Token Not Persisting
**Problem**: Token not saved or retrieved properly

**Diagnosis**:
1. Open DevTools → Application → Local Storage
2. Look for key: `nexyrasoft_token`
3. If not present after login, token isn't being saved

**Solution**:
1. Login should save token: `authService.saveToken(response.token)`
2. Check browser console for token save confirmation
3. Clear localStorage and try again:
   ```javascript
   // In DevTools console
   localStorage.removeItem('nexyrasoft_token');
   localStorage.clear(); // Clear all if needed
   ```

#### 4. CORS Blocking Admin API Calls
**Problem**: Frontend can call auth routes but not admin routes

**Diagnosis**:
1. Open DevTools → Network tab
2. Admin route request shows CORS error
3. Response headers missing `Access-Control-Allow-Origin`

**Solution**:
1. Verify backend CORS configuration in `src/app.ts`
2. Ensure `CLIENT_URL` environment variable is set to Vercel URL
3. Check CORS allows method (`GET`, `POST`, etc.)
4. Redeploy backend after CORS changes

### Admin Route Access Flow

```
1. User navigates to /admin/login
   ↓
2. User enters credentials
   ↓
3. POST /api/auth/login
   ↓ (Backend: requireAuth middleware not needed for login)
4. Response with JWT token
   ↓
5. Frontend saves token to localStorage
   ↓
6. User navigates to /admin
   ↓
7. ProtectedRoute checks for token
   ↓ (Token present? Continue : Redirect to login)
8. GET /api/dashboard
   ↓ (Backend: requireAuth + requireAdmin middleware)
9. Response or 401/403 error
```

### Testing Admin Routes

#### Test 1: Login Works
```bash
curl -X POST https://your-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "your-password"
  }'
```

Expected: `{ token: "...", user: {...}, message: "..." }`

#### Test 2: Dashboard Access (Admin Only)
```bash
curl https://your-backend.onrender.com/api/dashboard \
  -H "Authorization: Bearer <token-from-test-1>"
```

Expected: Dashboard data (200)
If 401: Token invalid
If 403: User not admin role

#### Test 3: Frontend API Debug
```javascript
// In DevTools console on Vercel
console.log(localStorage.getItem('nexyrasoft_token'));
// Should output token string, not null
```

### Debugging Checklist

- [ ] Check VITE_API_URL environment variable in Vercel
- [ ] Verify API_BASE_URL in browser console
- [ ] Check token is saved in localStorage after login
- [ ] Test admin API endpoint directly with curl
- [ ] Check backend logs for auth errors
- [ ] Verify CORS allows Vercel domain
- [ ] Clear browser cache and localStorage
- [ ] Check if token has expired (7-day expiry)
- [ ] Verify admin user role in database
- [ ] Check network tab for 401/403 responses

---

## Complete Fix Checklist

### Email Notifications
- [ ] Set `SMTP_USER` in Render (Gmail address)
- [ ] Set `SMTP_PASS` in Render (16-char app password, not regular password)
- [ ] Set `SMTP_HOST`: `smtp.gmail.com`
- [ ] Set `SMTP_PORT`: `587`
- [ ] Set `SMTP_SECURE`: `true`
- [ ] Set `COMPANY_NOTIFICATION_EMAIL` (where to receive admin notifications)
- [ ] Verify Gmail 2FA is enabled
- [ ] Test with curl command above
- [ ] Check Render logs for success messages

### Admin Routes
- [ ] Set `VITE_API_URL` in Vercel (include `/api` suffix)
- [ ] Verify backend URL in VITE_API_URL is correct
- [ ] Ensure admin user exists in database with role: "admin"
- [ ] Test login endpoint with curl
- [ ] Test dashboard endpoint with curl + token
- [ ] Check CORS allows GET, POST, PUT, DELETE methods
- [ ] Check CORS allows Vercel frontend URL
- [ ] Clear browser cache and localStorage
- [ ] Redeploy both frontend and backend

---

## Logs to Check

### Render Logs (Backend)
```
Services → nexyrasoft-backend → Logs
Look for:
- "Database connected successfully"
- "Server running on port 5000"
- "✓ Email sent successfully"
- Error messages about SMTP or database
```

### Vercel Logs (Frontend)
```
Deployments → [Latest Deployment] → Logs
Look for:
- Build errors
- Environment variable warnings
- "VITE_API_URL: https://..."
```

### Browser Console (DevTools)
```
F12 → Console tab
Look for:
- "[API] GET https://..."
- "API_BASE_URL: ..."
- "✓ Token saved"
- CORS errors
- 401/403 errors
```

---

## Quick Fixes

### Email Not Sending - Quick Fix
```
1. Copy your Gmail app password
2. Go to Render → Services → nexyrasoft-backend → Settings
3. Find SMTP_PASS variable
4. Paste app password (without spaces)
5. Save and redeploy
```

### Admin Route 404 - Quick Fix
```
1. Get your Render backend URL from dashboard
2. Go to Vercel → Project Settings → Environment
3. Set VITE_API_URL=https://your-backend-url.onrender.com/api
4. Redeploy on Vercel
5. Clear browser cache (Ctrl+Shift+Delete)
```

---

## References

- [Render Environment Variables](https://render.com/docs/environment-variables)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
- [Nodemailer SMTP Setup](https://nodemailer.com/smtp/)
- [CORS Errors](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors)
- [JWT Tokens in Browser](https://developer.mozilla.org/en-US/docs/Web/API/localStorage)

---

**Last Updated**: April 29, 2026
**Version**: 1.0.0
