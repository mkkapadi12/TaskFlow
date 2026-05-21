-- ============================================================
--  TEST CALLS  –  use these to verify SPs in MySQL Workbench
-- ============================================================

-- ── Users (existing) ────────────────────────────────────────
CALL sp_CreateUser('Alice Owner',  'alice@example.com', 'hashed_pw', 'USER');
CALL sp_CreateUser('Bob Member',   'bob@example.com',   'hashed_pw', 'USER');
CALL sp_CreateUser('Carol Member', 'carol@example.com', 'hashed_pw', 'USER');

CALL sp_GetUserById(1);
CALL sp_GetAllUsers();


-- ── Projects ─────────────────────────────────────────────────
CALL sp_CreateProject('Alpha Project', 'First project description', 6);
CALL sp_CreateProject('Beta Project',  'Second project description', 1);

CALL sp_GetAllProjects();
CALL sp_GetProjectById(1);
CALL sp_GetProjectsByOwner(1);
CALL sp_GetProjectsByMember(7);

CALL sp_UpdateProject(1, 'Alpha Project Updated', 'Updated description', 'ACTIVE');
CALL sp_UpdateProject(2, NULL, NULL, 'INACTIVE');


-- ── Project Members ──────────────────────────────────────────
CALL sp_AddProjectMember(2, 7, 'MEMBER');
CALL sp_AddProjectMember(1, 3, 'ADMIN');

CALL sp_GetProjectMembers(2);
CALL sp_UpdateMemberRole(1, 2, 'ADMIN');
CALL sp_RemoveProjectMember(1, 3);

CALL sp_GetMemberRole(2,6);



-- ── Tasks ─────────────────────────────────────────────────────
CALL sp_CreateTask('Design wireframes', 'Create low-fi wireframes', 'TODO', 'HIGH',     '2025-06-01 00:00:00', 1, 2, 1);
CALL sp_CreateTask('Backend API',       'Implement REST endpoints',  'TODO', 'URGENT',   '2025-06-15 00:00:00', 1, 2, 1);
CALL sp_CreateTask('Write tests',       NULL,                        'TODO', 'MEDIUM',   NULL,                  1, 3, 1);

CALL sp_GetAllTasks();
CALL sp_GetTaskById(1);
CALL sp_GetTasksByProject(1);
CALL sp_GetTasksByAssignee(2);
CALL sp_GetTasksByCreator(1);
CALL sp_GetTasksByStatus(1, 'TODO');
CALL sp_GetOverdueTasks(2);

CALL sp_UpdateTask(1, 'Design wireframes v2', NULL, 'IN_PROGRESS', 'HIGH', NULL, NULL);
CALL sp_UpdateTaskStatus(1, 'IN_REVIEW');

CALL sp_DeleteTask(3);
CALL sp_DeleteProject(2);

-- notification
CALL sp_GetNotificationSettings(6);
CALL sp_UpdateNotificationSettings(7, 0, 1, 0, 1);

-- ── Inspect tables ────────────────────────────────────────────
SELECT * FROM users;
SELECT * FROM projects;
SELECT * FROM project_members;
SELECT * FROM tasks;
SELECT * FROM notification_settings;