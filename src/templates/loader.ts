// src/templates/loader.ts
import type { TemplateEntry } from "./catalog";
import { getCustomTemplates } from "./templateStore";

// Note: Vite glob imports for JSON files had issues, using hardcoded approach for reliability
// TODO: Investigate proper Vite configuration for JSON glob imports

export function loadTemplates(): TemplateEntry[] {
  // Built-in templates (hardcoded for reliability)
  const builtInTemplates: TemplateEntry[] = [
    {
      id: "hcm/shift-swap-bid",
      title: "Shift Swap/Bid",
      summary: "Restaurant workers can swap shifts or bid on open shifts",
      tags: ["Scheduling", "HCM", "Restaurant"],
      canvasKit: ["Tabs", "Table", "Button", "Badge", "DatePicker"],
      prompt: "Create a shift management page with tabs for 'My Shifts', 'Available Shifts', and 'Swap Requests'. Include a table showing shift dates, times, positions, and status badges. Add primary buttons for 'Request Swap' and 'Bid on Shift'.",
      version: "1.0",
      category: "Templates"
    },
    {
      id: "finance/expense-report",
      title: "Expense Report",
      summary: "Submit and track business expense reports with receipts",
      tags: ["Finance", "Expenses", "Travel"],
      canvasKit: ["Form", "Table", "Button", "Field", "DatePicker", "Badge"],
      prompt: "Create an expense report form with header showing report status and total amount. Include a table of expense line items with columns for Date, Description, Category, Amount, and Receipt status. Add fields for business purpose and submission date. Include primary 'Submit' and secondary 'Save Draft' buttons.",
      version: "1.0",
      category: "Templates"
    }
  ];

  // Get custom templates from the template store
  const customTemplates = getCustomTemplates();

  // Combine built-in and custom templates
  const allTemplates = [...builtInTemplates, ...customTemplates];

  // Sort by title for consistent ordering
  return allTemplates.sort((a, b) => a.title.localeCompare(b.title));
}