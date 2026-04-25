export type AgentRole =
  | "user"
  | "mike"
  | "emma"
  | "bob"
  | "alex"
  | "david"
  | "iris"
  | "system";

export interface AgentDefinition {
  role: Exclude<AgentRole, "user" | "system">;
  name: string;
  shortName: string;
  title: string;
  color: string;
  gradient: string;
}

export interface ProjectRecord {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface MessageRecord {
  id: string;
  project_id: string;
  role: AgentRole;
  content: string;
  agent_name: string | null;
  created_at: string;
}

export interface FileRecord {
  id: string;
  project_id: string;
  filename: string;
  content: string;
  language: string | null;
  updated_at: string;
}

export interface ProjectDetails {
  project: ProjectRecord;
  messages: MessageRecord[];
  files: FileRecord[];
}

export interface LandingCaseStudy {
  title: string;
  category: string;
  description: string;
  highlights: string[];
  background: string;
}
