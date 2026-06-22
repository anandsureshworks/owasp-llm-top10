import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

// Engagement signal collector. Receives first-party beacons from the site and
// appends them, append-only, to a private GitHub repo (the sink). The local
// engagement-engine pulls that repo on a schedule and owns all aggregation —
// this route only validates, sanitizes, and stores. One documented outbound
// endpoint: api.github.com.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REPO = process.env.SIGNALS_REPO ?? "anandsureshworks/engagement-signals";
const TOKEN = process.env.GITHUB_SIGNALS_TOKEN;

const MAX_EVENTS = 50;
const MAX_TEXT = 2000;
const INTENTS = new Set(["comment", "question", "correction"]);

interface CleanEvent {
  type: string;
  tier: 0 | 1 | 2;
  slug?: string;
  value?: number;
  helpful?: boolean;
  intent?: string;
  text?: string;
}

function clampStr(v: unknown, max: number): string | undefined {
  return typeof v === "string" ? v.slice(0, max) : undefined;
}

function sanitizeEvent(raw: unknown): CleanEvent | null {
  if (!raw || typeof raw !== "object") return null;
  const e = raw as Record<string, unknown>;
  const type = clampStr(e.type, 24);
  if (!type) return null;
  const tier = e.tier === 0 || e.tier === 1 || e.tier === 2 ? e.tier : 0;
  const out: CleanEvent = { type, tier };
  const slug = clampStr(e.slug, 200);
  if (slug) out.slug = slug;
  if (typeof e.value === "number" && Number.isFinite(e.value)) out.value = e.value;
  if (typeof e.helpful === "boolean") out.helpful = e.helpful;
  const intent = clampStr(e.intent, 16);
  if (intent && INTENTS.has(intent)) out.intent = intent;
  const text = clampStr(e.text, MAX_TEXT);
  if (text) out.text = text;
  return out;
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad json" }, { status: 400 });
  }

  const rawEvents = Array.isArray(body.events) ? body.events.slice(0, MAX_EVENTS) : [];
  const events = rawEvents.map(sanitizeEvent).filter((e): e is CleanEvent => e !== null);
  if (events.length === 0) {
    return NextResponse.json({ ok: true, stored: 0 });
  }

  const cohort = (body.cohort ?? {}) as Record<string, unknown>;
  const record = {
    session: clampStr(body.session, 64) ?? "unknown",
    cohort: {
      source: clampStr(cohort.source, 16) ?? "direct",
      device: clampStr(cohort.device, 16) ?? "unknown",
    },
    generated_at: new Date().toISOString(),
    events,
  };

  // Graceful no-op when no sink is configured (local dev / preview without the
  // token): never break the page over telemetry.
  if (!TOKEN) {
    return NextResponse.json({ ok: true, stored: 0, note: "no sink configured" });
  }

  // Append-only by writing a fresh object per flush — no read-modify-write, so
  // concurrent beacons never race. The object path is built ONLY from
  // server-controlled values (server date + a server-generated id); the
  // user-provided session lives inside the record body, never in the request
  // URL, so a crafted session can't forge the GitHub request path (SSRF).
  const day = record.generated_at.slice(0, 10);
  const path = `events/${day}/${randomUUID()}.json`;
  const content = Buffer.from(JSON.stringify(record, null, 2)).toString("base64");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15_000);
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `signal ${day} ${record.cohort.source}/${record.cohort.device}`,
        content,
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      // Surface GitHub's status + reason (no token, no secrets) so a sink
      // misconfiguration is diagnosable. 401 = bad token, 403 = missing
      // Contents:write, 404 = token not granted to this repo.
      const detail = (await res.json().catch(() => ({}))) as { message?: string };
      return NextResponse.json(
        { ok: false, error: "sink write failed", github_status: res.status, github_message: detail.message },
        { status: 502 }
      );
    }
  } catch {
    return NextResponse.json({ ok: false, error: "sink timeout" }, { status: 504 });
  } finally {
    clearTimeout(timer);
  }

  return NextResponse.json({ ok: true, stored: events.length });
}
