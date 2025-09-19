// src/data/templates.data.ts
import { loadTemplates } from "../templates/loader";

export const TEMPLATE_ITEMS = loadTemplates().map(t => ({
  id: t.id,
  title: t.title,
  summary: t.summary,
  labels: t.tags, // This maps tags from TemplateEntry to labels for TemplateLibraryItem
  category: "Templates" as const,
  // When user clicks "use", we inject the template's prompt into the composer
  onUseInsert: t.prompt,
  meta: t,
}));