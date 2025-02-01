import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export const useLanguageEffect = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const browserLang = navigator.language.split("-")[0];
    const currentLang = i18n.language;
    const supportedLangs = i18n.options.supportedLngs;

    const isLanguageSupported = Array.isArray(supportedLangs)
      ? supportedLangs.includes(browserLang)
      : false;

    if (isLanguageSupported && currentLang !== browserLang) {
      i18n.changeLanguage(browserLang);
    }
  }, []);
};
