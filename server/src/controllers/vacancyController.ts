import { Request, Response } from "express";
import mongoose from "mongoose";
import { JobVacancy } from "../models/JobVacancy";

const normalizeVacancyPayload = (body: Record<string, unknown>) => ({
  title: typeof body.title === "string" ? body.title.trim() : body.title,
  summary: typeof body.summary === "string" ? body.summary.trim() : body.summary,
  description: typeof body.description === "string" ? body.description.trim() : body.description,
  category: body.category,
  location: typeof body.location === "string" ? body.location.trim() : body.location,
  employmentType: body.employmentType || undefined,
  status: body.status,
});

const handleVacancyError = (res: Response, error: unknown, fallbackMessage: string) => {
  if (error instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({ message: error.message });
  }

  if (error instanceof mongoose.Error.CastError) {
    return res.status(400).json({ message: "Invalid vacancy identifier." });
  }

  return res.status(500).json({ message: fallbackMessage });
};

export const getVacancies = async (_req: Request, res: Response) => {
  try {
    const vacancies = await JobVacancy.find().sort({ createdAt: -1 });
    res.json(vacancies);
  } catch (error) {
    handleVacancyError(res, error, "Failed to fetch vacancies");
  }
};

export const getPublicCareers = async (_req: Request, res: Response) => {
  try {
    const vacancies = await JobVacancy.find({ status: "Active" }).sort({ createdAt: -1 });
    res.json(vacancies);
  } catch (error) {
    handleVacancyError(res, error, "Failed to fetch careers");
  }
};

export const createVacancy = async (req: Request, res: Response) => {
  try {
    const newVacancy = await JobVacancy.create(normalizeVacancyPayload(req.body));
    res.status(201).json(newVacancy);
  } catch (error) {
    handleVacancyError(res, error, "Failed to create vacancy");
  }
};

export const updateVacancy = async (req: Request, res: Response) => {
  try {
    const updatedVacancy = await JobVacancy.findByIdAndUpdate(
      req.params.id,
      { $set: normalizeVacancyPayload(req.body) },
      { new: true, runValidators: true },
    );

    if (!updatedVacancy) {
      return res.status(404).json({ message: "Vacancy not found" });
    }

    res.json(updatedVacancy);
  } catch (error) {
    handleVacancyError(res, error, "Failed to update vacancy");
  }
};

export const deleteVacancy = async (req: Request, res: Response) => {
  try {
    const deletedVacancy = await JobVacancy.findByIdAndDelete(req.params.id);
    if (!deletedVacancy) {
      return res.status(404).json({ message: "Vacancy not found" });
    }

    res.json({ message: "Vacancy deleted successfully" });
  } catch (error) {
    handleVacancyError(res, error, "Failed to delete vacancy");
  }
};
