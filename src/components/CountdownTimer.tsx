import { useEffect, useState } from "react";
import { translations } from "../translations";

interface CountdownTimerProps {
  lang: "en" | "cn";
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isCompleted: boolean;
}

// Wedding Ceremony Target Date: September 12, 2026 at 4:00 PM (16:00:00)
const TARGET_DATE = "2026-09-12T16:00:00";

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

export default function CountdownTimer({ lang }: CountdownTimerProps) {
  const t = translations[lang].hero;
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
      <span className="font-serif italic text-brand-cream text-base sm:text-lg text-shadow-md">
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
    <div className="flex items-baseline gap-4 sm:gap-5" role="timer" aria-label={t.datePlace}>
      {timeUnits.map((unit) => (
        <div key={unit.label} className="flex items-baseline gap-1.5">
          <span className="font-serif text-xl sm:text-2xl text-brand-cream tabular-nums text-shadow-md">
            {String(unit.value).padStart(2, "0")}
          </span>
          <span className="text-[9px] sm:text-[10px] font-sans font-semibold tracking-[0.2em] uppercase text-brand-cream/70 text-shadow-sm">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}
