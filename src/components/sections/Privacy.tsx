import { useEffect } from "react";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export const Privacy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-transparent pt-24 pb-20 relative z-10">
      <section className="relative py-20 overflow-hidden bg-slate-900 text-white">
        <div className="container mx-auto px-6 relative z-10">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
                Privacy <span className="text-maroon-800">Policy</span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Your privacy is important to us. This policy explains how we collect, use, and protect your information.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto prose prose-slate prose-lg">
          <h2 className="text-2xl font-bold mb-4">1. Information Collection</h2>
          <p className="mb-8 text-slate-600">
            We collect information you provide directly to us, such as when you fill out a contact form, request a service, or apply for a job. This may include your name, email address, phone number, and project details.
          </p>

          <h2 className="text-2xl font-bold mb-4">2. Use of Information</h2>
          <p className="mb-8 text-slate-600">
            We use the information we collect to provide and improve our services, communicate with you about your projects, and send you updates or promotional materials if you have opted in.
          </p>

          <h2 className="text-2xl font-bold mb-4">3. Data Protection</h2>
          <p className="mb-8 text-slate-600">
            We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
          </p>

          <h2 className="text-2xl font-bold mb-4">4. Sharing of Information</h2>
          <p className="mb-8 text-slate-600">
            We do not sell or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our business, subject to confidentiality agreements.
          </p>

          <h2 className="text-2xl font-bold mb-4">5. Your Rights</h2>
          <p className="mb-8 text-slate-600">
            You have the right to access, update, or delete your personal information at any time. Please contact us at nexyrasoft@gmail.com if you wish to exercise these rights.
          </p>
        </div>
      </div>
    </div>
  );
};
