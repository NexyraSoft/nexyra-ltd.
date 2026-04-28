import { Router } from "express";
import { createVacancy, deleteVacancy, getVacancies, updateVacancy } from "../controllers/vacancyController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

router.use(requireAuth);
router.use(requireRole("admin", "editor"));

router.get("/", getVacancies);
router.post("/", createVacancy);
router.put("/:id", updateVacancy);
router.delete("/:id", deleteVacancy);

export default router;
