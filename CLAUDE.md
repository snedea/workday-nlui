# Claude AI Development Notes - Workday NLUI Studio

## Known Issues (v0.1.3)

### 🐛 Drag & Drop Issues
- **Button Position Memory**: Buttons don't consistently remember their dragged positions when switching between static/draggable modes
- **Table Size Changes**: Table components change size when switching from static to draggable view, causing layout shifts

### 🔧 Technical Debt
- Need to investigate position persistence for all component types
- Table rendering inconsistencies between modes need alignment
- Component ID generation could be more stable

## Recent Changes (v0.1.3)

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
1. **Button position persistence** - investigate why buttons lose positions
2. **Table size consistency** - ensure tables render same size in both modes
3. **Component ID stability** - prevent ID regeneration on re-renders
4. **Drag handle visibility** - ensure blue handles appear consistently

---
*Last updated: v0.1.3 - Enhanced drag-and-drop with react-draggable*