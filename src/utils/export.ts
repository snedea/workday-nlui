import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import { UiResponse, UiNode } from '../runtime/types';

// Canvas Kit Roboto font CSS for PNG export embedding
const ROBOTO_FONT_CSS = `
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 300;
  src: local('Roboto Light'), local('Roboto-Light'), url('https://design.workdaycdn.com/beta/assets/fonts@1.0.0/roboto/ttf/Roboto-Light.ttf') format('truetype');
}
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  src: local('Roboto Regular'), local('Roboto-Regular'), url('https://design.workdaycdn.com/beta/assets/fonts@1.0.0/roboto/ttf/Roboto-Regular.ttf') format('truetype');
}
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 500;
  src: local('Roboto Medium'), local('Roboto-Medium'), url('https://design.workdaycdn.com/beta/assets/fonts@1.0.0/roboto/ttf/Roboto-Medium.ttf') format('truetype');
}
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 700;
  src: local('Roboto Bold'), local('Roboto-Bold'), url('https://design.workdaycdn.com/beta/assets/fonts@1.0.0/roboto/ttf/Roboto-Bold.ttf') format('truetype');
}
@font-face {
  font-family: 'Roboto Mono';
  font-style: normal;
  font-weight: 400;
  src: local('Roboto Mono'), local('RobotoMono-Regular'), url('https://design.workdaycdn.com/beta/assets/fonts@1.0.0/roboto/ttf/RobotoMono-Regular.ttf') format('truetype');
}
`;

export type NLUIExportPayload = {
  version: string;                            // e.g., "0.1.7"
  appName: string;                            // derive from UI/state where available
  generatedAt: string;                        // ISO
  previewState: UiResponse;                   // the NLUI layout / component model
  workday?: {
    // any extra knobs you can extract now (tenant-neutral)
  };
};

/**
 * Export ONLY the preview content as PNG with proper Roboto fonts and full tab text
 */
export async function exportPreviewAsPNG(
  root: HTMLElement,
  opts?: { scale?: number; background?: string }
): Promise<void> {
  try {
    // Get actual dimensions of the preview content
    const rect = root.getBoundingClientRect();
    const scale = opts?.scale || 1;
    const background = opts?.background || '#f7f7f7'; // Canvas Kit soap.200

    // Store all original styles for restoration
    const originalStyles = new Map<HTMLElement, string>();
    const allElements = root.querySelectorAll('*');

    // Store root element style
    originalStyles.set(root, root.style.cssText);

    try {
      // Step 1: Apply Roboto font directly to ALL elements (works around html-to-image font issues)
      root.style.fontFamily = 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

      allElements.forEach((el) => {
        const element = el as HTMLElement;
        // Store original style
        originalStyles.set(element, element.style.cssText);

        // Apply Roboto font inline
        element.style.fontFamily = 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

        // Step 2: Fix tab text truncation by removing truncation styles
        const computedStyle = getComputedStyle(element);
        const elementClasses = element.className || '';

        // Identify tab-related elements and remove truncation
        if (elementClasses.includes('tab') ||
            element.getAttribute('role') === 'tab' ||
            element.closest('[role="tablist"]') ||
            computedStyle.textOverflow === 'ellipsis') {

          element.style.whiteSpace = 'nowrap';
          element.style.textOverflow = 'unset';
          element.style.overflow = 'visible';
          element.style.maxWidth = 'none';
          element.style.width = 'auto';
        }

        // Step 3: Fix text wrapping with better word break handling
        const tagName = element.tagName.toLowerCase();
        const textContent = element.textContent || '';
        const isShortText = textContent.trim().length < 50;

        // Detect labels and form elements that should not break
        const isLabel = tagName === 'label' ||
                       element.getAttribute('role') === 'label' ||
                       elementClasses.includes('label') ||
                       element.closest('label') !== null ||
                       (isShortText && (elementClasses.includes('field') || elementClasses.includes('form')));

        // Apply table-specific styles for better layout
        if (tagName === 'table') {
          element.style.width = '100%';
          element.style.maxWidth = '100%';
          element.style.tableLayout = 'fixed';
          element.style.wordBreak = 'normal'; // Changed from break-word
        }

        // Handle labels and short text - prevent word breaking
        if (isLabel || isShortText) {
          element.style.whiteSpace = 'nowrap';
          element.style.wordBreak = 'normal';
          element.style.overflowWrap = 'normal';
        }

        // Handle table headers - allow wrapping for multi-word headers but preserve words
        else if (tagName === 'th' || element.getAttribute('role') === 'columnheader') {
          element.style.whiteSpace = 'normal';
          element.style.wordBreak = 'normal'; // Changed from break-word
          element.style.overflowWrap = 'break-word'; // Only break very long words
          element.style.lineHeight = '1.2';
          element.style.padding = '8px';
          element.style.verticalAlign = 'top';
        }

        // Handle table cells - prevent excessive wrapping but allow reasonable breaks
        else if (tagName === 'td' || element.getAttribute('role') === 'cell') {
          element.style.whiteSpace = 'normal';
          element.style.wordBreak = 'normal'; // Changed from break-word
          element.style.overflowWrap = 'break-word'; // Only break very long words
          element.style.minWidth = '80px';
          element.style.maxWidth = '200px';
          element.style.padding = '8px';
          element.style.verticalAlign = 'top';
          element.style.lineHeight = '1.3';
        }
      });

      // Step 4: Capture with html-to-image (skip fontEmbedCSS since we applied fonts inline)
      const blob = await toPng(root, {
        quality: 1,
        pixelRatio: scale,
        backgroundColor: background,
        width: rect.width,
        height: rect.height,
        skipFonts: true, // Skip since we applied fonts inline
        filter: (node) => {
          // Only exclude elements explicitly marked for exclusion
          if (node instanceof Element && node.getAttribute('data-no-export') === 'true') {
            return false;
          }
          return true;
        },
      });

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const filename = `nlui-preview-${timestamp}.png`;

      // Download the PNG
      const link = document.createElement('a');
      link.download = filename;
      link.href = blob;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } finally {
      // Step 5: Restore ALL original styles
      originalStyles.forEach((originalStyle, element) => {
        element.style.cssText = originalStyle;
      });
    }
  } catch (error) {
    console.error('Failed to export PNG:', error);
    throw new Error('Failed to export preview as PNG');
  }
}

/**
 * Export Workday Extend bundle as ZIP file
 */
export async function exportWorkdayBundleZip(payload: NLUIExportPayload): Promise<void> {
  try {
    const zip = new JSZip();
    const workdayFolder = zip.folder('workday');

    if (!workdayFolder) {
      throw new Error('Failed to create workday folder in ZIP');
    }

    // Generate Workday format files
    const amd = generateAMD(payload);
    const pmd = generatePMD(payload);
    const smd = generateSMD(payload);
    const mockData = generateMockData(payload);

    // Add files to ZIP
    workdayFolder.file('AMD.json', JSON.stringify(amd, null, 2));
    workdayFolder.file('PMD.json', JSON.stringify(pmd, null, 2));
    workdayFolder.file('SMD.json', JSON.stringify(smd, null, 2));
    workdayFolder.file('mock-data.json', JSON.stringify(mockData, null, 2));

    // Generate and download ZIP
    const blob = await zip.generateAsync({ type: 'blob' });
    const filename = `nlui-extend-bundle-${payload.version}.zip`;

    const link = document.createElement('a');
    link.download = filename;
    link.href = URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('Failed to export Workday bundle:', error);
    throw new Error('Failed to export Workday Extend bundle');
  }
}

/**
 * Generate Application Metadata (AMD) for Workday Extend
 */
function generateAMD(payload: NLUIExportPayload) {
  return {
    schema: "https://schemas.workday.com/extend/amd/v1",
    appName: payload.appName || "NLUI App",
    version: payload.version,
    generatedAt: payload.generatedAt,
    description: `Generated from NLUI Studio v${payload.version}`,
    author: "NLUI Studio",
    canvasKitVersion: "14.0.2",
    // TODO: map app-level metadata from NLUI state
    metadata: {
      sourceType: "nlui-studio",
      originalTitle: payload.previewState?.title || "Untitled",
      componentCount: countComponents(payload.previewState?.tree),
    }
  };
}

/**
 * Generate Page Metadata (PMD) for Workday Extend
 */
function generatePMD(payload: NLUIExportPayload) {
  return {
    schema: "https://schemas.workday.com/extend/pmd/v1",
    page: {
      title: payload.previewState?.title || "NLUI Page",
      version: payload.previewState?.version || "1.0",
      components: deriveComponents(payload.previewState?.tree),
      layout: deriveLayout(payload.previewState?.tree),
    },
    // TODO: refine per NLUI → Extend mapping
    canvasKit: {
      version: "14.0.2",
      componentsUsed: getUniqueComponentTypes(payload.previewState?.tree),
    }
  };
}

/**
 * Generate Section Metadata (SMD) for Workday Extend
 */
function generateSMD(payload: NLUIExportPayload) {
  return {
    schema: "https://schemas.workday.com/extend/smd/v1",
    sections: deriveSections(payload.previewState?.tree),
    // TODO: refine structure if sections are defined in NLUI
    navigation: deriveNavigation(payload.previewState?.tree),
    hierarchy: deriveHierarchy(payload.previewState?.tree),
  };
}

/**
 * Generate Mock Data for Workday Extend
 */
function generateMockData(payload: NLUIExportPayload) {
  return {
    schema: "https://schemas.workday.com/extend/mock-data/v1",
    data: deriveMockData(payload.previewState?.tree),
    generatedAt: payload.generatedAt,
    version: payload.version,
    // TODO: extract actual data values from rendered components
    sampleData: extractSampleData(payload.previewState?.tree),
  };
}

// Helper functions for component analysis and data extraction

function countComponents(node?: UiNode): number {
  if (!node) return 0;
  let count = 1; // Count current node
  if (node.children) {
    count += node.children.reduce((sum, child) => sum + countComponents(child), 0);
  }
  return count;
}

function deriveComponents(node?: UiNode): any[] {
  if (!node) return [];

  const component = {
    type: node.type,
    id: node.id,
    props: node.props || {},
    position: node.position,
    zIndex: node.zIndex,
  };

  let components = [component];
  if (node.children) {
    components = components.concat(
      node.children.flatMap(child => deriveComponents(child))
    );
  }
  return components;
}

function deriveLayout(node?: UiNode): any {
  if (!node) return {};

  return {
    type: node.type,
    structure: node.type === 'Page' ? 'page' : 'component',
    hasChildren: Boolean(node.children?.length),
    childCount: node.children?.length || 0,
    positioning: node.position ? 'absolute' : 'relative',
  };
}

function deriveSections(node?: UiNode): any[] {
  if (!node) return [];

  const sections: any[] = [];

  if (node.type === 'Section' || node.type === 'Card' || node.type === 'Header') {
    sections.push({
      type: node.type,
      id: node.id,
      title: node.props?.title || node.props?.heading,
      componentCount: countComponents(node),
    });
  }

  if (node.children) {
    sections.push(...node.children.flatMap(child => deriveSections(child)));
  }

  return sections;
}

function deriveNavigation(node?: UiNode): any {
  if (!node) return {};

  const navigation: any = {
    hasTabs: false,
    hasBreadcrumbs: false,
    hasMenu: false,
  };

  function findNavComponents(n: UiNode) {
    if (n.type === 'Tabs') navigation.hasTabs = true;
    if (n.type === 'Breadcrumbs') navigation.hasBreadcrumbs = true;
    if (n.type === 'Menu') navigation.hasMenu = true;

    if (n.children) {
      n.children.forEach(findNavComponents);
    }
  }

  findNavComponents(node);
  return navigation;
}

function deriveHierarchy(node?: UiNode): any {
  if (!node) return {};

  return {
    root: node.type,
    depth: calculateDepth(node),
    structure: buildStructureTree(node),
  };
}

function calculateDepth(node: UiNode): number {
  if (!node.children || node.children.length === 0) return 1;
  return 1 + Math.max(...node.children.map(calculateDepth));
}

function buildStructureTree(node: UiNode): any {
  return {
    type: node.type,
    id: node.id,
    children: node.children?.map(buildStructureTree) || [],
  };
}

function getUniqueComponentTypes(node?: UiNode): string[] {
  if (!node) return [];

  const types = new Set<string>();

  function collectTypes(n: UiNode) {
    types.add(n.type);
    if (n.children) {
      n.children.forEach(collectTypes);
    }
  }

  collectTypes(node);
  return Array.from(types).sort();
}

function deriveMockData(node?: UiNode): any {
  if (!node) return {};

  const mockData: any = {
    componentData: {},
    extractedValues: [],
  };

  function extractData(n: UiNode) {
    if (n.props) {
      // Extract text values, labels, etc.
      Object.entries(n.props).forEach(([key, value]) => {
        if (typeof value === 'string' && value.length > 0) {
          mockData.extractedValues.push({
            component: n.type,
            property: key,
            value: value,
          });
        }
      });
    }

    if (n.children) {
      n.children.forEach(extractData);
    }
  }

  extractData(node);
  return mockData;
}

function extractSampleData(node?: UiNode): any[] {
  if (!node) return [];

  const sampleData: any[] = [];

  function extractTableData(n: UiNode) {
    if (n.type === 'Table' && n.props?.data) {
      sampleData.push({
        type: 'table',
        id: n.id,
        data: n.props.data,
        columns: n.props.columns || [],
      });
    }

    if (n.children) {
      n.children.forEach(extractTableData);
    }
  }

  extractTableData(node);
  return sampleData;
}