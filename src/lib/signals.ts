// Client-side engagement signal capture.
//
// First-party only: everything posts to /api/collect on this origin, which the
// site CSP (connect-src 'self') permits without modification. No cookies, no
// PII. A per-session id lives in sessionStorage and dies with the tab — enough
// to stitch a session's events together, not enough to track a person.
//
// Signal tiers (see the engagement engine): 0 passive, 1 light-active,
// 2 expressed (free-text feedback) — tier 2 is the primary target.

export type SignalTier = 0 | 1 | 2;

export type SignalIntent = "comment" | "question" | "correction";

export interface SignalEvent {
  type: "page_view" | "scroll" | "dwell" | "helpful" | "feedback";
  tier: SignalTier;
  slug?: string;
  /** scroll percentage milestone, or dwell seconds */
  value?: number;
  /** tier-1 helpful vote */
  helpful?: boolean;
  /** tier-2 expressed signal */
  intent?: SignalIntent;
  text?: string;
}

const SESSION_KEY = "asw_sig_session";

function sessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "ephemeral";
  }
}

// Coarse cohort dimensions, derived client-side so no raw referrer/UA leaves
// the browser. acquisition source + device class only.
function cohort(): { source: string; device: string } {
  let source = "direct";
  const ref = document.referrer;
  if (ref) {
    try {
      const host = new URL(ref).hostname;
      if (host === location.hostname) source = "internal";
      else if (/(^|\.)(t\.co|twitter\.com|x\.com|lnkd\.in|linkedin\.com)$/.test(host)) source = "social";
      else if (/(^|\.)(google|bing|duckduckgo|ecosia)\./.test(host)) source = "search";
      else source = "referral";
    } catch {
      source = "referral";
    }
  }
  const device = window.matchMedia("(pointer: coarse)").matches ? "mobile" : "desktop";
  return { source, device };
}

function envelope(events: SignalEvent[]) {
  return JSON.stringify({
    session: sessionId(),
    cohort: cohort(),
    sent_at: new Date().toISOString(),
    events,
  });
}

// ---- passive buffer (flushed on page hide via sendBeacon) ----

let buffer: SignalEvent[] = [];

export function track(event: SignalEvent): void {
  if (typeof window === "undefined") return;
  buffer.push(event);
}

export function flushBeacon(): void {
  if (typeof window === "undefined" || buffer.length === 0) return;
  const payload = envelope(buffer);
  buffer = [];
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/collect", new Blob([payload], { type: "application/json" }));
      return;
    }
  } catch {
    /* fall through to fetch */
  }
  void fetch("/api/collect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => {});
}

// ---- expressed signal (tier 2) — sent immediately, awaitable for UX ----

export async function submitSignal(event: SignalEvent): Promise<boolean> {
  if (typeof window === "undefined") return false;
  try {
    const res = await fetch("/api/collect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: envelope([event]),
      keepalive: true,
    });
    return res.ok;
  } catch {
    return false;
  }
}
