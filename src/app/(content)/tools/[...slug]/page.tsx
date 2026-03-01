import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllTools, getToolBySlug } from "@/lib/content";
import { getCategoryMeta } from "@/lib/categories";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { CategoryBadge } from "@/components/content/CategoryBadge";
import { TableOfContents } from "@/components/layout/TableOfContents";
import { MDXContent } from "@/components/mdx/MDXContent";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  return getAllTools().map((t) => ({ slug: t.slug.split("/").slice(1) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: slugParts } = await params; const slug = "tools/" + slugParts.join("/");
  const tool = getToolBySlug(slug);
  if (!tool) return {};
  return { title: tool.title, description: tool.description };
}

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-950/40 text-green-400 border-green-800/50",
  maintained: "bg-blue-950/40 text-blue-400 border-blue-800/50",
  archived: "bg-zinc-950/40 text-zinc-400 border-zinc-800/50",
  experimental: "bg-purple-950/40 text-purple-400 border-purple-800/50",
};

export default async function ToolPage({ params }: PageProps) {
  const { slug: slugParts } = await params; const slug = "tools/" + slugParts.join("/");
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const primaryCategory = getCategoryMeta(tool.owaspCategory);

  return (
    <div className="flex gap-8">
      <article className="min-w-0 flex-1">
        <Breadcrumb
          items={[
            { label: "Tools", href: "/tools" },
            { label: primaryCategory.code, href: `/categories/${tool.owaspCategory}` },
            { label: tool.title },
          ]}
        />

        <header className="mb-8 mt-4">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {tool.owaspCategories.map((cat) => (
              <CategoryBadge key={cat} category={cat} />
            ))}
            <Badge variant="outline" className="font-mono text-xs capitalize">
              {tool.toolType.replace("-", " ")}
            </Badge>
            <span className={`rounded border px-2 py-0.5 font-mono text-xs ${STATUS_COLORS[tool.status]}`}>
              {tool.status}
            </span>
          </div>

          <h1 className="mb-2 font-mono text-2xl font-bold text-foreground lg:text-3xl">
            {tool.title}
          </h1>
          <p className="text-sm text-muted-foreground">{tool.description}</p>

          {tool.license && (
            <p className="mt-2 font-mono text-xs text-muted-foreground">
              License: {tool.license}
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-3">
            <Button asChild size="sm" className="font-mono text-xs">
              <a href={tool.projectUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-1.5 size-3.5" />
                Project Site
              </a>
            </Button>
            {tool.githubUrl && (
              <Button asChild size="sm" variant="outline" className="font-mono text-xs">
                <a href={tool.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-1.5 size-3.5" />
                  GitHub
                </a>
              </Button>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span>By {tool.author}</span>
            <time dateTime={tool.publishedAt}>{formatDate(tool.publishedAt)}</time>
          </div>

          {tool.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tool.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="font-mono text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </header>

        <div className="prose prose-sm max-w-none dark:prose-invert">
          <MDXContent code={tool.body} />
        </div>
      </article>

      {tool.toc.length > 0 && (
        <aside className="hidden w-56 shrink-0 xl:block">
          <div className="sticky top-20">
            <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              On this page
            </p>
            <TableOfContents toc={tool.toc} />
          </div>
        </aside>
      )}
    </div>
  );
}
