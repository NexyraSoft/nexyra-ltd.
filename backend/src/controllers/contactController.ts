import { Request, Response } from "express";
import { ContactMessage } from "../models/ContactMessage";
import { Lead } from "../models/Lead";
import {
  sendContactEmails,
  sendGetStartedEmails,
  sendServiceRequestEmails,
} from "../services/emailService";

const isEmail = (value: string) => /\S+@\S+\.\S+/.test(value);
const NAME_REGEX = /^[A-Za-z][A-Za-z .'-]{1,49}$/;
const PHONE_REGEX = /^(?:\+[1-9]\d{7,14}|\d{7,15})$/;
const isValidName = (value: string) => NAME_REGEX.test(value);
const isValidPhone = (value: string) => PHONE_REGEX.test(value);
const hasValidMessageLength = (value: string) => value.trim().length >= 10 && value.trim().length <= 1000;

export const getContacts = async (_req: Request, res: Response) => {
  try {
    const contacts = await ContactMessage.find().sort({ createdAt: -1 });

    return res.json({
      total: contacts.length,
      contacts,
    });
  } catch (error) {
    console.error("Failed to fetch contacts", error);
    return res.status(500).json({ message: "Failed to fetch contacts" });
  }
};

export const submitContact = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, message } = req.body as {
      name?: string;
      email?: string;
      phone?: string;
      message?: string;
    };
    const normalizedName = name?.trim() ?? "";
    const normalizedEmail = email?.trim() ?? "";
    const normalizedPhone = phone?.trim() ?? "";
    const normalizedMessage = message?.trim() ?? "";

    if (!normalizedName || !normalizedEmail || !normalizedMessage) {
      return res.status(400).json({ message: "Name, email, and message are required." });
    }

    if (!isValidName(normalizedName)) {
      return res.status(400).json({ message: "Please provide a valid name." });
    }

    if (!isEmail(normalizedEmail)) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }

    if (normalizedPhone && !isValidPhone(normalizedPhone)) {
      return res.status(400).json({ message: "Please provide a valid phone number." });
    }

    if (!hasValidMessageLength(normalizedMessage)) {
      return res.status(400).json({ message: "Message must be between 10 and 1000 characters." });
    }

    const contact = await ContactMessage.create({
      name: normalizedName,
      email: normalizedEmail,
      phone: normalizedPhone,
      message: normalizedMessage,
    });

    // Send emails asynchronously so the API returns immediately
    sendContactEmails({
      name: normalizedName,
      email: normalizedEmail,
      phone: normalizedPhone,
      message: normalizedMessage,
    })
      .then(() => console.log("Contact emails sent (async)"))
      .catch((emailError) => console.error("CRITICAL: Contact email delivery failed (async)", emailError));

    return res.status(201).json({
      message: "Your message has been received. We'll reach out within 24 hours.",
      contact,
    });
  } catch (error) {
    console.error("DATABASE ERROR: Failed to submit contact", error);
    return res.status(500).json({ 
      message: "Server Error: Could not save your message. Please check your database connection." 
    });
  }
};

export const submitGetStartedLead = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, message, acceptedTerms } = req.body as {
      name?: string;
      email?: string;
      phone?: string;
      message?: string;
      acceptedTerms?: boolean;
    };
    const normalizedName = name?.trim() ?? "";
    const normalizedEmail = email?.trim() ?? "";
    const normalizedPhone = phone?.trim() ?? "";
    const normalizedMessage = message?.trim() ?? "";

    if (!normalizedName || !normalizedEmail || !normalizedPhone || !normalizedMessage) {
      return res.status(400).json({ message: "All fields are required for this request." });
    }

    if (!acceptedTerms) {
      return res.status(400).json({ message: "You must accept the terms to continue." });
    }

    if (!isValidName(normalizedName)) {
      return res.status(400).json({ message: "Please provide a valid name." });
    }

    if (!isEmail(normalizedEmail)) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }

    if (!isValidPhone(normalizedPhone)) {
      return res.status(400).json({ message: "Please provide a valid phone number." });
    }

    if (!hasValidMessageLength(normalizedMessage)) {
      return res.status(400).json({ message: "Message must be between 10 and 1000 characters." });
    }

    const lead = await Lead.create({
      type: "get-started",
      name: normalizedName,
      email: normalizedEmail,
      phone: normalizedPhone,
      message: normalizedMessage,
      acceptedTerms,
    });

    // Send emails asynchronously
    sendGetStartedEmails({
      name: normalizedName,
      email: normalizedEmail,
      phone: normalizedPhone,
      message: normalizedMessage,
    })
      .then(() => console.log("Get-started emails sent (async)"))
      .catch((err) => console.error("Get Started email delivery failed (async)", err));

    return res.status(201).json({
      message: "Your project request has been submitted.",
      lead,
    });
  } catch (error) {
    console.error("Failed to submit get started lead", error);
    return res.status(500).json({ message: "Failed to submit project request" });
  }
};

export const submitServiceRequest = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, budget, serviceName, message, acceptedTerms } = req.body as {
      name?: string;
      email?: string;
      phone?: string;
      budget?: string;
      serviceName?: string;
      message?: string;
      acceptedTerms?: boolean;
    };
    const normalizedName = name?.trim() ?? "";
    const normalizedEmail = email?.trim() ?? "";
    const normalizedPhone = phone?.trim() ?? "";
    const normalizedBudget = budget?.trim() ?? "";
    const normalizedServiceName = serviceName?.trim() ?? "";
    const normalizedMessage = message?.trim() ?? "";

    if (
      !normalizedName ||
      !normalizedEmail ||
      !normalizedPhone ||
      !normalizedBudget ||
      !normalizedServiceName ||
      !normalizedMessage
    ) {
      return res.status(400).json({ message: "All fields are required for a service request." });
    }

    if (!acceptedTerms) {
      return res.status(400).json({ message: "You must accept the terms to continue." });
    }

    if (!isValidName(normalizedName)) {
      return res.status(400).json({ message: "Please provide a valid name." });
    }

    if (!isEmail(normalizedEmail)) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }

    if (!isValidPhone(normalizedPhone)) {
      return res.status(400).json({ message: "Please provide a valid phone number." });
    }

    if (!hasValidMessageLength(normalizedMessage)) {
      return res.status(400).json({ message: "Message must be between 10 and 1000 characters." });
    }

    const lead = await Lead.create({
      type: "service-request",
      name: normalizedName,
      email: normalizedEmail,
      phone: normalizedPhone,
      budget: normalizedBudget,
      serviceName: normalizedServiceName,
      message: normalizedMessage,
      acceptedTerms,
    });

    // Send emails asynchronously
    sendServiceRequestEmails({
      name: normalizedName,
      email: normalizedEmail,
      phone: normalizedPhone,
      budget: normalizedBudget,
      serviceName: normalizedServiceName,
      message: normalizedMessage,
    })
      .then(() => console.log("Service request emails sent (async)"))
      .catch((err) => console.error("Service request email delivery failed (async)", err));

    return res.status(201).json({
      message: "Your service request has been submitted.",
      lead,
    });
  } catch (error) {
    console.error("Failed to submit service request", error);
    return res.status(500).json({ message: "Failed to submit service request" });
  }
};
