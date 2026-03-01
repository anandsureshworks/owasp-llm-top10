import type { Metadata } from "next";
import { getAllLabs } from "@/lib/content";
import { LabCard } from "@/components/content/LabCard";

export const metadata: Metadata = {
  title: "Labs",
  description: "Hands-on security labs covering all OWASP LLM Top 10 categories.",
};

export default function LabsPage() {
  const labs = getAllLabs();
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-mono text-2xl font-bold text-foreground">
          <span className="text-primary">// </span>Labs
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {labs.length} hands-on labs across all OWASP LLM categories
        </p>
      </div>
      {labs.length === 0 ? (
        <p className="font-mono text-sm text-muted-foreground">
          No labs yet. <a href="/contribute" className="text-primary hover:underline">Contribute one!</a>
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {labs.map((lab) => <LabCard key={lab.slug} {...lab} />)}
        </div>
      )}
    </div>
  );
}
