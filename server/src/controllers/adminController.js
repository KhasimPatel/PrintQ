import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

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