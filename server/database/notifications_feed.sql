-- Active: 1779819246707@@nozomi.proxy.rlwy.net@10354@railway
CREATE TABLE IF NOT EXISTS notifications (
    id         INT          PRIMARY KEY AUTO_INCREMENT,
    userId     INT          NOT NULL,           -- recipient
    type       VARCHAR(50)  NOT NULL,           -- e.g. 'COMMENT_ADDED', 'TASK_ASSIGNED'
    title      VARCHAR(255) NOT NULL,           -- human-readable title
    body       TEXT         DEFAULT NULL,        -- detail message
    isRead     TINYINT(1)   NOT NULL DEFAULT 0,
    meta       JSON         DEFAULT NULL,        -- { taskId, projectId, commentId, actorId, actorName, ... }
    createdAt  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notif_user FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_notif_userId    (userId),
    INDEX idx_notif_isRead    (userId, isRead),
    INDEX idx_notif_createdAt (createdAt)
);

DELIMITER //

-- 1. Create a notification row
DROP PROCEDURE IF EXISTS sp_CreateNotification //
CREATE PROCEDURE sp_CreateNotification(
    IN p_userId  INT,
    IN p_type    VARCHAR(50),
    IN p_title   VARCHAR(255),
    IN p_body    TEXT,
    IN p_meta    JSON
)
BEGIN
    INSERT INTO notifications (userId, type, title, body, meta)
    VALUES (p_userId, p_type, p_title, p_body, p_meta);
    
    SELECT * FROM notifications WHERE id = LAST_INSERT_ID();
END //

-- 2. Fetch paginated notifications for a user, newest first
DROP PROCEDURE IF EXISTS sp_GetNotifications //
CREATE PROCEDURE sp_GetNotifications(
    IN p_userId INT,
    IN p_limit  INT,
    IN p_offset INT
)
BEGIN
    SELECT * FROM notifications
    WHERE userId = p_userId
    ORDER BY createdAt DESC
    LIMIT p_limit OFFSET p_offset;
END //

-- 3. Get count of unread notifications
DROP PROCEDURE IF EXISTS sp_GetUnreadCount //
CREATE PROCEDURE sp_GetUnreadCount(
    IN p_userId INT
)
BEGIN
    SELECT COUNT(*) AS unreadCount
    FROM notifications
    WHERE userId = p_userId AND isRead = 0;
END //

-- 4. Mark a specific notification as read
DROP PROCEDURE IF EXISTS sp_MarkNotificationRead //
CREATE PROCEDURE sp_MarkNotificationRead(
    IN p_id     INT,
    IN p_userId INT
)
BEGIN
    UPDATE notifications
    SET isRead = 1
    WHERE id = p_id AND userId = p_userId;
    
    SELECT ROW_COUNT() AS updatedCount;
END //

-- 5. Mark all notifications of a user as read
DROP PROCEDURE IF EXISTS sp_MarkAllNotificationsRead //
CREATE PROCEDURE sp_MarkAllNotificationsRead(
    IN p_userId INT
)
BEGIN
    UPDATE notifications
    SET isRead = 1
    WHERE userId = p_userId AND isRead = 0;
    
    SELECT ROW_COUNT() AS updatedCount;
END //

-- 6. Hard-delete a single notification
DROP PROCEDURE IF EXISTS sp_DeleteNotification //
CREATE PROCEDURE sp_DeleteNotification(
    IN p_id     INT,
    IN p_userId INT
)
BEGIN
    DELETE FROM notifications
    WHERE id = p_id AND userId = p_userId;
    
    SELECT ROW_COUNT() AS deletedCount;
END //

DELIMITER ;
