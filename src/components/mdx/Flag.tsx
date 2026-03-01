"use client";

import { useState } from "react";
import { Copy, Check, Flag as FlagIcon, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FlagProps {
  value: string;
  hint?: string;
}

export function Flag({ value, hint }: FlagProps) {
  const [copied, setCopied] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for environments without clipboard API
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="my-6 overflow-hidden rounded-lg border border-purple-800/50 bg-purple-950/20">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-purple-800/30 bg-purple-950/30 px-4 py-2">
        <FlagIcon className="size-3.5 text-purple-400" aria-hidden="true" />
        <span className="text-xs font-semibold uppercase tracking-widest text-purple-400">
          CTF Flag
        </span>
      </div>

      {/* Flag value row */}
      <div className="flex items-center gap-2 p-4">
        <code
          className={cn(
            "flex-1 overflow-x-auto rounded bg-black/40 px-3 py-2",
            "font-mono text-sm text-purple-300 whitespace-nowrap"
          )}
          aria-label="CTF flag value"
        >
          {value}
        </code>

        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "Copied to clipboard" : "Copy flag to clipboard"}
          className={cn(
            "flex shrink-0 items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-medium transition-all",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-1",
            copied
              ? "border-green-700/50 bg-green-950/30 text-green-400"
              : "border-purple-700/50 bg-purple-950/30 text-purple-400 hover:bg-purple-900/30"
          )}
        >
          {copied ? (
            <>
              <Check className="size-3.5" aria-hidden="true" />
              Copied
            </>
          ) : (
            <>
              <Copy className="size-3.5" aria-hidden="true" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Hint section */}
      {hint && (
        <div className="border-t border-purple-800/30 px-4 pb-4">
          <button
            type="button"
            onClick={() => setHintVisible((prev) => !prev)}
            aria-expanded={hintVisible}
            aria-controls="flag-hint"
            className={cn(
              "mt-2 flex items-center gap-1.5 text-xs text-muted-foreground transition-colors",
              "hover:text-purple-400 focus-visible:outline-none focus-visible:underline"
            )}
          >
            <HelpCircle className="size-3.5" aria-hidden="true" />
            {hintVisible ? "Hide hint" : "Show hint"}
          </button>

          {hintVisible && (
            <p
              id="flag-hint"
              role="note"
              aria-label="Flag hint"
              className="mt-2 rounded bg-muted/20 px-3 py-2 text-xs text-muted-foreground"
            >
              {hint}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
