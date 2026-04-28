import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { SERVICES } from "../../constants/siteData";

export const Services = () => {
  return (
    <section id="services" className="py-24 bg-transparent relative z-10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 px-4">
          <h2 className="text-2xl md:text-5xl font-display font-bold mb-4 text-slate-900">Our Expertise</h2>
          <div className="w-16 md:w-20 h-1 bg-maroon-900 mx-auto rounded-full mb-6" />
          <p className="text-xs md:text-base text-slate-600 max-w-2xl mx-auto">
            We offer a comprehensive suite of services to help your business thrive in the digital landscape.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {SERVICES.map((service, index) => (
            <Link key={service.slug} to={`/services/${service.slug}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -10 }}
                className="group glass p-8 rounded-3xl hover:border-maroon-800/50 transition-all duration-300 bg-white/80 h-full cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-maroon-900/10 flex items-center justify-center mb-6 group-hover:bg-maroon-900 transition-colors">
                  <service.icon className="w-6 h-6 text-maroon-800 group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-maroon-800 transition-colors text-slate-900">{service.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
