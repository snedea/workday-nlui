import JSZip from 'jszip';
import { UiNode, UiResponse } from '../runtime/types';

// Canvas Kit design tokens for Penpot
export const CANVAS_KIT_PENPOT_TOKENS = {
  colors: {
    // Primary colors
    'blueberry.100': '#e6f2ff',
    'blueberry.200': '#cce5ff',
    'blueberry.300': '#99cbff',
    'blueberry.400': '#4da3ff',
    'blueberry.500': '#0875e1',
    'blueberry.600': '#005cb4',
    // Status colors
    'success.light': '#d7f4e4',
    'success.main': '#008537',
    'success.dark': '#005423',
    'error.light': '#ffeaea',
    'error.main': '#de2e21',
    'error.dark': '#8f1e16',
    'warning.light': '#fff5e6',
    'warning.main': '#ff9800',
    'warning.dark': '#c77700',
    // Neutrals
    'soap.100': '#ffffff',
    'soap.200': '#f7f7f7',
    'soap.300': '#e8e8e8',
    'soap.400': '#d2d2d2',
    'soap.500': '#949494',
    'soap.600': '#666666'
  },
  spacing: {
    'xxxs': 4,
    'xxs': 8,
    'xs': 12,
    's': 16,
    'm': 24,
    'l': 32,
    'xl': 40,
    'xxl': 64
  },
  typography: {
    'heading.large': { fontSize: 28, fontWeight: 600, lineHeight: 1.3 },
    'heading.medium': { fontSize: 24, fontWeight: 600, lineHeight: 1.3 },
    'heading.small': { fontSize: 20, fontWeight: 600, lineHeight: 1.3 },
    'body.large': { fontSize: 16, fontWeight: 400, lineHeight: 1.5 },
    'body.medium': { fontSize: 14, fontWeight: 400, lineHeight: 1.5 },
    'body.small': { fontSize: 12, fontWeight: 400, lineHeight: 1.5 }
  }
};

interface PenpotObject {
  id: string;
  name: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  selrect: {
    x: number;
    y: number;
    width: number;
    height: number;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
  points: Array<{x: number; y: number}>;
  transform: {
    a: number;
    b: number;
    c: number;
    d: number;
    e: number;
    f: number;
  };
  transformInverse: {
    a: number;
    b: number;
    c: number;
    d: number;
    e: number;
    f: number;
  };
  parentId: string;
  frameId: string;
  flipX?: boolean | null;
  flipY?: boolean | null;
  hideFillOnExport: boolean;
  proportionLock: boolean;
  pageId: string;
  fills: Array<{
    fillColor: string;
    fillOpacity: number;
  }>;
  strokes: Array<{
    strokeColor: string;
    strokeOpacity?: number;
    strokeWidth?: number;
  }>;
  proportion: number;
  shapes?: string[];
  // Text-specific properties
  content?: any; // Complex content structure for text objects
  positionData?: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    paragraphKey: string;
  }>;
  fontSize?: number;
  fontWeight?: number;
  fontFamily?: string;
  // Rectangle-specific properties
  r1?: number;
  r2?: number;
  r3?: number;
  r4?: number;
}

interface PenpotPage {
  id: string;
  name: string;
  objects: { [key: string]: PenpotObject };
}

export class PenpotExporter {
  private objectCounter = 0;
  private currentY = 50;
  private pageObjects: { [key: string]: PenpotObject } = {};
  private fileId = 'f261305b-3a5f-80bb-8006-d485a532cf60';
  private pageId = '5e5872fb-0776-80fd-8006-1560ea25862b';
  private rootFrameId = '00000000-0000-0000-0000-000000000000';

  private generateId(): string {
    // Generate a more realistic Penpot-style UUID
    const chars = '0123456789abcdef';
    let result = '';
    for (let i = 0; i < 32; i++) {
      if (i === 8 || i === 12 || i === 16 || i === 20) result += '-';
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }

  private createBaseObject(
    name: string,
    type: string,
    x: number,
    y: number,
    width: number,
    height: number,
    parentId?: string
  ): PenpotObject {
    const id = this.generateId();
    return {
      id,
      name,
      type,
      x,
      y,
      width,
      height,
      rotation: 0,
      selrect: {
        x,
        y,
        width,
        height,
        x1: x,
        y1: y,
        x2: x + width,
        y2: y + height
      },
      points: [
        { x: 0, y: 0 },
        { x: width, y: 0 },
        { x: width, y: height },
        { x: 0, y: height }
      ],
      transform: {
        a: 1.0,
        b: 0.0,
        c: 0.0,
        d: 1.0,
        e: x,
        f: y
      },
      transformInverse: {
        a: 1.0,
        b: 0.0,
        c: 0.0,
        d: 1.0,
        e: -x,
        f: -y
      },
      parentId: parentId || this.rootFrameId,
      frameId: this.rootFrameId,
      flipX: null,
      flipY: null,
      hideFillOnExport: false,
      proportionLock: false,
      pageId: this.pageId,
      fills: [],
      strokes: [],
      proportion: 1.0
    };
  }

  private convertUiNodeToPenpotObject(node: UiNode, x: number = 50): PenpotObject[] {
    const objects: PenpotObject[] = [];

    switch (node.type) {
      case 'Page':
        // Page is the container, process children
        if (node.children) {
          for (const child of node.children) {
            objects.push(...this.convertUiNodeToPenpotObject(child, x));
          }
        }
        break;

      case 'Header':
        const headerObj = this.createTextObject(
          node.props?.title || 'Page Title',
          x,
          this.currentY,
          { ...CANVAS_KIT_PENPOT_TOKENS.typography['heading.large'] }
        );
        objects.push(headerObj);
        this.currentY += 50;

        if (node.children) {
          for (const child of node.children) {
            objects.push(...this.convertUiNodeToPenpotObject(child, x));
          }
        }
        break;

      case 'Section':
      case 'Card':
        const cardContainer = this.createRectangleObject(
          node.type,
          x,
          this.currentY,
          500,
          200,
          CANVAS_KIT_PENPOT_TOKENS.colors['soap.100'],
          CANVAS_KIT_PENPOT_TOKENS.colors['soap.300']
        );
        objects.push(cardContainer);

        let cardY = this.currentY + 20;

        // Add title if present
        if (node.props?.title) {
          const titleObj = this.createTextObject(
            node.props.title,
            x + 20,
            cardY,
            { ...CANVAS_KIT_PENPOT_TOKENS.typography['heading.small'] }
          );
          objects.push(titleObj);
          cardY += 35;
        }

        // Process children within card
        if (node.children) {
          const originalY = this.currentY;
          this.currentY = cardY;
          for (const child of node.children) {
            objects.push(...this.convertUiNodeToPenpotObject(child, x + 20));
          }
          this.currentY = Math.max(this.currentY, originalY + 220);
        } else {
          this.currentY += 220;
        }
        break;

      case 'Text':
        const textObj = this.createTextObject(
          node.props?.content || node.props?.children || 'Text',
          x,
          this.currentY,
          { ...CANVAS_KIT_PENPOT_TOKENS.typography['body.medium'] }
        );
        objects.push(textObj);
        this.currentY += 30;
        break;

      case 'Button':
        const buttonObjects = this.createButtonObject(
          node.props?.text || node.props?.children || 'Button',
          x,
          this.currentY,
          node.props?.variant || 'primary'
        );
        objects.push(...buttonObjects);
        this.currentY += 60;
        break;

      case 'Table':
        const tableObjects = this.createTableObjects(
          node.props?.columns || [],
          node.props?.rows || [],
          x,
          this.currentY
        );
        objects.push(...tableObjects);
        this.currentY += (node.props?.rows?.length || 2) * 40 + 100;
        break;

      case 'Badge':
        const badgeObjects = this.createBadgeObject(
          node.props?.status || node.props?.text || 'Badge',
          x,
          this.currentY,
          node.props?.status
        );
        objects.push(...badgeObjects);
        this.currentY += 40;
        break;

      case 'Form':
        if (node.children) {
          for (const child of node.children) {
            objects.push(...this.convertUiNodeToPenpotObject(child, x));
          }
        }
        break;

      case 'Field':
        const fieldObjects = this.createFieldObjects(
          node.props?.label || 'Field',
          node.props?.type || 'text',
          x,
          this.currentY,
          node.props
        );
        objects.push(...fieldObjects);
        this.currentY += 70;
        break;

      default:
        // Unknown component - create placeholder
        const placeholderObj = this.createRectangleObject(
          `${node.type} (placeholder)`,
          x,
          this.currentY,
          200,
          40,
          CANVAS_KIT_PENPOT_TOKENS.colors['warning.light'],
          CANVAS_KIT_PENPOT_TOKENS.colors['warning.main']
        );
        objects.push(placeholderObj);
        this.currentY += 60;
        break;
    }

    return objects;
  }

  private createRectangleObject(
    name: string,
    x: number,
    y: number,
    width: number,
    height: number,
    fillColor: string,
    strokeColor?: string,
    borderRadius: number = 4
  ): PenpotObject {
    const obj = this.createBaseObject(name, 'rect', x, y, width, height);

    obj.fills = [{
      fillColor,
      fillOpacity: 1
    }];

    if (strokeColor) {
      obj.strokes = [{
        strokeColor,
        strokeOpacity: 1,
        strokeWidth: 1
      }];
    }

    // Add border radius properties for rectangles
    if (borderRadius > 0) {
      obj.r1 = borderRadius;
      obj.r2 = borderRadius;
      obj.r3 = borderRadius;
      obj.r4 = borderRadius;
    }

    return obj;
  }

  private createTextObject(
    content: string,
    x: number,
    y: number,
    typography: any,
    color: string = CANVAS_KIT_PENPOT_TOKENS.colors['soap.600']
  ): PenpotObject {
    const width = Math.max(content.length * (typography.fontSize * 0.6), 50);
    const height = typography.fontSize * 1.5;

    const obj = this.createBaseObject(content.substring(0, 20), 'text', x, y, width, height);

    // Create proper Penpot text content structure
    const paragraphKey = this.generateId();
    obj.content = {
      type: 'root',
      verticalAlign: 'top',
      children: [
        {
          type: 'paragraph-set',
          children: [
            {
              type: 'paragraph',
              key: paragraphKey,
              children: [
                {
                  text: content,
                  fontFamily: 'Roboto',
                  fontSize: typography.fontSize || 14,
                  fontWeight: typography.fontWeight || 400,
                  fills: [
                    {
                      fillColor: color,
                      fillOpacity: 1
                    }
                  ]
                }
              ],
              textAlign: 'left',
              fills: [
                {
                  fillColor: color,
                  fillOpacity: 1
                }
              ],
              fontFamily: 'Roboto',
              fontSize: typography.fontSize || 14,
              fontWeight: typography.fontWeight || 400,
              fontStyle: 'normal',
              textDecoration: 'none',
              textTransform: 'none',
              direction: 'ltr'
            }
          ]
        }
      ]
    };

    // Add position data for text layout
    obj.positionData = [
      {
        x: 0,
        y: 0,
        width: width,
        height: height,
        paragraphKey: paragraphKey
      }
    ];

    // Ensure strokes array exists
    obj.strokes = [];

    return obj;
  }

  private createButtonObject(
    text: string,
    x: number,
    y: number,
    variant: string
  ): PenpotObject[] {
    let fillColor = CANVAS_KIT_PENPOT_TOKENS.colors['blueberry.500'];
    let textColor = CANVAS_KIT_PENPOT_TOKENS.colors['soap.100'];
    let strokeColor;

    if (variant === 'secondary') {
      fillColor = CANVAS_KIT_PENPOT_TOKENS.colors['soap.100'];
      textColor = CANVAS_KIT_PENPOT_TOKENS.colors['blueberry.500'];
      strokeColor = CANVAS_KIT_PENPOT_TOKENS.colors['blueberry.500'];
    } else if (variant === 'tertiary') {
      fillColor = 'transparent';
      textColor = CANVAS_KIT_PENPOT_TOKENS.colors['blueberry.500'];
    }

    const objects: PenpotObject[] = [];

    // Create button background
    const buttonBg = this.createRectangleObject(
      `${text} Button`,
      x,
      y,
      120,
      40,
      fillColor,
      strokeColor,
      4
    );
    objects.push(buttonBg);

    // Create button text
    const buttonText = this.createTextObject(
      text,
      x + 20,
      y + 13,
      { fontSize: 14, fontWeight: 500 },
      textColor
    );
    objects.push(buttonText);

    return objects;
  }

  private createBadgeObject(
    text: string,
    x: number,
    y: number,
    status?: string
  ): PenpotObject[] {
    let fillColor = CANVAS_KIT_PENPOT_TOKENS.colors['soap.400'];

    if (status === 'Active' || status === 'success') {
      fillColor = CANVAS_KIT_PENPOT_TOKENS.colors['success.main'];
    } else if (status === 'error' || status === 'Terminated') {
      fillColor = CANVAS_KIT_PENPOT_TOKENS.colors['error.main'];
    } else if (status === 'warning' || status === 'On Leave') {
      fillColor = CANVAS_KIT_PENPOT_TOKENS.colors['warning.main'];
    }

    const objects: PenpotObject[] = [];
    const badgeWidth = Math.max(60, text.length * 8 + 16);

    // Create badge background
    const badgeBg = this.createRectangleObject(
      `${text} Badge`,
      x,
      y,
      badgeWidth,
      24,
      fillColor,
      undefined,
      12
    );
    objects.push(badgeBg);

    // Create badge text
    const badgeText = this.createTextObject(
      text,
      x + 8,
      y + 6,
      { fontSize: 12, fontWeight: 500 },
      CANVAS_KIT_PENPOT_TOKENS.colors['soap.100']
    );
    objects.push(badgeText);

    return objects;
  }

  private createTableObjects(
    columns: string[],
    rows: any[],
    x: number,
    y: number
  ): PenpotObject[] {
    const objects: PenpotObject[] = [];
    const cellWidth = 120;
    const cellHeight = 40;

    // Create header row
    columns.forEach((column, colIndex) => {
      const headerCell = this.createRectangleObject(
        `Header ${column}`,
        x + (colIndex * cellWidth),
        y,
        cellWidth,
        cellHeight,
        CANVAS_KIT_PENPOT_TOKENS.colors['soap.200'],
        CANVAS_KIT_PENPOT_TOKENS.colors['soap.300']
      );
      objects.push(headerCell);

      const headerText = this.createTextObject(
        column,
        x + (colIndex * cellWidth) + 8,
        y + 12,
        { ...CANVAS_KIT_PENPOT_TOKENS.typography['body.medium'], fontWeight: 600 }
      );
      objects.push(headerText);
    });

    // Create data rows
    rows.forEach((row, rowIndex) => {
      columns.forEach((column, colIndex) => {
        const cellY = y + ((rowIndex + 1) * cellHeight);
        const isEven = rowIndex % 2 === 0;

        const dataCell = this.createRectangleObject(
          `Cell ${rowIndex},${colIndex}`,
          x + (colIndex * cellWidth),
          cellY,
          cellWidth,
          cellHeight,
          isEven ? CANVAS_KIT_PENPOT_TOKENS.colors['soap.100'] : CANVAS_KIT_PENPOT_TOKENS.colors['soap.200'],
          CANVAS_KIT_PENPOT_TOKENS.colors['soap.300']
        );
        objects.push(dataCell);

        const cellValue = row[column] || '';
        const cellText = this.createTextObject(
          String(cellValue),
          x + (colIndex * cellWidth) + 8,
          cellY + 12,
          { ...CANVAS_KIT_PENPOT_TOKENS.typography['body.medium'] }
        );
        objects.push(cellText);
      });
    });

    return objects;
  }

  private createFieldObjects(
    label: string,
    type: string,
    x: number,
    y: number,
    props: any
  ): PenpotObject[] {
    const objects: PenpotObject[] = [];

    // Create label
    const labelObj = this.createTextObject(
      label,
      x,
      y,
      { ...CANVAS_KIT_PENPOT_TOKENS.typography['body.medium'], fontWeight: 500 }
    );
    objects.push(labelObj);

    // Create input field
    const inputObj = this.createRectangleObject(
      `${label} Input`,
      x,
      y + 25,
      250,
      32,
      CANVAS_KIT_PENPOT_TOKENS.colors['soap.100'],
      CANVAS_KIT_PENPOT_TOKENS.colors['soap.400'],
      4
    );
    objects.push(inputObj);

    // Add placeholder text if present
    if (props?.placeholder) {
      const placeholderObj = this.createTextObject(
        props.placeholder,
        x + 8,
        y + 30,
        { ...CANVAS_KIT_PENPOT_TOKENS.typography['body.medium'] }
      );
      placeholderObj.fills = [{
        fillColor: CANVAS_KIT_PENPOT_TOKENS.colors['soap.500'],
        fillOpacity: 1
      }];
      objects.push(placeholderObj);
    }

    return objects;
  }

  public async exportToPenpot(uiResponse: UiResponse): Promise<Blob> {
    // Reset state
    this.objectCounter = 0;
    this.currentY = 50;
    this.pageObjects = {};

    // Create root frame first
    const rootFrame = this.createBaseObject(
      'Root Frame',
      'frame',
      0,
      0,
      0.01,
      0.01,
      this.rootFrameId
    );
    rootFrame.id = this.rootFrameId;
    rootFrame.parentId = this.rootFrameId; // Root frame references itself
    rootFrame.fills = [{ fillColor: '#FFFFFF', fillOpacity: 1 }];

    // Convert UI tree to Penpot objects
    const objects = this.convertUiNodeToPenpotObject(uiResponse.tree);

    // Add all objects to the root frame's shapes array
    rootFrame.shapes = objects.map(obj => obj.id);

    // Build objects map including root frame
    this.pageObjects[rootFrame.id] = rootFrame;
    objects.forEach(obj => {
      this.pageObjects[obj.id] = obj;
    });

    // Create Penpot file structure with proper metadata
    const penpotFile = {
      features: [
        "fdata/path-data",
        "design-tokens/v1",
        "layout/grid",
        "components/v2",
        "fdata/shape-data-type"
      ],
      name: uiResponse.title || 'Canvas Kit Design',
      id: this.fileId,
      isShared: false,
      options: {
        componentsV2: true
      },
      migrations: [
        "legacy-50",
        "0004-clean-shadow-color"
      ],
      version: 67,
      projectId: this.generateId()
    };

    const penpotPage = {
      id: this.pageId,
      name: 'Page 1',
      background: '#ffffff',
      index: 0
    };

    // Create ZIP file
    const zip = new JSZip();

    // Add main file info
    zip.file(`files/${this.fileId}.json`, JSON.stringify(penpotFile, null, 2));

    // Add page info
    zip.file(`files/${this.fileId}/pages/${this.pageId}.json`, JSON.stringify(penpotPage, null, 2));

    // Add individual objects
    Object.entries(this.pageObjects).forEach(([id, obj]) => {
      zip.file(
        `files/${this.fileId}/pages/${this.pageId}/${id}.json`,
        JSON.stringify(obj, null, 2)
      );
    });

    // Generate and return the blob
    return await zip.generateAsync({ type: 'blob' });
  }
}