import React, { FormEvent, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { formService } from "../../lib/forms";
import {
  MESSAGE_TITLE,
  NAME_PATTERN,
  NAME_TITLE,
  PHONE_PATTERN,
  PHONE_TITLE,
  sanitizeNameInput,
  sanitizePhoneInput,
} from "../../lib/formValidation";

interface GetStartedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GetStartedModal = ({ isOpen, onClose }: GetStartedModalProps) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    acceptedTerms: false,
  });
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message: string }>({
    type: "idle",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    try {
      const response = await formService.submitGetStarted(form);
      setStatus({ type: "success", message: response.message });
      setForm({ name: "", email: "", phone: "", message: "", acceptedTerms: false });
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Unable to submit your request.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-[600px] bg-[#2b0d0d] p-8 md:p-10 rounded-2xl shadow-2xl text-white z-10"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl md:text-3xl font-display font-bold mb-8 text-center">
              Let's talk about your project
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500 ml-1">Your Name</label>
                <input
                  type="text"
                  required
                  minLength={2}
                  maxLength={50}
                  pattern={NAME_PATTERN}
                  title={NAME_TITLE}
                  placeholder="Your Name"
                  autoComplete="name"
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, name: sanitizeNameInput(event.target.value) }))
                  }
                  className="w-full bg-transparent border border-[#5a1f1f] rounded-lg px-4 py-3 outline-none focus:border-red-500 transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500 ml-1">Your Email</label>
                <input
                  type="email"
                  required
                  maxLength={120}
                  placeholder="your@email.com"
                  autoComplete="email"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  className="w-full bg-transparent border border-[#5a1f1f] rounded-lg px-4 py-3 outline-none focus:border-red-500 transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500 ml-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  inputMode="tel"
                  maxLength={16}
                  pattern={PHONE_PATTERN}
                  title={PHONE_TITLE}
                  placeholder="+8801234567890"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, phone: sanitizePhoneInput(event.target.value) }))
                  }
                  className="w-full bg-transparent border border-[#5a1f1f] rounded-lg px-4 py-3 outline-none focus:border-red-500 transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500 ml-1">How can we help you?</label>
                <textarea
                  rows={4}
                  required
                  minLength={10}
                  maxLength={1000}
                  title={MESSAGE_TITLE}
                  placeholder="Describe your project requirements, goals, and any specific features you need..."
                  value={form.message}
                  onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
                  className="w-full bg-transparent border border-[#5a1f1f] rounded-lg px-4 py-3 outline-none focus:border-red-500 transition-all resize-none"
                ></textarea>
              </div>

              <div className="flex items-start gap-3">
                <input
                  id="get-started-terms"
                  type="checkbox"
                  required
                  checked={form.acceptedTerms}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, acceptedTerms: event.target.checked }))
                  }
                  className="mt-1 accent-red-600"
                />
                <label htmlFor="get-started-terms" className="text-sm text-gray-400 transition-colors">
                  I agree to{" "}
                  <Link to="/terms" className="text-white underline underline-offset-4 hover:text-red-300">
                    Terms of Use
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-white underline underline-offset-4 hover:text-red-300">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {status.type !== "idle" && (
                <p className={status.type === "success" ? "text-sm text-green-400" : "text-sm text-red-400"}>
                  {status.message}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-lg bg-gradient-to-r from-[#800000] via-[#b22222] to-[#ff4500] text-white font-bold hover:opacity-90 transition-all shadow-lg shadow-red-900/40 mt-4 disabled:opacity-70"
              >
                {isSubmitting ? "Submitting..." : "Discover More"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
