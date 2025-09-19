# Workday NLUI Studio - Natural Language UI Design Studio

A local, browser-based design studio that turns natural-language prompts into **authentic Workday UI** using React, Vite, AI, and **Canvas Kit v14** with official fonts and design system.

## Features

- **🎨 Authentic Canvas Kit v14 Integration**: True Workday components with official fonts (Roboto) and design system
- **📚 Interactive Prompt Library**: Browse searchable objects, fields, controls, and 600+ Canvas icons with examples
- **🔤 Official Workday Typography**: Canvas Kit fonts loaded from Workday CDN with proper spacing
- **📄 Template Management**: Save, import, and reuse custom templates with built-in patterns for common workflows
- **✍️ Smart Composer**: Build prompts using patterns, library tokens, and template snippets
- **🤖 AI Integration**: Generate UI JSON via OpenAI or Azure OpenAI with intelligent prompt processing
- **👀 Dual Renderer System**: Toggle between Canvas Kit v14 and Tailwind CSS renderers
- **💾 Smart Persistence**: Automatically saves prompts, responses, and custom templates
- **🎯 Workday Design Language**: Proper button spacing, component layout, and visual hierarchy

## Quick Start

### 1. Install Dependencies

```bash
cd workday-nlui-studio
npm install
```

### 2. Configure Environment

Copy the example environment file and configure your LLM provider:

```bash
cp .env.example .env
```

**For OpenAI:**
```env
OPENAI_PROVIDER=openai
OPENAI_API_KEY=sk-your-key-here
OPENAI_API_MODEL=gpt-4o-mini
```

**For Azure OpenAI:**
```env
OPENAI_PROVIDER=azure
AZURE_OPENAI_API_KEY=your-azure-key
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_DEPLOYMENT=gpt-4o-mini
AZURE_OPENAI_API_VERSION=2024-02-15-preview
```

### 3. Run Development Server

```bash
npm run dev
```

This starts:
- Frontend: http://localhost:5173
- Backend: http://localhost:8787

### 4. Build for Production

```bash
npm run build
npm start
```

## Usage

1. **Browse Library**: Search and filter objects, fields, controls, icons, and templates
2. **Use Tokens**: Click "use" on any item to insert descriptive tokens into the prompt
3. **Apply Templates**: Use built-in or custom templates for common workflows like shift management, expense reports, etc.
4. **Apply Patterns**: Use pre-built patterns for common UI layouts
5. **Save Custom Templates**: Create and save your own reusable templates with the "Save as Template" feature
6. **Generate UI**: Click "Generate" to send your prompt to the AI
7. **Preview Results**: View the rendered UI components in real-time with Canvas Kit styling

### Example Prompts

- "Create a Worker profile page with avatar, Legal Name, Status badge, and tabs for Profile, Job, Pay"
- "Build a Time Off Request form with Effective Date picker, Status dropdown, and Submit button"
- "Design a table of direct reports with columns: Legal Name, Location, Supervisory Org"

### Example Templates

- **Shift Swap/Bid**: Restaurant workers can swap shifts or bid on open shifts with tabs for My Shifts, Available Shifts, and Swap Requests
- **Expense Report**: Submit and track business expense reports with receipt management and approval workflow
- **Custom Templates**: Save your own frequently-used prompts as reusable templates with tags and descriptions

## Architecture

### Frontend (`src/`)
- **React + TypeScript + Vite** for fast development
- **Canvas Kit v14**: Official Workday component library with authentic fonts and design system
- **Dual Renderer System**: Canvas Kit v14 renderer + Tailwind CSS fallback renderer
- **Canvas Icons**: 600+ official Workday icons (System, Accent, Applet)
- **Runtime Renderer**: Converts AI JSON responses into React components with proper Workday spacing
- **Template System**: Dynamic template loading with localStorage persistence and real-time updates

### Backend (`server/`)
- **Express.js** API server with AI integration
- **Provider-agnostic** client supporting OpenAI and Azure OpenAI
- **Zod validation** ensures AI responses match expected schema
- **Error handling** for authentication, rate limits, and validation failures

### Key Files

```
workday-nlui-studio/
├── src/
│   ├── components/          # UI components (Library, Composer, etc.)
│   ├── runtime/            # UI renderer and type definitions
│   ├── data/               # Library data and patterns
│   ├── templates/          # Template system (catalog, loader, storage)
│   └── App.tsx             # Main application
├── server/
│   ├── server.ts           # Express API server
│   ├── llm.ts              # AI client (OpenAI/Azure)
│   └── schema.ts           # Zod schemas for validation
└── package.json
```

## API Reference

### POST `/api/generate`

Generate UI from natural language prompt.

**Request:**
```json
{
  "prompt": "Create a Worker profile page with header and tabs"
}
```

**Response:**
```json
{
  "version": "1.0",
  "title": "Worker Profile",
  "tree": {
    "type": "Page",
    "children": [...]
  }
}
```

### GET `/api/health`

Check server status and configuration.

**Response:**
```json
{
  "status": "ok",
  "provider": "openai",
  "configured": true
}
```

## Supported UI Components

The Canvas Kit v14 renderer supports these authentic Workday components:

- **Layout**: Page, Header, Section, Card (with proper spacing)
- **Navigation**: Tabs, Breadcrumbs
- **Forms**: Form, FormField, TextInput, Select, Button (Primary/Secondary/Tertiary)
- **Data**: Table, StatusIndicator (replaces Badge), Text, Avatar
- **Feedback**: Banner, Toast, Modal
- **Visual**: SystemIcon, AccentIcon, AppletIcon (600+ official Workday icons)
- **Typography**: Authentic Roboto fonts from Workday CDN with proper line height and spacing

## Development

### Scripts

- `npm run dev` - Start development servers (frontend + backend)
- `npm run build` - Build for production
- `npm run start` - Run production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Environment Variables

All environment variables are handled server-side. API keys are never exposed to the browser.

### Canvas Kit Integration

The application features two renderers:
- **Canvas Kit Renderer** (`src/runtime/canvasRenderer.tsx`): Uses authentic Canvas Kit v14 components with official Workday fonts
- **Tailwind Renderer** (`src/runtime/renderer.tsx`): Fallback using Tailwind CSS for comparison

Toggle between renderers in the preview window to compare Canvas Kit fidelity vs. custom styling.

## Canvas Kit v14 Features

### Authentic Workday Typography
- **Roboto Font Family**: Official Workday fonts loaded from CDN
- **Proper Line Heights**: Consistent with Workday design specifications
- **Button Spacing**: 12px horizontal spacing between button groups (Submit/Cancel)
- **Component Spacing**: 16px vertical spacing between sections and elements

### Canvas Icons Library
- **System Icons** (600+): UI glyphs for buttons, navigation, status indicators
- **Accent Icons** (200+): Decorative icons for emphasis and visual interest
- **Applet Icons** (150+): Product entry point icons for applications

### Component Fidelity
- **StatusIndicator**: Replaces generic badges with Workday-style status components
- **FormField + TextInput/Select**: Authentic form controls with proper labels
- **Card System**: Proper card layout with headers, bodies, and spacing
- **Button Variants**: Primary, Secondary, Tertiary with correct styling
- **Avatar Component**: User profile avatars with size variants

## Troubleshooting

### Common Issues

1. **"Authentication failed"** - Check your API keys in `.env`
2. **"Rate limit exceeded"** - Wait a moment and try again
3. **"Invalid JSON schema"** - The LLM response doesn't match expected format
4. **Proxy errors** - Ensure both frontend (5173) and backend (8787) are running

### Debug Mode

Set `NODE_ENV=development` to see detailed logs in the server console.

## License

MIT