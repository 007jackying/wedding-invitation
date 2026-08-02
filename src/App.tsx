import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Heart, Lock } from "lucide-react";
import HeroSection from "./components/HeroSection";
import DetailsSection from "./components/DetailsSection";
import DressCodeSection from "./components/DressCodeSection";
import RSVPModal from "./components/RSVPModal";
import AdminDashboard from "./components/AdminDashboard";
import AudioPlayer from "./components/AudioPlayer";
import { RSVPFormData } from "./types";
import { translations } from "./translations";

export default function App() {
  const [currentView, setCurrentView] = useState<"invitation" | "admin">("invitation");
  const [lang, setLang] = useState<"en" | "cn">("en");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successData, setSuccessData] = useState<RSVPFormData | null>(null);
  const [showToast, setShowToast] = useState(false);

  // Hash/Path routing to switch between English/Chinese view & Admin dashboard
  useEffect(() => {
    const handleRouting = () => {
      const hash = window.location.hash;
      const path = window.location.pathname;

      // 1. Owner Admin View takes priority
      if (hash === "#admin") {
        setCurrentView("admin");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      } else {
        setCurrentView("invitation");
      }

      // 2. Dual Routing support for language (either pathname /cn/ or hash #cn)
      if (
        path.includes("/cn") ||
        path.includes("/cn/") ||
        hash === "#cn" ||
        hash === "#/cn" ||
        hash.startsWith("#cn")
      ) {
        setLang("cn");
      } else if (
        path.includes("/en") ||
        path.includes("/en/") ||
        hash === "#en" ||
        hash === "#/en" ||
        hash.startsWith("#en")
      ) {
        setLang("en");
      } else {
        // Fallback detection using browser language, otherwise default to English
        const userLang = navigator.language || "";
        if (userLang.toLowerCase().includes("zh") || userLang.toLowerCase().includes("cn")) {
          setLang("cn");
        } else {
          setLang("en");
        }
      }
    };

    // Check routing on mount
    handleRouting();

    window.addEventListener("hashchange", handleRouting);
    window.addEventListener("popstate", handleRouting);
    return () => {
      window.removeEventListener("hashchange", handleRouting);
      window.removeEventListener("popstate", handleRouting);
    };
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleRSVPSuccess = (data: RSVPFormData) => {
    // 1. Persist response in local list so owner dashboard shows it instantly
    try {
      const stored = localStorage.getItem("wedding_rsvps");
      const currentList: RSVPFormData[] = stored ? JSON.parse(stored) : [];
      
      // Store submission with the active language tag
      const enrichedData = { ...data, lang };
      const updatedList = [enrichedData, ...currentList];
      localStorage.setItem("wedding_rsvps", JSON.stringify(updatedList));
    } catch (e) {
      console.warn("Failed to save RSVP locally:", e);
    }

    // 2. Set success data to display custom toast notification
    setSuccessData(data);
    setIsModalOpen(false);
    setShowToast(true);

    // Auto-hide toast after 8 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 8000);

    // 3. Smoothly scroll to Dress Code section
    setTimeout(() => {
      const dressCodeSec = document.getElementById("dress-code");
      if (dressCodeSec) {
        dressCodeSec.scrollIntoView({ behavior: "smooth" });
      }
    }, 400);
  };

  const navigateToAdmin = () => {
    window.location.hash = "admin";
  };

  const navigateToInvitation = () => {
    // Return to the current selected language hash
    window.location.hash = lang === "cn" ? "cn" : "";
  };

  const t = translations[lang];

  if (currentView === "admin") {
    return <AdminDashboard onBack={navigateToInvitation} />;
  }

  return (
    <div
      data-lang={lang}
      className="relative min-h-screen bg-brand-cream text-brand-charcoal overflow-x-hidden select-none font-sans antialiased"
      style={lang === "cn" ? ({ ["--font-serif" as string]: "var(--font-serif-cn)" }) : undefined}
    >
      {/* Subtle floating background audio player */}
      <AudioPlayer lang={lang} />

      {/* Screen reader helper */}
      <div className="sr-only">
        {lang === "cn" ? "Eva 与 Vincent 的婚礼请柬" : "Wedding Invitation of Eva and Vincent"}
      </div>

      {/* Premium Floating Language Switcher Capsule */}
      <div className="fixed top-6 right-6 z-40">
        <div className="flex items-center gap-1.5 bg-white border border-brand-rose/10 rounded-full px-1.5 py-1 shadow-xs hover:shadow-md transition-all">
          <button
            onClick={() => {
              window.location.hash = "en";
            }}
            className={`text-[10px] font-sans font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              lang === "en"
                ? "bg-brand-charcoal text-brand-cream shadow-xs"
                : "text-brand-charcoal/60 hover:text-brand-charcoal hover:bg-brand-blush/20"
            }`}
          >
            EN
          </button>
          <button
            onClick={() => {
              window.location.hash = "cn";
            }}
            className={`text-[10px] font-sans font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              lang === "cn"
                ? "bg-brand-charcoal text-brand-cream shadow-xs"
                : "text-brand-charcoal/60 hover:text-brand-charcoal hover:bg-brand-blush/20"
            }`}
          >
            中文
          </button>
        </div>
      </div>

      {/* Full-Height Sections */}
      <main>
        {/* 1. Landing Hero Section */}
        <HeroSection lang={lang} />

        {/* 2. Details & RSVP Section */}
        <DetailsSection onAttendClick={handleOpenModal} lang={lang} />

        {/* 3. Dress Code Section */}
        <DressCodeSection lang={lang} />
      </main>

      {/* Footer copyright with subtle guestbook administrative link */}
      <footer className="bg-transparent border-t border-brand-rose/10 py-12 px-6 text-center font-sans">
        <p className="text-xs text-brand-charcoal/50 tracking-widest uppercase">
          {t.footer.copyright}
        </p>
        <p className="text-[10px] text-brand-olive mt-2 tracking-widest">
          {t.footer.designed}
        </p>

        {/* Subtle, beautiful owner lock trigger */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={navigateToAdmin}
            className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-brand-charcoal/30 hover:text-brand-rose uppercase tracking-widest transition-colors duration-300 cursor-pointer p-1 rounded-sm focus:outline-none focus:ring-1 focus:ring-brand-rose"
            title="Secure Owner Access"
          >
            <Lock className="w-3 h-3" />
            <span>{t.footer.register}</span>
          </button>
        </div>
      </footer>

      {/* RSVP Form Modal */}
      <RSVPModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmitSuccess={handleRSVPSuccess}
        lang={lang}
      />

      {/* Elegant RSVP Success Toast Notification */}
      <AnimatePresence>
        {showToast && successData && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 left-6 sm:left-auto sm:max-w-md z-50 bg-white border border-brand-rose/20 rounded-2xl p-4 shadow-xl flex gap-3.5 items-start"
            id="rsvp-success-toast"
          >
            {/* Visual Checkmark Badge */}
            <div className="bg-brand-olive/10 text-brand-olive p-2 rounded-xl shrink-0 mt-0.5">
              <Check className="w-5 h-5 stroke-[2.5]" />
            </div>

            {/* Content text */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-brand-charcoal tracking-wide">
                {t.toast.title}
              </h4>
              
              {!successData.attending ? (
                <p className="text-xs text-brand-charcoal/70 leading-relaxed mt-1">
                  {lang === "cn" ? (
                    <>{t.toast.thankYou}，<span className="font-semibold text-brand-accent">{successData.guestName}</span>。很遗憾这次无法相聚，期待日后与您相见。</>
                  ) : (
                    <>{t.toast.thankYou}, <span className="font-semibold text-brand-accent">{successData.guestName}</span>. We're sorry you can't make it — we'll miss you and hope to celebrate together soon.</>
                  )}
                </p>
              ) : lang === "cn" ? (
                <p className="text-xs text-brand-charcoal/70 leading-relaxed mt-1">
                  {t.toast.thankYou}，<span className="font-semibold text-brand-accent">{successData.guestName}</span>！您的 {successData.guestCount} {t.toast.people} 出席答复已成功记入来宾名单。
                </p>
              ) : (
                <p className="text-xs text-brand-charcoal/70 leading-relaxed mt-1">
                  {t.toast.thankYou}, <span className="font-semibold text-brand-accent">{successData.guestName}</span>! {t.toast.registered} <span className="font-semibold">{successData.guestCount} {successData.guestCount === 1 ? t.toast.person : t.toast.people}</span> has been registered in our guest list.
                </p>
              )}

              <div className="flex items-center gap-1.5 mt-2.5 text-[10px] text-brand-olive tracking-wider uppercase font-medium">
                <Heart className="w-3 h-3 fill-current text-brand-rose animate-pulse" />
                <span>{t.toast.footer}</span>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowToast(false)}
              className="text-brand-charcoal/30 hover:text-brand-charcoal/70 transition-colors self-start p-1"
              aria-label="Close toast notification"
            >
              &times;
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
