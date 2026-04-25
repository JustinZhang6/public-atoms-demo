import { nanoid } from "nanoid";
import { db } from "@/lib/db";
import type {
  AgentRole,
  FileRecord,
  MessageRecord,
  ProjectDetails,
  ProjectRecord,
} from "@/lib/types";

function touchProject(projectId: string) {
  db.prepare(
    `UPDATE projects
     SET updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
  ).run(projectId);
}

export function listProjects() {
  return db
    .prepare(
      `SELECT id, name, description, created_at, updated_at
       FROM projects
       ORDER BY datetime(updated_at) DESC`,
    )
    .all() as ProjectRecord[];
}

export function getProject(projectId: string) {
  return db
    .prepare(
      `SELECT id, name, description, created_at, updated_at
       FROM projects
       WHERE id = ?`,
    )
    .get(projectId) as ProjectRecord | undefined;
}

export function getProjectDetails(projectId: string): ProjectDetails | null {
  const project = getProject(projectId);

  if (!project) {
    return null;
  }

  const messages = db
    .prepare(
      `SELECT id, project_id, role, content, agent_name, created_at
       FROM messages
       WHERE project_id = ?
       ORDER BY datetime(created_at) ASC`,
    )
    .all(projectId) as MessageRecord[];

  const files = db
    .prepare(
      `SELECT id, project_id, filename, content, language, updated_at
       FROM files
       WHERE project_id = ?
       ORDER BY filename ASC`,
    )
    .all(projectId) as FileRecord[];

  return { project, messages, files };
}

export function createProject(input: {
  name: string;
  description?: string | null;
}) {
  const project: ProjectRecord = {
    id: nanoid(),
    name: input.name,
    description: input.description ?? null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  db.prepare(
    `INSERT INTO projects (id, name, description)
     VALUES (@id, @name, @description)`,
  ).run({
    id: project.id,
    name: project.name,
    description: project.description,
  });

  return getProject(project.id)!;
}

export function updateProject(projectId: string, input: {
  name?: string;
  description?: string | null;
}) {
  const current = getProject(projectId);
  if (!current) {
    return null;
  }

  db.prepare(
    `UPDATE projects
     SET name = @name,
         description = @description,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = @id`,
  ).run({
    id: projectId,
    name: input.name ?? current.name,
    description:
      input.description === undefined ? current.description : input.description,
  });

  return getProject(projectId)!;
}

export function createMessage(input: {
  projectId: string;
  role: AgentRole;
  content: string;
  agentName?: string | null;
}) {
  const id = nanoid();
  db.prepare(
    `INSERT INTO messages (id, project_id, role, content, agent_name)
     VALUES (@id, @project_id, @role, @content, @agent_name)`,
  ).run({
    id,
    project_id: input.projectId,
    role: input.role,
    content: input.content,
    agent_name: input.agentName ?? null,
  });

  touchProject(input.projectId);

  return db
    .prepare(
      `SELECT id, project_id, role, content, agent_name, created_at
       FROM messages
       WHERE id = ?`,
    )
    .get(id) as MessageRecord;
}

export function upsertFile(input: {
  projectId: string;
  filename: string;
  content: string;
  language?: string;
}) {
  db.prepare(
    `INSERT INTO files (id, project_id, filename, content, language)
     VALUES (@id, @project_id, @filename, @content, @language)
     ON CONFLICT(project_id, filename)
     DO UPDATE SET
       content = excluded.content,
       language = excluded.language,
       updated_at = CURRENT_TIMESTAMP`,
  ).run({
    id: nanoid(),
    project_id: input.projectId,
    filename: input.filename,
    content: input.content,
    language: input.language ?? "html",
  });

  touchProject(input.projectId);

  return db
    .prepare(
      `SELECT id, project_id, filename, content, language, updated_at
       FROM files
       WHERE project_id = ? AND filename = ?`,
    )
    .get(input.projectId, input.filename) as FileRecord;
}
