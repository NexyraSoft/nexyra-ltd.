import { motion } from "motion/react";
import { CheckCircle2, Rocket } from "lucide-react";

export const About = () => {
  return (
    <section id="about" className="py-24 relative overflow-hidden bg-transparent">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-8 text-slate-900">
              Empowering Brands Through <br />
              <span className="text-maroon-800">Innovation</span>
            </h2>
            <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
              <p>
                Nexyrasoft is a forward-thinking software company focused on building smart, scalable, and impactful digital solutions. We combine design, technology, and strategy to create products that not only look great but also perform exceptionally.
              </p>
              <p>
                From startups to growing businesses, we help brands transform their ideas into powerful digital experiences. Our goal is simple — build products that users love and businesses rely on.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-8 mt-12">
              <div className="p-6 rounded-3xl bg-maroon-900/5 border border-maroon-900/10">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-slate-900">
                  <CheckCircle2 className="w-5 h-5 text-maroon-800" />
                  Mission
                </h3>
                <p className="text-sm text-slate-600">
                  To build smart, modern, and scalable digital products that solve real-world problems and create meaningful user experiences.
                </p>
              </div>
              <div className="p-6 rounded-3xl bg-accent-purple/5 border border-accent-purple/10">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-slate-900">
                  <Rocket className="w-5 h-5 text-accent-purple" />
                  Vision
                </h3>
                <p className="text-sm text-slate-600">
                  To lead the future of digital innovation by creating technology that inspires, empowers, and drives global impact.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl overflow-hidden glass p-4">
              <img
                src="https://picsum.photos/seed/tech/800/800"
                alt="Nexyrasoft Team"
                className="w-full h-full object-cover rounded-2xl grayscale hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Stats Overlay */}
            <div className="absolute -bottom-8 -left-8 glass p-6 rounded-2xl hidden md:block">
              <div className="text-3xl font-bold text-maroon-800">45+</div>
              <div className="text-xs text-gray-400 uppercase tracking-widest">Projects Delivered</div>
            </div>
            <div className="absolute -top-8 -right-8 glass p-6 rounded-2xl hidden md:block">
              <div className="text-3xl font-bold text-accent-purple">20+</div>
              <div className="text-xs text-gray-400 uppercase tracking-widest">Global Clients</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
