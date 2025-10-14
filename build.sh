#!/bin/bash

# Production Build Script for Text Converter App
echo "🚀 Starting production build process..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
npm run clean

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Type checking
echo "🔍 Running type checking..."
npm run type-check

# Linting
echo "🔧 Running linting..."
npm run lint:fix

# Build the application
echo "🏗️ Building application..."
npm run build:production

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "📊 Build size:"
    du -sh .next/
    echo ""
    echo "🚀 Ready for deployment!"
    echo "To start the production server, run: npm start"
else
    echo "❌ Build failed!"
    exit 1
fi
