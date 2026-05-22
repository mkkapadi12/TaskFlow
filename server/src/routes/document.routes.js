import { Router } from 'express';

import {
  deleteDocument,
  getDocuments,
  uploadDocuments,
} from '../controllers/document.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { uploadDoc } from '../middlewares/upload.middleware.js';

const router = Router({ mergeParams: true }); // ← mergeParams for projectId

router.get('/', protect, getDocuments);

// multer: array('documents', 5) → max 5 files, field name 'documents'
router.post('/', protect, uploadDoc.array('documents', 5), uploadDocuments);

router.delete('/:documentId', protect, deleteDocument);

export default router;
