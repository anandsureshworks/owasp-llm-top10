import Link from "next/link";
import { Clock, Trophy } from "lucide-react";
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
import type { OwaspCategory, Difficulty } from "@/types/owasp";

export type ChallengeType =
  | "black-box"
  | "white-box"
  | "ctf"
  | "guided";

export interface LabCardProps {
  title: string;
  description: string;
  slug: string;
  owaspCategory: OwaspCategory;
  difficulty: Difficulty;
  points: number;
  timeEstimate?: string;
  challengeType: ChallengeType;
}

const DIFFICULTY_CLASSES: Record<Difficulty, string> = {
  beginner: "bg-green-100/70 dark:bg-green-950/40 text-green-700 dark:text-green-400 border-green-300 dark:border-green-800/50",
  intermediate: "bg-yellow-100/70 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-800/50",
  advanced: "bg-red-100/70 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-300 dark:border-red-800/50",
};

const CHALLENGE_TYPE_LABELS: Record<ChallengeType, string> = {
  "black-box": "Black-box",
  "white-box": "White-box",
  ctf: "CTF",
  guided: "Guided",
};

export function LabCard({
  title,
  description,
  slug,
  owaspCategory,
  difficulty,
  points,
  timeEstimate,
  challengeType,
}: LabCardProps) {
  return (
    <Card className="flex flex-col gap-0 py-0 transition-colors hover:border-primary/40">
      <CardHeader className="gap-3 px-5 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <CategoryBadge category={owaspCategory} size="sm" />
          <span
            className={`inline-flex shrink-0 items-center rounded border font-mono px-1.5 py-0.5 text-[10px] font-medium capitalize ${DIFFICULTY_CLASSES[difficulty]}`}
          >
            {difficulty}
          </span>
          <Badge
            variant="outline"
            className="ml-auto flex items-center gap-1 rounded font-mono text-[10px] text-primary border-primary/40"
          >
            <Trophy className="size-2.5" aria-hidden="true" />
            {points} pts
          </Badge>
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

      <CardFooter className="flex items-center gap-3 px-5 pb-5">
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Clock className="size-3" aria-hidden="true" />
          <span>{timeEstimate}</span>
        </div>
        <Badge
          variant="secondary"
          className="rounded font-mono text-[10px]"
        >
          {CHALLENGE_TYPE_LABELS[challengeType]}
        </Badge>
      </CardFooter>
    </Card>
  );
}
