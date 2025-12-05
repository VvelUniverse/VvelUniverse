# Google OAuth Setup Guide

## Fixing "redirect_uri_mismatch" Error

This error occurs when the redirect URI in your Google Cloud Console doesn't match the one your application is using.

## Step-by-Step Fix

### 1. Determine Your Callback URL

**For Development (Localhost):**
```
http://localhost:3000/api/auth/google/callback
```
(Replace `3000` with your actual port if different)

**For Production:**
```
https://yourdomain.com/api/auth/google/callback
```
(Replace `yourdomain.com` with your actual domain)

### 2. Update Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** > **Credentials**
4. Click on your OAuth 2.0 Client ID
5. Under **Authorized redirect URIs**, add:
   - For development: `http://localhost:3000/api/auth/google/callback`
   - For production: `https://yourdomain.com/api/auth/google/callback`
6. **Important:** Add BOTH if you're testing locally and deploying
7. Click **Save**

### 3. Verify Your Environment Variables

Make sure your `.env` file has:
```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 4. Common Issues

**Issue:** Still getting redirect_uri_mismatch
- **Solution:** Make sure the redirect URI in Google Console matches EXACTLY (including http/https, port, and path)
- Check for trailing slashes - they must match exactly
- Wait a few minutes after saving - Google may take time to update

**Issue:** Works locally but not in production
- **Solution:** Add your production URL to Authorized redirect URIs in Google Console
- Make sure `NODE_ENV=production` is set in production
- Verify `FRONTEND_URL` or `RAILWAY_PUBLIC_DOMAIN` is set correctly

**Issue:** Port mismatch
- **Solution:** If your app runs on port 3001, use `http://localhost:3001/api/auth/google/callback`
- Update the `PORT` in your `.env` file

### 5. Testing

1. Restart your server after making changes
2. Try logging in with Google
3. If it still fails, check the exact error message - it will show what redirect URI Google received

### 6. Quick Checklist

- [ ] Redirect URI added in Google Cloud Console
- [ ] Redirect URI matches exactly (including protocol, domain, port, path)
- [ ] Environment variables set correctly
- [ ] Server restarted after changes
- [ ] OAuth consent screen configured (if required)

## Example Redirect URIs

**Development:**
```
http://localhost:3000/api/auth/google/callback
http://127.0.0.1:3000/api/auth/google/callback
```

**Production:**
```
https://yourdomain.com/api/auth/google/callback
https://www.yourdomain.com/api/auth/google/callback
```

**Note:** Add all variations you might use!







