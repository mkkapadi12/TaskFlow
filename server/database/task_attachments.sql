-- Active: 1779868249965@@localhost@3306@my_db
-- ============================================================
--  STORED PROCEDURES  –  task_attachments
-- ============================================================

CREATE TABLE IF NOT EXISTS task_attachments (
    id          INT          PRIMARY KEY AUTO_INCREMENT,
    taskId      INT          NOT NULL,
    uploadedBy  INT          NOT NULL,
    name        VARCHAR(255) NOT NULL,
    url         VARCHAR(500) NOT NULL,
    publicId    VARCHAR(255) NOT NULL,
    size        INT          NOT NULL,
    mimeType    VARCHAR(100) NOT NULL,
    createdAt   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_attachment_task
        FOREIGN KEY (taskId)     REFERENCES tasks(id)    ON DELETE CASCADE,
    CONSTRAINT fk_attachment_uploader
        FOREIGN KEY (uploadedBy) REFERENCES users(id)    ON DELETE CASCADE,

    INDEX idx_attachment_taskId (taskId),
    INDEX idx_attachment_uploadedBy (uploadedBy)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


DELIMITER //

-- ── 1. Create Task Attachment ─────────────────────────────────
DROP PROCEDURE IF EXISTS sp_CreateTaskAttachment //
CREATE PROCEDURE sp_CreateTaskAttachment(
    IN p_taskId     INT,
    IN p_uploadedBy INT,
    IN p_name       VARCHAR(255),
    IN p_url        VARCHAR(500),
    IN p_publicId   VARCHAR(255),
    IN p_size       INT,
    IN p_mimeType   VARCHAR(100)
)
BEGIN
    DECLARE v_projectStatus VARCHAR(20);
    DECLARE v_assigneeId INT;

    -- Guard: project must not be ARCHIVED and only task assignee can upload
    SELECT p.status, t.assigneeId INTO v_projectStatus, v_assigneeId
    FROM tasks t
    JOIN projects p ON p.id = t.projectId
    WHERE t.id = p_taskId;

    IF v_projectStatus = 'ARCHIVED' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot add attachments to tasks in an archived project';
    END IF;

    IF v_assigneeId IS NULL OR v_assigneeId <> p_uploadedBy THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Only the task assignee can upload attachments';
    END IF;

    INSERT INTO task_attachments
        (taskId, uploadedBy, name, url, publicId, size, mimeType)
    VALUES
        (p_taskId, p_uploadedBy, p_name, p_url, p_publicId, p_size, p_mimeType);

    SELECT
        a.id, a.taskId, a.uploadedBy, a.name,
        a.url, a.publicId, a.size, a.mimeType, a.createdAt,
        u.name AS uploaderName
    FROM task_attachments a
    JOIN users u ON u.id = a.uploadedBy
    WHERE a.id = LAST_INSERT_ID();
END //


-- ── 2. Get Task Attachments ───────────────────────────────────
DROP PROCEDURE IF EXISTS sp_GetTaskAttachments //
CREATE PROCEDURE sp_GetTaskAttachments(
    IN p_taskId INT
)
BEGIN
    SELECT
        a.id, a.taskId, a.uploadedBy, a.name,
        a.url, a.publicId, a.size, a.mimeType, a.createdAt,
        u.name AS uploaderName, u.avatar AS uploaderAvatar
    FROM task_attachments a
    JOIN users u ON u.id = a.uploadedBy
    WHERE a.taskId = p_taskId
    ORDER BY a.createdAt DESC;
END //


-- ── 3. Get Task Attachment By ID ──────────────────────────────
DROP PROCEDURE IF EXISTS sp_GetTaskAttachmentById //
CREATE PROCEDURE sp_GetTaskAttachmentById(
    IN p_id INT
)
BEGIN
    SELECT
        a.id, a.taskId, a.uploadedBy,
        a.name, a.url, a.publicId, a.size, a.mimeType, a.createdAt
    FROM task_attachments a
    WHERE a.id = p_id;
END //


-- ── 4. Delete Task Attachment ─────────────────────────────────
DROP PROCEDURE IF EXISTS sp_DeleteTaskAttachment //
CREATE PROCEDURE sp_DeleteTaskAttachment(
    IN p_id INT
)
BEGIN
    DECLARE v_projectStatus VARCHAR(20);

    -- Guard: project must not be ARCHIVED
    SELECT p.status INTO v_projectStatus
    FROM task_attachments ta
    JOIN tasks t ON t.id = ta.taskId
    JOIN projects p ON p.id = t.projectId
    WHERE ta.id = p_id;

    IF v_projectStatus = 'ARCHIVED' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot delete attachments in an archived project';
    END IF;

    DELETE FROM task_attachments WHERE id = p_id;
    SELECT ROW_COUNT() AS deletedCount;
END //

DELIMITER ;
