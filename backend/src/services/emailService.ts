import nodemailer from "nodemailer";
import { env } from "../config/env";

let cachedTransporter: any = null;

const createTransporter = () => {
  if (!env.smtpHost || !env.smtpPort || !env.smtpUser || !env.smtpPass) {
    throw new Error(
      "SMTP configuration incomplete. Set SMTP_HOST, SMTP_PORT, SMTP_USER and SMTP_PASS in environment."
    );
  }

  // Prefer direct SMTPS on port 465; otherwise use STARTTLS (requireTLS)
  const isSecure = env.smtpPort === 465 || env.smtpSecure === true;

  const transportOptions: any = {
    host: env.smtpHost,
    port: env.smtpPort,
    secure: isSecure,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass,
    },
    // timeouts to avoid hanging connections
    connectionTimeout: 15000,
    greetingTimeout: 5000,
    socketTimeout: 15000,
  };

  // Enforce STARTTLS when not connecting over SMTPS
  if (!isSecure) transportOptions.requireTLS = true;

  // In non-production environments, relax TLS verification to help with self-signed certs
  if (env.nodeEnv !== "production") {
    transportOptions.tls = Object.assign({}, transportOptions.tls, { rejectUnauthorized: false });
  }

  const transporter = nodemailer.createTransport(transportOptions);

  // Verify transporter early so failures are visible in logs
  transporter
    .verify()
    .then(() => console.log("SMTP transporter verified"))
    .catch((err: any) => console.error("Failed to verify SMTP transporter:", err instanceof Error ? err.message : err));

  return transporter;
};

const getTransporter = () => {
  if (!cachedTransporter) cachedTransporter = createTransporter();
  return cachedTransporter;
};

const closeCachedTransporter = (transporter: any) => {
  try {
    if (transporter && typeof transporter.close === "function") transporter.close();
  } catch (err) {
    console.warn("Error closing transporter:", err);
  }
  cachedTransporter = null;
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

const sendEmailWithRetry = async (
  transporter: any,
  mailOptions: any,
  retries = 2,
  perAttemptTimeoutMs = 15000
) => {
  const sendWithTimeout = (opts: any) => {
    return Promise.race([
      transporter.sendMail(opts),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Email send timeout")), perAttemptTimeoutMs)),
    ]);
  };

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const result = await sendWithTimeout(mailOptions);
      console.log(`✓ Email sent successfully to ${mailOptions.to}`);
      return result;
    } catch (error: any) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error(`Email attempt ${attempt + 1} failed for ${mailOptions.to}:`, msg);

      // For connection/auth/timeouts, reset cached transporter so next attempt recreates connection
      if (/timeout|ECONNRESET|ETIMEDOUT|ENOTFOUND|Authorization/i.test(msg)) {
        try {
          closeCachedTransporter(transporter);
        } catch (_err) {
          /* ignore */
        }
      }

      if (attempt === retries - 1) throw error;

      // exponential backoff with jitter
      const backoff = Math.min(1000 * Math.pow(2, attempt), 20000);
      await new Promise((r) => setTimeout(r, backoff + Math.floor(Math.random() * 500)));
    }
  }
};

export const sendContactEmails = async (payload: ContactEmailPayload) => {
  try {
    const transporter = getTransporter();
    const from = env.smtpFromName ? `"${env.smtpFromName}" <${env.smtpUser}>` : env.smtpUser;

    if (!env.companyNotificationEmail) {
      throw new Error("COMPANY_NOTIFICATION_EMAIL is not configured");
    }

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
    const from = env.smtpFromName ? `"${env.smtpFromName}" <${env.smtpUser}>` : env.smtpUser;

    if (!env.companyNotificationEmail) {
      throw new Error("COMPANY_NOTIFICATION_EMAIL is not configured");
    }

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
    const from = env.smtpFromName ? `"${env.smtpFromName}" <${env.smtpUser}>` : env.smtpUser;

    if (!env.companyNotificationEmail) {
      throw new Error("COMPANY_NOTIFICATION_EMAIL is not configured");
    }

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
