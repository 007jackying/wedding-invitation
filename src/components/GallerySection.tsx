import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
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
  const [open, setOpen] = useState<number | null>(null);

  // ponytail: modulo wrap over two photos — prev and next are the same move.
  const step = (delta: number) =>
    setOpen((i) => (i === null ? i : (i + delta + PHOTOS.length) % PHOTOS.length));

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

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
          {/* <h2 className="font-serif italic font-light whitespace-nowrap text-[clamp(1.75rem,8vw,3.75rem)] text-brand-charcoal mt-4">
            {t.title}
          </h2> */}
          <div className="mt-4 mx-auto w-16 h-px bg-brand-gold/70" />
        </div>

        {/* Side by side, left and right. One column under 640px, where two 2:3
            frames would each be too narrow to read a face in. */}
        <div className="mt-block grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-gutter">
          {PHOTOS.map((photo, i) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => setOpen(i)}
              aria-label={t[photo.altKey]}
              className="block w-full rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            >
              <img
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
            </button>
          ))}
        </div>

        <p className="mt-block text-center font-serif italic font-light text-sm sm:text-base text-brand-accent">
          {t.caption}
        </p>
      </motion.div>

      <AnimatePresence>
        {open !== null && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label={t.eyebrow}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(null)}
              className="absolute inset-0 bg-brand-charcoal/70 backdrop-blur-md"
            />

            <motion.img
              key={PHOTOS[open].src}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ type: "spring", damping: 26, stiffness: 340 }}
              src={PHOTOS[open].src}
              alt={t[PHOTOS[open].altKey]}
              className="relative z-10 max-h-[85svh] max-w-full w-auto h-auto rounded-2xl border border-brand-gold/40 shadow-2xl"
            />

            <button
              type="button"
              onClick={() => setOpen(null)}
              aria-label={lang === "cn" ? "关闭" : "Close"}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-brand-cream/90 text-brand-charcoal shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => step(-1)}
              aria-label={lang === "cn" ? "上一张" : "Previous photo"}
              className="absolute left-2 sm:left-6 z-20 p-3 rounded-full bg-brand-cream/90 text-brand-charcoal shadow-lg"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              type="button"
              onClick={() => step(1)}
              aria-label={lang === "cn" ? "下一张" : "Next photo"}
              className="absolute right-2 sm:right-6 z-20 p-3 rounded-full bg-brand-cream/90 text-brand-charcoal shadow-lg"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
