import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDoc,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  onSnapshot,
  type DocumentData,
  type DocumentSnapshot
} from "firebase/firestore";
import { RSVPFormData, TimelineItem } from "./types";
import firebaseConfigJson from "../firebase-applet-config.json";

// Initialize Firebase using values from the config file
const firebaseConfig = {
  apiKey: firebaseConfigJson.apiKey,
  authDomain: firebaseConfigJson.authDomain,
  projectId: firebaseConfigJson.projectId,
  storageBucket: firebaseConfigJson.storageBucket,
  messagingSenderId: firebaseConfigJson.messagingSenderId,
  appId: firebaseConfigJson.appId,
};

const app = initializeApp(firebaseConfig);

// Use the specific firestoreDatabaseId specified in our config
export const db = getFirestore(app, firebaseConfigJson.firestoreDatabaseId || "(default)");

const COLLECTION_NAME = "rsvps";
const TIMELINE_COLLECTION = "timeline";

// Invite codes double as the Firestore document id, so they live in URLs and get
// read out over the phone: no 0/1/i/l/o, nothing case-sensitive to mishear.
const CODE_ALPHABET = "23456789abcdefghjkmnpqrstuvwxyz";
const CODE_LENGTH = 6;

function generateInviteCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(CODE_LENGTH));
  return Array.from(bytes, (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join("");
}

/**
 * Shape a Firestore document into an RSVPFormData. An empty `timestamp` is the
 * marker for an invite that has been sent but not yet answered — see SCHEMA.md.
 */
function toRSVP(docSnap: DocumentSnapshot<DocumentData>): RSVPFormData {
  const data = docSnap.data() ?? {};
  return {
    id: docSnap.id,
    guestName: data.guestName || "",
    guestCount: data.guestCount || 0,
    phone: data.phone || "",
    email: data.email || undefined,
    dietChoice: data.dietChoice || "standard",
    attending: data.attending ?? true,
    timestamp: data.timestamp ?? "",
  };
}

/**
 * Create a pending invite. The generated code is the document id, so the guest's
 * personal link is just `?g=<returned id>`.
 */
export async function createInvite(guestName: string): Promise<RSVPFormData> {
  const invite = {
    guestName,
    guestCount: 0,
    phone: "",
    email: "",
    dietChoice: "standard" as const,
    attending: false,
    timestamp: "", // "" = invited, not yet replied
  };
  const code = generateInviteCode();
  await setDoc(doc(db, COLLECTION_NAME, code), invite);
  return { ...invite, id: code };
}

/**
 * Look up a single invite by its code. Returns null for codes that don't exist,
 * so a mistyped link can be told apart from a network failure (which throws).
 */
export async function getRSVP(code: string): Promise<RSVPFormData | null> {
  const docSnap = await getDoc(doc(db, COLLECTION_NAME, code));
  return docSnap.exists() ? toRSVP(docSnap) : null;
}

/**
 * Fetch all RSVP submissions from Firestore, ordered by timestamp desc or created time
 */
export async function getRSVPs(): Promise<RSVPFormData[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME));
    const querySnapshot = await getDocs(q);
    const results: RSVPFormData[] = [];

    querySnapshot.forEach((docSnap) => {
      results.push(toRSVP(docSnap));
    });

    // Sort by timestamp if possible, otherwise keep natural order
    return results.sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return isNaN(timeB) || isNaN(timeA) ? 0 : timeB - timeA;
    });
  } catch (error) {
    console.error("Error getting RSVPs from Firestore:", error);
    throw error;
  }
}

/**
 * Real-time listener subscription for RSVP submissions
 */
export function onRSVPsSnapshot(callback: (items: RSVPFormData[]) => void): () => void {
  const q = query(collection(db, COLLECTION_NAME));
  return onSnapshot(q, (querySnapshot) => {
    const results: RSVPFormData[] = [];
    querySnapshot.forEach((docSnap) => {
      results.push(toRSVP(docSnap));
    });

    results.sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return isNaN(timeB) || isNaN(timeA) ? 0 : timeB - timeA;
    });

    callback(results);
  }, (err) => {
    console.error("Error subscribing to RSVPs:", err);
  });
}

/**
 * Update an existing RSVP submission in Firestore
 */
export async function updateRSVP(id: string, updates: Partial<Omit<RSVPFormData, "id">>): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...updates
    });
  } catch (error) {
    console.error("Error updating RSVP in Firestore:", error);
    throw error;
  }
}

/**
 * Delete an RSVP submission from Firestore
 */
export async function deleteRSVP(id: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting RSVP from Firestore:", error);
    throw error;
  }
}

/**
 * Delete all RSVP submissions from Firestore
 */
export async function clearAllRSVPs(): Promise<void> {
  try {
    const q = query(collection(db, COLLECTION_NAME));
    const querySnapshot = await getDocs(q);
    const deletePromises: Promise<void>[] = [];
    querySnapshot.forEach((docSnap) => {
      deletePromises.push(deleteDoc(doc(db, COLLECTION_NAME, docSnap.id)));
    });
    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Error clearing RSVPs from Firestore:", error);
    throw error;
  }
}

/**
 * Fetch all timeline events from Firestore, sorted by order index
 */
export async function getTimeline(): Promise<TimelineItem[]> {
  try {
    const q = query(collection(db, TIMELINE_COLLECTION));
    const querySnapshot = await getDocs(q);
    const results: TimelineItem[] = [];
    
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      results.push({
        id: docSnap.id,
        timeEn: data.timeEn || "",
        textEn: data.textEn || "",
        timeCn: data.timeCn || "",
        textCn: data.textCn || "",
        order: data.order ?? 99,
      });
    });

    return results.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error("Error getting timeline from Firestore:", error);
    throw error;
  }
}

/**
 * Real-time listener subscription for timeline events
 */
export function onTimelineSnapshot(callback: (items: TimelineItem[]) => void): () => void {
  const q = query(collection(db, TIMELINE_COLLECTION));
  return onSnapshot(q, (querySnapshot) => {
    const results: TimelineItem[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      results.push({
        id: docSnap.id,
        timeEn: data.timeEn || "",
        textEn: data.textEn || "",
        timeCn: data.timeCn || "",
        textCn: data.textCn || "",
        order: data.order ?? 99,
      });
    });

    results.sort((a, b) => a.order - b.order);
    callback(results);
  }, (err) => {
    console.error("Error subscribing to timeline:", err);
  });
}

/**
 * Update an existing timeline event
 */
export async function updateTimelineItem(id: string, updates: Partial<TimelineItem>): Promise<void> {
  try {
    const docRef = doc(db, TIMELINE_COLLECTION, id);
    await updateDoc(docRef, { ...updates });
  } catch (error) {
    console.error("Error updating timeline item:", error);
    throw error;
  }
}

/**
 * Add a new timeline event
 */
export async function addTimelineItem(item: Omit<TimelineItem, "id">): Promise<TimelineItem> {
  try {
    const docRef = await addDoc(collection(db, TIMELINE_COLLECTION), {
      timeEn: item.timeEn,
      textEn: item.textEn,
      timeCn: item.timeCn,
      textCn: item.textCn,
      order: item.order,
    });
    return {
      ...item,
      id: docRef.id,
    };
  } catch (error) {
    console.error("Error adding timeline item:", error);
    throw error;
  }
}

/**
 * Delete a timeline event
 */
export async function deleteTimelineItem(id: string): Promise<void> {
  try {
    const docRef = doc(db, TIMELINE_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting timeline item:", error);
    throw error;
  }
}
