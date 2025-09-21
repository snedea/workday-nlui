# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.7] - 2025-09-21

### 📤 Export Feature

This release introduces comprehensive export functionality, allowing users to capture their generated UI designs as PNG snapshots or export complete Workday Extend bundles for direct integration.

### ✨ Added

#### Export Menu & UI
- **NLUI-styled Export Button**: Blue rectangular button matching Generate button design with custom dropdown menu
- **Canvas Kit Menu Bug Fix**: Resolved issue where dropdown options were always visible
- **Smart Visibility**: Export menu only appears when preview content is available
- **Toast Notifications**: Success/error feedback for all export operations
- **Accessibility**: Full keyboard navigation with proper ARIA labels

#### PNG Snapshot Export
- **High-Fidelity Capture**: DOM-to-PNG conversion using `html-to-image` library
- **Canvas Kit Background**: Automatic Canvas Kit soap.200 background color application
- **Configurable Options**: Scale and background color customization
- **Smart Filtering**: Excludes elements marked with `data-no-export="true"`
- **Timestamped Files**: Automatic filename generation with ISO timestamp

#### Workday Extend Bundle Export
- **Complete ZIP Bundle**: Four structured JSON files for Workday Extend integration
- **AMD.json**: Application Metadata with Canvas Kit version and component analytics
- **PMD.json**: Page Metadata with component structure and layout information
- **SMD.json**: Section Metadata with hierarchy and navigation structure
- **mock-data.json**: Sample data extracted from rendered components
- **Schema Validation**: All files include proper Workday schema URLs
- **Component Analysis**: Comprehensive component tree analysis and data extraction

#### Developer Experience
- **TypeScript Support**: Full type definitions for all export interfaces
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Utility Functions**: Reusable export utilities in `src/utils/export.ts`
- **Test Coverage**: Complete Playwright test suite for all export functionality

### 🧪 Testing

#### Comprehensive Test Suite
- **Download Verification**: Validates PNG and ZIP file downloads with file size checks
- **ZIP Structure Validation**: Confirms all required JSON files are present and valid
- **Schema Compliance**: Verifies JSON structure matches Workday schema requirements
- **Accessibility Testing**: Keyboard navigation and ARIA label validation
- **Toast Integration**: Success/error notification verification
- **Menu State Testing**: Export menu visibility based on preview state

#### Test Infrastructure
- **Playwright Configuration**: Added `acceptDownloads: true` for download testing
- **Temporary File Management**: Safe test artifact creation and cleanup
- **Multiple Browser Support**: Tests across Chromium, Firefox, and WebKit

### 🛠 Technical Details

**New Dependencies:**
- `html-to-image@^1.11.13` - High-quality DOM-to-image conversion

**New Files:**
- `src/utils/export.ts` - Export utility functions and type definitions
- `tests/visual/export.spec.ts` - Comprehensive export test suite

**Enhanced Files:**
- `src/App.tsx` - Export menu integration and preview container setup
- `playwright.config.ts` - Download handling configuration

### 📋 Export File Structures

#### PNG Export
- Filename: `nlui-preview-YYYY-MM-DDTHH-mm-ss.png`
- Background: Canvas Kit soap.200 (#f7f7f7)
- Quality: Maximum with device pixel ratio scaling

#### Workday Extend Bundle
- Filename: `nlui-extend-bundle-0.1.7.zip`
- Structure:
  ```
  workday/
  ├── AMD.json  - Application metadata and Canvas Kit integration
  ├── PMD.json  - Page structure and component definitions
  ├── SMD.json  - Section hierarchy and navigation
  └── mock-data.json - Sample data and component values
  ```

### 🎯 Usage

#### PNG Export
1. Generate any UI preview
2. Click Export menu in Preview header
3. Select "PNG Snapshot"
4. File downloads automatically with timestamp

#### Workday Extend Bundle
1. Generate any UI preview
2. Click Export menu in Preview header
3. Select "Workday Extend Bundle (.zip)"
4. ZIP file downloads with all required metadata

### ♿ Accessibility

- **Keyboard Navigation**: Full support for Tab, Enter, Arrow keys, and Escape
- **ARIA Labels**: Proper labeling for screen readers (`aria-label="Export"`)
- **Focus Management**: Logical tab order and focus restoration
- **Menu Popup**: `aria-haspopup="menu"` for assistive technology

## [0.1.6] - 2025-09-21

### 🎨 Template UX & StatusIndicator Improvements

### ✨ Added
- **Template Button UX**: Reordered hover buttons (delete, edit, copy, use) with blue primary "Use" action
- **Context-Aware Status System**: Dynamic status mapping with semantic color variants

### 🔄 Changed
- **StatusIndicator Modernization**: Migrated from deprecated Canvas Kit StatusIndicator to Preview API
- **StatusIndicator Width Fix**: Implemented dynamic width sizing using fit-content and inline-flex

### 🐛 Fixed
- **Server Stability**: Fixed 500 errors from crashed server processes with improved error handling

## [0.1.1] - 2025-09-18

### 🎨 Canvas Kit v14 Integration

This release transforms Workday NLUI Studio from Canvas Kit-inspired styling to **authentic Workday UI** using official Canvas Kit v14 components, fonts, and design system.

### ✨ Added

#### Canvas Kit v14 Components
- **Authentic Workday Typography**: Official Roboto fonts loaded from Workday CDN
- **600+ Canvas Icons**: System, Accent, and Applet icons searchable in library
- **StatusIndicator**: Replaces generic badges with Workday-style status components
- **FormField + TextInput/Select**: Authentic form controls with proper labels
- **Avatar Component**: User profile avatars with size variants
- **Button Variants**: Primary, Secondary, Tertiary with correct Canvas Kit styling

#### Design System Improvements
- **Smart Button Spacing**: 12px horizontal spacing between button groups (Submit/Cancel)
- **Component Spacing**: 16px vertical spacing between sections and elements
- **Workday Design Language**: Proper typography, spacing, and visual hierarchy
- **Dual Renderer System**: Toggle between Canvas Kit v14 and Tailwind CSS renderers

#### Technical Enhancements
- **Canvas Kit Packages**: `@workday/canvas-kit-react` v14.0.2 with all official packages
- **Font Loading**: `@workday/canvas-kit-react-fonts` with Emotion Global injection
- **Icon Libraries**: System, Accent, and Applet icon packages with 600+ icons
- **Smart Layout Logic**: Automatic detection of button groups for proper spacing

### 🔄 Changed
- **Primary Renderer**: Canvas Kit v14 is now the default renderer (was Tailwind)
- **Typography**: All text components use authentic Workday Roboto font family
- **Package Description**: Updated to highlight Canvas Kit v14 integration
- **Component Fidelity**: True Workday appearance instead of approximations

### 📚 Documentation
- **Comprehensive README Update**: Canvas Kit v14 features and setup guide
- **Architecture Section**: Dual renderer system documentation
- **Component Reference**: Updated to reflect Canvas Kit components
- **Typography Guide**: Font loading and spacing implementation details

### 🛠 Technical Details

**New Dependencies:**
```json
{
  "@workday/canvas-kit-react": "^14.0.2",
  "@workday/canvas-kit-react-fonts": "^14.0.2",
  "@workday/canvas-kit-preview-react": "^14.0.2",
  "@workday/canvas-system-icons-web": "^3.0.36",
  "@workday/canvas-accent-icons-web": "^3.0.17",
  "@workday/canvas-applet-icons-web": "^2.0.15",
  "@workday/canvas-tokens-web": "^3.0.0"
}
```

**New Files:**
- `src/runtime/canvasRenderer.tsx` - Canvas Kit v14 renderer with smart spacing
- `src/data/canvasIcons.ts` - Canvas icons library integration

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