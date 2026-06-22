"use client";

import { useEffect } from "react";
import { track, flushBeacon, type SignalEvent } from "@/lib/signals";

// Passive (tier-0) capture for one content page: a page_view on mount, scroll
// milestones, and dwell time on page hide. Renders nothing. Active signals
// (helpful vote, feedback text) are handled by FeedbackWidget.
export function SignalsBeacon({ slug }: { slug: string }) {
  useEffect(() => {
    const ev = (e: SignalEvent) => track(e);
    ev({ type: "page_view", tier: 0, slug });

    const start = Date.now();
    const seen = new Set<number>();
    let dwellSent = false;

    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const pct = Math.round(((window.scrollY + window.innerHeight) / doc.scrollHeight) * 100);
      for (const milestone of [50, 90]) {
        if (pct >= milestone && !seen.has(milestone)) {
          seen.add(milestone);
          ev({ type: "scroll", tier: 0, value: milestone, slug });
        }
      }
    };

    const onHide = () => {
      if (dwellSent) return;
      dwellSent = true;
      ev({ type: "dwell", tier: 0, value: Math.round((Date.now() - start) / 1000), slug });
      flushBeacon();
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") onHide();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onHide);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onHide);
    };
  }, [slug]);

  return null;
}
