import nodemailer from "nodemailer";
import { env } from "../config/env";

const getTransporter = () => {
  if (!env.smtpUser || !env.smtpPass) {
    throw new Error("SMTP credentials are missing. Set SMTP_USER and SMTP_PASS in .env.");
  }

  return nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpSecure,
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

export const sendContactEmails = async (payload: ContactEmailPayload) => {
  const transporter = getTransporter();
  const from = `"${env.smtpFromName}" <${env.smtpUser}>`;

  await Promise.all([
    transporter.sendMail({
      from,
      to: payload.email,
      subject: "We've received your message",
      text: `Hi ${payload.name},

We've received your message and will get back to you within 24 hours.

Your message:
${payload.message}

Best regards,
NexyraSoft`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
          <p>Hi ${payload.name},</p>
          <p>We've received your message and will get back to you within <strong>24 hours</strong>.</p>
          <p><strong>Your message:</strong></p>
          <blockquote style="margin: 0; padding-left: 16px; border-left: 4px solid #800000; color: #334155;">
            ${payload.message}
          </blockquote>
          <p style="margin-top: 24px;">Best regards,<br />NexyraSoft</p>
        </div>
      `,
    }),
    transporter.sendMail({
      from,
      to: env.companyNotificationEmail,
      subject: `New contact form message from ${payload.name}`,
      text: `A new message was submitted on the website.

Name: ${payload.name}
Email: ${payload.email}
Phone: ${payload.phone || "Not provided"}
Message:
${payload.message}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
          <h2 style="margin-bottom: 16px;">New contact form message</h2>
          <p><strong>Name:</strong> ${payload.name}</p>
          <p><strong>Email:</strong> ${payload.email}</p>
          <p><strong>Phone:</strong> ${payload.phone || "Not provided"}</p>
          <p><strong>Message:</strong></p>
          <blockquote style="margin: 0; padding-left: 16px; border-left: 4px solid #800000; color: #334155;">
            ${payload.message}
          </blockquote>
        </div>
      `,
    }),
  ]);
};

export const sendGetStartedEmails = async (payload: GetStartedEmailPayload) => {
  const transporter = getTransporter();
  const from = `"${env.smtpFromName}" <${env.smtpUser}>`;

  await Promise.all([
    transporter.sendMail({
      from,
      to: payload.email,
      subject: "We've received your project request",
      text: `Hi ${payload.name},

We've received your project inquiry and will get back to you within 24 hours.

Your request:
${payload.message}

Best regards,
NexyraSoft`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
          <p>Hi ${payload.name},</p>
          <p>We've received your project inquiry and will get back to you within <strong>24 hours</strong>.</p>
          <p><strong>Your request:</strong></p>
          <blockquote style="margin: 0; padding-left: 16px; border-left: 4px solid #800000; color: #334155;">
            ${payload.message}
          </blockquote>
          <p style="margin-top: 24px;">Best regards,<br />NexyraSoft</p>
        </div>
      `,
    }),
    transporter.sendMail({
      from,
      to: env.companyNotificationEmail,
      subject: `New project inquiry from ${payload.name}`,
      text: `A new project inquiry was submitted on the website.

Name: ${payload.name}
Email: ${payload.email}
Phone: ${payload.phone}
Message:
${payload.message}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
          <h2 style="margin-bottom: 16px;">New project inquiry</h2>
          <p><strong>Name:</strong> ${payload.name}</p>
          <p><strong>Email:</strong> ${payload.email}</p>
          <p><strong>Phone:</strong> ${payload.phone}</p>
          <p><strong>Message:</strong></p>
          <blockquote style="margin: 0; padding-left: 16px; border-left: 4px solid #800000; color: #334155;">
            ${payload.message}
          </blockquote>
        </div>
      `,
    }),
  ]);
};

export const sendServiceRequestEmails = async (payload: ServiceRequestEmailPayload) => {
  const transporter = getTransporter();
  const from = `"${env.smtpFromName}" <${env.smtpUser}>`;

  await Promise.all([
    transporter.sendMail({
      from,
      to: payload.email,
      subject: `We've received your ${payload.serviceName} request`,
      text: `Hi ${payload.name},

We've received your service request and will get back to you within 24 hours.

Service: ${payload.serviceName}
Budget: ${payload.budget}
Your request:
${payload.message}

Best regards,
NexyraSoft`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
          <p>Hi ${payload.name},</p>
          <p>We've received your service request and will get back to you within <strong>24 hours</strong>.</p>
          <p><strong>Service:</strong> ${payload.serviceName}</p>
          <p><strong>Budget:</strong> ${payload.budget}</p>
          <p><strong>Your request:</strong></p>
          <blockquote style="margin: 0; padding-left: 16px; border-left: 4px solid #800000; color: #334155;">
            ${payload.message}
          </blockquote>
          <p style="margin-top: 24px;">Best regards,<br />NexyraSoft</p>
        </div>
      `,
    }),
    transporter.sendMail({
      from,
      to: env.companyNotificationEmail,
      subject: `New ${payload.serviceName} service request from ${payload.name}`,
      text: `A new service request was submitted on the website.

Name: ${payload.name}
Email: ${payload.email}
Phone: ${payload.phone}
Service: ${payload.serviceName}
Budget: ${payload.budget}
Message:
${payload.message}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
          <h2 style="margin-bottom: 16px;">New service request</h2>
          <p><strong>Name:</strong> ${payload.name}</p>
          <p><strong>Email:</strong> ${payload.email}</p>
          <p><strong>Phone:</strong> ${payload.phone}</p>
          <p><strong>Service:</strong> ${payload.serviceName}</p>
          <p><strong>Budget:</strong> ${payload.budget}</p>
          <p><strong>Message:</strong></p>
          <blockquote style="margin: 0; padding-left: 16px; border-left: 4px solid #800000; color: #334155;">
            ${payload.message}
          </blockquote>
        </div>
      `,
    }),
  ]);
};
