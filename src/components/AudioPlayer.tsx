import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Volume2, VolumeX } from "lucide-react";
import { track } from "@vercel/analytics";

interface AudioPlayerProps {
  lang: "en" | "cn";
}

const STORAGE_KEY = "wedding.musicMuted";

// localStorage throws rather than no-ops in some privacy modes, and this runs
// during the hero's first render — an uncaught throw here would take the whole
// invitation down over a music preference.
function readMuted(): boolean {
  try {
    // Only an explicit "false" opts into sound; first-time visitors start muted.
    return localStorage.getItem(STORAGE_KEY) !== "false";
  } catch {
    return true;
  }
}

function saveMuted(muted: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, String(muted));
  } catch {
    // Preference just won't survive the session. Not worth telling the guest.
  }
}

export default function AudioPlayer({ lang }: AudioPlayerProps) {
  const [muted, setMuted] = useState(readMuted);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const audioUrl = "/music.mp3";

  // The track runs from load; `muted` is the only thing the button changes.
  // Browsers permit autoplay only while muted, so a returning guest who chose
  // sound still needs one gesture before it can be honoured — if play() is
  // refused we drop back to muted so the icon isn't claiming sound that isn't
  // there.
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.muted = muted;
    el.play().catch(() => {
      if (!muted) setMuted(true);
    });
  }, [muted]);

  const handleToggleMute = () => {
    const next = !muted;
    setMuted(next);
    saveMuted(next);
    track("Music Toggled", { action: next ? "mute" : "unmute" });
  };

  // Playing but silent is still "off" to a guest, so the UI keys off audibility.
  const audible = !muted;

  const labels = {
    en: {
      play: "Unmute music",
      mute: "Mute music",
      nowPlaying: "The Carpenters - Close To You",
    },
    cn: {
      play: "开启背景音乐",
      mute: "静音背景音乐",
      nowPlaying: "The Carpenters - Close To You",
    }
  }[lang];

  return (
    <div className="fixed top-10 left-5 sm:top-16 sm:left-10 z-50 flex items-center gap-2">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        loop
        autoPlay
        muted={muted}
        preload="auto"
      />

      {/* Small Rounded Floating Music Icon Toggle Button */}
      <motion.button
        onClick={handleToggleMute}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative flex items-center justify-center w-9 h-9 rounded-full bg-white border border-brand-rose/15 shadow-xs hover:shadow-md hover:border-brand-rose/35 transition-colors duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-rose/30 ${
          audible ? "text-brand-rose" : "text-brand-charcoal/50"
        }`}
        title={audible ? labels.mute : labels.play}
        aria-label={audible ? labels.mute : labels.play}
      >
        {/* Subtle pulsating outer ring when playing */}
        <AnimatePresence>
          {audible && (
            <motion.span
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ scale: 1.4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
              className="absolute inset-0 rounded-full border border-brand-rose/40 pointer-events-none"
            />
          )}
        </AnimatePresence>

        {audible ? (
          <Volume2 className="w-4 h-4 animate-pulse" />

        ) : (
          <VolumeX className="w-4 h-4" />
        )}
      </motion.button>

      {/* Scrolling now-playing marquee */}
      <AnimatePresence>
        {audible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-32 sm:w-44 overflow-hidden pointer-events-none"
            aria-hidden="true"
          >
            <motion.div
              className="flex w-max"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            >
              {/* ponytail: duplicated text is the whole marquee trick */}
              <span className="pr-8 text-[10px] tracking-wide text-brand-cream text-shadow-md whitespace-nowrap">{labels.nowPlaying}</span>
              <span className="pr-8 text-[10px] tracking-wide text-brand-cream text-shadow-md whitespace-nowrap">{labels.nowPlaying}</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
