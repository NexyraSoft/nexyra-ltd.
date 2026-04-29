# NexyraSoft Deployment Checklist

## Pre-Deployment
- [ ] Review [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions
- [ ] Have all credentials ready:
  - [ ] MongoDB Atlas connection string
  - [ ] Gmail SMTP app-specific password (if using Gmail)
  - [ ] JWT secret (generate random 32+ character string)

## Backend - Render Setup

### Phase 1: Repository Connection
- [ ] Create Render account at https://render.com
- [ ] Connect GitHub repository
- [ ] Select `main` branch

### Phase 2: Service Configuration
- [ ] Service name: `nexyrasoft-backend`
- [ ] Runtime: Node
- [ ] Plan: Starter (free) or Professional
- [ ] Region: Select closest to your users

### Phase 3: Build & Deploy Configuration
- [ ] Build Command: `npm ci && npm run build -w backend`
- [ ] Start Command: `npm run start -w backend`
- [ ] Health Check Path: `/api/health`

### Phase 4: Environment Variables (CRITICAL)
Set these in Render Dashboard → Environment:
```
NODE_ENV=production
MONGODB_URI=<your-mongodb-atlas-connection-string>
JWT_SECRET=<your-random-secret-32-chars>
CLIENT_URL=https://nexyra-ltd-frontend.vercel.app
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=true
SMTP_USER=<your-email@gmail.com>
SMTP_PASS=<your-gmail-app-password>
SMTP_FROM_NAME=NexyraSoft
COMPANY_NOTIFICATION_EMAIL=<your-email@gmail.com>
```

### Phase 5: Deploy & Verify
- [ ] Click "Create Web Service"
- [ ] Monitor deployment logs
- [ ] Copy backend URL when ready: `https://nexyrasoft-backend-xxxxx.onrender.com`
- [ ] Test health endpoint: `https://your-backend-url/api/health`

---

## Frontend - Vercel Setup

### Phase 1: Repository Connection
- [ ] Create Vercel account at https://vercel.com
- [ ] Import GitHub repository

### Phase 2: Project Configuration
- [ ] Framework: Vite
- [ ] Build Command: `npm run build:frontend`
- [ ] Output Directory: `frontend/dist`
- [ ] Install Command: `npm ci`
- [ ] Root Directory: `.` (empty)

### Phase 3: Environment Variables
Set this in Vercel Project Settings → Environment Variables:
```
VITE_API_URL=https://nexyrasoft-backend-xxxxx.onrender.com/api
```
Replace `xxxxx` with your actual Render backend deployment ID.

### Phase 4: Deploy & Verify
- [ ] Click "Deploy"
- [ ] Monitor build logs
- [ ] Verify deployment at: `https://nexyra-ltd-frontend.vercel.app`
- [ ] Test API connectivity from frontend

---

## MongoDB Atlas Setup

### Phase 1: Create Account & Cluster
- [ ] Create account at https://www.mongodb.com/cloud/atlas
- [ ] Create new cluster (free M0 tier)
- [ ] Note: May take 5-10 minutes to provision

### Phase 2: Network & Security
- [ ] Go to Network Access
- [ ] Add IP Address: `0.0.0.0/0` (allow all for development)
- [ ] Create Database User with strong password
- [ ] Remember: User ≠ Cluster username

### Phase 3: Get Connection String
- [ ] Cluster → Connect → Connect your application
- [ ] Copy connection string
- [ ] Replace `<username>` and `<password>` with your credentials
- [ ] Use as `MONGODB_URI` in Render

---

## Post-Deployment Testing

### Verify Backend (Render)
```bash
# Health check
curl https://your-backend-url/api/health

# CORS headers
curl -H "Origin: https://nexyra-ltd-frontend.vercel.app" \
  https://your-backend-url/api/health -v

# Test authentication (if available)
curl -X POST https://your-backend-url/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'
```

### Verify Frontend (Vercel)
- [ ] Load https://nexyra-ltd-frontend.vercel.app
- [ ] Open DevTools → Network tab
- [ ] Verify API calls go to Render URL (not localhost)
- [ ] Check Console for any errors
- [ ] Test user interactions (forms, auth, etc.)

### Verify Email Service
- [ ] Test contact form submission
- [ ] Check email received at `COMPANY_NOTIFICATION_EMAIL`
- [ ] Check email received at user's email (if applicable)

---

## Common Issues & Fixes

### CORS Error on Frontend
**Problem**: `Access-Control-Allow-Origin` missing
**Solution**: 
1. Verify `CLIENT_URL` is set correctly in Render
2. Check frontend URL matches exactly (including protocol)
3. Redeploy backend

### 502 Bad Gateway from Render
**Problem**: Backend not responding
**Solution**:
1. Check Render logs for startup errors
2. Verify MongoDB connection string
3. Verify health endpoint: `https://your-url/api/health`
4. Check all required environment variables are set

### Vite API URL Returns 404
**Problem**: Frontend can't find API
**Solution**:
1. Verify `VITE_API_URL` is set in Vercel
2. Check it includes `/api` suffix
3. Redeploy frontend

### Database Connection Timeout
**Problem**: Can't connect to MongoDB
**Solution**:
1. Verify connection string format
2. Check MongoDB credentials
3. Whitelist Render's IP (or use 0.0.0.0/0 temporarily)
4. Verify database user has correct role

---

## Maintenance & Monitoring

### Weekly
- [ ] Check Render logs for errors
- [ ] Monitor API response times
- [ ] Review email delivery

### Monthly
- [ ] Review Vercel analytics
- [ ] Check MongoDB storage usage
- [ ] Update dependencies (if needed)
- [ ] Backup MongoDB data

### Quarterly
- [ ] Security audit
- [ ] Performance optimization review
- [ ] Update documentation

---

## Quick Reference URLs

| Service | URL | Status |
|---------|-----|--------|
| Backend API | https://nexyrasoft-backend-xxxxx.onrender.com | [Health Check](#) |
| Frontend | https://nexyra-ltd-frontend.vercel.app | [Visit](#) |
| MongoDB Atlas | https://cloud.mongodb.com | [Dashboard](#) |
| Render Dashboard | https://dashboard.render.com | [Access](#) |
| Vercel Dashboard | https://vercel.com/dashboard | [Access](#) |

---

## Support & Help

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Docs**: https://docs.mongodb.com
- **Express.js Docs**: https://expressjs.com

---

**Last Updated**: April 2026
**Version**: 1.0.0
