"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface TocItem {
  title: string;
  url: string;
  depth?: number;
  items?: TocItem[];
}

interface TableOfContentsProps {
  toc: TocItem[];
}

function flattenToc(items: TocItem[]): TocItem[] {
  return items.flatMap((item) => [item, ...flattenToc(item.items ?? [])]);
}

function TocLink({
  item,
  activeId,
}: {
  item: TocItem;
  activeId: string | null;
}) {
  const id = item.url.replace("#", "");
  const isActive = activeId === id;
  const indent = Math.max(0, (item.depth ?? 2) - 2);

  return (
    <li style={{ paddingLeft: `${indent * 12}px` }}>
      <a
        href={item.url}
        className={cn(
          "block py-0.5 font-mono text-xs leading-relaxed transition-colors hover:text-primary",
          isActive
            ? "border-l-2 border-primary pl-2 text-primary"
            : "text-muted-foreground pl-2"
        )}
        aria-current={isActive ? "true" : undefined}
      >
        {item.title}
      </a>
      {item.items && item.items.length > 0 && (
        <ul className="mt-0.5 space-y-0.5">
          {item.items.map((child) => (
            <TocLink key={child.url} item={child} activeId={activeId} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function TableOfContents({ toc }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const flatItems = flattenToc(toc);
    const ids = flatItems.map((item) => item.url.replace("#", ""));

    observerRef.current?.disconnect();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      {
        rootMargin: "0px 0px -70% 0px",
        threshold: 1,
      }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    observerRef.current = observer;

    return () => observer.disconnect();
  }, [toc]);

  if (toc.length === 0) return null;

  return (
    <nav aria-label="Table of contents">
      <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        On this page
      </p>
      <ul className="space-y-0.5">
        {toc.map((item) => (
          <TocLink key={item.url} item={item} activeId={activeId} />
        ))}
      </ul>
    </nav>
  );
}
