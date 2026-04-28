import { useEffect } from "react";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export const Terms = () => {
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
                Terms & <span className="text-maroon-800">Conditions</span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Please read these terms and conditions carefully before using our services.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto prose prose-slate prose-lg">
          <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
          <p className="mb-8 text-slate-600">
            By accessing and using the services provided by NexyraSoft, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services.
          </p>

          <h2 className="text-2xl font-bold mb-4">2. Services Provided</h2>
          <p className="mb-8 text-slate-600">
            NexyraSoft provides software development, UI/UX design, and digital consulting services. The specific scope of work for each project will be defined in a separate agreement or statement of work.
          </p>

          <h2 className="text-2xl font-bold mb-4">3. Intellectual Property</h2>
          <p className="mb-8 text-slate-600">
            Unless otherwise agreed in writing, all intellectual property rights in the deliverables created for you will be transferred to you upon full payment of the agreed fees. NexyraSoft retains the right to use non-confidential portions of the work for promotional purposes.
          </p>

          <h2 className="text-2xl font-bold mb-4">4. Limitation of Liability</h2>
          <p className="mb-8 text-slate-600">
            NexyraSoft shall not be liable for any indirect, incidental, or consequential damages arising out of the use or inability to use our services. Our total liability for any claim shall not exceed the amount paid by you for the specific service giving rise to the claim.
          </p>

          <h2 className="text-2xl font-bold mb-4">5. Governing Law</h2>
          <p className="mb-8 text-slate-600">
            These terms shall be governed by and construed in accordance with the laws of Bangladesh, without regard to its conflict of law provisions.
          </p>
        </div>
      </div>
    </div>
  );
};
