# Tailwind Removal Plan - Workday NLUI Studio

## Objective
Safely remove Tailwind CSS dependency from Workday NLUI Studio while maintaining all visual functionality using Canvas Kit components and custom CSS.

## Current State (v0.1.3)
- **Status**: Preparation phase - establishing baseline
- **Branch**: `chore/safe-tailwind-removal`
- **Last verified**: 2025-09-20

### Current Dependencies Audit ✅
```json
// From package.json
"tailwindcss": "^3.3.6",
"autoprefixer": "^10.4.16",
"postcss": "^8.4.32"
```

**Configuration Files Found:**
- `tailwind.config.cjs` - Standard Tailwind configuration
- `postcss.config.cjs` - PostCSS with Tailwind plugin
- `src/styles/index.css` - All @tailwind directives (base, components, utilities)

### Tailwind Usage Analysis ✅ (Phase 1 Complete)
- [x] **COMPLETE**: Audit all `.tsx` files for Tailwind classes
- [x] **COMPLETE**: Document custom CSS overrides
- [x] **COMPLETE**: Identify critical styling patterns

**Audit Results (Generated 2025-09-20):**
- **566 Tailwind class instances** across **8 files** (38.1% of files)
- **Top categories**: Typography (109), Borders (76), Colors (74), Spacing (74)
- **Priority files**: PromptComposer.tsx (191), renderer.tsx (181), App.tsx (88)
- **Most used classes**: flex (28), border (23), items-center (19)

**Custom CSS Analysis:**
- `src/styles/index.css` contains @apply directives for:
  - `.card` component (bg-white, rounded-lg, shadow-sm, border)
  - Button utilities (btn-primary, btn-secondary)
  - Tab states (tab-active, tab-inactive)
- Body styling: bg-gray-50, text-gray-900

## Phase 0 — Prep & Baseline ✅

### Completed Actions
- [x] Created feature branch `chore/safe-tailwind-removal`
- [x] Created documentation structure
- [x] Install Playwright for visual regression testing
- [x] Create visual test scenarios (7 test files)
- [x] Capture baseline screenshots

### Visual Test Coverage Plan
1. **home.spec.ts** - Landing page with library sidebar
2. **composer.spec.ts** - Prompt composer interactions
3. **library.spec.ts** - Template and library browsing
4. **forms.spec.ts** - Generated form-heavy views
5. **tables.spec.ts** - Table components and data views
6. **alerts.spec.ts** - Banners, toasts, and status indicators
7. **draggable.spec.ts** - Drag and drop functionality

## Phase 1 — Audit (COMPLETE) ✅
- [x] Comprehensive Tailwind class audit (566 instances across 8 files)
- [x] Automated audit script (`scripts/tw-audit.ts`)
- [x] Generate detailed usage reports (JSON, CSV, Markdown)
- [x] Identify high-priority migration targets

**Deliverables:**
- `audit/tailwind-usage.json` - Complete class inventory with file locations
- `audit/tailwind-usage.csv` - Spreadsheet format for tracking
- `audit/summary.md` - Human-readable summary and migration strategy
- `scripts/tw-audit.ts` - Reusable audit tool for progress tracking

**Key Findings:**
- **Hot spots**: PromptComposer (191), renderer (181), App (88) classes
- **Layout dependencies**: Heavy use of flex, grid, spacing utilities
- **Color system**: Already using some Canvas Kit tokens via Tailwind
- **Typography**: Mix of Tailwind utilities and Canvas Kit components

## Phase 2 — Component Migration (PENDING)
- [ ] Migrate low-risk utility components first
- [ ] Replace Tailwind layout classes with CSS Grid/Flexbox
- [ ] Convert spacing/sizing to Canvas Kit tokens
- [ ] Update color system to Canvas Kit palette

## Phase 3 — Build System Updates (PENDING)
- [ ] Remove Tailwind from build pipeline
- [ ] Update PostCSS configuration
- [ ] Clean up unused CSS files
- [ ] Optimize bundle size

## Phase 4 — Verification & Cleanup (PENDING)
- [ ] Run visual regression tests
- [ ] Performance testing
- [ ] Cross-browser validation
- [ ] Documentation updates

## Risk Assessment
- **High Risk**: Layout components with complex Tailwind grid/flex
- **Medium Risk**: Spacing and responsive design
- **Low Risk**: Color and typography (already using Canvas Kit)

## Rollback Plan
- Maintain feature branch for easy rollback
- Visual regression tests as safety net
- Incremental commits for granular rollback options

---

## Audit Log

### 2025-09-20 - Phase 0 Setup
- Created feature branch and documentation
- Completed Playwright setup for visual regression testing
- Captured baseline screenshots for visual regression

### 2025-09-20 - Phase 1 Audit Complete
- Built comprehensive audit tool (`scripts/tw-audit.ts`)
- Analyzed 566 Tailwind class instances across 8 files
- Generated detailed reports: JSON, CSV, and Markdown formats
- Identified migration priorities and hot spots
- Updated documentation with findings

---

*This document will be updated throughout the removal process with findings, decisions, and progress.*