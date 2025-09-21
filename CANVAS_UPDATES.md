# Canvas Kit Updates Monitoring Guide

This guide helps maintain Canvas Design System compliance as new versions are released.

## Current Version Status

- **Canvas Kit Version**: v14.0.2
- **Installation Date**: September 2025
- **Last Compliance Audit**: September 21, 2025
- **Next Review**: December 21, 2025

## Monitoring Channels

### 1. Official Sources
- **GitHub Releases**: https://github.com/Workday/canvas-kit/releases
- **Changelog**: https://github.com/Workday/canvas-kit/blob/master/CHANGELOG.md
- **Migration Guides**: https://workday.github.io/canvas-kit/?path=/docs/welcome-migration-guides--docs

### 2. Package Updates
```bash
# Check for Canvas Kit updates
npm outdated | grep canvas

# Specific Canvas packages to monitor
npm outdated @workday/canvas-kit-react
npm outdated @workday/canvas-kit-preview-react
npm outdated @workday/canvas-tokens-web
npm outdated @workday/canvas-system-icons-web
```

### 3. Breaking Changes Alerts
Watch for these patterns in release notes:
- ❗ **BREAKING CHANGE**: Requires code modifications
- 🚨 **DEPRECATED**: Components/props marked for removal
- ⚠️ **MIGRATION**: Upgrade path documentation required

## Canvas Kit v15 Preparation

### Expected Breaking Changes
Based on Canvas Kit roadmap and v14 deprecations:

1. **StatusIndicator Migration**
   - Current: `@workday/canvas-kit-preview-react`
   - Expected: Move to stable package in v15
   - Action: Update imports when v15 releases

2. **Token System Evolution**
   - Current: `@workday/canvas-tokens-web`
   - Expected: Enhanced token architecture
   - Action: Review token usage patterns

3. **Component API Updates**
   - Watch for compound component changes
   - Monitor prop deprecations in v14.x releases
   - Track accessibility improvements

### Pre-Migration Checklist
Before upgrading to v15:

- [ ] **Backup Current State**: Tag current working version
- [ ] **Review Deprecation Warnings**: Check console for warnings
- [ ] **Read Migration Guide**: Workday provides detailed migration docs
- [ ] **Test in Staging**: Upgrade in development environment first
- [ ] **Update Dependencies**: Ensure all Canvas packages are compatible

## Upgrade Process

### 1. Preparation Phase
```bash
# 1. Create backup branch
git checkout -b canvas-v15-upgrade

# 2. Document current versions
npm list | grep canvas > canvas-versions-pre-upgrade.txt

# 3. Check for breaking changes
npx @workday/canvas-kit-migrate
```

### 2. Upgrade Phase
```bash
# 1. Update all Canvas packages
npm update @workday/canvas-kit-react@latest
npm update @workday/canvas-kit-preview-react@latest
npm update @workday/canvas-tokens-web@latest

# 2. Update icon packages
npm update @workday/canvas-system-icons-web@latest
npm update @workday/canvas-accent-icons-web@latest
npm update @workday/canvas-applet-icons-web@latest

# 3. Run migration scripts (if available)
npx @workday/canvas-kit-migrate --version=15
```

### 3. Validation Phase
```bash
# 1. Check for TypeScript errors
npm run build

# 2. Test application functionality
npm run dev

# 3. Run visual regression tests
npm run test:visual

# 4. Validate compliance
grep -r "canvas-kit-react" src/ --include="*.tsx"
```

## Code Patterns to Monitor

### 1. Import Patterns
```typescript
// ✅ Current v14 pattern (maintain)
import { Card } from '@workday/canvas-kit-react/card';

// ⚠️ Watch for changes in v15
import { StatusIndicator } from '@workday/canvas-kit-preview-react';
```

### 2. Component Usage
```typescript
// Monitor for deprecation warnings
<RadioGroup name="example">
  <RadioGroup.RadioButton value="option1">
    <RadioGroup.RadioButton.Input />
    <RadioGroup.RadioButton.Label>Option 1</RadioGroup.RadioButton.Label>
  </RadioGroup.RadioButton>
</RadioGroup>
```

### 3. Token References
```typescript
// Watch for token system changes
import { useTheme } from '@workday/canvas-kit-react/common';
```

## Common Migration Issues

### 1. Import Path Changes
**Problem**: Import paths change between versions
```typescript
// Old
import { Component } from '@workday/canvas-kit-react/legacy-path';

// New
import { Component } from '@workday/canvas-kit-react/new-path';
```

**Solution**: Use find/replace with regex patterns

### 2. Prop Deprecations
**Problem**: Component props are deprecated
```typescript
// Old
<StatusIndicator emphasis="high" />

// New
<StatusIndicator variant="critical" />
```

**Solution**: Update prop usage based on migration guide

### 3. Breaking API Changes
**Problem**: Component APIs are restructured
**Solution**: Follow Workday's migration documentation step-by-step

## Compliance Verification

After any Canvas Kit upgrade:

### 1. Automated Checks
```bash
# Verify no hardcoded tokens
grep -r "0875e1\|#f6f6f6" src/ || echo "✅ No hardcoded colors"

# Check for deprecated patterns
grep -r "canvas-kit-react['\"]" src/ || echo "✅ No barrel imports"

# Validate icon usage
grep -r "SystemIcon\|AccentIcon\|AppletIcon" src/ | wc -l
```

### 2. Manual Verification
- [ ] All components render without errors
- [ ] Typography uses Canvas fonts
- [ ] Spacing follows 8px grid
- [ ] Colors match Canvas palette
- [ ] Icons are from Canvas packages

### 3. Documentation Updates
- [ ] Update COMPLIANCE.md with new version
- [ ] Update package.json version badges
- [ ] Update README.md Canvas Kit version references
- [ ] Tag release with compliance status

## Quarterly Review Process

### Every 3 Months
1. **Check for Updates**
   ```bash
   npm outdated | grep canvas
   ```

2. **Review Deprecation Warnings**
   - Check browser console during development
   - Review Canvas Kit changelog for deprecations

3. **Test Compliance**
   - Run full compliance audit
   - Update COMPLIANCE.md if needed

4. **Plan Upgrades**
   - Schedule upgrade windows
   - Prepare migration strategy

## Emergency Hotfixes

If critical Canvas Kit security updates are released:

### Immediate Actions
1. **Assess Impact**: Review security advisory
2. **Quick Update**: Update affected packages only
3. **Test Critical Paths**: Verify core functionality
4. **Deploy**: Push to production if stable

### Example Emergency Update
```bash
# Security hotfix for specific component
npm update @workday/canvas-kit-react@14.0.3

# Quick validation
npm run build && npm run dev

# Deploy if tests pass
git add package*.json && git commit -m "security: update Canvas Kit to v14.0.3"
```

## Troubleshooting

### Common Issues

**Build Errors After Upgrade**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**TypeScript Errors**
```bash
# Update TypeScript types
npm update @types/react @types/react-dom
```

**Visual Regression**
```bash
# Update visual test snapshots
npm run test:visual:update
```

## Resources

- **Canvas Kit Documentation**: https://workday.github.io/canvas-kit/
- **Migration Guides**: https://workday.github.io/canvas-kit/?path=/docs/welcome-migration-guides--docs
- **Component Status**: https://workday.github.io/canvas-kit/?path=/docs/welcome-component-status--docs
- **GitHub Issues**: https://github.com/Workday/canvas-kit/issues
- **Canvas Kit Slack**: Internal Workday communication (if applicable)

---

*This monitoring guide ensures NLUI Studio maintains Canvas Design System compliance through version updates and provides a clear upgrade path for future releases.*