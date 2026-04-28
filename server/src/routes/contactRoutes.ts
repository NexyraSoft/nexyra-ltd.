import { Router } from "express";
import {
  getContacts,
  submitContact,
  submitGetStartedLead,
  submitServiceRequest,
} from "../controllers/contactController";
import { requireAdmin, requireAuth } from "../middleware/auth";

const router = Router();

router.get("/contact", requireAuth, requireAdmin, getContacts);
router.post("/contact", submitContact);
router.post("/leads/get-started", submitGetStartedLead);
router.post("/leads/service-request", submitServiceRequest);

export const contactRoutes = router;
