import { Router } from "express";
import { changePassword, login, logout, me } from "../controllers/authController";
import { requireAuth } from "../middleware/auth";

const router = Router();

// NOTE: Public signup is disabled. Users are created by admins only via /api/users.
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", requireAuth, me);
router.post("/change-password", requireAuth, changePassword);

export const authRoutes = router;
