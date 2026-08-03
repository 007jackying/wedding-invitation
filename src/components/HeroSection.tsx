import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { track } from "@vercel/analytics";
import { translations } from "../translations";
import CountdownTimer from "./CountdownTimer";
import BackgroundSlideshow from "./BackgroundSlideshow";
import Stardust from "./Stardust";
import RSVPSummary, { NeedInvite } from "./RSVPSummary";
import { RSVPFormData } from "../types";

interface HeroSectionProps {
  lang: "en" | "cn";
  myRSVP: RSVPFormData | null;
  /** False when the visitor has no valid invite code, so there is nothing to reply to. */
  canRSVP: boolean;
  onAttendClick: () => void;
}

export default function HeroSection({ lang, myRSVP, canRSVP, onAttendClick }: HeroSectionProps) {
  const t = translations[lang].hero;
  const tRsvp = translations[lang].rsvp;

  const scrollToNext = () => {
    track("Hero Scroll Clicked");
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

      <div className="relative flex-1 flex flex-col min-h-0">
      {/* Staggered letterpress name composition */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center w-full max-w-6xl mx-auto px-8 sm:px-14 min-h-0">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: -240 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="text-brand-cream/90 font-script font-light tracking-[0.3em] text-[25px] sm:text-[60px] mb-10 text-shadow-md"
        >
          {t.weAreMarried}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: -250 }}
          transition={{ duration: 1.3, delay: 0.7, ease: "easeOut" }}
          className="font-script font-normal text-brand-cream text-[clamp(4rem,14vw,9rem)] leading-[0.85] text-shadow-medium"
        >
          <span className="block">Vincent {lang === "cn" ? "囍" : "&"} Eva </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 230 }}
          transition={{ duration: 1.2, delay: 1.4 }}
          className="mt-6 font-serif italic text-brand-cream/85 text-lg sm:text-2xl tracking-wide text-shadow-strong"
        >
          {t.saveDate}
        </motion.p>

        {/* Date, venue & countdown sit with the save-the-date line rather than
            in a separate band at the foot of the hero. */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 230 }}
          transition={{ duration: 1, delay: 1.7, ease: "easeOut" }}
          className="mt-5 flex flex-col items-center gap-3"
        >
          <div className="w-16 h-px bg-brand-gold/80" />
          <p className="text-brand-cream font-sans font-medium tracking-[0.15em] sm:tracking-[0.25em] uppercase text-xs sm:text-sm text-shadow-sm max-w-full">
            {t.datePlace}
          </p>
          <CountdownTimer lang={lang} />
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
