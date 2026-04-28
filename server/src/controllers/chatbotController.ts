import { Request, Response } from "express";

type ChatbotIntent =
  | "services"
  | "pricing"
  | "timeline"
  | "consultation"
  | "contact"
  | "support"
  | "fallback";

type ChatbotAction = "contact" | "get-started" | "none";

type ChatbotReply = {
  reply: string;
  intent: ChatbotIntent;
  cta?: string;
  action: ChatbotAction;
  suggestions: string[];
};

const MAX_MESSAGE_LENGTH = 280;

const normalizeMessage = (value: unknown) =>
  typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";

const includesAny = (message: string, keywords: string[]) =>
  keywords.some((keyword) => message.includes(keyword));

const classifyIntent = (message: string): ChatbotIntent => {
  if (
    includesAny(message, [
      "price",
      "pricing",
      "budget",
      "cost",
      "quote",
      "estimate",
      "proposal",
    ])
  ) {
    return "pricing";
  }

  if (
    includesAny(message, [
      "timeline",
      "deadline",
      "delivery",
      "deliver",
      "launch",
      "how long",
      "duration",
    ])
  ) {
    return "timeline";
  }

  if (
    includesAny(message, [
      "contact",
      "call",
      "email",
      "whatsapp",
      "book",
      "meeting",
      "reach",
      "speak",
      "talk to",
    ])
  ) {
    return "contact";
  }

  if (
    includesAny(message, [
      "consult",
      "consultation",
      "project",
      "hire",
      "start",
      "get started",
      "work with",
      "build",
    ])
  ) {
    return "consultation";
  }

  if (
    includesAny(message, [
      "service",
      "software",
      "website",
      "web app",
      "mobile app",
      "app",
      "ui",
      "ux",
      "design",
      "backend",
      "frontend",
      "api",
      "cloud",
      "devops",
      "ai",
      "ml",
      "security",
      "cybersecurity",
      "ecommerce",
      "cms",
      "erp",
      "crm",
    ])
  ) {
    return "services";
  }

  if (includesAny(message, ["support", "maintain", "maintenance", "fix", "issue", "bug"])) {
    return "support";
  }

  return "fallback";
};

const buildReply = (intent: ChatbotIntent): ChatbotReply => {
  switch (intent) {
    case "services":
      return {
        intent,
        action: "get-started",
        reply:
          "Nexyrasoft helps with custom software, web and mobile apps, UI/UX, backend systems, cloud, AI, and cybersecurity. Tell me your goal and I can guide you to the right next step.",
        cta: "Share your project details for a tailored follow-up.",
        suggestions: [
          "I need a web or mobile app",
          "I want help with UI/UX or branding",
          "I need backend, cloud, or AI support",
        ],
      };
    case "pricing":
      return {
        intent,
        action: "get-started",
        reply:
          "Pricing depends on scope, timeline, integrations, and design depth. The fastest way to get a realistic estimate is to share your project details for a consultation.",
        cta: "Open the project request form to get a tailored estimate.",
        suggestions: [
          "Estimate a custom software project",
          "What affects project cost?",
          "I want to request a proposal",
        ],
      };
    case "timeline":
      return {
        intent,
        action: "get-started",
        reply:
          "Delivery time varies by complexity, features, and review cycles. We usually confirm a practical timeline after a short discovery conversation.",
        cta: "Send your requirements and we can recommend a realistic timeline.",
        suggestions: [
          "How long for an MVP?",
          "Can you handle an urgent launch?",
          "I want to discuss my deadline",
        ],
      };
    case "consultation":
      return {
        intent,
        action: "get-started",
        reply:
          "Absolutely. Nexyrasoft can review your idea, recommend the right service mix, and map a practical next step for delivery.",
        cta: "Share your details and project summary to request a consultation.",
        suggestions: [
          "I want a consultation",
          "Help me plan an MVP",
          "I need a technical partner",
        ],
      };
    case "contact":
      return {
        intent,
        action: "contact",
        reply:
          "You can reach Nexyrasoft through the chatbot form, the contact section, email, or WhatsApp. If you want, I can collect your details here for a human follow-up.",
        cta: "Use the quick contact form for a direct reply from the team.",
        suggestions: [
          "Contact the team",
          "Book a follow-up",
          "I want someone to reach out",
        ],
      };
    case "support":
      return {
        intent,
        action: "contact",
        reply:
          "Nexyrasoft also supports maintenance, QA, security hardening, and ongoing improvements. A quick message helps the team route you to the right specialist.",
        cta: "Leave your contact details and a short support note.",
        suggestions: [
          "I need ongoing maintenance",
          "We need QA or security help",
          "I want technical support",
        ],
      };
    case "fallback":
    default:
      return {
        intent: "fallback",
        action: "contact",
        reply:
          "I can help with Nexyrasoft services, timelines, pricing, and project planning. If your question needs a human answer, I can collect your details for a follow-up.",
        cta: "Ask about a service or leave your contact details for the team.",
        suggestions: [
          "What services do you offer?",
          "How do I get a project estimate?",
          "I want to talk to the team",
        ],
      };
  }
};

export const handleChatbotMessage = async (req: Request, res: Response) => {
  const message = normalizeMessage(req.body?.message).toLowerCase();

  if (!message) {
    return res.status(400).json({ message: "Please enter a message to continue." });
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({
      message: `Please keep your message under ${MAX_MESSAGE_LENGTH} characters.`,
    });
  }

  const reply = buildReply(classifyIntent(message));

  return res.json(reply);
};
