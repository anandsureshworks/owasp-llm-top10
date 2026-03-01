import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllLabs, getLabBySlug } from "@/lib/content";
import { getCategoryMeta } from "@/lib/categories";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { CategoryBadge } from "@/components/content/CategoryBadge";
import { TableOfContents } from "@/components/layout/TableOfContents";
import { MDXContent } from "@/components/mdx/MDXContent";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Trophy, Clock, Target } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  return getAllLabs().map((l) => ({ slug: l.slug.split("/").slice(1) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: slugParts } = await params; const slug = "labs/" + slugParts.join("/");
  const lab = getLabBySlug(slug);
  if (!lab) return {};
  return { title: lab.title, description: lab.description };
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "bg-green-950/40 text-green-400 border-green-800/50",
  intermediate: "bg-yellow-950/40 text-yellow-400 border-yellow-800/50",
  advanced: "bg-red-950/40 text-red-400 border-red-800/50",
};

const CHALLENGE_LABELS: Record<string, string> = {
  "black-box": "Black-box",
  "white-box": "White-box",
  ctf: "CTF",
  guided: "Guided",
};

export default async function LabPage({ params }: PageProps) {
  const { slug: slugParts } = await params; const slug = "labs/" + slugParts.join("/");
  const lab = getLabBySlug(slug);
  if (!lab) notFound();

  const category = getCategoryMeta(lab.owaspCategory);

  return (
    <div className="flex gap-8">
      <article className="min-w-0 flex-1">
        <Breadcrumb
          items={[
            { label: "Labs", href: "/labs" },
            { label: category.code, href: `/categories/${lab.owaspCategory}` },
            { label: lab.title },
          ]}
        />

        <header className="mb-8 mt-4">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <CategoryBadge category={lab.owaspCategory} />
            <span className={`rounded border px-2 py-0.5 font-mono text-xs ${DIFFICULTY_COLORS[lab.difficulty]}`}>
              {lab.difficulty}
            </span>
            <Badge variant="outline" className="font-mono text-xs">
              {CHALLENGE_LABELS[lab.challengeType]}
            </Badge>
          </div>

          <h1 className="mb-2 font-mono text-2xl font-bold text-foreground lg:text-3xl">
            {lab.title}
          </h1>
          <p className="text-sm text-muted-foreground">{lab.description}</p>

          <div className="mt-4 flex flex-wrap gap-4 text-xs">
            {lab.points > 0 && (
              <span className="flex items-center gap-1.5 text-primary">
                <Trophy className="size-3.5" />
                {lab.points} pts
              </span>
            )}
            {lab.timeEstimate && (
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="size-3.5" />
                {lab.timeEstimate}
              </span>
            )}
            {lab.flagFormat && (
              <span className="flex items-center gap-1.5 font-mono text-muted-foreground">
                <Target className="size-3.5" />
                {lab.flagFormat}
              </span>
            )}
            <span className="text-muted-foreground">By {lab.author}</span>
            <time dateTime={lab.publishedAt} className="text-muted-foreground">
              {formatDate(lab.publishedAt)}
            </time>
          </div>

          {lab.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {lab.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="font-mono text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </header>

        <div className="prose prose-sm max-w-none dark:prose-invert">
          <MDXContent code={lab.body} />
        </div>
      </article>

      {lab.toc.length > 0 && (
        <aside className="hidden w-56 shrink-0 xl:block">
          <div className="sticky top-20">
            <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              On this page
            </p>
            <TableOfContents toc={lab.toc} />
          </div>
        </aside>
      )}
    </div>
  );
}
