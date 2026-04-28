import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, CheckCircle2, ArrowRight } from "lucide-react";
import { SERVICES } from "../../constants/siteData";
import { GetServiceModal } from "../ui/GetServiceModal";

export const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const service = SERVICES.find((s) => s.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!service) {
      navigate("/");
    }
  }, [service, navigate]);

  if (!service) return null;

  const Icon = service.icon;

  return (
    <div className="min-h-screen bg-transparent pt-24 pb-20 relative z-10">
      {/* Floating Back Button */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-28 left-6 z-40 hidden xl:block"
      >
        <Link 
          to="/" 
          state={{ scrollTo: "#services" }}
          className="w-12 h-12 rounded-full glass flex items-center justify-center text-slate-600 hover:bg-maroon-800 hover:text-white transition-all shadow-lg group"
          title="Back to Services"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </Link>
      </motion.div>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-slate-900 text-white">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-maroon-800 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-purple rounded-full blur-[120px]" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <Link 
            to="/" 
            state={{ scrollTo: "#services" }}
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Services
          </Link>
          
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-16 h-16 bg-maroon-800 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-maroon-900/20">
                <Icon className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">
                {service.title}
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
                {service.description}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-3 gap-16">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-20">
            {/* About Service */}
            <section>
              <h2 className="text-3xl font-display font-bold mb-8 text-slate-900">About the Service</h2>
              <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
                {service.longDescription.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </section>

            {/* How We Work */}
            <section>
              <h2 className="text-3xl font-display font-bold mb-10 text-slate-900">How We Work</h2>
              <div className="space-y-12">
                {service.process.map((step, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-xl font-bold text-maroon-800 group-hover:bg-maroon-800 group-hover:text-white transition-colors">
                      {i + 1}
                    </div>
                    <div className="pt-2">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                      <p className="text-slate-600 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-10">
            {/* Features Card */}
            <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Key Features</h3>
              <ul className="space-y-4">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-maroon-800 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Card */}
            <div className="bg-maroon-900 p-8 rounded-[32px] text-white shadow-2xl shadow-maroon-900/20">
              <h3 className="text-2xl font-bold mb-4">Ready to start?</h3>
              <p className="text-maroon-100 mb-8 leading-relaxed">
                Let's discuss your project and see how our {service.title} expertise can help you grow.
              </p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full py-4 rounded-xl bg-white text-maroon-900 font-bold flex items-center justify-center gap-2 hover:bg-maroon-50 transition-all"
              >
                Get Service
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <GetServiceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        serviceName={service.title}
      />
    </div>
  );
};
