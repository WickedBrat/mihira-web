# Mihira

This repository is split by product surface:

- `mobile/` - Expo application, native projects, mobile tests, mobile assets, EAS config, and Expo package lock.
- `web/` - Web app and web build configuration. Keep web-specific changes inside this folder.
- `core/` - Shared server routes, AI, Vedic astrology, scripture corpus, and shared types, imported by both `mobile/` and `web/` as `@core/*`. It imports nothing from either app; run its tests from `core/` with `npm test`.
- `supabase/` - Database migrations and backend data model changes.
- `docs/` - Product, release, setup, strategy, and data reference material.

Root-level package scripts are only convenience wrappers. Run mobile commands from `mobile/` or with `npm run mobile:start`; run web commands from `web/` or with `npm run web:dev`.
