/**
 * Kenyan mobile numbers (07xx / 01xx / +254), matching the backend's KenyanPhone rule.
 * The phone input sends digits like "254712345678"; people also type 0712 345 678 or +254 712 345 678.
 */
import { store } from "redux/store";

export const normalizeKenyanPhone = (value) => {
  let d = String(value ?? "").replace(/[\s\-().]/g, "");
  if (!/^\+?\d+$/.test(d)) return null;
  d = d.replace(/^\+/, "");
  if (d.startsWith("00254")) d = d.slice(2);
  let m = /^254(?:0)?([71]\d{8})$/.exec(d) || /^0([71]\d{8})$/.exec(d) || /^([71]\d{8})$/.exec(d);
  return m ? `+254${m[1]}` : null;
};

export const isKenyanMobile = (value) => normalizeKenyanPhone(value) !== null;

/** Kenyan rules apply when the platform's country is Kenya (set by `php artisan fasta:kenya-defaults`). */
export const kenyaPhoneRulesOn = () => {
  try {
    return String(store.getState()?.configData?.configData?.country || "").toUpperCase() === "KE";
  } catch (e) {
    return false;
  }
};

export const KENYAN_PHONE_MESSAGE = "Enter a valid Kenyan mobile number, e.g. 0712 345 678 or +254 712 345 678.";

/** Yup test: (schema) => schema.test(...kenyanPhoneTest(t)) */
export const kenyanPhoneTest = (t = (s) => s) => [
  "kenyan-mobile",
  t(KENYAN_PHONE_MESSAGE),
  (value) => !value || !kenyaPhoneRulesOn() || isKenyanMobile(value),
];
