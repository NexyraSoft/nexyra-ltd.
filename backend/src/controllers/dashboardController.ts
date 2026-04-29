import { Request, Response } from "express";
import { ContactMessage } from "../models/ContactMessage";
import { Lead } from "../models/Lead";

export const getDashboard = async (req: Request, res: Response) => {
  try {
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
  } catch (error) {
    console.error("Failed to fetch dashboard data", error);
    return res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
};
