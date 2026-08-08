# Eva & Vincent — Wedding Invitation

A bilingual (EN/中文) wedding invitation site: hero, event details, RSVP, dress code, and an owner-only guest/timeline dashboard. React + Vite, with Firestore as the live data store for RSVPs and the day's timeline.

## Run locally

**Prerequisites:** Node.js

```bash
npm install
npm run dev
```

The invitation itself needs no setup: the app only talks to Firestore, and its
(non-secret) web config is checked in at `firebase-applet-config.json`.

**The admin dashboard needs one variable.** `VITE_ADMIN_PIN` is read at *build*
time, so it must be set before `npm run dev` / `npm run build` or nobody can get
in (an unset PIN matches nothing):

```bash
echo 'VITE_ADMIN_PIN=123456' > .env.local   # .env* is gitignored
```

Never commit the PIN. It ships inside the client bundle either way, so it is a
speed bump rather than a secret — see the security note under *Admin dashboard*.
The dev server skips the PIN gate entirely (`import.meta.env.DEV`).

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
| Admin dashboard | `#97+97=0201/admin` — an obscure hash, not a secret |
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

Visit `#97+97=0201/admin` — there is no link to it anywhere in the UI, by design.
Gated by a 6-digit PIN from `VITE_ADMIN_PIN` (surfaced as `ADMIN_PIN` in
`src/types.ts`). From there you can create invites, copy each guest's link,
view/search/sort/edit/delete RSVPs, and edit the event timeline — all synced live
via Firestore `onSnapshot`. See [ADMIN_GUIDE.md](ADMIN_GUIDE.md) for the
walkthrough.

> ⚠️ **The PIN is not a security boundary.** It is compiled into the client
> bundle, and `firestore.rules` currently allows `read, write, delete: if true`
> for anyone with the project config — which is checked in. So the guest list can
> be read or wiped straight from the Firestore API without ever loading the
> dashboard. The PIN only keeps a casual visitor out of the UI. Tightening the
> rules is the fix; the PIN is not.

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
    HeroSection.tsx        photo, names, date + countdown. No reply control —
                           its text sits in bands anchored to where the couple
                           are in the photo; see DESIGN.md §1 before editing
    BackgroundSlideshow.tsx the hero photograph; its object-position is what
                           keeps that anchoring stable across screen sizes
    DetailsSection.tsx     timeline, venue, and the only RSVP trigger on the page
    DressCodeSection.tsx
    RSVPModal.tsx           writes the reply back to the guest's invite doc
    RSVPSummary.tsx         the reply shown back to a guest, + the "need a link" card
    AdminDashboard.tsx      PIN-gated invites/guest list + timeline editor
    CalendarButton.tsx      add-to-calendar (.ics)
    CountdownTimer.tsx      owns TARGET_DATE — the one wedding date in the code
    AudioPlayer.tsx         autoplays muted; mute choice persists to localStorage
    Stardust.tsx            drifting gold motes over the hero
public/
  photos/first.jpeg         the hero photograph
  music.mp3                 background track
```

## Music

The track autoplays **muted** — browsers only permit autoplay in that state, so
it is the only version that reliably starts. The guest's mute choice is stored in
`localStorage` under `wedding.musicMuted` and honoured on their next visit.

A returning guest who chose sound may still have `play()` refused before they
interact with the page; that rejection is caught and falls back to muted, so the
icon never claims sound that isn't playing.
