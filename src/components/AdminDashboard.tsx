import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldCheck,
  Search,
  Download,
  Trash2,
  ArrowLeft,
  Users,
  CheckCircle,
  Phone,
  Mail,
  Calendar,
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  Edit2,
  Save,
  X,
  ArrowUpDown,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Link2 as LinkIcon
} from "lucide-react";
import { ADMIN_PIN, RSVPFormData, TimelineItem } from "../types";
import {
  createInvite,
  updateRSVP,
  deleteRSVP,
  clearAllRSVPs,
  onRSVPsSnapshot,
  onTimelineSnapshot,
  updateTimelineItem,
  deleteTimelineItem,
  addTimelineItem
} from "../firebase";

interface AdminDashboardProps {
  onBack: () => void;
}

export default function AdminDashboard({ onBack }: AdminDashboardProps) {
  // ponytail: skip the PIN gate on the local dev server
  const [isAuthenticated, setIsAuthenticated] = useState(import.meta.env.DEV);
  const [pin, setPin] = useState<string[]>(Array(6).fill(""));
  const [pinError, setPinError] = useState(false);
  const [showPin, setShowPin] = useState(false);
  
  const [submissions, setSubmissions] = useState<RSVPFormData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // Dashboard Tab state
  const [activeTab, setActiveTab] = useState<"guests" | "timeline">("guests");

  // Sorting state for guest register
  const [sortField, setSortField] = useState<"guestName" | "guestCount" | "phone" | "email" | "dietChoice" | "timestamp" | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Deletion state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
  const [isClearAllOpen, setIsClearAllOpen] = useState(false);
  const [clearAllConfirmationText, setClearAllConfirmationText] = useState("");

  // RSVP Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editCount, setEditCount] = useState<number>(1);
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editDiet, setEditDiet] = useState<"vegetarian" | "standard">("standard");

  // For creating a new invite (name only — the guest fills in the rest)
  const [isAddingGuest, setIsAddingGuest] = useState(false);
  const [newGuestName, setNewGuestName] = useState("");

  // Timeline state
  const [timelineList, setTimelineList] = useState<TimelineItem[]>([]);
  const [editingTimelineId, setEditingTimelineId] = useState<string | null>(null);
  const [editTimeEn, setEditTimeEn] = useState("");
  const [editTimeCn, setEditTimeCn] = useState("");
  const [editTxtEn, setEditTxtEn] = useState("");
  const [editTxtCn, setEditTxtCn] = useState("");
  const [editOrder, setEditOrder] = useState<number>(0);

  // For adding a new timeline item
  const [newTimeEn, setNewTimeEn] = useState("");
  const [newTimeCn, setNewTimeCn] = useState("");
  const [newTxtEn, setNewTxtEn] = useState("");
  const [newTxtCn, setNewTxtCn] = useState("");
  const [newOrder, setNewOrder] = useState<number>(5);
  const [isAddingTimeline, setIsAddingTimeline] = useState(false);

  const pinInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // 1. Load submissions from Firebase Firestore in real-time
  useEffect(() => {
    setIsLoading(true);
    // One-time cleanup of any previously-seeded mock guests still sitting in Firestore
    Promise.all(
      ["rsvp_mock1", "rsvp_mock2", "rsvp_mock3", "rsvp_mock4"].map((id) =>
        deleteRSVP(id).catch(() => {})
      )
    ).finally(() => setIsLoading(false));

    // Setup real-time listener for RSVPs
    const unsubscribe = onRSVPsSnapshot((data) => {
      setSubmissions(data);
    });

    return () => unsubscribe();
  }, []);

  // 2. Load wedding timeline events in real-time
  useEffect(() => {
    if (!isAuthenticated) return;

    // Setup real-time listener for Timeline items
    const unsubscribe = onTimelineSnapshot((items) => {
      setTimelineList(items);
    });

    return () => unsubscribe();
  }, [isAuthenticated]);

  // Handle auto-focus and digits validation for PIN
  const handlePinChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return; // Only allow digits

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setPinError(false);

    // Auto focus next input
    if (value !== "" && index < 5) {
      pinInputsRef.current[index + 1]?.focus();
    }

    // Check complete PIN code
    const fullPin = newPin.join("");
    if (fullPin.length === 6) {
      if (fullPin === ADMIN_PIN) {
        setIsAuthenticated(true);
        triggerToast("Login Successful! Welcome, Eva & Vincent.");
      } else {
        setPinError(true);
        setPin(Array(6).fill(""));
        pinInputsRef.current[0]?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && pin[index] === "" && index > 0) {
      const newPin = [...pin];
      newPin[index - 1] = "";
      setPin(newPin);
      pinInputsRef.current[index - 1]?.focus();
    }
  };

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const startEditing = (sub: RSVPFormData) => {
    setEditingId(sub.id);
    setEditName(sub.guestName);
    setEditCount(sub.guestCount);
    setEditPhone(sub.phone);
    setEditEmail(sub.email || "");
    setEditDiet(sub.dietChoice || "standard");
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editName.trim()) {
      alert("Name cannot be empty");
      return;
    }
    // 0 is how a decline is recorded on the guest's behalf, so it's allowed here
    // even though the guest-facing form requires at least 1 to accept.
    if (editCount < 0) {
      alert("Party size cannot be negative");
      return;
    }

    // Editing a still-pending invite is how a reply given by phone or in person
    // gets recorded, so it counts as that guest's answer from here on.
    const wasPending = submissions.find((sub) => sub.id === id)?.timestamp === "";

    const updates = {
      guestName: editName.trim(),
      guestCount: Number(editCount),
      phone: editPhone.trim(),
      email: editEmail.trim() || "",
      dietChoice: editDiet,
      ...(wasPending
        ? { attending: editCount > 0, timestamp: new Date().toLocaleString() }
        : {}),
    };

    setIsLoading(true);
    try {
      await updateRSVP(id, updates);
    } catch (err) {
      console.warn("Could not save to Firebase, updating locally only:", err);
    }

    const updatedSubmissions = submissions.map((sub) => {
      if (sub.id === id) {
        return {
          ...sub,
          ...updates,
        };
      }
      return sub;
    });

    setSubmissions(updatedSubmissions);
    setEditingId(null);
    setIsLoading(false);
    triggerToast("Reply updated");
  };

  // Adding a guest creates a pending invite — a name and a link, nothing else.
  // The rest of the row is whatever the guest themselves fills in; if a reply
  // arrives by phone instead, type it into the row with the inline editor.
  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) {
      alert("Guest name cannot be empty");
      return;
    }

    setIsLoading(true);
    try {
      const created = await createInvite(newGuestName.trim());
      await copyInviteLink(created.id, `Invite created — link copied for ${created.guestName}`);
      setNewGuestName("");
      setIsAddingGuest(false);
    } catch (err) {
      console.error(err);
      alert("Failed to add guest.");
    } finally {
      setIsLoading(false);
    }
  };

  const inviteLink = (code: string) =>
    `${window.location.origin}${window.location.pathname}?g=${code}`;

  const copyInviteLink = async (code: string, message = "Invite link copied") => {
    const link = inviteLink(code);
    try {
      await navigator.clipboard.writeText(link);
      triggerToast(message);
    } catch {
      // Clipboard needs a secure context and permission; show the link so the
      // couple can still copy it by hand rather than losing it.
      window.prompt("Copy this guest's invite link:", link);
    }
  };

  const handleSort = (field: "guestName" | "guestCount" | "phone" | "email" | "dietChoice" | "timestamp") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteRSVP(id);
    } catch (err) {
      console.warn("Could not delete from Firebase, removing locally only:", err);
    }
    const updated = submissions.filter((sub) => sub.id !== id);
    setSubmissions(updated);
    setIsLoading(false);
    setDeleteId(null);
    setDeleteConfirmationText("");
    triggerToast("RSVP response removed successfully");
  };

  const handleSaveTimelineEdit = async (id: string) => {
    if (!editTimeEn.trim() || !editTxtEn.trim() || !editTimeCn.trim() || !editTxtCn.trim()) {
      alert("Please fill out all fields.");
      return;
    }

    setIsLoading(true);
    try {
      await updateTimelineItem(id, {
        timeEn: editTimeEn.trim(),
        textEn: editTxtEn.trim(),
        timeCn: editTimeCn.trim(),
        textCn: editTxtCn.trim(),
        order: Number(editOrder),
      });
      triggerToast("Timeline item updated successfully!");
      setEditingTimelineId(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update timeline item.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTimelineItem = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this timeline event?")) {
      setIsLoading(true);
      try {
        await deleteTimelineItem(id);
        triggerToast("Timeline item deleted successfully!");
      } catch (err) {
        console.error(err);
        alert("Failed to delete timeline item.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAddTimelineItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTimeEn.trim() || !newTxtEn.trim() || !newTimeCn.trim() || !newTxtCn.trim()) {
      alert("Please fill out all fields.");
      return;
    }

    setIsLoading(true);
    try {
      await addTimelineItem({
        timeEn: newTimeEn.trim(),
        textEn: newTxtEn.trim(),
        timeCn: newTimeCn.trim(),
        textCn: newTxtCn.trim(),
        order: Number(newOrder),
      });
      triggerToast("Timeline item added successfully!");
      setNewTimeEn("");
      setNewTxtEn("");
      setNewTimeCn("");
      setNewTxtCn("");
      setNewOrder(timelineList.length + 1);
      setIsAddingTimeline(false);
    } catch (err) {
      console.error(err);
      alert("Failed to add timeline item.");
    } finally {
      setIsLoading(false);
    }
  };

  const startTimelineEditing = (item: TimelineItem) => {
    setEditingTimelineId(item.id);
    setEditTimeEn(item.timeEn);
    setEditTimeCn(item.timeCn);
    setEditTxtEn(item.textEn);
    setEditTxtCn(item.textCn);
    setEditOrder(item.order);
  };

  const handleClearAll = () => {
    setIsClearAllOpen(true);
    setClearAllConfirmationText("");
  };

  const confirmClearAll = async () => {
    setIsLoading(true);
    try {
      await clearAllRSVPs();
      setSubmissions([]);
      triggerToast("All RSVP entries successfully cleared");
    } catch (err) {
      console.error("Failed to clear entries from Firestore:", err);
      alert("Failed to clear entries from database. Please try again.");
    } finally {
      setIsClearAllOpen(false);
      setClearAllConfirmationText("");
      setIsLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (submissions.length === 0) {
      triggerToast("No responses available to export.");
      return;
    }

    // Exports what's on screen (search and sort applied), including the status
    // and invite link — without those a decline reads the same as an acceptance.
    const headers = ["Code", "Guest Name", "Status", "Attending", "Guest Count", "Phone", "Email", "Dietary Preference", "Submission Time", "Invite Link"];
    const rows = sortedSubmissions.map((sub) => {
      const hasReplied = sub.timestamp !== "";
      return [
        sub.id,
        `"${sub.guestName.replace(/"/g, '""')}"`,
        hasReplied ? "replied" : "pending",
        hasReplied ? (sub.attending ? "yes" : "no") : "",
        hasReplied ? sub.guestCount : "",
        `"${sub.phone}"`,
        sub.email ? `"${sub.email}"` : "",
        hasReplied ? `"${sub.dietChoice || "standard"}"` : "",
        `"${sub.timestamp}"`,
        `"${inviteLink(sub.id)}"`,
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `wedding_invitations_guests_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast("Guestlist CSV file downloaded successfully!");
  };

  // Flags rows sharing a name or phone with another row. A guest can no longer
  // file a second reply — their link writes to one document — so what this
  // catches now is the same person invited twice. Heuristic, not authoritative.
  const duplicateIds = useMemo(() => {
    const byName = new Map<string, string[]>();
    const byPhone = new Map<string, string[]>();

    submissions.forEach((sub) => {
      const name = sub.guestName.trim().toLowerCase();
      if (name) byName.set(name, [...(byName.get(name) ?? []), sub.id]);

      const phone = sub.phone.replace(/\D/g, "");
      if (phone) byPhone.set(phone, [...(byPhone.get(phone) ?? []), sub.id]);
    });

    const flagged = new Set<string>();
    [...byName.values(), ...byPhone.values()].forEach((ids) => {
      if (ids.length > 1) ids.forEach((id) => flagged.add(id));
    });
    return flagged;
  }, [submissions]);

  const sortedSubmissions = useMemo(() => {
    const filtered = submissions.filter((sub) =>
      sub.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.phone.includes(searchQuery) ||
      (sub.dietChoice && sub.dietChoice.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (sub.email && sub.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (!sortField) return filtered;

    return [...filtered].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === "guestCount") {
        const countA = Number(valA) || 0;
        const countB = Number(valB) || 0;
        return sortDirection === "asc" ? countA - countB : countB - countA;
      }

      if (sortField === "timestamp") {
        const dateA = valA ? new Date(valA).getTime() : 0;
        const dateB = valB ? new Date(valB).getTime() : 0;
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      }

      const strA = String(valA || "").toLowerCase();
      const strB = String(valB || "").toLowerCase();
      if (strA < strB) return sortDirection === "asc" ? -1 : 1;
      if (strA > strB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [submissions, searchQuery, sortField, sortDirection]);

  // Every stat below counts replies only. A pending invite carries attending:false
  // and guestCount:0, so counting it would read as a decline and drag the rate down.
  const replied = submissions.filter((sub) => sub.timestamp !== "");
  const pendingCount = submissions.length - replied.length;

  const totalResponses = replied.length;
  const totalGuests = replied.reduce((sum, item) => sum + item.guestCount, 0);
  const vegetarianCount = replied
    .filter((sub) => sub.dietChoice === "vegetarian")
    .reduce((sum, item) => sum + item.guestCount, 0);
  const standardCount = totalGuests - vegetarianCount;
  // Docs written before the `attending` field existed are counted as joining.
  const acceptedCount = replied.filter((sub) => sub.attending !== false).length;
  const declinedCount = totalResponses - acceptedCount;
  const acceptanceRate = totalResponses
    ? Math.round((acceptedCount / totalResponses) * 100)
    : 0;

  const renderSortHeader = (
    label: string, 
    field: "guestName" | "guestCount" | "phone" | "email" | "dietChoice" | "timestamp",
    centered: boolean = false
  ) => {
    const isSorted = sortField === field;
    return (
      <th 
        onClick={() => handleSort(field)}
        className={`py-4 px-6 cursor-pointer hover:bg-brand-rose/5 transition-colors select-none group ${centered ? "text-center" : ""}`}
      >
        <div className={`flex items-center gap-1.5 ${centered ? "justify-center" : "justify-start"}`}>
          <span className="font-semibold uppercase tracking-wider text-brand-olive">{label}</span>
          <span className="text-brand-olive/40 group-hover:text-brand-olive/80 transition-all duration-200">
            {isSorted ? (
              sortDirection === "asc" ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />
            ) : (
              <ArrowUpDown className="w-3.5 h-3.5 opacity-30 group-hover:opacity-100" />
            )}
          </span>
        </div>
      </th>
    );
  };

  return (
    <div className="min-h-screen bg-brand-blush/50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <AnimatePresence>
        {/* Simple 6-digit PIN Modal if not authenticated */}
        {!isAuthenticated ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-cream/95 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="w-full max-w-md bg-white border border-brand-rose/25 rounded-2xl p-8 shadow-2xl text-center relative overflow-hidden"
            >
              {/* Back button inside modal to return to invitation */}
              <button
                onClick={onBack}
                className="absolute top-4 left-4 flex items-center gap-1.5 text-xs font-semibold text-brand-charcoal/60 hover:text-brand-charcoal transition-colors uppercase tracking-wider"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Invitation
              </button>

              <div className="inline-flex items-center justify-center w-14 h-14 bg-brand-blush/40 text-brand-rose rounded-full mt-6 mb-4">
                <Lock className="w-6 h-6 stroke-[1.8]" />
              </div>

              <h2 className="text-2xl font-serif text-brand-charcoal tracking-wide">
                Owner Authentication
              </h2>
              <p className="text-xs text-brand-olive uppercase tracking-widest font-semibold mt-1">
                Enter 6-Digit PIN
              </p>
              
              <p className="text-xs text-brand-charcoal/50 leading-relaxed max-w-xs mx-auto mt-3 mb-6">
                Please enter the security PIN code to access the private digital wedding guestlist.
              </p>

              {/* Pin input grid */}
              <div className="flex justify-center gap-2 sm:gap-3 mb-6">
                {pin.map((digit, idx) => (
                  <input
                    key={idx}
                    type={showPin ? "text" : "password"}
                    maxLength={1}
                    value={digit}
                    ref={(el) => (pinInputsRef.current[idx] = el)}
                    onChange={(e) => handlePinChange(e.target.value, idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    className={`w-11 h-14 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl border focus:outline-none transition-all duration-200 ${
                      pinError
                        ? "border-rose-400 bg-rose-50/50 text-rose-600 focus:ring-2 focus:ring-rose-200"
                        : "border-brand-rose/35 focus:border-brand-rose focus:ring-4 focus:ring-brand-rose/10 bg-brand-cream/30 text-brand-charcoal"
                    }`}
                  />
                ))}
              </div>

              {/* Toggle visibility */}
              <div className="flex justify-between items-center px-2 mb-6">
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="inline-flex items-center gap-1.5 text-xs text-brand-charcoal/60 hover:text-brand-charcoal transition-colors"
                >
                  {showPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPin ? "Hide Pin" : "Show Pin"}</span>
                </button>

                <span className="text-[10px] text-brand-olive font-semibold tracking-wider uppercase bg-brand-blush/30 px-2 py-0.5 rounded">
                  Default PIN: 123456
                </span>
              </div>

              {pinError && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-rose-500 font-semibold mb-6 bg-rose-50 border border-rose-100 py-2 rounded-lg"
                >
                  Incorrect PIN. Please try again.
                </motion.p>
              )}

              <div className="h-[1px] bg-brand-rose/10 my-4" />
              <p className="text-[10px] text-brand-charcoal/40 font-mono">
                Secured offline-first prototype registry
              </p>
            </motion.div>
          </div>
        ) : (
          /* Main Dashboard Interface */
          <div className="max-w-6xl mx-auto">
            {/* Header / Actions bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <button
                  onClick={onBack}
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-accent hover:text-brand-charcoal transition-colors mb-3 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Return to Wedding Invitation
                </button>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-3xl sm:text-4xl font-serif text-brand-charcoal tracking-wide">
                    RSVP Dashboard
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-olive/10 text-brand-olive">
                    <ShieldCheck className="w-3.5 h-3.5" /> Secure Owner Access
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleExportCSV}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-charcoal text-brand-cream hover:bg-brand-olive transition-colors rounded-xl text-xs font-medium uppercase tracking-widest cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-olive"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
                <button
                  onClick={handleClearAll}
                  className="inline-flex items-center gap-2 px-4 py-2.5 border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors rounded-xl text-xs font-medium uppercase tracking-widest cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </button>
              </div>
            </div>

            {/* Statistics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              {/* Stat card 1: Total responses */}
              <div className="bg-white border border-brand-rose/15 rounded-2xl p-6 shadow-xs flex items-center gap-4">
                <div className="p-3.5 bg-brand-blush/50 text-brand-rose rounded-xl shrink-0">
                  <Calendar className="w-6 h-6 stroke-[1.5]" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-olive">Total Responses</p>
                  <h3 className="text-2xl sm:text-3xl font-serif font-semibold text-brand-charcoal mt-1">
                    {totalResponses}
                    <span className="text-base text-brand-charcoal/40"> / {submissions.length}</span>
                  </h3>
                  <p className="text-[11px] text-brand-charcoal/60 mt-1">
                    {pendingCount === 0
                      ? "Everyone invited has replied"
                      : `${pendingCount} still to reply`}
                  </p>
                </div>
              </div>

              {/* Stat card 2: Total guests */}
              <div className="bg-white border border-brand-rose/15 rounded-2xl p-6 shadow-xs flex items-center gap-4">
                <div className="p-3.5 bg-brand-olive/10 text-brand-olive rounded-xl shrink-0">
                  <Users className="w-6 h-6 stroke-[1.5]" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-olive">Total Headcount</p>
                  <h3 className="text-2xl sm:text-3xl font-serif font-semibold text-brand-charcoal mt-1">
                    {totalGuests}
                  </h3>
                  <p className="text-[11px] text-brand-charcoal/60 mt-1">
                    🌱 {vegetarianCount} Veg • 🥩 {standardCount} Standard
                  </p>
                  {duplicateIds.size > 0 && (
                    <p className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-700">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      {duplicateIds.size} possible duplicate
                      {duplicateIds.size === 1 ? "" : "s"} — headcount may be too high
                    </p>
                  )}
                </div>
              </div>

              {/* Stat card 3: Acceptance rate */}
              <div className="bg-white border border-brand-rose/15 rounded-2xl p-6 shadow-xs flex items-center gap-4">
                <div className="p-3.5 bg-brand-gold/15 text-brand-accent rounded-xl shrink-0">
                  <Sparkles className="w-6 h-6 stroke-[1.5]" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-olive">Accepted</p>
                  <h3 className="text-2xl sm:text-3xl font-serif font-semibold text-brand-charcoal mt-1 tabular-nums">
                    {acceptanceRate}%
                  </h3>
                  <p className="text-[11px] text-brand-charcoal/60 mt-1 tabular-nums">
                    {acceptedCount} joining • {declinedCount} declined
                  </p>
                </div>
              </div>
            </div>

            {/* Elegant Tab Switcher Capsule */}
            <div className="flex border-b border-brand-rose/15 mb-8">
              <button
                onClick={() => setActiveTab("guests")}
                className={`pb-4 px-6 font-serif text-base sm:text-lg tracking-wide border-b-2 font-medium transition-all duration-300 cursor-pointer ${
                  activeTab === "guests"
                    ? "border-brand-rose text-brand-charcoal"
                    : "border-transparent text-brand-charcoal/45 hover:text-brand-charcoal"
                }`}
              >
                Guest List Register ({totalGuests} attendees)
              </button>
              <button
                onClick={() => setActiveTab("timeline")}
                className={`pb-4 px-6 font-serif text-base sm:text-lg tracking-wide border-b-2 font-medium transition-all duration-300 cursor-pointer ${
                  activeTab === "timeline"
                    ? "border-brand-rose text-brand-charcoal"
                    : "border-transparent text-brand-charcoal/45 hover:text-brand-charcoal"
                }`}
              >
                Wedding Timeline Editor
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "guests" ? (
              <div className="space-y-6 mb-12">
              {/* Header or form trigger */}
              <div className="flex items-center justify-end">
                <button
                  onClick={() => setIsAddingGuest(!isAddingGuest)}
                  className="px-4 py-2.5 bg-brand-charcoal text-brand-cream hover:bg-brand-olive transition-colors rounded-xl text-xs font-semibold uppercase tracking-widest cursor-pointer shadow-sm"
                >
                  {isAddingGuest ? "Close Form" : "Create Invite"}
                </button>
              </div>

              {/* Add Guest Form */}
              <AnimatePresence>
                {isAddingGuest && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={handleAddGuest}
                    className="bg-white border border-brand-rose/20 rounded-2xl p-6 shadow-md space-y-4 overflow-hidden"
                  >
                    <h4 className="text-xs font-semibold tracking-wider text-brand-olive uppercase mb-2">
                      New Invite
                    </h4>
                    <div>
                      <label className="block text-xs font-semibold text-brand-charcoal/70 mb-1">
                        Guest Name
                      </label>
                      <input
                        type="text"
                        required
                        value={newGuestName}
                        onChange={(e) => setNewGuestName(e.target.value)}
                        placeholder="e.g., Jane Smith"
                        className="w-full px-3 py-2 bg-brand-blush/50 border border-brand-rose/15 rounded-xl font-sans text-sm focus:outline-none focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/5"
                      />
                      <p className="mt-2 text-[11px] text-brand-charcoal/50 leading-relaxed">
                        Creates a personal invite link and copies it to your clipboard. Party size,
                        phone and meal come from the guest when they reply — or edit the row yourself
                        if they tell you in person.
                      </p>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingGuest(false)}
                        className="px-4 py-2 border border-brand-rose/20 text-brand-charcoal hover:bg-gray-50 transition-colors rounded-xl text-xs font-semibold tracking-wider uppercase cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-brand-charcoal text-white hover:bg-brand-accent transition-colors rounded-xl text-xs font-semibold tracking-wider uppercase cursor-pointer"
                      >
                        Create &amp; Copy Link
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Search and List container */}
              <div className="bg-white border border-brand-rose/15 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-brand-rose/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h4 className="text-lg font-serif text-brand-charcoal font-medium">
                  Attending Guest Register
                </h4>

                {/* Search query field */}
                <div className="relative w-full sm:max-w-xs">
                  <Search className="w-4 h-4 text-brand-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by name or contact..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-brand-blush/50 border border-brand-rose/20 rounded-xl font-sans text-sm placeholder-brand-charcoal/40 text-brand-charcoal focus:outline-none focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/10 transition-all"
                  />
                </div>
              </div>

              {/* Submission Table / Cards */}
              {sortedSubmissions.length === 0 ? (
                <div className="py-16 text-center text-brand-charcoal/40 px-6 font-sans">
                  <div className="inline-flex p-3 bg-brand-cream/60 rounded-full mb-3 text-brand-rose">
                    <Search className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-medium">No attending guests found matching your criteria</p>
                  <p className="text-xs text-brand-charcoal/30 mt-1">Try resetting the search or submit new replies on the page!</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-brand-rose/10">
                  <table className="w-full min-w-[700px] text-left border-collapse font-sans">
                    <thead>
                      <tr className="bg-brand-blush/50 text-xs font-semibold uppercase tracking-wider text-brand-olive border-b border-brand-rose/10">
                        {renderSortHeader("Guest Name", "guestName")}
                        {renderSortHeader("Party Size", "guestCount", true)}
                        {renderSortHeader("Phone Number", "phone")}
                        {renderSortHeader("Email Address", "email")}
                        {renderSortHeader("Diet Choice", "dietChoice")}
                        {renderSortHeader("Registered On", "timestamp")}
                        <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-brand-olive text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-rose/5 text-sm text-brand-charcoal/85">
                      {sortedSubmissions.map((sub) => {
                        const isEditing = editingId === sub.id;
                        return (
                          <tr key={sub.id} className={`${isEditing ? "bg-brand-rose/5" : "hover:bg-brand-cream/20"} transition-colors`}>
                            {isEditing ? (
                              <>
                                <td className="py-3 px-4">
                                  <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="w-full px-2.5 py-1.5 bg-white border border-brand-rose/20 rounded-lg text-sm text-brand-charcoal focus:outline-none focus:border-brand-rose"
                                    placeholder="Guest Name"
                                  />
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <input
                                    type="number"
                                    min={0}
                                    title="0 records a decline"
                                    value={editCount}
                                    onChange={(e) => setEditCount(Number(e.target.value))}
                                    className="w-16 px-2.5 py-1.5 bg-white border border-brand-rose/20 rounded-lg text-sm text-center text-brand-charcoal focus:outline-none focus:border-brand-rose"
                                  />
                                </td>
                                <td className="py-3 px-4">
                                  <input
                                    type="text"
                                    value={editPhone}
                                    onChange={(e) => setEditPhone(e.target.value)}
                                    className="w-full px-2.5 py-1.5 bg-white border border-brand-rose/20 rounded-lg text-sm text-brand-charcoal font-mono focus:outline-none focus:border-brand-rose"
                                    placeholder="Phone"
                                  />
                                </td>
                                <td className="py-3 px-4">
                                  <input
                                    type="email"
                                    value={editEmail}
                                    onChange={(e) => setEditEmail(e.target.value)}
                                    className="w-full px-2.5 py-1.5 bg-white border border-brand-rose/20 rounded-lg text-sm text-brand-charcoal focus:outline-none focus:border-brand-rose"
                                    placeholder="Email (Optional)"
                                  />
                                </td>
                                <td className="py-3 px-4">
                                  <select
                                    value={editDiet}
                                    onChange={(e) => setEditDiet(e.target.value as "standard" | "vegetarian")}
                                    className="px-2.5 py-1.5 bg-white border border-brand-rose/20 rounded-lg text-xs font-medium text-brand-charcoal focus:outline-none focus:border-brand-rose cursor-pointer"
                                  >
                                    <option value="standard">Standard Meal 🥩</option>
                                    <option value="vegetarian">Vegetarian 🌱</option>
                                  </select>
                                </td>
                                <td className="py-3 px-4 text-xs text-brand-charcoal/60">
                                  {sub.timestamp}
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <div className="flex items-center justify-center gap-1.5">
                                    <button
                                      onClick={() => handleSaveEdit(sub.id)}
                                      className="text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 p-2 rounded-lg transition-colors cursor-pointer"
                                      title="Save changes"
                                    >
                                      <Save className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={cancelEditing}
                                      className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors cursor-pointer"
                                      title="Cancel editing"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </>
                            ) : (
                              <>
                                <td className="py-4 px-6 font-medium text-brand-charcoal">
                                  <span className="inline-flex items-center gap-1.5">
                                    {duplicateIds.has(sub.id) && (
                                      <AlertTriangle
                                        className="w-4 h-4 text-amber-600 shrink-0"
                                        aria-label="Possible duplicate reply"
                                      >
                                        <title>
                                          Possible duplicate — another reply shares this name or
                                          phone number. Check the submission times and delete the
                                          older one.
                                        </title>
                                      </AlertTriangle>
                                    )}
                                    {sub.guestName}
                                    {!sub.timestamp && (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-brand-cream text-brand-olive border border-brand-olive/25">
                                        Invited
                                      </span>
                                    )}
                                  </span>
                                </td>
                                {!sub.timestamp ? (
                                  // A pending invite has no answers yet, so the five detail
                                  // columns would just show zeroes and a meal they never picked.
                                  <td
                                    colSpan={5}
                                    className="py-4 px-6 text-xs italic text-brand-charcoal/40"
                                  >
                                    Awaiting reply — send them their invite link
                                  </td>
                                ) : (
                                  <>
                                <td className="py-4 px-6 text-center">
                                  <span className="inline-flex items-center justify-center bg-brand-blush/40 text-brand-rose font-semibold px-2.5 py-1 rounded-lg text-xs min-w-8">
                                    {sub.guestCount}
                                  </span>
                                </td>
                                <td className="py-4 px-6 font-mono text-xs">
                                  <div className="flex items-center gap-1.5">
                                    <Phone className="w-3.5 h-3.5 text-brand-rose" />
                                    {sub.phone}
                                  </div>
                                </td>
                                <td className="py-4 px-6">
                                  {sub.email ? (
                                    <div className="flex items-center gap-1.5 text-xs">
                                      <Mail className="w-3.5 h-3.5 text-brand-olive" />
                                      {sub.email}
                                    </div>
                                  ) : (
                                    <span className="text-xs text-brand-charcoal/30 italic">Not provided</span>
                                  )}
                                </td>
                                <td className="py-4 px-6">
                                  {sub.dietChoice === "vegetarian" ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100 font-sans">
                                      Vegetarian 🌱
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50/70 text-amber-800 border border-amber-100 font-sans">
                                      Standard Meal 🥩
                                    </span>
                                  )}
                                </td>
                                <td className="py-4 px-6 text-xs text-brand-charcoal/60">
                                  {sub.timestamp}
                                </td>
                                  </>
                                )}
                                <td className="py-4 px-6 text-center">
                                  <div className="flex items-center justify-center gap-1">
                                    <button
                                      onClick={() => copyInviteLink(sub.id)}
                                      className="text-brand-olive hover:text-brand-charcoal hover:bg-brand-cream/40 p-2 rounded-lg transition-colors cursor-pointer"
                                      title="Copy this guest's invite link"
                                    >
                                      <LinkIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => startEditing(sub)}
                                      className="text-brand-olive hover:text-brand-charcoal hover:bg-brand-cream/40 p-2 rounded-lg transition-colors cursor-pointer"
                                      title="Edit response"
                                    >
                                      <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        setDeleteId(sub.id);
                                        setDeleteConfirmationText("");
                                      }}
                                      className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-2 rounded-lg transition-colors cursor-pointer"
                                      title="Delete response"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            </div>
          ) : (
            <div className="space-y-6 mb-12">
              {/* Header or form trigger */}
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-serif text-brand-charcoal">
                  Manage Wedding Day Schedule
                </h3>
                <button
                  onClick={() => {
                    setIsAddingTimeline(!isAddingTimeline);
                    if (!isAddingTimeline) {
                      setNewOrder(timelineList.length + 1);
                    }
                  }}
                  className="px-4 py-2.5 bg-brand-charcoal text-brand-cream hover:bg-brand-olive transition-colors rounded-xl text-xs font-semibold uppercase tracking-widest cursor-pointer shadow-sm"
                >
                  {isAddingTimeline ? "Close Form" : "Add Timeline Event"}
                </button>
              </div>

              {/* Add Timeline Event Form */}
              <AnimatePresence>
                {isAddingTimeline && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={handleAddTimelineItem}
                    className="bg-white border border-brand-rose/20 rounded-2xl p-6 shadow-md space-y-4 overflow-hidden"
                  >
                    <h4 className="text-xs font-semibold tracking-wider text-brand-olive uppercase mb-2">
                      New Timeline Event Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-brand-charcoal/70 mb-1">
                          Time (English) e.g., "04:00 PM"
                        </label>
                        <input
                          type="text"
                          required
                          value={newTimeEn}
                          onChange={(e) => setNewTimeEn(e.target.value)}
                          placeholder='e.g., "04:00 PM"'
                          className="w-full px-3 py-2 bg-brand-blush/50 border border-brand-rose/15 rounded-xl font-sans text-sm focus:outline-none focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/5"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-brand-charcoal/70 mb-1">
                          Time (Chinese) e.g., "下午 04:00"
                        </label>
                        <input
                          type="text"
                          required
                          value={newTimeCn}
                          onChange={(e) => setNewTimeCn(e.target.value)}
                          placeholder='e.g., "下午 04:00"'
                          className="w-full px-3 py-2 bg-brand-blush/50 border border-brand-rose/15 rounded-xl font-sans text-sm focus:outline-none focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/5"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-brand-charcoal/70 mb-1">
                          Description (English) e.g., "Welcoming & Drinks"
                        </label>
                        <input
                          type="text"
                          required
                          value={newTxtEn}
                          onChange={(e) => setNewTxtEn(e.target.value)}
                          placeholder='e.g., "Welcoming & Drinks"'
                          className="w-full px-3 py-2 bg-brand-blush/50 border border-brand-rose/15 rounded-xl font-sans text-sm focus:outline-none focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/5"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-brand-charcoal/70 mb-1">
                          Description (Chinese) e.g., "宾客入场与迎宾饮品"
                        </label>
                        <input
                          type="text"
                          required
                          value={newTxtCn}
                          onChange={(e) => setNewTxtCn(e.target.value)}
                          placeholder='e.g., "宾客入场与迎宾饮品"'
                          className="w-full px-3 py-2 bg-brand-blush/50 border border-brand-rose/15 rounded-xl font-sans text-sm focus:outline-none focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/5"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-brand-charcoal/70 mb-1">
                          Sorting Order (Integer)
                        </label>
                        <input
                          type="number"
                          required
                          min={1}
                          value={newOrder}
                          onChange={(e) => setNewOrder(Number(e.target.value))}
                          className="w-32 px-3 py-2 bg-brand-blush/50 border border-brand-rose/15 rounded-xl font-sans text-sm focus:outline-none focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/5"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingTimeline(false)}
                        className="px-4 py-2 border border-brand-rose/20 text-brand-charcoal hover:bg-gray-50 transition-colors rounded-xl text-xs font-semibold tracking-wider uppercase cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-brand-charcoal text-white hover:bg-brand-accent transition-colors rounded-xl text-xs font-semibold tracking-wider uppercase cursor-pointer"
                      >
                        Save Event
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Timeline Grid list */}
              <div className="bg-white border border-brand-rose/15 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto rounded-2xl border border-brand-rose/10">
                  <table className="w-full min-w-[700px] text-left border-collapse font-sans">
                    <thead>
                      <tr className="bg-brand-blush/50 text-xs font-semibold uppercase tracking-wider text-brand-olive border-b border-brand-rose/10">
                        <th className="py-4 px-6 w-24 text-center">Order</th>
                        <th className="py-4 px-6">Time (EN)</th>
                        <th className="py-4 px-6">Time (CN)</th>
                        <th className="py-4 px-6">Description (EN)</th>
                        <th className="py-4 px-6">Description (CN)</th>
                        <th className="py-4 px-6 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-rose/5 text-sm text-brand-charcoal/85">
                      {timelineList.map((item) => {
                        const isEditing = editingTimelineId === item.id;
                        return (
                          <tr key={item.id} className={`${isEditing ? "bg-brand-rose/5" : "hover:bg-brand-cream/20"} transition-colors`}>
                            {isEditing ? (
                              <>
                                <td className="py-3 px-4 text-center">
                                  <input
                                    type="number"
                                    min={1}
                                    value={editOrder}
                                    onChange={(e) => setEditOrder(Number(e.target.value))}
                                    className="w-16 px-2 py-1 bg-white border border-brand-rose/20 rounded-lg text-sm text-center text-brand-charcoal focus:outline-none focus:border-brand-rose"
                                  />
                                </td>
                                <td className="py-3 px-4">
                                  <input
                                    type="text"
                                    value={editTimeEn}
                                    onChange={(e) => setEditTimeEn(e.target.value)}
                                    className="w-full px-2 py-1 bg-white border border-brand-rose/20 rounded-lg text-sm text-brand-charcoal focus:outline-none focus:border-brand-rose"
                                  />
                                </td>
                                <td className="py-3 px-4">
                                  <input
                                    type="text"
                                    value={editTimeCn}
                                    onChange={(e) => setEditTimeCn(e.target.value)}
                                    className="w-full px-2 py-1 bg-white border border-brand-rose/20 rounded-lg text-sm text-brand-charcoal focus:outline-none focus:border-brand-rose"
                                  />
                                </td>
                                <td className="py-3 px-4">
                                  <input
                                    type="text"
                                    value={editTxtEn}
                                    onChange={(e) => setEditTxtEn(e.target.value)}
                                    className="w-full px-2 py-1 bg-white border border-brand-rose/20 rounded-lg text-sm text-brand-charcoal focus:outline-none focus:border-brand-rose"
                                  />
                                </td>
                                <td className="py-3 px-4">
                                  <input
                                    type="text"
                                    value={editTxtCn}
                                    onChange={(e) => setEditTxtCn(e.target.value)}
                                    className="w-full px-2 py-1 bg-white border border-brand-rose/20 rounded-lg text-sm text-brand-charcoal focus:outline-none focus:border-brand-rose"
                                  />
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <div className="flex items-center justify-center gap-1.5">
                                    <button
                                      onClick={() => handleSaveTimelineEdit(item.id)}
                                      className="text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 p-2 rounded-lg transition-colors cursor-pointer"
                                      title="Save changes"
                                    >
                                      <Save className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => setEditingTimelineId(null)}
                                      className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors cursor-pointer"
                                      title="Cancel editing"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </>
                            ) : (
                              <>
                                <td className="py-4 px-6 text-center font-semibold text-brand-olive">
                                  {item.order}
                                </td>
                                <td className="py-4 px-6 font-medium text-brand-charcoal">
                                  {item.timeEn}
                                </td>
                                <td className="py-4 px-6 text-brand-charcoal/80">
                                  {item.timeCn}
                                </td>
                                <td className="py-4 px-6 text-brand-charcoal/80 text-ellipsis overflow-hidden max-w-xs">
                                  {item.textEn}
                                </td>
                                <td className="py-4 px-6 text-brand-charcoal/85 text-ellipsis overflow-hidden max-w-xs">
                                  {item.textCn}
                                </td>
                                <td className="py-4 px-6 text-center">
                                  <div className="flex items-center justify-center gap-1">
                                    <button
                                      onClick={() => startTimelineEditing(item)}
                                      className="text-brand-olive hover:text-brand-charcoal hover:bg-brand-cream/40 p-2 rounded-lg transition-colors cursor-pointer"
                                      title="Edit event"
                                    >
                                      <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteTimelineItem(item.id)}
                                      className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-2 rounded-lg transition-colors cursor-pointer"
                                      title="Delete event"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </AnimatePresence>

      {/* Beautiful Custom Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-charcoal/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-md bg-white border border-brand-rose/20 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
            >
              <button
                onClick={() => {
                  setDeleteId(null);
                  setDeleteConfirmationText("");
                }}
                className="absolute top-4 right-4 text-brand-charcoal/40 hover:text-brand-charcoal transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-rose-50 border border-rose-100 text-rose-500 rounded-full flex items-center justify-center">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-serif text-brand-charcoal font-medium">
                    Confirm Deletion
                  </h3>
                  <p className="text-xs text-brand-olive uppercase tracking-wider font-semibold">
                    Irreversible Action
                  </p>
                </div>
              </div>

              <div className="bg-brand-rose/5 border border-brand-rose/10 rounded-xl p-4 mb-4 text-xs text-brand-charcoal/80 leading-relaxed">
                You are about to delete <strong className="text-brand-charcoal">{submissions.find(s => s.id === deleteId)?.guestName}</strong> (party size: {submissions.find(s => s.id === deleteId)?.guestCount}) from the register.
              </div>

              <div className="space-y-3 font-sans">
                <label className="block text-xs font-semibold text-brand-charcoal/70">
                  To confirm deletion, please type the word exactly:
                </label>
                <div className="bg-brand-blush/50 border border-brand-rose/15 rounded-lg py-2 px-3 text-center font-mono text-xs select-all text-brand-charcoal font-semibold tracking-wide">
                  delete
                </div>
                <input
                  type="text"
                  value={deleteConfirmationText}
                  onChange={(e) => setDeleteConfirmationText(e.target.value)}
                  placeholder="Type 'delete'..."
                  className="w-full px-3 py-2 bg-brand-blush/50 border border-brand-rose/15 rounded-xl font-sans text-sm focus:outline-none focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/5"
                />
              </div>

              <div className="flex justify-end gap-3 pt-5 border-t border-brand-rose/10 mt-5">
                <button
                  type="button"
                  onClick={() => {
                    setDeleteId(null);
                    setDeleteConfirmationText("");
                  }}
                  className="px-4 py-2 border border-brand-rose/20 text-brand-charcoal hover:bg-gray-50 transition-colors rounded-xl text-xs font-semibold tracking-wider uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleteConfirmationText !== "delete"}
                  onClick={() => deleteId && handleDelete(deleteId)}
                  className="px-5 py-2 bg-rose-600 disabled:bg-rose-100 disabled:text-rose-300 disabled:cursor-not-allowed hover:bg-rose-700 text-white transition-colors rounded-xl text-xs font-semibold tracking-wider uppercase cursor-pointer shadow-sm"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Beautiful Custom Clear All Confirmation Modal */}
      <AnimatePresence>
        {isClearAllOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-charcoal/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-md bg-white border border-brand-rose/20 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
            >
              <button
                onClick={() => {
                  setIsClearAllOpen(false);
                  setClearAllConfirmationText("");
                }}
                className="absolute top-4 right-4 text-brand-charcoal/40 hover:text-brand-charcoal transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-rose-50 border border-rose-100 text-rose-500 rounded-full flex items-center justify-center">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-serif text-brand-charcoal font-medium">
                    Confirm Clear All
                  </h3>
                  <p className="text-xs text-brand-olive uppercase tracking-wider font-semibold">
                    Irreversible Action
                  </p>
                </div>
              </div>

              <div className="bg-brand-rose/5 border border-brand-rose/10 rounded-xl p-4 mb-4 text-xs text-brand-charcoal/80 leading-relaxed">
                You are about to delete <strong className="text-brand-charcoal">ALL RSVP guest records</strong> from the database. This action cannot be undone.
              </div>

              <div className="space-y-3 font-sans">
                <label className="block text-xs font-semibold text-brand-charcoal/70">
                  To confirm clearing all entries, please type the word exactly:
                </label>
                <div className="bg-brand-blush/50 border border-brand-rose/15 rounded-lg py-2 px-3 text-center font-mono text-xs select-all text-brand-charcoal font-semibold tracking-wide">
                  delete
                </div>
                <input
                  type="text"
                  value={clearAllConfirmationText}
                  onChange={(e) => setClearAllConfirmationText(e.target.value)}
                  placeholder="Type 'delete'..."
                  className="w-full px-3 py-2 bg-brand-blush/50 border border-brand-rose/15 rounded-xl font-sans text-sm focus:outline-none focus:border-brand-rose focus:ring-2 focus:ring-brand-rose/5"
                />
              </div>

              <div className="flex justify-end gap-3 pt-5 border-t border-brand-rose/10 mt-5">
                <button
                  type="button"
                  onClick={() => {
                    setIsClearAllOpen(false);
                    setClearAllConfirmationText("");
                  }}
                  className="px-4 py-2 border border-brand-rose/20 text-brand-charcoal hover:bg-gray-50 transition-colors rounded-xl text-xs font-semibold tracking-wider uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={clearAllConfirmationText !== "delete"}
                  onClick={confirmClearAll}
                  className="px-5 py-2 bg-rose-600 disabled:bg-rose-100 disabled:text-rose-300 disabled:cursor-not-allowed hover:bg-rose-700 text-white transition-colors rounded-xl text-xs font-semibold tracking-wider uppercase cursor-pointer shadow-sm"
                >
                  Confirm Clear All
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Elegant Toast notification inside Dashboard */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 bg-brand-charcoal text-brand-cream px-5 py-3 rounded-xl shadow-2xl text-xs tracking-wider uppercase font-sans font-medium flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4 text-brand-rose fill-current" />
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
