# Firestore Schema

Source of truth: the code (`src/firebase.ts`, `src/types.ts`). This document is kept in sync with what the app actually reads and writes — not an aspirational design.

## Collection: `rsvps`

Written by `addRSVP()`; read by `onRSVPsSnapshot()` / `getRSVPs()`. Mirrors the `RSVPFormData` interface in `src/types.ts`.

| Field         | Type                        | Notes |
|---------------|-----------------------------|-------|
| `id`          | string                      | Firestore document id (not stored in the doc body; attached on read). |
| `guestName`   | string                      | Primary guest / party name. |
| `attending`   | boolean                     | `true` = joining, `false` = regretfully declines. Declines skip the fields below (`guestCount` = 0, `phone` = ""). Older docs without this field are read as `true`. |
| `guestCount`  | number                      | Size of party. `0` for declines. |
| `phone`       | string                      | Contact phone. `""` for declines. |
| `email`       | string                      | Optional; stored as `""` when omitted. |
| `dietChoice`  | `"standard" \| "vegetarian"` | Two options only. |
| `timestamp`   | string                      | `new Date().toLocaleString()` at submission. |

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
