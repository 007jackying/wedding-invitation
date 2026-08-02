import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Volume2, VolumeX } from "lucide-react";

interface AudioPlayerProps {
  lang: "en" | "cn";
}

export default function AudioPlayer({ lang }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Classic wedding instrumental track: Claude Debussy's Clair de Lune
  const audioUrl = "https://upload.wikimedia.org/wikipedia/commons/b/b2/Debussy_Clair_de_Lune.mp3";

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
    setIsPlaying(!isPlaying);
  };

  const labels = {
    en: {
      play: "Play Background Music",
      mute: "Mute Music",
    },
    cn: {
      play: "播放背景音乐",
      mute: "静音背景音乐",
    }
  }[lang];

  return (
    <div className="fixed top-6 left-6 z-50">
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
    </div>
  );
}
