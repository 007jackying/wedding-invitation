import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const SLIDESHOW_IMAGES = ["/photos/first.jpeg"]
export default function BackgroundSlideshow({ lang = "en" }: { lang?: "en" | "cn" }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % SLIDESHOW_IMAGES.length);
    }, 8000); // Cross-fade every 8 seconds for ultimate serenity
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none select-none">
      {/* Slideshow Core */}
      {/* initial={false}: the first photo is the largest thing on the page, so it
          paints at once instead of fading up over 2.5s. Later slides still cross-fade. */}
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={SLIDESHOW_IMAGES[index]}
            alt={lang === "cn" ? "Eva 与 Vincent 的婚纱照" : "Eva and Vincent on their wedding day"}
            /* Framed at 3:2 by the hero, so there is nothing to crop. object-position
               only matters if a later photo lands in a narrower frame — it holds the
               couple, who sit centre-right and slightly above the midline. */
            className="w-full h-full object-cover object-[55%_38%]"
            fetchPriority="high"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </AnimatePresence>
      {/* ponytail: no scrim or filter — the photograph runs clean, and no type
          sits on it, so nothing needs protecting. */}
    </div>
  );
}
