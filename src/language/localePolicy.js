export const normalizeLanguage = (language) =>
  typeof language === "string" && /^ar(?:[-_]|$)/i.test(language)
    ? "en"
    : language;

export const migrateRemovedArabic = (storage, cookieString = "") => {
  let stored;
  try {
    stored = JSON.parse(storage.getItem("language-setting") || "null");
  } catch {
    stored = null;
  }
  const cookieLanguage = cookieString.match(
    /(?:^|;\s*)languageSetting=([^;]*)/
  )?.[1];
  const removed =
    (typeof stored === "string" && /^ar(?:[-_]|$)/i.test(stored)) ||
    (cookieLanguage && /^ar(?:[-_]|$)/i.test(cookieLanguage));
  if (!removed) return false;
  storage.setItem("language-setting", JSON.stringify("en"));
  storage.setItem("country", JSON.stringify("US"));
  try {
    const settings = JSON.parse(storage.getItem("settings") || "{}");
    storage.setItem(
      "settings",
      JSON.stringify({ ...settings, direction: "ltr" })
    );
  } catch {
    /* Keep an unrelated malformed settings record untouched. */
  }
  return true;
};
