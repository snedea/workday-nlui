// src/templates/templateStore.ts
import type { TemplateEntry } from "./catalog";

const STORAGE_KEY = 'workday-nlui-custom-templates';

// In-memory store for runtime templates
let customTemplates: TemplateEntry[] = [];

// Load custom templates from localStorage on module initialization
function loadCustomTemplatesFromStorage(): TemplateEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load custom templates from localStorage:', error);
    return [];
  }
}

// Save custom templates to localStorage
function saveCustomTemplatesToStorage(templates: TemplateEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
  } catch (error) {
    console.error('Failed to save custom templates to localStorage:', error);
  }
}

// Initialize custom templates from storage
customTemplates = loadCustomTemplatesFromStorage();

// Add a new template at runtime
export function addCustomTemplate(template: TemplateEntry): void {
  // Check if template with same ID already exists
  const existingIndex = customTemplates.findIndex(t => t.id === template.id);

  if (existingIndex !== -1) {
    // Update existing template
    customTemplates[existingIndex] = template;
  } else {
    // Add new template
    customTemplates.push(template);
  }

  // Save to localStorage
  saveCustomTemplatesToStorage(customTemplates);

  // Trigger any listeners
  notifyTemplateChange();
}

// Update an existing custom template
export function updateCustomTemplate(templateId: string, updates: Partial<TemplateEntry>): void {
  const existingIndex = customTemplates.findIndex(t => t.id === templateId);

  if (existingIndex !== -1) {
    // Update existing template with new data
    customTemplates[existingIndex] = {
      ...customTemplates[existingIndex],
      ...updates
    };

    // Save to localStorage
    saveCustomTemplatesToStorage(customTemplates);

    // Trigger any listeners
    notifyTemplateChange();
  }
}

// Remove a custom template
export function removeCustomTemplate(templateId: string): void {
  customTemplates = customTemplates.filter(t => t.id !== templateId);
  saveCustomTemplatesToStorage(customTemplates);
  notifyTemplateChange();
}

// Get all custom templates
export function getCustomTemplates(): TemplateEntry[] {
  return [...customTemplates];
}

// Template change listeners
type TemplateChangeListener = () => void;
const listeners: TemplateChangeListener[] = [];

export function onTemplateChange(listener: TemplateChangeListener): () => void {
  listeners.push(listener);

  // Return unsubscribe function
  return () => {
    const index = listeners.indexOf(listener);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  };
}

function notifyTemplateChange() {
  listeners.forEach(listener => listener());
}

// Save template as file to /templates directory
export async function saveTemplateFile(template: TemplateEntry): Promise<void> {
  try {
    // Create the JSON content
    const jsonContent = JSON.stringify(template, null, 2);

    // Create filename from template ID
    const fileName = template.id.replace(/\//g, '-') + '.template.json';

    // Create a blob and download it
    // Note: In a real app, this would need a backend API to write files to the server
    // For now, we'll download the file and user can manually place it in templates directory
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log(`Template file ${fileName} downloaded. Place it in /src/templates/custom/ directory.`);
  } catch (error) {
    console.error('Failed to save template file:', error);
    throw error;
  }
}