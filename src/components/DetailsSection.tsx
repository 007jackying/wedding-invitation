import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Users, HeartHandshake, UtensilsCrossed, PartyPopper } from "lucide-react";
import { track } from "@vercel/analytics";
import { translations } from "../translations";
import CalendarButton from "./CalendarButton";
import { onTimelineSnapshot } from "../firebase";
import { TimelineItem, RSVPFormData } from "../types";
import RSVPSummary, { NeedInvite } from "./RSVPSummary";

// ponytail: cycled by index rather than matched to each label's meaning — holds up for any timeline length
const TIMELINE_ICONS = [Users, HeartHandshake, UtensilsCrossed, PartyPopper];

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

  return (
    <section
      id="details"
      className="relative w-full min-h-screen flex items-center px-gutter py-section"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative max-w-5xl mx-auto w-full"
      >
        {/* Editorial section heading */}
        <div className="mb-block">
          <span className="text-[11px] sm:text-xs tracking-[0.35em] text-brand-accent uppercase font-sans font-semibold">
            {t.joinCelebration}
          </span>
          {/* ponytail: clamp + nowrap keeps it one row from 320px up, no breakpoint ladder */}
          <h2 className="font-serif italic font-light whitespace-nowrap text-[clamp(1.75rem,8vw,3.75rem)] text-brand-charcoal mt-4">
            {t.title}
          </h2>
        </div>

        {/* Programma / Venue spread */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-band md:gap-0">
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


        {/* Reply band — the closing line of the details page, not a page of its
            own, so it stays narrow and low enough to land under the spread. */}
        <motion.div
          id="rsvp"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mt-block max-w-2xl mx-auto bg-brand-charcoal text-brand-cream px-6 py-5 text-center rounded-2xl"
        >
          <p className="font-serif italic font-light text-base sm:text-lg leading-snug">
            {t.byDate}
          </p>
          {myRSVP ? (
            <div className="mt-3 flex justify-center">
              <RSVPSummary rsvp={myRSVP} lang={lang} />
            </div>
          ) : !canRSVP ? (
            <div className="mt-3 flex justify-center">
              <NeedInvite lang={lang} />
            </div>
          ) : (
            <button
              id="attend-rsvp-trigger"
              onClick={onAttendClick}
              className="mt-4 px-7 py-2.5 bg-brand-accent text-brand-cream hover:bg-brand-cream hover:text-brand-charcoal transition-colors duration-300 font-sans font-semibold text-xs tracking-[0.25em] uppercase cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-brand-cream focus:ring-offset-2 focus:ring-offset-brand-charcoal"
            >
              {t.attendBtn}
            </button>
          )}
        </motion.div>

      </motion.div>

    </section>
  );
}
