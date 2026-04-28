import dotenv from "dotenv";

dotenv.config();

const toNumber = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const env = {
  port: toNumber(process.env.PORT, 5000),
  mongoUri: process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/nexyrasoft",
  jwtSecret: process.env.JWT_SECRET ?? "change-me-in-production",
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:3000",
  nodeEnv: process.env.NODE_ENV ?? "development",
  smtpHost: process.env.SMTP_HOST ?? "smtp.gmail.com",
  smtpPort: toNumber(process.env.SMTP_PORT, 587),
  smtpSecure: process.env.SMTP_SECURE === "true",
  smtpUser: process.env.SMTP_USER ?? "",
  smtpPass: process.env.SMTP_PASS ?? "",
  smtpFromName: process.env.SMTP_FROM_NAME ?? "NexyraSoft",
  companyNotificationEmail: process.env.COMPANY_NOTIFICATION_EMAIL ?? "nexyrasoft@gmail.com",
};
