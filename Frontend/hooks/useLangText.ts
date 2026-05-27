export function useLangText() {
  // Simple localization helper used in many components.
  // Prefer a full i18n solution; this is a minimal fallback.
  const getLang = () => {
    try {
      const saved = (localStorage && localStorage.getItem && localStorage.getItem("lang")) || null;
      if (saved) return saved;
    } catch (e) {
      // ignore
    }
    if (typeof navigator !== "undefined") {
      return navigator.language && navigator.language.startsWith("vi") ? "vi" : "en";
    }
    return "en";
  };

  const lang = getLang();

  return (vi: string, en?: string) => {
    if (lang === "vi") return vi;
    return en ?? vi;
  };
}

export default useLangText;
