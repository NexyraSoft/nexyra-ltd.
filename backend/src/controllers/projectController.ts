import { Request, Response } from "express";
import { Project } from "../models/Project";

export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await Project.find().populate("client", "name company email").sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error("Failed to fetch projects", error);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

export const getProject = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id).populate("client", "name company email");
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (error) {
    console.error("Failed to fetch project", error);
    res.status(500).json({ message: "Failed to fetch project" });
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    const { title, description, client, status, deadline, budget } = req.body;
    
    if (!title || !client) {
      return res.status(400).json({ message: "Title and client are required." });
    }

    const newProject = await Project.create({
      title, description, client, status, deadline, budget
    });
    
    const populatedProject = await Project.findById(newProject._id).populate("client", "name company email");
    res.status(201).json(populatedProject);
  } catch (error) {
    console.error("Failed to create project", error);
    res.status(500).json({ message: "Failed to create project" });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("client", "name company email");
    
    if (!updatedProject) return res.status(404).json({ message: "Project not found" });
    res.json(updatedProject);
  } catch (error) {
    console.error("Failed to update project", error);
    res.status(500).json({ message: "Failed to update project" });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject) return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Failed to delete project", error);
    res.status(500).json({ message: "Failed to delete project" });
  }
};
