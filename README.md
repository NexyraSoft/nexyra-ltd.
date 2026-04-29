<div align="center">
  <img width="1200" height="475" alt="NexyraSoft Banner" src="docs/assets/preloader_banner.png" />

  # NexyraSoft
  ### Premium Digital Solutions & Strategic IT Excellence

  [![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
  [![React](https://img.shields.io/badge/React-19.0.0-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.14-06B6D4?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Three.js](https://img.shields.io/badge/Three.js-0.183.2-000000?logo=three.js&logoColor=white)](https://threejs.org/)
  [![Express](https://img.shields.io/badge/Express-4.21.2-000000?logo=express&logoColor=white)](https://expressjs.com/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-8.13.2-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
</div>

---

## 🚀 Overview

**NexyraSoft** is a state-of-the-art digital presence for a premium IT solutions provider. Built with a focus on immersive user experience and robust enterprise architecture, it seamlessly integrates high-performance 3D visuals with a powerful Node.js/Express backend.

This platform serves as both a high-conversion marketing engine (capturing leads and showcasing case studies) and a comprehensive operational dashboard for managing content, careers, and user interactions.

## ✨ Key Features

- **🎨 Immersive UI/UX**: Built with React 19 and Tailwind CSS 4, featuring smooth Framer Motion animations and premium aesthetics.
- **🌐 3D Visual Experience**: Integrated Three.js and React Three Fiber for dynamic, interactive background geometries.
- **🔒 Secure Architecture**: Robust JWT-based authentication with role-based access control for the administrative dashboard.
- **📊 CRM-Ready Backend**: Automated lead capture system that stores submissions in MongoDB and triggers real-time email notifications via SMTP.
- **🏢 Managed Career Portal**: Dynamic vacancy management system allowing admins to post and manage job opportunities.
- **💬 Real-time Engagement**: Integrated chatbox and consultation booking system to drive client acquisition.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS 4, Shadcn UI
- **Animations**: Motion (Framer Motion)
- **3D Graphics**: Three.js, React Three Fiber, React Three Drei
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js (TypeScript)
- **Database**: MongoDB (Mongoose ODM)
- **Security**: JWT (JSON Web Tokens), Bcrypt.js
- **Communications**: Nodemailer (SMTP Integration)

## 🛠️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local instance or Atlas URI)

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/NexyraSoft/nexyrasoft.git
   cd nexyrasoft
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the `backend/` directory based on `.env.example`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/nexyrasoft
   JWT_SECRET=your_super_secret_key
   # ... add SMTP settings for email functionality
   ```

4. **Run the application:**
   
   From the root directory:
   ```bash
   npm run dev
   ```

## � Deployment

This project is optimized for deployment across multiple platforms:

- **Frontend**: Deployed on [Vercel](https://vercel.com)
- **Backend**: Deployed on [Render](https://render.com)
- **Database**: MongoDB Atlas

### Quick Start Deployment

1. **Backend on Render:**
   - See [DEPLOYMENT.md](DEPLOYMENT.md#part-1-backend-deployment-on-render) for detailed instructions
   - Key: Connect your GitHub repo, set environment variables, and deploy

2. **Frontend on Vercel:**
   - See [DEPLOYMENT.md](DEPLOYMENT.md#part-2-frontend-deployment-on-vercel) for detailed instructions
   - Key: Set `VITE_API_URL` to your Render backend URL

3. **Database on MongoDB Atlas:**
   - See [DEPLOYMENT.md](DEPLOYMENT.md#part-3-database-configuration-mongodb-atlas) for setup

For comprehensive deployment guide including troubleshooting, see [DEPLOYMENT.md](DEPLOYMENT.md).

## 📁 Project Structure

```text
nexyrasoft/
├── frontend/             # React application (Vite)
│   ├── src/              # UI source code
│   ├── public/           # Static assets
│   ├── .env.development  # Dev environment variables
│   ├── .env.production   # Prod environment variables
│   ├── index.html        # Entry point
│   └── vite.config.js    # Vite configuration
├── backend/              # Node.js Express API
│   ├── src/              # Server source code
│   │   ├── config/       # Configuration files
│   │   ├── controllers/  # Route controllers
│   │   ├── models/       # MongoDB schemas
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   └── middleware/   # Express middleware
│   └── package.json      # Backend dependencies
├── vercel.json           # Vercel deployment config
├── render.yaml           # Render deployment config
├── DEPLOYMENT.md         # Full deployment guide
└── package.json          # Root workspace manager
```

## 🔧 Available Scripts

### Root Level
```bash
npm run dev              # Start both frontend and backend in dev mode
npm run build            # Build both frontend and backend
npm run build:frontend   # Build frontend only
npm run build:backend    # Build backend only
npm run start            # Start backend production server
```

### Frontend
```bash
npm run dev -w frontend      # Start frontend dev server (port 3000)
npm run build -w frontend    # Build for production
npm run preview -w frontend  # Preview production build
```

### Backend
```bash
npm run dev -w backend       # Start backend with hot reload (port 5000)
npm run build -w backend     # Compile TypeScript
npm run start -w backend     # Run production server
```

## ⚡ Build Optimization

The frontend is optimized for fast loading and minimal bundle size:

- **Code Splitting**: Heavy dependencies (Three.js, React Three Fiber) are split into separate chunks
- **Lazy Loading**: Routes and components load on-demand to reduce initial bundle size
- **Minification**: Terser compression removes unused code and console logs
- **Manual Chunking**: Vendor, UI, and feature-specific chunks for optimal caching

### View Bundle Size Analysis
```bash
npm install -D vite-plugin-visualizer
# Then add to vite.config.js and run build to see breakdown
```

For detailed optimization information, see [frontend/BUILD_OPTIMIZATION.md](frontend/BUILD_OPTIMIZATION.md)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  Built with ❤️ by <b>NexyraSoft Team</b>
</div>
