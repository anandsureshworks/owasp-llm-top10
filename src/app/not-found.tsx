import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="mb-2 font-mono text-sm text-primary">$ error --code 404</p>
      <h1 className="mb-4 font-mono text-4xl font-bold text-foreground">
        Page Not Found
      </h1>
      <p className="mb-8 font-mono text-sm text-muted-foreground">
        The requested resource does not exist in this repository.
      </p>
      <Link
        href="/"
        className="rounded border border-primary/50 bg-primary/10 px-4 py-2 font-mono text-sm text-primary transition-colors hover:bg-primary/20"
      >
        ← Return to home
      </Link>
    </div>
  );
}
