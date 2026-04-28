import { Request, Response } from "express";
import { ContactMessage } from "../models/ContactMessage";
import { Lead } from "../models/Lead";

export const getDashboard = async (req: Request, res: Response) => {
  const [contactCount, leadCount, recentContacts, recentLeads] = await Promise.all([
    ContactMessage.countDocuments(),
    Lead.countDocuments(),
    ContactMessage.find().sort({ createdAt: -1 }).limit(5),
    Lead.find().sort({ createdAt: -1 }).limit(5),
  ]);

  return res.json({
    message: `Welcome back, ${req.user?.name ?? "user"}.`,
    stats: {
      contactCount,
      leadCount,
    },
    recentContacts,
    recentLeads,
  });
};
