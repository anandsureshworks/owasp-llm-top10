"use client";

import { useState } from "react";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SpoilerProps {
  title?: string;
  children: ReactNode;
}

export function Spoiler({ title = "Reveal Solution", children }: SpoilerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="my-6 overflow-hidden rounded-lg border border-border bg-card">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls="spoiler-content"
        className={cn(
          "flex w-full items-center justify-between gap-3 px-4 py-3 text-sm font-medium transition-colors",
          "hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
          isOpen ? "text-foreground" : "text-muted-foreground"
        )}
      >
        <span className="flex items-center gap-2">
          {isOpen ? (
            <EyeOff className="size-4 shrink-0 text-primary" aria-hidden="true" />
          ) : (
            <Eye className="size-4 shrink-0 text-primary" aria-hidden="true" />
          )}
          {title}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>

      <div
        id="spoiler-content"
        role="region"
        aria-label={title}
        className={cn(
          "overflow-hidden transition-all duration-300",
          isOpen ? "max-h-[9999px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div
          className={cn(
            "border-t border-border px-4 py-4 transition-all duration-300",
            !isOpen && "blur-sm select-none pointer-events-none"
          )}
        >
          <div className="text-sm text-foreground [&>p]:mt-0">{children}</div>
        </div>
      </div>

      {!isOpen && (
        <div
          aria-hidden="true"
          className="border-t border-border px-4 py-4 blur-sm select-none pointer-events-none"
        >
          <div className="h-16 rounded bg-muted/20" />
        </div>
      )}
    </div>
  );
}
