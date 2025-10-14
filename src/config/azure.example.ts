// Azure Computer Vision Configuration Template
// Copy this file to azure.ts and add your credentials

// Instructions:
// 1. Go to https://portal.azure.com
// 2. Create a Computer Vision resource (Free F0 tier)
// 3. Get your endpoint and API key from "Keys and Endpoint"
// 4. Copy this file: cp azure.example.ts azure.ts
// 5. Replace the values below with your credentials

export const AZURE_CONFIG = {
  // Your Azure Computer Vision endpoint
  // Example: 'https://myocrservice.cognitiveservices.azure.com/'
  endpoint: 'https://your-resource-name.cognitiveservices.azure.com/',
  
  // Your Azure Computer Vision API key (KEY 1 or KEY 2)
  // Example: '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p'
  apiKey: 'your-api-key-here',
  
  // Set to true to enable Azure OCR, false to use Tesseract
  useAzureOCR: false
};

// ⚠️ Security Note:
// Never commit the actual azure.ts file with your real API key!
// The .gitignore file is configured to exclude it.
//
// For production deployment:
// Use environment variables instead of hardcoding credentials

