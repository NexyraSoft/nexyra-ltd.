import nodemailer from "nodemailer";
import { env } from "../config/env";

const getTransporter = () => {
  if (!env.smtpUser || !env.smtpPass) {
    throw new Error("SMTP credentials are missing. Set SMTP_USER and SMTP_PASS in environment variables.");
  }

  return nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpSecure,
    // timeouts to avoid hanging connections
    connectionTimeout: 15000,
    greetingTimeout: 5000,
    socketTimeout: 15000,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass,
    },
  });
};

type ContactEmailPayload = {
  name: string;
  email: string;
  phone?: string;
  message: string;
};

type GetStartedEmailPayload = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

type ServiceRequestEmailPayload = {
  name: string;
  email: string;
  phone: string;
  budget: string;
  serviceName: string;
  message: string;
};

const sendEmailWithRetry = async (transporter: any, mailOptions: any, retries = 2, perAttemptTimeoutMs = 15000) => {
  const sendWithTimeout = (opts: any) => {
    return Promise.race([
      transporter.sendMail(opts),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Email send timeout")), perAttemptTimeoutMs)),
    ]);
  };

  for (let i = 0; i < retries; i++) {
    try {
      const result = await sendWithTimeout(mailOptions);
      console.log(`✓ Email sent successfully to ${mailOptions.to}`);
      return result;
    } catch (error) {
      console.error(`Email attempt ${i + 1} failed for ${mailOptions.to}:`, error instanceof Error ? error.message : error);
      if (i === retries - 1) throw error;
      // exponential backoff with jitter
      const backoff = Math.min(5000 * (i + 1), 20000);
      await new Promise((r) => setTimeout(r, backoff + Math.floor(Math.random() * 1000)));
    }
  }
};

export const sendContactEmails = async (payload: ContactEmailPayload) => {
  try {
    const transporter = getTransporter();
    const from = `"${env.smtpFromName}" <${env.smtpUser}>`;

    await Promise.all([
      sendEmailWithRetry(transporter, {
        from,
        to: payload.email,
        subject: "We've received your message",
        text: `Hi ${payload.name},\n\nWe've received your message and will get back to you within 24 hours.\n\nYour message:\n${payload.message}\n\nBest regards,\nNexyraSoft`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
            <p>Hi ${payload.name},</p>
            <p>We've received your message and will get back to you within <strong>24 hours</strong>.</p>
            <p><strong>Your message:</strong></p>
            <blockquote style="margin: 0; padding-left: 16px; border-left: 4px solid #800000; color: #334155;">${payload.message}</blockquote>
            <p style="margin-top: 24px;">Best regards,<br/>NexyraSoft</p>
          </div>
        `,
      }),
      sendEmailWithRetry(transporter, {
        from,
        to: env.companyNotificationEmail,
        subject: `New contact form message from ${payload.name}`,
        text: `A new message was submitted on the website.\n\nName: ${payload.name}\nEmail: ${payload.email}\nPhone: ${payload.phone || "Not provided"}\nMessage:\n${payload.message}`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
            <h2 style="margin-bottom: 16px;">New contact form message</h2>
            <p><strong>Name:</strong> ${payload.name}</p>
            <p><strong>Email:</strong> ${payload.email}</p>
            <p><strong>Phone:</strong> ${payload.phone || "Not provided"}</p>
            <p><strong>Message:</strong></p>
            <blockquote style="margin: 0; padding-left: 16px; border-left: 4px solid #800000; color: #334155;">${payload.message}</blockquote>
          </div>
        `,
      }),
    ]);
  } catch (error) {
    console.error("Email service error (contact):", error instanceof Error ? error.message : error);
    throw error;
  }
};

export const sendGetStartedEmails = async (payload: GetStartedEmailPayload) => {
  try {
    const transporter = getTransporter();
    const from = `"${env.smtpFromName}" <${env.smtpUser}>`;

    await Promise.all([
      sendEmailWithRetry(transporter, {
        from,
        to: payload.email,
        subject: "Thanks — we received your request",
        text: `Hi ${payload.name},\n\nThanks for getting started with NexyraSoft. We'll reach out within 24 hours.\n\nBest regards,\nNexyraSoft`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
            <p>Hi ${payload.name},</p>
            <p>Thanks for getting started with NexyraSoft. We'll reach out to you within <strong>24 hours</strong>.</p>
            <p style="margin-top: 24px;">Best regards,<br/>NexyraSoft</p>
          </div>
        `,
      }),
      sendEmailWithRetry(transporter, {
        from,
        to: env.companyNotificationEmail,
        subject: `New "Get Started" lead from ${payload.name}`,
        text: `A new get-started lead was submitted.\n\nName: ${payload.name}\nEmail: ${payload.email}\nPhone: ${payload.phone || "Not provided"}\nMessage:\n${payload.message}`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
            <h2 style="margin-bottom: 16px;">New Get Started lead</h2>
            <p><strong>Name:</strong> ${payload.name}</p>
            <p><strong>Email:</strong> ${payload.email}</p>
            <p><strong>Phone:</strong> ${payload.phone || "Not provided"}</p>
            <p><strong>Message:</strong></p>
            <blockquote style="margin: 0; padding-left: 16px; border-left: 4px solid #800000; color: #334155;">${payload.message}</blockquote>
          </div>
        `,
      }),
    ]);
  } catch (error) {
    console.error("Email service error (get-started):", error instanceof Error ? error.message : error);
    throw error;
  }
};

export const sendServiceRequestEmails = async (payload: ServiceRequestEmailPayload) => {
  try {
    const transporter = getTransporter();
    const from = `"${env.smtpFromName}" <${env.smtpUser}>`;

    await Promise.all([
      sendEmailWithRetry(transporter, {
        from,
        to: payload.email,
        subject: `We've received your ${payload.serviceName} request`,
        text: `Hi ${payload.name},\n\nWe've received your service request and will get back to you within 24 hours.\n\nService: ${payload.serviceName}\nBudget: ${payload.budget}\nYour request:\n${payload.message}\n\nBest regards,\nNexyraSoft`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
            <p>Hi ${payload.name},</p>
            <p>We've received your service request and will get back to you within <strong>24 hours</strong>.</p>
            <p><strong>Service:</strong> ${payload.serviceName}</p>
            <p><strong>Budget:</strong> ${payload.budget}</p>
            <p><strong>Your request:</strong></p>
            <blockquote style="margin: 0; padding-left: 16px; border-left: 4px solid #800000; color: #334155;">${payload.message}</blockquote>
            <p style="margin-top: 24px;">Best regards,<br/>NexyraSoft</p>
          </div>
        `,
      }),
      sendEmailWithRetry(transporter, {
        from,
        to: env.companyNotificationEmail,
        subject: `New ${payload.serviceName} service request from ${payload.name}`,
        text: `A new service request was submitted.\n\nName: ${payload.name}\nEmail: ${payload.email}\nPhone: ${payload.phone || "Not provided"}\nService: ${payload.serviceName}\nBudget: ${payload.budget}\nMessage:\n${payload.message}`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
            <h2 style="margin-bottom: 16px;">New service request</h2>
            <p><strong>Name:</strong> ${payload.name}</p>
            <p><strong>Email:</strong> ${payload.email}</p>
            <p><strong>Phone:</strong> ${payload.phone || "Not provided"}</p>
            <p><strong>Service:</strong> ${payload.serviceName}</p>
            <p><strong>Budget:</strong> ${payload.budget}</p>
            <p><strong>Message:</strong></p>
            <blockquote style="margin: 0; padding-left: 16px; border-left: 4px solid #800000; color: #334155;">${payload.message}</blockquote>
          </div>
        `,
      }),
    ]);
  } catch (error) {
    console.error("Email service error (service-request):", error instanceof Error ? error.message : error);
    throw error;
  }
};
