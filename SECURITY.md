# Security Policy

## Supported Scope

This repository is a **static educational resource**. It does not run backend services or process user data. Security issues relevant to this project include:

- Vulnerabilities in the site's own Next.js/React code (XSS, open redirects, CSP bypasses)
- Malicious content submitted to `content/` via pull request (actual exploit payloads, credentials, malware)
- Compromised GitHub Actions workflows or supply chain issues in dependencies

## Out of Scope

- Vulnerabilities in third-party tools or models *referenced* by this site (report those to their maintainers)
- Theoretical attacks against the OWASP categories documented here (that's the point of the site)
- Issues in external services linked from content pages

## How to Report

**Do not open a public GitHub issue for security vulnerabilities.**

Instead, use [GitHub Security Advisories](https://github.com/anandsureshworks/owasp-llm-top10/security/advisories/new) to report privately.

Include:
1. Description of the vulnerability
2. Steps to reproduce
3. Potential impact
4. Suggested remediation (if known)

## Response Timeline

| Action | Target time |
|--------|-------------|
| Initial acknowledgment | 48 hours |
| Assessment complete | 7 days |
| Fix deployed (if valid) | 14 days |
| Public disclosure | Coordinated with reporter |

## Safe Harbor

We support responsible disclosure. Researchers who report vulnerabilities in good faith will not face legal action. We ask that you:

- Give us reasonable time to respond before public disclosure
- Avoid accessing or modifying data you are not authorized to access
- Avoid actions that could degrade service availability

## Content-Specific Policy

If you identify **actual credentials, API keys, or PII** that were accidentally committed to the `content/` directory:

1. Report via Security Advisory immediately
2. Do not share the sensitive data publicly
3. We will rotate credentials and scrub git history within 24 hours

Contributions containing intentionally malicious payloads targeting real systems will be rejected and the contributor may be banned.
