import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import Shop from "../models/Shop.js";
import { sendShopApprovedEmail, sendShopRejectedEmail } from '../services/emailService.js';

function generateAdminToken(adminId) {
    return jwt.sign(
        { adminId },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "7d",
        }
    );
}

export const loginAdmin = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });

    if (!admin) {
        res.status(401);
        throw new Error("Invalid username or password.");
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
        res.status(401);
        throw new Error("Invalid username or password.");
    }

    res.json({
        success: true,
        token: generateAdminToken(admin._id),
        admin: {
            id: admin._id,
            username: admin.username,
            role: admin.role,
        },
    });
});


export const getPendingShops = asyncHandler(async (req, res) => {
    const pendingShops = await Shop.find({
        approvalStatus: "PENDING",
    }).select(
        "shopName ownerName email mobile address approvalStatus createdAt"
    );

    res.json({
        success: true,
        count: pendingShops.length,
        shops: pendingShops,
    });
});

export const approveShop = asyncHandler(async (req, res) => {
    const shop = await Shop.findById(req.params.id);

    if (!shop) {
        res.status(404);
        throw new Error("Shop not found.");
    }

    if (shop.approvalStatus === "APPROVED") {
        res.status(400);
        throw new Error("Shop is already approved.");
    }

    shop.approvalStatus = "APPROVED";

    await shop.save();
    sendShopApprovedEmail(shop);

    const responseShop = await Shop.findById(shop._id).select("-password");

    res.json({
        success: true,
        message: "Shop approved successfully.",
        shop: responseShop,
    });
});

export const rejectShop = asyncHandler(async (req, res) => {
    const shop = await Shop.findById(req.params.id);

    if (!shop) {
        res.status(404);
        throw new Error("Shop not found.");
    }

    if (shop.approvalStatus === "REJECTED") {
        res.status(400);
        throw new Error("Shop is already rejected.");
    }

    shop.approvalStatus = "REJECTED";

    await shop.save();
    sendShopRejectedEmail(shop);

    const responseShop = shop.toObject();
    delete responseShop.password;

    res.json({
        success: true,
        message: "Shop rejected successfully.",
        shop: responseShop,
    });
});

export const getApprovedShops = asyncHandler(async (req, res) => {
    const approvedShops = await Shop.find({
        approvalStatus: "APPROVED",
    }).select(
        "-password"
    );

    res.json({
        success: true,
        count: approvedShops.length,
        shops: approvedShops,
    });
});

export const getRejectedShops = asyncHandler(async (req, res) => {
    const rejectedShops = await Shop.find({
        approvalStatus: "REJECTED",
    }).select("-password");

    res.json({
        success: true,
        count: rejectedShops.length,
        shops: rejectedShops,
    });
});