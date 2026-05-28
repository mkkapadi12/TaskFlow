DELIMITER //

-- 1. Upload doc (insert record)
DROP PROCEDURE IF EXISTS sp_CreateProjectDocument //
CREATE PROCEDURE sp_CreateProjectDocument(
    IN p_projectId  INT,
    IN p_uploadedBy INT,
    IN p_name       VARCHAR(255),
    IN p_url        VARCHAR(500),
    IN p_publicId   VARCHAR(255),
    IN p_size       INT,
    IN p_mimeType   VARCHAR(100)
)
BEGIN
    INSERT INTO project_documents
        (projectId, uploadedBy, name, url, publicId, size, mimeType)
    VALUES
        (p_projectId, p_uploadedBy, p_name, p_url, p_publicId, p_size, p_mimeType);

    SELECT
        d.id, d.projectId, d.uploadedBy, d.name,
        d.url, d.publicId, d.size, d.mimeType, d.createdAt,
        u.name AS uploaderName
    FROM project_documents d
    JOIN users u ON u.id = d.uploadedBy
    WHERE d.id = LAST_INSERT_ID();
END //


-- 2. Get all docs for a project
DROP PROCEDURE IF EXISTS sp_GetProjectDocuments //
CREATE PROCEDURE sp_GetProjectDocuments(
    IN p_projectId INT
)
BEGIN
    SELECT
        d.id, d.projectId, d.uploadedBy, d.name,
        d.url, d.publicId, d.size, d.mimeType, d.createdAt,
        u.name AS uploaderName, u.avatar AS uploaderAvatar
    FROM project_documents d
    JOIN users u ON u.id = d.uploadedBy
    WHERE d.projectId = p_projectId
    ORDER BY d.createdAt DESC;
END //


-- 3. Get single doc by ID (for delete auth check)
DROP PROCEDURE IF EXISTS sp_GetProjectDocumentById //
CREATE PROCEDURE sp_GetProjectDocumentById(
    IN p_id INT
)
BEGIN
    SELECT
        d.id, d.projectId, d.uploadedBy,
        d.name, d.url, d.publicId, d.size, d.mimeType, d.createdAt
    FROM project_documents d
    WHERE d.id = p_id;
END //


-- 4. Delete doc record
DROP PROCEDURE IF EXISTS sp_DeleteProjectDocument //
CREATE PROCEDURE sp_DeleteProjectDocument(
    IN d_id INT
)
BEGIN
    DELETE FROM project_documents WHERE id = d_id;
    SELECT ROW_COUNT() AS deletedCount;
END //


-- 5. Get all documents across all user's projects
DROP PROCEDURE IF EXISTS sp_GetAllUserDocuments //
CREATE PROCEDURE sp_GetAllUserDocuments(
    IN p_userId INT
)
BEGIN
    SELECT
        d.id, d.projectId, d.uploadedBy, d.name,
        d.url, d.publicId, d.size, d.mimeType, d.createdAt,
        u.name AS uploaderName, u.avatar AS uploaderAvatar,
        p.title AS projectTitle,
        p.ownerId AS projectOwnerId,
        pm.role AS memberRole
    FROM project_documents d
    JOIN projects p ON p.id = d.projectId
    JOIN project_members pm ON pm.projectId = p.id
    JOIN users u ON u.id = d.uploadedBy
    WHERE pm.userId = p_userId
    ORDER BY d.createdAt DESC;
END //

DELIMITER ;