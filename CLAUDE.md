# owasp-llm-top10

## What This Is
A Next.js documentation site covering the OWASP LLM Top 10 security vulnerabilities. MDX-based content, community-driven editorial. Bridges LLM security knowledge with structured, accessible reference material.

## Stack
- Next.js 16 (App Router)
- TypeScript
- MDX content via Velite (static site generation)
- Rehype / Remark for markdown processing
- Shiki for syntax highlighting
- shadcn/ui components

## Project-Specific Rules
- **Content accuracy is the product** — security claims must be precise; do not paraphrase OWASP definitions loosely
- MDX content lives in the Velite content directory — changes to vulnerability content go there, not in components
- shadcn/ui components: extend, don't replace; keep the design system consistent
- No LLM-generated security content without human review — this is a security reference, not a blog

## Sub-Agent Routing Notes
- Security content accuracy → security-auditor
- MDX / content structure → docs-architect
- Next.js / TypeScript → typescript-pro or frontend-developer
- LLM security specifics → ai-engineer + security-auditor together
