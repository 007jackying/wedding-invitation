import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Volume2, VolumeX } from "lucide-react";
import { track } from "@vercel/analytics";

interface AudioPlayerProps {
  lang: "en" | "cn";
}

export default function AudioPlayer({ lang }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const audioUrl = "/music.mp3";

  // Handle audio state transitions
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play().catch((err) => {
        console.warn("Audio play blocked by browser autoplay restriction:", err);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const handleTogglePlay = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    track("Music Toggled", { action: nextState ? "play" : "pause" });
  };

  const labels = {
    en: {
      play: "Play Background Music",
      mute: "Mute Music",
      nowPlaying: "Playing Blue Hour by Taisei Iwasaki",
    },
    cn: {
      play: "播放背景音乐",
      mute: "静音背景音乐",
      nowPlaying: "正在播放 Blue Hour — 岩崎太整",
    }
  }[lang];

  // Bottom-right: the top-left corner is the hero's type column now, and the
  // language switcher owns the top-right.
  return (
    <div className="fixed bottom-6 right-5 sm:bottom-10 sm:right-10 z-50 flex items-center gap-2">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        loop
        preload="auto"
      />

      {/* Small Rounded Floating Music Icon Toggle Button */}
      <motion.button
        onClick={handleTogglePlay}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative flex items-center justify-center w-9 h-9 rounded-full bg-white border border-brand-rose/15 shadow-xs hover:shadow-md hover:border-brand-rose/35 transition-colors duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-rose/30 ${
          isPlaying ? "text-brand-rose" : "text-brand-charcoal/50"
        }`}
        title={isPlaying ? labels.mute : labels.play}
        aria-label={isPlaying ? labels.mute : labels.play}
      >
        {/* Subtle pulsating outer ring when playing */}
        <AnimatePresence>
          {isPlaying && (
            <motion.span
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ scale: 1.4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
              className="absolute inset-0 rounded-full border border-brand-rose/40 pointer-events-none"
            />
          )}
        </AnimatePresence>

        {isPlaying ? (
          <Volume2 className="w-4 h-4 animate-pulse" />

        ) : (
          <VolumeX className="w-4 h-4" />
        )}
      </motion.button>

      {/* Scrolling now-playing marquee */}
      <AnimatePresence>
        {isPlaying && (
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
