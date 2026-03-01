import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllWriteups, getWriteupBySlug } from "@/lib/content";
import { getCategoryMeta } from "@/lib/categories";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { CategoryBadge } from "@/components/content/CategoryBadge";
import { TableOfContents } from "@/components/layout/TableOfContents";
import { MDXContent } from "@/components/mdx/MDXContent";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  return getAllWriteups().map((w) => ({ slug: w.slug.split("/").slice(1) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: slugParts } = await params; const slug = "writeups/" + slugParts.join("/");
  const writeup = getWriteupBySlug(slug);
  if (!writeup) return {};
  return {
    title: writeup.title,
    description: writeup.description,
  };
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "bg-green-950/40 text-green-400 border-green-800/50",
  intermediate: "bg-yellow-950/40 text-yellow-400 border-yellow-800/50",
  advanced: "bg-red-950/40 text-red-400 border-red-800/50",
};

const SEVERITY_COLORS: Record<string, string> = {
  low: "bg-blue-950/40 text-blue-400 border-blue-800/50",
  medium: "bg-yellow-950/40 text-yellow-400 border-yellow-800/50",
  high: "bg-orange-950/40 text-orange-400 border-orange-800/50",
  critical: "bg-red-950/40 text-red-400 border-red-800/50",
};

export default async function WriteupPage({ params }: PageProps) {
  const { slug: slugParts } = await params; const slug = "writeups/" + slugParts.join("/");
  const writeup = getWriteupBySlug(slug);
  if (!writeup) notFound();

  const category = getCategoryMeta(writeup.owaspCategory);

  return (
    <div className="flex gap-8">
      {/* Main content */}
      <article className="min-w-0 flex-1">
        <Breadcrumb
          items={[
            { label: "Write-ups", href: "/writeups" },
            { label: category.code, href: `/categories/${writeup.owaspCategory}` },
            { label: writeup.title },
          ]}
        />

        <header className="mb-8 mt-4">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <CategoryBadge category={writeup.owaspCategory} />
            <span className={`rounded border px-2 py-0.5 font-mono text-xs ${DIFFICULTY_COLORS[writeup.difficulty]}`}>
              {writeup.difficulty}
            </span>
            <span className={`rounded border px-2 py-0.5 font-mono text-xs ${SEVERITY_COLORS[writeup.severity]}`}>
              {writeup.severity}
            </span>
            {writeup.cvssScore !== undefined && (
              <span className="rounded border border-border px-2 py-0.5 font-mono text-xs text-muted-foreground">
                CVSS {writeup.cvssScore.toFixed(1)}
              </span>
            )}
          </div>

          <h1 className="mb-2 font-mono text-2xl font-bold text-foreground lg:text-3xl">
            {writeup.title}
          </h1>
          <p className="text-sm text-muted-foreground">{writeup.description}</p>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span>By {writeup.author}</span>
            <span>
              <time dateTime={writeup.publishedAt}>
                {formatDate(writeup.publishedAt)}
              </time>
            </span>
          </div>

          {writeup.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {writeup.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="font-mono text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </header>

        <div className="prose prose-sm max-w-none dark:prose-invert">
          <MDXContent code={writeup.body} />
        </div>
      </article>

      {/* Sidebar ToC */}
      {writeup.toc.length > 0 && (
        <aside className="hidden w-56 shrink-0 xl:block">
          <div className="sticky top-20">
            <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              On this page
            </p>
            <TableOfContents toc={writeup.toc} />
          </div>
        </aside>
      )}
    </div>
  );
}
