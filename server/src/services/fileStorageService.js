// src/services/fileStorageService.js
//
// Abstraction over file storage. Swapping mock -> real Cloudinary is
// contained entirely to THIS FILE — nothing else in the codebase imports
// cloudinary directly or knows which storage backend is active.
//
// resource_type is set to 'auto' so Cloudinary correctly stores PDFs/PPTX
// (which are NOT images) as well as actual image files, all through the
// same upload call — 'image' alone would mishandle non-image files.

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { v2 as cloudinary } from 'cloudinary';
import { IMAGE_MIME_TYPES } from '../models/constants.js';

function useMockStorage() {
  return process.env.USE_MOCK_STORAGE !== "false";
}

const MOCK_UPLOAD_DIR = path.join(process.cwd(), 'mock-uploads');

function ensureMockDirExists() {
  if (!fs.existsSync(MOCK_UPLOAD_DIR)) {
    fs.mkdirSync(MOCK_UPLOAD_DIR, { recursive: true });
  }
}

let cloudinaryConfigured = false;
function ensureCloudinaryConfigured() {
  if (cloudinaryConfigured) return;

  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error(
      'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env, or set USE_MOCK_STORAGE=true for local dev.'
    );
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  cloudinaryConfigured = true;
}

function uploadBufferToCloudinary(buffer, options) {
  ensureCloudinaryConfigured();
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    stream.end(buffer);
  });
}

/**
 * Uploads a single file buffer and returns a stored-file descriptor.
 * @param {Object} file - multer file object (buffer, originalname, mimetype, size)
 * @returns {Promise<{ fileUrl: string, fileName: string, fileSize: number }>}
 */
export async function uploadFile(file) {
  if (useMockStorage()) {
    ensureMockDirExists();
    const ext = path.extname(file.originalname);
    const storedName = `${crypto.randomUUID()}${ext}`;
    fs.writeFileSync(path.join(MOCK_UPLOAD_DIR, storedName), file.buffer);

    return {
      fileUrl: `/mock-uploads/${storedName}`,
      fileName: file.originalname,
      fileSize: file.size,
    };
  }

  // 'auto' lets Cloudinary detect image vs. raw document correctly — using
  // 'image' here would mishandle PDFs/PPTX, which aren't images.
  const resourceType = IMAGE_MIME_TYPES.includes(file.mimetype) ? 'image' : 'raw';

  const result = await uploadBufferToCloudinary(file.buffer, {
    resource_type: resourceType,
    folder: 'printgo-orders',
    // Keep the original filename recognizable in the Cloudinary dashboard
    // and in the secure_url, without the extension (Cloudinary appends it).
    filename_override: path.parse(file.originalname).name,
    use_filename: true,
    unique_filename: true, // avoids collisions between students uploading same-named files
  });

  return {
    fileUrl: result.secure_url,
    publicId: result.public_id,
    fileName: file.originalname,
    fileSize: file.size,
  };
}

/**
 * Uploads multiple files, preserving order.
 */
export async function uploadFiles(files) {
  return Promise.all(files.map(uploadFile));
}

/**
 * Delete file from Cloudinary using publicId
 */
export async function deleteFile(publicId, resourceType = "raw") {
  ensureCloudinaryConfigured();

  return cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
}
