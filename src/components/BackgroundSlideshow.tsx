import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const SLIDESHOW_IMAGES = ["/photos/first.jpeg"]

export default function BackgroundSlideshow() {
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
      <AnimatePresence mode="popLayout">
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
            alt="Wedding scenery background"
            className="w-full h-full object-cover brightness-70"
            fetchPriority="high"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </AnimatePresence>
      {/* ponytail: no scrim or filter — photos run clean. Hero type rests on the
          .text-shadow-* helpers alone; add one gradient back if a photo goes pale. */}
    </div>
  );
}
