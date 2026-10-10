# Scripture Extraction — Status Index

Tracks progress against the 19-text "safe today" list from `/Users/Apple/Desktop/Nous/projects/mihira/research/public-domain-source-texts.md`. See `SCHEMA.md` for format.

| # | Text | Approx. verse count | Status | Notes |
|---|---|---|---|---|
| 1 | Bhagavad Gita | ~700 (18 ch.) | 🟡 In progress — Ch. 1 done (47/700 verses) | Sanskrit: sacred-texts.com/GRETIL. English: Telang (1882, chapter-level prose, not per-verse). |
| 2 | Rig Veda | ~10,600 mantras | ⚪ Not started | English: Griffith (1889–96). |
| 3 | Sama Veda | ~1,140 mantras | ⚪ Not started | English: Griffith (1895). |
| 4 | Krishna Yajurveda | — | ⚪ Not started | English: Keith (1914). |
| 5 | Shukla Yajurveda | ~1,975 (40 adhyayas) | ⚪ Not started | English: Griffith (1899). |
| 6 | Atharvaveda | ~6,000 mantras | ⚪ Not started | English: Whitney (1905) / Bloomfield (1897). |
| 7 | Principal Upanishads | — | ⚪ Not started | English: Max Müller (1879–84). |
| 8 | Ramayana (Valmiki) | ~24,000 | ⚪ Not started | English: Griffith (verse) / Dutt (prose). |
| 9 | Mahabharata | ~92,658 (incl. Gita) | ⚪ Not started | English: Ganguli (1883–96). **Largest text — needs a dedicated extraction pass, not ad hoc.** |
| 10 | Ramcharitmanas | ~2,247 | ⚪ Not started | English: Growse (1883). |
| 11 | Vishnu Purana | ~7,000 | ⚪ Not started | English: Wilson (1840). |
| 12 | Bhagavata Purana | ~18,000 | ⚪ Not started | English: Dutt (1895–96). |
| 13 | Markandeya Purana | ~9,000 | ⚪ Not started | English: Pargiter (1904). |
| 14 | Agni Purana | — (381 adhyayas) | ⚪ Not started | English: Dutt (1903–04). |
| 15 | Garuda Purana | 651 verses (16 ch.) | ✅ Parsed — English only | Wood & Subrahmanyam (1911), user-downloaded from sacred-texts.com. No Sanskrit yet (GRETIL still todo). |
| 16 | Matsya Purana | ~14,000 (176 ch.) | ⚪ Not started | English: Taluqdar of Oudh (1916–17). |
| 17 | Devi Bhagavatam | ~19,700 | ⚪ Not started | English: Vijnanananda (1921–22). |
| 18 | Manusmriti | ~2,684 | ⚪ Not started | English: Bühler (1886). |
| 19 | Arthashastra | ~5,755 sutras | ⚪ Not started | English: Shamasastry (1915). |
| 20 | Chanakya Niti | small | ⚪ Not started | Multiple PD translations. |

**Source config status (as of this session):** 12 of 18 configured texts now have a verified archive.org English identifier in `scripts/sources.json` (Bhagavad Gita, Rig Veda, Mahabharata, Manusmriti, Devi Bhagavatam, Vishnu Purana, Ramayana, Garuda Purana, both Upanishads volumes, Sama Veda, Shukla Yajurveda, Atharvaveda). Still `todo`: Bhagavata Purana, Markandeya Purana, Agni Purana, Matsya Purana, Arthashastra, Krishna Yajurveda. GRETIL Sanskrit sources remain `todo` for nearly everything — only the Upanishads' GRETIL file listing has been located (individual slugs not yet confirmed). Run `python fetch_sources.py --all` (on a machine with internet — the sandbox this was built in has none) to pull the raw English OCR text for anything marked verified.

**Total scope reality check:** these 19 texts add up to roughly 200,000+ verses. Extracting all of them verse-by-verse via manual page-fetching is a large, multi-session effort — the Mahabharata alone (~92,658 verses) is a project of its own. Recommend prioritizing by what Mihira's content pipeline actually needs first (e.g., Gita fully, then Ramayana, then Upanishads) rather than working strictly top-to-bottom.

**Format note:** Several of the oldest PD English translations (Telang's Gita, Arnold's Gita) are continuous prose/verse-form, not segmented per-Sanskrit-stanza. Where that's the case, English is stored as a chapter-level block alongside individually-numbered Sanskrit verses (see `SCHEMA.md`), rather than forcing an inaccurate 1:1 split.
