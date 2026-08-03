import { Check, X } from "lucide-react";
import { track } from "@vercel/analytics";
import { CONTACTS, RSVPFormData } from "../types";
import { translations } from "../translations";

type Tone = "light" | "dark";

interface RSVPSummaryProps {
  rsvp: RSVPFormData;
  lang: "en" | "cn";
  /** "dark" over a photo or the charcoal reply band; "light" on the sand ground. */
  tone?: Tone;
}

// The card appears on two grounds now — the sand hero column and the charcoal
// reply band — so every colour it uses is picked per ground rather than assumed.
const TONES: Record<Tone, Record<string, string>> = {
  dark: {
    card: "mx-auto max-w-xs rounded-2xl border border-brand-gold/40 bg-black/40 backdrop-blur-sm px-5 py-4 text-center",
    yes: "bg-brand-gold text-brand-charcoal",
    no: "bg-brand-cream/25 text-brand-cream",
    status: "text-brand-cream",
    name: "text-brand-cream",
    meta: "text-brand-cream/70",
    hint: "text-brand-cream/60",
    body: "text-brand-cream/70",
    pill: "border-brand-gold/40 text-brand-cream hover:bg-brand-cream/10 hover:border-brand-gold focus:ring-brand-gold/60",
    row: "justify-center",
  },
  light: {
    card: "max-w-sm rounded-2xl border border-brand-rose/25 bg-white px-5 py-4 shadow-xs",
    yes: "bg-brand-accent text-brand-cream",
    no: "bg-brand-charcoal/15 text-brand-charcoal",
    status: "text-brand-charcoal",
    name: "text-brand-charcoal",
    meta: "text-brand-olive",
    hint: "text-brand-olive",
    body: "text-brand-charcoal/75",
    pill: "border-brand-rose/30 text-brand-charcoal hover:bg-brand-blush/50 hover:border-brand-rose focus:ring-brand-rose/50",
    row: "justify-start",
  },
};

// lucide ships no brand marks and there's no icon package installed, so the
// WhatsApp glyph is inlined here — it isn't used anywhere else.
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 6.988 2.896 9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.82 11.82 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.9 11.9 0 0 0 5.688 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

// Shown in place of the RSVP button once this device has replied. Both places
// it appears (hero photo, details band) are dark grounds, so there's one variant.
export default function RSVPSummary({ rsvp, lang, tone = "dark" }: RSVPSummaryProps) {
  const t = translations[lang].rsvp;
  const c = TONES[tone];
  const countLabel = rsvp.guestCount === 1 ? t.guest : t.guests;
  const diet = rsvp.dietChoice === "vegetarian" ? t.vegetarian : t.standard;

  return (
    <div className={`w-full ${c.card}`}>
      <div className={`flex items-center gap-2 ${c.row}`}>
        <span
          className={`flex items-center justify-center w-5 h-5 rounded-full shrink-0 ${
            rsvp.attending ? c.yes : c.no
          }`}
        >
          {rsvp.attending ? (
            <Check className="w-3 h-3 stroke-[3]" />
          ) : (
            <X className="w-3 h-3 stroke-[3]" />
          )}
        </span>
        <span className={`font-sans font-semibold text-[11px] tracking-[0.18em] uppercase ${c.status}`}>
          {rsvp.attending ? t.attending : t.notAttending}
        </span>
      </div>

      <p className={`mt-3 font-serif text-lg leading-tight break-words ${c.name}`}>
        {rsvp.guestName}
      </p>

      {rsvp.attending && (
        <p className={`mt-1 font-sans text-xs tabular-nums ${c.meta}`}>
          {rsvp.guestCount} {countLabel} · {diet}
        </p>
      )}

      {/* Changing a reply goes through the couple directly — there is no
          in-app edit, which also keeps guests from filing a duplicate. */}
      <p className={`mt-4 font-sans text-[10px] tracking-[0.15em] uppercase ${c.hint}`}>
        {t.change}
      </p>
      <ContactLinks
        lang={lang}
        tone={tone}
        message={(name) =>
          lang === "cn"
            ? `${name} 您好，我是 ${rsvp.guestName}，想修改婚礼出席答复。`
            : `Hi ${name}, this is ${rsvp.guestName}. I'd like to update my reply for the wedding.`
        }
      />
    </div>
  );
}

// Both cards below hand the guest off to WhatsApp; only the prefilled message
// differs, so the row of contact buttons is written once.
function ContactLinks({
  lang,
  message,
  tone,
}: {
  lang: "en" | "cn";
  message: (contactName: string) => string;
  tone: Tone;
}) {
  const c = TONES[tone];
  return (
    <div className={`mt-2 flex flex-wrap gap-2 ${c.row}`}>
      {CONTACTS.map((contact) => (
        <a
          key={contact.name}
          href={`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message(contact.name))}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("WhatsApp Contact Clicked", { contact: contact.name })}
          aria-label={
            lang === "cn"
              ? `通过 WhatsApp 联系${contact.name}`
              : `Message ${contact.name} on WhatsApp`
          }
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-sans font-semibold text-[11px] tracking-[0.1em] transition-colors focus:outline-none focus:ring-2 ${c.pill}`}
        >
          <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
          {contact.name}
        </a>
      ))}
    </div>
  );
}

/**
 * Shown in place of the RSVP button when the visitor arrived without a valid
 * `?g=` code. Replying requires a personal invite link, so the only thing to
 * offer is a way to ask the couple for one.
 */
export function NeedInvite({ lang, tone = "dark" }: { lang: "en" | "cn"; tone?: Tone }) {
  const t = translations[lang].rsvp;
  const c = TONES[tone];

  return (
    <div className={`w-full ${c.card}`}>
      <p className={`font-sans font-semibold text-[11px] tracking-[0.18em] uppercase ${c.status}`}>
        {t.needInviteTitle}
      </p>
      <p className={`mt-3 font-sans text-xs leading-relaxed ${c.body}`}>
        {t.needInviteBody}
      </p>
      <ContactLinks
        lang={lang}
        tone={tone}
        message={(name) =>
          lang === "cn"
            ? `${name} 您好，可以把我的婚礼请柬专属链接发给我吗？`
            : `Hi ${name}, could you send me my personal wedding invite link?`
        }
      />
    </div>
  );
}
