import Link from "next/link";
import { Terminal, Shield, ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background px-4 py-20 sm:px-6 sm:py-28">
      {/* Background grid pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"
      />

      <div className="relative mx-auto max-w-4xl text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-xs text-primary">
          <Shield className="size-3" aria-hidden="true" />
          <span>OWASP LLM Top 10 &mdash; 2025 Edition</span>
        </div>

        {/* Heading */}
        <h1 className="mb-4 font-mono text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
          <span className="text-primary">$</span> LLM Security Research Portal
        </h1>

        <p className="mx-auto mb-8 max-w-2xl text-base text-muted-foreground sm:text-lg">
          Community-driven write-ups, hands-on labs, interactive demos, and
          open-source tools covering the{" "}
          <span className="text-foreground">OWASP Top 10 for Large Language Model Applications</span>.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 font-mono text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <Terminal className="size-4" aria-hidden="true" />
            Browse Categories
          </Link>
          <Link
            href="/writeups"
            className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 font-mono text-sm font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Read Write-ups
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
