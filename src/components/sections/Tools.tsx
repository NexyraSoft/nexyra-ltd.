import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Database, 
  BrainCircuit, 
  Smartphone, 
  Layout, 
  PenTool, 
  Rocket, 
  Shapes, 
  CheckCircle2,
  Shield,
  Briefcase,
  ShoppingBag,
  Code2,
  Cloud,
  Layers
} from "lucide-react";
import { cn } from "@/lib/utils";
import { technologies } from "@/constants/toolsData";

const categories = [
  { id: "web", label: "Web & Frontend", icon: Layout },
  { id: "backend", label: "Backend & DB", icon: Database },
  { id: "mobility", label: "Mobile Apps", icon: Smartphone },
  { id: "ai_block", label: "AI & Web3", icon: BrainCircuit },
  { id: "design", label: "Design & UX", icon: PenTool },
  { id: "cloud_devops", label: "Cloud & DevOps", icon: Cloud },
  { id: "security", label: "Security", icon: Shield },
  { id: "enterprise", label: "Enterprise & E-com", icon: Briefcase },
];

export const Tools = () => {
  const [activeCategory, setActiveCategory] = useState("web");

  const filteredTech = technologies.filter(tech => tech.category === activeCategory);

  return (
    <section className="py-24 bg-transparent relative overflow-hidden" id="tools">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-maroon-900/10 blur-[120px] rounded-full -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-accent-purple/10 blur-[120px] rounded-full -ml-20 -mb-20"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <span className="text-maroon-800 font-semibold text-sm uppercase tracking-widest mb-3">
              Our Tools
            </span>
            <div className="w-12 h-0.5 bg-maroon-800 mb-6"></div>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 max-w-4xl">
              Empowering Innovation with Advanced Tools & Technologies
            </h2>
          </motion.div>
        </div>

        {/* Categories Grid */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mb-16">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "group flex flex-col items-center gap-3 p-4 transition-all duration-300 min-w-[120px]",
                activeCategory === cat.id 
                  ? "bg-white rounded-xl shadow-lg shadow-maroon-900/10 border border-maroon-800/20 scale-105" 
                  : "hover:scale-105 opacity-60 hover:opacity-100"
              )}
            >
              <div className={cn(
                "p-3 rounded-xl transition-colors",
                activeCategory === cat.id 
                  ? "bg-maroon-800 text-white" 
                  : "bg-slate-100 text-slate-600 group-hover:bg-maroon-50 group-hover:text-maroon-800"
              )}>
                <cat.icon size={28} />
              </div>
              <span className={cn(
                "text-sm font-semibold whitespace-nowrap",
                activeCategory === cat.id ? "text-maroon-900" : "text-slate-600"
              )}>
                {cat.label}
              </span>
            </button>
          ))}
        </div>

        {/* Technologies Display */}
        <div className="min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
            >
              {filteredTech.length > 0 ? (
                filteredTech.map((tech) => (
                  <motion.div
                    key={tech.name}
                    whileHover={{ y: -5 }}
                    className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 transition-shadow hover:shadow-xl group"
                  >
                    <div className="w-20 h-20 flex items-center justify-center mb-2 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">
                      <img 
                        src={tech.logo} 
                        alt={tech.name} 
                        className="max-w-full max-h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <span className="text-slate-900 font-semibold group-hover:text-maroon-800 transition-colors">
                      {tech.name}
                    </span>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-20 flex flex-col items-center text-slate-400">
                  <Shapes size={48} className="mb-4 opacity-20" />
                  <p>More technologies coming soon...</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Trust badge */}
        <div className="mt-20 pt-10 border-t border-slate-200 flex flex-wrap justify-center gap-10">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <CheckCircle2 className="text-maroon-800" size={18} />
            <span>Verified Tech Stack</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <CheckCircle2 className="text-maroon-800" size={18} />
            <span>Enterprise Grade</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <CheckCircle2 className="text-maroon-800" size={18} />
            <span>Modern Standards</span>
          </div>
        </div>
      </div>
    </section>
  );
};
