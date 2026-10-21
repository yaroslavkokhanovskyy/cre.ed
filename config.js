/* CRE-Ed site configuration.
   Leave SUPABASE_URL empty to run in DEMO MODE (everything is stored in this browser only,
   "payments" are simulated). Fill in the two Supabase values to switch to the real app. */
window.CREED = {
  SUPABASE_URL: "",        // e.g. "https://abcdxyz.supabase.co"
  SUPABASE_ANON_KEY: "",   // the public "anon" key (safe to expose; Row Level Security protects data)

  // Weeks anyone with a free account can watch. Must match supabase/schema.sql (storage policy).
  FREE_WEEKS: [1],
  // Worksheets and tools anyone with a free account can open (week numbers). Week 1 video is the free lesson.
  FREE_SHEETS: [1, 3, 4],

  // Where each book's "Purchase" button goes: a Stripe Payment Link or an Amazon/other URL.
  BOOK_LINKS: {
    "buy-cre": "",
    "golden-cashflow": "",
    "golden-lease": ""
  },

  // Contact page
  OWNER_EMAILS: ["cre.ed.university@gmail.com"], // these accounts get every program without paying
  ADMIN_EMAILS: ["cre.ed.university@gmail.com"], // these accounts see the "Add content" panel in the Free Library
  CONTACT_EMAIL: "commercial@property.ca",
  CONTACT_PHONE: "+1 (416) 583-1660",
  SOCIAL: { tiktok: "", instagram: "", linkedin: "" },   // paste your profile URLs

  // Member coaching desk
  BOOKING_URL: "",         // link to your calendar (Calendly, Cal.com, ...) for extra calls at $120 CAD/hour
  LIVE_QA: [               // upcoming live Q&A sessions (every two weeks) and replays
    // { date: "2026-11-05", time: "7:00 pm ET", join: "https://...", replay: "" }
  ],

  // Footer. Leave HST empty to hide the line.
  HST: ""
};
