# Design Reference

Every colour and typeface used in the invitation, by page and element.
Source of truth is `src/index.css` (`@theme` block) — change a token there and
everything below recolours with it.

Tailwind size names map to fixed pixel values: `text-xs` 12px · `text-sm` 14px ·
`text-base` 16px · `text-lg` 18px · `text-xl` 20px · `text-2xl` 24px ·
`text-3xl` 30px · `text-4xl` 36px · `text-5xl` 48px · `text-6xl` 60px.
Where two sizes are listed (e.g. `12 → 14px`), the first is mobile and the
second takes over at the `sm` breakpoint (640px and wider).

---

## Colour palette

Defined in `src/index.css`.

| Token | Hex | Role | Contrast on sand |
|---|---|---|---|
| `brand-cream` | `#FDF8E1` | Warm sand — page background | — |
| `brand-blush` | `#FDF4CB` | Deeper sand — section tints, soft fills | — |
| `brand-gold` | `#C2A05C` | Blush gold — frames, corner accents, hairline rules, stardust | 2.3:1 — **decorative only, never text** |
| `brand-rose` | `#B5776F` | Rose gold — icons, bullets, highlights | 3.4:1 — icons and large text only |
| `brand-accent` | `#8A4A45` | Deep rose — links, labels, solid buttons | 6.3:1 ✅ |
| `brand-charcoal` | `#2A3123` | Cypress ink — primary text, dark surfaces | 12.6:1 ✅ |
| `brand-olive` | `#59604A` | Moss — secondary text | 6.1:1 ✅ |

Supporting values: scrollbar thumb `#E0D4A8`; modal backdrops
`brand-charcoal/40–45` with a blur.

## Typefaces

| Role | Family | Loaded as | Used for |
|---|---|---|---|
| `font-script` | **Alex Brush** | Google Fonts | Couple's names in the hero — nothing else |
| `font-serif` | **Fraunces** (fallback Georgia) | Google Fonts | Headings, quotes, times, numerals |
| `font-serif` (Chinese) | **Noto Serif SC** | Google Fonts | Swapped in automatically on the 中文 view via a `--font-serif` override on the page wrapper |
| `font-sans` | **Inter** | Google Fonts | Labels, body copy, buttons, all UI |

Chinese has no true italics, so `.italic` is forced upright under `[data-lang="cn"]`.

---

## 1 · Hero

**A photograph mounted on card stock.** The hero is split: the photo holds its
own panel and the type sits beside it on the sand, never over it. No scrim, no
filter, no frame — and because the panel is fixed at the photo's native **3:2**,
nothing is cropped either. Photo right / type left from `lg` up; photo on top,
type beneath on narrower screens.

Type is left-aligned with a hard rag against the photo's straight edge. Nothing
in this section is centred — centring is what makes a wedding hero look like a
template, and the split gives the rag a reason to exist.

**Signature — the date as a numeral lockup.** `02 · 01 · 2027` in Fraunces
tabular figures, sized to be the loudest thing in the block after the names. The
script says *who*, the numerals say *when*; the tension between the two carries
the section. Day-first in English (Malaysian convention), **year-first in Chinese**
(`2027 · 01 · 02`) — the order is localised, not just the words. Derived from
`TARGET_DATE` in `CountdownTimer.tsx` and formatted in `Asia/Kuala_Lumpur`, so a
guest reading from another timezone still sees the wedding day.

| Element | Font | Size | Weight / treatment | Colour |
|---|---|---|---|---|
| "We are married" eyebrow | Inter | 11 → 12px | Semibold, uppercase, `0.35em` tracking | `brand-accent` |
| **Eva / Vincent** | Alex Brush | `clamp(68px, 10vw, 100px)` | Regular, `0.86` line-height, left-aligned | `brand-charcoal` |
| "&" / "与" connector | Fraunces | `0.34em` of the names | Light, raised, **trails the first name** so both lines hang off one left axis | `brand-accent` |
| "Save our Date" | Fraunces | 18 → 20px | Italic | `brand-olive` |
| Gold rule | — | 56 × 1px | — | `brand-gold` |
| **Date numerals** | Fraunces | 30 → 40px | Tabular figures, `0.06em` tracking | `brand-charcoal`, separators `brand-rose` |
| Venue / city | Inter | 11 → 12px | Semibold, uppercase, `0.2em` tracking, split at the comma so the break never lands inside the venue's name | `brand-olive` |
| Countdown numbers | Fraunces | 20 → 24px | Tabular figures | `brand-charcoal` |
| Countdown labels | Inter | 9 → 10px | Semibold, uppercase, `0.2em` tracking | `brand-olive` |
| "Reply to the Invitation" button | Inter | 12 → 14px | Semibold, uppercase, `0.25em` tracking | `brand-cream` on `brand-accent`, pill |
| "Scroll" cue | Inter | 11px | Semibold, uppercase, `0.25em` tracking | `brand-olive` |

**Cut from this section:** the gold double keyline and its corner accents, both
photo scrims, the brightness/contrast filter, the stardust, and every centred
alignment. `Stardust.tsx` still exists but is no longer rendered — it was built to
drift behind cream type on a dark photo, and over a clean photo carrying no type
it was just specks. One line in `HeroSection` brings it back.

The first photo paints without a fade (`initial={false}`); it is the largest
thing on the page and this invitation is opened from a WhatsApp link on mobile
data. Later slides still cross-fade.

## 2 · Details

**Background:** `brand-cream` `#FDF8E1`.

| Element | Font | Size | Weight / treatment | Colour |
|---|---|---|---|---|
| "Join Our Celebration" eyebrow | Inter | 11 → 12px | Semibold, uppercase, `0.35em` tracking | `brand-accent` |
| "The Wedding Details" | Fraunces | 48 → 60px | Italic light | `brand-charcoal` |
| Section rule | — | 64 × 1px | — | `brand-gold` |
| "Timeline" / "Venue" labels | Inter | 11px | Semibold, uppercase, `0.3em` tracking | `brand-olive` |
| Date / venue values | Fraunces | 24 → 30px | Regular | `brand-charcoal` |
| Timeline times | Fraunces | 16 → 18px | Tabular figures | `brand-accent` |
| Timeline descriptions | Inter | 11 → 12px | Light | `brand-charcoal/80` |
| Timeline icons + dots | — | 24–28px | — | `brand-olive` icons, `brand-rose` dots |
| Address | Inter | 14 → 16px | Light | `brand-charcoal/90` |
| Maps / Waze links | Inter | 12px | Semibold, uppercase, `0.2em` tracking, underline rule | `brand-accent` |
| Photo caption | Fraunces | 14 → 16px | Italic | `brand-charcoal/80` |
| "Add to Calendar" button | Inter | 12px | Medium, uppercase, `wider` tracking | `brand-charcoal` on white, pill |

**Reply band** — a rounded `brand-charcoal` `#2A3123` panel inside the section:

| Element | Font | Size | Weight / treatment | Colour |
|---|---|---|---|---|
| "Kindly respond by…" | Fraunces | 24 → 30px | Italic light | `brand-cream` |
| "Reply to the Invitation" button | Inter | 12px | Semibold, uppercase, `0.25em` tracking | `brand-cream` on `brand-accent`, pill |

## 3 · Dress Code

**Background:** `brand-blush` at 40% over the sand page — a slightly warmer band.

| Element | Font | Size | Weight / treatment | Colour |
|---|---|---|---|---|
| "The Aesthetic" eyebrow | Inter | 11 → 12px | Semibold, uppercase, `0.35em` tracking | `brand-accent` |
| "Dress Code" | Fraunces | 48 → 60px | Italic light | `brand-charcoal` |
| Subtitle quote | Fraunces | 16 → 18px | Italic | `brand-olive` |
| "Ladies" / "Gentlemen" | Fraunces | 30 → 36px | Italic light, with Flower / Crown icon | `brand-charcoal`, icons `brand-rose` |
| Descriptions | Inter | 14 → 16px | Light | `brand-charcoal/90` |
| Bullet rows | Inter | 14px | Light, hairline dividers | `brand-olive`, dots `brand-rose` |
| Photo captions | Fraunces | 14px | Italic | `brand-olive` |

## 4 · Footer

**Background:** transparent over `brand-cream`, with a `brand-rose/10` top rule.

| Element | Font | Size | Weight / treatment | Colour |
|---|---|---|---|---|
| Copyright line | Inter | 12px | Uppercase, `widest` tracking | `brand-charcoal/50` |
| "Designed with love…" | Inter | 10px | `widest` tracking | `brand-olive` |
| "Guest Register" (admin link) | Inter | 10px | Semibold, uppercase, `widest` tracking | `brand-charcoal/30`, `brand-rose` on hover |

## 5 · Reply form (modal)

**Background:** `brand-cream` card, `brand-rose/20` border, gold→rose→olive gradient bar along the top. Backdrop is `brand-charcoal/40` blurred.

| Element | Font | Size | Weight / treatment | Colour |
|---|---|---|---|---|
| "Your Reply" | Fraunces | 24 → 30px | Regular, `wide` tracking | `brand-charcoal` |
| "Let us know you're coming" | Inter | 12px | Uppercase, `widest` tracking | `brand-olive` |
| Field labels | Inter | 12px | Semibold, uppercase, `wider` tracking, `brand-rose` icon | `brand-charcoal/75` |
| Inputs | Inter | 14px | White fill, `brand-rose/25` border, rounded | `brand-charcoal` |
| Placeholders | Inter | 14px | — | `brand-charcoal/30` |
| Choice buttons (attend / diet) | Inter | 14px | Medium; selected = `brand-rose` border on `brand-rose/10` | `brand-charcoal` |
| Submit button | Inter | 14px | Medium, uppercase, `widest` tracking | `brand-cream` on `brand-charcoal` |
| Error message | Inter | 12px | Centred | `rose-500` on `rose-50` |

## 6 · Thank-you note (after submitting)

**Background:** `brand-cream` card with a `brand-gold/40` border and the top
gradient bar. The `See you soon.png` artwork is an opaque white PNG, so it is
composited with `mix-blend-multiply` — that drops the white block and leaves only
the blue linework on the sand card.

| Element | Font | Size | Weight / treatment | Colour |
|---|---|---|---|---|
| Illustration | — | Full card width | `mix-blend-multiply` | artwork blue `#033E8D` |
| "Submitted!" | Fraunces | 24 → 30px | Regular, `wide` tracking | `brand-charcoal` |
| Body message | Inter | 14px | Guest name in semibold `brand-accent` | `brand-charcoal/75` |
| "We can't wait to see you!" | Inter | 11px | Semibold, uppercase, `0.18em` tracking, heart icon | `brand-olive`, heart `brand-rose` |
| Close button | Inter | 12 → 14px | Semibold, uppercase, `0.25em` tracking | `brand-cream` on `brand-accent`, pill |

## 7 · "Your reply" card

Replaces the reply button once the guest has answered. It now lands on two
different grounds, so it ships in two tones (`tone="light" | "dark"`, the map at
the top of `RSVPSummary.tsx`) rather than assuming a dark one. The same two tones
serve `NeedInvite`, the card shown to a visitor with no valid `?g=` code. There is
no in-app edit; guests who need to change something message the couple on WhatsApp.

- **light** — the hero's sand column. White fill, `brand-rose/25` border, left-aligned.
- **dark** — the charcoal reply band in Details. `black/40` blurred fill, `brand-gold/40` border, centred.

| Element | Font | Size | Light (sand) | Dark (charcoal / photo) |
|---|---|---|---|---|
| Status line | Inter | 11px, semibold, `0.18em` | `brand-charcoal`; badge `brand-accent` / `brand-charcoal/15` | `brand-cream`; badge `brand-gold` / `brand-cream/25` |
| Guest name | Fraunces | 18px | `brand-charcoal` | `brand-cream` |
| Party size · meal | Inter | 12px, tabular | `brand-olive` | `brand-cream/70` |
| "Need to change something?" | Inter | 10px, uppercase | `brand-olive` | `brand-cream/60` |
| WhatsApp pills | Inter | 11px, semibold | `brand-rose/30` border, `brand-charcoal` label | `brand-gold/40` border, `brand-cream` label |

The WhatsApp glyph stays brand green `#25D366` in both tones.

## 8 · Admin dashboard (`#admin`)

**Background:** `brand-blush/50`; cards are white with `brand-rose/15` borders.

| Element | Font | Size | Weight / treatment | Colour |
|---|---|---|---|---|
| PIN screen heading | Fraunces | 24px | Regular, `wide` tracking | `brand-charcoal` |
| Dashboard title | Fraunces | 30 → 36px | Regular, `wide` tracking | `brand-charcoal` |
| Stat card labels | Inter | 12px | Semibold, uppercase, `wider` tracking | `brand-olive` |
| Stat card values | Fraunces | 24 → 30px | Semibold, tabular figures | `brand-charcoal` |
| Stat sub-lines | Inter | 11px | — | `brand-charcoal/60` |
| Table header row | Inter | 12px | Semibold, uppercase, `wider` tracking, `brand-blush/50` fill | `brand-olive` |
| Table cells | Inter | 14px | — | `brand-charcoal` |
| Timestamps | Inter | 12px | — | `brand-charcoal/60` |
| Phone numbers | Mono | 12px | — | `brand-charcoal` |
| Action buttons | Inter | 12px | Semibold, uppercase, `wider` tracking | white on `brand-charcoal`, `brand-accent` on hover |
| Back / secondary links | Inter | 12px | Semibold, uppercase, `wider` tracking | `brand-accent` |

---

## Accessibility notes

- `brand-gold` is decorative only. It is never used for text — frames, rules,
  corner accents and stardust are all it carries.
- `brand-rose` clears the 3:1 bar for icons and non-text graphics but not for
  body copy; small text uses `brand-accent`, `brand-charcoal` or `brand-olive`.
- Everything honours `prefers-reduced-motion`: the stardust drift, the entrance
  animations and smooth scrolling all stop.
- No type is set over a photograph anywhere on the page. The hero splits them
  apart, so every string sits on a flat brand ground at a known contrast ratio
  and no photo can ever wash the type out. The `.text-shadow-*` helpers in
  `src/index.css` are now unused by the hero and kept only for the Details band.

## 9 · Dashboard duplicate warnings

Because a guest cannot edit a reply in the app, a repeat submission from a
second device lands as a new row. Rows sharing a name or phone number with
another row are flagged.

| Element | Font | Size | Weight / treatment | Colour |
|---|---|---|---|---|
| Row warning icon | — | 16px | Triangle glyph, hover tooltip explains the match | `amber-600` |
| Headcount warning line | Inter | 11px | Semibold, with triangle glyph | `amber-700` |

Amber is deliberately outside the wedding palette — it reads as a system
warning to the couple, not as part of the invitation's colour language.
