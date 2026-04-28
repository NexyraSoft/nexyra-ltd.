import { FormEvent, useState } from "react";
import { Search, Code2, Facebook, Linkedin, Instagram, MessageCircle } from "lucide-react";
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

export const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message: string }>({
    type: "idle",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    try {
      const response = await formService.submitContact(form);
      setStatus({ type: "success", message: response.message });
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Unable to send your message.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-transparent relative z-10">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto glass rounded-[40px] overflow-hidden grid lg:grid-cols-2 bg-white/40 backdrop-blur-md shadow-2xl border border-white/20">
          <div className="p-12 bg-maroon-900/5 flex flex-col justify-between">
            <div>
              <h2 className="text-4xl font-display font-bold mb-6 text-slate-900">Let's build something <br /> <span className="text-gradient">extraordinary</span></h2>
              <p className="text-slate-600 mb-12">
                Have a project in mind? Reach out and let's discuss how we can help you achieve your digital goals.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <a
                    href="https://wa.me/8801612287424"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full glass flex items-center justify-center bg-white hover:bg-maroon-800 group/icon transition-colors"
                  >
                    <MessageCircle className="w-5 h-5 text-maroon-800 group-hover/icon:text-white transition-colors" />
                  </a>
                  <div>
                    <div className="text-xs text-slate-500 uppercase font-bold">Contact</div>
                    <a
                      href="https://wa.me/8801612287424"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-900 hover:text-maroon-800 transition-colors"
                    >
                      +880 1612-287424
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <a
                    href="https://maps.app.goo.gl/gtkQPvAgq2FckeGF6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full glass flex items-center justify-center bg-white hover:bg-maroon-800 group/icon transition-colors"
                  >
                    <Search className="w-5 h-5 text-maroon-800 group-hover/icon:text-white transition-colors" />
                  </a>
                  <div>
                    <div className="text-xs text-slate-500 uppercase font-bold">Location</div>
                    <a
                      href="https://maps.app.goo.gl/gtkQPvAgq2FckeGF6"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-900 hover:text-maroon-800 transition-colors"
                    >
                      Plot:4214, Road 05, Block M, Bashundhara r/a, Dhaka 1229, Bangladesh
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <a
                    href="mailto:nexyrasoft@gmail.com"
                    className="w-10 h-10 rounded-full glass flex items-center justify-center bg-white hover:bg-maroon-800 group/icon transition-colors"
                  >
                    <Code2 className="w-5 h-5 text-maroon-800 group-hover/icon:text-white transition-colors" />
                  </a>
                  <div>
                    <div className="text-xs text-slate-500 uppercase font-bold">Email</div>
                    <a
                      href="mailto:nexyrasoft@gmail.com"
                      className="text-slate-900 hover:text-maroon-800 transition-colors"
                    >
                      nexyrasoft@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-12">
              {[
                { Icon: Facebook, href: "https://www.facebook.com/share/18ijBucTGp/" },
                { Icon: Linkedin, href: "https://www.linkedin.com/in/nexyrasoft/" },
                { Icon: Instagram, href: "https://www.instagram.com/nexyrasoft?igsh=M3pjOTg0Y3J0Zzlw" },
                { Icon: MessageCircle, href: "https://wa.me/8801612287424" }
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-maroon-800 transition-colors bg-white group"
                >
                  <social.Icon className="w-5 h-5 text-slate-600 group-hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          <div className="p-12">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-500">Name</label>
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
                    className="w-full bg-white/60 border border-maroon-900/20 rounded-xl px-4 py-3 focus:border-maroon-800 outline-none transition-all text-slate-900 backdrop-blur-sm shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-500">Email</label>
                  <input
                    type="email"
                    required
                    maxLength={120}
                    placeholder="your@email.com"
                    autoComplete="email"
                    value={form.email}
                    onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                    className="w-full bg-white/60 border border-maroon-900/20 rounded-xl px-4 py-3 focus:border-maroon-800 outline-none transition-all text-slate-900 backdrop-blur-sm shadow-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-500">Phone</label>
                <input
                  type="tel"
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
                  className="w-full bg-white/60 border border-maroon-900/20 rounded-xl px-4 py-3 focus:border-maroon-800 outline-none transition-all text-slate-900 backdrop-blur-sm shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-500">Message</label>
                <textarea
                  rows={4}
                  required
                  minLength={10}
                  maxLength={1000}
                  title={MESSAGE_TITLE}
                  value={form.message}
                  onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
                  className="w-full bg-white/60 border border-maroon-900/20 rounded-xl px-4 py-3 focus:border-maroon-800 outline-none transition-all text-slate-900 backdrop-blur-sm shadow-sm"
                  placeholder="Tell us about your project..."
                />
              </div>
              {status.type !== "idle" && (
                <p className={status.type === "success" ? "text-sm text-green-600" : "text-sm text-red-600"}>
                  {status.message}
                </p>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-maroon-900 hover:bg-maroon-800 text-white font-bold transition-all shadow-lg shadow-maroon-900/20 disabled:opacity-70"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
