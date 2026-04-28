# Backend setup

## Folder structure

```text
server/
  src/
    app.ts
    index.ts
    config/
      db.ts
      env.ts
    controllers/
      authController.ts
      contactController.ts
      dashboardController.ts
    middleware/
      auth.ts
      errorHandler.ts
    models/
      ContactMessage.ts
      Lead.ts
      User.ts
    routes/
      authRoutes.ts
      contactRoutes.ts
      dashboardRoutes.ts
    types/
      express.d.ts
src/
  lib/
    api.ts
    auth.ts
    forms.ts
```

## API routes

- `POST /api/auth/signup` creates a user and returns a JWT.
- `POST /api/auth/login` logs a user in and returns a JWT.
- `GET /api/auth/me` returns the logged-in user when `Authorization: Bearer <token>` is present.
- `GET /api/dashboard` returns protected dashboard stats and recent submissions.
- `GET /api/contact` returns saved contact form submissions and requires JWT auth.
- `POST /api/contact` stores the contact form submission.
- `POST /api/leads/get-started` stores the "Discover More" modal form.
- `POST /api/leads/service-request` stores the service request modal form.
- `GET /api/health` is a quick health-check endpoint.

## Environment variables

Add these values to your `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/nexyrasoft
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:3000
VITE_API_URL=http://localhost:5000/api
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=nexyrasoft@gmail.com
SMTP_PASS=your-gmail-app-password
SMTP_FROM_NAME=NexyraSoft
COMPANY_NOTIFICATION_EMAIL=nexyrasoft@gmail.com
```

## Install and run

```bash
npm install
npm run server:dev
```

Run the frontend in another terminal:

```bash
npm run dev
```

## Frontend connection

The frontend now uses shared helpers:

- `src/lib/api.ts` sends requests to `VITE_API_URL`.
- `src/lib/auth.ts` handles signup, login, JWT storage, and fetching the current user.
- `src/lib/forms.ts` sends the contact and lead forms, plus requests dashboard data.

Examples:

```ts
import { authService } from "./lib/auth";

const result = await authService.login({
  email: "demo@example.com",
  password: "secret123",
});

authService.saveToken(result.token);
```

```ts
import { formService } from "./lib/forms";
import { authService } from "./lib/auth";

const token = authService.getToken();

if (token) {
  const dashboard = await formService.getDashboard(token);
  console.log(dashboard);
}
```

## Notes

- The existing `Contact`, `GetStartedModal`, and `GetServiceModal` forms are already wired to the new backend routes.
- `POST /api/contact` now saves the message in MongoDB, sends an auto-reply to the visitor, and sends a notification email to `nexyrasoft@gmail.com`.
- `POST /api/leads/get-started` now saves the request in MongoDB, sends an auto-reply to the visitor, and sends a notification email to `nexyrasoft@gmail.com`.
- `POST /api/leads/service-request` now saves the request in MongoDB, sends an auto-reply to the visitor, and sends a notification email to `nexyrasoft@gmail.com`.
- Signup/login and a dashboard UI are not present in the current frontend, but the backend endpoints and frontend helper functions are ready for those pages.
