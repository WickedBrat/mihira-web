#!/usr/bin/env python3
"""
fetch_sources.py — Stage 1 fetcher for Mihira's public-domain scripture corpus.

Downloads RAW source material (Sanskrit from GRETIL, English translations
from archive.org) into scriptures/raw/{slug}/ for later parsing into the
verse-by-verse format defined in SCHEMA.md. This script does NOT parse or
segment verses — raw text from a 100+ year old OCR scan or a GRETIL plaintext
dump is too inconsistent per-text to handle generically. Treat this as the
"get the clean bulk material onto disk" step; per-text parsing is a
follow-up.

Why GRETIL + archive.org and not sacred-texts.com:
sacred-texts.com's robots.txt explicitly disallows ClaudeBot (and GPTBot,
CCBot, Google-Extended, etc.), with Content-Signal: ai-train=no. That's a
specific opt-out of automated collection, independent of whether the
underlying 19th/early-20th-century translations are themselves public
domain. GRETIL has no robots.txt restrictions and exists specifically for
scholarly bulk reuse. archive.org's robots.txt is wide open (only blocks
/control/ and /report/) and its entire mission is enabling reuse of
public-domain works. This script only targets those two.

Usage:
    pip install -r requirements.txt
    python fetch_sources.py --list                  # show all configured texts + status
    python fetch_sources.py --only bhagavad-gita     # fetch just one text
    python fetch_sources.py --all                    # fetch everything marked "verified"
    python fetch_sources.py --all --delay 5          # slower, more polite

Only entries with status "verified" (a confirmed URL or archive.org
identifier) are fetched. Entries marked "todo" are skipped with a warning —
run find_archive_identifier.py to look one up, confirm it by hand, then
update sources.json before re-running.
"""
import argparse
import json
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
SOURCES_FILE = SCRIPT_DIR / "sources.json"
RAW_DIR = SCRIPT_DIR.parent / "raw"

USER_AGENT = "Mihira-ScriptureFetcher/1.0 (personal, non-commercial research use; sourcing public-domain texts only)"
DEFAULT_DELAY = 3.0  # seconds between requests — be polite, these are small institutions/archives
MAX_RETRIES = 3


def load_sources():
    with open(SOURCES_FILE, encoding="utf-8") as f:
        return json.load(f)


def fetch_url(url: str, retries: int = MAX_RETRIES) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    last_err = None
    for attempt in range(1, retries + 1):
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                return resp.read()
        except (urllib.error.URLError, urllib.error.HTTPError) as e:
            last_err = e
            print(f"    attempt {attempt}/{retries} failed: {e}", file=sys.stderr)
            time.sleep(2 * attempt)
    raise last_err


def archive_download_url(identifier: str) -> str:
    # archive.org's direct-download endpoint for the plain-text OCR layer of a scanned book.
    return f"https://archive.org/download/{identifier}/{identifier}_djvu.txt"


def save(path: Path, content: bytes):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(content)
    print(f"    saved -> {path} ({len(content):,} bytes)")


def process_entry_list(slug: str, kind: str, entries: list, delay: float, force: bool):
    out_dir = RAW_DIR / slug
    for entry in entries:
        status = entry.get("status", "todo")
        if status not in ("verified",):
            print(f"  [{kind}] SKIP (status={status}): {entry.get('note', entry)}")
            continue

        if "url" in entry:
            url = entry["url"]
            fname = entry.get("filename", url.split("/")[-1] or "download.txt")
        elif "archive_identifier" in entry:
            ident = entry["archive_identifier"]
            url = archive_download_url(ident)
            translator = entry.get("translator", "unknown").replace(" ", "_")
            fname = f"{kind}_{translator}_{ident}.txt"
        else:
            print(f"  [{kind}] SKIP — verified but no 'url' or 'archive_identifier' field: {entry}")
            continue

        out_path = out_dir / fname
        if out_path.exists() and not force:
            print(f"  [{kind}] already have {out_path.name}, skipping (use --force to re-download)")
            continue

        print(f"  [{kind}] fetching {url}")
        try:
            content = fetch_url(url)
        except Exception as e:
            print(f"  [{kind}] FAILED: {e}", file=sys.stderr)
            continue
        save(out_path, content)
        time.sleep(delay)


def fetch_text(text_cfg: dict, delay: float, force: bool):
    slug = text_cfg["slug"]
    print(f"\n=== {text_cfg['name']} ({slug}) ===")
    process_entry_list(slug, "sanskrit", text_cfg.get("sanskrit", []), delay, force)
    process_entry_list(slug, "english", text_cfg.get("english", []), delay, force)


def list_status(cfg: dict):
    for t in cfg["texts"]:
        sk_status = [e.get("status", "todo") for e in t.get("sanskrit", [])]
        en_status = [e.get("status", "todo") for e in t.get("english", [])]
        print(f"{t['slug']:20s} sanskrit={sk_status}  english={en_status}")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--only", help="Fetch only this text slug (see --list for options)")
    ap.add_argument("--all", action="store_true", help="Fetch all texts with verified entries")
    ap.add_argument("--list", action="store_true", help="List configured texts and entry status, then exit")
    ap.add_argument("--delay", type=float, default=DEFAULT_DELAY, help=f"Seconds between requests (default {DEFAULT_DELAY})")
    ap.add_argument("--force", action="store_true", help="Re-download even if the file already exists")
    args = ap.parse_args()

    cfg = load_sources()

    if args.list:
        list_status(cfg)
        return

    if args.only:
        matches = [t for t in cfg["texts"] if t["slug"] == args.only]
        if not matches:
            print(f"No text with slug '{args.only}'. Run --list to see valid slugs.", file=sys.stderr)
            sys.exit(1)
        fetch_text(matches[0], args.delay, args.force)
    elif args.all:
        for t in cfg["texts"]:
            fetch_text(t, args.delay, args.force)
    else:
        ap.print_help()


if __name__ == "__main__":
    main()
