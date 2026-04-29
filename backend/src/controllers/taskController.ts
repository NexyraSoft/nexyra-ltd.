import { Request, Response } from "express";
import { Task } from "../models/Task";

export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "name email")
      .populate("relatedProject", "title")
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error("Failed to fetch tasks", error);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

export const getTask = async (req: Request, res: Response) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "name email")
      .populate("relatedProject", "title");
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (error) {
    console.error("Failed to fetch task", error);
    res.status(500).json({ message: "Failed to fetch task" });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const newTask = await Task.create(req.body);
    const populatedTask = await Task.findById(newTask._id)
      .populate("assignedTo", "name email")
      .populate("relatedProject", "title");
    res.status(201).json(populatedTask);
  } catch (error) {
    console.error("Failed to create task", error);
    res.status(500).json({ message: "Failed to create task" });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
      .populate("assignedTo", "name email")
      .populate("relatedProject", "title");
      
    if (!updatedTask) return res.status(404).json({ message: "Task not found" });
    res.json(updatedTask);
  } catch (error) {
    console.error("Failed to update task", error);
    res.status(500).json({ message: "Failed to update task" });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Failed to delete task", error);
    res.status(500).json({ message: "Failed to delete task" });
  }
};
