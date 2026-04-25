import type { AgentDefinition } from "@/lib/types";

export const AGENTS: AgentDefinition[] = [
  {
    role: "mike",
    name: "Mike",
    shortName: "MK",
    title: "Team Lead",
    color: "#22d3ee",
    gradient: "linear-gradient(135deg, #67e8f9, #0ea5e9)",
  },
  {
    role: "emma",
    name: "Emma",
    shortName: "EM",
    title: "PM",
    color: "#c084fc",
    gradient: "linear-gradient(135deg, #d8b4fe, #a855f7)",
  },
  {
    role: "bob",
    name: "Bob",
    shortName: "BO",
    title: "Architect",
    color: "#f59e0b",
    gradient: "linear-gradient(135deg, #fcd34d, #f97316)",
  },
  {
    role: "alex",
    name: "Alex",
    shortName: "AL",
    title: "Engineer",
    color: "#34d399",
    gradient: "linear-gradient(135deg, #6ee7b7, #10b981)",
  },
  {
    role: "david",
    name: "David",
    shortName: "DA",
    title: "Data Analyst",
    color: "#fb7185",
    gradient: "linear-gradient(135deg, #fda4af, #f43f5e)",
  },
  {
    role: "iris",
    name: "Iris",
    shortName: "IR",
    title: "Deep Researcher",
    color: "#a78bfa",
    gradient: "linear-gradient(135deg, #c4b5fd, #7c3aed)",
  },
];

export const AGENT_MAP = Object.fromEntries(
  AGENTS.map((agent) => [agent.role, agent]),
) as Record<AgentDefinition["role"], AgentDefinition>;
