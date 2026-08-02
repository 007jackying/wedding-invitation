import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { translations } from "../translations";
import CountdownTimer from "./CountdownTimer";
import BackgroundSlideshow from "./BackgroundSlideshow";

interface HeroSectionProps {
  lang: "en" | "cn";
}

export default function HeroSection({ lang }: HeroSectionProps) {
  const t = translations[lang].hero;

  const scrollToNext = () => {
    const nextSection = document.getElementById("details");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative h-[100svh] w-full flex flex-col overflow-hidden"
    >
      <BackgroundSlideshow />

      {/* Staggered letterpress name composition */}
      <div className="relative z-10 flex-1 flex flex-col justify-center w-full max-w-6xl mx-auto px-8 sm:px-14">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="text-brand-cream/90 font-sans font-semibold uppercase tracking-[0.35em] text-[11px] sm:text-xs mb-6 text-shadow-md"
        >
          {t.weAreMarried}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, delay: 0.7, ease: "easeOut" }}
          className="font-script font-normal text-brand-cream text-[clamp(4.5rem,17vw,11rem)] leading-[0.85] text-shadow-strong"
        >
          <span className="block">Eva</span>
          <span className="block pl-[10%] sm:pl-[18%]">
            <span className="font-serif italic font-light text-[0.5em] text-brand-blush/90 mr-4 sm:mr-6 align-middle">
              {lang === "cn" ? "与" : "&"}
            </span>
            Vincent
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.4 }}
          className="mt-8 font-serif italic text-brand-cream/85 text-lg sm:text-xl tracking-wide text-shadow-md"
        >
          {t.saveDate}
        </motion.p>
      </div>

      {/* Scroll cue */}
      <motion.button
        id="scroll-arrow"
        onClick={scrollToNext}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="relative z-10 self-center mb-4 p-2 text-brand-cream/80 hover:text-brand-cream transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-cream/60 rounded-full"
        aria-label="Scroll to event details"
      >
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </motion.button>

      {/* Ticket band: date · venue · countdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.6, ease: "easeOut" }}
        className="relative z-10 border-t border-brand-cream/25 bg-black/30 backdrop-blur-sm"
      >
        <div className="max-w-6xl mx-auto px-8 sm:px-14 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-brand-cream font-sans font-medium tracking-[0.25em] uppercase text-[11px] sm:text-xs text-shadow-sm">
            {t.datePlace}
          </p>
          <CountdownTimer lang={lang} />
        </div>
      </motion.div>
    </section>
  );
}
