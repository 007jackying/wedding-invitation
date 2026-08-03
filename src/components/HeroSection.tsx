import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { track } from "@vercel/analytics";
import { translations } from "../translations";
import CountdownTimer, { TARGET_DATE } from "./CountdownTimer";
import BackgroundSlideshow from "./BackgroundSlideshow";
import RSVPSummary, { NeedInvite } from "./RSVPSummary";
import { RSVPFormData } from "../types";

interface HeroSectionProps {
  lang: "en" | "cn";
  myRSVP: RSVPFormData | null;
  /** False when the visitor has no valid invite code, so there is nothing to reply to. */
  canRSVP: boolean;
  onAttendClick: () => void;
}

// The date, split into parts for the numeral lockup. Formatted in Kuala Lumpur
// time so a guest reading from another timezone still sees the wedding day
// rather than their own local rollover, and derived from the countdown's target
// so there is one date in the codebase, not two.
const [DD, MM, YYYY] = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kuala_Lumpur",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
})
  .format(new Date(TARGET_DATE))
  .split("/");

// Entrance: one settling sequence, not an effect per element.
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export default function HeroSection({ lang, myRSVP, canRSVP, onAttendClick }: HeroSectionProps) {
  const t = translations[lang].hero;
  const tRsvp = translations[lang].rsvp;

  // Day-first reads as the date in Malaysia; Chinese convention runs year-first.
  const dateParts = lang === "cn" ? [YYYY, MM, DD] : [DD, MM, YYYY];

  // The venue half of "January 2, 2027 • Chuai Heng Banquet Hall, Kuala Lumpur" —
  // the date half is the numeral lockup above it. If the copy ever loses its
  // bullet, pop() hands back the whole string, which still reads correctly.
  // Hall and city are set on their own lines so the break never lands inside
  // the venue's name; a venue with no comma just renders as one line.
  const [venueName, ...venueRest] = t.datePlace.split("•").pop()!.trim().split(",");
  const venueCity = venueRest.join(",").trim();

  const scrollToNext = () => {
    track("Hero Scroll Clicked");
    document.getElementById("details")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative w-full flex flex-col lg:flex-row lg:min-h-[100svh]">
      {/* The photograph, mounted on the sand rather than bled behind the type.
          Held at its native 3:2 so nothing is cropped away — the couple, the car
          and the drape all survive at every width. */}
      <div className="relative w-full aspect-[3/2] overflow-hidden lg:order-2 lg:w-[54%] lg:self-center">
        <BackgroundSlideshow lang={lang} />
      </div>

      {/* Type block on the sand ground. Left-aligned with a hard rag: this is the
          card stock the photograph sits on, not a caption under a picture. */}
      <div className="relative flex flex-col justify-center lg:order-1 lg:w-[46%] px-6 sm:px-10 lg:px-12 xl:px-16 py-12 sm:py-14 lg:py-10">
        <motion.p
          {...rise(0.15)}
          className="font-sans font-semibold uppercase tracking-[0.35em] text-[11px] sm:text-xs text-brand-accent"
        >
          {t.weAreMarried}
        </motion.p>

        {/* The connector trails the first name so both names hang off the same
            left axis — an indented second line reads as a mistake, not a lockup. */}
        <motion.h1
          {...rise(0.3)}
          className="mt-4 font-script font-normal text-brand-charcoal text-[clamp(4.25rem,10vw,6.25rem)] leading-[0.86]"
        >
          <span className="block">
            Eva
            <span className="font-serif not-italic font-light text-[0.34em] text-brand-accent ml-[0.18em] align-[0.32em]">
              {lang === "cn" ? "与" : "&"}
            </span>
          </span>
          <span className="block">Vincent</span>
        </motion.h1>

        <motion.p
          {...rise(0.45)}
          className="mt-4 font-serif italic text-brand-olive text-lg sm:text-xl"
        >
          {t.saveDate}
        </motion.p>

        {/* The particulars. The numerals are the loudest thing in the block on
            purpose — the script says who, these say when. */}
        <motion.div {...rise(0.6)} className="mt-6">
          <div className="w-14 h-px bg-brand-gold" />
          <p className="mt-4 font-serif text-brand-charcoal tabular-nums text-3xl sm:text-4xl lg:text-[2.5rem] leading-none tracking-[0.06em]">
            {dateParts.map((part, i) => (
              <span key={i}>
                {i > 0 && <span className="text-brand-rose mx-2 sm:mx-2.5">·</span>}
                {part}
              </span>
            ))}
          </p>
          <p className="mt-4 font-sans font-semibold uppercase tracking-[0.2em] text-[11px] sm:text-xs text-brand-olive leading-[1.7]">
            {venueName}
            {venueCity && (
              <>
                <br />
                {venueCity}
              </>
            )}
          </p>
        </motion.div>

        <motion.div {...rise(0.75)} className="mt-6">
          <CountdownTimer lang={lang} tone="light" />

          <div className="mt-6">
            {myRSVP ? (
              <RSVPSummary rsvp={myRSVP} lang={lang} tone="light" />
            ) : !canRSVP ? (
              <NeedInvite lang={lang} tone="light" />
            ) : (
              <button
                type="button"
                onClick={onAttendClick}
                className="px-9 py-4 bg-brand-accent text-brand-cream hover:bg-brand-charcoal transition-colors duration-300 font-sans font-semibold text-xs sm:text-sm tracking-[0.25em] uppercase cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-cream"
              >
                {tRsvp.accept}
              </button>
            )}
          </div>
        </motion.div>

        <motion.button
          id="scroll-arrow"
          {...rise(1)}
          onClick={scrollToNext}
          className="mt-7 -ml-2 self-start flex items-center gap-2 px-2 py-2 text-brand-olive hover:text-brand-accent transition-colors cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-brand-accent"
          aria-label="Scroll to event details"
        >
          <span className="font-sans font-semibold text-[11px] tracking-[0.25em] uppercase">
            {t.scrollText}
          </span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </motion.button>
      </div>
    </section>
  );
}
