/**
 * @swagger
 * tags:
 *   name: Documents
 *   description: |
 *     Per-project document storage. Files are streamed to Cloudinary as
 *     `resource_type: raw` and metadata is persisted in `project_documents`.
 *     Upload and delete are restricted to project owner/admin; listing is open
 *     to any project member.
 */

/**
 * @swagger
 * /projects/{projectId}/documents:
 *   get:
 *     summary: List all documents on a project
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *     responses:
 *       200:
 *         description: List of documents (newest first), with uploader info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Document'
 *       403:
 *         description: Not a member of this project
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /projects/{projectId}/documents:
 *   post:
 *     summary: Upload one or more documents to a project (owner/admin only)
 *     description: |
 *       Multipart form. Field name is `documents`. Up to **5 files** per request,
 *       **20 MB** each. Allowed mime types include PDF, Word (.doc/.docx), Excel
 *       (.xls/.xlsx), PowerPoint (.ppt/.pptx), Markdown, plain text, and images
 *       (jpeg/png/webp). Each buffer is streamed to Cloudinary and persisted via
 *       `sp_CreateProjectDocument`.
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [documents]
 *             properties:
 *               documents:
 *                 type: array
 *                 maxItems: 5
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Documents uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: 2 document(s) uploaded successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Document'
 *       400:
 *         description: No files attached, or unsupported file type
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Not authorized (must be project owner/admin)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /projects/{projectId}/documents/{documentId}:
 *   delete:
 *     summary: Delete a document (owner/admin only)
 *     description: |
 *       Deletes the file from Cloudinary first, then drops the metadata row.
 *       Authorization is checked against the project that owns the document.
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID (URL scoping only — auth uses the document's actual project)
 *       - in: path
 *         name: documentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Document ID
 *     responses:
 *       200:
 *         description: Document deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       403:
 *         description: Not authorized (must be project owner/admin)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Document not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
