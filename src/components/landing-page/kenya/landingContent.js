/**
 * Copy and rules for the Fasta landing page.
 *
 * Admin-editable text (Business settings → Landing page) is used when it is real Fasta content.
 * Text from the 6amMart installer demo ("6amMart", "John Doe", "Your e-Commerce!", rental copy,
 * Laravel/Flutter marketing…) is detected and replaced by the defaults below, so demo content
 * can never reach customers even if nobody edits the admin settings.
 */

const DEMO_PATTERNS = [
  /6\s*am\s*(mart|tech)/i,
  /\bjohn\s+doe\b/i,
  /lorem ipsum/i,
  /your e-?commerce!?/i,
  /venture starts here/i,
  /multipurpose\s+e?business/i,
  /\blaravel\b|\bflutter\b/i,
  /ride anytime|rent vehicles|vehicle rental/i,
  /demo (cookie|text|content)/i,
  /reliable \$?e-?commerce\$? platform/i,
  /enter location to search store/i,
  /we \$?satisfied\$? some customer/i,
];

/** Strips HTML and 6amMart's $highlight$ markers. */
export const plainText = (value = "") =>
  String(value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\$/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&bull;/g, "•")
    .replace(/&ndash;/g, "–")
    .replace(/\s+/g, " ")
    .trim();

export const isDemoText = (value) => {
  const text = plainText(value);
  return !text || text === "None" || DEMO_PATTERNS.some((re) => re.test(text));
};

/** Admin text if it is real content, otherwise our default. */
export const pick = (value, fallback) => (isDemoText(value) ? fallback : plainText(value));

export const COPY = {
  heroKicker: "KARIBU FASTA",
  heroTitle: "Groceries, meals and everyday essentials, delivered.",
  heroText:
    "Order from the shops and kitchens you already trust. Pay with M-Pesa, card or cash on delivery, and follow your rider until it’s at your door.",
  pickTitle: "Where should we deliver?",
  pickHint: "Enter your estate, building or a nearby landmark.",
};

export const CATEGORIES = [
  { id: "grocery", title: "Groceries", text: "Fresh produce, household staples and drinks from your local shops.", icon: "basket" },
  { id: "food", title: "Restaurants", text: "Lunch at the office or dinner at home, from kitchens near you.", icon: "bowl" },
  { id: "pharmacy", title: "Pharmacy & health", text: "Over-the-counter medicine and personal care from licensed pharmacies.", icon: "pill" },
  { id: "parcel", title: "Parcels", text: "Send documents and packages across town with a trusted rider.", icon: "box" },
];

export const STEPS = [
  { title: "Set your location", text: "Tell us your estate, building or landmark so we show what delivers to you.", icon: "pin" },
  { title: "Choose and pay", text: "Pick from nearby stores, see the delivery fee in KSh, and pay with M-Pesa, card or cash.", icon: "cart" },
  { title: "Track it to your door", text: "Follow your rider live on the map and get updates until your order arrives.", icon: "route" },
];

export const PAYMENTS = [
  { title: "M-Pesa", text: "Approve the prompt on your phone. No paybill numbers to type.", icon: "phone" },
  { title: "Visa & Mastercard", text: "Debit and credit cards, processed securely.", icon: "card" },
  { title: "Cash on delivery", text: "Pay your rider when your order arrives, where available.", icon: "cash" },
];

export const PROMISES = [
  { title: "Your neighbourhood shops", text: "Real local stores and kitchens, not a faraway warehouse.", icon: "store" },
  { title: "Live order tracking", text: "See exactly where your rider is, from pickup to your gate.", icon: "route" },
  { title: "Clear prices in KSh", text: "Item prices and delivery fees shown before you pay. No surprises.", icon: "tag" },
  { title: "Help when you need it", text: "Talk to a real person if something isn’t right with your order.", icon: "chat" },
];

export const DEFAULT_FAQS = [
  { id: "d1", user_type: "customer", question: "Where does Fasta deliver?", answer: "Enter your location at the top of this page. We’ll show the stores that deliver to you. We’re adding new neighbourhoods regularly." },
  { id: "d2", user_type: "customer", question: "How do I pay with M-Pesa?", answer: "Choose M-Pesa at checkout and enter your Safaricom number. You’ll get a prompt on your phone; enter your M-Pesa PIN to approve. Your order is confirmed as soon as the payment goes through." },
  { id: "d3", user_type: "customer", question: "How much is delivery?", answer: "Delivery fees depend on the distance from the store to you. You always see the exact fee in KSh before you pay." },
  { id: "d4", user_type: "customer", question: "Can I track my order?", answer: "Yes. Once a rider picks up your order you can follow them live on the map in the app or on the website." },
  { id: "d5", user_type: "customer", question: "What if something is wrong with my order?", answer: "Contact our support team from the Help & support page with your order number and we’ll sort it out." },
  { id: "d6", user_type: "vendor", question: "How do I sell on Fasta?", answer: "Register your business on this website, add your products, and start receiving orders. Payments are settled to your account on a regular schedule." },
  { id: "d7", user_type: "vendor", question: "What does it cost to join?", answer: "Fasta charges a commission on completed orders. The current rates are shown during registration." },
  { id: "d8", user_type: "deliveryman", question: "How do I become a Fasta rider?", answer: "Apply on this website with your ID, phone number and vehicle details. Once approved, download the Fasta rider app and start accepting deliveries near you." },
  { id: "d9", user_type: "deliveryman", question: "How are riders paid?", answer: "Riders earn per delivery. Earnings are shown in the app and paid out regularly." },
];

/**
 * Images that came with the 6amMart installer were uploaded on 2024-11-19 and 2025-11-16 (the date is
 * in the file name, e.g. promotional_banner/2025-11-16-691a956cac0f5.png). Anything uploaded before
 * this date is treated as installer content and hidden. Override with NEXT_PUBLIC_LANDING_CONTENT_SINCE.
 */
export const CONTENT_SINCE = process.env.NEXT_PUBLIC_LANDING_CONTENT_SINCE || "2026-01-01";

export const isOwnUpload = (url) => {
  const m = /\/(\d{4}-\d{2}-\d{2})-[0-9a-f]+\.[a-z0-9]+(?:\?.*)?$/i.exec(String(url || ""));
  return !m || m[1] >= CONTENT_SINCE;
};

/** Admin FAQs that are real content, topped up with our Kenya answers so each tab has at least 4. */
export const mergeFaqs = (adminFaqs, defaults, perGroup = 4) => {
  const norm = (q) => plainText(q).toLowerCase().replace(/[^a-z]/g, "");
  const out = [...adminFaqs];
  for (const d of defaults) {
    const count = out.filter((f) => f.user_type === d.user_type).length;
    if (count < perGroup && !out.some((f) => norm(f.question) === norm(d.question))) out.push(d);
  }
  return out;
};

/** "+254712345678" → "254712345678" for wa.me links; null if not a Kenyan mobile number. */
export const kenyanWhatsApp = (phone) => {
  const d = String(phone || "").replace(/[\s\-().+]/g, "");
  const m = /^(?:254|0)?([71]\d{8})$/.exec(d);
  return m ? `254${m[1]}` : null;
};

export const formatKenyanPhone = (phone) => {
  const wa = kenyanWhatsApp(phone);
  if (!wa) return phone;
  const local = `0${wa.slice(3)}`;
  return `${local.slice(0, 4)} ${local.slice(4, 7)} ${local.slice(7)}`;
};
