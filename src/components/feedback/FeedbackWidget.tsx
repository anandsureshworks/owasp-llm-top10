"use client";

import { useState } from "react";
import {
  MessageSquare,
  HelpCircle,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Check,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { submitSignal, type SignalIntent } from "@/lib/signals";

// The primary (tier-2) capture: expressed signal. Passive metrics tell us who
// showed up; this tells us whether they were thinking — the real fluency
// signal. Free text is the headline; the helpful vote is the warm-up.

const INTENTS: { key: SignalIntent; label: string; icon: typeof MessageSquare; hint: string }[] = [
  { key: "comment", label: "Comment", icon: MessageSquare, hint: "A thought, reaction, or what landed." },
  { key: "question", label: "Question", icon: HelpCircle, hint: "Something unclear or that you want to go deeper on." },
  { key: "correction", label: "Correction", icon: AlertTriangle, hint: "Something wrong, outdated, or missing. Most valuable." },
];

export function FeedbackWidget({ slug }: { slug: string }) {
  const [helpful, setHelpful] = useState<boolean | null>(null);
  const [intent, setIntent] = useState<SignalIntent>("comment");
  const [text, setText] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function vote(value: boolean) {
    setHelpful(value);
    void submitSignal({ type: "helpful", tier: 1, slug, helpful: value });
  }

  async function send() {
    if (!text.trim()) return;
    setState("sending");
    const ok = await submitSignal({ type: "feedback", tier: 2, slug, intent, text: text.trim() });
    setState(ok ? "done" : "error");
  }

  const activeIntent = INTENTS.find((i) => i.key === intent)!;

  return (
    <section
      aria-label="Feedback"
      className="mt-12 rounded-lg border border-primary/30 bg-primary/5 p-5"
    >
      {/* Helpful vote — the warm-up */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
          Did this land?
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => vote(true)}
            aria-pressed={helpful === true}
            className={cn(
              "flex items-center gap-1.5 rounded border px-2.5 py-1 text-xs transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              helpful === true
                ? "border-green-700/60 bg-green-950/40 text-green-400"
                : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            <ThumbsUp className="size-3.5" aria-hidden="true" /> Yes
          </button>
          <button
            type="button"
            onClick={() => vote(false)}
            aria-pressed={helpful === false}
            className={cn(
              "flex items-center gap-1.5 rounded border px-2.5 py-1 text-xs transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              helpful === false
                ? "border-orange-700/60 bg-orange-950/40 text-orange-400"
                : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            <ThumbsDown className="size-3.5" aria-hidden="true" /> Not really
          </button>
        </div>
      </div>

      {state === "done" ? (
        <p className="mt-4 flex items-center gap-2 text-sm text-green-400">
          <Check className="size-4" aria-hidden="true" />
          Got it — thank you. This directly shapes what gets written next.
        </p>
      ) : (
        <div className="mt-4">
          <p className="mb-2 text-sm text-foreground">
            The most useful thing you can leave is a <strong>correction, question, or sharp
            comment</strong> — that&apos;s the signal I&apos;m building this around.
          </p>

          {/* Intent selector */}
          <div className="mb-2 flex flex-wrap gap-2">
            {INTENTS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setIntent(key)}
                aria-pressed={intent === key}
                className={cn(
                  "flex items-center gap-1.5 rounded border px-2.5 py-1 text-xs transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  intent === key
                    ? "border-primary/60 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="size-3.5" aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder={activeIntent.hint}
            aria-label={`${activeIntent.label} feedback`}
            className={cn(
              "w-full resize-y rounded border border-border bg-background px-3 py-2.5 text-sm",
              "text-foreground placeholder:text-muted-foreground/60",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
          />

          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={send}
              disabled={!text.trim() || state === "sending"}
              className={cn(
                "flex items-center gap-2 rounded border px-3 py-1.5 text-xs font-semibold transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "disabled:cursor-not-allowed disabled:opacity-40",
                "border-primary/50 bg-primary/10 text-primary hover:bg-primary/20 active:scale-95"
              )}
            >
              <Send className="size-3.5" aria-hidden="true" />
              {state === "sending" ? "Sending…" : "Send"}
            </button>
            {state === "error" && (
              <span className="text-xs text-orange-400">
                Couldn&apos;t send — try again in a moment.
              </span>
            )}
            <span className="ml-auto text-[10px] text-muted-foreground/60">
              No login, no cookies. Anonymous.
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
