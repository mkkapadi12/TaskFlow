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
 *     UpdateUser:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Jane Doe
 *         role:
 *           type: string
 *           enum: [USER, ADMIN]
 *
 *     # ── Project ─────────────────────────────────────────
 *     Project:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Website Redesign
 *         description:
 *           type: string
 *           example: Revamp the company landing page
 *         ownerId:
 *           type: integer
 *           example: 1
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateProjectInput:
 *       type: object
 *       required: [name]
 *       properties:
 *         name:
 *           type: string
 *           example: Website Redesign
 *         description:
 *           type: string
 *           example: Revamp the company landing page
 *
 *     UpdateProjectInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
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
 *         name:
 *           type: string
 *         email:
 *           type: string
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
 *           example: MEMBER
 *
 *     UpdateMemberRoleInput:
 *       type: object
 *       required: [role]
 *       properties:
 *         role:
 *           type: string
 *           example: LEAD
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
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *           enum: [TODO, IN_PROGRESS, IN_REVIEW, DONE]
 *         priority:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH, URGENT]
 *         deadline:
 *           type: string
 *           format: date-time
 *         assigneeId:
 *           type: integer
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
 */
