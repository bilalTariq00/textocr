// AWS Textract Service for Structured Document Analysis
import { TextractClient, AnalyzeDocumentCommand, DetectDocumentTextCommand } from '@aws-sdk/client-textract';
import { AWS_CONFIG } from '../config/aws';

interface TextractResult {
  text: string;
  blocks: Array<{
    id: string;
    blockType: string;
    text?: string;
    confidence?: number;
    geometry: {
      boundingBox: {
        left: number;
        top: number;
        width: number;
        height: number;
      };
      polygon: Array<{ x: number; y: number }>;
    };
    relationships?: Array<{
      type: string;
      ids: string[];
    }>;
  }>;
  tables: Array<{
    id: string;
    rows: Array<{
      cells: Array<{
        text: string;
        rowIndex: number;
        columnIndex: number;
        boundingBox: {
          left: number;
          top: number;
          width: number;
          height: number;
        };
      }>;
    }>;
  }>;
  forms: Array<{
    key: string;
    value: string;
    confidence: number;
  }>;
}

class AWSTextractService {
  private client: TextractClient;
  
  constructor() {
    this.client = new TextractClient({
      region: AWS_CONFIG.region,
      credentials: {
        accessKeyId: AWS_CONFIG.accessKeyId,
        secretAccessKey: AWS_CONFIG.secretAccessKey,
      },
    });
  }

  async extractTextFromImage(imageData: string): Promise<TextractResult> {
    try {
      // Convert base64 to buffer
      const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, '');
      const imageBuffer = Buffer.from(base64Data, 'base64');

      // Use AnalyzeDocument for structured data (tables, forms, key-value pairs)
      const command = new AnalyzeDocumentCommand({
        Document: {
          Bytes: imageBuffer,
        },
        FeatureTypes: ['TABLES', 'FORMS', 'LAYOUT'], // Get tables, forms, and layout
      });

      const response = await this.client.send(command);
      
      if (!response.Blocks) {
        throw new Error('No blocks returned from Textract');
      }

      // Process the response
      const result = this.processTextractResponse(response.Blocks);
      
      return result;

    } catch (error) {
      console.error('AWS Textract Error:', error);
      throw new Error(`AWS Textract failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private processTextractResponse(blocks: any[]): TextractResult {
    const textBlocks = blocks.filter(block => block.BlockType === 'LINE');
    const tableBlocks = blocks.filter(block => block.BlockType === 'TABLE');
    const formBlocks = blocks.filter(block => block.BlockType === 'KEY_VALUE_SET');

    // Extract plain text
    const text = textBlocks
      .map(block => block.Text || '')
      .join('\n')
      .trim();

    // Process tables
    const tables = this.processTables(tableBlocks, blocks);

    // Process forms (key-value pairs)
    const forms = this.processForms(formBlocks, blocks);

    return {
      text,
      blocks: blocks.map(block => ({
        id: block.Id,
        blockType: block.BlockType,
        text: block.Text,
        confidence: block.Confidence,
        geometry: {
          boundingBox: {
            left: block.Geometry?.BoundingBox?.Left || 0,
            top: block.Geometry?.BoundingBox?.Top || 0,
            width: block.Geometry?.BoundingBox?.Width || 0,
            height: block.Geometry?.BoundingBox?.Height || 0,
          },
          polygon: block.Geometry?.Polygon?.map((point: any) => ({
            x: point.X,
            y: point.Y,
          })) || [],
        },
        relationships: block.Relationships?.map((rel: any) => ({
          type: rel.Type,
          ids: rel.Ids || [],
        })),
      })),
      tables,
      forms,
    };
  }

  private processTables(tableBlocks: any[], allBlocks: any[]): any[] {
    return tableBlocks.map(tableBlock => {
      const cells = allBlocks.filter(block => 
        block.BlockType === 'CELL' && 
        block.Relationships?.some((rel: any) => rel.Ids?.includes(tableBlock.Id))
      );

      // Group cells by row
      const rows: any[] = [];
      const maxRow = Math.max(...cells.map(cell => cell.RowIndex || 0));
      const maxCol = Math.max(...cells.map(cell => cell.ColumnIndex || 0));

      for (let row = 0; row <= maxRow; row++) {
        const rowCells = cells
          .filter(cell => cell.RowIndex === row)
          .sort((a, b) => (a.ColumnIndex || 0) - (b.ColumnIndex || 0));

        rows.push({
          cells: rowCells.map(cell => ({
            text: cell.Text || '',
            rowIndex: cell.RowIndex,
            columnIndex: cell.ColumnIndex,
            boundingBox: {
              left: cell.Geometry?.BoundingBox?.Left || 0,
              top: cell.Geometry?.BoundingBox?.Top || 0,
              width: cell.Geometry?.BoundingBox?.Width || 0,
              height: cell.Geometry?.BoundingBox?.Height || 0,
            },
          })),
        });
      }

      return {
        id: tableBlock.Id,
        rows,
      };
    });
  }

  private processForms(keyValueBlocks: any[], allBlocks: any[]): any[] {
    const forms: any[] = [];

    keyValueBlocks.forEach(block => {
      if (block.EntityTypes?.includes('KEY')) {
        const keyText = block.Text || '';
        const valueBlock = allBlocks.find(b => 
          b.Relationships?.some((rel: any) => 
            rel.Type === 'VALUE' && rel.Ids?.includes(block.Id)
          )
        );

        if (valueBlock) {
          forms.push({
            key: keyText,
            value: valueBlock.Text || '',
            confidence: Math.min(block.Confidence || 0, valueBlock.Confidence || 0),
          });
        }
      }
    });

    return forms;
  }

  // Format text with precise layout using Textract's structured data
  formatTextWithStructuredLayout(result: TextractResult): string {
    let formattedText = '';

    // Add tables first
    result.tables.forEach(table => {
      formattedText += this.formatTable(table);
      formattedText += '\n\n';
    });

    // Add forms (key-value pairs)
    if (result.forms.length > 0) {
      formattedText += '📋 Form Data:\n';
      result.forms.forEach(form => {
        formattedText += `${form.key}: ${form.value}\n`;
      });
      formattedText += '\n';
    }

    // Add regular text
    const textBlocks = result.blocks.filter(block => 
      block.blockType === 'LINE' && 
      !this.isInTable(block, result.tables)
    );

    // Sort by position (top to bottom, left to right)
    textBlocks.sort((a, b) => {
      const aTop = a.geometry.boundingBox.top;
      const bTop = b.geometry.boundingBox.top;
      const aLeft = a.geometry.boundingBox.left;
      const bLeft = b.geometry.boundingBox.left;

      if (Math.abs(aTop - bTop) < 0.01) {
        return aLeft - bLeft; // Same row, sort by left position
      }
      return aTop - bTop; // Different rows, sort by top position
    });

    textBlocks.forEach(block => {
      if (block.text) {
        formattedText += block.text + '\n';
      }
    });

    return formattedText.trim();
  }

  private formatTable(table: any): string {
    let tableText = '';

    table.rows.forEach((row: any, rowIndex: number) => {
      const cells = row.cells.sort((a: any, b: any) => a.columnIndex - b.columnIndex);
      const rowText = cells.map((cell: any) => cell.text).join(' | ');
      tableText += rowText + '\n';

      // Add separator after header row
      if (rowIndex === 0 && table.rows.length > 1) {
        const separator = cells.map(() => '─'.repeat(10)).join(' | ');
        tableText += separator + '\n';
      }
    });

    return tableText;
  }

  private isInTable(block: any, tables: any[]): boolean {
    return tables.some(table => 
      table.rows.some((row: any) => 
        row.cells.some((cell: any) => 
          this.blocksOverlap(block.geometry.boundingBox, cell.boundingBox)
        )
      )
    );
  }

  private blocksOverlap(box1: any, box2: any): boolean {
    const left1 = box1.left;
    const right1 = box1.left + box1.width;
    const top1 = box1.top;
    const bottom1 = box1.top + box1.height;

    const left2 = box2.left;
    const right2 = box2.left + box2.width;
    const top2 = box2.top;
    const bottom2 = box2.top + box2.height;

    return !(right1 < left2 || left1 > right2 || bottom1 < top2 || top1 > bottom2);
  }
}

// Export singleton instance
export const awsTextractService = new AWSTextractService();
export { TextractResult };
