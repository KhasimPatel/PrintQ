import express from "express";
import { loginAdmin, getPendingShops, approveShop, rejectShop, getApprovedShops, getRejectedShops } from "../controllers/adminController.js";
import { protectAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

// Admin Authentication
router.post("/login", loginAdmin);
router.get("/shops/pending", protectAdmin, getPendingShops);
router.patch("/shops/:id/approve", protectAdmin, approveShop);
router.patch("/shops/:id/reject", protectAdmin, rejectShop);

router.get("/shops/approved", protectAdmin, getApprovedShops);
router.get("/shops/rejected",protectAdmin, getRejectedShops);

export default router;

