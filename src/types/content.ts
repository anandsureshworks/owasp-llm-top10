import type { OwaspCategory, Difficulty, Severity } from "./owasp";

export interface BaseContent {
  slug: string;
  title: string;
  description: string;
  owaspCategory: OwaspCategory;
  tags: string[];
  author: string;
  publishedAt: string;
  updatedAt?: string;
  draft: boolean;
  body: React.ComponentType;
  toc: TocEntry[];
}

export interface TocEntry {
  title: string;
  url: string;
  depth: number;
  items?: TocEntry[];
}

export interface Writeup extends BaseContent {
  difficulty: Difficulty;
  severity: Severity;
  cvssScore?: number;
  relatedLabs: string[];
  relatedDemos: string[];
  relatedTools: string[];
}

export interface Lab extends BaseContent {
  difficulty: Difficulty;
  challengeType: "black-box" | "white-box" | "ctf" | "guided";
  sandboxType: "sandpack" | "iframe" | "none";
  timeEstimate?: string;
  points: number;
  hasSolution: boolean;
  flagFormat?: string;
  relatedWriteups: string[];
}

export interface Demo extends BaseContent {
  demoType: "interactive" | "visualization" | "comparison" | "benchmark";
  isSafeToRun: boolean;
  requiresApiKey: boolean;
  interactiveComponents: string[];
  relatedWriteups: string[];
}

export interface Tool extends BaseContent {
  owaspCategories: OwaspCategory[];
  toolType: "scanner" | "framework" | "library" | "dataset" | "benchmark" | "red-team" | "defense";
  projectUrl: string;
  githubUrl?: string;
  license?: string;
  status: "active" | "maintained" | "archived" | "experimental";
}
