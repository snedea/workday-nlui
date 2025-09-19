# Workday NLUI Studio - Natural Language UI Design Studio

A local, browser-based design studio that turns natural-language prompts into Workday-style UI previews using React, Vite, AI, and Canvas Kit patterns.

## Features

- **📚 Interactive Prompt Library**: Browse searchable objects, fields, controls, and icons with examples
- **📄 Template Management**: Save, import, and reuse custom templates with built-in patterns for common workflows
- **✍️ Smart Composer**: Build prompts using patterns, library tokens, and template snippets
- **🤖 AI Integration**: Generate UI JSON via OpenAI or Azure OpenAI with intelligent prompt processing
- **👀 Live Preview**: Render generated UI components in real-time with Canvas Kit styling
- **💾 Smart Persistence**: Automatically saves prompts, responses, and custom templates
- **🎨 Workday-Style**: Components designed to match Canvas Kit patterns and design system

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
- **Tailwind CSS** for styling with Workday-inspired design tokens
- **Component Library**: Modular UI components that mirror Canvas Kit patterns
- **Runtime Renderer**: Converts AI JSON responses into React components
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

The renderer supports these component types with Canvas Kit-inspired props:

- **Layout**: Page, Header, Section, Card
- **Navigation**: Tabs, Breadcrumbs
- **Forms**: Form, Field (text/select/date/combobox), Button
- **Data**: Table, Badge, Text
- **Feedback**: Banner, Toast, Modal
- **Visual**: Icon

## Development

### Scripts

- `npm run dev` - Start development servers (frontend + backend)
- `npm run build` - Build for production
- `npm run start` - Run production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Environment Variables

All environment variables are handled server-side. API keys are never exposed to the browser.

### Extending the Renderer

The UI renderer in `src/runtime/renderer.tsx` can be easily extended or swapped out for @workday/canvas-kit-react components later.

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