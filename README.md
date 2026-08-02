# Eva & Vincent — Wedding Invitation

A bilingual (EN/中文) wedding invitation site: hero, event details, RSVP, dress code, and an owner-only guest/timeline dashboard. React + Vite, with Firestore as the live data store for RSVPs and the day's timeline.

## Run locally

**Prerequisites:** Node.js

```bash
npm install
npm run dev
```

No API key or `.env` needed — the app only talks to Firestore, and its (non-secret) web config is checked in at `firebase-applet-config.json`.

Other scripts:
- `npm run build` — production build
- `npm run preview` — preview the production build
- `npm run lint` — typecheck only (`tsc --noEmit`)

## Routing

Everything is one SPA, switched by URL hash/path — no router library:

| View | Trigger |
|---|---|
| English invitation | default, or `#en` / `/en/` |
| Chinese invitation | `#cn` / `/cn/` |
| Admin dashboard | `#admin` |

Language falls back to the browser's `navigator.language` if no explicit hash/path is set.

## Admin dashboard

Visit `#admin` (or the lock icon in the footer). Gated by a 6-digit PIN defined in `src/types.ts` (`ADMIN_PIN`) — **UI-only gating**, not a security boundary (see `firestore.rules`, currently open read/write). From there you can view/search/sort/edit/delete RSVPs and edit the event timeline, both synced live via Firestore `onSnapshot`.

## Data

Firestore collections (`rsvps`, `timeline`) are documented in [SCHEMA.md](SCHEMA.md) — that file is the source of truth for what's actually read/written, kept in sync with `src/firebase.ts` and `src/types.ts`.

## Structure

```
src/
  App.tsx                 routing, language switch, RSVP success toast
  firebase.ts             all Firestore reads/writes/listeners
  types.ts                RSVPFormData, TimelineItem, ADMIN_PIN
  translations.ts         EN/CN copy
  components/
    HeroSection.tsx        landing hero + countdown
    DetailsSection.tsx     timeline, venue, RSVP trigger
    DressCodeSection.tsx
    RSVPModal.tsx
    AdminDashboard.tsx      PIN-gated guest list + timeline editor
    CalendarButton.tsx      add-to-calendar (.ics)
    CountdownTimer.tsx
    AudioPlayer.tsx
    BackgroundSlideshow.tsx
```
