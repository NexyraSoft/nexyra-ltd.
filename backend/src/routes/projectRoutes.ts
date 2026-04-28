import { Router } from "express";
import { getProjects, getProject, createProject, updateProject, deleteProject } from "../controllers/projectController";
import { requireAuth, requireAdmin } from "../middleware/auth";

const router = Router();

router.use(requireAuth);
router.use(requireAdmin);

router.get("/", getProjects);
router.get("/:id", getProject);
router.post("/", createProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;
