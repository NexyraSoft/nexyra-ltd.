import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "../../constants/siteData";
import { Logo } from "../ui/Logo";

interface NavbarProps {
  onGetStartedClick: () => void;
}

export const Navbar = ({ onGetStartedClick }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href === "/careers") {
      e.preventDefault();
      navigate(href);
      setIsMenuOpen(false);
      return;
    }

    if (location.pathname !== "/") {
      if (href.startsWith("#")) {
        e.preventDefault();
        navigate("/", { state: { scrollTo: href } });
        setIsMenuOpen(false);
      }
    }
  };

  useEffect(() => {
    if (location.pathname === "/" && location.state && (location.state as any).scrollTo) {
      const targetId = (location.state as any).scrollTo.replace("#", "");
      const element = document.getElementById(targetId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
          navigate("/", { replace: true, state: {} });
        }, 100);
      }
    }
  }, [location, navigate]);

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled || location.pathname !== "/" ? "glass py-4 shadow-sm" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4 md:px-10 flex justify-between items-center">
        <Link 
          to="/" 
          onClick={(e) => {
            e.preventDefault();
            window.location.href = "/";
          }}
          className="flex items-center gap-2 shrink-0"
        >
          <Logo className="w-10 h-10 text-maroon-800" />
          <span className="flex flex-col leading-none">
            <span className="text-2xl font-display font-bold tracking-tighter text-slate-900">
              Nexyra<span className="text-maroon-800">Soft</span>
            </span>
            <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              The Future of Software
            </span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6 lg:gap-10 ml-8 lg:ml-12 border-l border-black/5 pl-8 lg:pl-12">
          {NAV_LINKS.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              onClick={(e) => handleLinkClick(e, link.href)}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              {link.name}
            </a>
          ))}
          <button 
            onClick={onGetStartedClick}
            className="px-5 py-2 rounded-full bg-maroon-900 hover:bg-maroon-800 text-white text-sm font-semibold transition-all shadow-lg shadow-maroon-900/20"
          >
            Get Started
          </button>
        </div>

        <button 
          className="md:hidden text-slate-900"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-black/10 overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-3">
              {NAV_LINKS.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={(e) => {
                    handleLinkClick(e, link.href);
                    if (link.href !== "#career") setIsMenuOpen(false);
                  }}
                  className="text-sm font-medium text-slate-700 hover:text-slate-900"
                >
                  {link.name}
                </a>
              ))}
              <button 
                onClick={() => {
                  onGetStartedClick();
                  setIsMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-maroon-900 text-white text-xs font-semibold"
              >
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
