export interface UiNode {
  type: 'Page' | 'Header' | 'Section' | 'Card' | 'Tabs' | 'Tab' | 'Table' | 'Form' | 'Field' | 'Text' | 'Badge' | 'Button' | 'Icon' | 'Banner' | 'Toast' | 'Modal';
  props?: Record<string, any>;
  children?: UiNode[];
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
}

export interface LibraryData {
  objects: LibraryItem[];
  fields: LibraryItem[];
  controls: LibraryItem[];
  icons: LibraryItem[];
  patterns: { name: string; snippet: string }[];
}