import { RSVPFormData } from "./types";

const KEY = "wedding:my-rsvp";

// Remembers this device's own reply so a returning guest sees what they sent
// instead of a blank form. Firestore stays the source of truth for the couple —
// this is only ever used to render the guest's own summary back to them.
export function readMyRSVP(): RSVPFormData | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as RSVPFormData) : null;
  } catch {
    return null;
  }
}

export function saveMyRSVP(data: RSVPFormData) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // Private browsing or full quota. The reply already reached Firestore, so
    // the only cost is that this device won't remember it.
  }
}
