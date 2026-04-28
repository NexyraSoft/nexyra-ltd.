import { Router } from "express";
import { getLeads, getLead, updateLead, deleteLead } from "../controllers/leadController";
import { requireAuth, requireAdmin } from "../middleware/auth";

const router = Router();

router.use(requireAuth);
router.use(requireAdmin);

router.get("/", getLeads);
router.get("/:id", getLead);
router.put("/:id", updateLead);
router.delete("/:id", deleteLead);

export default router;
