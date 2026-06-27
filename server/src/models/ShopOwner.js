// src/models/ShopOwner.js
//
// Minimal by design — the Shop Owner module itself is deferred per the
// product spec, but auth middleware needs SOME owner identity to verify
// a JWT against. This is the smallest schema that unblocks that, without
// building out a feature we were explicitly told to skip for now.

import mongoose from 'mongoose';

const shopOwnerSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  },
  { timestamps: true }
);

const ShopOwner = mongoose.model('ShopOwner', shopOwnerSchema);
export default ShopOwner;
