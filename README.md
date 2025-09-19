# Workday NLUI - Natural Language UI Generator

A local, browser-based app that turns natural-language prompts into Workday-style UI previews using React, Vite, and LLM integration.

## Features

- **📚 Interactive Prompt Library**: Browse searchable objects, fields, controls, and icons with examples
- **✍️ Smart Composer**: Build prompts using patterns and library tokens
- **🤖 LLM Integration**: Generate UI JSON via OpenAI or Azure OpenAI
- **👀 Live Preview**: Render generated UI components in real-time
- **💾 Persistence**: Automatically saves last prompt and response
- **🎨 Workday-Style**: Components designed to match Canvas Kit patterns

## Quick Start

### 1. Install Dependencies

```bash
cd workday-nlui
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

1. **Browse Library**: Search and filter objects, fields, controls, and icons
2. **Use Tokens**: Click "use" on any item to insert descriptive tokens into the prompt
3. **Apply Patterns**: Use pre-built patterns for common UI layouts
4. **Generate UI**: Click "Generate" to send your prompt to the LLM
5. **Preview Results**: View the rendered UI components in real-time

### Example Prompts

- "Create a Worker profile page with avatar, Legal Name, Status badge, and tabs for Profile, Job, Pay"
- "Build a Time Off Request form with Effective Date picker, Status dropdown, and Submit button"
- "Design a table of direct reports with columns: Legal Name, Location, Supervisory Org"

## Architecture

### Frontend (`src/`)
- **React + TypeScript + Vite** for fast development
- **Tailwind CSS** for styling with Workday-inspired design tokens
- **Component Library**: Modular UI components that mirror the original HTML structure
- **Runtime Renderer**: Converts LLM JSON responses into React components

### Backend (`server/`)
- **Express.js** API server with LLM integration
- **Provider-agnostic** client supporting OpenAI and Azure OpenAI
- **Zod validation** ensures LLM responses match expected schema
- **Error handling** for authentication, rate limits, and validation failures

### Key Files

```
workday-nlui/
├── src/
│   ├── components/          # UI components (Library, Composer, etc.)
│   ├── runtime/            # UI renderer and type definitions
│   ├── data/               # Library data and patterns
│   └── App.tsx             # Main application
├── server/
│   ├── server.ts           # Express API server
│   ├── llm.ts              # LLM client (OpenAI/Azure)
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