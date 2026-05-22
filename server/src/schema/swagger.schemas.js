/**
 * @swagger
 * components:
 *   schemas:
 *     # ── Auth ────────────────────────────────────────────
 *     RegisterInput:
 *       type: object
 *       required: [name, email, password]
 *       properties:
 *         name:
 *           type: string
 *           minLength: 3
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *         password:
 *           type: string
 *           minLength: 6
 *           example: secret123
 *         role:
 *           type: string
 *           enum: [USER, ADMIN]
 *           default: USER
 *         phone:
 *           type: integer
 *           example: 9876543210
 *         avatar:
 *           type: string
 *
 *     LoginInput:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *         password:
 *           type: string
 *           example: secret123
 *
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             user:
 *               $ref: '#/components/schemas/User'
 *             token:
 *               type: string
 *               example: eyJhbGciOiJIUzI1NiIs...
 *
 *     ForgotPasswordInput:
 *       type: object
 *       required: [email]
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *
 *     ForgotPasswordResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: If that email exists, we have sent a reset link.
 *         data:
 *           type: object
 *           description: |
 *             In development mode only, the reset URL is returned here for testing.
 *             In production this object is empty.
 *           properties:
 *             resetUrl:
 *               type: string
 *               example: http://localhost:5173/reset-password?token=eyJhbGc...
 *
 *     ResetPasswordInput:
 *       type: object
 *       required: [token, password]
 *       properties:
 *         token:
 *           type: string
 *           description: The 15-minute JWT issued by /auth/forgot-password
 *           example: eyJhbGciOiJIUzI1NiIs...
 *         password:
 *           type: string
 *           minLength: 6
 *           example: newSecret123
 *
 *     ChangePasswordInput:
 *       type: object
 *       required: [currentPassword, newPassword, confirmPassword]
 *       properties:
 *         currentPassword:
 *           type: string
 *           example: secret123
 *         newPassword:
 *           type: string
 *           minLength: 6
 *           example: newSecret123
 *         confirmPassword:
 *           type: string
 *           minLength: 6
 *           example: newSecret123
 *
 *     # ── User ────────────────────────────────────────────
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           example: john@example.com
 *         avatar:
 *           type: string
 *           nullable: true
 *         phone:
 *           type: integer
 *           nullable: true
 *         role:
 *           type: string
 *           enum: [USER, ADMIN]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     UpdateUserInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Jane Doe
 *         phone:
 *           type: integer
 *           example: 9876543210
 *         avatar:
 *           type: string
 *           format: binary
 *           description: Image file (jpeg/png/webp, max 5 MB)
 *
 *     # ── Project ─────────────────────────────────────────
 *     Project:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: Website Redesign
 *         description:
 *           type: string
 *           example: Revamp the company landing page
 *         ownerId:
 *           type: integer
 *           example: 1
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     ProjectDetails:
 *       allOf:
 *         - $ref: '#/components/schemas/Project'
 *         - type: object
 *           properties:
 *             members:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProjectMember'
 *             tasks:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *
 *     CreateProjectInput:
 *       type: object
 *       required: [title, description]
 *       properties:
 *         title:
 *           type: string
 *           example: Website Redesign
 *         description:
 *           type: string
 *           example: Revamp the company landing page
 *
 *     UpdateProjectInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: Website Redesign v2
 *         description:
 *           type: string
 *           example: Updated scope
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *
 *     # ── Project Member ──────────────────────────────────
 *     ProjectMember:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         userId:
 *           type: integer
 *         projectId:
 *           type: integer
 *         role:
 *           type: string
 *           enum: [OWNER, ADMIN, MEMBER]
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         avatar:
 *           type: string
 *           nullable: true
 *         joinedAt:
 *           type: string
 *           format: date-time
 *
 *     AddMemberInput:
 *       type: object
 *       required: [userId]
 *       properties:
 *         userId:
 *           type: integer
 *           example: 2
 *         role:
 *           type: string
 *           enum: [OWNER, ADMIN, MEMBER]
 *           example: MEMBER
 *
 *     UpdateMemberRoleInput:
 *       type: object
 *       required: [role]
 *       properties:
 *         role:
 *           type: string
 *           enum: [OWNER, ADMIN, MEMBER]
 *           example: ADMIN
 *
 *     RemoveMemberInput:
 *       type: object
 *       properties:
 *         reason:
 *           type: string
 *           description: |
 *             Optional reason. Forwarded to the member-removed email template
 *             (subject to the recipient's notification preferences).
 *           example: Reassigning to another project
 *
 *     # ── Task ────────────────────────────────────────────
 *     Task:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: Design landing page mockup
 *         description:
 *           type: string
 *           nullable: true
 *         status:
 *           type: string
 *           enum: [TODO, IN_PROGRESS, IN_REVIEW, DONE]
 *         priority:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH, URGENT]
 *         deadline:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         projectId:
 *           type: integer
 *         assigneeId:
 *           type: integer
 *           nullable: true
 *         creatorId:
 *           type: integer
 *         assigneeName:
 *           type: string
 *           nullable: true
 *         creatorName:
 *           type: string
 *         projectTitle:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateTaskInput:
 *       type: object
 *       required: [title, projectId]
 *       properties:
 *         title:
 *           type: string
 *           example: Design landing page mockup
 *         description:
 *           type: string
 *           example: Create wireframes and high-fidelity mockups
 *         status:
 *           type: string
 *           enum: [TODO, IN_PROGRESS, IN_REVIEW, DONE]
 *           default: TODO
 *         priority:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH, URGENT]
 *           default: MEDIUM
 *         deadline:
 *           type: string
 *           format: date-time
 *         projectId:
 *           type: integer
 *           example: 1
 *         assigneeId:
 *           type: integer
 *           example: 2
 *
 *     UpdateTaskInput:
 *       type: object
 *       description: |
 *         Updates task fields. The `status` field is intentionally NOT included —
 *         status changes go through PATCH /tasks/{taskId}/status or /verify.
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         priority:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH, URGENT]
 *         deadline:
 *           type: string
 *           format: date-time
 *         assigneeId:
 *           type: integer
 *
 *     UpdateTaskStatusInput:
 *       type: object
 *       required: [status]
 *       properties:
 *         status:
 *           type: string
 *           enum: [TODO, IN_PROGRESS, IN_REVIEW]
 *           description: |
 *             DONE is NOT accepted here. To set DONE, use PATCH /tasks/{taskId}/verify
 *             with `{ approve: true }` from the project owner.
 *
 *     VerifyTaskInput:
 *       type: object
 *       required: [approve]
 *       properties:
 *         approve:
 *           type: boolean
 *           description: |
 *             true  → task transitions IN_REVIEW → DONE
 *             false → task transitions IN_REVIEW → IN_PROGRESS
 *           example: true
 *
 *     # ── Documents ───────────────────────────────────────
 *     Document:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 12
 *         projectId:
 *           type: integer
 *           example: 1
 *         uploadedBy:
 *           type: integer
 *           example: 3
 *         name:
 *           type: string
 *           example: requirements.pdf
 *         url:
 *           type: string
 *           example: https://res.cloudinary.com/.../requirements.pdf
 *         publicId:
 *           type: string
 *           example: taskflow/docs/abcd1234
 *         size:
 *           type: integer
 *           description: File size in bytes
 *           example: 254832
 *         mimeType:
 *           type: string
 *           example: application/pdf
 *         createdAt:
 *           type: string
 *           format: date-time
 *         uploaderName:
 *           type: string
 *           example: Jane Doe
 *         uploaderAvatar:
 *           type: string
 *           nullable: true
 *
 *     # ── Notification Settings ───────────────────────────
 *     NotificationSettings:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           nullable: true
 *           description: Null when defaults are returned (no row saved yet)
 *         userId:
 *           type: integer
 *         welcome:
 *           type: integer
 *           enum: [0, 1]
 *           description: Receive welcome email on signup
 *         passwordReset:
 *           type: integer
 *           enum: [0, 1]
 *           description: Receive password reset / security emails
 *         memberAdded:
 *           type: integer
 *           enum: [0, 1]
 *           description: Notify when added to a project
 *         memberRemoved:
 *           type: integer
 *           enum: [0, 1]
 *           description: Notify when removed from a project
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     UpdateNotificationSettingsInput:
 *       type: object
 *       description: |
 *         All fields are optional. `null` (or omitted) preserves the existing value.
 *         Each toggle accepts 0 or 1.
 *       properties:
 *         welcome:
 *           type: integer
 *           enum: [0, 1]
 *         passwordReset:
 *           type: integer
 *           enum: [0, 1]
 *         memberAdded:
 *           type: integer
 *           enum: [0, 1]
 *         memberRemoved:
 *           type: integer
 *           enum: [0, 1]
 *
 *     # ── Generic ─────────────────────────────────────────
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: Something went wrong
 *         errors:
 *           type: array
 *           description: Present on Zod validation failures (400)
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *               message:
 *                 type: string
 */
