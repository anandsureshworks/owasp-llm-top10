import { FileCode } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface CodeBlockProps {
  children: ReactNode;
  filename?: string;
  language?: string;
}

/**
 * Wrapper for rehype-pretty-code output.
 * Adds an optional filename tab above the code block.
 *
 * Usage in MDX (via custom components map):
 *   <CodeBlock filename="attack.py" language="python">
 *     {children}  // rendered by rehype-pretty-code
 *   </CodeBlock>
 */
export function CodeBlock({ children, filename, language }: CodeBlockProps) {
  return (
    <div
      className={cn(
        "my-6 overflow-hidden rounded-lg border border-border bg-card",
        "[&_[data-rehype-pretty-code-figure]]:my-0",
        "[&_[data-rehype-pretty-code-figure]]:border-0",
        "[&_[data-rehype-pretty-code-figure]]:rounded-none"
      )}
    >
      {/* Filename / language tab */}
      {(filename || language) && (
        <div
          className="flex items-center gap-2 border-b border-border bg-muted/30 px-4 py-2"
          aria-label={filename ? `File: ${filename}` : `Language: ${language}`}
        >
          <FileCode
            className="size-3.5 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          {filename ? (
            <span className="font-mono text-xs text-muted-foreground">
              {filename}
            </span>
          ) : (
            <span className="text-xs uppercase tracking-widest text-muted-foreground">
              {language}
            </span>
          )}
          {/* Traffic-light dots — purely decorative */}
          <div className="ml-auto flex items-center gap-1.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-red-500/60" />
            <span className="size-2.5 rounded-full bg-yellow-500/60" />
            <span className="size-2.5 rounded-full bg-green-500/60" />
          </div>
        </div>
      )}

      {/* Code content — rehype-pretty-code renders a <figure> or <pre> here */}
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}
