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

**Background:** full-bleed photograph of the couple (`public/photos/first.jpeg`),
dimmed with `brightness-70` **on the image itself** rather than by a scrim
overlay — one class instead of two stacked divs. No frame, no gradient. All text
is `brand-cream` over it and leans on the `.text-shadow-*` helpers.

The slideshow machinery is still in place (8s cross-fade); it is simply holding a
single photo. Add more paths to `SLIDESHOW_IMAGES` and it cycles again.

### Text is anchored to the couple, not to the viewport

This is the one rule to preserve when editing this section. `object-cover`
re-crops as the viewport ratio changes, which slides the couple up and down
inside the frame — so text placed at a fixed offset drifts off them. Two things
hold it together:

1. **`object-position: 50% 30%`** on the image pins the crop. It holds their
   heads at ~25% of viewport height from a 390px phone to an ultrawide; without
   it that figure swings by about four points.
2. **The type sits in absolute bands** measured against that constant:

| Band | Contents |
|---|---|
| `0 – 24%` | Sky above their heads → eyebrow + names, bottom-aligned |
| `24 – 66%` | **Their faces — deliberately empty** |
| `66 – 100%` | Chest height down → save-the-date, date, countdown, scroll cue |

Measured at rest: names bottom **23%**, save-the-date top **67%**, scroll cue
bottom **100%**.

> **Do not rebuild these as flex ratios.** It was tried. A flex item cannot
> shrink below its own content, and Alex Brush declares a line box near 3× its
> point size, so the eyebrow alone claimed ~137px: the bands came out
> **265/143/285** instead of **166/319/208** and pushed the type over the faces
> it was meant to clear. `leading-none` on the eyebrow fixes the line box at the
> source, and every size below is `min(vw, svh)` so the type stays inside its
> band on a short landscape phone.

| Element | Font | Size | Weight / treatment | Colour |
|---|---|---|---|---|
| "We are married" eyebrow | **Alex Brush** | `clamp(20px, min(4.5vw, 6svh), 56px)` | Light, `0.3em` tracking, `leading-none` | `brand-cream/90` |
| 我们结婚了 eyebrow (CN) | **Noto Serif SC** | `clamp(16px, min(3.4vw, 4.5svh), 40px)` | Light, `0.25em` tracking, `leading-none` | `brand-cream/90` |
| **Vincent & Eva** | Alex Brush | `clamp(44px, min(15vw, 16svh), 144px)` | Regular, `0.9` line-height, one line | `brand-cream` |
| "&" connector | Alex Brush | inherits | `0.2em` margin either side — Alex Brush ends "Vincent" on a swash, and without the air the line reads as one word | `brand-cream` |
| 囍 connector (CN) | Noto Serif SC | `0.45em` of the names | Raised `0.16em`, `0.3em` left / `0.2em` right; a CJK glyph fills far more of its em box than a script capital, so it is sized optically | `brand-cream` |
| "Save our Date" | Fraunces | `clamp(17px, 2.2vw, 24px)` | Italic | `brand-cream/85` |
| Gold rule | — | 64 × 1px | — | `brand-gold/80` |
| Date + venue | Inter | 12 → 14px | Medium, uppercase, `0.15em → 0.25em` tracking | `brand-cream` |
| Countdown numbers | Fraunces | 20 → 30px | Tabular figures | `brand-cream` |
| Countdown labels | Inter | 9 → 12px | Semibold, uppercase, `0.2em` tracking | `brand-cream/70` |
| "Scroll" cue | Inter | 11px | Semibold, uppercase, `0.25em` tracking | `brand-cream/80` |

The hero carries **no reply control**. The RSVP button, the reply summary and the
"need a link" card all live in the Details band (§2) — the hero is the
photograph and the date, and the scroll cue is the handoff.

### Entrance

Both bands start converged near the middle of the frame and split outward to
their resting positions over ~1.7s, each line inside them resolving on its own
beat behind it. The travel is set in `vh` (`+34vh` down for the top band, `-28vh`
up for the bottom) so it is a share of the screen — the same gesture on a phone
and on a desktop, rather than a fixed distance that reads as a twitch on one and
a lurch on the other.

Because that is a screen-height slide, `main.tsx` wraps the app in
`<MotionConfig reducedMotion="user">`. The `prefers-reduced-motion` block in
`index.css` only reaches CSS animations; Motion drives its own in JS and ignored
the preference entirely without it. With it, the fades stay and the movement is
dropped.

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

Replaces the reply button once the guest has answered. It appears in one place —
the charcoal reply band in Details — so it has a single dark style: `black/40`
blurred fill with a `brand-gold/40` border. The same treatment serves
`NeedInvite`, the card shown to a visitor with no valid `?g=` code.

The answer is read from Firestore by invite code, not from this device, so a
guest sees it on any phone they open their link on. There is no in-app edit;
guests who need to change something message the couple on WhatsApp instead.

| Element | Font | Size | Weight / treatment | Colour |
|---|---|---|---|---|
| Status line | Inter | 11px | Semibold, uppercase, `0.18em` tracking | `brand-cream`; badge `brand-gold` (joining) or `brand-cream/25` (declined) |
| Guest name | Fraunces | 18px | Regular | `brand-cream` |
| Party size · meal | Inter | 12px | Tabular figures | `brand-cream/70` |
| "Need to change something?" | Inter | 10px | Uppercase, `0.15em` tracking | `brand-cream/60` |
| WhatsApp pills (Eva / Vincent) | Inter | 11px | Semibold, `0.1em` tracking, `brand-gold/40` rounded border | `brand-cream` label, glyph brand green `#25D366` |

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
- Everything honours `prefers-reduced-motion`. Two mechanisms are needed and both
  must stay: the `@media` block in `index.css` covers CSS animations (stardust
  drift, smooth scrolling), and `<MotionConfig reducedMotion="user">` in
  `main.tsx` covers Motion's JS-driven ones, including the hero's screen-height
  entrance. The CSS block alone does **not** reach Motion.
- Hero type sits on a photograph dimmed only by `brightness-70`, so legibility
  rests on that plus the `.text-shadow-sm / -md / -lg / -strong` helpers in
  `src/index.css`. **Any new hero photo has to be checked against the cream type
  before it goes in** — and against the band boundaries in §1, which are measured
  from where the couple sit in the current photo.

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
