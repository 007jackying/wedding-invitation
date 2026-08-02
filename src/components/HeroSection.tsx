import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { translations } from "../translations";
import CountdownTimer from "./CountdownTimer";
import BackgroundSlideshow from "./BackgroundSlideshow";
import Stardust from "./Stardust";
import RSVPSummary from "./RSVPSummary";
import { RSVPFormData } from "../types";

interface HeroSectionProps {
  lang: "en" | "cn";
  myRSVP: RSVPFormData | null;
  onAttendClick: () => void;
}

// L-shaped gold marks that finish each corner of the frame; the radius has to
// match the frame's own rounding or the marks sit off the curve.
const FRAME_CORNERS = [
  "top-0 left-0 border-t-2 border-l-2 rounded-tl-3xl",
  "top-0 right-0 border-t-2 border-r-2 rounded-tr-3xl",
  "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-3xl",
  "bottom-0 right-0 border-b-2 border-r-2 rounded-br-3xl",
];

export default function HeroSection({ lang, myRSVP, onAttendClick }: HeroSectionProps) {
  const t = translations[lang].hero;
  const tRsvp = translations[lang].rsvp;

  const scrollToNext = () => {
    const nextSection = document.getElementById("details");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      /* min-h rather than a fixed h: the reply summary card is taller than the
         button it replaces, and a locked height clips it on short viewports. */
      className="relative min-h-[100svh] w-full flex flex-col overflow-hidden"
    >
      <BackgroundSlideshow />
      <Stardust />

      {/* Framed photo area. The ticket band below sits outside the frame so the
          gold rule never cuts across it. */}
      <div className="relative flex-1 flex flex-col min-h-0">
        {/* Luxury double-border frame with ornate gold corner accents */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.2, ease: "easeOut" }}
          className="pointer-events-none absolute inset-4 sm:inset-7 z-10 border border-brand-gold/45 rounded-3xl"
          aria-hidden="true"
        >
          <div className="absolute inset-[5px] border border-brand-gold/25 rounded-[1.35rem]" />
          {FRAME_CORNERS.map((position) => (
            <span
              key={position}
              className={`absolute w-6 h-6 sm:w-9 sm:h-9 border-brand-gold ${position}`}
            />
          ))}
        </motion.div>

      {/* Staggered letterpress name composition */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center w-full max-w-6xl mx-auto px-8 sm:px-14 min-h-0">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="text-brand-cream/90 font-sans font-semibold uppercase tracking-[0.35em] text-[11px] sm:text-sm mb-4 text-shadow-md"
        >
          {t.weAreMarried}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, delay: 0.7, ease: "easeOut" }}
          className="font-script font-normal text-brand-cream text-[clamp(4rem,14vw,9rem)] leading-[0.85] text-shadow-strong"
        >
          <span className="block">Eva</span>
          {/* Own line so both names centre on the same axis */}
          <span className="block font-serif italic font-light text-[0.3em] leading-[1.5] text-brand-blush/90">
            {lang === "cn" ? "与" : "&"}
          </span>
          <span className="block">Vincent</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.4 }}
          className="mt-6 font-serif italic text-brand-cream/85 text-lg sm:text-2xl tracking-wide text-shadow-md"
        >
          {t.saveDate}
        </motion.p>

        {/* Date, venue & countdown sit with the save-the-date line rather than
            in a separate band at the foot of the hero. */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.7, ease: "easeOut" }}
          className="mt-5 flex flex-col items-center gap-3"
        >
          <div className="w-16 h-px bg-brand-gold/80" />
          <p className="text-brand-cream font-sans font-medium tracking-[0.15em] sm:tracking-[0.25em] uppercase text-xs sm:text-sm text-shadow-sm max-w-full">
            {t.datePlace}
          </p>
          <CountdownTimer lang={lang} />

          {myRSVP ? (
            <RSVPSummary rsvp={myRSVP} lang={lang} />
          ) : (
            <button
              type="button"
              onClick={onAttendClick}
              className="mt-1 px-8 py-3.5 bg-brand-accent text-brand-cream hover:bg-brand-cream hover:text-brand-charcoal transition-colors duration-300 font-sans font-semibold text-xs sm:text-sm tracking-[0.25em] uppercase cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 focus:ring-offset-black/40"
            >
              {tRsvp.accept}
            </button>
          )}
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.button
        id="scroll-arrow"
        onClick={scrollToNext}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="relative z-10 self-center mb-4 px-4 py-2 flex flex-col items-center gap-1 text-brand-cream/80 hover:text-brand-cream transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-cream/60 rounded-full"
        aria-label="Scroll to event details"
      >
        <span className="font-sans font-semibold text-[11px] tracking-[0.25em] uppercase text-shadow-sm">
          {t.scrollText}
        </span>
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </motion.button>
      </div>
    </section>
  );
}
