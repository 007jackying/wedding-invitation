# Firestore Schema

Source of truth: the code (`src/firebase.ts`, `src/types.ts`). This document is kept in sync with what the app actually reads and writes — not an aspirational design.

## Collection: `rsvps`

One document per invited party. **The document id is the guest's invite code** — the couple sends
`https://…/?g=<id>`, and that link is the only way to reply. Created by `createInvite()`, read by
`getRSVP()` / `onRSVPsSnapshot()` / `getRSVPs()`, filled in by `updateRSVP()`. Mirrors the
`RSVPFormData` interface in `src/types.ts`.

| Field         | Type                        | Notes |
|---------------|-----------------------------|-------|
| `id`          | string                      | Firestore document id = the invite code (not stored in the doc body; attached on read). 6 chars from `23456789abcdefghjkmnpqrstuvwxyz`. |
| `guestName`   | string                      | Primary guest / party name. Set by the couple at invite time; the guest can correct it when replying. |
| `attending`   | boolean                     | `true` = joining, `false` = declines (and `false` on a pending invite — read it together with `timestamp`). Declines carry `guestCount` = 0, `phone` = "". Older docs without this field are read as `true`. |
| `guestCount`  | number                      | Size of party. `0` for declines and pending invites. |
| `phone`       | string                      | Contact phone. `""` for declines and pending invites. |
| `email`       | string                      | Optional; stored as `""` when omitted. Never `undefined` — Firestore rejects it and the rules require a string. |
| `dietChoice`  | `"standard" \| "vegetarian"` | Two options only. Meaningless until replied. |
| `timestamp`   | string                      | `new Date().toLocaleString()` at submission — **`""` means the invite was created but not yet answered.** This is the only "has this guest replied?" signal; the admin stats and the pending badge both key off it. |

### Invite lifecycle

```
created   rsvps/k3d9x2 { guestName:"Uncle Tan", guestCount:0, phone:"", email:"",
                         dietChoice:"standard", attending:false, timestamp:"" }
replied   same doc      { guestName:"Uncle Tan", guestCount:2, phone:"012…", email:"",
                         dietChoice:"vegetarian", attending:true, timestamp:"2/8/2026, 9:14:03 PM" }
```

A guest replies once; the UI then shows their answer back to them instead of the form, on any device,
and points them at WhatsApp to change it. Recording a reply that came in by phone is the same write,
done from the admin row editor (party size `0` there records a decline).

## Collection: `timeline`

Wedding-day schedule shown in the Details section. Mirrors `TimelineItem` in `src/types.ts`; seeded from `DEFAULT_TIMELINE` when empty.

| Field    | Type   | Notes |
|----------|--------|-------|
| `id`     | string | Firestore document id. |
| `timeEn` | string | Time label, English (e.g. "5:00 PM"). |
| `textEn` | string | Event description, English. |
| `timeCn` | string | Time label, Chinese. |
| `textCn` | string | Event description, Chinese. |
| `order`  | number | Sort order. |

## Not in this schema

The earlier project brief described `name`, `guestsCount`, `foodPreference` (4 values), `hasKids`, `kidsCount`, `notes`, `submittedAt`. Those are **not** implemented — the RSVP form doesn't collect kids or notes, food is two options, and field names differ as above. If you want them, that's a feature addition (form + admin + firebase), not a rename.
