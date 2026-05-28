-- Active: 1779868249965@@localhost@3306@my_db
DELIMITER //

-- Get settings; if no row yet, return a virtual default row (no INSERT)
DROP PROCEDURE IF EXISTS sp_GetNotificationSettings //
CREATE PROCEDURE sp_GetNotificationSettings(IN p_userId INT)
BEGIN
    IF NOT EXISTS (SELECT 1 FROM notification_settings WHERE userId = p_userId) THEN
        -- Return default values without writing to DB (avoids FK issues on new users)
        SELECT
            NULL            AS id,
            p_userId        AS userId,
            1               AS welcome,
            1               AS passwordReset,
            1               AS memberAdded,
            1               AS memberRemoved,
            NOW()           AS createdAt,
            NOW()           AS updatedAt;
    ELSE
        SELECT * FROM notification_settings WHERE userId = p_userId;
    END IF;
END //

-- Update (or insert on first explicit save)
DROP PROCEDURE IF EXISTS sp_UpdateNotificationSettings //
CREATE PROCEDURE sp_UpdateNotificationSettings(
    IN p_userId        INT,
    IN p_welcome       TINYINT(1),
    IN p_passwordReset TINYINT(1),
    IN p_memberAdded   TINYINT(1),
    IN p_memberRemoved TINYINT(1)
)
BEGIN
    -- Guard: only proceed if the user actually exists
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = p_userId) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User not found';
    END IF;

    INSERT INTO notification_settings (userId, welcome, passwordReset, memberAdded, memberRemoved)
    VALUES (p_userId,
            IFNULL(p_welcome, 1),
            IFNULL(p_passwordReset, 1),
            IFNULL(p_memberAdded, 1),
            IFNULL(p_memberRemoved, 1))
    ON DUPLICATE KEY UPDATE
        welcome       = IF(p_welcome       IS NOT NULL, p_welcome,       welcome),
        passwordReset = IF(p_passwordReset IS NOT NULL, p_passwordReset, passwordReset),
        memberAdded   = IF(p_memberAdded   IS NOT NULL, p_memberAdded,   memberAdded),
        memberRemoved = IF(p_memberRemoved IS NOT NULL, p_memberRemoved, memberRemoved),
        updatedAt     = NOW();

    SELECT * FROM notification_settings WHERE userId = p_userId;
END //

DELIMITER ;