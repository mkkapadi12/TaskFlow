/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: |
 *     Per-user email notification preferences. The four toggles
 *     (`welcome`, `passwordReset`, `memberAdded`, `memberRemoved`) gate the
 *     corresponding sender in `email.service.js`. If a user has no row yet,
 *     `GET` returns a virtual all-enabled default — the row is only created on
 *     the first explicit `PATCH`.
 */

/**
 * @swagger
 * /notifications/settings:
 *   get:
 *     summary: Get the logged-in user's notification preferences
 *     tags: [Notifications]
 *     responses:
 *       200:
 *         description: Current notification settings (defaults if none saved yet)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/NotificationSettings'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /notifications/settings:
 *   patch:
 *     summary: Update notification preferences (partial)
 *     description: |
 *       Omitted (or `null`) fields preserve their existing values, so callers
 *       can flip a single toggle without sending the full object. The first
 *       PATCH inserts the row; subsequent PATCHes update it in place.
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateNotificationSettingsInput'
 *     responses:
 *       200:
 *         description: Settings saved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/NotificationSettings'
 *       400:
 *         description: User not found (signaled by the SP)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
