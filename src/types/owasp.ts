export const OWASP_CATEGORIES = [
  "llm01", "llm02", "llm03", "llm04", "llm05",
  "llm06", "llm07", "llm08", "llm09", "llm10",
] as const;

export type OwaspCategory = (typeof OWASP_CATEGORIES)[number];

export type Difficulty = "beginner" | "intermediate" | "advanced";
export type Severity = "low" | "medium" | "high" | "critical";
export type ContentType = "writeup" | "lab" | "demo" | "tool";
