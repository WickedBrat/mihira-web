# Scripture source fetcher

Run these on your own machine (they need real internet access — the sandbox this was written in doesn't have any, which is why I couldn't run it for you).

## Setup

```bash
cd scriptures/scripts
pip install -r requirements.txt
```

## What this does — and doesn't — do

`fetch_sources.py` downloads **raw** source material into `scriptures/raw/{slug}/`:
- Sanskrit from GRETIL (Göttingen Register of Electronic Texts in Indian Languages)
- English translations from archive.org (OCR'd public-domain scans)

It does **not** parse that raw text into the clean verse-by-verse format in `SCHEMA.md`. GRETIL dumps and 100+ year old OCR scans are too inconsistent per-text to split into verses generically — that's a follow-up step, done text-by-text (I did this by hand for Bhagavad Gita Chapter 1; see `bhagavad-gita/chapter-01.txt`).

**Why not sacred-texts.com?** Its robots.txt explicitly disallows ClaudeBot (and GPTBot, CCBot, Google-Extended...) with `Content-Signal: ai-train=no`. That's the site owner specifically opting Claude's crawler out of automated collection — separate from whether the underlying translations are public domain. This script only touches GRETIL and archive.org, neither of which has that restriction; archive.org's robots.txt is wide open and its whole mission is enabling bulk reuse of public-domain works.

## Usage

```bash
# See what's configured and what's ready to fetch
python fetch_sources.py --list

# Fetch one text
python fetch_sources.py --only bhagavad-gita

# Fetch everything currently marked "verified" in sources.json
python fetch_sources.py --all --delay 5   # --delay in seconds between requests, be polite
```

## Filling in the gaps

Most entries in `sources.json` are marked `"status": "todo"` — I only confirmed a handful of archive.org identifiers this session (Bhagavad Gita/Besant, Rig Veda/Griffith, Mahabharata/Ganguli, Manusmriti/Bühler, Devi Bhagavatam/Vijnanananda). For the rest (Ramayana, Vishnu/Bhagavata/Markandeya/Agni/Garuda/Matsya Puranas, Arthashastra, Upanishads), look one up first — don't guess an identifier, a wrong one will silently download the wrong book:

```bash
python find_archive_identifier.py "Vishnu Purana Wilson"
```

This hits archive.org's public Advanced Search API, prints candidate identifiers with title/creator/year, and a `details` link so you can eyeball it's the right edition before adding it to `sources.json` with `"status": "verified"`.

For GRETIL Sanskrit sources, every "todo" entry needs its exact plaintext download URL confirmed by hand from https://gretil.sub.uni-goettingen.de/gretil.html (organized by genre — Samhita, Brahmana, Upanisad, Mahabharata, Ramayana, Purana, etc.) — add the confirmed URL as a `"url"` field on the entry.

## After fetching

Raw files land in `scriptures/raw/{slug}/`. Next step per text: parse into `scriptures/{slug}/chapter-NN.txt` following `SCHEMA.md`'s format (Sanskrit numbered per-verse, English either verse-aligned or chapter-level block depending on whether the source translation was originally verse-segmented). That parsing step is text-specific — bring the raw files back to a conversation with me (or write per-text parsers) rather than expecting one generic script to handle Vedic mantra numbering, Puranic adhyaya/shloka numbering, and Mahabharata parva/adhyaya/shloka numbering the same way.
