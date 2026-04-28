import { Router } from "express";
import { getPublicCareers } from "../controllers/vacancyController";

const router = Router();

router.get("/", getPublicCareers);

export default router;
