import { motion } from "motion/react";
import { translations } from "../translations";

interface DressCodeSectionProps {
  lang: "en" | "cn";
}

interface DressRowProps {
  photoUrl: string;
  photoAlt: string;
  photoCaption: string;
  title: string;
  desc: string;
  bullets: string[];
  reverse?: boolean;
}

function DressRow({ photoUrl, photoAlt, photoCaption, title, desc, bullets, reverse }: DressRowProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-center">
      <motion.figure
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`md:col-span-5 ${reverse ? "md:order-2" : ""}`}
      >
        <div className="overflow-hidden aspect-[3/4] bg-brand-blush">
          <img
            src={photoUrl}
            alt={photoAlt}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        </div>
        <figcaption className="mt-3 font-serif italic text-sm text-brand-olive">
          {photoCaption}
        </figcaption>
      </motion.figure>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, delay: 0.15, ease: "easeOut" }}
        className={`md:col-span-7 ${reverse ? "md:order-1" : ""}`}
      >
        <h3 className="font-serif italic font-light text-3xl sm:text-4xl text-brand-charcoal mb-5">
          {title}
        </h3>
        <p className="font-sans text-sm sm:text-base font-light text-brand-charcoal/90 leading-relaxed max-w-lg">
          {desc}
        </p>
        <ul className="mt-8 border-t border-brand-charcoal/15">
          {bullets.map((bullet) => (
            <li
              key={bullet}
              className="py-3.5 border-b border-brand-charcoal/15 flex items-baseline gap-3 text-sm font-light text-brand-olive leading-relaxed"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand-rose shrink-0 translate-y-[-2px]" />
              <span>{bullet.replace(/^•\s*/, "")}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

export default function DressCodeSection({ lang }: DressCodeSectionProps) {
  const t = translations[lang].dressCode;

  return (
    <section id="dress-code" className="relative w-full px-6 sm:px-10 py-24 sm:py-32 bg-brand-blush/40">
      <div className="max-w-5xl mx-auto">
        {/* Editorial section heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="mb-16 sm:mb-20"
        >
          <span className="text-[11px] sm:text-xs tracking-[0.35em] text-brand-accent uppercase font-sans font-semibold">
            {t.aesthetic}
          </span>
          <h2 className="font-serif italic font-light text-5xl sm:text-6xl text-brand-charcoal mt-4">
            {t.title}
          </h2>
          <div className="w-16 h-px bg-brand-rose mt-8" />
          <p className="font-serif italic text-base sm:text-lg text-brand-olive mt-8 max-w-md leading-relaxed">
            {t.subtitle}
          </p>
        </motion.div>

        <div className="flex flex-col gap-20 sm:gap-28">
          <DressRow
            photoUrl="https://images.unsplash.com/photo-1591555200813-b5537524440b?q=80&w=1000&auto=format&fit=crop"
            photoAlt="Bride dress inspiration"
            photoCaption={lang === "cn" ? "灵感 — 象牙白与淡雅色系" : "Inspiration — elegance in ivory & pastels"}
            title={t.ladies.title}
            desc={t.ladies.desc}
            bullets={[t.ladies.bullet1, t.ladies.bullet2, t.ladies.bullet3]}
          />

          <DressRow
            photoUrl="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop"
            photoAlt="Groom suit inspiration"
            photoCaption={lang === "cn" ? "灵感 — 经典礼服与定制西装" : "Inspiration — tuxedos & classic suits"}
            title={t.gentlemen.title}
            desc={t.gentlemen.desc}
            bullets={[t.gentlemen.bullet1, t.gentlemen.bullet2, t.gentlemen.bullet3]}
            reverse
          />
        </div>
      </div>
    </section>
  );
}
