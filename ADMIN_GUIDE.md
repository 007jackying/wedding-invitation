# 💒 Eva & Vincent — Wedding Invitation
## Owner & Admin User Guide

Welcome to the **Owner & Admin User Guide**! This guide covers everything you need to know about managing invitations, tracking guest RSVPs, creating shareable links, and updating your wedding schedule in real time.

---

## 🔒 1. How to Access the Admin Dashboard

Access your private owner dashboard by appending `#admin` to your website URL in the address bar 'https://evavincentwedding.recursivedreamlabs.com/#97+97=0201/admin'.

### Authentication
- When prompted, enter your **6-Digit Security PIN**.
- Click **Show Pin** to verify your entry if needed.
- Upon successful verification, you'll be welcomed directly into the live dashboard.

---

## 📩 2. Creating & Sending Guest Invites

Every guest or family party receives their own **personalized invitation link** (`https://evavincentwedding.recursivedreamlabs.com/?g=<code>`).

### Step-by-step: How to invite a guest
1. In the **Guest List Register** tab, click the **Create Invite** button at the top right.
2. Type the guest or family name (e.g., `Uncle Tan & Family` or `Jane Doe`).
3. Click **Create & Copy Link**.
4. The system automatically:
   - Generates a unique 6-character invite code (e.g., `k3d9x2`).
   - Creates a pending record in the database.
   - **Copies the personal invite link directly to your clipboard**.
5. Paste the link into **WhatsApp**, WeChat, or SMS and send it directly to your guest!

> 💡 **Tip:** When the guest opens their personal link, the website greets them by name and lets them fill in their party size, phone number, and meal preference.

---

## 📊 3. Dashboard Analytics & Real-Time Sync

The top of your dashboard displays live statistics that update in **real-time** whenever a guest responds:

- **Total Responses**: Displays how many invited parties have replied out of your total guest list (`Replied / Total`).
- **Total Headcount**: Sum of all attending guests, broken down by meal preference:
  - 🌱 **Vegetarian count**
  - 🥩 **Standard meal count**
- **Accepted (%)**: Percentage of replied guests who accepted vs. declined.
- **Duplicate Alerts (⚠️)**: Automatically flags guests who share identical names or phone numbers to prevent double-counting.

---

## 📋 4. Managing the Guest List Register

### Real-Time Live Sync
You do **not** need to refresh your browser page! The table automatically updates live as guests submit their replies on their phones.

### Understanding Guest Statuses
- **`Invited` badge**: The invite link has been created and sent, but the guest has not submitted their reply yet.
- **`Replied` row**: Shows party headcount, phone number, email (if provided), meal choice, and the exact timestamp when they replied.

### Search & Sorting
- **Search Bar**: Type any name, phone number, or meal preference in the search box to filter instantly.
- **Column Sorting**: Click any column header (**Guest Name**, **Party Size**, **Phone**, **Diet Choice**, **Registered On**) to sort ascending or descending.

### Editing a Guest's Response (On Their Behalf)
If a guest calls or messages you on WhatsApp to answer or change their RSVP:
1. Locate the guest in the register and click the **Pencil (Edit)** icon.
2. Update their name, party size, phone number, email, or meal choice (*Standard* vs. *Vegetarian*).
   - *Setting Party Size to `0` records a decline.*
3. Click the **Save (Checkmark)** icon to commit the changes to Firestore.

### Copying an Invite Link Again
If a guest loses their link, click the **Link (🔗)** icon next to their row to re-copy their personal invite link to your clipboard.

### Exporting to Excel / CSV
Click **Export CSV** at the top right to download a complete spreadsheet containing all guest details, status, submission timestamps, and personal invite links for your caterer or wedding planner.

### Deleting Guests
To remove an invite record:
1. Click the **Trash** icon on the row.
2. In the confirmation pop-up, type the word `delete` and click **Confirm Delete**.

---

## 🗓️ 5. Managing the Wedding Day Schedule

Click the **Wedding Timeline Editor** tab at the top of the dashboard to customize the wedding schedule shown on the public invitation page.

### Adding a Schedule Event
1. Click **Add Timeline Event**.
2. Enter the event details:
   - **Time (English)**: e.g., `05:00 PM`
   - **Time (Chinese)**: e.g., `下午 05:00`
   - **Description (English)**: e.g., `Welcoming & Cocktail Hour`
   - **Description (Chinese)**: e.g., `宾客入场与迎宾饮品`
   - **Sorting Order**: Integer number (e.g., `1`, `2`, `3`) to control the sequence on the page.
3. Click **Save Event**.

### Editing or Re-Ordering Schedule Events
- Click the **Pencil (Edit)** icon next to any event to change its times, descriptions, or sorting order.
- Click **Save** to instantly update the public wedding timeline on the landing page in both English and Chinese views.

---

## 💬 6. Summary Checklist for Wedding Day Prep

| Task | Action |
| :--- | :--- |
| **Invite Guests** | Admin Dashboard $\rightarrow$ **Create Invite** $\rightarrow$ Paste link to WhatsApp |
| **Check Catering Totals** | Look at **Total Headcount** tile for Veg 🌱 vs. Standard 🥩 totals |
| **Export Final List** | Click **Export CSV** to send guest list to venue & event coordinator |
| **Update Schedule** | Use **Wedding Timeline Editor** if event times shift slightly |

---
*Happy Wedding Planning, Eva & Vincent! 💕*
170699
https://evavincentwedding.recursivedreamlabs.com/#97+97=0201/admin