import { useState, useEffect, type SVGProps } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight, Users, HeartHandshake, UtensilsCrossed, PartyPopper } from "lucide-react";
import { track } from "@vercel/analytics";
import { translations } from "../translations";
import CalendarButton from "./CalendarButton";
import { onTimelineSnapshot } from "../firebase";
import { TimelineItem, RSVPFormData } from "../types";
import RSVPSummary, { NeedInvite } from "./RSVPSummary";

// ponytail: cycled by index rather than matched to each label's meaning — holds up for any timeline length
const TIMELINE_ICONS = [Users, HeartHandshake, UtensilsCrossed, PartyPopper];

// One spray, drawn for the top-left, then flipped into the other three. Mirroring
// costs a transform; four hand-drawn corners would cost four sets of path data.
const CORNERS = [
  "-top-1 -left-1",
  "-top-1 -right-1 -scale-x-100",
  "-bottom-1 -left-1 -scale-y-100",
  "-bottom-1 -right-1 -scale-100",
];

// Leaves and blooms are each drawn once in <defs> and stamped with <use>, so the
// arrangement below is just a placement table — nudge a number to move a leaf.
// [x, y, rotation, scale]
const LEAVES: [number, number, number, number][] = [
  [18, 8, -50, 0.5], [21, 10, 40, 0.45],
  [34, 11, -38, 0.6], [37, 14, 48, 0.52],
  [53, 18, -25, 0.58], [56, 21, 58, 0.5],
  [70, 24, -14, 0.46],
  // The left-edge stem is the top stem mirrored across the diagonal: swap x/y and
  // take 90° minus the angle.
  [8, 18, 140, 0.5], [10, 21, 50, 0.45],
  [11, 34, 128, 0.6], [14, 37, 42, 0.52],
  [18, 53, 115, 0.58], [21, 56, 32, 0.5],
  [24, 70, 104, 0.46],
];

// Sparse and small on purpose: the reference card is mostly foliage, with blooms
// as punctuation. Scaling these up is what makes it read as clip art.
const BLOOMS: [number, number, number][] = [
  [16, 16, 0.78], [45, 15, 0.66], [15, 45, 0.66], [72, 26, 0.48], [26, 72, 0.48],
];

function FloralCorner({ className }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none">
      <defs>
        <path id="petal-leaf" d="M0,0 C5,-6 15,-7 22,0 C15,7 5,6 0,0 Z" />
        <g id="petal-bloom">
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx="4.6" cy="0" rx="3.4" ry="2.1" transform={`rotate(${a})`} />
          ))}
          <circle r="1.9" className="fill-brand-rose/70" />
        </g>
      </defs>

      {/* Two stems curving away from the corner, one along each edge */}
      <g className="stroke-brand-gold/70" strokeWidth="1.1" strokeLinecap="round">
        <path d="M4,10 C30,4 55,10 78,26" />
        <path d="M10,4 C4,30 10,55 26,78" />
      </g>

      <g className="fill-brand-olive/40">
        {LEAVES.map(([x, y, r, s]) => (
          <use key={`${x}-${y}`} href="#petal-leaf" transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} />
        ))}
      </g>

      <g className="fill-brand-gold/75">
        {BLOOMS.map(([x, y, s]) => (
          <use key={`${x}-${y}`} href="#petal-bloom" transform={`translate(${x} ${y}) scale(${s})`} />
        ))}
      </g>
    </svg>
  );
}

const CAROUSEL_PHOTOS = [
  {
    url: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
    titleEn: "Villa di Maiano Table Setting",
    titleCn: "迈亚诺别墅户外晚宴宴会席区",
    locationEn: "Florence, Italy",
    locationCn: "佛罗伦萨，意大利"
  },
  {
    url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop",
    titleEn: "Tuscan Sun-Drenched Hills",
    titleCn: "托斯卡纳艳阳下的山陵风光",
    locationEn: "Tuscany, Italy",
    locationCn: "托斯卡纳，意大利"
  },
  {
    url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop",
    titleEn: "Romantic Celebration Avenue",
    titleCn: "浪漫至极的户外典礼通道",
    locationEn: "Fiesole Hills, Italy",
    locationCn: "菲耶索莱山脉，意大利"
  },
  {
    url: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?q=80&w=1200&auto=format&fit=crop",
    titleEn: "Sunset Wedding Vignette",
    titleCn: "日落余晖中的绝美庄园剪影",
    locationEn: "Florence, Italy",
    locationCn: "佛罗伦萨，意大利"
  }
];

interface DetailsSectionProps {
  onAttendClick: () => void;
  lang: "en" | "cn";
  myRSVP: RSVPFormData | null;
  /** False when the visitor has no valid invite code, so there is nothing to reply to. */
  canRSVP: boolean;
}

export default function DetailsSection({ onAttendClick, lang, myRSVP, canRSVP }: DetailsSectionProps) {
  const t = translations[lang].details;
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [isLandscapeOpen, setIsLandscapeOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhotoIndex((prev) => (prev + 1) % CAROUSEL_PHOTOS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Realtime sync for timeline items — falls back to the static translations
    // below when Firestore has no schedule set yet (see `programmaRows`)
    const unsubscribe = onTimelineSnapshot((items) => {
      setTimelineItems(items);
    });

    return () => unsubscribe();
  }, []);

  // Fallback rows when Firestore is unreachable — split "04:00 PM — Welcoming & Drinks"
  const fallbackRows = [t.cards.when.item1, t.cards.when.item2, t.cards.when.item3, t.cards.when.item4]
    .map((s, i) => {
      const [time, ...rest] = s.split(" — ");
      return { id: `fallback-${i}`, time, text: rest.join(" — ") };
    });

  const programmaRows =
    timelineItems.length > 0
      ? timelineItems.map((item) => ({
          id: item.id,
          time: lang === "cn" ? item.timeCn : item.timeEn,
          text: lang === "cn" ? item.textCn : item.textEn,
        }))
      : fallbackRows;

  const currentPhoto = CAROUSEL_PHOTOS[photoIndex];
  const photoTitle = lang === "cn" ? currentPhoto.titleCn : currentPhoto.titleEn;
  const photoLocation = lang === "cn" ? currentPhoto.locationCn : currentPhoto.locationEn;

  return (
    <section id="details" className="relative w-full px-6 sm:px-10 pt-12 sm:pt-16 pb-24 sm:pb-32">
      {/* Double gold rule with a botanical spray in each corner, as on the printed
          card. Drawn, not photographed — so it recolours with the tokens and stays
          crisp at any size. */}
      <div className="absolute inset-3 sm:inset-6 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 border border-brand-gold/60" />
        <div className="absolute inset-2 border border-brand-gold/35" />
        {CORNERS.map((corner) => (
          <FloralCorner key={corner} className={`absolute w-20 sm:w-32 ${corner}`} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="max-w-5xl mx-auto"
      >
        {/* Editorial section heading */}
        <div className="mb-8 sm:mb-10">
          <span className="text-[11px] sm:text-xs tracking-[0.35em] text-brand-accent uppercase font-sans font-semibold">
            {t.joinCelebration}
          </span>
          {/* ponytail: clamp + nowrap keeps it one row from 320px up, no breakpoint ladder */}
          <h2 className="font-serif italic font-light whitespace-nowrap text-[clamp(1.75rem,8vw,3.75rem)] text-brand-charcoal mt-4">
            {t.title}
          </h2>
        </div>

        {/* Programma / Venue spread */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-0 mb-20 sm:mb-24">
          {/* Programma — the day as a sequence */}
          <div className="md:pr-14 md:border-r md:border-brand-charcoal/15">
            <h3 className="text-[11px] font-sans font-semibold tracking-[0.3em] uppercase text-brand-olive mb-2">
              {t.cards.when.timelineLabel}
            </h3>
            <p className="font-serif text-2xl sm:text-3xl text-brand-charcoal mb-8">
              {t.cards.when.dateVal}
            </p>

            <ol className="flex items-start">
              {programmaRows.map((row, i) => {
                const Icon = TIMELINE_ICONS[i % TIMELINE_ICONS.length];
                return (
                  <li key={row.id} className="flex-1 flex flex-col items-center text-center px-1">
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-brand-olive mb-4" strokeWidth={1.25} />

                    <div className="w-full flex items-center">
                      <div className={`flex-1 h-px ${i === 0 ? "opacity-0" : "bg-brand-charcoal/20"}`} />
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-rose shrink-0 mx-1" />
                      <div
                        className={`flex-1 h-px ${
                          i === programmaRows.length - 1 ? "opacity-0" : "bg-brand-charcoal/20"
                        }`}
                      />
                    </div>

                    <span className="mt-5 font-serif text-base sm:text-lg text-brand-accent tabular-nums">
                      {row.time}
                    </span>
                    <span className="mt-1 font-sans text-[11px] sm:text-xs font-light text-brand-charcoal/80 leading-snug">
                      {row.text}
                    </span>
                  </li>
                );
              })}
            </ol>

            <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
              <CalendarButton lang={lang} />
              <span className="text-xs font-light text-brand-olive leading-relaxed">
                {lang === "cn" ? "将流程详情保存到您的个人日历" : "Save the day to your personal calendar"}
              </span>
            </div>
          </div>

          {/* Venue */}
          <div className="md:pl-14">
            <h3 className="text-[11px] font-sans font-semibold tracking-[0.3em] uppercase text-brand-olive mb-2">
              {t.cards.where.venueLabel}
            </h3>
            <p className="font-serif text-2xl sm:text-3xl text-brand-charcoal mb-3">
              {t.cards.where.venueVal}
            </p>

            <div>
              <p className="font-sans text-sm sm:text-base font-light text-brand-charcoal/90 leading-relaxed">
                20, Jalan Kampung, Imbi,<br />
                55100 Kuala Lumpur,<br />
                Wilayah Persekutuan Kuala Lumpur
              </p>

              <div className="mt-8 flex flex-col items-start gap-3">
                <a
                  href="https://maps.google.com/?q=Chuai+Heng+Banquet+Hall+Kuala+Lumpur"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("Directions Opened", { provider: "Google Maps" })}
                  className="text-xs font-sans font-semibold tracking-[0.2em] text-brand-accent hover:text-brand-charcoal uppercase transition-colors border-b border-brand-rose/40 pb-1"
                >
                  {t.cards.where.mapLink}
                </a>
                <a
                  href="waze://?h=w283fssu6&n=T&utm_source=waze_website&utm_medium=web-livemap-mobile-openapp-location&utm_campaign=default"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("Directions Opened", { provider: "Waze" })}
                  className="text-xs font-sans font-semibold tracking-[0.2em] text-brand-accent hover:text-brand-charcoal uppercase transition-colors border-b border-brand-rose/40 pb-1"
                >
                  {t.cards.where.wazeLink}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Postcard from the venue
        <motion.figure
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-20 sm:mb-24"
        >
          <button
            onClick={() => setIsLandscapeOpen(true)}
            className="block w-full rounded-2xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-rose focus:ring-offset-4 focus:ring-offset-brand-cream"
            aria-label={photoTitle}
          >
            <div className="relative overflow-hidden rounded-2xl aspect-[16/10] sm:aspect-[21/9] bg-brand-blush">
              <AnimatePresence mode="popLayout">
                <motion.img
                  key={photoIndex}
                  src={currentPhoto.url}
                  alt={photoTitle}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>
            </div>
          </button>
          <figcaption className="mt-4 flex items-baseline justify-between gap-4">
            <span className="font-serif italic text-sm sm:text-base text-brand-charcoal/80">
              {photoTitle} — {photoLocation}
            </span>
            <span className="flex gap-1.5 shrink-0">
              {CAROUSEL_PHOTOS.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    idx === photoIndex ? "w-5 bg-brand-rose" : "w-1.5 bg-brand-charcoal/20"
                  }`}
                />
              ))}
            </span>
          </figcaption>
        </motion.figure> */}

        {/* RSVP band */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="bg-brand-charcoal text-brand-cream px-8 py-14 sm:px-14 sm:py-16 text-center rounded-3xl"
        >
          <p className="font-serif italic font-light text-2xl sm:text-3xl leading-snug max-w-xl mx-auto">
            {t.byDate}
          </p>
          {myRSVP ? (
            <div className="mt-8 flex justify-center">
              <RSVPSummary rsvp={myRSVP} lang={lang} />
            </div>
          ) : !canRSVP ? (
            <div className="mt-8 flex justify-center">
              <NeedInvite lang={lang} />
            </div>
          ) : (
            <button
              id="attend-rsvp-trigger"
              onClick={onAttendClick}
              className="mt-8 px-10 py-4 bg-brand-accent text-brand-cream hover:bg-brand-cream hover:text-brand-charcoal transition-colors duration-300 font-sans font-semibold text-xs tracking-[0.25em] uppercase cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-brand-cream focus:ring-offset-2 focus:ring-offset-brand-charcoal"
            >
              {t.attendBtn}
            </button>
          )}
        </motion.div>
      </motion.div>

      {/* Full screen photo overlay
      <AnimatePresence>
        {isLandscapeOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-brand-charcoal/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative w-full max-w-4xl"
            >
              <button
                onClick={() => setIsLandscapeOpen(false)}
                className="absolute -top-10 right-0 z-10 p-2 text-brand-cream/70 hover:text-brand-cream transition-colors cursor-pointer"
                aria-label="Close photo"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="relative overflow-hidden rounded-2xl bg-black flex items-center justify-center max-h-[85vh]">
                <AnimatePresence mode="popLayout">
                  <motion.img
                    key={photoIndex}
                    src={currentPhoto.url}
                    alt={photoTitle}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="w-full max-h-[85vh] object-contain"
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPhotoIndex((prev) => (prev - 1 + CAROUSEL_PHOTOS.length) % CAROUSEL_PHOTOS.length);
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 bg-black/40 hover:bg-black/60 text-white transition-colors rounded-full cursor-pointer"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPhotoIndex((prev) => (prev + 1) % CAROUSEL_PHOTOS.length);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 bg-black/40 hover:bg-black/60 text-white transition-colors rounded-full cursor-pointer"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 flex items-baseline justify-between gap-4 text-brand-cream">
                <p className="font-serif italic text-base sm:text-lg">
                  {photoTitle} — {photoLocation}
                </p>
                <span className="flex gap-2 shrink-0">
                  {CAROUSEL_PHOTOS.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPhotoIndex(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === photoIndex ? "w-6 bg-brand-cream" : "w-2 bg-brand-cream/40 hover:bg-brand-cream/70"
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence> */}
    </section>
  );
}
