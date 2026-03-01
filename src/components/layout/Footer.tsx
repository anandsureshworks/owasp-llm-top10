import Link from "next/link";
import { Github } from "lucide-react";

const GITHUB_URL = "https://github.com/owasp/www-project-top-10-for-large-language-model-applications";

const FOOTER_LINKS: Array<{ label: string; href: string; external?: boolean }> = [
  { label: "Contributing", href: "/contribute" },
  { label: "Security Policy", href: "/security" },
  { label: "GitHub Issues", href: `${GITHUB_URL}/issues`, external: true },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* Left: copyright + tagline */}
          <div className="flex flex-col items-center gap-1 text-center sm:items-start sm:text-left">
            <p className="font-mono text-xs text-muted-foreground">
              &copy; {year} OWASP Foundation
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              Living repository &mdash; updated with the community
            </p>
          </div>

          {/* Right: links + GitHub */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {FOOTER_LINKS.map((link) =>
              link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 font-mono text-xs text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.label === "GitHub Issues" && (
                    <Github className="size-3" aria-hidden="true" />
                  )}
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="font-mono text-xs text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              )
            )}
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View project on GitHub"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              <Github className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
