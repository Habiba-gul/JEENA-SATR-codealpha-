# Jeena Satr — Curated Literature Portal

> *"Satr ba satr jeena..." (Living line by line...)*

**Jeena Satr** is a polished, highly responsive digital sanctuary for book enthusiasts. It brings together curated classical Urdu literature, contemporary English novels, motivational guides, and comics in an immersive, beautifully crafted interface. The application offers a seamless blend of local storytelling, real-time peer-to-peer assistance, and robust e-commerce features.

---

## 🎨 Visual Identity & Aesthetic

* **Warm Sand & Dusty Rose Palette**: A deliberate, custom color scheme crafted to emulate physical parchment paper and library bindings.
* **Ambient Floating Orbs**: Subtle background gradient animations that move dynamically to enhance reading immersion.
* **Interactive Backdrop Bloom**: Dynamic cursor tracking that emits a subtle radial highlight when navigating catalogs.
* **Animated Quote Ticker**: A continuously scrolling ribbon of classical literary quotes decorating the storefront.

---

## ✨ Features

### 📚 1. Curated Master Catalog
* **Search & Filters**: Highly optimized query parsing across titles, authors, and categories.
* **Interactive Cover Carousel**: Swipe and browse multiple beautiful cover design editions for any book.
* **Multi-Genre Collections**: Seamless categorization spanning *Urdu Novels*, *English Classics*, *Sci-Fi*, and *Motivational books*.

### 💬 2. P2P Literary Concierges & Chat
* **Simulated Interactive Chats**: Connect with peer curators like Jamil or Nimra to discuss themes.
* **Quick Prompt Tags**: Tap preset queries to ask about catalog arrivals, wooden bookmarks, or delivery times.
* **Auto-Reply Engine**: Interactive response loops to guide readers effortlessly.

### 🛒 3. Selective Shopping Cart
* **Interactive Selections**: Toggle checkboxes to selectively purchase volumes.
* **Quantity Selectors**: Fast increase/decrease counters with real-time total evaluation.
* **Cost Assessments**: Transparent calculations incorporating standard delivery shipping fee structures.

### 🚚 4. Interactive Logistics Tracker
* **Visual Shipping Timelines**: Track orders with responsive timeline nodes showing states: `Ordered` ➔ `Shipping` ➔ `Delivered`.
* **Curator Control Mode**: Admins can simulate shipping state transitions with the click of a button.

### ✍️ 5. Reader Assessments
* **Dynamic Review Feed**: Read honest community reviews on book detail profiles.
* **Interactive Star Ratings**: Share your own literary thoughts and average rating scores instantly.

### ⚙️ 6. Dev Hub & Database Inspector
* **Live Schemas**: Inspect the custom models blueprint panel.
* **Supabase Integration**: Synchronized cloud data pipeline support.

---

## 🛠️ Tech Stack & Tools

* **Frontend**: React 18, TypeScript (for robust type safety and component structures)
* **Build System**: Vite (for blistering fast Hot Module Replacement and production optimization)
* **Styling**: Tailwind CSS (with bespoke responsive extensions)
* **Icons**: Lucide React (for uniform vector aesthetics)
* **Backend Integration**: Supabase & PostgreSQL (custom client for persistent storage of tables)
* **Development Environment**: VS Code / Google AI Studio

---

## 🚀 How to Run Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your computer.

### Step-by-Step Setup

1. **Clone & Extract**:
   Download and open the project directory in your preferred terminal or VS Code workspace.

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` or `.env.local` file in the root directory and specify your Supabase or API credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

4. **Run Dev Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) (or the port specified by your Vite bundler) in your browser to view your live Jeena Satr Bookstore!

5. **Build for Production**:
   ```bash
   npm run build
   ```
