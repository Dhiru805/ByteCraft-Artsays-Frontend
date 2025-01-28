import React, { useEffect } from 'react';

const Translate = () => {
  useEffect(() => {
    // Function to initialize Google Translate
    const googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        { pageLanguage: 'en' }, // Default page language
        'google_translate_element'
      );
    };

    // Function to add the Google Translate script
    const addTranslateScript = () => {
      const script = document.createElement('script');
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      script.type = 'text/javascript';
      window.googleTranslateElementInit = googleTranslateElementInit; // Assign the init function globally
      document.head.appendChild(script);
    };

    // Check if Google Translate is already available
    if (!window.google || !window.google.translate) {
      addTranslateScript();
    } else {
      googleTranslateElementInit();
    }
  }, []);

  return <div id="google_translate_element" style={{contentVisibility:"hidden"}}></div>;
};

export default Translate;
