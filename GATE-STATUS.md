# Gate Status — owasp-llm-top10

**Generated:** 2026-06-13 (UTC) · **Branch:** `master` · **Build:** Next.js 16.1.6 / Node 24.4.1
**Overall:** 🟡 **CONDITIONAL** — code is green, but automation is silently disabled and dependencies ship with known CVEs.

---

## Scorecard

| Gate | Status | Evidence |
|------|--------|----------|
| Record / dirty-tree | 🟢 PASS | `git status` clean, `dirty_count: 0` |
| Build | 🟢 PASS | `npm run build` exit 0 — 40 routes prerendered |
| Typecheck | 🟢 PASS | `tsc --noEmit` exit 0 |
| Content integrity | 🟢 PASS | 40 MDX files, full 4×10 matrix (demos/labs/tools/writeups × LLM01–10) |
| **CI/CD wiring** | 🔴 **FAIL** | All 4 workflows trigger on `main`; repo default is `master` → **nothing runs** |
| **Dependency security** | 🔴 **FAIL** | `npm audit`: 16 vulns — **2 critical, 9 high, 5 moderate** |
| Lint | 🟠 GAP | No ESLint config; CI "Lint & Type Check" job runs only `tsc`, no linter |
| Standards files | 🟠 PARTIAL | `LICENSE` added (dual non-commercial, 2026-06-23) + `USAGE.md`; still missing `CHANGELOG.md`, `CODE_OF_CONDUCT.md` |
| OpenSSF Best Practices | ⚪ **WON'T EARN — by choice** | Non-commercial license is **not** OSI/FLOSS → fails the badge's license criterion. Deliberate tradeoff — see *Decision* below. |

---

## 🔴 Blocker 1 — CI is wired to the wrong branch (silent failure)

All four workflows key on `main`; the repo's default branch is `master` (`origin/HEAD -> origin/master`):

- `ci.yml` (lint/typecheck/build) → `push`/`pull_request` on `main`
- `codeql.yml` (SAST) → `main`
- `content-validation.yml` (Velite + **TruffleHog secret scan**) → also gated by paths, but on PRs to `main`
- `deploy-production.yml` → `push` on `main`

**Impact:** every gate the repo *appears* to have — typecheck, build, CodeQL, secret scanning, production deploy — has never executed. This is the "stagnation is signal" class: green-looking config, zero enforcement.

**Fix:** change `branches: [main]` → `[master]` in all four workflows (or rename the default branch to `main`). One-line change × 4 files; restores the entire automation chain.

---

## 🔴 Blocker 2 — 16 known CVEs in the dependency tree

Violates the Yantra standard *"never ship with known CVEs."* All are in **build-time / tooling** transitive deps (pagefind → `hono`/`express-rate-limit`, velite → `esbuild`, plus `qs`/`shell-quote`/`yaml`), so the **deployed static site's runtime attack surface is minimal** — but the standard is strict and the dev/CI supply chain is exposed.

| Severity | Count | Notable |
|----------|-------|---------|
| Critical | 2 | `qs` (DoS), `shell-quote` (command injection) — both auto-fixable |
| High | 9 | `hono` (20+ advisories), `esbuild` RCE, `next`, `fast-uri`, `express-rate-limit` |
| Moderate | 5 | `brace-expansion`, `ip-address` (XSS), … |

**Fix:** `npm audit fix` clears the criticals and most highs without breaking changes. Only `esbuild` requires `npm audit fix --force` (downgrades velite — breaking; pin/upgrade velite deliberately instead). Then commit the lockfile and add an audit step to `ci.yml`.

---

## 🟠 Gaps (non-blocking)

- **Lint:** No `eslint` config or `lint` script. The CI job named "Lint & Type Check" performs no linting. Add `eslint-config-next` + a `lint` script and wire it in.
- **Standards files:** `LICENSE` + `USAGE.md` landed 2026-06-23 (see Decision). Still add `CHANGELOG.md` (semver, per contract) and `CODE_OF_CONDUCT.md`.
- **OpenSSF Best Practices badge:** ~~register~~ — **consciously forgone**, see Decision below. Do **not** re-flag as a gap.

---

## 🔵 Decision (2026-06-23) — non-commercial license; OpenSSF badge forgone

This repo is licensed **source-available, non-commercial**:
- **Content** (MDX write-ups/labs/demos) → **CC BY-NC-SA 4.0**
- **Code** (Next.js app + tooling) → **PolyForm Noncommercial 1.0.0** (`LICENSE-CODE`)

**Why:** the content exists so people **self-learn AI fluency / LLM security** — the
intended engagement is learning, not resale. Non-commercial terms deter commercial
profiteering while still letting people clone, run, learn, and build on it
(see `USAGE.md`).

**The tradeoff, named so it isn't re-litigated:** non-commercial licenses are *not*
OSI-approved / FLOSS, so this repo **cannot earn the OpenSSF Best Practices badge**
(its license criterion requires a FLOSS license). This **overrides** the Yantra
standard *"earn the OpenSSF badge on every repo"* for this repo, by choice. Treat the
OpenSSF row as **Won't-Earn (intentional)**, not a gap to fix. To revisit, the repo
would have to relicense to an OSI license (MIT/Apache) — which re-permits commercial
use, the thing this license exists to prevent.

> ⚠️ **Note:** the rest of this scorecard is **stale** (generated 2026-06-13). The two
> 🔴 blockers — CI-on-wrong-branch and the 16 CVEs — were since fixed (CI runs on
> `master`, PRs are green, `npm audit` clean). Re-generate before trusting the rows above.

---

## Recommended order of operations *(stale — most items done; see note above)*

1. ~~Repoint workflows to `master`~~ — done; CI/CodeQL/Vercel run on `master`/PRs.
2. ~~`npm audit fix`~~ — done; tree is CVE-clean.
3. ~~Add `LICENSE`~~ — done (non-commercial). Still add `CHANGELOG.md` + `CODE_OF_CONDUCT.md`.
4. Wire ESLint; rename the CI job honestly or make it lint.
5. ~~Register OpenSSF badge~~ — **forgone by choice** (see Decision).

*Original status verified 2026-06-13 by: `git status`, `npm audit`, `tsc --noEmit`, `npm run build`, workflow inspection. Licensing decision + staleness note added 2026-06-23.*
