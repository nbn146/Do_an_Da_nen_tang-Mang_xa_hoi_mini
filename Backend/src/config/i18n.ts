import i18next from "i18next";
import * as middleware from "i18next-http-middleware";

import viTranslation from '../locales/vi/messages.json' with { type: "json" };
import enTranslation from '../locales/en/messages.json' with { type: "json" };

i18next
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: "vi",
    resources: {
      vi: {
        translation:viTranslation,
      },
      en: {
        translation: enTranslation,
      },
    },
    preload: ['vi', 'en'], //
    detection: {
      order: ["header", "cookie"],
      caches: ["cookie"],
      lookupHeader: "accept-language",
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18next;