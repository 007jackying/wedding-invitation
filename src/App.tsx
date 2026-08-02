import { useState, useEffect } from "react";
import { Lock } from "lucide-react";
import HeroSection from "./components/HeroSection";
import DetailsSection from "./components/DetailsSection";
import DressCodeSection from "./components/DressCodeSection";
import RSVPModal from "./components/RSVPModal";
import AdminDashboard from "./components/AdminDashboard";
import AudioPlayer from "./components/AudioPlayer";
import ThankYouModal from "./components/ThankYouModal";
import { RSVPFormData } from "./types";
import { translations } from "./translations";
import { getRSVP } from "./firebase";

// Every guest gets a personal link, `?g=<code>`, where the code is their invite's
// Firestore document id. It's a search param rather than a hash so it composes
// with the language hashes below: ?g=k3d9x2#cn
const inviteCode = new URLSearchParams(window.location.search).get("g") ?? "";

export default function App() {
  const [currentView, setCurrentView] = useState<"invitation" | "admin">("invitation");
  const [lang, setLang] = useState<"en" | "cn">("en");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successData, setSuccessData] = useState<RSVPFormData | null>(null);
  // The invite this link points at: undefined while loading, null if the code is
  // missing or unrecognised. Looked up in Firestore, so a guest who already
  // replied sees their answer on any device, not just the one they replied from.
  const [invite, setInvite] = useState<RSVPFormData | null | undefined>(
    inviteCode ? undefined : null
  );

  useEffect(() => {
    if (!inviteCode) return;
    let cancelled = false;
    getRSVP(inviteCode)
      .catch((err) => {
        // Offline or Firestore down. Treated the same as an unknown code: the
        // guest is pointed at WhatsApp rather than at a form that can't save.
        console.error("Invite lookup failed:", err);
        return null;
      })
      .then((found) => {
        if (!cancelled) setInvite(found);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // An invite counts as answered once it carries a submission time.
  const myRSVP = invite && invite.timestamp ? invite : null;

  // Hash/Path routing to switch between English/Chinese view & Admin dashboard
  useEffect(() => {
    const handleRouting = () => {
      const hash = window.location.hash;
      const path = window.location.pathname;

      // 1. Owner Admin View takes priority
      if (hash === "#97+97=0201/admin") {
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
    // Guarded: without a resolved invite there is no document to write the reply to.
    if (invite) setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleRSVPSuccess = (data: RSVPFormData) => {
    setSuccessData(data);
    setInvite(data);
    setIsModalOpen(false);
  };

  const handleCloseThankYou = () => {
    setSuccessData(null);
    // Land them on the dress code once the note is dismissed, rather than
    // scrolling the page behind an open dialog.
    document.getElementById("dress-code")?.scrollIntoView({ behavior: "smooth" });
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
      className="relative min-h-screen bg-brand-cream text-brand-charcoal overflow-x-hidden font-sans antialiased"
      style={lang === "cn" ? ({ ["--font-serif" as string]: "var(--font-serif-cn)" }) : undefined}
    >
      {/* Subtle floating background audio player */}
      <AudioPlayer lang={lang} />

      {/* Screen reader helper */}
      <div className="sr-only">
        {lang === "cn" ? "Eva 与 Vincent 的婚礼请柬" : "Wedding Invitation of Eva and Vincent"}
      </div>

      {/* Premium Floating Language Switcher Capsule */}
      <div className="fixed top-10 right-5 sm:top-16 sm:right-10 z-40">
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
        <HeroSection
          lang={lang}
          myRSVP={myRSVP}
          canRSVP={invite !== null}
          onAttendClick={handleOpenModal}
        />

        {/* 2. Details & RSVP Section */}
        <DetailsSection
          onAttendClick={handleOpenModal}
          lang={lang}
          myRSVP={myRSVP}
          canRSVP={invite !== null}
        />

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

      {/* RSVP Form Modal — only mounted once we know which invite it writes to,
          which also seeds the name field with the one on the invite. */}
      {invite && (
        <RSVPModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmitSuccess={handleRSVPSuccess}
          lang={lang}
          code={invite.id}
          invitedName={invite.guestName}
        />
      )}

      {/* Thank-you note shown once the reply is safely saved */}
      <ThankYouModal data={successData} lang={lang} onClose={handleCloseThankYou} />

    </div>
  );
}
