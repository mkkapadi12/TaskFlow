-- ============================================================
--  DATABASE SCHEMA  (Posts excluded)
-- ============================================================

-- ── users ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id        INT          PRIMARY KEY AUTO_INCREMENT,
    name      VARCHAR(255) NOT NULL,
    email     VARCHAR(255) NOT NULL UNIQUE,
    password  VARCHAR(255) NOT NULL,
    role      ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    avatar    VARCHAR(500)  DEFAULT NULL,
    publicId  VARCHAR(255)  DEFAULT NULL,
    createdAt TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_users_email (email),
    INDEX idx_users_role  (role)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


-- ── projects ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
    id          INT           PRIMARY KEY AUTO_INCREMENT,
    title       VARCHAR(255)  NOT NULL,
    description TEXT          NOT NULL,
    ownerId     INT           NOT NULL,
    status      ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    createdAt   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_projects_owner
        FOREIGN KEY (ownerId) REFERENCES users(id) ON DELETE CASCADE,

    INDEX idx_projects_ownerId (ownerId),
    INDEX idx_projects_status  (status)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


-- ── project_members ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS project_members (
    id        INT      PRIMARY KEY AUTO_INCREMENT,
    projectId INT      NOT NULL,
    userId    INT      NOT NULL,
    role      ENUM('OWNER', 'ADMIN', 'MEMBER') NOT NULL DEFAULT 'MEMBER',
    joinedAt  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_pm_project
        FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE,
    CONSTRAINT fk_pm_user
        FOREIGN KEY (userId)    REFERENCES users(id)    ON DELETE CASCADE,

    UNIQUE INDEX uq_pm_project_user (projectId, userId),
    INDEX idx_pm_projectId (projectId),
    INDEX idx_pm_userId    (userId)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


-- ── tasks ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tasks (
    id          INT           PRIMARY KEY AUTO_INCREMENT,
    title       VARCHAR(255)  NOT NULL,
    description LONGTEXT      DEFAULT NULL,
    status      ENUM('TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE') NOT NULL DEFAULT 'TODO',
    priority    ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT')          NOT NULL DEFAULT 'MEDIUM',
    deadline    DATETIME      DEFAULT NULL,
    projectId   INT           NOT NULL,
    assigneeId  INT           DEFAULT NULL,
    creatorId   INT           NOT NULL,
    createdAt   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_tasks_project
        FOREIGN KEY (projectId)  REFERENCES projects(id) ON DELETE CASCADE,
    CONSTRAINT fk_tasks_assignee
        FOREIGN KEY (assigneeId) REFERENCES users(id)    ON DELETE SET NULL,
    CONSTRAINT fk_tasks_creator
        FOREIGN KEY (creatorId)  REFERENCES users(id)    ON DELETE CASCADE,

    INDEX idx_tasks_projectId  (projectId),
    INDEX idx_tasks_assigneeId (assigneeId),
    INDEX idx_tasks_creatorId  (creatorId),
    INDEX idx_tasks_status     (status)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;