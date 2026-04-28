import { Router } from "express";
import { getDashboard } from "../controllers/dashboardController";
import { requireAdmin, requireAuth } from "../middleware/auth";

const router = Router();

router.get("/", requireAuth, requireAdmin, getDashboard);

export const dashboardRoutes = router;
