# Contributing to OWASP LLM Top 10 Research Portal

Thank you for contributing to the community's collective knowledge of LLM security. This guide explains how to add write-ups, labs, demos, and tool entries.

## Quick Start

```bash
# 1. Fork and clone
gh repo fork anandsureshworks/owasp-llm-top10 --clone
cd owasp-llm-top10

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Validate your content before submitting
npm run velite
```

## Content Types

### Write-ups (`content/writeups/llmXX/`)

Research articles, vulnerability analyses, and technical deep-dives.

**Required frontmatter:**
```yaml
---
title: "Your Title"
description: "One-sentence description (max 300 chars)"
owaspCategory: llm01          # llm01-llm10
difficulty: intermediate      # beginner | intermediate | advanced
severity: high                # low | medium | high | critical
cvssScore: 7.5                # Optional, 0.0–10.0
tags: [tag1, tag2]
author: "Your Name"
publishedAt: "2024-01-15"    # ISO 8601
relatedLabs: []               # slugs of related labs
relatedDemos: []
relatedTools: []
---
```

### Labs (`content/labs/llmXX/`)

Hands-on challenges with guided or CTF-style objectives.

**Required frontmatter:**
```yaml
---
title: "Lab Title"
description: "What the learner will do"
owaspCategory: llm01
difficulty: intermediate
challengeType: ctf            # black-box | white-box | ctf | guided
sandboxType: none             # sandpack | iframe | none
timeEstimate: "45 min"
points: 150
hasSolution: true
flagFormat: "FLAG{...}"       # For CTF labs
tags: [...]
author: "Your Name"
publishedAt: "2024-01-15"
relatedWriteups: []
---
```

Wrap solutions in the `<Spoiler>` component:
```mdx
<Spoiler title="View Solution">
The solution is...
</Spoiler>
```

### Demos (`content/demos/llmXX/`)

Interactive demonstrations using embedded components.

**Required frontmatter:**
```yaml
---
title: "Demo Title"
description: "What the demo shows"
owaspCategory: llm01
demoType: interactive         # interactive | visualization | comparison | benchmark
isSafeToRun: true
requiresApiKey: false
interactiveComponents: ["PromptPlayground"]
tags: [...]
author: "Your Name"
publishedAt: "2024-01-15"
relatedWriteups: []
---
```

Available demo components:
- `<PromptPlayground />` — static prompt simulation
- `<SandpackDemo files={...} />` — in-browser code execution
- `<SandboxedIframe srcDoc="..." />` — sandboxed HTML demo

### Tools (`content/tools/llmXX/`)

Open-source tools relevant to LLM security.

**Required frontmatter:**
```yaml
---
title: "Tool Name"
description: "What the tool does"
owaspCategory: llm01          # Primary category (matches directory)
owaspCategories: [llm01, llm02]  # All relevant categories
toolType: red-team            # scanner | framework | library | dataset | benchmark | red-team | defense
projectUrl: "https://..."
githubUrl: "https://github.com/..."  # Optional
license: "MIT"
status: active                # active | maintained | archived | experimental
tags: [...]
author: "Your Name"
publishedAt: "2024-01-15"
---
```

## MDX Components

Use these components in your content:

```mdx
<Callout type="info">Informational note</Callout>
<Callout type="warning">Warning message</Callout>
<Callout type="danger">Critical security warning</Callout>
<Callout type="tip">Helpful tip</Callout>

<Spoiler title="Reveal Solution">Hidden content</Spoiler>

<Flag value="FLAG{example}" hint="Optional hint text" />

<Steps>
  <div>First step content</div>
  <div>Second step content</div>
</Steps>
```

## Writing Guidelines

- **Educational and defensive** — explain how attacks work so defenders can protect against them
- **No live exploits** — do not include working payloads against real production systems
- **No credentials** — never commit API keys, tokens, passwords, or PII
- **Responsible disclosure** — do not document unpatched 0-days; follow coordinated disclosure first
- **Sandboxed demos** — all interactive demos must simulate attacks, not execute them against real targets
- **Cite sources** — reference CVEs, research papers, and public disclosures where applicable

## Pull Request Process

1. **Open an issue first** using one of the [issue templates](https://github.com/anandsureshworks/owasp-llm-top10/issues/new/choose)
2. **Fork** the repository and create a feature branch: `git checkout -b content/llm01-my-writeup`
3. **Write your content** following the frontmatter schema above
4. **Validate** with `npm run velite` — fix any schema errors before submitting
5. **Open a PR** against `main` using the PR template

CI will automatically:
- Validate your MDX frontmatter against the Velite schema
- Check for broken links
- Scan for accidentally committed credentials (TruffleHog)
- Run CodeQL on any code changes

## Code of Conduct

Be respectful. This repository exists to improve LLM security for everyone. Harassment, personal attacks, and bad-faith contributions will result in removal.
