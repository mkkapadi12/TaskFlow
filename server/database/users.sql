-- Stored Procedures for Users Table

DELIMITER //

-- 1. Create User
DROP PROCEDURE IF EXISTS sp_CreateUser //

CREATE PROCEDURE sp_CreateUser(
    IN p_name VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    IN p_email VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    IN p_password VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    IN p_role VARCHAR(20)
)
BEGIN
    DECLARE email_exists INT DEFAULT 0;

    -- Set default role
    IF p_role IS NULL OR p_role = '' THEN
        SET p_role = 'USER';
    END IF;

    SELECT COUNT(*) INTO email_exists
    FROM users
    WHERE email = p_email;

    IF email_exists > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Email already exists';
    ELSE
        INSERT INTO users (
            name,
            email,
            password,
            role,
            createdAt,
            updatedAt
        )
        VALUES (
            p_name,
            p_email,
            p_password,
            p_role,
            NOW(),
            NOW()
        );

        SELECT
            LAST_INSERT_ID() AS id,
            p_name AS name,
            p_email AS email,
            p_role AS role;
    END IF;
END //

-- 2. Get User By ID
DROP PROCEDURE IF EXISTS sp_GetUserById //
CREATE PROCEDURE sp_GetUserById(
    IN p_id INT
)
BEGIN
    SELECT id, name, email, avatar, phone, role, createdAt, updatedAt
    FROM users
    WHERE id = p_id;
END //

-- 3. Get User By Email
DROP PROCEDURE IF EXISTS sp_GetUserByEmail //
CREATE PROCEDURE sp_GetUserByEmail(
    IN p_email VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
)
BEGIN
    SELECT id, name, email, avatar, phone, role, createdAt, updatedAt
    FROM users
    WHERE email = p_email;
END //

-- 4. Get All Users
DROP PROCEDURE IF EXISTS sp_GetAllUsers //
CREATE PROCEDURE sp_GetAllUsers()
BEGIN
    SELECT id, name, email, avatar, publicId, phone, role, createdAt, updatedAt
    FROM users
    ORDER BY createdAt DESC;
END //

-- 5. Update User
DROP PROCEDURE IF EXISTS sp_UpdateUser //
CREATE PROCEDURE sp_UpdateUser(
    IN p_id INT,
    IN p_name VARCHAR(255),
    IN p_avatar VARCHAR(255),
    IN p_publicId VARCHAR(255),
    IN p_phone BIGINT
)
BEGIN
    UPDATE users
    SET name = IFNULL(p_name, name),
        avatar = IFNULL(p_avatar, avatar),
        publicId = IFNULL(p_publicId, publicId),
        phone = IFNULL(p_phone, phone)
    WHERE id = p_id;

    SELECT id, name, email, avatar, publicId, phone, role, updatedAt
    FROM users
    WHERE id = p_id;
END //

-- 6. Delete User
DROP PROCEDURE IF EXISTS sp_DeleteUser //
CREATE PROCEDURE sp_DeleteUser(
    IN p_id INT
)
BEGIN
    DELETE FROM users WHERE id = p_id;

    SELECT id,name,email,phone,avatar,publicId,role,createdAt,updatedAt
    FROM users
    WHERE id = p_id;
END //

-- 8. search User
DROP PROCEDURE IF EXISTS sp_SearchUser //
CREATE PROCEDURE sp_SearchUser(
    IN p_search VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
)
BEGIN
    SELECT id, name, email, avatar, publicId, phone, role, createdAt, updatedAt
    FROM users
    WHERE name LIKE CONCAT('%', p_search, '%') OR
    email LIKE CONCAT('%', p_search, '%')
    ORDER BY createdAt DESC;
END //

-- 9. Get User Count
DROP PROCEDURE IF EXISTS sp_GetUserCount //
CREATE PROCEDURE sp_GetUserCount()
BEGIN
    SELECT COUNT(*) AS count
    FROM users;
END //

-- 10. Get Users by Role
DROP PROCEDURE IF EXISTS sp_GetUsersByRole //
CREATE PROCEDURE sp_GetUsersByRole(
    IN p_role VARCHAR(50)
)
BEGIN
    SELECT id, name, email, password, avatar, phone, role, createdAt, updatedAt
    FROM users
    WHERE role = p_role
    ORDER BY createdAt DESC;
END //

-- 11. Check if User Exists
DROP PROCEDURE IF EXISTS sp_CheckUserExists //
CREATE PROCEDURE sp_CheckUserExists(
    IN p_email VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
)
BEGIN
    SELECT id, name, email, password, avatar, phone, role, createdAt, updatedAt
    FROM users
    WHERE email = p_email;
END //

-- 12. Update Password
DROP PROCEDURE IF EXISTS sp_UpdatePassword //
CREATE PROCEDURE sp_UpdatePassword(
    IN p_id INT,
    IN p_password VARCHAR(255)
)
BEGIN
    UPDATE users
    SET password = p_password,
        updatedAt = NOW()
    WHERE id = p_id;
END //

-- 13. Change Password
DROP PROCEDURE IF EXISTS sp_ChangePassword //
CREATE PROCEDURE sp_ChangePassword(
    IN p_id INT,
    IN p_oldPassword VARCHAR(255),
    IN p_newPassword VARCHAR(255),
    IN p_confirmPassword VARCHAR(255)
)
BEGIN
    DECLARE current_password VARCHAR(255);

    SELECT password INTO current_password
    FROM users
    WHERE id = p_id;

    IF current_password <> p_oldPassword THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Incorrect current password';
    END IF;

    IF p_newPassword <> p_confirmPassword THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'New password and confirm password do not match';
    END IF;

    UPDATE users
    SET password = p_newPassword,
        updatedAt = NOW()
    WHERE id = p_id;
END //

DELIMITER ;
