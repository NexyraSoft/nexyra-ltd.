import { Router } from "express";
import { handleChatbotMessage } from "../controllers/chatbotController";

const router = Router();

router.post("/", handleChatbotMessage);

export const chatbotRoutes = router;
