# Claude AI Development Notes - Workday NLUI Studio

## Resolved Issues (Previous Versions)

### ✅ Fixed in v0.1.4
- **Nested Drag Handles**: Fixed issue where drag handles inside tables/complex layouts were visible but not clickable
- Added `pointer-events: auto !important` CSS override for `.drag-handle` class
- All nested components (fields, buttons) inside containers now fully draggable

### ✅ Fixed in v0.1.3
- **Button Position Memory**: Buttons don't consistently remember their dragged positions when switching between static/draggable modes
- **Table Size Changes**: Table components change size when switching from static to draggable view, causing layout shifts

## Recent Changes (v0.1.4)

### 🎯 Nested Drag & Drop Fix
- **Issue**: Drag handles inside tables, forms, and complex layouts were visible but not clickable
- **Root Cause**: Parent `DraggableWrapper` components set `pointer-events: none` on children, blocking nested handle interactions
- **Solution**: Added CSS override `pointer-events: auto !important` specifically for `.drag-handle` elements
- **Impact**: All nested components now fully draggable regardless of container depth

### ✅ Completed v0.1.4
- Fixed nested drag handle pointer events blocking
- Enhanced CSS specificity for drag handle interactions
- Improved user experience in complex layouts (tables, forms)

## Previous Changes (v0.1.3)

### ✅ Completed
- Replaced complex custom drag-and-drop with lightweight `react-draggable` library
- Added resizable preview window with vertical resize handle
- Removed Canvas Kit/Tailwind toggle (always defaults to Canvas Kit)
- Repositioned UI title to "Preview - [Dynamic Title]" format
- Fixed React StrictMode warnings with nodeRef implementation

### 🎯 Drag & Drop Implementation
- **Library**: react-draggable (30KB, zero dependencies)
- **Features**: Grid snapping (8px), position persistence, auto-save
- **Files**:
  - `src/components/DraggableWrapper.tsx` - Main wrapper component
  - `src/runtime/canvasRenderer.tsx` - Integration with Canvas renderer

### 📐 Resizable Preview
- **Type**: Native CSS resize (vertical only)
- **Constraints**: Min 400px, Max 800px, Default 600px
- **Persistence**: Saves height to localStorage

## Development Guidelines

### Working with Drag & Drop
```typescript
// Components that support dragging
const isDraggableComponent = (componentType: string) => {
  const nonDraggableTypes = ['Page', 'Tabs', 'Tab', 'Form'];
  return !nonDraggableTypes.includes(componentType);
};
```

### Component ID Generation
```typescript
// Ensure stable IDs for position tracking
const ensureComponentIds = (node: any, path: string = 'root'): any => {
  // Implementation ensures one-time ID generation
  // IDs format: "path-type-content" (sanitized, max 50 chars)
};
```

### Position Persistence
- Positions stored in component tree under `position: { x: number; y: number }`
- Auto-save triggers when switching from draggable to static mode
- Uses localStorage with key: 'workday-nlui-last-response'

## Quick Fixes for Common Issues

### Restart Dev Server
```bash
# Kill existing processes and restart
pkill -f "npm run dev"
npm run dev
```

### Clear Browser Cache
- Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- Or open in incognito mode

### Debug Drag Issues
1. Check component has stable ID
2. Verify `isDraggableComponent` returns true
3. Ensure position is being saved to localStorage
4. Check console for React warnings

## Useful Commands

```bash
# Development
npm run dev              # Start both client and server
npm run dev:client       # Client only (Vite)
npm run dev:server       # Server only (tsx watch)

# Build
npm run build           # Build both client and server
npm run lint            # ESLint check
npm run format          # Prettier formatting

# Git
git status              # Check working tree
git add .               # Stage all changes
git commit -m "message" # Commit with message
git push origin main    # Push to GitHub
```

## File Structure
```
src/
├── components/
│   ├── DraggableWrapper.tsx    # react-draggable integration
│   ├── PromptComposer.tsx      # Main input component
│   └── ...
├── runtime/
│   ├── canvasRenderer.tsx      # Canvas Kit renderer (main)
│   ├── renderer.tsx            # Tailwind renderer (unused)
│   └── types.ts                # Type definitions
└── data/
    ├── library.js              # Component library
    └── canvasIcons.js          # Icon definitions
```

## Next Priority Fixes
1. **Component ID stability** - prevent ID regeneration on re-renders
2. **Export functionality** - wireframe formats and AI-friendly code output
3. **Enhanced positioning** - improve grid snapping and alignment tools
4. **Performance optimization** - reduce re-renders during drag operations

## Upcoming Features (v0.1.5 Roadmap)

### 🔄 Export System
- **Wireframe Formats**: Export to Figma JSON, Sketch, Adobe XD
- **Code Output**: Generate React components, HTML, Vue templates
- **AI-Friendly**: JSON schema optimized for LLM consumption
- **Position Preservation**: Export with current drag positions
- **Canvas Kit Integrity**: Maintain authentic Workday component structure

### 📊 Export Technical Implementation
```typescript
// Planned export interface
interface ExportOptions {
  format: 'figma' | 'sketch' | 'react' | 'html' | 'vue' | 'json';
  includePositions: boolean;
  preserveCanvasKit: boolean;
  optimizeForAI: boolean;
}
```

---
*Last updated: v0.1.4 - Fixed nested drag handle interactions*