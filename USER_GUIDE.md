# User Guide

Welcome to **Workday NLUI** - a natural language interface for generating Workday-style user interfaces! This guide will help you make the most of the application's features.

## Table of Contents

1. [Getting Started](#getting-started)
2. [User Interface Overview](#user-interface-overview)
3. [Using the Library Browser](#using-the-library-browser)
4. [Composing Effective Prompts](#composing-effective-prompts)
5. [Understanding Patterns](#understanding-patterns)
6. [UI Generation & Preview](#ui-generation--preview)
7. [Tips & Best Practices](#tips--best-practices)
8. [Troubleshooting](#troubleshooting)

## Getting Started

### First Launch

After installation, open http://localhost:5173 in your browser. You'll see the Workday Prompt Library interface with:

- **Header**: Title and search shortcut hint (⌘+K)
- **Search & Tabs**: Global search and category filters
- **Library Grid**: Browsable collection of UI components
- **Prompt Composer**: Where you build and test prompts

### Your First UI Generation

1. **Try the default prompt**: The composer comes pre-loaded with an example
2. **Click "Generate"**: This sends your prompt to the LLM
3. **View the result**: The preview panel shows your generated UI

That's it! You've created your first Workday-style interface.

## User Interface Overview

### Main Layout

```
┌─────────────────────────────────────────────────────────────┐
│ 📚 Workday Prompt Library                           ⌘+K     │
├─────────────────────────────────────────────────────────────┤
│ 🔍 Search...               [ All | Objects | Fields | ... ] │
├─────────────────────────────────────────────────────────────┤
│ Library Grid (2/3)           │ Prompt Composer (1/3)        │
│                              │                               │
│ 📦 Objects                   │ ✍️ Prompt Composer           │
│ [Worker] [Job Req] [...]     │ ┌─────────────────────────┐   │
│                              │ │ Create a Workday-style │   │
│ 🏷️ Fields                    │ │ profile page for...    │   │
│ [Legal Name] [Status] [...]  │ │                        │   │
│                              │ └─────────────────────────┘   │
│ 🎛️ Controls                  │                               │
│ [Button] [Input] [...]       │ 📋 Patterns                   │
│                              │ [Entity Profile] [Form] [...] │
│ 🎨 Icons                     │                               │
│ [User] [Building] [...]      │ [Generate]                    │
│                              │                               │
│                              │ 👀 Preview                    │
│                              │ ┌─────────────────────────┐   │
│                              │ │ [Generated UI Here]    │   │
│                              │ └─────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Key Areas

**🔍 Search Bar**
- Global search across all library items
- Keyboard shortcut: ⌘+K (Mac) or Ctrl+K (Windows/Linux)
- Searches names, tags, and example descriptions

**📑 Category Tabs**
- **All**: Show everything
- **Objects**: Workday entities (Worker, Job Requisition, etc.)
- **Fields**: Data attributes (Legal Name, Status, etc.)
- **Controls**: UI components (Buttons, Inputs, Tables, etc.)
- **Icons**: Visual elements (User, Building, Calendar, etc.)

**📚 Library Grid**
- Organized sections for each category
- Hover to see "use" and "copy" buttons
- Visual icons help identify components quickly

**✍️ Prompt Composer**
- Multi-line text editor for building prompts
- Pattern buttons for quick insertion
- Copy and Generate buttons
- Helpful tips at the bottom

**👀 Preview Panel**
- Shows generated UI in real-time
- Scrollable for complex interfaces
- Displays the UI title from LLM response

## Using the Library Browser

### Browsing by Category

**Objects** - Workday business entities:
- 👤 **Worker**: Employee profiles and information
- 🧾 **Job Requisition**: Recruiting and hiring workflows
- 🔁 **Business Process**: Approval workflows and steps
- 🏖️ **Time Off Request**: PTO and leave management
- 🧾 **Expense Report**: Financial submission forms
- 🏢 **Supplier**: Vendor and procurement data

**Fields** - Data attributes and properties:
- #️⃣ **Employee ID**: Unique identifiers
- ✍️ **Legal Name**: Person's full legal name
- ✨ **Preferred Name**: Preferred/nickname
- 🏛️ **Supervisory Org**: Organizational hierarchy
- 📍 **Location**: Office, site, or geographic data
- 📅 **Effective Date**: When changes take effect
- 🎖️ **Compensation Grade**: Pay bands and levels
- 🏷️ **Status**: Current state (Active, On Leave, etc.)

**Controls** - Canvas Kit UI components:
- 🔵 **Primary Button**: Main call-to-action buttons
- ⚪ **Secondary Button**: Alternative actions
- 📝 **Text Input**: Single-line text fields
- ▾ **Select/Dropdown**: Choice pickers
- 🔎 **Combobox**: Search-enabled selectors
- ☑️ **Checkbox**: Boolean toggles
- 📅 **Date Picker**: Calendar controls
- 📑 **Tabs**: Content organization
- 📊 **Table**: Data grids
- 🃏 **Card**: Content containers

**Icons** - Visual indicators:
- 👤 **User**: Profile and person-related
- 🏢 **Building**: Location and organization
- 📅 **Calendar**: Date and time
- 🔍 **Search**: Finding and filtering
- ⚠️ **Alert**: Warnings and errors
- ✅ **Check**: Success and completion

### Search Strategies

**By Component Name**:
```
"Worker" → Finds Worker object
"Button" → Finds all button types
"Date" → Finds Date Picker and Effective Date
```

**By Tag/Category**:
```
"form" → Finds form-related components
"name" → Finds Legal Name, Preferred Name
"notification" → Finds Toast, Banner
```

**By Use Case**:
```
"profile" → Finds Worker, avatar components
"approval" → Finds Business Process
"time" → Finds Time Off, Date Picker
```

### Using Library Items

**"Use" Button** 📌
- Inserts a descriptive token into your prompt
- Format: `[Type:Name] // Description`
- Example: `[Field:Legal Name] // Add a Legal Name text input with validation.`

**"Copy" Button** 📋
- Copies the example description to clipboard
- Useful for adapting existing patterns
- Can paste into other applications

## Composing Effective Prompts

### Prompt Structure

**Good prompts typically include:**

1. **Page Type**: "Create a profile page", "Build a form", "Design a dashboard"
2. **Primary Object**: "for Worker", "for Job Requisition"
3. **Key Components**: "with header, tabs, and sidebar"
4. **Specific Fields**: "including Legal Name, Status, Location"
5. **Actions**: "with Save and Cancel buttons"

### Example Prompts

**Basic Profile Page**:
```
Create a Workday-style profile page for Worker with header
(avatar, Legal Name, title, Status badge), tabs (Profile,
Job, Pay, Time Off), and a primary "Save" button.
```

**Data Entry Form**:
```
Build a Time Off Request form including Effective Date picker,
Supervisory Org dropdown, Status badge, and Submit/Cancel buttons.
```

**List View with Filters**:
```
Design a table of Workers with columns (Legal Name, Location,
Status), search bar, Location filter dropdown, and pagination.
```

**Dashboard Layout**:
```
Create a Business Process dashboard with status banner,
progress tabs, summary cards, and action buttons.
```

### Using Tokens

When you click "use" on library items, tokens are automatically inserted:

```
[Object:Worker] // Add a Worker summary card with avatar, name, title, and status.
[Field:Legal Name] // Add a Legal Name text input with validation.
[Control:Primary Button] // Add a primary button labeled "Submit".
```

**Benefits**:
- ✅ Ensures consistent terminology
- ✅ Provides context for the LLM
- ✅ Includes helpful implementation hints
- ✅ Easy to edit and customize

### Combining Tokens

Mix tokens with natural language:

```
Create a Worker profile page with:
[Field:Legal Name] // Add a Legal Name text input with validation.
[Field:Status] // Show a Status badge (Active, On Leave, Terminated).
[Control:Tabs] // Create tabs: Profile, Job, Pay, Time Off.
And add a [Control:Primary Button] // Add a primary button labeled "Submit".
```

## Understanding Patterns

Patterns are pre-built templates for common Workday UI layouts. Click any pattern button to insert it into your prompt.

### Available Patterns

**🏠 Entity Profile Page**
```
Create a Workday-style profile page for {{Object}} with header
(avatar, name, title, status), tabs (Profile, Job, Pay, Time Off),
and a side panel for quick actions.
```
*Best for*: Worker profiles, Supplier details, detailed entity views

**📝 Form Page**
```
Create a form page for {{Object}} including {{Field1}}, {{Field2}},
{{Field3}} and a primary "Submit" and secondary "Cancel" button.
```
*Best for*: Data entry, editing workflows, creation forms

**📋 List + Filters**
```
Create a list view for {{ObjectPlural}} with a search bar,
filters ({{Field}}), table (columns: {{Col1}}, {{Col2}}, {{Col3}}),
and pagination.
```
*Best for*: Directory views, search results, data browsing

**🔄 Wizard / BP Steps**
```
Create a multi-step wizard for the {{BusinessProcess}} with stepper,
per-step validation, and a summary review step.
```
*Best for*: Complex workflows, business processes, guided tasks

### Customizing Patterns

After inserting a pattern, replace the placeholders:

**Before**:
```
Create a form page for {{Object}} including {{Field1}}, {{Field2}}
```

**After**:
```
Create a form page for Time Off Request including Effective Date,
Status, Supervisory Org and a primary "Submit" and secondary
"Cancel" button.
```

## UI Generation & Preview

### Generation Process

1. **Write your prompt** in the composer
2. **Click "Generate"** button
3. **LLM processes** your request using Workday terminology
4. **JSON response** is validated against our schema
5. **UI renders** in the preview panel

### What Happens Behind the Scenes

The LLM receives:
- Your prompt
- System instructions about Workday UI patterns
- A strict JSON schema to follow

It returns:
```json
{
  "version": "1.0",
  "title": "Worker Profile",
  "tree": {
    "type": "Page",
    "children": [
      {
        "type": "Header",
        "children": [...]
      }
    ]
  }
}
```

### Preview Features

**📱 Responsive Design**: Components adapt to different screen sizes

**🎨 Workday Styling**: Uses Canvas Kit-inspired design tokens

**⚡ Interactive Elements**:
- Tabs you can click
- Form fields you can interact with
- Buttons that respond to hover

**📏 Scrollable**: Long interfaces scroll within the preview area

### Persistence

The app automatically saves:
- 💾 **Last Prompt**: Restored when you reload the page
- 🔄 **Last Response**: Preview persists across sessions

## Tips & Best Practices

### Writing Effective Prompts

**✅ Do:**
- Be specific about the page purpose
- Mention key Workday objects and fields
- Specify required actions (Save, Cancel, Submit)
- Use library terminology (from tokens)
- Include layout preferences (tabs, cards, etc.)

**❌ Avoid:**
- Vague descriptions ("make a page")
- Non-Workday terminology
- UI implementation details (CSS, HTML)
- Complex business logic
- Multiple unrelated concepts in one prompt

### Library Search Tips

**🔍 Search Effectively:**
- Try partial matches: "legal" finds "Legal Name"
- Use tags: "form" finds form-related components
- Search examples: "avatar" finds relevant components
- Combine terms: "date picker" finds Date Picker

**📱 Keyboard Shortcuts:**
- ⌘+K (Mac) or Ctrl+K (Windows/Linux): Focus search
- Tab: Navigate between interface elements
- Escape: Clear search

### Prompt Composition Workflow

1. **Start with a pattern** for the overall structure
2. **Browse the library** to understand available components
3. **Use tokens** to specify exact components needed
4. **Add natural language** to connect the pieces
5. **Generate and iterate** based on results

### Optimization Tips

**⚡ Performance:**
- Keep prompts focused and concise
- Test with simple prompts first
- Use tokens for consistency

**🎯 Accuracy:**
- Reference specific Workday objects
- Use exact field names from the library
- Be explicit about relationships between components

**🔄 Iteration:**
- Start simple, then add complexity
- Copy successful prompts for reuse
- Adjust based on preview results

## Troubleshooting

### Common Issues

**🚫 "Generate" Button Disabled**
- *Cause*: Empty prompt or generation in progress
- *Solution*: Add text to the prompt composer

**⚠️ "Authentication Failed"**
- *Cause*: Invalid or missing API keys
- *Solution*: Check your `.env` file configuration

**🔄 "Generation Failed"**
- *Cause*: Network issues or API rate limits
- *Solution*: Wait a moment and try again

**📋 Empty Preview**
- *Cause*: Invalid JSON response from LLM
- *Solution*: Try a simpler, more specific prompt

**🔍 No Search Results**
- *Cause*: No matches for search terms
- *Solution*: Try broader terms or check spelling

### Preview Issues

**Components Look Broken**:
- Some complex layouts may not render perfectly
- This is expected - focus on the structure and content
- The generated JSON is what matters for Canvas Kit integration

**Missing Interactions**:
- Form submissions won't work (this is a preview)
- Focus on verifying the component types and props
- Use browser DevTools to inspect the generated elements

### Getting Better Results

**If the LLM generates unexpected UI:**

1. **Be more specific** in your prompt
2. **Use more library tokens** for precision
3. **Break complex requests** into smaller parts
4. **Check the preview JSON** to understand what was generated
5. **Try different wording** for the same concept

**If components are missing:**

1. **Explicitly mention required components** using tokens
2. **Check if you're using correct Workday terminology**
3. **Verify the component exists** in the library
4. **Add context** about how components should be connected

### Debug Information

**Browser DevTools** (F12):
- Check Console for JavaScript errors
- Network tab shows API request/response
- Elements tab shows rendered HTML structure

**Server Logs** (terminal where you ran `npm run dev`):
- Shows generation requests and responses
- Displays any server-side errors
- Helpful for API key issues

---

## Next Steps

Now that you're familiar with the interface:

1. **🎯 Practice** with different types of prompts
2. **🔍 Explore** all categories in the library
3. **📋 Experiment** with combining patterns and tokens
4. **🔄 Iterate** on prompts to improve results
5. **📚 Reference** this guide when trying new features

**Happy UI generating!** 🚀

---

*For technical issues, see the [Installation Guide](INSTALLATION.md). For questions or feedback, please open an issue on GitHub.*