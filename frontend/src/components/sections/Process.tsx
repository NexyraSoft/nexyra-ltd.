import { motion } from "motion/react";
import { PROCESS_STEPS } from "../../constants/siteData";

export const Process = () => {
  return (
    <section className="py-24 bg-transparent">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 text-slate-900">Our Process</h2>
          <p className="text-slate-600">How we bring your ideas to life.</p>
        </div>

        <div className="relative flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Connector Line */}
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-maroon-800 to-transparent hidden md:block" />
          
          {PROCESS_STEPS.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative z-10 flex flex-col items-center text-center group w-full"
            >
              <div className="w-16 h-16 rounded-full glass flex items-center justify-center mb-6 group-hover:bg-maroon-900 transition-all duration-300 group-hover:scale-110 bg-white shadow-sm">
                <step.icon className="w-8 h-8 text-maroon-800 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-900">{step.title}</h3>
              <p className="text-sm text-slate-500">{step.description}</p>
              <div className="mt-4 text-xs font-bold text-maroon-900/50 group-hover:text-maroon-800">0{index + 1}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
