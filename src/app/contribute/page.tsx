import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, GitPullRequest, FileText, FlaskConical, Play, Wrench } from "lucide-react";

export const metadata: Metadata = {
  title: "Contribute",
  description: "How to contribute write-ups, labs, demos, and tools to the OWASP LLM Top 10 repository.",
};

export default function ContributePage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="font-mono text-2xl font-bold text-foreground">
          <span className="text-primary">// </span>Contribute
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This is a community-driven repository. All content comes via GitHub pull requests.
        </p>
      </div>

      {/* Quick start */}
      <section className="mb-8">
        <h2 className="mb-4 font-mono text-base font-semibold text-foreground">
          Getting Started
        </h2>
        <div className="rounded-lg border border-border bg-card p-4 font-mono text-sm">
          <p className="mb-2 text-muted-foreground"># 1. Fork and clone</p>
          <p className="text-primary">$ gh repo fork anandsureshworks/owasp-llm-top10 --clone</p>
          <p className="mt-3 text-muted-foreground"># 2. Install dependencies</p>
          <p className="text-primary">$ npm install</p>
          <p className="mt-3 text-muted-foreground"># 3. Start dev server</p>
          <p className="text-primary">$ npm run dev</p>
          <p className="mt-3 text-muted-foreground"># 4. Validate content</p>
          <p className="text-primary">$ npm run velite</p>
        </div>
      </section>

      {/* Content types */}
      <section className="mb-8">
        <h2 className="mb-4 font-mono text-base font-semibold text-foreground">
          Content Types
        </h2>
        <div className="space-y-4">
          {[
            {
              icon: FileText,
              title: "Write-ups",
              path: "content/writeups/llmXX/your-title.mdx",
              desc: "Research articles, vulnerability analyses, attack taxonomy. Required fields: title, description, owaspCategory, difficulty, severity, publishedAt.",
            },
            {
              icon: FlaskConical,
              title: "Labs",
              path: "content/labs/llmXX/your-lab.mdx",
              desc: "Hands-on challenges (CTF, guided, black-box, white-box). Required: title, owaspCategory, difficulty, challengeType, points, publishedAt.",
            },
            {
              icon: Play,
              title: "Demos",
              path: "content/demos/llmXX/your-demo.mdx",
              desc: "Interactive demonstrations using PromptPlayground, Sandpack, or SandboxedIframe components. Required: title, owaspCategory, demoType, publishedAt.",
            },
            {
              icon: Wrench,
              title: "Tools",
              path: "content/tools/llmXX/tool-name.mdx",
              desc: "Open-source tools for LLM security. Required: title, owaspCategory, owaspCategories, toolType, projectUrl, publishedAt.",
            },
          ].map(({ icon: Icon, title, path, desc }) => (
            <div key={title} className="rounded-lg border border-border bg-card p-4">
              <div className="mb-2 flex items-center gap-2">
                <Icon className="size-4 text-primary" />
                <span className="font-mono text-sm font-semibold text-foreground">{title}</span>
              </div>
              <p className="mb-2 font-mono text-xs text-primary">{path}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Guidelines */}
      <section className="mb-8">
        <h2 className="mb-4 font-mono text-base font-semibold text-foreground">
          Content Guidelines
        </h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {[
            "Content must be educational and defensive in nature",
            "No actual malware, working exploits against production systems, or credentials",
            "Labs and demos should use sandboxed/simulated environments",
            "Reference real CVEs and public disclosures where applicable",
            "All frontmatter must pass Velite schema validation (run npm run velite before PR)",
            "Follow responsible disclosure — do not include 0-days",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-0.5 text-primary">›</span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Links */}
      <section>
        <h2 className="mb-4 font-mono text-base font-semibold text-foreground">
          Open an Issue First
        </h2>
        <div className="flex flex-wrap gap-3">
          {[
            { label: "New Write-up", href: "https://github.com/anandsureshworks/owasp-llm-top10/issues/new?template=new_writeup.yml" },
            { label: "New Lab", href: "https://github.com/anandsureshworks/owasp-llm-top10/issues/new?template=new_lab.yml" },
            { label: "New Demo", href: "https://github.com/anandsureshworks/owasp-llm-top10/issues/new?template=new_demo.yml" },
            { label: "New Tool", href: "https://github.com/anandsureshworks/owasp-llm-top10/issues/new?template=new_tool.yml" },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded border border-border bg-card px-3 py-2 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              <GitPullRequest className="size-3.5" />
              {label}
              <ExternalLink className="size-3" />
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
