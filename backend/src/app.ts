import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { authRoutes } from "./routes/authRoutes";
import { contactRoutes } from "./routes/contactRoutes";
import { dashboardRoutes } from "./routes/dashboardRoutes";
import careersRoutes from "./routes/careersRoutes";
import { chatbotRoutes } from "./routes/chatbotRoutes";
import clientRoutes from "./routes/clientRoutes";
import projectRoutes from "./routes/projectRoutes";
import leadRoutes from "./routes/leadRoutes";
import taskRoutes from "./routes/taskRoutes";
import userRoutes from "./routes/userRoutes";
import vacancyRoutes from "./routes/vacancyRoutes";
import { errorHandler } from "./middleware/errorHandler";

export const app = express();

app.use(
  cors({
    origin: [env.clientUrl, "https://nexyra-ltd-frontend.vercel.app"],
    credentials: true,
  }),
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// Health check endpoint for deployment monitoring
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api", contactRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/careers", careersRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);
app.use("/api/vacancies", vacancyRoutes);

app.use(errorHandler);
