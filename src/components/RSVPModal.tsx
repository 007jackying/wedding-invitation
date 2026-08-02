import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Heart, Loader2, Phone, Mail, User, Users, Leaf, Utensils } from "lucide-react";
import { track } from "@vercel/analytics";
import { RSVPFormData, RSVPModalProps } from "../types";
import { translations } from "../translations";
import { updateRSVP } from "../firebase";

export default function RSVPModal({ isOpen, onClose, onSubmitSuccess, lang, code, invitedName }: RSVPModalProps) {
  const t = translations[lang].modal;

  const [guestName, setGuestName] = useState(invitedName);
  const [guestCount, setGuestCount] = useState<number | "">("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [dietChoice, setDietChoice] = useState<"vegetarian" | "standard">("standard");
  const [attending, setAttending] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!guestName.trim()) {
      setError(lang === "cn" ? "请输入您的真实姓名" : "Please enter your full name");
      return;
    }

    if (attending) {
      if (!phone.trim()) {
        setError(lang === "cn" ? "请输入您的电话号码" : "Please enter your phone number");
        return;
      }

      if (guestCount === "" || guestCount < 1) {
        setError(lang === "cn" ? "请填写至少1位来宾出席" : "Please specify at least 1 person attending");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Fill in the invite this guest was sent, rather than creating a new doc —
      // the code in their link IS the document id. A failure here has to reach
      // the guest rather than be swallowed.
      const submittedData: RSVPFormData = {
        id: code,
        guestName: guestName.trim(),
        // A decline carries no party size, phone or diet — see the `attending` guard above.
        guestCount: attending ? Number(guestCount) : 0,
        phone: attending ? phone.trim() : "",
        email: attending ? email.trim() : "",
        dietChoice: attending ? dietChoice : "standard",
        attending,
        timestamp: new Date().toLocaleString(),
      };
      const { id: _id, ...fields } = submittedData;
      await updateRSVP(code, fields);

      track("RSVP Submitted", {
        attending,
        guestCount: submittedData.guestCount,
        dietChoice: submittedData.dietChoice,
      });

      // Close modal & trigger success sequence
      onSubmitSuccess(submittedData);
    } catch (err) {
      console.error("RSVP save failed:", err);
      setError(
        lang === "cn"
          ? "答复未能送出。请检查网络后重新提交，或直接与我们联系。"
          : "Your reply didn't send. Check your connection and submit again, or message us directly."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur Overlay */}
          <motion.div
            id="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-charcoal/40 backdrop-blur-md"
          />

          {/* Modal Card Content */}
          <motion.div
            id="modal-content"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full max-w-lg bg-brand-cream border border-brand-rose/20 rounded-2xl p-6 sm:p-8 shadow-2xl z-10 overflow-hidden"
          >
            {/* Top decorative accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-gold via-brand-rose to-brand-olive" />

            {/* Close Button */}
            <button
              id="close-modal-btn"
              onClick={onClose}
              className="absolute top-4 right-4 text-brand-charcoal/40 hover:text-brand-charcoal transition-colors rounded-full p-1.5 hover:bg-brand-charcoal/5 focus:outline-none focus:ring-2 focus:ring-brand-rose"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-6 mt-2">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-blush/40 rounded-full mb-3 text-brand-rose">
                <Heart className="w-6 h-6 fill-current" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif text-brand-charcoal tracking-wide">
                {t.title}
              </h2>
              <p className="text-xs text-brand-olive font-sans tracking-widest uppercase mt-1">
                {t.subtitle}
              </p>
            </div>

            {/* RSVP Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Attendance choice — lets guests who can't come reply too */}
              <div>
                <span className="flex items-center gap-1.5 text-xs font-sans font-semibold text-brand-charcoal/75 tracking-wider uppercase mb-1.5">
                  <Heart className="w-3.5 h-3.5 text-brand-rose" />
                  {lang === "cn" ? "您能出席吗？" : "Will you join us?"}
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setAttending(true)}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 cursor-pointer ${
                      attending
                        ? "border-brand-rose bg-brand-rose/10 text-brand-charcoal shadow-xs"
                        : "border-brand-rose/25 bg-white text-brand-charcoal/60 hover:bg-brand-cream/40"
                    }`}
                  >
                    {lang === "cn" ? "欣然赴约" : "Joyfully accepts"}
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setAttending(false)}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 cursor-pointer ${
                      !attending
                        ? "border-brand-rose bg-brand-rose/10 text-brand-charcoal shadow-xs"
                        : "border-brand-rose/25 bg-white text-brand-charcoal/60 hover:bg-brand-cream/40"
                    }`}
                  >
                    {lang === "cn" ? "抱歉缺席" : "Regretfully declines"}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="guest-name"
                  className="flex items-center gap-1.5 text-xs font-sans font-semibold text-brand-charcoal/75 tracking-wider uppercase mb-1.5"
                >
                  <User className="w-3.5 h-3.5 text-brand-rose" />
                  {t.fullName}
                </label>
                <input
                  id="guest-name"
                  type="text"
                  required
                  disabled={isSubmitting}
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder={lang === "cn" ? "例如：张伟" : "e.g. John Doe"}
                  className="w-full px-4 py-3 bg-white border border-brand-rose/25 rounded-xl font-sans text-sm placeholder-brand-charcoal/30 text-brand-charcoal focus:outline-none focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/15 transition-all disabled:opacity-50"
                />
              </div>

              {attending && (
              <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="guest-phone"
                    className="flex items-center gap-1.5 text-xs font-sans font-semibold text-brand-charcoal/75 tracking-wider uppercase mb-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-brand-rose" />
                    {t.phone}
                  </label>
                  <input
                    id="guest-phone"
                    type="tel"
                    required
                    disabled={isSubmitting}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={lang === "cn" ? "例如：13800000000" : "e.g. +1 234 567 890"}
                    className="w-full px-4 py-3 bg-white border border-brand-rose/25 rounded-xl font-sans text-sm placeholder-brand-charcoal/30 text-brand-charcoal focus:outline-none focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/15 transition-all disabled:opacity-50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="guest-count"
                    className="flex items-center gap-1.5 text-xs font-sans font-semibold text-brand-charcoal/75 tracking-wider uppercase mb-1.5"
                  >
                    <Users className="w-3.5 h-3.5 text-brand-rose" />
                    {t.guestCount}
                  </label>
                  <input
                    id="guest-count"
                    type="number"
                    min="1"
                    max="10"
                    required
                    disabled={isSubmitting}
                    value={guestCount}
                    onChange={(e) => {
                      const val = e.target.value;
                      setGuestCount(val === "" ? "" : Number(val));
                    }}
                    placeholder="e.g. 2"
                    className="w-full px-4 py-3 bg-white border border-brand-rose/25 rounded-xl font-sans text-sm placeholder-brand-charcoal/30 text-brand-charcoal focus:outline-none focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/15 transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="guest-email"
                  className="flex items-center gap-1.5 text-xs font-sans font-semibold text-brand-charcoal/75 tracking-wider uppercase mb-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-brand-rose" />
                  {t.email} <span className="text-[10px] text-brand-olive font-normal italic lowercase">{t.emailOptional}</span>
                </label>
                <input
                  id="guest-email"
                  type="email"
                  disabled={isSubmitting}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. johndoe@example.com"
                  className="w-full px-4 py-3 bg-white border border-brand-rose/25 rounded-xl font-sans text-sm placeholder-brand-charcoal/30 text-brand-charcoal focus:outline-none focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/15 transition-all disabled:opacity-50"
                />
              </div>

              {/* Diet Choice */}
              <div>
                <label
                  className="flex items-center gap-1.5 text-xs font-sans font-semibold text-brand-charcoal/75 tracking-wider uppercase mb-1.5"
                >
                  <Leaf className="w-3.5 h-3.5 text-brand-rose" />
                  {t.dietChoice}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    id="diet-standard-btn"
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setDietChoice("standard")}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 cursor-pointer ${
                      dietChoice === "standard"
                        ? "border-brand-rose bg-brand-rose/10 text-brand-charcoal shadow-xs"
                        : "border-brand-rose/25 bg-white text-brand-charcoal/60 hover:bg-brand-cream/40"
                    }`}
                  >
                    <Utensils className="w-4 h-4 text-brand-olive" />
                    <span>{t.dietNonVegetarian}</span>
                  </button>
                  <button
                    id="diet-vegetarian-btn"
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setDietChoice("vegetarian")}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 cursor-pointer ${
                      dietChoice === "vegetarian"
                        ? "border-brand-rose bg-brand-rose/10 text-brand-charcoal shadow-xs"
                        : "border-brand-rose/25 bg-white text-brand-charcoal/60 hover:bg-brand-cream/40"
                    }`}
                  >
                    <Leaf className="w-4 h-4 text-brand-olive" />
                    <span>{t.dietVegetarian}</span>
                  </button>
                </div>
              </div>
              </>
              )}

              {/* Action Buttons */}
              <div className="pt-2">
                {error && (
                  <p className="text-xs text-rose-500 font-sans mb-3 text-center bg-rose-50 border border-rose-100 py-1.5 rounded-lg animate-fade-in">
                    {error}
                  </p>
                )}

                <button
                  id="submit-rsvp-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full relative flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-charcoal text-brand-cream hover:bg-brand-olive transition-colors duration-300 font-sans font-medium text-sm rounded-xl tracking-widest uppercase cursor-pointer hover:shadow-lg hover:shadow-brand-charcoal/10 active:scale-[0.98] disabled:opacity-75 focus:outline-none focus:ring-2 focus:ring-brand-olive focus:ring-offset-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t.submitting}
                    </>
                  ) : (
                    t.submit
                  )}
                </button>
              </div>

            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
