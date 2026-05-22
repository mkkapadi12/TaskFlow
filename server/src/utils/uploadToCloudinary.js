import cloudinary from '../config/cloudinary.js';
import { AppError } from '../middlewares/error.middleware.js';

const uploadToCloudinary = (buffer, folder = 'my_database/images') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) reject(new AppError('Image upload failed.', 500));
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};

// ── NEW: documents (raw resource_type) ──────────────────────
export const uploadDocToCloudinary = (
  buffer,
  originalName,
  folder = 'my_database/documents'
) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      {
        folder,
        resource_type: 'raw', // non-image files
        public_id: `${Date.now()}_${originalName.replace(/\s+/g, '_')}`,
        use_filename: false,
        unique_filename: true,
      },
      (error, result) => {
        if (error) reject(new AppError('Document upload failed.', 500));
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};

export default uploadToCloudinary;
