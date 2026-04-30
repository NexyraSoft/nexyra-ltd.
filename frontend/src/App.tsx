/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { Footer } from "./components/layout/Footer";
import { Navbar } from "./components/layout/Navbar";
import { About } from "./components/sections/About";
import { Careers } from "./components/sections/Careers";
import { Contact } from "./components/sections/Contact";
import { Hero } from "./components/sections/Hero";
import { Privacy } from "./components/sections/Privacy";
import { Process } from "./components/sections/Process";
import { Services } from "./components/sections/Services";
import { Terms } from "./components/sections/Terms";
import Background3D from "./components/ui/Background3D";
import { Chatbot } from "./components/ui/Chatbot";
import { GetStartedModal } from "./components/ui/GetStartedModal";
import { Preloader } from "./components/ui/Preloader";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { PublicRoute } from "./components/layout/PublicRoute";

// Lazy load heavy components
const ServiceDetail = lazy(() => import("./components/sections/ServiceDetail").then(module => ({ default: module.ServiceDetail })));
const Tools = lazy(() => import("./components/sections/Tools").then(module => ({ default: module.Tools })));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  return null;
};

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-maroon-900"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);

const Home = ({ onGetStartedClick }: { onGetStartedClick: () => void }) => (
  <>
    <Hero onGetStartedClick={onGetStartedClick} />
    <Services />
    <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse" />}>
      <Tools />
    </Suspense>
    <About />
    <Process />
    <Contact />
  </>
);

const AppContent = () => {
  const [isGetStartedModalOpen, setIsGetStartedModalOpen] = useState(false);
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");

  return (
    <div className="font-sans relative min-h-screen selection:bg-maroon-900 selection:text-white">
      {!isAdminPath && (
        <>
          <Preloader />
          <Background3D />
          <Navbar onGetStartedClick={() => setIsGetStartedModalOpen(true)} />
        </>
      )}
      <main className={!isAdminPath ? "relative z-10" : ""}>
        <Routes>
          <Route path="/" element={<Home onGetStartedClick={() => setIsGetStartedModalOpen(true)} />} />
          <Route 
            path="/services/:slug" 
            element={
              <Suspense fallback={<LoadingFallback />}>
                <ServiceDetail />
              </Suspense>
            } 
          />
          <Route path="/careers" element={<Careers />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route 
            path="/admin/login" 
            element={
              <PublicRoute>
                <Suspense fallback={<LoadingFallback />}>
                  <AdminLogin />
                </Suspense>
              </PublicRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingFallback />}>
                  <AdminDashboard />
                </Suspense>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      {!isAdminPath && (
        <>
          <GetStartedModal isOpen={isGetStartedModalOpen} onClose={() => setIsGetStartedModalOpen(false)} />
          <Footer />
          <Chatbot />
        </>
      )}
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}
