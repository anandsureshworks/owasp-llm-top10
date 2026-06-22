#!/usr/bin/env python3
"""engagement-engine — aggregates raw engagement signals into a fluency report.

Pulls the private `engagement-signals` sink repo (via existing `gh` auth — no
secret stored locally), computes a per-writeup, per-cohort fluency score, and
surfaces every expressed (tier-2) comment verbatim. Output is the single JSON
the dashboards read.

Contract (Yantra):
  - output path : ~/.engagement-engine.json   (atomic tmp+rename)
  - generated_at: ISO-8601 UTC, always present
  - outbound    : only GitHub, via `gh` (deny-by-default)
  - deps        : Python stdlib only

Fluency is weighted toward *expressed* signal — corrections, questions, and
comments are the primary target; passive scroll/dwell is supporting context.

Run:
  engagement-engine.py            # pull + aggregate + write report
  engagement-engine.py --selftest # verify the scoring math on synthetic data
"""

from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
import tempfile
from collections import defaultdict
from datetime import datetime, timezone

REPO = os.environ.get("SIGNALS_REPO", "anandsureshworks/engagement-signals")
CACHE = os.path.expanduser("~/.cache/engagement-signals")
OUTPUT = os.path.expanduser("~/.engagement-engine.json")

# Fluency weights — sum to 1.0. Expressed signal dominates by design.
W_EXPRESSED = 0.35   # left a tier-2 comment/question/correction (the target)
W_READ = 0.20        # dwell vs a full-read target
W_REACHED = 0.15     # scrolled to the references (90%)
W_INTERACT = 0.15    # any tier-1 interaction (helpful vote, etc.)
W_PROGRESS = 0.15    # session touched more than one writeup

TARGET_DWELL_SECONDS = 120  # dwell at/above this = full read-depth credit

# Sessions whose id matches these prefixes are smoke tests, never real signal.
TEST_PREFIXES = ("e2e", "test", "preview", "ephemeral")


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")


def sync_repo() -> None:
    """Fresh shallow clone each run (small data; avoids git-credential setup)."""
    gh = shutil.which("gh") or "/opt/homebrew/bin/gh"
    if os.path.isdir(CACHE):
        shutil.rmtree(CACHE)
    os.makedirs(os.path.dirname(CACHE), exist_ok=True)
    subprocess.run(
        [gh, "repo", "clone", REPO, CACHE, "--", "--depth", "1"],
        check=True,
        capture_output=True,
        timeout=120,
    )


def load_records(root: str) -> list[dict]:
    records = []
    events_dir = os.path.join(root, "events")
    for dirpath, _dirs, files in os.walk(events_dir):
        for name in files:
            if not name.endswith(".json"):
                continue
            try:
                with open(os.path.join(dirpath, name), encoding="utf-8") as fh:
                    records.append(json.load(fh))
            except (OSError, json.JSONDecodeError):
                continue
    return records


def aggregate(records: list[dict]) -> dict:
    # Group events into (session, slug) engagement units.
    units: dict[tuple[str, str], dict] = {}
    session_slugs: dict[str, set[str]] = defaultdict(set)
    feedback: list[dict] = []
    total_events = 0

    for rec in records:
        session = str(rec.get("session", "unknown"))
        if session.lower().startswith(TEST_PREFIXES):
            continue
        cohort = rec.get("cohort", {}) or {}
        source = cohort.get("source", "direct")
        device = cohort.get("device", "unknown")
        ts = rec.get("generated_at", "")
        for ev in rec.get("events", []) or []:
            total_events += 1
            slug = ev.get("slug") or "(unknown)"
            key = (session, slug)
            u = units.setdefault(
                key,
                {
                    "session": session, "slug": slug, "source": source, "device": device,
                    "scroll": 0, "dwell": 0, "interact": False, "expressed": False,
                    "helpful_yes": 0, "helpful_no": 0,
                },
            )
            session_slugs[session].add(slug)
            t = ev.get("type")
            if t == "scroll":
                u["scroll"] = max(u["scroll"], int(ev.get("value") or 0))
            elif t == "dwell":
                u["dwell"] = max(u["dwell"], int(ev.get("value") or 0))
            elif t == "helpful":
                u["interact"] = True
                if ev.get("helpful") is True:
                    u["helpful_yes"] += 1
                elif ev.get("helpful") is False:
                    u["helpful_no"] += 1
            elif t == "feedback":
                u["expressed"] = True
                u["interact"] = True
                feedback.append({
                    "slug": slug,
                    "intent": ev.get("intent", "comment"),
                    "text": ev.get("text", ""),
                    "cohort": {"source": source, "device": device},
                    "generated_at": ts,
                })

    def fluency(u: dict) -> float:
        reached = 1.0 if u["scroll"] >= 90 else 0.0
        read = min(u["dwell"] / TARGET_DWELL_SECONDS, 1.0) if u["dwell"] else 0.0
        interact = 1.0 if u["interact"] else 0.0
        progress = 1.0 if len(session_slugs[u["session"]]) > 1 else 0.0
        expressed = 1.0 if u["expressed"] else 0.0
        return round(
            W_EXPRESSED * expressed + W_READ * read + W_REACHED * reached
            + W_INTERACT * interact + W_PROGRESS * progress,
            4,
        )

    # Per-writeup and per-cohort rollups.
    by_writeup: dict[str, dict] = {}
    by_source: dict[str, list[float]] = defaultdict(list)
    by_device: dict[str, list[float]] = defaultdict(list)

    for u in units.values():
        f = fluency(u)
        w = by_writeup.setdefault(
            u["slug"],
            {"sessions": 0, "fluency_sum": 0.0, "expressed": 0, "reached_refs": 0,
             "dwell_sum": 0, "helpful_yes": 0, "helpful_no": 0},
        )
        w["sessions"] += 1
        w["fluency_sum"] += f
        w["expressed"] += 1 if u["expressed"] else 0
        w["reached_refs"] += 1 if u["scroll"] >= 90 else 0
        w["dwell_sum"] += u["dwell"]
        w["helpful_yes"] += u["helpful_yes"]
        w["helpful_no"] += u["helpful_no"]
        by_source[u["source"]].append(f)
        by_device[u["device"]].append(f)

    def finalize_writeup(slug: str, w: dict) -> dict:
        n = max(w["sessions"], 1)
        return {
            "slug": slug,
            "sessions": w["sessions"],
            "avg_fluency": round(w["fluency_sum"] / n, 4),
            "expressed_rate": round(w["expressed"] / n, 4),
            "reached_refs_rate": round(w["reached_refs"] / n, 4),
            "avg_dwell_seconds": round(w["dwell_sum"] / n, 1),
            "helpful_yes": w["helpful_yes"],
            "helpful_no": w["helpful_no"],
        }

    def cohort_block(d: dict[str, list[float]]) -> dict:
        return {
            k: {"sessions": len(v), "avg_fluency": round(sum(v) / len(v), 4)}
            for k, v in sorted(d.items()) if v
        }

    all_fluency = [fluency(u) for u in units.values()]
    writeups = sorted(
        (finalize_writeup(s, w) for s, w in by_writeup.items()),
        key=lambda x: x["avg_fluency"],
        reverse=True,
    )

    return {
        "generated_at": now_iso(),
        "source_repo": REPO,
        "totals": {
            "engagement_units": len(units),
            "sessions": len({u["session"] for u in units.values()}),
            "events": total_events,
            "expressed": len(feedback),
        },
        "fluency": {
            "overall": round(sum(all_fluency) / len(all_fluency), 4) if all_fluency else 0.0,
            "weights": {
                "expressed": W_EXPRESSED, "read_depth": W_READ, "reached_refs": W_REACHED,
                "interaction": W_INTERACT, "progression": W_PROGRESS,
            },
            "by_cohort_source": cohort_block(by_source),
            "by_device": cohort_block(by_device),
        },
        "writeups": writeups,
        # The qualitative dataset — every expressed signal, newest first.
        "feedback": sorted(feedback, key=lambda f: f["generated_at"], reverse=True),
    }


def atomic_write(path: str, data: dict) -> None:
    d = os.path.dirname(path) or "."
    fd, tmp = tempfile.mkstemp(dir=d, suffix=".tmp")
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as fh:
            json.dump(data, fh, indent=2, ensure_ascii=False)
        os.replace(tmp, path)
    except BaseException:
        if os.path.exists(tmp):
            os.unlink(tmp)
        raise


def selftest() -> int:
    """Verify scoring on synthetic data — a session that did everything scores
    higher than a pure skimmer, and expressed signal moves the needle most."""
    records = [
        {  # engaged reader who left a correction, on 2 writeups
            "session": "s1", "cohort": {"source": "social", "device": "desktop"},
            "generated_at": "2026-06-22T10:00:00Z",
            "events": [
                {"type": "scroll", "tier": 0, "value": 90, "slug": "w/a"},
                {"type": "dwell", "tier": 0, "value": 200, "slug": "w/a"},
                {"type": "helpful", "tier": 1, "helpful": True, "slug": "w/a"},
                {"type": "feedback", "tier": 2, "intent": "correction", "text": "fix X", "slug": "w/a"},
                {"type": "page_view", "tier": 0, "slug": "w/b"},
            ],
        },
        {  # skimmer
            "session": "s2", "cohort": {"source": "direct", "device": "mobile"},
            "generated_at": "2026-06-22T11:00:00Z",
            "events": [{"type": "scroll", "tier": 0, "value": 50, "slug": "w/a"}],
        },
        {  # a test session — must be excluded
            "session": "e2e-x", "cohort": {"source": "social", "device": "desktop"},
            "generated_at": "2026-06-22T12:00:00Z",
            "events": [{"type": "feedback", "tier": 2, "text": "noise", "slug": "w/a"}],
        },
    ]
    out = aggregate(records)
    ok = True

    def check(name: str, cond: bool) -> None:
        nonlocal ok
        print(f"  [{'PASS' if cond else 'FAIL'}] {name}")
        ok = ok and cond

    check("test session excluded", out["totals"]["sessions"] == 2)
    check("one expressed signal counted", out["totals"]["expressed"] == 1)
    check("feedback verbatim preserved", out["feedback"][0]["text"] == "fix X")
    wa = next(w for w in out["writeups"] if w["slug"] == "w/a")
    check("engaged reader scores > skimmer overall", out["fluency"]["overall"] > 0.3)
    check("w/a has both sessions", wa["sessions"] == 2)
    check("expressed_rate on w/a is 0.5", wa["expressed_rate"] == 0.5)
    print("selftest:", "OK" if ok else "FAILED")
    return 0 if ok else 1


def main() -> int:
    if "--selftest" in sys.argv:
        return selftest()
    sync_repo()
    report = aggregate(load_records(CACHE))
    atomic_write(OUTPUT, report)
    print(f"wrote {OUTPUT} — {report['totals']['sessions']} sessions, "
          f"{report['totals']['expressed']} expressed, "
          f"overall fluency {report['fluency']['overall']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
