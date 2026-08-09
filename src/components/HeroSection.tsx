import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { track } from "@vercel/analytics";
import { translations } from "../translations";
import CountdownTimer from "./CountdownTimer";
import BackgroundSlideshow from "./BackgroundSlideshow";
import Stardust from "./Stardust";
import { RSVPFormData } from "../types";

interface HeroSectionProps {
  lang: "en" | "cn";
  myRSVP: RSVPFormData | null;
  /** False when the visitor has no valid invite code, so there is nothing to reply to. */
  canRSVP: boolean;
  onAttendClick: () => void;
}

// Both groups start converged near the middle of the frame and split outward to
// their resting bands. Offsets are in vh so the travel is a share of the screen,
// not a fixed distance — the same gesture on a phone and on a desktop.
const splitFrom = (offset: string) => ({
  hidden: { y: offset, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 1.7,
      ease: [0.16, 1, 0.3, 1] as const,
      delay: 0.25,
      delayChildren: 0.7,
      staggerChildren: 0.14,
    },
  },
});

const RISE_UP = splitFrom("34vh");
const SETTLE_DOWN = splitFrom("-28vh");

// Each line then resolves on its own beat, so the split reads as a sequence
// rather than two slabs moving.
const line = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: "easeOut" as const } },
};

export default function HeroSection({ lang }: HeroSectionProps) {
  const t = translations[lang].hero;
  const isCn = lang === "cn";

  const scrollToNext = () => {
    track("Hero Scroll Clicked");
    document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" });
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

      {/* Two bands pinned to fixed shares of the frame, measured against where the
          couple actually sit in the photo once object-position has stopped the
          crop drifting:
            0 – 24%   sky above their heads      → the names
            24 – 66%  their faces                → left empty on purpose
            66 – 100% chest height down          → the date and countdown
          Absolute rather than flex ratios: a flex item cannot shrink below its
          own content, so a tall line box silently pushes the band past the face
          it was supposed to clear. Anchoring removes that failure mode, and the
          type is sized in svh as well as vw so it stays inside its band. */}
      <div className="absolute inset-0 z-10 text-center">
        {/* Bottom-aligned: the names sit just above the hairline, not floating. */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={RISE_UP}
          className="absolute inset-x-0 top-0 h-[24%] flex flex-col items-center justify-end px-gutter pb-[1svh]"
        >
          <motion.p
            variants={line}
            /* Alex Brush carries no CJK, so the Chinese eyebrow would drop to a
               system fallback mid-line. It takes the Noto Serif SC stack that
               the `cn` page wrapper already swaps in, at a size that matches the
               script optically rather than numerically. */
            className={
              isCn
                ? "text-brand-cream/90 font-serif font-light tracking-[0.25em] text-[clamp(1rem,min(3.4vw,4.5svh),2.5rem)] leading-none mb-[1.5svh] text-shadow-md"
                /* leading-none is doing real work: Alex Brush declares a line box
                   near 3× its point size, which otherwise makes this one line
                   taller than the whole band it sits in. */
                : "text-brand-cream/90 font-script font-light tracking-[0.3em] text-[clamp(1.25rem,min(4.5vw,6svh),3.5rem)] leading-none mb-[1svh] text-shadow-md"
            }
          >
            {t.weAreMarried}
          </motion.p>

          <motion.h1
            variants={line}
            /* Width AND height aware: on a short landscape phone a purely vw
               size would grow taller than the sky above their heads. */
            className="font-script font-normal text-brand-cream text-[clamp(2.75rem,min(15vw,16svh),9rem)] leading-[0.9] text-shadow-strong"
          >
            <span className="block">
              Vincent
              {/* Alex Brush ends "Vincent" on a trailing swash, so the connector
                  needs real air either side or the line reads as one word.
                  囍 is a CJK glyph inside a Latin script face: sized down and
                  nudged onto the script's optical centre so it sits with the
                  names instead of towering over them. */}
              <span
                className={
                  isCn
                    ? "font-serif text-[0.45em] align-[0.16em] ml-[0.3em] mr-[0.2em]"
                    : "mx-[0.2em]"
                }
              >
                {isCn ? "囍" : "&"}
              </span>
              Eva
            </span>
          </motion.h1>
        </motion.div>

        {/* 24% – 66% is their faces. Nothing is rendered there on purpose. */}

        <motion.div
          initial="hidden"
          animate="show"
          variants={SETTLE_DOWN}
          className="absolute inset-x-0 top-[66%] bottom-0 flex flex-col items-center gap-[1.2svh] px-gutter pt-[1svh]"
        >
          <motion.p
            variants={line}
            className="font-serif italic text-brand-cream/85 text-[clamp(1.0625rem,2.2vw,1.5rem)] tracking-wide text-shadow-strong"
          >
            {t.saveDate}
          </motion.p>
          <motion.div variants={line} className="w-16 h-px bg-brand-gold/80" />
          <motion.p
            variants={line}
            className="text-brand-cream font-sans font-medium tracking-[0.15em] sm:tracking-[0.25em] uppercase text-xs sm:text-sm text-shadow-sm max-w-full"
          >
            {t.datePlace}
          </motion.p>
          <motion.div variants={line}>
            <CountdownTimer lang={lang} />
          </motion.div>

          {/* mt-auto so the cue takes up whatever slack is left in the band. */}
          <motion.button
            id="scroll-arrow"
            onClick={scrollToNext}
            variants={line}
            className="mt-auto px-4 py-2 flex flex-col items-center gap-1 text-brand-cream/80 hover:text-brand-cream transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-cream/60 rounded-full"
            aria-label="Scroll to event details"
          >
            <span className="font-sans font-semibold text-[11px] tracking-[0.25em] uppercase text-shadow-sm">
              {t.scrollText}
            </span>
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
