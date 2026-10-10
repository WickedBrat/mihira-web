#!/usr/bin/env python3
"""
find_archive_identifier.py — look up candidate archive.org identifiers for a
public-domain translation, so you can add a confirmed entry to sources.json
instead of guessing.

archive.org's Advanced Search API is public, has no auth, and its robots.txt
places no restrictions on this kind of use (see SCHEMA.md / sources.json
_readme for the robots.txt research behind this whole scripts/ folder).

Usage:
    python find_archive_identifier.py "Vishnu Purana Wilson"
    python find_archive_identifier.py "Valmiki Ramayana Griffith" --rows 20
"""
import argparse
import json
import sys
import time
import urllib.parse
import urllib.request

SEARCH_URL = "https://archive.org/advancedsearch.php"
USER_AGENT = "Mihira-ScriptureSourceLookup/1.0 (personal research; non-commercial content sourcing)"


def search(query: str, rows: int = 10):
    params = {
        "q": query,
        "fl[]": ["identifier", "title", "creator", "year", "mediatype"],
        "rows": rows,
        "page": 1,
        "output": "json",
    }
    url = f"{SEARCH_URL}?{urllib.parse.urlencode(params, doseq=True)}"
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=20) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    return data.get("response", {}).get("docs", [])


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("query", help="Search terms, e.g. 'Vishnu Purana Wilson'")
    ap.add_argument("--rows", type=int, default=10)
    args = ap.parse_args()

    print(f"Searching archive.org for: {args.query!r}\n")
    try:
        docs = search(args.query, args.rows)
    except Exception as e:
        print(f"Search failed: {e}", file=sys.stderr)
        sys.exit(1)

    if not docs:
        print("No results. Try a broader or differently-worded query.")
        return

    for d in docs:
        ident = d.get("identifier", "?")
        title = d.get("title", "?")
        creator = d.get("creator", "?")
        year = d.get("year", "?")
        mediatype = d.get("mediatype", "?")
        print(f"- identifier: {ident}")
        print(f"    title:    {title}")
        print(f"    creator:  {creator}")
        print(f"    year:     {year}")
        print(f"    type:     {mediatype}")
        print(f"    verify:   https://archive.org/details/{ident}")
        print()

    print(
        "Pick the identifier that matches the exact translator/edition you need,\n"
        "open the 'verify' link to confirm it's the right book (not an abridgement,\n"
        "not a different translator), then add it to sources.json with status: 'verified'."
    )


if __name__ == "__main__":
    main()
