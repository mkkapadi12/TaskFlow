-- ============================================================
--  STORED PROCEDURES  –  task_comments & activity logs
-- ============================================================

-- ── Table ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS task_comments (
    id        INT          PRIMARY KEY AUTO_INCREMENT,
    taskId    INT          NOT NULL,
    userId    INT          DEFAULT NULL,
    content   TEXT         NOT NULL,
    type      ENUM('COMMENT', 'ACTIVITY') NOT NULL DEFAULT 'COMMENT',
    createdAt TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_tc_task
        FOREIGN KEY (taskId) REFERENCES tasks(id) ON DELETE CASCADE,
    CONSTRAINT fk_tc_user
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL,

    INDEX idx_tc_taskId (taskId),
    INDEX idx_tc_userId (userId)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


DELIMITER //


-- ── 1. Create Comment ─────────────────────────────────────────
DROP PROCEDURE IF EXISTS sp_CreateTaskComment //
CREATE PROCEDURE sp_CreateTaskComment(
    IN p_taskId  INT,
    IN p_userId  INT,
    IN p_content TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    IN p_type    VARCHAR(20)
)
BEGIN
    IF p_type IS NULL OR p_type = '' THEN
        SET p_type = 'COMMENT';
    END IF;

    INSERT INTO task_comments (taskId, userId, content, type, createdAt)
    VALUES (p_taskId, p_userId, p_content, p_type, NOW());

    SELECT
        tc.id,
        tc.taskId,
        tc.userId,
        tc.content,
        tc.type,
        tc.createdAt,
        u.name   AS userName,
        u.avatar AS userAvatar
    FROM task_comments tc
    LEFT JOIN users u ON u.id = tc.userId
    WHERE tc.id = LAST_INSERT_ID();
END //


-- ── 2. Get Comments by Task ──────────────────────────────────
DROP PROCEDURE IF EXISTS sp_GetTaskComments //
CREATE PROCEDURE sp_GetTaskComments(
    IN p_taskId INT
)
BEGIN
    SELECT
        tc.id,
        tc.taskId,
        tc.userId,
        tc.content,
        tc.type,
        tc.createdAt,
        u.name   AS userName,
        u.avatar AS userAvatar
    FROM task_comments tc
    LEFT JOIN users u ON u.id = tc.userId
    WHERE tc.taskId = p_taskId
    ORDER BY tc.createdAt ASC;
END //


-- ── 3. Delete Comment ─────────────────────────────────────────
DROP PROCEDURE IF EXISTS sp_DeleteTaskComment //
CREATE PROCEDURE sp_DeleteTaskComment(
    IN p_commentId INT
)
BEGIN
    DELETE FROM task_comments WHERE id = p_commentId;
    SELECT ROW_COUNT() AS deletedCount;
END //


-- ── 4. Get Comment by ID (for auth checks) ───────────────────
DROP PROCEDURE IF EXISTS sp_GetTaskCommentById //
CREATE PROCEDURE sp_GetTaskCommentById(
    IN p_commentId INT
)
BEGIN
    SELECT
        tc.id,
        tc.taskId,
        tc.userId,
        tc.content,
        tc.type,
        tc.createdAt
    FROM task_comments tc
    WHERE tc.id = p_commentId;
END //


-- ── 5. Create Activity (convenience wrapper) ─────────────────
DROP PROCEDURE IF EXISTS sp_CreateTaskActivity //
CREATE PROCEDURE sp_CreateTaskActivity(
    IN p_taskId  INT,
    IN p_userId  INT,
    IN p_content TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
)
BEGIN
    CALL sp_CreateTaskComment(p_taskId, p_userId, p_content, 'ACTIVITY');
END //


DELIMITER ;
