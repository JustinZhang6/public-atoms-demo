import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { nanoid } from "nanoid";
import { SEED_PROJECTS } from "@/lib/demo";

const dataDirectory = path.join(process.cwd(), ".data");
const databasePath = path.join(dataDirectory, "atoms-demo.sqlite");

function createDatabase() {
  fs.mkdirSync(dataDirectory, { recursive: true });
  return new Database(databasePath);
}

type DatabaseInstance = ReturnType<typeof createDatabase>;

const globalForDb = globalThis as typeof globalThis & {
  __atomsDemoDb?: DatabaseInstance;
};

function initializeDatabase(db: DatabaseInstance) {
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      agent_name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS files (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      filename TEXT NOT NULL,
      content TEXT NOT NULL,
      language TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    CREATE UNIQUE INDEX IF NOT EXISTS files_project_filename_idx
      ON files (project_id, filename);

    CREATE INDEX IF NOT EXISTS messages_project_id_idx
      ON messages (project_id, created_at);

    CREATE INDEX IF NOT EXISTS projects_updated_at_idx
      ON projects (updated_at DESC);
  `);

  const projectCount = db
    .prepare("SELECT COUNT(*) as count FROM projects")
    .get() as { count: number };

  if (projectCount.count > 0) {
    return;
  }

  const insertProject = db.prepare(`
    INSERT INTO projects (id, name, description)
    VALUES (@id, @name, @description)
  `);

  const insertMessage = db.prepare(`
    INSERT INTO messages (id, project_id, role, content, agent_name)
    VALUES (@id, @project_id, @role, @content, @agent_name)
  `);

  const insertFile = db.prepare(`
    INSERT INTO files (id, project_id, filename, content, language)
    VALUES (@id, @project_id, @filename, @content, @language)
  `);

  const seed = db.transaction(() => {
    for (const project of SEED_PROJECTS) {
      const projectId = nanoid();
      insertProject.run({
        id: projectId,
        name: project.name,
        description: project.description,
      });

      for (const message of project.messages) {
        insertMessage.run({
          id: nanoid(),
          project_id: projectId,
          role: message.role,
          content: message.content,
          agent_name: message.agent_name,
        });
      }

      insertFile.run({
        id: nanoid(),
        project_id: projectId,
        filename: "index.html",
        content: project.html,
        language: "html",
      });
    }
  });

  seed();
}

export const db = globalForDb.__atomsDemoDb ?? createDatabase();

if (!globalForDb.__atomsDemoDb) {
  initializeDatabase(db);
  globalForDb.__atomsDemoDb = db;
}

export { databasePath };
