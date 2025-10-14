// Azure Computer Vision OCR Service with TrOCR
import { ComputerVisionClient } from '@azure/cognitiveservices-computervision';
import { ApiKeyCredentials } from '@azure/ms-rest-js';
import { AZURE_CONFIG } from '../config/azure';

interface AzureOCRResult {
  text: string;
  words: Array<{
    text: string;
    boundingBox: number[];
    confidence: number;
  }>;
  lines: Array<{
    text: string;
    boundingBox: number[];
    words: Array<{
      text: string;
      boundingBox: number[];
    }>;
  }>;
  paragraphs: Array<{
    text: string;
    boundingBox: number[];
  }>;
}

class AzureOCRService {
  private client: ComputerVisionClient;
  
  constructor() {
    const credentials = new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': AZURE_CONFIG.apiKey } });
    this.client = new ComputerVisionClient(credentials, AZURE_CONFIG.endpoint);
  }

  async extractTextFromImage(imageData: string): Promise<AzureOCRResult> {
    try {
      // Convert base64 to buffer
      const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, '');
      const imageBuffer = Buffer.from(base64Data, 'base64');

      // Use Azure Computer Vision Read API (TrOCR)
      const result = await this.client.readInStream(imageBuffer, {
        language: 'ar', // Arabic/Persian
        pages: ['1'],
        readingOrder: 'natural'
      });

      // Wait for the operation to complete
      const operationId = result.operationLocation?.split('/').pop();
      if (!operationId) {
        throw new Error('No operation ID returned');
      }

      // Poll for results
      let readResult;
      let attempts = 0;
      const maxAttempts = 30;

      do {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        readResult = await this.client.getReadResult(operationId);
        attempts++;
      } while (readResult.status === 'running' && attempts < maxAttempts);

      if (readResult.status !== 'succeeded') {
        throw new Error(`OCR operation failed with status: ${readResult.status}`);
      }

      // Process the results
      const pages = readResult.analyzeResult?.readResults || [];
      if (pages.length === 0) {
        throw new Error('No text found in image');
      }

      const page = pages[0];
      const words = page.lines?.flatMap(line => 
        line.words?.map(word => ({
          text: word.text || '',
          boundingBox: word.boundingBox || [],
          confidence: word.confidence || 0
        })) || []
      ) || [];

      const lines = page.lines?.map(line => ({
        text: line.text || '',
        boundingBox: line.boundingBox || [],
        words: line.words?.map(word => ({
          text: word.text || '',
          boundingBox: word.boundingBox || []
        })) || []
      })) || [];

      const paragraphs = page.lines?.map(line => ({
        text: line.text || '',
        boundingBox: line.boundingBox || []
      })) || [];

      const fullText = lines.map(line => line.text).join('\n');

      return {
        text: fullText,
        words,
        lines,
        paragraphs
      };

    } catch (error) {
      console.error('Azure OCR Error:', error);
      throw new Error(`Azure OCR failed: ${error.message}`);
    }
  }

  // Format text with precise layout using Azure's coordinate data
  formatTextWithPreciseLayout(result: AzureOCRResult): string {
    const { lines, words } = result;
    
    if (!lines || lines.length === 0) {
      return result.text;
    }

    let formattedText = '';
    
    // Group lines by their Y position to detect table structures
    const lineGroups = this.groupLinesByPosition(lines);
    
    // Process each group
    lineGroups.forEach(group => {
      if (group.length === 1) {
        // Single line - format normally
        formattedText += this.formatSingleLine(group[0]) + '\n';
      } else {
        // Multiple lines at similar Y position - likely a table
        formattedText += this.formatTableGroup(group) + '\n';
      }
    });

    return formattedText.trim();
  }

  private groupLinesByPosition(lines: any[]): any[][] {
    const groups: any[][] = [];
    const processed = new Set<number>();

    lines.forEach((line, index) => {
      if (processed.has(index)) return;

      const group = [line];
      processed.add(index);

      // Find lines with similar Y position (within 10 pixels)
      lines.forEach((otherLine, otherIndex) => {
        if (processed.has(otherIndex)) return;
        
        const yDiff = Math.abs(line.boundingBox[1] - otherLine.boundingBox[1]);
        if (yDiff <= 10) {
          group.push(otherLine);
          processed.add(otherIndex);
        }
      });

      groups.push(group);
    });

    return groups;
  }

  private formatSingleLine(line: any): string {
    return line.text;
  }

  private formatTableGroup(group: any[]): string {
    // Sort lines by X position (left to right)
    const sortedGroup = group.sort((a, b) => a.boundingBox[0] - b.boundingBox[0]);
    
    // Format as table columns
    return sortedGroup.map(line => line.text).join('  |  ');
  }
}

// Export singleton instance
export const azureOCRService = new AzureOCRService();
export { AzureOCRResult };
