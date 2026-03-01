"use client";

import { useState, useRef } from "react";
import {
  Lock,
  Send,
  ChevronDown,
  Terminal,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PromptPlaygroundProps {
  systemPrompt?: string;
  initialUserPrompt?: string;
  injectionPayloads?: string[];
  title?: string;
}

interface OutputEntry {
  id: number;
  systemPrompt: string | undefined;
  userMessage: string;
  timestamp: string;
}

let entryCounter = 0;

function formatTimestamp(): string {
  return new Date().toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function PromptPlayground({
  systemPrompt,
  initialUserPrompt = "",
  injectionPayloads,
  title = "Prompt Injection Playground",
}: PromptPlaygroundProps) {
  const [userMessage, setUserMessage] = useState(initialUserPrompt);
  const [outputs, setOutputs] = useState<OutputEntry[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  function handleSend() {
    if (!userMessage.trim()) return;

    const entry: OutputEntry = {
      id: ++entryCounter,
      systemPrompt,
      userMessage: userMessage.trim(),
      timestamp: formatTimestamp(),
    };

    setOutputs((prev) => [...prev, entry]);

    // Scroll output to bottom after state update
    setTimeout(() => {
      if (outputRef.current) {
        outputRef.current.scrollTop = outputRef.current.scrollHeight;
      }
    }, 0);
  }

  function handlePayloadSelect(payload: string) {
    setUserMessage(payload);
    setDropdownOpen(false);
  }

  function handleClear() {
    setOutputs([]);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div
      className="my-6 overflow-hidden rounded-lg border border-border bg-[oklch(0.10_0_0)] font-mono text-sm"
      role="region"
      aria-label={title}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-border bg-[oklch(0.13_0_0)] px-4 py-3">
        <Terminal className="size-4 text-primary" aria-hidden="true" />
        <span className="text-xs font-semibold tracking-wide text-primary">
          {title}
        </span>
        <span className="ml-2 rounded border border-yellow-700/50 bg-yellow-950/30 px-1.5 py-0.5 text-[10px] font-medium text-yellow-400">
          STATIC DEMO
        </span>
        {outputs.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear output"
            className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Trash2 className="size-3.5" aria-hidden="true" />
            Clear
          </button>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* System prompt display */}
        {systemPrompt && (
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Lock className="size-3.5 text-yellow-500" aria-hidden="true" />
              System Prompt
              <span className="text-[10px] text-yellow-600">(locked)</span>
            </label>
            <div
              aria-label="System prompt content"
              className="min-h-[60px] rounded border border-yellow-900/30 bg-yellow-950/10 px-3 py-2.5 text-xs text-yellow-300/70 whitespace-pre-wrap"
            >
              {systemPrompt}
            </div>
          </div>
        )}

        {/* Injection payload dropdown */}
        {injectionPayloads && injectionPayloads.length > 0 && (
          <div className="relative">
            <label
              htmlFor="payload-select"
              className="mb-1.5 block text-xs font-medium text-muted-foreground"
            >
              Injection Payload Templates
            </label>
            <div className="relative">
              <button
                id="payload-select"
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                aria-haspopup="listbox"
                aria-expanded={dropdownOpen}
                className={cn(
                  "flex w-full items-center justify-between rounded border border-border bg-muted/20 px-3 py-2 text-xs text-muted-foreground",
                  "hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
                )}
              >
                <span>Select a payload template...</span>
                <ChevronDown
                  className={cn(
                    "size-3.5 transition-transform",
                    dropdownOpen && "rotate-180"
                  )}
                  aria-hidden="true"
                />
              </button>

              {dropdownOpen && (
                <ul
                  role="listbox"
                  aria-label="Injection payload templates"
                  className={cn(
                    "absolute z-10 mt-1 w-full rounded border border-border bg-[oklch(0.14_0_0)] shadow-xl",
                    "max-h-48 overflow-y-auto"
                  )}
                >
                  {injectionPayloads.map((payload, idx) => (
                    <li key={idx} role="option" aria-selected={false}>
                      <button
                        type="button"
                        onClick={() => handlePayloadSelect(payload)}
                        className={cn(
                          "w-full px-3 py-2 text-left text-xs text-foreground/80 hover:bg-muted/30",
                          "focus-visible:outline-none focus-visible:bg-muted/30 transition-colors",
                          "truncate"
                        )}
                      >
                        {payload.length > 80
                          ? payload.slice(0, 80) + "..."
                          : payload}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* User message input */}
        <div>
          <label
            htmlFor="user-message"
            className="mb-1.5 block text-xs font-medium text-muted-foreground"
          >
            User Message
            <span className="ml-2 text-[10px] text-muted-foreground/60">
              Cmd/Ctrl + Enter to send
            </span>
          </label>
          <textarea
            id="user-message"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={4}
            placeholder="Enter your message or select a payload template above..."
            aria-label="User message input"
            className={cn(
              "w-full resize-y rounded border border-border bg-[oklch(0.08_0_0)] px-3 py-2.5",
              "text-xs text-foreground placeholder:text-muted-foreground/50",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "transition-colors"
            )}
          />
        </div>

        {/* Send button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={!userMessage.trim()}
          aria-label="Send prompt"
          className={cn(
            "flex items-center gap-2 rounded border px-4 py-2 text-xs font-semibold transition-all",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "disabled:cursor-not-allowed disabled:opacity-40",
            "border-primary/50 bg-primary/10 text-primary hover:bg-primary/20 active:scale-95"
          )}
        >
          <Send className="size-3.5" aria-hidden="true" />
          Send
        </button>

        {/* Terminal output */}
        {outputs.length > 0 && (
          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">
              Output
            </p>
            <div
              ref={outputRef}
              role="log"
              aria-live="polite"
              aria-label="Prompt simulation output"
              className={cn(
                "max-h-80 overflow-y-auto rounded border border-border bg-black/60 p-4 space-y-5"
              )}
            >
              {outputs.map((entry) => (
                <div key={entry.id} className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground/60">
                    <span className="text-primary/60">$</span>
                    <span>{entry.timestamp}</span>
                    <span>— prompt simulation #{entry.id}</span>
                  </div>

                  {/* Combined prompt block */}
                  <div className="rounded border border-border/50 bg-[oklch(0.10_0_0)] p-3 space-y-3">
                    {entry.systemPrompt && (
                      <div>
                        <p className="mb-1 text-[10px] uppercase tracking-widest text-yellow-500/70">
                          [SYSTEM]
                        </p>
                        <p className="whitespace-pre-wrap text-xs text-yellow-300/60">
                          {entry.systemPrompt}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="mb-1 text-[10px] uppercase tracking-widest text-primary/70">
                        [USER]
                      </p>
                      <p className="whitespace-pre-wrap text-xs text-foreground/80">
                        {entry.userMessage}
                      </p>
                    </div>
                  </div>

                  {/* Static disclaimer */}
                  <div className="flex items-center gap-1.5 rounded border border-orange-900/30 bg-orange-950/20 px-2.5 py-1.5">
                    <AlertTriangle
                      className="size-3 shrink-0 text-orange-500"
                      aria-hidden="true"
                    />
                    <p className="text-[10px] text-orange-400/80">
                      Static demo — no real API call was made. The combined
                      prompt above shows what would be sent.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
