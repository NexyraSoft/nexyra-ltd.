import { Router } from "express";
import { createUser, deleteUser, getUsers } from "../controllers/authController";
import { requireAdmin, requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);
router.use(requireAdmin);

router.get("/", getUsers);
router.post("/", createUser);
router.delete("/:id", deleteUser);

export default router;
