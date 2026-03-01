import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllDemos, getDemoBySlug } from "@/lib/content";
import { getCategoryMeta } from "@/lib/categories";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { CategoryBadge } from "@/components/content/CategoryBadge";
import { TableOfContents } from "@/components/layout/TableOfContents";
import { MDXContent } from "@/components/mdx/MDXContent";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, KeyRound } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  return getAllDemos().map((d) => ({ slug: d.slug.split("/").slice(1) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: slugParts } = await params; const slug = "demos/" + slugParts.join("/");
  const demo = getDemoBySlug(slug);
  if (!demo) return {};
  return { title: demo.title, description: demo.description };
}

export default async function DemoPage({ params }: PageProps) {
  const { slug: slugParts } = await params; const slug = "demos/" + slugParts.join("/");
  const demo = getDemoBySlug(slug);
  if (!demo) notFound();

  const category = getCategoryMeta(demo.owaspCategory);

  return (
    <div className="flex gap-8">
      <article className="min-w-0 flex-1">
        <Breadcrumb
          items={[
            { label: "Demos", href: "/demos" },
            { label: category.code, href: `/categories/${demo.owaspCategory}` },
            { label: demo.title },
          ]}
        />

        <header className="mb-8 mt-4">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <CategoryBadge category={demo.owaspCategory} />
            <Badge variant="outline" className="font-mono text-xs capitalize">
              {demo.demoType}
            </Badge>
            <span className="flex items-center gap-1 text-xs">
              <span
                className={`size-2 rounded-full ${demo.isSafeToRun ? "bg-green-500" : "bg-yellow-500"}`}
                aria-label={demo.isSafeToRun ? "Safe to run" : "Caution advised"}
              />
              <span className="text-muted-foreground">
                {demo.isSafeToRun ? "Safe" : "Caution"}
              </span>
            </span>
          </div>

          {demo.requiresApiKey && (
            <div className="mb-3 flex items-center gap-2 rounded border border-yellow-800/40 bg-yellow-950/20 px-3 py-2 text-xs text-yellow-400">
              <KeyRound className="size-3.5 shrink-0" />
              This demo requires an API key to fully function.
            </div>
          )}

          {!demo.isSafeToRun && (
            <div className="mb-3 flex items-center gap-2 rounded border border-orange-800/40 bg-orange-950/20 px-3 py-2 text-xs text-orange-400">
              <AlertTriangle className="size-3.5 shrink-0" />
              This demo simulates an attack pattern. Review before running.
            </div>
          )}

          <h1 className="mb-2 font-mono text-2xl font-bold text-foreground lg:text-3xl">
            {demo.title}
          </h1>
          <p className="text-sm text-muted-foreground">{demo.description}</p>

          <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span>By {demo.author}</span>
            <time dateTime={demo.publishedAt}>{formatDate(demo.publishedAt)}</time>
          </div>

          {demo.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {demo.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="font-mono text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </header>

        <div className="prose prose-sm max-w-none dark:prose-invert">
          <MDXContent code={demo.body} />
        </div>
      </article>

      {demo.toc.length > 0 && (
        <aside className="hidden w-56 shrink-0 xl:block">
          <div className="sticky top-20">
            <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              On this page
            </p>
            <TableOfContents toc={demo.toc} />
          </div>
        </aside>
      )}
    </div>
  );
}
