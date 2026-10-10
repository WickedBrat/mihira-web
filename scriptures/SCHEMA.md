# Scripture Extraction — Format & Sourcing Spec

Structured, plain-text, verse-by-verse extraction of public-domain Hindu sacred texts for Mihira's content pipeline. See `/Users/Apple/Desktop/Nous/projects/mihira/research/public-domain-source-texts.md` for the full copyright analysis behind which texts/translations are used here.

## Directory layout

```
scriptures/
├── SCHEMA.md              ← this file
├── INDEX.md                ← status tracker: which texts/chapters are done
├── bhagavad-gita/
│   ├── chapter-01.txt
│   ├── chapter-02.txt
│   └── ...
├── ramayana/
│   ├── bala-kanda.txt
│   └── ...
└── {text-slug}/
    └── {section-slug}.txt
```

## File format (plain text, structured per verse)

Each file covers one chapter/section of one text. Header block, then one entry per verse:

```
=== {Text Name} — {Chapter/Section Name} ===
Sanskrit source: {translator/edition, year, PD basis}
English source: {translator/edition, year, PD basis}
Verse numbering: {native scheme, e.g. "1.1–1.47" or note if English is chapter-level prose, not per-verse}

[1.1]
SANSKRIT: <romanized or devanagari verse>
ENGLISH: <verse-aligned translation, or "— (see chapter-level translation below)" if source isn't verse-segmented>

[1.2]
SANSKRIT: ...
ENGLISH: ...

...

--- CHAPTER-LEVEL ENGLISH TRANSLATION (where source is continuous prose, not verse-numbered) ---
<full translated text of the chapter>
```

## Sourcing rules

1. Only use texts/translations confirmed public domain in `public-domain-source-texts.md`. Do not use Motilal Banarsidass "Ancient Indian Tradition and Mythology" (AITM) translations, Gita Press Hindi editions, or any modern copyrighted rendering.
2. Sanskrit: pulled from GRETIL or sacred-texts.com (cross-referenced with GRETIL), which retains native per-verse numbering (e.g., 1.1, 1.2...).
3. English: pulled from the specific named public-domain translator per text (Griffith, Ganguli, Wilson, Dutt, Pargiter, Vijnanananda, Bühler, Shamasastry, Telang, Arnold, etc.) Some of these translations (e.g., Telang's Bhagavad Gita, Arnold's) are continuous prose/verse-form in the original and were NOT segmented per-Sanskrit-verse by the translator. Where that's the case, we keep the Sanskrit's native per-verse numbering but attach the English as a chapter-level block rather than inventing a false 1:1 split.
4. Always record translator, year, and source URL in the file header — this is the copyright audit trail.
5. Hindi and other regional-language columns: not yet populated. No verified public-domain Hindi translation exists for most of these texts (see research file) — Hindi content will need to be generated fresh by Mihira rather than sourced.

## Status

See `INDEX.md` for per-text progress.
