import { Router } from "express";
import { search } from "../controllers/searchController.js";
import { verifyToken as protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", protect, search);

export default router;
