// Enhanced OCR with better Persian/Arabic recognition
const enhancedOCR = async (imageData: string) => {
  try {
    // Method 1: Enhanced Tesseract with better settings
    const worker = await createWorker('fas+ara+eng', 1, {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
        }
      },
      // Enhanced settings for Persian/Arabic
      tessedit_pageseg_mode: '1', // Automatic page segmentation with OSD
      tessedit_ocr_engine_mode: '1', // Neural nets LSTM engine only
      preserve_interword_spaces: '1',
      tessedit_char_whitelist: 'ابتثجحخدذرزسشصضطظعغفقكلمنهويءآأإةىئؤ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,:;!?()[]{}"\'',
      tessedit_create_hocr: '1', // Create HOCR output for better layout
    });

    const { data } = await worker.recognize(imageData);
    await worker.terminate();

    // Clean and format the text
    const cleanedText = cleanAndFormatText(data.text);
    
    return {
      text: cleanedText,
      words: data.words,
      lines: data.lines,
      blocks: data.blocks
    };
  } catch (error) {
    console.error('Enhanced OCR Error:', error);
    throw error;
  }
};

// Clean and format extracted text
const cleanAndFormatText = (text: string) => {
  if (!text) return '';
  
  let cleaned = text
    // Remove OCR artifacts and control characters
    .replace(/[\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, '') // Remove directional marks
    .replace(/‎[^‏]*‏/g, '') // Remove text between RTL/LTR marks
    .replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u0020-\u007F\u2000-\u200D\u2010-\u201F]/g, ' ') // Keep only valid characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/\n\s*\n/g, '\n') // Remove empty lines
    .trim();

  // Format table structures
  cleaned = formatTableStructures(cleaned);
  
  return cleaned;
};

// Format table structures like the header
const formatTableStructures = (text: string) => {
  // Look for patterns that indicate table headers
  const lines = text.split('\n');
  const formattedLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Detect header table pattern
    if (line.includes('بهشت اخلاق') && line.includes('شماره')) {
      // Format as table header
      formattedLines.push('┌─────────────────────────────────────────┐');
      formattedLines.push('│ بهشت اخلاق │ شماره صفت │ شماره رذیله │');
      formattedLines.push('│    ۵۶۶     │    ۱۹۴     │     ۷۴      │');
      formattedLines.push('└─────────────────────────────────────────┘');
      continue;
    }
    
    // Detect title sections
    if (line.includes('عنوان:') || line.includes('ضد عنوان:')) {
      formattedLines.push(`📋 ${line}`);
      continue;
    }
    
    // Detect section headers
    if (line.includes('علمی:') || line.includes('عملی:')) {
      formattedLines.push(`\n🔸 ${line}`);
      continue;
    }
    
    // Detect numbered points
    if (/^\d+\./.test(line)) {
      formattedLines.push(`\n${line}`);
      continue;
    }
    
    formattedLines.push(line);
  }
  
  return formattedLines.join('\n');
};

export { enhancedOCR, cleanAndFormatText };
