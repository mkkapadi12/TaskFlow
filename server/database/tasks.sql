-- ============================================================
--  STORED PROCEDURES  –  tasks
-- ============================================================

DELIMITER //


-- ── 1. Create Task ────────────────────────────────────────────
DROP PROCEDURE IF EXISTS sp_CreateTask //
CREATE PROCEDURE sp_CreateTask(
    IN p_title       VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    IN p_description LONGTEXT     CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    IN p_status      VARCHAR(20),
    IN p_priority    VARCHAR(20),
    IN p_deadline    DATETIME,
    IN p_projectId   INT,
    IN p_assigneeId  INT,
    IN p_creatorId   INT
)
BEGIN
    -- Apply defaults
    IF p_status IS NULL OR p_status = '' THEN
        SET p_status = 'TODO';
    END IF;

    IF p_priority IS NULL OR p_priority = '' THEN
        SET p_priority = 'MEDIUM';
    END IF;

    INSERT INTO tasks (
        title, description, status, priority,
        deadline, projectId, assigneeId, creatorId,
        createdAt, updatedAt
    )
    VALUES (
        p_title, p_description, p_status, p_priority,
        p_deadline, p_projectId, p_assigneeId, p_creatorId,
        NOW(), NOW()
    );

    SELECT
        t.id, t.title, t.description, t.status, t.priority,
        t.deadline, t.projectId, t.assigneeId, t.creatorId,
        t.createdAt, t.updatedAt,
        a.name  AS assigneeName,
        c.name  AS creatorName,
        p.title AS projectTitle
    FROM tasks t
    LEFT JOIN users   a ON a.id = t.assigneeId
    JOIN      users   c ON c.id = t.creatorId
    JOIN      projects p ON p.id = t.projectId
    WHERE t.id = LAST_INSERT_ID();
END //


-- ── 2. Get Tasks by Project (optional status filter) ─────────
DROP PROCEDURE IF EXISTS sp_GetTasksByProject //
CREATE PROCEDURE sp_GetTasksByProject(
    IN p_projectId INT,
    IN p_status    VARCHAR(20)
)
BEGIN
    SELECT
        t.id, t.title, t.description, t.status, t.priority,
        t.deadline, t.projectId, t.assigneeId, t.creatorId,
        t.createdAt, t.updatedAt,
        a.name AS assigneeName,
        c.name AS creatorName
    FROM tasks t
    LEFT JOIN users a ON a.id = t.assigneeId
    JOIN      users c ON c.id = t.creatorId
    WHERE t.projectId = p_projectId
      AND (p_status IS NULL OR t.status = p_status)
    ORDER BY t.createdAt DESC;
END //


-- ── 3. Get Tasks Assigned to a User ──────────────────────────
DROP PROCEDURE IF EXISTS sp_GetTasksByAssignee //
CREATE PROCEDURE sp_GetTasksByAssignee(
    IN p_assigneeId INT
)
BEGIN
    SELECT
        t.id, t.title, t.description, t.status, t.priority,
        t.deadline, t.projectId, t.assigneeId, t.creatorId,
        t.createdAt, t.updatedAt,
        c.name  AS creatorName,
        p.title AS projectTitle
    FROM tasks t
    JOIN users    c ON c.id = t.creatorId
    JOIN projects p ON p.id = t.projectId
    WHERE t.assigneeId = p_assigneeId
    ORDER BY t.deadline ASC;
END //


-- ── 4. Get Task By ID ─────────────────────────────────────────
DROP PROCEDURE IF EXISTS sp_GetTaskById //
CREATE PROCEDURE sp_GetTaskById(
    IN p_id INT
)
BEGIN
    SELECT
        t.id, t.title, t.description, t.status, t.priority,
        t.deadline, t.projectId, t.assigneeId, t.creatorId,
        t.createdAt, t.updatedAt,
        a.name  AS assigneeName,  a.email AS assigneeEmail,
        c.name  AS creatorName,   c.email AS creatorEmail,
        p.title AS projectTitle
    FROM tasks t
    LEFT JOIN users    a ON a.id = t.assigneeId
    JOIN      users    c ON c.id = t.creatorId
    JOIN      projects p ON p.id = t.projectId
    WHERE t.id = p_id;
END //


-- ── 5. Update Task ────────────────────────────────────────────
DROP PROCEDURE IF EXISTS sp_UpdateTask //
CREATE PROCEDURE sp_UpdateTask(
    IN p_id          INT,
    IN p_title       VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    IN p_description LONGTEXT     CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    IN p_status      VARCHAR(20),
    IN p_priority    VARCHAR(20),
    IN p_deadline    DATETIME,
    IN p_assigneeId  INT
)
BEGIN
    UPDATE tasks
    SET
        title       = IFNULL(p_title,       title),
        description = IFNULL(p_description, description),
        status      = IFNULL(p_status,      status),
        priority    = IFNULL(p_priority,    priority),
        deadline    = IF(p_deadline IS NOT NULL, p_deadline, deadline),
        assigneeId  = IF(p_assigneeId IS NOT NULL, p_assigneeId, assigneeId),
        updatedAt   = NOW()
    WHERE id = p_id;

    SELECT
        t.id, t.title, t.description, t.status, t.priority,
        t.deadline, t.projectId, t.assigneeId, t.creatorId,
        t.createdAt, t.updatedAt,
        a.name AS assigneeName,
        c.name AS creatorName,
        p.title AS projectTitle
    FROM tasks t
    LEFT JOIN users    a ON a.id = t.assigneeId
    JOIN      users    c ON c.id = t.creatorId
    JOIN      projects p ON p.id = t.projectId
    WHERE t.id = p_id;
END //


-- ── 6. Delete Task ────────────────────────────────────────────
DROP PROCEDURE IF EXISTS sp_DeleteTask //
CREATE PROCEDURE sp_DeleteTask(
    IN p_id INT
)
BEGIN
    DELETE FROM tasks WHERE id = p_id;
    SELECT ROW_COUNT() AS deletedCount;
END //


-- ── 7. Get Overdue Tasks ─────────────────────────────────────
DROP PROCEDURE IF EXISTS sp_GetOverdueTasks //
CREATE PROCEDURE sp_GetOverdueTasks(
    IN p_userId INT
)
BEGIN
    SELECT
        t.id, t.title, t.status, t.priority, t.deadline,
        t.projectId, t.assigneeId, t.creatorId,
        p.title AS projectTitle
    FROM tasks t
    JOIN projects p ON p.id = t.projectId
    WHERE t.assigneeId = p_userId
      AND t.deadline   < NOW()
      AND t.status    != 'DONE'
    ORDER BY t.deadline ASC;
END //


-- ── 8. Verify Task (owner approves/rejects IN_REVIEW) ────────
DROP PROCEDURE IF EXISTS sp_VerifyTask //
CREATE PROCEDURE sp_VerifyTask(
    IN p_id      INT,
    IN p_approve TINYINT(1)
)
BEGIN
    DECLARE v_currentStatus VARCHAR(20);

    SELECT status INTO v_currentStatus
    FROM tasks
    WHERE id = p_id;

    IF v_currentStatus IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Task not found';
    END IF;

    IF v_currentStatus <> 'IN_REVIEW' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Task must be in IN_REVIEW to be verified';
    END IF;

    UPDATE tasks
    SET status    = IF(p_approve = 1, 'DONE', 'IN_PROGRESS'),
        updatedAt = NOW()
    WHERE id = p_id;

    SELECT
        t.id, t.title, t.description, t.status, t.priority,
        t.deadline, t.projectId, t.assigneeId, t.creatorId,
        t.createdAt, t.updatedAt,
        a.name  AS assigneeName,
        c.name  AS creatorName,
        p.title AS projectTitle
    FROM tasks t
    LEFT JOIN users    a ON a.id = t.assigneeId
    JOIN      users    c ON c.id = t.creatorId
    JOIN      projects p ON p.id = t.projectId
    WHERE t.id = p_id;
END //


DELIMITER ;
