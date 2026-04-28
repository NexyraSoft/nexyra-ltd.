/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { Footer } from "./components/layout/Footer";
import { Navbar } from "./components/layout/Navbar";
import { About } from "./components/sections/About";
import { Careers } from "./components/sections/Careers";
import { Contact } from "./components/sections/Contact";
import { Hero } from "./components/sections/Hero";
import { Privacy } from "./components/sections/Privacy";
import { Process } from "./components/sections/Process";
import { ServiceDetail } from "./components/sections/ServiceDetail";
import { Services } from "./components/sections/Services";
import { Terms } from "./components/sections/Terms";
import { Tools } from "./components/sections/Tools";
import Background3D from "./components/ui/Background3D";
import { Chatbot } from "./components/ui/Chatbot";
import { GetStartedModal } from "./components/ui/GetStartedModal";
import { Preloader } from "./components/ui/Preloader";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";

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

const Home = ({ onGetStartedClick }: { onGetStartedClick: () => void }) => (
  <>
    <Hero onGetStartedClick={onGetStartedClick} />
    <Services />
    <Tools />
    <About />
    <Process />
    <Contact />
  </>
);

export default function App() {
  const [isGetStartedModalOpen, setIsGetStartedModalOpen] = useState(false);

  return (
    <Router>
      <ScrollToTop />
      <div className="font-sans relative min-h-screen selection:bg-maroon-900 selection:text-white">
        <Preloader />
        <Background3D />
        <Navbar onGetStartedClick={() => setIsGetStartedModalOpen(true)} />
        <main className="relative z-10">
          <Routes>
            <Route path="/" element={<Home onGetStartedClick={() => setIsGetStartedModalOpen(true)} />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          </Routes>
        </main>
        <GetStartedModal isOpen={isGetStartedModalOpen} onClose={() => setIsGetStartedModalOpen(false)} />
        <Footer />
        <Chatbot />
      </div>
    </Router>
  );
}
