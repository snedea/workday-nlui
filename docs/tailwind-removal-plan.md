# Tailwind Removal Plan - Workday NLUI Studio

## Objective
Safely remove Tailwind CSS dependency from Workday NLUI Studio while maintaining all visual functionality using Canvas Kit components and custom CSS.

## Current State (v0.1.3)
- **Status**: Preparation phase - establishing baseline
- **Branch**: `chore/safe-tailwind-removal`
- **Last verified**: 2025-09-20

### Current Dependencies Audit
```json
// From package.json - TO BE AUDITED
"tailwindcss": "^3.x.x",
"@tailwindcss/typography": "^x.x.x",
"autoprefixer": "^x.x.x"
```

### Tailwind Usage Analysis
- [ ] **TODO**: Audit all `.tsx` files for Tailwind classes
- [ ] **TODO**: Document custom CSS overrides
- [ ] **TODO**: Identify critical styling patterns

## Phase 0 — Prep & Baseline ✅

### Completed Actions
- [x] Created feature branch `chore/safe-tailwind-removal`
- [x] Created documentation structure
- [ ] **TODO**: Install Playwright for visual regression testing
- [ ] **TODO**: Create visual test scenarios
- [ ] **TODO**: Capture baseline screenshots

### Visual Test Coverage Plan
1. **home.spec.ts** - Landing page with library sidebar
2. **composer.spec.ts** - Prompt composer interactions
3. **library.spec.ts** - Template and library browsing
4. **forms.spec.ts** - Generated form-heavy views
5. **tables.spec.ts** - Table components and data views
6. **alerts.spec.ts** - Banners, toasts, and status indicators
7. **draggable.spec.ts** - Drag and drop functionality

## Phase 1 — Analysis & Mapping (PENDING)
- [ ] Comprehensive Tailwind class audit
- [ ] Map Tailwind classes to Canvas Kit equivalents
- [ ] Identify custom CSS requirements
- [ ] Document component-by-component migration plan

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
- Starting Playwright setup for visual regression testing
- Ready to begin comprehensive Tailwind audit

---

*This document will be updated throughout the removal process with findings, decisions, and progress.*