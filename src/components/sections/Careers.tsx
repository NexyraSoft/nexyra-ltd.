import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, Send, ArrowLeft, Briefcase, Code2, Palette, MapPin, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";
import { careersService } from "../../lib/careers";
import { Vacancy, VacancyCategory } from "../../lib/admin";

const categoryIcons: Record<VacancyCategory, typeof Code2> = {
  Development: Code2,
  Design: Palette,
  Management: Briefcase,
};

export const Careers = () => {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedRole, setSelectedRole] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLDivElement | null>(null);
  const roleSelectRef = useRef<HTMLSelectElement | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const loadVacancies = async () => {
      try {
        const data = await careersService.getActiveVacancies();
        setVacancies(data);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load current openings.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadVacancies();
  }, []);

  const categories = useMemo(() => ["All", ...Array.from(new Set(vacancies.map((vacancy) => vacancy.category)))], [vacancies]);

  useEffect(() => {
    if (!categories.includes(activeCategory)) {
      setActiveCategory("All");
    }
  }, [activeCategory, categories]);

  useEffect(() => {
    if (selectedRole && !vacancies.some((vacancy) => vacancy.title === selectedRole)) {
      setSelectedRole("");
    }
  }, [selectedRole, vacancies]);

  const filteredRoles = activeCategory === "All" ? vacancies : vacancies.filter((role) => role.category === activeCategory);

  const handleApplyClick = (title: string) => {
    setSelectedRole(title);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => roleSelectRef.current?.focus(), 250);
  };

  return (
    <div className="min-h-screen bg-transparent pt-24 pb-20 relative z-10">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-slate-900 text-white">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-maroon-800 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-purple rounded-full blur-[120px]" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          
          <div className="max-w-4xl text-center mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">
                Join Our Team & <span className="text-maroon-800">Build the Future</span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
                We are always looking for talented people who are passionate about technology, design, and innovation.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-20">
        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${
                activeCategory === cat 
                  ? "bg-maroon-900 text-white shadow-xl shadow-maroon-900/20" 
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
          {isLoading ? (
            <div className="col-span-full rounded-[32px] border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
              Loading current openings...
            </div>
          ) : null}
          {!isLoading && error ? (
            <div className="col-span-full rounded-[32px] border border-red-200 bg-red-50 p-8 text-center text-red-700 shadow-sm">
              {error}
            </div>
          ) : null}
          {!isLoading && !error && filteredRoles.length === 0 ? (
            <div className="col-span-full rounded-[32px] border border-slate-200 bg-white p-10 text-center shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">No active openings right now</h3>
              <p className="text-slate-600">We are not hiring for this category at the moment. Check back soon for new roles.</p>
            </div>
          ) : null}
          <AnimatePresence mode="popLayout">
            {filteredRoles.map((role, index) => (
              <motion.div
                key={role._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -10 }}
                className="group p-8 rounded-[32px] bg-white border border-slate-100 hover:border-maroon-800/50 transition-all duration-300 shadow-sm hover:shadow-2xl"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-maroon-900/10 flex items-center justify-center group-hover:bg-maroon-900 transition-colors">
                    {(() => {
                      const Icon = categoryIcons[role.category];
                      return <Icon className="w-7 h-7 text-maroon-800 group-hover:text-white" />;
                    })()}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full bg-slate-100 text-slate-500">
                    {role.category}
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900 group-hover:text-maroon-800 transition-colors">
                  {role.title}
                </h3>
                <p className="text-slate-600 leading-relaxed mb-10">
                  {role.summary}
                </p>
                <div className="flex flex-wrap gap-3 text-xs font-semibold text-slate-500 mb-6">
                  {role.location ? (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {role.location}
                    </span>
                  ) : null}
                  {role.employmentType ? (
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="w-4 h-4" />
                      {role.employmentType}
                    </span>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => handleApplyClick(role.title)}
                  className="flex items-center gap-2 text-maroon-800 font-bold group/btn"
                >
                  Apply Now 
                  <ArrowUpRight className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Application Form */}
        <div ref={formRef} className="max-w-4xl mx-auto">
          <div className="p-8 md:p-16 rounded-[48px] bg-slate-50 border border-slate-200 shadow-xl">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">Apply for a Position</h3>
              <p className="text-slate-500 text-lg">Take the first step towards your dream career at NexyraSoft.</p>
            </div>

            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-500 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 focus:border-maroon-800 outline-none transition-all text-slate-900 shadow-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-500 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    required
                    className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 focus:border-maroon-800 outline-none transition-all text-slate-900 shadow-sm" 
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-500 ml-1">Phone Number</label>
                  <input 
                    type="tel" 
                    required
                    className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 focus:border-maroon-800 outline-none transition-all text-slate-900 shadow-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-500 ml-1">Position</label>
                  <div className="relative">
                    <select 
                      ref={roleSelectRef}
                      required
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 focus:border-maroon-800 outline-none transition-all text-slate-900 shadow-sm appearance-none cursor-pointer"
                    >
                      <option value="">Select a role</option>
                      {vacancies.map((role) => (
                        <option key={role._id} value={role.title}>{role.title}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-500 ml-1">Message / Experience</label>
                <textarea 
                  rows={6} 
                  required
                  className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 focus:border-maroon-800 outline-none transition-all text-slate-900 shadow-sm resize-none" 
                  placeholder="Tell us about your background and why you'd be a great fit..." 
                />
              </div>

              <button className="w-full py-5 rounded-2xl bg-maroon-900 hover:bg-maroon-800 text-white font-bold transition-all shadow-xl shadow-maroon-900/30 flex items-center justify-center gap-3 group text-lg">
                Application Submission Coming Soon
                <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
