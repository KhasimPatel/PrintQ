// src/seed.js
//
// One-off script to create a single test shop, since nothing else in the
// system can be tested without one existing first (registerShopOwner needs
// a shopId; initiateOrder needs a shopId; etc.). Run once before you start
// Postman testing:
//
//   node src/seed.js
//
// Safe to re-run — it checks for an existing shop with the same name first.

import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import Shop from './models/Shop.js';

async function seed() {
  await connectDB();

  const existing = await Shop.findOne({ name: 'Sai Xerox & Stationary' });
  if (existing) {
    console.log('Test shop already exists:');
    console.log(JSON.stringify(existing, null, 2));
    await mongoose.disconnect();
    return;
  }

  const shop = await Shop.create({
    name: 'Sai Xerox & Stationary',
    address: 'Near VIIT Main Gate, Kondhwa, Pune',
    status: 'OPEN', // must be OPEN for orders to be accepted
    queueCount: 0,
    maxQueueCount: 20,
    pricing: {
      bwSingle: 2,
      bwDouble: 3,
      colorSingle: 10,
      colorDouble: 18,
      urgentSurchargePerSheet: 1,
    },
  });

  console.log('Created test shop. COPY THIS _id FOR POSTMAN TESTING:');
  console.log(JSON.stringify(shop, null, 2));

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
