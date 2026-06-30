// src/models/Shop.js

import mongoose from "mongoose";
import { SHOP_STATUS, DEFAULT_MAX_QUEUE_COUNT } from "./constants.js";

const shopSchema = new mongoose.Schema(
  {
    // ==========================
    // Shop Details
    // ==========================
    // name = shopName
    shopName: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    openingTime: {
      type: String,
      required: false,
    },

    closingTime: {
      type: String,
      required: false,
    },

    // ==========================
    // Owner Details
    // ==========================
    ownerName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    mobile: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    // ==========================
    // Admin Approval
    // ==========================
    approvalStatus: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    // ==========================
    // Shop Operational Status
    // ==========================
    status: {
      type: String,
      enum: SHOP_STATUS,
      default: "CLOSED",
      required: true,
    },

    // ==========================
    // Queue Information
    // ==========================
    queueCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    maxQueueCount: {
      type: Number,
      default: DEFAULT_MAX_QUEUE_COUNT,
    },

    // ==========================
    // Printing Prices
    // ==========================
    pricing: {
      bwSingle: {
        type: Number,
        default: 2,
      },

      bwDouble: {
        type: Number,
        default: 3,
      },

      colorSingle: {
        type: Number,
        default: 10,
      },

      colorDouble: {
        type: Number,
        default: 18,
      },
      // Flat per-sheet urgent add-on, matching the spec's example:
      // "Urgent = 8 x Rs.1 = Rs.8" (not a percentage surcharge).
      urgentSurchargePerSheet: {
        type: Number,
        default: 1,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Shop = mongoose.model("Shop", shopSchema);

export default Shop;