# 🚀 Azure Computer Vision OCR Setup Guide

This guide will help you set up Microsoft Azure Computer Vision OCR with TrOCR for precise Persian/Arabic text extraction.

## 📋 Prerequisites

- Azure account (free trial available)
- Credit card for verification (free tier available)

## 🔧 Step-by-Step Setup

### 1. Create Azure Account
1. Go to [https://portal.azure.com](https://portal.azure.com)
2. Sign up for a free Azure account
3. Complete verification (requires credit card but won't charge for free tier)

### 2. Create Computer Vision Resource
1. In Azure Portal, click **"Create a resource"**
2. Search for **"Computer Vision"**
3. Click **"Create"**
4. Fill in the details:
   - **Subscription**: Your subscription
   - **Resource Group**: Create new (e.g., "ocr-resources")
   - **Region**: Choose closest to you (e.g., "East US")
   - **Name**: Choose a unique name (e.g., "myocr-service")
   - **Pricing Tier**: **Free F0** (5,000 transactions/month FREE)
5. Click **"Review + Create"** → **"Create"**
6. Wait for deployment (~1 minute)

### 3. Get Your API Credentials
1. Go to your Computer Vision resource
2. Click **"Keys and Endpoint"** in the left menu
3. Copy:
   - **KEY 1** (your API key)
   - **Endpoint** (e.g., `https://myocr-service.cognitiveservices.azure.com/`)

### 4. Configure Your App
1. Open `/src/config/azure.ts`
2. Replace the values:

```typescript
export const AZURE_CONFIG = {
  endpoint: 'https://YOUR-RESOURCE-NAME.cognitiveservices.azure.com/',
  apiKey: 'YOUR-API-KEY-HERE',
  useAzureOCR: true // Set to true to enable
};
```

**Example:**
```typescript
export const AZURE_CONFIG = {
  endpoint: 'https://myocr-service.cognitiveservices.azure.com/',
  apiKey: '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p',
  useAzureOCR: true
};
```

### 5. Restart Your App
```bash
npm run dev
```

## ✅ Features You Get with Azure OCR

### 🎯 TrOCR (Transformer OCR)
- State-of-the-art AI model by Microsoft Research
- Exceptional accuracy for Persian/Arabic text
- Better than traditional OCR engines

### 📊 Precise Coordinates
- Exact bounding boxes for each word
- Perfect for layout reconstruction
- Table structure detection

### 🌍 Multi-Language Support
- Arabic, Persian, Urdu
- English, French, German, Spanish
- 100+ languages supported

### 📈 Performance
- **Free Tier**: 5,000 API calls/month
- **Processing Time**: ~2-3 seconds per image
- **Accuracy**: 95%+ for printed text

## 💡 Usage

Once configured, your app will automatically use Azure OCR when `useAzureOCR: true`.

The UI will show:
- ✅ "Using Azure Computer Vision OCR (TrOCR)..."
- Better text extraction quality
- Precise layout preservation

## 🆓 Free Tier Limits

| Feature | Free Tier (F0) |
|---------|----------------|
| Transactions/Month | 5,000 |
| Transactions/Second | 20 |
| Cost | **FREE** |

## 🔐 Security Best Practices

### ⚠️ Important: Keep Your API Key Secret!

**DON'T**:
- Commit API keys to Git
- Share keys publicly
- Hard-code in client-side code

**DO**:
- Use environment variables (production)
- Keep keys in config files (gitignored)
- Rotate keys regularly

### Add to `.gitignore`:
```
src/config/azure.ts
.env.local
```

## 🧪 Testing

Upload a Persian/Arabic document and check:
1. Status shows "Using Azure Computer Vision OCR (TrOCR)..."
2. Text extraction is faster and more accurate
3. Layout is perfectly preserved

## 🆚 Azure vs Tesseract Comparison

| Feature | Azure TrOCR | Tesseract |
|---------|-------------|-----------|
| **Accuracy (Arabic/Persian)** | 95%+ | 70-80% |
| **Speed** | 2-3 sec | 5-10 sec |
| **Layout Preservation** | Excellent | Good |
| **Cost** | 5K free/month | Free unlimited |
| **Table Detection** | Automatic | Manual |
| **Handwriting Support** | Yes | Limited |

## 🔄 Switching Between OCR Engines

Toggle in `/src/config/azure.ts`:

```typescript
// Use Azure (recommended for production)
useAzureOCR: true

// Use Tesseract (free, offline)
useAzureOCR: false
```

## 🐛 Troubleshooting

### Error: "401 Unauthorized"
- Check your API key is correct
- Ensure endpoint URL is exact

### Error: "429 Too Many Requests"
- You've exceeded free tier limit
- Wait for next month or upgrade

### Error: "Invalid endpoint"
- Ensure endpoint ends with `/`
- Format: `https://NAME.cognitiveservices.azure.com/`

### Poor Quality Results
- Check image resolution (min 50x50px)
- Ensure text is clear and not rotated
- Try different image format (PNG vs JPG)

## 📚 Additional Resources

- [Azure Computer Vision Docs](https://docs.microsoft.com/en-us/azure/cognitive-services/computer-vision/)
- [Read API Documentation](https://docs.microsoft.com/en-us/azure/cognitive-services/computer-vision/concept-recognizing-text)
- [TrOCR Research Paper](https://arxiv.org/abs/2109.10282)

## 💬 Support

Need help? Contact Azure Support or check the documentation.

---

**Ready to get started? Follow steps 1-5 above!** 🎉

