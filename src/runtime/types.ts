export interface UiNode {
  type: 'Page' | 'Header' | 'Section' | 'Card' | 'Tabs' | 'Tab' | 'Table' | 'Form' | 'Field' | 'Text' | 'Badge' | 'Button' | 'Icon' | 'Banner' | 'Toast' | 'Modal' | 'Avatar' | 'Breadcrumbs' | 'Footer' | 'Checkbox' | 'Radio' | 'Switch' | 'TextArea' | 'Tooltip' | 'Layout' | 'Menu' | 'Pagination' | 'ColorPicker' | 'SegmentedControl';
  props?: Record<string, any>;
  children?: UiNode[];
  position?: { x: number; y: number };
  zIndex?: number;
  id?: string;
}

export interface UiResponse {
  version: '1.0';
  title: string;
  tree: UiNode;
}

export interface LibraryItem {
  name: string;
  tags: string[];
  example: string;
  visual: string;
  _type?: string;
  onUseInsert?: string;
  templateId?: string;
}

export interface TemplateLibraryItem {
  id: string;
  title: string;
  summary: string;
  labels: string[];
  category: "Templates";
  onUseInsert: string;
  meta: any;
}

export interface LibraryData {
  objects: LibraryItem[];
  fields: LibraryItem[];
  controls: LibraryItem[];
  icons: LibraryItem[];
  patterns: { name: string; snippet: string }[];
}