# Text Extractor & Formatter

A Next.js application that extracts text from images using OCR (Optical Character Recognition) and provides formatting options to make the text more readable.

## Features

### 🎯 OCR Engines (Choose Your Preferred)
- **AWS Textract** ⭐ RECOMMENDED for structured documents
  - **Automatic table detection** with perfect structure
  - **Form extraction** (key-value pairs)
  - **Layout analysis** for exact text placement
  - 95%+ accuracy for Persian/Arabic
  - 1,000 pages/month FREE
- **Microsoft Azure Computer Vision (TrOCR)**: Best for general OCR
  - 95%+ accuracy for Persian/Arabic text
  - Precise bounding box coordinates
  - Fast processing (2-3 sec)
  - 5,000 free API calls/month
- **Tesseract.js**: Free offline fallback
  - Works without internet
  - Completely free, unlimited
  - Good for basic text extraction

### 📸 Image Input
- **Image Upload**: Upload images in PNG, JPG, or JPEG format
- **Copy-Paste Support**: Paste images directly from clipboard (Ctrl+V / Cmd+V)
- **Drag & Drop**: Drag images directly into the app

### 🌍 Multi-Language Support
- **Automatic Language Detection**: Detects Arabic, Persian, Urdu vs English
- **Text Direction**: Auto-detects LTR (English) vs RTL (Arabic/Persian/Urdu)
- **Arabic-Friendly Fonts**: Noto Sans Arabic, Amiri, Scheherazade New

### ✨ Text Formatting
- Adjustable font size (12px - 24px)
- Multiple font families (LTR and RTL optimized)
- Text color customization
- Bold/Italic formatting
- Manual direction control (LTR/RTL)
- Layout preservation (tables, lists, indentation)

### 🚀 Advanced Features
- **Translation**: One-click translation to English via Google Translate
- **Layout Preservation**: Maintains original document structure
- **Table Detection**: Automatically formats tables and columns
- **Text Download**: Save formatted text as .txt file
- **Real-time Preview**: See formatting changes instantly

## Getting Started

### Quick Start (Tesseract Only)
1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
```bash
npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:3000`

### OCR Engine Setup (Choose One or Use Multiple)

#### Option 1: AWS Textract ⭐ BEST for Tables & Forms (10 min setup)
Perfect for your Persian/Arabic documents with tables!

1. **Follow**: [AWS_QUICKSTART.md](AWS_QUICKSTART.md) or [AWS_TEXTRACT_GUIDE.md](AWS_TEXTRACT_GUIDE.md)
2. **Quick Config**:
   ```typescript
   // Edit /src/config/aws.ts
   export const AWS_CONFIG = {
     region: 'us-east-1',
     accessKeyId: 'YOUR-ACCESS-KEY',
     secretAccessKey: 'YOUR-SECRET-KEY',
     useAWSTextract: true
   };
   ```
3. **Done!** Get automatic table detection (1,000 pages/month FREE)

#### Option 2: Azure TrOCR - BEST for General OCR (3 min setup)
1. **Follow**: [QUICKSTART.md](QUICKSTART.md) or [AZURE_SETUP_GUIDE.md](AZURE_SETUP_GUIDE.md)
2. **Quick Config**:
   ```typescript
   // Edit /src/config/azure.ts
   export const AZURE_CONFIG = {
     endpoint: 'https://YOUR-NAME.cognitiveservices.azure.com/',
     apiKey: 'YOUR-API-KEY',
     useAzureOCR: true
   };
   ```
3. **Done!** App uses Azure TrOCR (5,000 free calls/month)

#### Option 3: Tesseract - FREE Offline (Already Working!)
- ✅ No setup needed
- ✅ Works right now
- ✅ Completely free

#### Compare All Options:
See [OCR_COMPARISON.md](OCR_COMPARISON.md) for detailed comparison

## How to Use

1. **Upload an Image**: 
   - Click "Choose File" and select an image containing text, OR
   - Press Ctrl+V (Cmd+V on Mac) to paste an image from your clipboard, OR
   - Click "Paste Image" button to paste from clipboard
2. **Extract Text**: Click "Extract Text" to process the image and extract text
3. **Format Text**: Use the formatting controls to:
   - Adjust font size with the slider
   - Change font family from the dropdown
   - Select text color with the color picker
   - Toggle bold/italic formatting
4. **Download**: Click "Download" to save the formatted text as a .txt file

## Supported Languages

The OCR engine supports:
- English (eng)
- Arabic (ara) 
- Persian/Farsi (fas)

## Technical Details

### Tech Stack
- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **OCR Engines**: 
  - Microsoft Azure Computer Vision (TrOCR) - Transformer-based OCR
  - Tesseract.js - Open-source OCR fallback
- **Icons**: Lucide React
- **Fonts**: Next.js Google Fonts (Noto Sans Arabic, Amiri)

### OCR Comparison

| Feature | Azure TrOCR | Tesseract |
|---------|-------------|-----------|
| **Accuracy (Arabic/Persian)** | 95%+ | 70-80% |
| **Speed** | 2-3 sec | 5-10 sec |
| **Layout Preservation** | Excellent | Good |
| **Cost** | 5K free/month | Free unlimited |
| **Setup** | 3 min config | Ready to use |
| **Offline** | No (API) | Yes |

## Browser Compatibility

This application works in all modern browsers that support:
- File API
- Canvas API
- Web Workers (for OCR processing)

## Performance Notes

- OCR processing happens in a Web Worker to prevent UI blocking
- Progress is shown during text extraction
- Large images may take longer to process
- Recommended image size: under 10MB for optimal performance