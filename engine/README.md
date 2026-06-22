# engagement-engine

Aggregates raw engagement signals (from the private `engagement-signals` sink
repo) into a single fluency report the dashboards read.

- **Input:** `engagement-signals` repo, pulled via existing `gh` auth (no secret stored locally)
- **Output:** `~/.engagement-engine.json` (atomic write, `generated_at` ISO-8601 UTC)
- **Deps:** Python 3 stdlib only
- **Outbound:** GitHub only (`gh`), deny-by-default

## Fluency model

Per `(session, writeup)` engagement unit, scored 0–1, weighted toward *expressed*
signal (corrections/questions/comments are the primary target):

| Factor | Weight | Signal |
|---|--:|---|
| Expressed | 0.35 | left a tier-2 comment/question/correction |
| Read depth | 0.20 | dwell vs a 120s full-read target |
| Reached refs | 0.15 | scrolled to 90% |
| Interaction | 0.15 | any tier-1 (helpful vote) |
| Progression | 0.15 | session read more than one writeup |

Rolled up by writeup and by cohort (acquisition source, device). Every expressed
comment is preserved verbatim in `feedback[]` — the qualitative dataset.

## Run

```sh
python3 engine/engagement-engine.py            # pull + aggregate + write report
python3 engine/engagement-engine.py --selftest # verify scoring math
```

## Install the scheduled refresh (launchd)

```sh
cp engine/com.anandsureshworks.engagement-engine.plist ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/com.anandsureshworks.engagement-engine.plist
launchctl start com.anandsureshworks.engagement-engine   # run once now
```

Refreshes every 30 min. Verify:

```sh
launchctl list | grep engagement-engine
cat ~/.engagement-engine.json | python3 -m json.tool | head
tail ~/Library/Logs/engagement-engine.log
```

To stop / reload after edits:

```sh
launchctl unload ~/Library/LaunchAgents/com.anandsureshworks.engagement-engine.plist
```

> Manual-only refresh is a bug: if `~/.engagement-engine.json` `generated_at` is
> older than 60 min (2× interval), the job isn't running — check the log.
