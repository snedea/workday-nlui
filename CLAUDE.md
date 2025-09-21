# Claude AI Development Notes - Workday NLUI Studio

## Resolved Issues (Previous Versions)

### ✅ Fixed in v0.1.6
- **Template Button UX**: Reordered hover buttons (delete, edit, copy, use) with blue primary "Use" action
- **StatusIndicator Modernization**: Migrated from deprecated Canvas Kit StatusIndicator to Preview API
- **Context-Aware Status System**: Removed hardcoded status constraints, allowing LLM to choose appropriate statuses
- **Global StatusIndicator Width Fix**: Implemented dynamic width sizing using fit-content and inline-flex
- **Semantic Status Mapping**: Intelligent color mapping based on status keywords (positive, caution, critical, neutral)
- **Server Stability**: Fixed 500 errors from crashed server processes

### ✅ Fixed in v0.1.5
- **Independent Component Dragging**: Components can now be moved independently without affecting parent containers
- **Smart Auto-Layout**: Collision detection prevents overlapping, automatically repositions components
- **Template Auto-Population**: Template names now auto-populate from preview titles
- **Real URL Support**: Fixed Credly badge URLs and other external image loading
- **Z-Index Layering**: Right-click context menu for layer control (F to front, B to back)
- **Tab Clickability**: Fixed tabs being clickable while maintaining draggable tab groups

### ✅ Fixed in v0.1.4
- **Nested Drag Handles**: Fixed issue where drag handles inside tables/complex layouts were visible but not clickable
- Added `pointer-events: auto !important` CSS override for `.drag-handle` class
- All nested components (fields, buttons) inside containers now fully draggable

### ✅ Fixed in v0.1.3
- **Button Position Memory**: Buttons don't consistently remember their dragged positions when switching between static/draggable modes
- **Table Size Changes**: Table components change size when switching from static to draggable view, causing layout shifts

## Recent Changes (v0.1.6)

### 🎯 StatusIndicator Component Modernization
- **Issue**: React component errors with deprecated StatusIndicator from Canvas Kit
- **Root Cause**: Using old `@workday/canvas-kit-react/status-indicator` with Preview API syntax
- **Solution**: Migrated to `@workday/canvas-kit-preview-react` StatusIndicator
- **Implementation**:
  - Removed deprecated `emphasis` prop
  - Updated to use correct `variant` values
  - Fixed "React.jsx: type is invalid" errors
- **Files**: `src/runtime/canvasRenderer.tsx:29`

### 🎯 Context-Aware Status System
- **Issue**: Expense reports showing inappropriate "On Leave" status
- **Root Cause**: Hardcoded status constraints in LLM prompt limited to employee statuses
- **Solution**: Removed hardcoded constraints, implemented semantic status mapping
- **Implementation**:
  - Changed `Badge: { status: "Active" | "On Leave" | "Terminated" | "Draft" }` to `Badge: { status: string }`
  - Added intelligent keyword-based color mapping system
  - Expense reports now show "Submitted", "Approved", "Rejected"
  - Employee profiles show "Active", "Terminated", "On Leave"
- **Files**: `server/llm.ts:25`, `src/runtime/canvasRenderer.tsx:448-477`

### 🎯 Global StatusIndicator Width Fix
- **Issue**: StatusIndicators had fixed widths causing layout problems in tables and cards
- **Solution**: Implemented dynamic width sizing using CSS fit-content and inline-flex
- **Implementation**:
  - Added `style={{ display: 'inline-flex', width: 'fit-content' }}` to all StatusIndicator components
  - Wrapped table cell content in fit-content divs for proper sizing
  - Applied same fix to Pill components for consistency
- **Files**: `src/runtime/canvasRenderer.tsx:377-385, 394-401, 482-488, 525`

### 🎯 Server Stability Improvements
- **Issue**: "Request failed with status code 500" errors when generating prompts
- **Root Cause**: Server process crashes but remains running, causing ECONNREFUSED errors
- **Solution**: Proper server restart procedures and monitoring
- **Quick Fix**: `pkill -f "npm run dev" && npm run dev`

### 🎯 Template Button UX Improvements
- **Issue**: Template hover buttons needed better order and visual hierarchy
- **Solution**: Reordered buttons from "use, copy, edit, delete" to "delete, edit, copy, use"
- **Implementation**:
  - Moved destructive "delete" action to leftmost position to prevent accidental clicks
  - Styled "Use" button with blue background (`bg-blue-600 text-white hover:bg-blue-700`) as primary action
  - Applied consistent styling across LibraryCard and EditableTemplateCard components
- **Files**: `src/components/LibraryCard.tsx:24-53`, `src/components/EditableTemplateCard.tsx:45-58`

### ✅ Completed v0.1.6
- **Template Button UX**: Reordered and styled template hover buttons for better usability
- **StatusIndicator Modernization**: Migrated to Canvas Kit Preview API
- **Context-Aware Status System**: Implemented flexible, context-aware status system
- **Global StatusIndicator Width Fix**: Fixed width issues with dynamic sizing using fit-content and inline-flex
- **Semantic Status Mapping**: Added intelligent color mapping with semantic color variants
- **Server Stability**: Improved error handling and recovery processes

## Previous Changes (v0.1.5)

### 🎯 Smart Auto-Layout Engine
- **Issue**: Components could overlap when dragged, creating messy layouts
- **Solution**: Implemented collision detection system that automatically moves overlapping components
- **Features**: Cascade positioning, z-index management, intelligent spacing
- **Impact**: Clean, professional layouts with automatic component organization

### 🎯 Independent Component Dragging
- **Issue**: Moving form fields or nested elements would drag entire containers
- **Root Cause**: Section containers were draggable, interfering with child component positioning
- **Solution**: Added Section to non-draggable types, fixed absolute positioning during drag
- **Impact**: Individual fields, buttons, and elements can be positioned independently

### 🎯 Template Auto-Population
- **Issue**: Users had to manually enter template names when saving custom templates
- **Solution**: Auto-populate template name from preview title, description from prompt content
- **Implementation**: Pass preview title as prop to PromptComposer, use as default template name
- **Impact**: Streamlined template creation workflow

### 🎯 Real URL Support
- **Issue**: Credly badge URLs and external images showed placeholder errors
- **Root Cause**: LLM prompt instructed to use placeholder.com URLs
- **Solution**: Updated prompt to use exact user-provided URLs, fallback to emoji
- **Impact**: Authentic badge images and external content now display correctly

### ✅ Completed v0.1.5
- Implemented smart collision detection and auto-layout
- Fixed independent component dragging for all element types
- Added template name auto-population from preview titles
- Fixed external URL support for badges and images
- Enhanced z-index layering with right-click controls
- Maintained tab clickability while enabling tab group dragging

## Previous Changes (v0.1.4 and v0.1.3)

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
  const nonDraggableTypes = ['Page', 'Tab', 'Form', 'Section'];
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

### Debug StatusIndicator Issues
1. Verify using Canvas Kit Preview import: `@workday/canvas-kit-preview-react`
2. Check variant values: `positive`, `caution`, `critical`, `neutral`
3. Ensure no `emphasis` prop is used (deprecated)
4. Verify semantic status mapping in `canvasRenderer.tsx:448-477`

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
1. **Export functionality** - wireframe formats and AI-friendly code output
2. **Enhanced positioning** - improve grid snapping and alignment tools
3. **Performance optimization** - reduce re-renders during drag operations
4. **Undo/Redo system** - track drag operations for better user experience

## Upcoming Features (v0.1.6 Roadmap)

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

## Code Examples

### Semantic Status Mapping System
```typescript
// Context-aware status color mapping (canvasRenderer.tsx:448-477)
const getStatusConfig = (status: string) => {
  const statusLower = status.toLowerCase();

  // Positive indicators
  if (['active', 'approved', 'completed', 'success', 'confirmed'].some(word => statusLower.includes(word))) {
    return { variant: 'positive' as const, label: status };
  }

  // Caution indicators
  if (['pending', 'review', 'draft', 'submitted'].some(word => statusLower.includes(word))) {
    return { variant: 'caution' as const, label: status };
  }

  // Critical indicators
  if (['rejected', 'terminated', 'failed', 'error'].some(word => statusLower.includes(word))) {
    return { variant: 'critical' as const, label: status };
  }

  // Default neutral
  return { variant: 'neutral' as const, label: status };
};
```

### Dynamic Width StatusIndicator
```typescript
// Global width fix with inline-flex and fit-content
<StatusIndicator
  variant={statusConfig.variant}
  style={{ display: 'inline-flex', width: 'fit-content' }}
>
  <StatusIndicator.Label>{statusConfig.label}</StatusIndicator.Label>
</StatusIndicator>
```

---
*Last updated: v0.1.6 - Template UX improvements, StatusIndicator modernization and context-aware status system*