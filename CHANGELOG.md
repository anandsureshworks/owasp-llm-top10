# Changelog

All notable changes to this project are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/);
versioning follows [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- **Brand mark — woven AS monogram** — replaces the generic terminal-prompt
  (`>_`) nav icon and the default favicon. A dependency-free SVG where the "AS"
  is woven into a dense twill: green (security) threads carried *under* the white
  (application) ground, surfacing only to form the letters. Generated from a
  single committed source (`scripts/gen_mark.py`) so it can be reproduced or
  retrademarked; nav + `app/icon.svg` favicon, ~3–7 KB gzipped.
- **Content authority layer** — per-document `owaspVersion` (pinned to the OWASP
  LLM Top 10 **2025** edition), typed `references[]`, `cvssVector`, and
  `reviewStatus` / `reviewedBy`, all surfaced on write-up pages. The LLM01
  prompt-injection write-up taken to authoritative grade: verbatim OWASP
  definition + primary-source citations + a computed CVSS vector.
- **Engagement instrumentation** — feedback-first, cookieless in-browser signal
  capture; a first-party `/api/collect` collector; and a local aggregation engine
  that produces a cohort-fluency report.
- **Licensing** — `LICENSE`, `LICENSE-CODE`, and `USAGE.md`: dual, non-commercial
  (CC BY-NC-SA 4.0 for content; PolyForm Noncommercial 1.0.0 for code).
- `CODE_OF_CONDUCT.md` (Contributor Covenant 2.1) and this `CHANGELOG.md`.

### Changed
- CI workflows repointed from `main` to `master` so they actually run on pushes
  and PRs (they had never executed).

### Fixed
- Installed `@tailwindcss/typography` so `prose` styles render — content pages
  had been unstyled walls of text.
- Removed `next-themes` (the theme was force-dark anyway) to clear a React
  "script tag while rendering" console error.

### Security
- Cleared all known dependency CVEs — `npm audit` is clean.
- Closed an SSRF in the engagement collector (CodeQL `js/request-forgery`): the
  object path is now built only from server-controlled values.

---

*This changelog was adopted partway through the project; entries above cover the
notable changes since. Future changes should be added here under `[Unreleased]`
and grouped into a tagged release on each semver bump.*
