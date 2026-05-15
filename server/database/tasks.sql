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


-- ── 2. Get All Tasks ──────────────────────────────────────────
DROP PROCEDURE IF EXISTS sp_GetAllTasks //
CREATE PROCEDURE sp_GetAllTasks()
BEGIN
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
    ORDER BY t.createdAt DESC;
END //


-- ── 3. Get Tasks by Project ───────────────────────────────────
DROP PROCEDURE IF EXISTS sp_GetTasksByProject //
CREATE PROCEDURE sp_GetTasksByProject(
    IN p_projectId INT
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
    ORDER BY t.createdAt DESC;
END //


-- ── 4. Get Tasks Assigned to a User ──────────────────────────
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


-- ── 5. Get Tasks Created by a User ───────────────────────────
DROP PROCEDURE IF EXISTS sp_GetTasksByCreator //
CREATE PROCEDURE sp_GetTasksByCreator(
    IN p_creatorId INT
)
BEGIN
    SELECT
        t.id, t.title, t.description, t.status, t.priority,
        t.deadline, t.projectId, t.assigneeId, t.creatorId,
        t.createdAt, t.updatedAt,
        a.name  AS assigneeName,
        p.title AS projectTitle
    FROM tasks t
    LEFT JOIN users    a ON a.id = t.assigneeId
    JOIN      projects p ON p.id = t.projectId
    WHERE t.creatorId = p_creatorId
    ORDER BY t.createdAt DESC;
END //


-- ── 6. Get Task By ID ─────────────────────────────────────────
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


-- ── 7. Update Task ────────────────────────────────────────────
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
        a.name AS assigneeName
    FROM tasks t
    LEFT JOIN users a ON a.id = t.assigneeId
    WHERE t.id = p_id;
END //


-- ── 8. Update Task Status ─────────────────────────────────────
DROP PROCEDURE IF EXISTS sp_UpdateTaskStatus //
CREATE PROCEDURE sp_UpdateTaskStatus(
    IN p_id     INT,
    IN p_status VARCHAR(20)
)
BEGIN
    UPDATE tasks
    SET status    = p_status,
        updatedAt = NOW()
    WHERE id = p_id;

    SELECT id, status, updatedAt FROM tasks WHERE id = p_id;
END //


-- ── 9. Delete Task ────────────────────────────────────────────
DROP PROCEDURE IF EXISTS sp_DeleteTask //
CREATE PROCEDURE sp_DeleteTask(
    IN p_id INT
)
BEGIN
    DELETE FROM tasks WHERE id = p_id;
    SELECT ROW_COUNT() AS deletedCount;
END //


-- ── 10. Get Tasks by Status (within a project) ────────────────
DROP PROCEDURE IF EXISTS sp_GetTasksByStatus //
CREATE PROCEDURE sp_GetTasksByStatus(
    IN p_projectId INT,
    IN p_status    VARCHAR(20)
)
BEGIN
    SELECT
        t.id, t.title, t.description, t.status, t.priority,
        t.deadline, t.projectId, t.assigneeId, t.creatorId,
        t.createdAt, t.updatedAt,
        a.name AS assigneeName
    FROM tasks t
    LEFT JOIN users a ON a.id = t.assigneeId
    WHERE t.projectId = p_projectId
      AND t.status    = p_status
    ORDER BY t.deadline ASC;
END //


-- ── 11. Get Overdue Tasks ─────────────────────────────────────
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


DELIMITER ;
