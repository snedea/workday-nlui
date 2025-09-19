// src/templates/catalog.ts
export type TemplateMeta = {
  id: string;                 // "hcm/shift-swap-bid"
  title: string;              // "Shift Swap/Bid"
  summary: string;            // short, searchable
  tags: string[];             // ["Scheduling","HCM","Restaurant"]
  canvasKit: string[];        // components used (e.g., "Tabs","DataTable","DatePicker")
  prompt: string;             // the Claude UI-generation prompt (for renderer)
  previewJson?: object;       // optional static preview tree for offline demo
  version: string;            // "1.0"
};

export type TemplateEntry = TemplateMeta & {
  category: "Templates";
};

export const TEMPLATES: TemplateEntry[] = [];