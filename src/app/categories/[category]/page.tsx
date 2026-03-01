"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import { CATEGORIES, getCategoryMeta } from "@/lib/categories";
import {
  getWriteupsByCategory,
  getLabsByCategory,
  getDemosByCategory,
  getToolsByCategory,
} from "@/lib/content";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WriteupCard } from "@/components/content/WriteupCard";
import { LabCard } from "@/components/content/LabCard";
import { DemoCard } from "@/components/content/DemoCard";
import { ToolCard } from "@/components/content/ToolCard";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import type { OwaspCategory } from "@/types/owasp";

interface PageProps {
  params: Promise<{ category: string }>;
}

const VALID_CATEGORIES = CATEGORIES.map((c) => c.id);

function EmptyState({ type, category }: { type: string; category: string }) {
  return (
    <p className="py-8 font-mono text-sm text-muted-foreground">
      No {type} yet for this category.{" "}
      <a href="/contribute" className="text-primary hover:underline">
        Contribute one!
      </a>
    </p>
  );
}

export default function CategoryPage({ params }: PageProps) {
  const { category } = use(params);

  if (!VALID_CATEGORIES.includes(category as OwaspCategory)) {
    notFound();
  }

  const cat = getCategoryMeta(category as OwaspCategory);
  const writeups = getWriteupsByCategory(category as OwaspCategory);
  const labs = getLabsByCategory(category as OwaspCategory);
  const demos = getDemosByCategory(category as OwaspCategory);
  const tools = getToolsByCategory(category as OwaspCategory);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Breadcrumb
        items={[
          { label: "Categories", href: "/categories" },
          { label: cat.code },
        ]}
      />

      <header className={`mt-4 mb-8 rounded-lg border p-6 ${cat.bgColor} ${cat.borderColor}`}>
        <div className="mb-2 flex items-center gap-2">
          <span className={`font-mono text-xs font-bold ${cat.textColor}`}>
            {cat.code}
          </span>
        </div>
        <h1 className="mb-2 font-mono text-2xl font-bold text-foreground">
          {cat.name}
        </h1>
        <p className="text-sm text-muted-foreground">{cat.description}</p>
        <div className="mt-4 flex flex-wrap gap-4 font-mono text-xs text-muted-foreground">
          <span>{writeups.length} write-ups</span>
          <span>{labs.length} labs</span>
          <span>{demos.length} demos</span>
          <span>{tools.length} tools</span>
        </div>
      </header>

      <Tabs defaultValue="writeups">
        <TabsList className="mb-6 font-mono">
          <TabsTrigger value="writeups">
            Write-ups ({writeups.length})
          </TabsTrigger>
          <TabsTrigger value="labs">Labs ({labs.length})</TabsTrigger>
          <TabsTrigger value="demos">Demos ({demos.length})</TabsTrigger>
          <TabsTrigger value="tools">Tools ({tools.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="writeups">
          {writeups.length === 0 ? (
            <EmptyState type="write-ups" category={cat.code} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {writeups.map((w) => (
                <WriteupCard key={w.slug} {...w} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="labs">
          {labs.length === 0 ? (
            <EmptyState type="labs" category={cat.code} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {labs.map((l) => (
                <LabCard key={l.slug} {...l} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="demos">
          {demos.length === 0 ? (
            <EmptyState type="demos" category={cat.code} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {demos.map((d) => (
                <DemoCard key={d.slug} {...d} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="tools">
          {tools.length === 0 ? (
            <EmptyState type="tools" category={cat.code} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tools.map((t) => (
                <ToolCard key={t.slug} {...t} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
