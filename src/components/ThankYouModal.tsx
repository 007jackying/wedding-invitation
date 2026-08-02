import { motion, AnimatePresence } from "motion/react";
import { Heart } from "lucide-react";
import { RSVPFormData } from "../types";
import { translations } from "../translations";

interface ThankYouModalProps {
  data: RSVPFormData | null;
  lang: "en" | "cn";
  onClose: () => void;
}

export default function ThankYouModal({ data, lang, onClose }: ThankYouModalProps) {
  const t = translations[lang].toast;

  return (
    <AnimatePresence>
      {data && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="thank-you-title"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-charcoal/45 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 26, stiffness: 340 }}
            className="relative z-10 w-full max-w-md max-h-[90svh] overflow-y-auto bg-brand-cream border border-brand-gold/40 rounded-3xl px-6 pt-6 pb-7 sm:px-8 shadow-2xl text-center"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-gold via-brand-rose to-brand-olive" />

            {/* The artwork is an opaque white PNG — multiply drops the white
                block so only the blue linework sits on the sand card. */}
            <img
              src="/See%20you%20soon.png"
              alt={
                lang === "cn"
                  ? "Eva 与 Vincent 的插画，写着「See you soon!」"
                  : "Illustration of Eva and Vincent waving, captioned “See you soon!”"
              }
              width={1458}
              height={752}
              className="w-full h-auto mix-blend-multiply"
            />

            <h2
              id="thank-you-title"
              className="mt-1 font-serif text-2xl sm:text-3xl text-brand-charcoal tracking-wide"
            >
              {t.title}
            </h2>

            {!data.attending ? (
              <p className="mt-3 font-sans text-sm text-brand-charcoal/75 leading-relaxed">
                {lang === "cn" ? (
                  <>
                    {t.thankYou}，
                    <span className="font-semibold text-brand-accent">{data.guestName}</span>
                    。很遗憾这次无法相聚，期待日后与您相见。
                  </>
                ) : (
                  <>
                    {t.thankYou},{" "}
                    <span className="font-semibold text-brand-accent">{data.guestName}</span>. We're
                    sorry you can't make it — we'll miss you and hope to celebrate together soon.
                  </>
                )}
              </p>
            ) : lang === "cn" ? (
              <p className="mt-3 font-sans text-sm text-brand-charcoal/75 leading-relaxed">
                {t.thankYou}，
                <span className="font-semibold text-brand-accent">{data.guestName}</span>！您的{" "}
                {data.guestCount} {t.people} 出席答复已成功记入来宾名单。
              </p>
            ) : (
              <p className="mt-3 font-sans text-sm text-brand-charcoal/75 leading-relaxed">
                {t.thankYou},{" "}
                <span className="font-semibold text-brand-accent">{data.guestName}</span>!{" "}
                {t.registered}{" "}
                <span className="font-semibold">
                  {data.guestCount} {data.guestCount === 1 ? t.person : t.people}
                </span>{" "}
                has been registered in our guest list.
              </p>
            )}

            {data.attending && (
              <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-brand-olive tracking-[0.18em] uppercase font-semibold">
                <Heart className="w-3 h-3 fill-current text-brand-rose" />
                <span>{t.footer}</span>
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              autoFocus
              className="mt-6 w-full px-8 py-3.5 bg-brand-accent text-brand-cream hover:bg-brand-charcoal transition-colors duration-300 font-sans font-semibold text-xs sm:text-sm tracking-[0.25em] uppercase cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 focus:ring-offset-brand-cream"
            >
              {t.close}
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
