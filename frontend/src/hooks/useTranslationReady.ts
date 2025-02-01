import { useState, useEffect } from 'react';
import i18n from '@/i18n';

export function useTranslationReady() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkReady = () => {
      // Check if translations are fully loaded
      const isTranslationLoaded = 
        i18n.hasResourceBundle(i18n.language, 'common') &&
        Object.keys(i18n.getResourceBundle(i18n.language, 'common')).length > 0;

      setIsReady(isTranslationLoaded);
    };

    // Check immediately
    checkReady();

    // Listen for language changes
    i18n.on('languageChanged', checkReady);

    // Cleanup listener
    return () => {
      i18n.off('languageChanged', checkReady);
    };
  }, []);

  return isReady;
}
