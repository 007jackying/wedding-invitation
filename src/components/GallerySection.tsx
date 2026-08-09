import { motion } from "motion/react";
import { translations } from "../translations";

// Both frames are 2730×4096 straight off the camera. Nothing is cropped: the
// pair is rendered at its own ratio so the couple are never cut at any width.
// ponytail: two literals beat a config array for two photos.
const PHOTOS = [
  { src: "/photos/2.jpg", altKey: "alt1" },
  { src: "/photos/3.jpg", altKey: "alt2" },
] as const;

interface GallerySectionProps {
  lang: "en" | "cn";
}

export default function GallerySection({ lang }: GallerySectionProps) {
  const t = translations[lang].gallery;

  return (
    <section
      id="gallery"
      className="relative w-full min-h-screen flex items-center px-gutter py-section"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative max-w-4xl mx-auto w-full"
      >
        <div className="text-center">
          <span className="text-[11px] sm:text-xs tracking-[0.35em] text-brand-accent uppercase font-sans font-semibold">
            {t.eyebrow}
          </span>
          {/* ponytail: same clamp as the other section headings — one row from 320px up */}
          <h2 className="font-serif italic font-light whitespace-nowrap text-[clamp(1.75rem,8vw,3.75rem)] text-brand-charcoal mt-4">
            {t.title}
          </h2>
          <div className="mt-4 mx-auto w-16 h-px bg-brand-gold/70" />
        </div>

        {/* Side by side, left and right. One column under 640px, where two 2:3
            frames would each be too narrow to read a face in. */}
        <div className="mt-block grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-gutter">
          {PHOTOS.map((photo) => (
            <img
              key={photo.src}
              src={photo.src}
              alt={t[photo.altKey]}
              /* width/height let the browser reserve the 2:3 box before the file
                 lands, so the reply band below doesn't jump when it does. */
              width={2730}
              height={4096}
              loading="lazy"
              decoding="async"
              className="w-full h-auto rounded-2xl border border-brand-gold/30 shadow-sm"
            />
          ))}
        </div>

        <p className="mt-block text-center font-serif italic font-light text-sm sm:text-base text-brand-accent">
          {t.caption}
        </p>
      </motion.div>
    </section>
  );
}
