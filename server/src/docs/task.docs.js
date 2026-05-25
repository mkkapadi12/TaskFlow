/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management endpoints
 */

// ── Task CRUD ─────────────────────────────────────────────────

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task in a project
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTaskInput'
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       403:
 *         description: Not a member of the project
 */

/**
 * @swagger
 * /tasks/my:
 *   get:
 *     summary: Get tasks assigned to the logged-in user
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: List of assigned tasks
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
 *                     $ref: '#/components/schemas/Task'
 */

/**
 * @swagger
 * /tasks/overdue:
 *   get:
 *     summary: Get overdue tasks for the logged-in user
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: List of overdue tasks
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
 *                     $ref: '#/components/schemas/Task'
 */

/**
 * @swagger
 * /tasks/project/{projectId}:
 *   get:
 *     summary: Get tasks for a project (optional status filter)
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [TODO, IN_PROGRESS, IN_REVIEW, DONE]
 *         description: Filter tasks by status
 *     responses:
 *       200:
 *         description: List of project tasks
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
 *                     $ref: '#/components/schemas/Task'
 *       403:
 *         description: Not a member of the project
 */

/**
 * @swagger
 * /tasks/{taskId}:
 *   get:
 *     summary: Get a single task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 */

/**
 * @swagger
 * /tasks/{taskId}:
 *   put:
 *     summary: Update a task (owner/admin only)
 *     description: |
 *       Updates editable task fields — title, description, priority, deadline, and
 *       assignee. **Any `status` field in the body is ignored.** Use
 *       `PATCH /tasks/{taskId}/status` or `PATCH /tasks/{taskId}/verify` instead.
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTaskInput'
 *     responses:
 *       200:
 *         description: Task updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       403:
 *         description: Not authorized (must be project owner/admin)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Task not found
 */

/**
 * @swagger
 * /tasks/{taskId}/status:
 *   patch:
 *     summary: Move task between TODO, IN_PROGRESS, and IN_REVIEW
 *     description: |
 *       Callable by the task's assignee or by any project owner/admin.
 *       `DONE` is **not** an accepted value here — set it via
 *       `PATCH /tasks/{taskId}/verify` from the project owner.
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTaskStatusInput'
 *     responses:
 *       200:
 *         description: Status updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid status (e.g. attempted to set DONE)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Not the assignee or a project manager
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Task not found
 */

/**
 * @swagger
 * /tasks/{taskId}/verify:
 *   patch:
 *     summary: Verify a task in review (owner only)
 *     description: |
 *       The project owner approves or rejects work that the assignee has put up
 *       for review. The underlying SP requires the task's current status to be
 *       `IN_REVIEW` and will SIGNAL otherwise. Approve transitions to `DONE`;
 *       reject transitions back to `IN_PROGRESS`. **This is the only path to
 *       `DONE`.**
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyTaskInput'
 *     responses:
 *       200:
 *         description: Verification applied
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       400:
 *         description: Task is not currently in IN_REVIEW
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Caller is not the project owner
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Task not found
 */

/**
 * @swagger
 * /tasks/{taskId}:
 *   delete:
 *     summary: Delete a task (owner or creator only)
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Task not found
 *       403:
 *         description: Not authorized to delete
 */

/**
 * @swagger
 * /tasks/{taskId}/comments:
 *   post:
 *     summary: Add a comment to a task
 *     description: Any project member can comment on a task.
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCommentInput'
 *     responses:
 *       201:
 *         description: Comment added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/TaskComment'
 *       403:
 *         description: Not a member of the project
 *       404:
 *         description: Task not found
 * 
 *   get:
 *     summary: Get all comments and activity logs for a task
 *     description: Requires project membership. Returns all comments and system activity records.
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Task ID
 *     responses:
 *       200:
 *         description: List of comments and activity logs
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
 *                     $ref: '#/components/schemas/TaskComment'
 *       403:
 *         description: Not a member of the project
 *       404:
 *         description: Task not found
 */

/**
 * @swagger
 * /tasks/{taskId}/comments/{commentId}:
 *   delete:
 *     summary: Delete a comment (author or project manager only)
 *     description: The comment author can delete their own comment. Project owners/admins can delete any comment. System-generated activity entries cannot be deleted.
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Task ID
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Attempted to delete a system activity log
 *       403:
 *         description: Not authorized to delete this comment
 *       404:
 *         description: Comment or task not found
 */
