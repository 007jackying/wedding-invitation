import { useEffect, useState } from "react";
import { translations } from "../translations";

interface CountdownTimerProps {
  lang: "en" | "cn";
  /** "light" for the sand ground, "dark" for cream type over a photo. */
  tone?: "light" | "dark";
}

const TONES = {
  light: {
    row: "justify-start",
    value: "text-brand-charcoal",
    label: "text-brand-olive",
    done: "text-brand-accent",
  },
  dark: {
    row: "justify-center",
    value: "text-brand-cream text-shadow-md",
    label: "text-brand-cream/70 text-shadow-sm",
    done: "text-brand-cream text-shadow-md",
  },
};

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isCompleted: boolean;
}

// Wedding Day Target: January 2, 2027 at 6:00 PM (Photo Session start) Kuala Lumpur time (UTC+8, no DST)
export const TARGET_DATE = "2027-01-02T18:00:00+08:00";

function calculateTimeRemaining(): TimeRemaining {
  const difference = new Date(TARGET_DATE).getTime() - Date.now();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isCompleted: true };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((difference % (1000 * 60)) / 1000),
    isCompleted: false,
  };
}

export default function CountdownTimer({ lang, tone = "dark" }: CountdownTimerProps) {
  const t = translations[lang].hero;
  const c = TONES[tone];
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(calculateTimeRemaining());

  useEffect(() => {
    const intervalId = setInterval(() => {
      const remaining = calculateTimeRemaining();
      setTimeLeft(remaining);
      if (remaining.isCompleted) {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  if (timeLeft.isCompleted) {
    return (
      <span className={`font-serif italic text-base sm:text-lg ${c.done}`}>
        {t.countdownCelebrating}
      </span>
    );
  }

  const timeUnits = [
    { label: t.countdownDays, value: timeLeft.days },
    { label: t.countdownHours, value: timeLeft.hours },
    { label: t.countdownMinutes, value: timeLeft.minutes },
    { label: t.countdownSeconds, value: timeLeft.seconds },
  ];

  return (
    <div
      className={`flex flex-wrap items-baseline gap-x-3 gap-y-1 sm:gap-x-5 ${c.row}`}
      role="timer"
      aria-label={t.datePlace}
    >
      {timeUnits.map((unit) => (
        <div key={unit.label} className="flex items-baseline gap-1.5">
          <span className={`font-serif text-xl sm:text-2xl tabular-nums ${c.value}`}>
            {String(unit.value).padStart(2, "0")}
          </span>
          <span
            className={`text-[9px] sm:text-[10px] font-sans font-semibold tracking-[0.2em] uppercase ${c.label}`}
          >
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}
