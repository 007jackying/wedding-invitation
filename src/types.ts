// Couple's WhatsApp contacts, shown to guests who need to change their reply.
// International format, digits only, no leading "+". Used to build wa.me links.
export const CONTACTS = [
  { name: "Eva", whatsapp: "60178688037" },
  { name: "Vincent", whatsapp: "60176384027" },
];

// 6-digit pin to view the guestlist. Set VITE_ADMIN_PIN at build time; unset = nobody gets in.
// ponytail: this ships in the client bundle, so it's a speed bump, not a secret.
export const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN;

export interface RSVPFormData {
  id: string;
  guestName: string;
  guestCount: number;
  phone: string;
  email?: string;
  dietChoice: "vegetarian" | "standard";
  attending: boolean;
  timestamp: string;
}

export interface RSVPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: (data: RSVPFormData) => void;
  lang: "en" | "cn";
  /** Invite code from ?g= — the Firestore doc id this reply is written back to. */
  code: string;
  /** Name the couple put on the invite; the guest can still correct it. */
  invitedName: string;
}

export interface TimelineItem {
  id: string;
  timeEn: string;
  textEn: string;
  timeCn: string;
  textCn: string;
  order: number;
}

