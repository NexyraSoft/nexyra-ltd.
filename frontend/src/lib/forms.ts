import { apiRequest } from "./api";

export type ChatbotResponse = {
  reply: string;
  intent:
    | "services"
    | "pricing"
    | "timeline"
    | "consultation"
    | "contact"
    | "support"
    | "fallback";
  cta?: string;
  action: "contact" | "get-started" | "none";
  suggestions: string[];
};

export const formService = {
  submitContact: (payload: {
    name: string;
    email: string;
    phone?: string;
    message: string;
  }) => apiRequest<{ message: string }>("/contact", { method: "POST", body: payload }),
  submitGetStarted: (payload: {
    name: string;
    email: string;
    phone: string;
    message: string;
    acceptedTerms: boolean;
  }) => apiRequest<{ message: string }>("/leads/get-started", { method: "POST", body: payload }),
  submitServiceRequest: (payload: {
    name: string;
    email: string;
    phone: string;
    budget: string;
    serviceName: string;
    message: string;
    acceptedTerms: boolean;
  }) =>
    apiRequest<{ message: string }>("/leads/service-request", { method: "POST", body: payload }),
  getDashboard: (token?: string) =>
    apiRequest<{
      message: string;
      stats: { contactCount: number; leadCount: number };
      recentContacts: Array<{ _id: string; name: string; email: string; message: string; createdAt?: string }>;
      recentLeads: Array<{ _id: string; name: string; email: string; message?: string; serviceName?: string; createdAt?: string }>;
    }>("/dashboard", { token }),
  getContacts: (token?: string) =>
    apiRequest<{ total: number; contacts: Array<{ _id: string; name: string; email: string; phone?: string; message: string; createdAt?: string }> }>("/contact", { token }),
  submitChatbotMessage: (payload: { message: string }) =>
    apiRequest<ChatbotResponse>("/chatbot", { method: "POST", body: payload }),
};
