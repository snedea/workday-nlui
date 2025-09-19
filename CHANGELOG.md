# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-09-18

### 🎉 Initial Release

This is the first public release of Workday NLUI - a natural language interface for generating Workday-style user interfaces.

### ✨ Added

#### Core Features
- **Interactive Library Browser**: Searchable collection of Workday objects, fields, controls, and icons
- **Smart Prompt Composer**: Multi-line editor with pattern templates and token insertion
- **Real-time UI Generation**: LLM-powered conversion of natural language to Workday UI components
- **Live Preview Renderer**: Instant visualization of generated UI components

#### Library Components
- **Objects**: Worker, Job Requisition, Business Process, Time Off Request, Expense Report, Supplier
- **Fields**: Employee ID, Legal Name, Preferred Name, Supervisory Org, Location, Effective Date, Compensation Grade, Status
- **Controls**: Buttons, Inputs, Selects, Comboboxes, Checkboxes, Date Pickers, Tabs, Tables, Cards, Modals, Banners, Toasts
- **Icons**: User, Building, Calendar, Search, Alert, Check
- **Patterns**: Entity Profile Page, Form Page, List + Filters, Wizard/BP Steps

#### Technical Features
- **Provider-Agnostic LLM**: Support for both OpenAI and Azure OpenAI
- **Type-Safe Architecture**: Full TypeScript implementation with Zod validation
- **Modern Stack**: React 18 + Vite + Tailwind CSS + Express
- **Error Handling**: Graceful handling of API failures and validation errors
- **Persistence**: Automatic saving of prompts and responses in localStorage

#### User Experience
- **Keyboard Shortcuts**: ⌘/Ctrl+K for search focus
- **Category Filtering**: Tabs for Objects, Fields, Controls, Icons
- **Token System**: Click "use" to insert descriptive tokens with examples
- **Copy Functionality**: Quick copying of example descriptions
- **Responsive Design**: Mobile-friendly interface

#### Developer Experience
- **Hot Reload**: Concurrent development servers with auto-refresh
- **Environment Configuration**: Easy setup with .env files
- **Comprehensive Docs**: Installation guide and user manual
- **Health Checks**: API endpoints for monitoring and debugging
- **Build System**: Production-ready builds with TypeScript compilation

### 🛠 Technical Details

- **Frontend**: React 18.2.0, TypeScript 5.2.2, Vite 5.0.8, Tailwind CSS 3.3.6
- **Backend**: Node.js, Express 4.18.2, TypeScript, Zod 3.22.4
- **LLM Integration**: OpenAI API, Azure OpenAI Service
- **Development**: Hot reload, ESLint, Prettier, Concurrently
- **Deployment**: Supports Docker, PM2, and standard Node.js hosting

### 📋 API Reference

#### Endpoints
- `POST /api/generate` - Generate UI from natural language prompt
- `GET /api/health` - Check server status and configuration

#### Response Format
```json
{
  "version": "1.0",
  "title": "Generated UI Title",
  "tree": {
    "type": "Page",
    "props": {},
    "children": []
  }
}
```

### 🎯 Supported UI Components

The renderer supports these Canvas Kit-inspired component types:
- Layout: Page, Header, Section, Card
- Navigation: Tabs, Breadcrumbs
- Forms: Form, Field (text/select/date/combobox), Button
- Data: Table, Badge, Text
- Feedback: Banner, Toast, Modal
- Visual: Icon

### 📚 Documentation

- [Installation Guide](INSTALLATION.md) - Complete setup instructions
- [User Guide](USER_GUIDE.md) - Comprehensive usage documentation
- [README](README.md) - Project overview and quick start

### 🔮 Future Roadmap

- Integration with @workday/canvas-kit-react
- Additional UI component types
- Enhanced pattern library
- Docker deployment support
- CI/CD workflows
- Plugin system for custom components

---

## Release Notes

### What's New in v0.1.0

**Workday NLUI** brings natural language UI generation to your development workflow. Simply describe what you want in plain English, and watch as it generates Workday-style interfaces using familiar objects, fields, and controls.

**Key Highlights:**
- 🚀 **Zero Learning Curve**: Describe UIs in natural language
- 📚 **Rich Library**: 50+ pre-defined Workday components
- ⚡ **Instant Preview**: See results in real-time
- 🎨 **Workday Styling**: Canvas Kit-inspired design system
- 🔧 **Developer Ready**: Full TypeScript, modern tooling

**Try it now:**
```bash
git clone https://github.com/snedea/workday-nlui.git
cd workday-nlui
npm install
cp .env.example .env  # Add your API keys
npm run dev
```

Open http://localhost:5173 and start generating!

---

*For detailed changes in future releases, see the sections above.*