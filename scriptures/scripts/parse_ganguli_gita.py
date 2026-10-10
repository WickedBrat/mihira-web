#!/usr/bin/env python3
"""
parse_ganguli_gita.py — extract just the Bhagavad Gita (Book 6 / Bhishma
Parva) out of the full Mahabharata text the user downloaded from
sacred-texts.com (mahatxt.zip -> maha06.txt), using the explicit
"[(Bhagavad Gita Chapter N)]" markers sacred-texts.com's editor (John Bruno
Hare) added to the original Ganguli translation for cross-referencing.

This does NOT parse the rest of the Mahabharata — maha06.txt alone is
~1 MB / ~15,000 lines and covers the whole Bhishma Parva, of which the Gita
is only a portion (SECTION XXV through XLII). The other 17 books
(~1,870+ SECTION-marked passages total) are a separate, much larger job.

Input:  scriptures/raw/mahatxt_extracted/maha06.txt
Output: scriptures/bhagavad-gita/ganguli/chapter-NN.txt
"""
import os
import re
from pathlib import Path

_BASE = Path(os.environ.get("MIHIRA_SCRIPTURES_BASE", "/Users/Apple/Desktop/mihira/scriptures"))
RAW = _BASE / "raw" / "mahatxt_extracted" / "maha06.txt"
OUT_DIR = _BASE / "bhagavad-gita" / "ganguli"

ROMAN_TO_INT = {
    "I": 1, "II": 2, "III": 3, "IV": 4, "V": 5, "VI": 6, "VII": 7, "VIII": 8,
    "IX": 9, "X": 10, "XI": 11, "XII": 12, "XIII": 13, "XIV": 14, "XV": 15,
    "XVI": 16, "XVII": 17, "XVIII": 18,
}

CHAPTER_MARKER = re.compile(
    r"SECTION\s+[IVXLC]+\s*\n\s*\[\(Bhagavad Gita,?\s*Chapter\s+([IVXLC]+)\)\]",
    re.IGNORECASE,
)


def main():
    text = RAW.read_text(encoding="utf-8", errors="replace")

    markers = list(CHAPTER_MARKER.finditer(text))
    if len(markers) != 18:
        print(f"WARNING: expected 18 chapter markers, found {len(markers)} — check output before trusting it.")

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    for i, m in enumerate(markers):
        roman = m.group(1)
        num = ROMAN_TO_INT.get(roman.upper())
        if num is None:
            print(f"  SKIP unrecognized roman numeral: {roman}")
            continue
        start = m.end()
        if i + 1 < len(markers):
            end = markers[i + 1].start()
        else:
            # Last Gita chapter (XVIII) has no following "[(Bhagavad Gita Chapter ...)]"
            # marker to bound it — the editor's annotations stop once the Gita ends.
            # Bound it against the next plain "SECTION <roman>" heading instead of
            # falling through to end-of-file (which would swallow the rest of Bhishma Parva).
            next_section = re.search(r"\nSECTION\s+[IVXLC]+", text[start:])
            end = start + next_section.start() if next_section else len(text)
        chapter_text = text[start:end]

        # Drop the editor's bracketed cross-reference note and the closing colophon bracket,
        # keep the actual translated dialogue.
        chapter_text = re.sub(r"\(\[This where is the Bhagavad Gita proper starts.*?\]\)", "", chapter_text, flags=re.DOTALL)
        # Closing colophon like "[Here ends the ... lesson ... Bhagavadgita ...]" — keep it, it's useful provenance,
        # but strip it out to a separate line rather than leaving it embedded in running prose.
        colophon_match = re.search(r"\[Here ends the.*?\]", chapter_text, flags=re.DOTALL)
        colophon = colophon_match.group(0) if colophon_match else None
        if colophon_match:
            chapter_text = chapter_text[:colophon_match.start()] + chapter_text[colophon_match.end():]

        # Collapse whitespace/newlines within paragraphs, keep paragraph breaks (blank line) intact.
        paragraphs = [p.strip() for p in re.split(r"\n\s*\n", chapter_text) if p.strip()]
        paragraphs = [re.sub(r"\s+", " ", p) for p in paragraphs]

        out_lines = []
        out_lines.append(f"=== Bhagavad Gita — Chapter {num} (Ganguli's Mahabharata translation, Bhishma Parva) ===")
        out_lines.append("Source: Kisari Mohan Ganguli, prose translation of the Mahabharata, 1883-1896. Public domain.")
        out_lines.append("Extracted from: full Mahabharata text (mahatxt.zip), Book 6 / Bhishma Parva, using sacred-texts.com editor John Bruno Hare's added chapter-boundary markers (not present in Ganguli's original, added for cross-reference).")
        out_lines.append("Note: this is continuous prose per chapter, not individually numbered per Sanskrit verse (same limitation as Telang's translation) — paragraphs below follow the speaker-turn breaks in the original prose, not shloka numbers.")
        out_lines.append("")
        for p in paragraphs:
            out_lines.append(p)
            out_lines.append("")
        if colophon:
            colophon_clean = colophon.replace("[", "").replace("]", "").strip()
            out_lines.append(f"[Colophon: {colophon_clean}]")
            out_lines.append("")
        out_lines.append(f"--- END CHAPTER {num} ---")

        out_path = OUT_DIR / f"chapter-{num:02d}.txt"
        out_path.write_text("\n".join(out_lines), encoding="utf-8")
        print(f"  wrote {out_path.name} ({len(paragraphs)} paragraphs)")


if __name__ == "__main__":
    main()
