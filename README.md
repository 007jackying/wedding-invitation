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
- `npx tsx test-invite.mts` — creates a throwaway invite, replies to it, reads it back and deletes it. Checks the invite lifecycle against the real Firestore *and* `firestore.rules`, which a typecheck can't.

## Routing

Everything is one SPA, switched by URL hash/path — no router library:

| View | Trigger |
|---|---|
| English invitation | default, or `#en` / `/en/` |
| Chinese invitation | `#cn` / `/cn/` |
| Admin dashboard | `#admin` |
| A guest's personal invite | `?g=<code>` — combines with the above, e.g. `?g=k3d9x2#cn` |

Language falls back to the browser's `navigator.language` if no explicit hash/path is set.

## Invite links

Every guest gets their own link. In the dashboard, **Create Invite** takes just a name, mints a
6-character code, and copies `…/?g=<code>` to the clipboard to send over WhatsApp. The code is the
Firestore document id, so opening the link loads that guest's invite: they see their name in the
form, and once they've replied the site shows their answer back to them from Firestore — on any
device, not just the one they replied from. Replies are one-shot; changing one goes through the
couple on WhatsApp, or through the dashboard's row editor.

Without a valid `?g=` code the site is read-only: the RSVP button is replaced by a note asking the
visitor to message the couple for their link. The dashboard lists everyone invited, so the guests
who haven't replied are visible as **Invited** rows rather than being absent from the data.

## Admin dashboard

Visit `#admin` (or the lock icon in the footer). Gated by a 6-digit PIN defined in `src/types.ts` (`ADMIN_PIN`) — **UI-only gating**, not a security boundary (see `firestore.rules`, currently open read/write). From there you can create invites, copy each guest's link, view/search/sort/edit/delete RSVPs, and edit the event timeline — all synced live via Firestore `onSnapshot`.

## Data

Firestore collections (`rsvps`, `timeline`) are documented in [SCHEMA.md](SCHEMA.md) — that file is the source of truth for what's actually read/written, kept in sync with `src/firebase.ts` and `src/types.ts`.

## Structure

```
src/
  App.tsx                 routing, language switch, ?g= invite lookup
  firebase.ts             all Firestore reads/writes/listeners, invite codes
  types.ts                RSVPFormData, TimelineItem, CONTACTS, ADMIN_PIN
  translations.ts         EN/CN copy
  components/
    HeroSection.tsx        landing hero + countdown
    DetailsSection.tsx     timeline, venue, RSVP trigger
    DressCodeSection.tsx
    RSVPModal.tsx           writes the reply back to the guest's invite doc
    RSVPSummary.tsx         the reply shown back to a guest, + the "need a link" card
    AdminDashboard.tsx      PIN-gated invites/guest list + timeline editor
    CalendarButton.tsx      add-to-calendar (.ics)
    CountdownTimer.tsx
    AudioPlayer.tsx
    BackgroundSlideshow.tsx
```
