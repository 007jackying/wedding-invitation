import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  setDoc, 
  onSnapshot 
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

export const DEFAULT_TIMELINE: TimelineItem[] = [
  {
    id: "item1",
    timeEn: "06:00 PM",
    textEn: "Photo Session",
    timeCn: "晚上 06:00",
    textCn: "拍照环节",
    order: 1
  },
  {
    id: "item2",
    timeEn: "07:00 PM",
    textEn: "Ceremony Begins",
    timeCn: "晚上 07:00",
    textCn: "婚礼仪式开始",
    order: 2
  },
  {
    id: "item3",
    timeEn: "10:00 PM",
    textEn: "Dinner Ends & Thank You",
    timeCn: "晚上 10:00",
    textCn: "晚宴结束 · 答谢来宾",
    order: 3
  },
  {
    id: "item4",
    timeEn: "10:30 PM",
    textEn: "Farewell",
    timeCn: "晚上 10:30",
    textCn: "送客离场",
    order: 4
  }
];

/**
 * Fetch all RSVP submissions from Firestore, ordered by timestamp desc or created time
 */
export async function getRSVPs(): Promise<RSVPFormData[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME));
    const querySnapshot = await getDocs(q);
    const results: RSVPFormData[] = [];
    
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      results.push({
        id: docSnap.id,
        guestName: data.guestName || "",
        guestCount: data.guestCount || 0,
        phone: data.phone || "",
        email: data.email || undefined,
        dietChoice: data.dietChoice || "standard",
        attending: data.attending ?? true,
        timestamp: data.timestamp || new Date().toLocaleString(),
      });
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
      const data = docSnap.data();
      results.push({
        id: docSnap.id,
        guestName: data.guestName || "",
        guestCount: data.guestCount || 0,
        phone: data.phone || "",
        email: data.email || undefined,
        dietChoice: data.dietChoice || "standard",
        attending: data.attending ?? true,
        timestamp: data.timestamp || new Date().toLocaleString(),
      });
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
 * Add a new RSVP submission to Firestore
 */
export async function addRSVP(rsvp: Omit<RSVPFormData, "id">): Promise<RSVPFormData> {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      guestName: rsvp.guestName,
      guestCount: rsvp.guestCount,
      phone: rsvp.phone,
      email: rsvp.email || "",
      dietChoice: rsvp.dietChoice,
      attending: rsvp.attending,
      timestamp: rsvp.timestamp,
    });
    return {
      ...rsvp,
      id: docRef.id,
    };
  } catch (error) {
    console.error("Error adding RSVP to Firestore:", error);
    throw error;
  }
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
 * Helper to seed the database with mock guests if it's empty
 */
export async function seedRSVPsIfEmpty(mockGuests: RSVPFormData[]): Promise<RSVPFormData[]> {
  try {
    const current = await getRSVPs();
    if (current.length === 0) {
      const seeded: RSVPFormData[] = [];
      for (const guest of mockGuests) {
        const { id, ...rest } = guest;
        const docRef = doc(collection(db, COLLECTION_NAME));
        await setDoc(docRef, {
          ...rest
        });
        seeded.push({
          ...rest,
          id: docRef.id
        });
      }
      return seeded;
    }
    return current;
  } catch (error) {
    console.error("Error seeding RSVPs:", error);
    return mockGuests;
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

/**
 * Seeds the timeline collection if empty
 */
export async function seedTimelineIfEmpty(): Promise<TimelineItem[]> {
  try {
    const current = await getTimeline();
    if (current.length === 0) {
      const seeded: TimelineItem[] = [];
      for (const item of DEFAULT_TIMELINE) {
        const { id, ...rest } = item;
        const docRef = doc(db, TIMELINE_COLLECTION, id);
        await setDoc(docRef, {
          ...rest
        });
        seeded.push({
          ...rest,
          id: docRef.id
        });
      }
      return seeded;
    }
    return current;
  } catch (error) {
    console.error("Error seeding timeline:", error);
    return DEFAULT_TIMELINE;
  }
}
