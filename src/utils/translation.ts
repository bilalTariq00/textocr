// Simple translation function using Google Translate
export const translateText = async (text: string, targetLang: string = 'en') => {
  try {
    // For now, we'll use a simple approach with Google Translate
    // In production, you'd use Google Translate API with proper authentication
    
    // Create Google Translate URL
    const encodedText = encodeURIComponent(text);
    const translateUrl = `https://translate.google.com/?sl=auto&tl=${targetLang}&text=${encodedText}`;
    
    // For now, return a placeholder - in production you'd make an API call
    return {
      translatedText: `[Translation to ${targetLang}]\n${text}`,
      translateUrl: translateUrl
    };
  } catch (error) {
    console.error('Translation error:', error);
    return {
      translatedText: text,
      translateUrl: null
    };
  }
};

// Open Google Translate with the text
export const openGoogleTranslate = (text: string, targetLang: string = 'en') => {
  const encodedText = encodeURIComponent(text);
  const translateUrl = `https://translate.google.com/?sl=auto&tl=${targetLang}&text=${encodedText}`;
  window.open(translateUrl, '_blank');
};
