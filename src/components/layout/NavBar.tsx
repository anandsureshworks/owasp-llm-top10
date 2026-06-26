"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Github } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Categories", href: "/categories" },
  { label: "Write-ups", href: "/writeups" },
  { label: "Labs", href: "/labs" },
  { label: "Demos", href: "/demos" },
  { label: "Tools", href: "/tools" },
  { label: "Contribute", href: "/contribute" },
] as const;

const GITHUB_URL = "https://github.com/owasp/www-project-top-10-for-large-language-model-applications";

function NavLink({
  href,
  label,
  pathname,
  onClick,
}: {
  href: string;
  label: string;
  pathname: string;
  onClick?: () => void;
}) {
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "text-sm transition-colors hover:text-primary",
        isActive ? "text-primary" : "text-muted-foreground"
      )}
    >
      {label}
    </Link>
  );
}

export function NavBar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-mono text-sm font-semibold text-primary"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/as-logo.svg" alt="" width={28} height={28} className="size-7 shrink-0" />
          <span>OWASP LLM Top 10</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.href} pathname={pathname} {...link} />
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-4 md:flex">
          <ThemeToggle />
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View on GitHub"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            <Github className="size-5" aria-hidden="true" />
          </a>
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />

          {/* Mobile hamburger */}
          <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            aria-label="Open navigation menu"
            className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:text-primary md:hidden"
          >
            <Menu className="size-5" aria-hidden="true" />
          </SheetTrigger>
          <SheetContent side="left" className="w-72 bg-background">
            <SheetHeader>
              <SheetTitle asChild>
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 font-mono text-sm font-semibold text-primary"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/brand/as-logo.svg" alt="" width={28} height={28} className="size-7 shrink-0" />
                  <span>OWASP LLM Top 10</span>
                </Link>
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-1 px-4 py-2">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.href}
                  pathname={pathname}
                  {...link}
                  onClick={() => setOpen(false)}
                />
              ))}
              <div className="mt-4 border-t border-border pt-4">
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  <Github className="size-4" aria-hidden="true" />
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
