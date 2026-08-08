import { motion } from "motion/react";
import { Heart } from "lucide-react";
import { translations } from "../translations";
import FloralFrame from "./FloralFrame";

interface DressCodeSectionProps {
  lang: "en" | "cn";
}

/** Label flanked by a hairline rule on each side, as on the card. */
function RuledLabel({ label, sublabel }: { label: string; sublabel: string }) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-3">
        <span className="h-px w-6 sm:w-10 bg-brand-gold/70" />
        <span className="text-[11px] font-sans font-semibold tracking-[0.3em] uppercase text-brand-olive">
          {label}
        </span>
        <span className="h-px w-6 sm:w-10 bg-brand-gold/70" />
      </div>
      <p className="mt-1.5 font-sans text-[11px] tracking-[0.2em] text-brand-olive">
        {sublabel}
      </p>
    </div>
  );
}

export default function DressCodeSection({ lang }: DressCodeSectionProps) {
  const t = translations[lang].dressCode;

  return (
    <section
      id="dress-code"
      className="relative w-full min-h-screen flex items-center px-gutter py-section bg-brand-blush/40"
    >
      <FloralFrame />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative max-w-3xl mx-auto w-full"
      >
        {/* Heading */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-10 sm:w-16 bg-brand-gold/70" />
            <Heart className="w-3.5 h-3.5 text-brand-gold" strokeWidth={1.5} aria-hidden="true" />
            <span className="h-px w-10 sm:w-16 bg-brand-gold/70" />
          </div>
          <h2 className="font-serif italic font-light whitespace-nowrap text-[clamp(1.75rem,8vw,3.75rem)] text-brand-charcoal mt-4">
            {t.title}
          </h2>
          <div className="flex items-center justify-center gap-4 mt-3">
            <span className="h-px w-8 sm:w-14 bg-brand-gold/60" />
            <p className="text-[11px] sm:text-xs tracking-[0.35em] text-brand-accent uppercase font-sans font-semibold whitespace-nowrap">
              {t.subtitle}
            </p>
            <span className="h-px w-8 sm:w-14 bg-brand-gold/60" />
          </div>
        </div>

        {/* Ladies | Gentlemen, over the illustration the two halves belong to */}
        <div className="mt-block grid grid-cols-2 gap-gutter">
          <RuledLabel label={t.ladies.label} sublabel={t.ladies.sublabel} />
          <RuledLabel label={t.gentlemen.label} sublabel={t.gentlemen.sublabel} />
        </div>
        <img
          src="/dresscode/dress.webp"
          alt={t.illustrationAlt}
          className="mt-4 w-full"
          loading="lazy"
          width={2000}
          height={955}
        />

        {/* Statement, held between two gold rules like the printed panel */}
        <p className="mt-band border-x border-brand-gold/50 bg-brand-cream/50 px-gutter py-block text-center font-serif italic font-light text-base sm:text-lg leading-relaxed text-brand-charcoal">
          {t.statement}
        </p>

        <div className="mt-band grid grid-cols-2 gap-gutter divide-x divide-brand-charcoal/15">
          {([t.ladies, t.gentlemen] as const).map((side) => (
            <div key={side.label} className="px-2 sm:px-6 text-center">
              <p className="text-[11px] font-sans font-semibold tracking-[0.3em] uppercase text-brand-olive">
                {side.label}
              </p>
              <p className="mt-2 font-serif text-2xl sm:text-3xl text-brand-charcoal">
                {side.attire}
              </p>
              <p className="mt-1.5 font-sans text-xs sm:text-sm font-light text-brand-olive">
                ({side.note})
              </p>
            </div>
          ))}
        </div>

        <p className="mt-band text-center font-serif italic font-light text-sm sm:text-base text-brand-accent">
          {t.colorNote}
        </p>
      </motion.div>
    </section>
  );
}
