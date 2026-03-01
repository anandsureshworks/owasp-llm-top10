import { getContentStats, getRecentContent } from "@/lib/content";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsBar } from "@/components/home/StatsBar";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { RecentContent } from "@/components/home/RecentContent";

export default function HomePage() {
  const stats = getContentStats();
  const recent = getRecentContent(6);

  return (
    <>
      <HeroSection />
      <StatsBar
        writeups={stats.writeups}
        labs={stats.labs}
        demos={stats.demos}
        tools={stats.tools}
        total={stats.total}
      />
      <CategoryGrid />
      <RecentContent items={recent} />
    </>
  );
}
