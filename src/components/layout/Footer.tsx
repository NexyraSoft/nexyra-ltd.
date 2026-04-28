import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { NAV_LINKS, SERVICES } from "../../constants/siteData";
import { Logo } from "../ui/Logo";
import {
  Facebook,
  Linkedin,
  Mail,
  MessageSquare,
  MapPin,
  Phone,
  Navigation,
  Building2,
  Headphones,
  FileText,
  Shield,
  Briefcase
} from "lucide-react";

export const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("/")) {
      e.preventDefault();
      navigate(href);
      window.scrollTo(0, 0);
      return;
    }
    if (location.pathname !== "/" && href.startsWith("#")) {
      e.preventDefault();
      navigate("/", { state: { scrollTo: href } });
    }
  };

  return (
    <footer className="bg-maroon-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link
              to="/"
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="inline-flex items-center gap-3 mb-6 group"
            >
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Logo className="w-8 h-8 text-maroon-900" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-display font-bold tracking-tight">NexyraSoft</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-maroon-100/80">The Future of Software</span>
              </div>
            </Link>
            <p className="text-maroon-100/80 mb-8 max-w-sm leading-relaxed">
              Revolutionizing the Future: Unleashing the Power of Innovation and AI with NexyraSoft.
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Facebook, href: "#" },
                { Icon: Linkedin, href: "https://www.linkedin.com/in/nexyrasoft/" },
                { Icon: Mail, href: "mailto:nexyrasoft@gmail.com" },
                { Icon: MessageSquare, href: "#" }
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-maroon-900 transition-all border border-white/10"
                >
                  <social.Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6 text-maroon-100">
              <Navigation className="w-5 h-5" />
              <h3 className="font-bold text-lg">Navigation</h3>
            </div>
            <ul className="space-y-4">
              {[
                { name: "Home", href: "#home" },
                { name: "Services", href: "#services" },
                { name: "Company", href: "#about" },
                { name: "Blog", href: "#" }
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="text-maroon-100/70 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-white transition-colors" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6 text-maroon-100">
              <Building2 className="w-5 h-5" />
              <h3 className="font-bold text-lg">Company</h3>
            </div>
            <ul className="space-y-4">
              {[
                { name: "Terms & Conditions", href: "/terms", Icon: FileText },
                { name: "Privacy Policy", href: "/privacy", Icon: Shield },
                { name: "Career", href: "/careers", Icon: Briefcase }
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-maroon-100/70 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <link.Icon className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us Column */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2 mb-6 text-maroon-100">
              <Headphones className="w-5 h-5" />
              <h3 className="font-bold text-lg">Contact Us</h3>
            </div>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm mb-1">Virtual Office</div>
                  <p className="text-sm text-maroon-100/70 leading-relaxed">
                    Road 05, Block M, Bashundhara r/a, Dhaka 1229, Bangladesh
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <a href="mailto:nexyrasoft@gmail.com" className="text-sm text-maroon-100/70 hover:text-white transition-colors">
                    nexyrasoft@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <a href="tel:+8801612287424" className="text-sm text-maroon-100/70 hover:text-white transition-colors">
                    +880 1612-287424
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-maroon-100/50">
            © {new Date().getFullYear()} <span className="text-white font-bold">NexyraSoft</span>. All rights reserved.
          </div>
          <div className="flex items-center gap-2 text-sm text-maroon-100/50">
            <span>Made with</span>
            <div className="w-2 h-2 bg-accent-purple rounded-full animate-pulse" />
            <span>for the future</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
