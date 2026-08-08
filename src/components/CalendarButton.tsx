import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, ChevronDown, Download, ExternalLink } from "lucide-react";
import { track } from "@vercel/analytics";
import { translations } from "../translations";

// The running order lives on the site, not in the invite — it changes, and a
// calendar entry copied into someone's phone in 2026 cannot be corrected.
const EVENT_DESCRIPTION =
  "Join us to celebrate the wedding of Eva and Vincent at Chuai Heng Banquet Hall, Kuala Lumpur, Malaysia.\n\nSchedule: Please refer to the website. https://evavincentwedding.recursivedreamlabs.com/";

interface CalendarButtonProps {
  lang: "en" | "cn";
}

export default function CalendarButton({ lang }: CalendarButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = translations[lang].details.calendar;

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const generateIcsFile = () => {
    const event = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Eva Vincent Wedding//NONSGML Invitation//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      "UID:wedding-eva-vincent-2027@evavincentwedding.com",
      "DTSTAMP:20260718T000000Z",
      "DTSTART:20270102T100000Z", // 18:00 Asia/Kuala_Lumpur (UTC+8)
      "DTEND:20270102T143000Z",   // 22:30 Asia/Kuala_Lumpur (UTC+8)
      "SUMMARY:Wedding of Eva & Vincent | Eva 与 Vincent 的婚礼",
      `DESCRIPTION:${EVENT_DESCRIPTION.replace(/\n/g, "\\n")}`,
      "LOCATION:Chuai Heng Banquet Hall, 20, Jalan Kampung, Imbi, 55100 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur",
      "SEQUENCE:0",
      "STATUS:CONFIRMED",
      "TRANSP:OPAQUE",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([event], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "eva_vincent_wedding.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsOpen(false);
  };

  const getGoogleCalendarUrl = () => {
    const base = "https://calendar.google.com/calendar/render?action=TEMPLATE";
    const title = encodeURIComponent("Wedding of Eva & Vincent | Eva 与 Vincent 的婚礼");
    const dates = "20270102T100000Z/20270102T143000Z";
    const details = encodeURIComponent(EVENT_DESCRIPTION);
    const location = encodeURIComponent("Chuai Heng Banquet Hall, 20, Jalan Kampung, Imbi, 55100 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur");
    return `${base}&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  };

  const getOutlookCalendarUrl = () => {
    const base = "https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent";
    const subject = encodeURIComponent("Wedding of Eva & Vincent | Eva 与 Vincent 的婚礼");
    const startdt = "2027-01-02T10:00:00Z";
    const enddt = "2027-01-02T14:30:00Z";
    const body = encodeURIComponent(EVENT_DESCRIPTION);
    const location = encodeURIComponent("Chuai Heng Banquet Hall, 20, Jalan Kampung, Imbi, 55100 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur");
    return `${base}&subject=${subject}&startdt=${startdt}&enddt=${enddt}&body=${body}&location=${location}`;
  };

  return (
    // min-w-max: as a flex item this wrapper was shrinking to 40px — its padding
    // alone — so the pill overflowed it and the sibling label was laid out
    // underneath. min-width stops the shrink; plain w-max did not survive.
    <div className="relative inline-block min-w-max text-left" ref={dropdownRef}>
      {/* Premium Main Add to Calendar Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-brand-rose/25 text-brand-charcoal hover:border-brand-rose/50 hover:bg-brand-blush/10 transition-all duration-300 font-sans font-medium text-[11px] rounded-full tracking-wider uppercase whitespace-nowrap cursor-pointer shadow-xs focus:outline-none"
      >
        <Calendar className="w-3 h-3 text-brand-rose" />
        <span>{t.buttonText}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-3 h-3 text-brand-charcoal/50" />
        </motion.div>
      </button>

      {/* Floating Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-0 mt-2 w-56 origin-top-left bg-white border border-brand-rose/15 rounded-2xl shadow-xl z-50 overflow-hidden py-1.5"
          >
            {/* Google Calendar Link */}
            <a
              href={getGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                track("Add to Calendar", { provider: "Google Calendar" });
                setIsOpen(false);
              }}
              className="flex items-center justify-between px-4 py-2.5 text-xs text-brand-charcoal hover:bg-brand-blush/30 transition-colors duration-200"
            >
              <span className="font-medium">{t.google}</span>
              <ExternalLink className="w-3 h-3 text-brand-charcoal/30" />
            </a>

            {/* Outlook Web Calendar Link */}
            <a
              href={getOutlookCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                track("Add to Calendar", { provider: "Outlook" });
                setIsOpen(false);
              }}
              className="flex items-center justify-between px-4 py-2.5 text-xs text-brand-charcoal hover:bg-brand-blush/30 transition-colors duration-200"
            >
              <span className="font-medium">{t.outlook}</span>
              <ExternalLink className="w-3 h-3 text-brand-charcoal/30" />
            </a>

            {/* Divider line */}
            <div className="h-[1px] bg-brand-rose/10 my-1" />

            {/* Apple / Universal ICS Download Link */}
            <button
              onClick={() => {
                track("Add to Calendar", { provider: "Apple/ICS" });
                generateIcsFile();
              }}
              className="w-full flex items-center justify-between px-4 py-2.5 text-xs text-brand-charcoal hover:bg-brand-blush/30 transition-colors duration-200 text-left cursor-pointer"
            >
              <span className="font-semibold text-brand-accent">{t.apple}</span>
              <Download className="w-3 h-3 text-brand-rose/60" />
            </button>

            {/* General Description Link */}
            <button
              onClick={() => {
                track("Add to Calendar", { provider: "ICS File" });
                generateIcsFile();
              }}
              className="w-full flex items-center justify-between px-4 py-2 text-[10px] text-brand-olive/70 hover:bg-brand-blush/30 transition-colors duration-200 text-left cursor-pointer"
            >
              <span>{t.downloadIcs}</span>
              <Download className="w-3 h-3 text-brand-olive/40" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
