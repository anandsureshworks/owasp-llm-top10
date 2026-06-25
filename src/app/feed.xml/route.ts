import { writeups, labs, demos, tools } from "#site/content";

// Canonical origin for absolute links in the feed. Override via env in other envs.
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://anandsureshworks.dev"
).replace(/\/$/, "");
const SITE_TITLE = "OWASP LLM Top 10 — Security Research Portal";
const SITE_DESC =
  "Write-ups, labs, demos, and tools for the OWASP Top 10 for Large Language Model Applications.";
const MAX_ITEMS = 50;

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Build at deploy time and serve as a static asset — the feed updates whenever
// content is published, with zero ongoing maintenance.
export const dynamic = "force-static";

export function GET(): Response {
  const items = [...writeups, ...labs, ...demos, ...tools]
    .filter((i) => !i.draft)
    .map((i) => ({
      url: `${SITE_URL}/${i.slug}`,
      title: i.title,
      description: i.description,
      author: i.author,
      // updatedAt wins when present, else publishedAt; stable per item.
      date: new Date(i.updatedAt ?? i.publishedAt).toISOString(),
    }))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, MAX_ITEMS);

  const updated = items[0]?.date ?? new Date(0).toISOString();

  const entries = items
    .map(
      (i) => `
  <entry>
    <title>${esc(i.title)}</title>
    <link href="${i.url}"/>
    <id>${i.url}</id>
    <updated>${i.date}</updated>
    <author><name>${esc(i.author)}</name></author>
    <summary>${esc(i.description)}</summary>
  </entry>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${esc(SITE_TITLE)}</title>
  <subtitle>${esc(SITE_DESC)}</subtitle>
  <link href="${SITE_URL}/feed.xml" rel="self"/>
  <link href="${SITE_URL}/"/>
  <id>${SITE_URL}/</id>
  <updated>${updated}</updated>${entries}
</feed>
`;

  return new Response(xml, {
    headers: { "content-type": "application/atom+xml; charset=utf-8" },
  });
}
