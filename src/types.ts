/**
 * Configuration options for the headless Google Form submission.
 * Users can replace these placeholder values with their real Google Form action URL and Entry IDs.
 */
export const GOOGLE_FORM_CONFIG = {
  // Replace this with your actual Google Form URL. It must end with "/formResponse"
  actionUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfD_YOUR_ACTUAL_FORM_ID_HERE/formResponse",
  
  // Replace these with the specific 'name' attributes of the inputs on your Google Form
  fields: {
    guestName: "entry.123456789",    // Input ID for Full Name
    guestCount: "entry.987654321",  // Input ID for Number of People Attending
    phone: "entry.111222333",       // Input ID for Phone Number
    email: "entry.444555666",       // Input ID for Email (Optional)
  }
};

export const ADMIN_PIN = "123456"; // Default secure 6-digit pin to view guestlist

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
}

export interface TimelineItem {
  id: string;
  timeEn: string;
  textEn: string;
  timeCn: string;
  textCn: string;
  order: number;
}

