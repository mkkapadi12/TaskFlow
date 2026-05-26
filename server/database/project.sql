-- ============================================================
--  STORED PROCEDURES  â€“  projects & project_members
-- ============================================================

DELIMITER //


-- â”€â”€ 1. Create Project â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
DROP PROCEDURE IF EXISTS sp_CreateProject //
CREATE PROCEDURE sp_CreateProject(
    IN p_title       VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    IN p_description TEXT         CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    IN p_ownerId     INT
)
BEGIN
    DECLARE v_projectId INT;

    INSERT INTO projects (title, description, ownerId, status, createdAt, updatedAt)
    VALUES (p_title, p_description, p_ownerId, 'ACTIVE', NOW(), NOW());

    SET v_projectId = LAST_INSERT_ID();

    -- Auto-add owner as a project member with role OWNER
    INSERT INTO project_members (projectId, userId, role, joinedAt)
    VALUES (v_projectId, p_ownerId, 'OWNER', NOW());

    SELECT
        p.id, p.title, p.description, p.ownerId, p.status, p.createdAt, p.updatedAt,
        u.name AS ownerName, u.email AS ownerEmail
    FROM projects p
    JOIN users u ON u.id = p.ownerId
    WHERE p.id = v_projectId;
END //


-- â”€â”€ 2. Get All Projects (owner view) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
DROP PROCEDURE IF EXISTS sp_GetAllProjects //
CREATE PROCEDURE sp_GetAllProjects()
BEGIN
    SELECT
        p.id, p.title, p.description, p.ownerId, p.status, p.createdAt, p.updatedAt,
        u.name AS ownerName,
        (SELECT COUNT(*) FROM project_members pm WHERE pm.projectId = p.id) AS memberCount,
        (SELECT COUNT(*) FROM tasks t          WHERE t.projectId  = p.id) AS taskCount
    FROM projects p
    JOIN users u ON u.id = p.ownerId
    ORDER BY p.createdAt DESC;
END //


-- â”€â”€ 3. Get Projects by Owner â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
DROP PROCEDURE IF EXISTS sp_GetProjectsByOwner //
CREATE PROCEDURE sp_GetProjectsByOwner(
    IN p_ownerId INT
)
BEGIN
    SELECT
        p.id, p.title, p.description, p.ownerId, p.status, p.createdAt, p.updatedAt,
        (SELECT COUNT(*) FROM project_members pm WHERE pm.projectId = p.id) AS memberCount,
        (SELECT COUNT(*) FROM tasks t          WHERE t.projectId  = p.id) AS taskCount
    FROM projects p
    WHERE p.ownerId = p_ownerId
    ORDER BY p.createdAt DESC;
END //


-- â”€â”€ 4. Get Projects for a Member (projects the user belongs to) â”€â”€
DROP PROCEDURE IF EXISTS sp_GetProjectsByMember //
CREATE PROCEDURE sp_GetProjectsByMember(
    IN p_userId INT
)
BEGIN
    SELECT
        p.id, p.title, p.description, p.ownerId, p.status, p.createdAt, p.updatedAt,
        u.name  AS ownerName,
        pm.role AS memberRole,
        (SELECT COUNT(*) FROM project_members pm2 WHERE pm2.projectId = p.id) AS memberCount,
        (SELECT COUNT(*) FROM tasks t             WHERE t.projectId  = p.id) AS taskCount
    FROM project_members pm
    JOIN projects p ON p.id = pm.projectId
    JOIN users    u ON u.id = p.ownerId
    WHERE pm.userId = p_userId
    ORDER BY p.createdAt DESC;
END //


-- â”€â”€ 5. Get Project By ID â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
DROP PROCEDURE IF EXISTS sp_GetProjectById //
CREATE PROCEDURE sp_GetProjectById(
    IN p_id INT
)
BEGIN
    SELECT
        p.id, p.title, p.description, p.ownerId, p.status, p.createdAt, p.updatedAt,
        u.name AS ownerName, u.email AS ownerEmail
    FROM projects p
    JOIN users u ON u.id = p.ownerId
    WHERE p.id = p_id;
END //


-- â”€â”€ 6. Update Project â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
DROP PROCEDURE IF EXISTS sp_UpdateProject //
CREATE PROCEDURE sp_UpdateProject(
    IN p_id          INT,
    IN p_title       VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    IN p_description TEXT         CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    IN p_status      VARCHAR(20)
)
BEGIN
    UPDATE projects
    SET
        title       = IFNULL(p_title,       title),
        description = IFNULL(p_description, description),
        status      = IFNULL(p_status,      status),
        updatedAt   = NOW()
    WHERE id = p_id;

    SELECT
        p.id, p.title, p.description, p.ownerId, p.status, p.createdAt, p.updatedAt,
        u.name AS ownerName
    FROM projects p
    JOIN users u ON u.id = p.ownerId
    WHERE p.id = p_id;
END //


-- â”€â”€ 7. Delete Project â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
DROP PROCEDURE IF EXISTS sp_DeleteProject //
CREATE PROCEDURE sp_DeleteProject(
    IN p_id INT
)
BEGIN
    DELETE FROM projects WHERE id = p_id;
    SELECT ROW_COUNT() AS deletedCount;
END //


-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
--  project_members SPs
-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

-- â”€â”€ 8. Add Member to Project â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
DROP PROCEDURE IF EXISTS sp_AddProjectMember //
CREATE PROCEDURE sp_AddProjectMember(
    IN p_projectId INT,
    IN p_userId    INT,
    IN p_role      VARCHAR(20)
)
BEGIN
    DECLARE already_member INT DEFAULT 0;

    IF p_role IS NULL OR p_role = '' THEN
        SET p_role = 'MEMBER';
    END IF;

    SELECT COUNT(*) INTO already_member
    FROM project_members
    WHERE projectId = p_projectId AND userId = p_userId;

    IF already_member > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'User is already a member of this project';
    ELSE
        INSERT INTO project_members (projectId, userId, role, joinedAt)
        VALUES (p_projectId, p_userId, p_role, NOW());

        SELECT pm.id, pm.projectId, pm.userId, pm.role, pm.joinedAt,
               u.name AS userName, u.email AS userEmail
        FROM project_members pm
        JOIN users u ON u.id = pm.userId
        WHERE pm.id = LAST_INSERT_ID();
    END IF;
END //


-- â”€â”€ 9. Get Members of a Project â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
DROP PROCEDURE IF EXISTS sp_GetProjectMembers //
CREATE PROCEDURE sp_GetProjectMembers(
    IN p_projectId INT
)
BEGIN
    SELECT
        pm.id, pm.projectId, pm.userId, pm.role, pm.joinedAt,
        u.name AS userName, u.email AS userEmail, u.avatar AS userAvatar
    FROM project_members pm
    JOIN users u ON u.id = pm.userId
    WHERE pm.projectId = p_projectId
    ORDER BY pm.joinedAt ASC;
END //


-- â”€â”€ 10. Update Member Role â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
DROP PROCEDURE IF EXISTS sp_UpdateMemberRole //
CREATE PROCEDURE sp_UpdateMemberRole(
    IN p_projectId INT,
    IN p_userId    INT,
    IN p_role      VARCHAR(20)
)
BEGIN
    UPDATE project_members
    SET role = p_role
    WHERE projectId = p_projectId AND userId = p_userId;

    SELECT pm.id, pm.projectId, pm.userId, pm.role, pm.joinedAt,
           u.name AS userName
    FROM project_members pm
    JOIN users u ON u.id = pm.userId
    WHERE pm.projectId = p_projectId AND pm.userId = p_userId;
END //


-- 11. Remove Member from Project
DROP PROCEDURE IF EXISTS sp_RemoveProjectMember //
CREATE PROCEDURE sp_RemoveProjectMember(
    IN p_projectId INT,
    IN p_userId    INT
)
BEGIN
    DELETE FROM project_members
    WHERE projectId = p_projectId AND userId = p_userId;

    SELECT ROW_COUNT() AS deletedCount;
END //


-- 12. get member role to specific project

DROP PROCEDURE IF EXISTS sp_GetMemberRole //

CREATE PROCEDURE sp_GetMemberRole(
    IN p_projectId INT,
    IN p_userId    INT
)
BEGIN
    SELECT
        pm.role,
        pm.joinedAt,
        pm.userId,
        pm.projectId,
        u.name  AS userName,
        u.email AS userEmail
    FROM project_members pm
    JOIN users u ON u.id = pm.userId
    WHERE pm.projectId = p_projectId
      AND pm.userId    = p_userId
    LIMIT 1;
END //

-- ── 13. Get Full Project Details (project + members + tasks) ──
DROP PROCEDURE IF EXISTS sp_GetFullProjectDetails //

CREATE PROCEDURE sp_GetFullProjectDetails(
    IN p_projectId INT
)
BEGIN
    -- Result set 1: project info + owner
    SELECT
        p.id, p.title, p.description, p.ownerId, p.status,
        p.createdAt, p.updatedAt,
        u.name  AS ownerName,
        u.avatar AS ownerAvatar,
        u.email AS ownerEmail,
        (SELECT COUNT(*) FROM project_members pm WHERE pm.projectId = p.id) AS memberCount,
        (SELECT COUNT(*) FROM tasks t          WHERE t.projectId  = p.id) AS taskCount
    FROM projects p
    JOIN users u ON u.id = p.ownerId
    WHERE p.id = p_projectId;

    -- Result set 2: members list
    SELECT
        pm.id, pm.userId, pm.role, pm.joinedAt,
        u.name   AS userName,
        u.email  AS userEmail,
        u.avatar AS userAvatar
    FROM project_members pm
    JOIN users u ON u.id = pm.userId
    WHERE pm.projectId = p_projectId
    ORDER BY pm.joinedAt ASC;

    -- Result set 3: tasks list
    SELECT
        t.id, t.title, t.description, t.status, t.priority,
        t.deadline, t.assigneeId, t.creatorId,
        t.createdAt, t.updatedAt,
        a.name AS assigneeName,
        c.name AS creatorName
    FROM tasks t
    LEFT JOIN users a ON a.id = t.assigneeId
    JOIN      users c ON c.id = t.creatorId
    WHERE t.projectId = p_projectId
    ORDER BY t.createdAt DESC;
END //

DELIMITER ;
