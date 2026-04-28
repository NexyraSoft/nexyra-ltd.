import { Request, Response } from "express";
import { Client } from "../models/Client";

export const getClients = async (req: Request, res: Response) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch clients" });
  }
};

export const getClient = async (req: Request, res: Response) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: "Client not found" });
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch client" });
  }
};

export const createClient = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, company, address, status, notes } = req.body;
    
    const existingClient = await Client.findOne({ email });
    if (existingClient) {
      return res.status(400).json({ message: "A client with this email already exists." });
    }

    const newClient = await Client.create({
      name, email, phone, company, address, status, notes
    });
    
    res.status(201).json(newClient);
  } catch (error) {
    res.status(500).json({ message: "Failed to create client" });
  }
};

export const updateClient = async (req: Request, res: Response) => {
  try {
    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedClient) return res.status(404).json({ message: "Client not found" });
    res.json(updatedClient);
  } catch (error) {
    res.status(500).json({ message: "Failed to update client" });
  }
};

export const deleteClient = async (req: Request, res: Response) => {
  try {
    const deletedClient = await Client.findByIdAndDelete(req.params.id);
    if (!deletedClient) return res.status(404).json({ message: "Client not found" });
    res.json({ message: "Client deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete client" });
  }
};
