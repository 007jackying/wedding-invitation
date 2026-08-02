import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const SLIDESHOW_IMAGES = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?q=80&w=2000&auto=format&fit=crop"
];

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
          animate={{ opacity: 0.65, scale: 1 }} // Increased from 0.25 to 0.65 for stunning, clear visibility of wedding photos
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={SLIDESHOW_IMAGES[index]}
            alt="Wedding scenery background"
            className="w-full h-full object-cover filter brightness-[0.98] contrast-[1.03]"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </AnimatePresence>

      {/* Primary Cinematic Dark Protective Vignette Overlay */}
      {/* Ensures the natural, gorgeous beauty of the photos shines through while making white text pop flawlessly */}
      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/60" />
    </div>
  );
}
