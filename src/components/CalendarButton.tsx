import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, ChevronDown, Download, ExternalLink } from "lucide-react";
import { translations } from "../translations";

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
      "UID:wedding-eva-vincent-2026@evavincentwedding.com",
      "DTSTAMP:20260718T000000Z",
      "DTSTART:20260912T140000Z", // 16:00 Europe/Rome (CEST UTC+2)
      "DTEND:20260912T220000Z",   // 00:00 Europe/Rome (CEST UTC+2) on Sept 13
      "SUMMARY:Wedding of Eva & Vincent | Eva 与 Vincent 的婚礼",
      "DESCRIPTION:Join us to celebrate the wedding of Eva and Vincent at Villa di Maiano, Florence, Italy.\\n\\nSchedule:\\n- 04:00 PM: Welcoming & Drinks\\n- 04:30 PM: Marriage Ceremony\\n- 06:00 PM: Banquet Dinner\\n- 09:00 PM: Dancing & Celebration",
      "LOCATION:Villa di Maiano, Via del Salviatino 1, 50137 Fiesole, Florence, Italy",
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
    const dates = "20260912T140000Z/20260912T220000Z";
    const details = encodeURIComponent(
      "Join us to celebrate the wedding of Eva and Vincent at Villa di Maiano, Florence, Italy.\n\nSchedule:\n- 04:00 PM: Welcoming & Drinks\n- 04:30 PM: Marriage Ceremony\n- 06:00 PM: Banquet Dinner\n- 09:00 PM: Dancing & Celebration"
    );
    const location = encodeURIComponent("Villa di Maiano, Via del Salviatino 1, 50137 Fiesole, Florence, Italy");
    return `${base}&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  };

  const getOutlookCalendarUrl = () => {
    const base = "https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent";
    const subject = encodeURIComponent("Wedding of Eva & Vincent | Eva 与 Vincent 的婚礼");
    const startdt = "2026-09-12T14:00:00Z";
    const enddt = "2026-09-12T22:00:00Z";
    const body = encodeURIComponent(
      "Join us to celebrate the wedding of Eva and Vincent at Villa di Maiano, Florence, Italy.\n\nSchedule:\n- 04:00 PM: Welcoming & Drinks\n- 04:30 PM: Marriage Ceremony\n- 06:00 PM: Banquet Dinner\n- 09:00 PM: Dancing & Celebration"
    );
    const location = encodeURIComponent("Villa di Maiano, Via del Salviatino 1, 50137 Fiesole, Florence, Italy");
    return `${base}&subject=${subject}&startdt=${startdt}&enddt=${enddt}&body=${body}&location=${location}`;
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Premium Main Add to Calendar Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-brand-rose/25 text-brand-charcoal hover:border-brand-rose/50 hover:bg-brand-blush/10 transition-all duration-300 font-sans font-medium text-xs rounded-full tracking-wider uppercase cursor-pointer shadow-xs focus:outline-none"
      >
        <Calendar className="w-3.5 h-3.5 text-brand-rose" />
        <span>{t.buttonText}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-3.5 h-3.5 text-brand-charcoal/50" />
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
              onClick={() => setIsOpen(false)}
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
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-4 py-2.5 text-xs text-brand-charcoal hover:bg-brand-blush/30 transition-colors duration-200"
            >
              <span className="font-medium">{t.outlook}</span>
              <ExternalLink className="w-3 h-3 text-brand-charcoal/30" />
            </a>

            {/* Divider line */}
            <div className="h-[1px] bg-brand-rose/10 my-1" />

            {/* Apple / Universal ICS Download Link */}
            <button
              onClick={generateIcsFile}
              className="w-full flex items-center justify-between px-4 py-2.5 text-xs text-brand-charcoal hover:bg-brand-blush/30 transition-colors duration-200 text-left cursor-pointer"
            >
              <span className="font-semibold text-brand-rose">{t.apple}</span>
              <Download className="w-3 h-3 text-brand-rose/60" />
            </button>

            {/* General Description Link */}
            <button
              onClick={generateIcsFile}
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
