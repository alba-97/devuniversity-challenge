import { useState, useEffect } from "react";
import i18n from "@/i18n";

export function useTranslationReady() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkReady = () => {
      const isTranslationLoaded =
        i18n.hasResourceBundle(i18n.language, "common") &&
        Object.keys(i18n.getResourceBundle(i18n.language, "common")).length > 0;

      setIsReady(isTranslationLoaded);
    };

    checkReady();

    i18n.on("languageChanged", checkReady);

    return () => {
      i18n.off("languageChanged", checkReady);
    };
  }, []);

  return isReady;
}
