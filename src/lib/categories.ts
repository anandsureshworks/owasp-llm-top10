import type { OwaspCategory } from "@/types/owasp";

export interface CategoryMeta {
  id: OwaspCategory;
  code: string;
  name: string;
  shortName: string;
  description: string;
  color: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  icon: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: "llm01",
    code: "LLM01",
    name: "Prompt Injection",
    shortName: "Prompt Injection",
    description:
      "Attackers manipulate LLM inputs to override instructions, exfiltrate data, or execute unintended actions through crafted prompts.",
    color: "#ef4444",
    bgColor: "bg-red-100/70 dark:bg-red-950/30",
    textColor: "text-red-700 dark:text-red-400",
    borderColor: "border-red-300 dark:border-red-800/50",
    icon: "Terminal",
  },
  {
    id: "llm02",
    code: "LLM02",
    name: "Sensitive Information Disclosure",
    shortName: "Info Disclosure",
    description:
      "LLMs inadvertently reveal confidential data, system prompts, training data, or PII through outputs or inference attacks.",
    color: "#f97316",
    bgColor: "bg-orange-100/70 dark:bg-orange-950/30",
    textColor: "text-orange-700 dark:text-orange-400",
    borderColor: "border-orange-300 dark:border-orange-800/50",
    icon: "Eye",
  },
  {
    id: "llm03",
    code: "LLM03",
    name: "Supply Chain",
    shortName: "Supply Chain",
    description:
      "Compromised third-party models, datasets, or plugins introduce vulnerabilities, backdoors, or malicious behavior into LLM deployments.",
    color: "#eab308",
    bgColor: "bg-yellow-100/70 dark:bg-yellow-950/30",
    textColor: "text-yellow-700 dark:text-yellow-400",
    borderColor: "border-yellow-300 dark:border-yellow-800/50",
    icon: "Package",
  },
  {
    id: "llm04",
    code: "LLM04",
    name: "Data and Model Poisoning",
    shortName: "Data Poisoning",
    description:
      "Adversarial manipulation of training data or fine-tuning processes to embed backdoors or bias model behavior.",
    color: "#84cc16",
    bgColor: "bg-lime-100/70 dark:bg-lime-950/30",
    textColor: "text-lime-700 dark:text-lime-400",
    borderColor: "border-lime-300 dark:border-lime-800/50",
    icon: "Biohazard",
  },
  {
    id: "llm05",
    code: "LLM05",
    name: "Improper Output Handling",
    shortName: "Output Handling",
    description:
      "Downstream systems blindly trust LLM output, enabling XSS, SSRF, code injection, or command execution vulnerabilities.",
    color: "#22c55e",
    bgColor: "bg-green-100/70 dark:bg-green-950/30",
    textColor: "text-green-700 dark:text-green-400",
    borderColor: "border-green-300 dark:border-green-800/50",
    icon: "Code2",
  },
  {
    id: "llm06",
    code: "LLM06",
    name: "Excessive Agency",
    shortName: "Excessive Agency",
    description:
      "LLM agents with excessive permissions, autonomy, or capabilities perform unintended high-impact actions without oversight.",
    color: "#06b6d4",
    bgColor: "bg-cyan-100/70 dark:bg-cyan-950/30",
    textColor: "text-cyan-700 dark:text-cyan-400",
    borderColor: "border-cyan-300 dark:border-cyan-800/50",
    icon: "Bot",
  },
  {
    id: "llm07",
    code: "LLM07",
    name: "System Prompt Leakage",
    shortName: "Prompt Leakage",
    description:
      "Confidential system prompts, operational instructions, or business logic are extracted through carefully crafted user inputs.",
    color: "#3b82f6",
    bgColor: "bg-blue-100/70 dark:bg-blue-950/30",
    textColor: "text-blue-700 dark:text-blue-400",
    borderColor: "border-blue-300 dark:border-blue-800/50",
    icon: "FileKey",
  },
  {
    id: "llm08",
    code: "LLM08",
    name: "Vector and Embedding Weaknesses",
    shortName: "Vector/Embedding",
    description:
      "Attacks exploit vulnerabilities in vector databases and embedding systems used in RAG pipelines to manipulate retrieval.",
    color: "#8b5cf6",
    bgColor: "bg-violet-100/70 dark:bg-violet-950/30",
    textColor: "text-violet-700 dark:text-violet-400",
    borderColor: "border-violet-300 dark:border-violet-800/50",
    icon: "Database",
  },
  {
    id: "llm09",
    code: "LLM09",
    name: "Misinformation",
    shortName: "Misinformation",
    description:
      "LLMs generate convincing but false information, exploiting overconfidence to spread harmful or deceptive content at scale.",
    color: "#ec4899",
    bgColor: "bg-pink-100/70 dark:bg-pink-950/30",
    textColor: "text-pink-700 dark:text-pink-400",
    borderColor: "border-pink-300 dark:border-pink-800/50",
    icon: "AlertTriangle",
  },
  {
    id: "llm10",
    code: "LLM10",
    name: "Unbounded Consumption",
    shortName: "Unbounded Consumption",
    description:
      "Attackers exploit LLMs to consume excessive compute resources, inflating costs or degrading service availability.",
    color: "#14b8a6",
    bgColor: "bg-teal-100/70 dark:bg-teal-950/30",
    textColor: "text-teal-700 dark:text-teal-400",
    borderColor: "border-teal-300 dark:border-teal-800/50",
    icon: "Zap",
  },
];

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c])
) as Record<OwaspCategory, CategoryMeta>;

export function getCategoryMeta(id: OwaspCategory): CategoryMeta {
  return CATEGORY_MAP[id];
}

export function getCategoryByCode(code: string): CategoryMeta | undefined {
  return CATEGORIES.find((c) => c.code.toLowerCase() === code.toLowerCase());
}
