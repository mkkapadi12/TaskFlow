import multer from 'multer';

import { AppError } from './error.middleware.js';

const storage = multer.memoryStorage(); // buffer → Cloudinary, no disk

const imageFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Only jpeg, png, webp allowed.', 400), false);
  }
};

const upload = multer({
  storage,
  imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// ── NEW: documents ───────────────────────────────────────────
const ALLOWED_DOC_TYPES = [
  // PDF
  'application/pdf',

  // Word
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',

  // Excel
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

  // PowerPoint
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',

  // Text
  'text/plain',

  // Markdown
  'text/markdown',
  'text/x-markdown',

  // Images
  'image/jpeg',
  'image/png',
  'image/webp',

  //json
  'application/json',
  'text/x-json',
];

const documentFilter = (req, file, cb) => {
  if (ALLOWED_DOC_TYPES.includes(file.mimetype)) return cb(null, true);
  cb(new AppError('File type not allowed.', 400), false);
};

export const uploadDoc = multer({
  storage,
  fileFilter: documentFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB per file
});

export default upload;
