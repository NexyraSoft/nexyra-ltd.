# NexyraSoft Full-Stack Deployment Guide

This guide covers deploying the NexyraSoft application with:
- **Backend**: Render
- **Frontend**: Vercel
- **Database**: MongoDB Atlas

---

## Part 1: Backend Deployment on Render

### 1.1 Prerequisites
- Render account (render.com)
- MongoDB Atlas connection string
- SMTP credentials (Gmail or other provider)
- GitHub repository connected to Render

### 1.2 Connect Repository to Render
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select this repository and `main` branch

### 1.3 Configure Render Service
1. **Name**: `nexyrasoft-backend`
2. **Runtime**: Node
3. **Plan**: Starter (free tier) or Professional
4. **Build Command**: `npm ci && npm run build -w backend`
5. **Start Command**: `npm run start -w backend`
6. **Health Check Path**: `/api/health`

### 1.4 Set Environment Variables in Render Dashboard

Go to **Environment** section and add:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nexyrasoft
JWT_SECRET=your-long-random-secret-here-min-32-chars
CLIENT_URL=https://nexyra-ltd-frontend.vercel.app
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=true
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password
SMTP_FROM_NAME=NexyraSoft
COMPANY_NOTIFICATION_EMAIL=your-email@gmail.com
```

### 1.5 Deploy
1. Click "Create Web Service"
2. Monitor the logs - Render will auto-build and deploy
3. Your backend will be available at: `https://nexyrasoft-backend-xxxxx.onrender.com`

### 1.6 Post-Deployment Steps
1. Copy your backend URL (e.g., `https://nexyrasoft-backend-xxxxx.onrender.com`)
2. Add `/api` when needed in frontend configuration
3. Test the health check: `https://your-backend-url.onrender.com/api/health`

---

## Part 2: Frontend Deployment on Vercel

### 2.1 Prerequisites
- Vercel account (vercel.com)
- GitHub repository
- Backend URL from Render deployment

### 2.2 Connect Repository to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Select the repository

### 2.3 Configure Project Settings
1. **Framework Preset**: Vite
2. **Build Command**: `npm run build:frontend`
3. **Output Directory**: `frontend/dist`
4. **Install Command**: `npm ci`

### 2.4 Set Environment Variables
In the **Environment Variables** section:

```
VITE_API_URL=https://nexyrasoft-backend-xxxxx.onrender.com/api
```

Replace `xxxxx` with your actual Render backend URL.

### 2.5 Deploy
1. Click "Deploy"
2. Vercel will build and deploy automatically
3. Your frontend will be available at: `https://nexyra-ltd-frontend.vercel.app`

---

## Part 3: Database Configuration (MongoDB Atlas)

### 3.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new project

### 3.2 Create Cluster
1. Click "Create" for a new cluster
2. Select the free tier (M0)
3. Choose your region
4. Click "Create Cluster"

### 3.3 Get Connection String
1. Click "Connect"
2. Select "Connect your application"
3. Choose Node.js driver
4. Copy the connection string
5. Replace `<username>` and `<password>` with your credentials
6. Use this as `MONGODB_URI` in Render

### 3.4 Allow Render IP
1. In MongoDB Atlas, go to "Network Access"
2. Click "Add IP Address"
3. Select "Allow access from anywhere" (0.0.0.0/0) for development
4. In production, add Render's static IP if available

---

## Part 4: SMTP Configuration (Gmail)

### 4.1 Enable 2-Factor Authentication
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Factor Authentication if not already enabled

### 4.2 Generate App-Specific Password
1. Go to [App passwords](https://myaccount.google.com/apppasswords)
2. Select "Mail" and "Windows Computer"
3. Generate and copy the 16-character password
4. Use this as `SMTP_PASS` in Render

---

## Part 5: Verification Checklist

### Backend (Render)
- [ ] Environment variables are set in Render Dashboard
- [ ] Health check endpoint works: `https://your-backend-url/api/health`
- [ ] Database connection successful (check logs)
- [ ] CORS is configured for Vercel frontend URL
- [ ] Email service is configured and tested

### Frontend (Vercel)
- [ ] Environment variables are set in Vercel Project
- [ ] Build completes successfully
- [ ] API calls reach the correct backend URL
- [ ] Authentication flow works
- [ ] No console errors related to CORS or API

### Test API Endpoints
```bash
# Health check
curl https://your-backend-url/api/health

# Test CORS
curl -H "Origin: https://your-frontend-url" https://your-backend-url/api/health
```

---

## Part 6: Troubleshooting

### CORS Error: "Access-Control-Allow-Origin"
- **Cause**: Frontend URL not in CORS whitelist
- **Fix**: Update `CLIENT_URL` in Render environment variables
- **Code**: Updated in `src/app.ts` to dynamically allow development and production origins

### "Cannot find module" during build
- **Cause**: Dependencies not installed
- **Fix**: Clear cache in Vercel/Render dashboard and redeploy
- Ensure `npm ci` is used instead of `npm install`

### API Returns 404
- **Cause**: Incorrect endpoint URL
- **Fix**: Verify `VITE_API_URL` includes `/api` suffix
- Test with: `curl https://your-backend-url/api/health`

### Database Connection Fails
- **Cause**: Wrong connection string or IP not whitelisted
- **Fix**: 
  - Verify `MONGODB_URI` is correct
  - Add Render's IP in MongoDB Atlas Network Access
  - Check database user has correct permissions

### Email Not Sending
- **Cause**: SMTP credentials incorrect or app password not generated
- **Fix**:
  - Generate new app password in Google Account
  - Verify SMTP settings match Gmail IMAP setup
  - Check `COMPANY_NOTIFICATION_EMAIL` is valid

### Health Check Fails
- **Cause**: Server not responding
- **Fix**:
  - Check Render logs for startup errors
  - Verify database connection is successful
  - Ensure PORT is not hardcoded (use dynamic assignment)

---

## Part 7: Deployment Updates & Redeployment

### Redeploy Backend
1. Push changes to GitHub main branch
2. Render will automatically rebuild and deploy

### Redeploy Frontend
1. Push changes to GitHub main branch
2. Vercel will automatically rebuild and deploy

### Update Environment Variables
1. Update in Render/Vercel Dashboard
2. Trigger a redeploy for changes to take effect

---

## Part 8: Production Best Practices

1. **Secrets Management**
   - Never commit `.env` files
   - Always use platform environment variables (Render/Vercel)
   - Rotate `JWT_SECRET` periodically

2. **Monitoring**
   - Enable error tracking (Sentry recommended)
   - Monitor health check endpoint regularly
   - Set up alerts for downtime

3. **Database Backups**
   - Enable automatic backups in MongoDB Atlas
   - Test restore procedures regularly

4. **Performance**
   - Monitor build times in Vercel
   - Use Render's performance metrics
   - Consider upgrading plan if needed

5. **Security**
   - Keep dependencies updated
   - Regular security audits
   - Use HTTPS only (automatic with Vercel/Render)

---

## Useful Links

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [Express.js CORS](https://expressjs.com/en/resources/middleware/cors.html)
- [Node.js Environment Variables](https://nodejs.org/en/knowledge/file-system/security/introduction/)

```

Enjoy your deployed NexyraSoft backend! 🚀
