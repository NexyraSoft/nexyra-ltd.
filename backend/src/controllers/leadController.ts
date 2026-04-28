import { Request, Response } from "express";
import { Lead } from "../models/Lead";

export const getLeads = async (req: Request, res: Response) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch leads" });
  }
};

export const getLead = async (req: Request, res: Response) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch lead" });
  }
};

export const updateLead = async (req: Request, res: Response) => {
  try {
    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedLead) return res.status(404).json({ message: "Lead not found" });
    res.json(updatedLead);
  } catch (error) {
    res.status(500).json({ message: "Failed to update lead" });
  }
};

export const deleteLead = async (req: Request, res: Response) => {
  try {
    const deletedLead = await Lead.findByIdAndDelete(req.params.id);
    if (!deletedLead) return res.status(404).json({ message: "Lead not found" });
    res.json({ message: "Lead deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete lead" });
  }
};
