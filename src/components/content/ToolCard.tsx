import Link from "next/link";
import { ExternalLink, Github } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CategoryBadge } from "@/components/content/CategoryBadge";
import type { OwaspCategory } from "@/types/owasp";

export type ToolType =
  | "scanner"
  | "framework"
  | "library"
  | "dataset"
  | "benchmark"
  | "red-team"
  | "defense";

export type ToolStatus = "active" | "maintained" | "archived" | "experimental";

export interface ToolCardProps {
  title: string;
  description: string;
  slug: string;
  owaspCategories: OwaspCategory[];
  toolType: ToolType;
  projectUrl?: string;
  githubUrl?: string;
  status: ToolStatus;
}

const TOOL_TYPE_LABELS: Record<ToolType, string> = {
  scanner: "Scanner",
  framework: "Framework",
  library: "Library",
  dataset: "Dataset",
  benchmark: "Benchmark",
  "red-team": "Red Team",
  defense: "Defense",
};

const STATUS_CLASSES: Record<ToolStatus, string> = {
  active: "bg-green-950/40 text-green-400 border-green-800/50",
  maintained: "bg-yellow-950/40 text-yellow-400 border-yellow-800/50",
  archived: "bg-zinc-800/40 text-zinc-500 border-zinc-700/50",
  experimental: "bg-blue-950/40 text-blue-400 border-blue-800/50",
};

export function ToolCard({
  title,
  description,
  slug,
  owaspCategories,
  toolType,
  projectUrl,
  githubUrl,
  status,
}: ToolCardProps) {
  return (
    <Card className="flex flex-col gap-0 py-0 transition-colors hover:border-primary/40">
      <CardHeader className="gap-3 px-5 pt-5 pb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {owaspCategories.map((cat) => (
            <CategoryBadge key={cat} category={cat} size="sm" />
          ))}
          <Badge
            variant="outline"
            className="rounded font-mono text-[10px] text-muted-foreground"
          >
            {TOOL_TYPE_LABELS[toolType]}
          </Badge>
          <span
            className={`ml-auto inline-flex shrink-0 items-center rounded border font-mono px-1.5 py-0.5 text-[10px] font-medium capitalize ${STATUS_CLASSES[status]}`}
          >
            {status}
          </span>
        </div>
        <CardTitle className="text-sm leading-snug">
          <Link
            href={`/${slug}`}
            className="text-foreground transition-colors hover:text-primary"
          >
            {title}
          </Link>
        </CardTitle>
      </CardHeader>

      <CardContent className="px-5 pb-3">
        <CardDescription className="line-clamp-2 text-xs leading-relaxed">
          {description}
        </CardDescription>
      </CardContent>

      {(projectUrl || githubUrl) && (
        <CardFooter className="flex items-center gap-3 px-5 pb-5">
          {projectUrl && (
            <a
              href={projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground transition-colors hover:text-primary"
            >
              <ExternalLink className="size-3" aria-hidden="true" />
              Project
            </a>
          )}
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground transition-colors hover:text-primary"
            >
              <Github className="size-3" aria-hidden="true" />
              GitHub
            </a>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
