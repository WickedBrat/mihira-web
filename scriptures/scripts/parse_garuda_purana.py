#!/usr/bin/env python3
"""
parse_garuda_purana.py — parse the raw sacred-texts.com plain-text dump of
the Garuda Purana (Wood & Subrahmanyam, 1911; user-downloaded, public domain)
into per-chapter, verse-numbered files matching scriptures/SCHEMA.md.

This translation has NO parallel Sanskrit in this source file — it's an
English-only translation. Verses ARE individually numbered by the
translators (e.g. "1.", "3-5." for a combined verse group), which is what
makes clean per-verse splitting possible here, unlike Telang's Gita prose.

Input:  scriptures/raw/gpu.txt   (already gunzipped from gpu.txt.gz)
Output: scriptures/garuda-purana/chapter-NN.txt
"""
import re
from pathlib import Path

import os

_BASE = Path(os.environ.get("MIHIRA_SCRIPTURES_BASE", "/Users/Apple/Desktop/mihira/scriptures"))
RAW = _BASE / "raw" / "gpu.txt"
OUT_DIR = _BASE / "garuda-purana"

ROMAN_CHAPTERS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X",
                  "XI", "XII", "XIII", "XIV", "XV", "XVI"]

CHAPTER_TITLES = {
    1: "The Miseries of the Sinful in this World and the Other",
    2: "The Way of Yama",
    3: "The Torments of Yama",
    4: "The Kinds of Sins which lead to Hell",
    5: "The Signs of Sins",
    6: "The Miseries of Birth of the Sinful",
    7: "Babhruvahana's Sacrament for the Departed One",
    8: "The Gifts for the Dying",
    9: "The Rites for the Dying",
    10: "The Collecting of the Bones from the Fire",
    11: "The Ten-Days' Ceremonies",
    12: "The Eleventh-Day Rite",
    13: "The Ceremony for all the Ancestors",
    14: "The City of the King of Justice",
    15: "The Coming to Birth of People who have done Good",
    16: "The Law for Liberation",
}

RUNNING_HEADER = "The Garuda Purana, by Ernest Wood and S.V. Subrahmanyam, [1911], at sacred-texts.com"


def clean_line(line: str) -> str:
    line = line.replace(RUNNING_HEADER, "")
    line = re.sub(r"\[paragraph continues\]", "", line)
    line = re.sub(r"\[p\.\s*\d+\]", "", line)
    return line.strip()


def split_chapters(text: str):
    # Find each "CHAPTER {roman}." heading and slice the text between them.
    pattern = re.compile(r"\nCHAPTER\s+(" + "|".join(ROMAN_CHAPTERS) + r")\.?\s*\n")
    matches = list(pattern.finditer(text))
    chapters = []
    for i, m in enumerate(matches):
        start = m.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        roman = m.group(1)
        num = ROMAN_CHAPTERS.index(roman) + 1
        chapters.append((num, text[start:end]))
    return chapters


def extract_footnotes(chapter_body: str):
    """Footnote markers like [*1] reset their numbering on every printed page,
    so a naive "match by index" approach silently misattributes notes across
    page boundaries (verified bug — chapter 9 output showed the wrong note
    duplicated onto unrelated verses). The reliable signal instead is READING
    ORDER: the N-th [*..] marker in the body corresponds to the N-th footnote
    definition in the chapter's footnote block, since both were typeset in
    the same top-to-bottom sequence. We match strictly by position, ignoring
    the page:index numbers entirely."""
    parts = re.split(r"\nFootnotes\n", chapter_body)
    body = parts[0]
    footnote_block = parts[1] if len(parts) > 1 else ""
    notes_in_order = [m.group(3).strip() for m in re.finditer(r"\^(\d+):(\d+)\s+(.*)", footnote_block)]
    return body, notes_in_order


def substitute_footnote_markers(text: str, notes_in_order: list) -> str:
    """Replace each [*N] / [+N] marker in the text, strictly in the order
    they appear, with the next unused footnote definition. If there are more
    markers than definitions (or vice versa), stop substituting rather than
    guess — leftover markers are left as-is and flagged, since a wrong note
    is worse than a visible gap."""
    it = iter(notes_in_order)

    def repl(_match):
        try:
            return f" [note: {next(it)}]"
        except StopIteration:
            return _match.group(0)  # ran out of definitions — leave marker visible rather than guess

    return re.sub(r"\[[*+]\d+\]", repl, text)


def split_verses(body: str):
    """Split on leading verse-number markers like '12.' or '3-5.' at the
    start of a paragraph. Returns list of (verse_label, text)."""
    # Normalize whitespace: collapse blank-line-separated fragments into paragraphs first,
    # but keep verse markers as split points.
    lines = [clean_line(l) for l in body.split("\n")]
    lines = [l for l in lines if l != ""]
    joined = "\n".join(lines)

    verse_pattern = re.compile(r"(?:^|\n)(\d+(?:-\d+)?)\.\s+")
    parts = verse_pattern.split(joined)
    # parts[0] is preamble before first verse (chapter title line etc.), then alternating (label, text)
    preamble = parts[0].strip()
    verses = []
    for i in range(1, len(parts), 2):
        label = parts[i]
        vtext = parts[i + 1].strip() if i + 1 < len(parts) else ""
        vtext = re.sub(r"\s+", " ", vtext)
        verses.append((label, vtext))
    return preamble, verses


def main():
    raw_text = RAW.read_text(encoding="utf-8", errors="replace")
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    chapters = split_chapters(raw_text)
    print(f"Found {len(chapters)} chapters")

    for num, raw_body in chapters:
        body, notes_in_order = extract_footnotes(raw_body)
        # Substitute footnote markers on the WHOLE chapter body, in one pass,
        # before splitting into verses — this preserves correct reading-order
        # pairing across verse boundaries (a per-verse iterator would restart
        # from note #1 on every verse, which is the same class of bug as before).
        body = substitute_footnote_markers(body, notes_in_order)
        preamble, verses = split_verses(body)
        title = CHAPTER_TITLES.get(num, preamble)

        out_lines = []
        out_lines.append(f"=== Garuda Purana (Saroddhara) — Chapter {ROMAN_CHAPTERS[num-1]}: {title} ===")
        out_lines.append("Sanskrit source: not yet sourced (GRETIL lookup still todo — see sources.json).")
        out_lines.append("English source: Ernest Wood & S. V. Subrahmanyam, 1911 (Panini Office, Allahabad). Public domain — published before 1923; provided by user from sacred-texts.com download.")
        out_lines.append(f"Verse numbering: native to this translation, {verses[0][0] if verses else '?'}-{verses[-1][0] if verses else '?'} (combined labels like 'N-M' indicate the translators grouped consecutive Sanskrit verses into one rendered passage).")
        out_lines.append("")

        for label, vtext in verses:
            out_lines.append(f"[{num}.{label}]")
            out_lines.append(f"ENGLISH: {vtext}")
            out_lines.append("")

        out_lines.append(f"--- END CHAPTER {ROMAN_CHAPTERS[num-1]} ---")

        out_path = OUT_DIR / f"chapter-{num:02d}.txt"
        out_path.write_text("\n".join(out_lines), encoding="utf-8")
        print(f"  wrote {out_path.name}: {len(verses)} verses")


if __name__ == "__main__":
    main()
