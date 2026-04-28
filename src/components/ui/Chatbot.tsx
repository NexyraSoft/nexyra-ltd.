import React, { FormEvent, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Send, Bot, User, Loader2, Sparkles, ArrowRight } from "lucide-react";
import { formService, type ChatbotResponse } from "../../lib/forms";
import {
  MESSAGE_TITLE,
  NAME_PATTERN,
  NAME_TITLE,
  PHONE_PATTERN,
  PHONE_TITLE,
  sanitizeNameInput,
  sanitizePhoneInput,
} from "../../lib/formValidation";

interface Message {
  role: "user" | "assistant";
  text: string;
}

type CaptureMode = "contact" | "get-started" | null;

type CaptureForm = {
  name: string;
  email: string;
  phone: string;
  message: string;
  acceptedTerms: boolean;
};

const initialCaptureForm: CaptureForm = {
  name: "",
  email: "",
  phone: "",
  message: "",
  acceptedTerms: false,
};

const initialMessage =
  "Hello! I'm the Nexyrasoft Assistant. Ask about services, pricing, timelines, or request a human follow-up.";

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: initialMessage },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [captureMode, setCaptureMode] = useState<CaptureMode>(null);
  const [captureForm, setCaptureForm] = useState<CaptureForm>(initialCaptureForm);
  const [captureStatus, setCaptureStatus] = useState<{
    type: "idle" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });
  const [isSubmittingCapture, setIsSubmittingCapture] = useState(false);
  const [quickReplies, setQuickReplies] = useState<string[]>([
    "What services do you offer?",
    "How do I get a project estimate?",
    "I want to talk to the team",
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, captureMode, isLoading]);

  const appendAssistantMessage = (text: string) => {
    setMessages((prev) => [...prev, { role: "assistant", text }]);
  };

  const handleStructuredReply = (response: ChatbotResponse) => {
    appendAssistantMessage(response.reply);

    if (response.cta) {
      appendAssistantMessage(response.cta);
    }

    setQuickReplies(response.suggestions);
    setCaptureMode(response.action === "none" ? null : response.action);
    setCaptureStatus({ type: "idle", message: "" });

    if (response.action === "get-started") {
      setCaptureForm((current) => ({
        ...current,
        message: current.message || "I'd like to discuss a new project with Nexyrasoft.",
      }));
    }

    if (response.action === "contact") {
      setCaptureForm((current) => ({
        ...current,
        message: current.message || "Please contact me about Nexyrasoft services.",
      }));
    }
  };

  const handleSend = async () => {
    const trimmedInput = input.trim();

    if (!trimmedInput || isLoading) {
      return;
    }

    setMessages((prev) => [...prev, { role: "user", text: trimmedInput }]);
    setInput("");
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await formService.submitChatbotMessage({ message: trimmedInput });
      handleStructuredReply(response);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "The assistant is unavailable right now. Please try again or request a human follow-up.";

      setErrorMessage(message);
      appendAssistantMessage(
        "I couldn't complete that reply just now. You can try again, or leave your details for a human follow-up.",
      );
      setCaptureMode("contact");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCaptureSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!captureMode) {
      return;
    }

    setIsSubmittingCapture(true);
    setCaptureStatus({ type: "idle", message: "" });

    try {
      const response =
        captureMode === "get-started"
          ? await formService.submitGetStarted({
              name: captureForm.name,
              email: captureForm.email,
              phone: captureForm.phone,
              message: captureForm.message,
              acceptedTerms: captureForm.acceptedTerms,
            })
          : await formService.submitContact({
              name: captureForm.name,
              email: captureForm.email,
              phone: captureForm.phone || undefined,
              message: captureForm.message,
            });

      setCaptureStatus({ type: "success", message: response.message });
      setCaptureForm(initialCaptureForm);
      setCaptureMode(null);
      appendAssistantMessage("Thanks. The Nexyrasoft team has your details and will follow up soon.");
    } catch (error) {
      setCaptureStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "We couldn't send your details right now. Please try again shortly.",
      });
    } finally {
      setIsSubmittingCapture(false);
    }
  };

  const captureTitle =
    captureMode === "get-started" ? "Request project follow-up" : "Request human follow-up";

  const captureButtonLabel =
    captureMode === "get-started"
      ? isSubmittingCapture
        ? "Submitting..."
        : "Send project request"
      : isSubmittingCapture
        ? "Sending..."
        : "Send contact request";

  return (
    <div
      className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 md:bottom-12 md:right-12 z-[2147483647] font-sans pointer-events-auto"
      style={{ isolation: "isolate" }}
    >
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0.8, 1, 1, 0.8],
              x: [20, 0, 0, 20],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              repeatDelay: 5,
              times: [0, 0.1, 0.9, 1],
              delay: 4,
            }}
            className="absolute bottom-24 right-0 mb-4 bg-white px-6 py-4 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] border border-slate-100 text-[14px] font-bold text-slate-800 whitespace-nowrap z-[2147483647] pointer-events-none"
          >
            How can I help you today?
            <div className="absolute -bottom-2 right-10 w-4 h-4 bg-white border-r border-b border-slate-100 rotate-45" />
          </motion.div>
        )}

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-8 w-[calc(100vw-48px)] sm:w-[380px] h-[560px] max-h-[75vh] bg-white rounded-[28px] shadow-[0_30px_60px_rgba(0,0,0,0.4)] border border-slate-100 overflow-hidden flex flex-col z-[2147483647]"
          >
            <div className="bg-slate-900 p-6 flex justify-between items-center">
              <div className="flex items-center gap-3 text-white">
                <div className="w-8 h-8 rounded-full bg-maroon-800 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">NexyraBot</h3>
                  <p className="text-[10px] text-slate-400">Nexyrasoft service assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex gap-2 max-w-[85%] ${message.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${message.role === "user" ? "bg-slate-900" : "bg-maroon-800"}`}
                    >
                      {message.role === "user" ? (
                        <User className="w-3 h-3 text-white" />
                      ) : (
                        <Bot className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed ${
                        message.role === "user"
                          ? "bg-slate-900 text-white rounded-tr-none"
                          : "bg-white text-slate-900 shadow-sm border border-slate-200 rounded-tl-none"
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-2 items-center text-slate-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-[10px] font-medium">Preparing a reply...</span>
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-800">
                  {errorMessage}
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 bg-white">
              {quickReplies.length > 0 && (
                <div className="px-4 pt-4 flex flex-wrap gap-2">
                  {quickReplies.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setInput(suggestion)}
                      className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-700 transition-colors hover:border-maroon-300 hover:text-maroon-900"
                    >
                      <Sparkles className="w-3 h-3" />
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}

              {captureMode && (
                <form
                  onSubmit={handleCaptureSubmit}
                  className="mx-4 mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{captureTitle}</h4>
                      <p className="text-[11px] text-slate-500">
                        {captureMode === "get-started"
                          ? "Share your project details for a tailored follow-up."
                          : "Leave your details and the team will get back to you."}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCaptureMode(null)}
                      className="text-[11px] font-semibold text-slate-500 hover:text-slate-900"
                    >
                      Hide
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <input
                      type="text"
                      required
                      minLength={2}
                      maxLength={50}
                      pattern={NAME_PATTERN}
                      title={NAME_TITLE}
                      placeholder="Your name"
                      autoComplete="name"
                      value={captureForm.name}
                      onChange={(event) =>
                        setCaptureForm((current) => ({
                          ...current,
                          name: sanitizeNameInput(event.target.value),
                        }))
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none transition-all focus:border-maroon-400"
                    />
                    <input
                      type="email"
                      required
                      maxLength={120}
                      placeholder="your@email.com"
                      autoComplete="email"
                      value={captureForm.email}
                      onChange={(event) =>
                        setCaptureForm((current) => ({ ...current, email: event.target.value }))
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none transition-all focus:border-maroon-400"
                    />
                  </div>

                  <input
                    type="tel"
                    inputMode={captureMode === "get-started" ? "tel" : undefined}
                    required={captureMode === "get-started"}
                    maxLength={16}
                    pattern={captureMode === "get-started" ? PHONE_PATTERN : undefined}
                    title={captureMode === "get-started" ? PHONE_TITLE : undefined}
                    placeholder={
                      captureMode === "get-started" ? "+8801234567890" : "Phone number (optional)"
                    }
                    autoComplete="tel"
                    value={captureForm.phone}
                    onChange={(event) =>
                      setCaptureForm((current) => ({
                        ...current,
                        phone: sanitizePhoneInput(event.target.value),
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none transition-all focus:border-maroon-400"
                  />

                  <textarea
                    rows={3}
                    required
                    minLength={10}
                    maxLength={1000}
                    title={MESSAGE_TITLE}
                    placeholder={
                      captureMode === "get-started"
                        ? "Tell us about your project goals, scope, and timeline."
                        : "Tell us what you want help with."
                    }
                    value={captureForm.message}
                    onChange={(event) =>
                      setCaptureForm((current) => ({ ...current, message: event.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none transition-all focus:border-maroon-400"
                  />

                  {captureMode === "get-started" && (
                    <label className="flex items-start gap-2 text-[11px] text-slate-600">
                      <input
                        type="checkbox"
                        required
                        checked={captureForm.acceptedTerms}
                        onChange={(event) =>
                          setCaptureForm((current) => ({
                            ...current,
                            acceptedTerms: event.target.checked,
                          }))
                        }
                        className="mt-0.5 accent-maroon-800"
                      />
                      I agree to the terms and privacy policy for project follow-up.
                    </label>
                  )}

                  {captureStatus.type !== "idle" && (
                    <p
                      className={`text-[11px] ${
                        captureStatus.type === "success" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {captureStatus.message}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmittingCapture}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-maroon-800 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-maroon-700 disabled:opacity-70"
                  >
                    {captureButtonLabel}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}

              <div className="p-4 bg-white">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        void handleSend();
                      }
                    }}
                    maxLength={280}
                    placeholder="Ask about services, pricing, or timelines..."
                    className="w-full bg-slate-100 border-none rounded-2xl py-3 pl-4 pr-12 text-xs focus:ring-2 focus:ring-maroon-800/20 transition-all outline-none"
                  />
                  <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="absolute right-2 p-2 rounded-xl bg-slate-900 text-white hover:bg-maroon-800 disabled:opacity-50 disabled:hover:bg-slate-900 transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] md:w-[80px] md:h-[80px] rounded-full flex items-center justify-center shadow-[0_15px_40px_rgba(0,0,0,0.3)] transition-all duration-300 relative border-2 border-white/20 ${
          isOpen ? "bg-slate-900 text-white" : "bg-maroon-800 text-white"
        }`}
      >
        {!isOpen && (
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0.2, 0.6] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full bg-maroon-800 -z-10"
          />
        )}
        {isOpen ? (
          <X className="w-8 h-8" />
        ) : (
          <Bot className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 stroke-[1.5]" />
        )}
      </motion.button>
    </div>
  );
};
