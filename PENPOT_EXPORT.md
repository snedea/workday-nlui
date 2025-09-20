# Export to Penpot - Canvas Kit Design Collaboration

The workday-nlui studio now supports exporting AI-generated designs directly to Penpot for design collaboration and refinement.

## Features

✅ **Complete Canvas Kit Token Library** - Colors, spacing, typography, and component specifications
✅ **Component Mapping** - Automatically converts UI components to Penpot-compatible shapes
✅ **Proper Positioning** - Maintains layout structure and spacing
✅ **Design Tokens** - Applies authentic Canvas Kit v14 styling
✅ **Collaborative Workflow** - Bridge between AI generation and design refinement

## How to Use

### 1. Generate a Design
1. Open workday-nlui studio at `http://localhost:5174`
2. Create a design using natural language prompts
3. Ensure the preview shows your desired UI

### 2. Export to Penpot
1. Click the **📐 Penpot** button in the preview section
2. A `.penpot` file will be automatically downloaded
3. The filename follows the pattern: `{design_title}_canvas_kit.penpot`

### 3. Import into Penpot
1. Open [Penpot](https://penpot.app) or your local Penpot instance
2. Create a new project or open an existing one
3. Go to **File > Import** and select your downloaded `.penpot` file
4. The design will be imported with all Canvas Kit styling applied

## What Gets Exported

### Components Supported
- **Cards/Sections** → Styled containers with Canvas Kit colors
- **Buttons** → Primary, Secondary, and Tertiary variants
- **Tables** → Complete table structures with headers and data
- **Text** → Typography following Canvas Kit hierarchy
- **Forms** → Input fields with proper labels and styling
- **Badges** → Status indicators with semantic colors
- **Unknown Components** → Placeholder rectangles for unsupported types

### Styling Applied
- **Colors**: Canvas Kit v14 color palette (blueberry, success, error, warning, soap)
- **Typography**: Roboto font family with proper weights and sizes
- **Spacing**: Canvas Kit spacing scale (4px to 64px)
- **Border Radius**: Consistent 4px radius for components
- **Borders**: Proper stroke colors and widths

### Layout Structure
- **Positioning**: Maintains relative component positioning
- **Spacing**: Preserves vertical spacing between components
- **Grouping**: Logical grouping of related elements
- **Responsive**: Components use appropriate Canvas Kit dimensions

## Canvas Kit Token Reference

### Colors
```css
/* Primary */
--blueberry-500: #0875e1  /* Main brand color */
--blueberry-600: #005cb4  /* Dark variant */

/* Status */
--success-main: #008537   /* Success green */
--error-main: #de2e21     /* Error red */
--warning-main: #ff9800   /* Warning orange */

/* Neutrals */
--soap-100: #ffffff       /* White backgrounds */
--soap-200: #f7f7f7       /* Light backgrounds */
--soap-300: #e8e8e8       /* Borders */
--soap-600: #666666       /* Text */
```

### Spacing Scale
```css
--spacing-xxxs: 4px   /* Tight spacing */
--spacing-xxs: 8px    /* Small spacing */
--spacing-xs: 12px    /* Base small */
--spacing-s: 16px     /* Base unit */
--spacing-m: 24px     /* Medium */
--spacing-l: 32px     /* Large */
--spacing-xl: 40px    /* Extra large */
--spacing-xxl: 64px   /* Section spacing */
```

## Example Workflow

1. **AI Generation**: "Create a profile page with header, tabs, and contact information"
2. **Export**: Click 📐 Penpot button → Downloads `profile_page_canvas_kit.penpot`
3. **Design Refinement**: Import into Penpot, adjust layouts, add interactions
4. **Handoff**: Export specs or prototypes for development
5. **Development**: Build using actual Canvas Kit components

## Tips for Best Results

### For Developers
- Use specific Canvas Kit component names in prompts
- Be detailed about data structure for tables
- Specify button variants (primary, secondary, tertiary)
- Include status information for badges

### For Designers
- Import the Canvas Kit token library for consistency
- Use Penpot's component system to make elements reusable
- Add interactions and animations as needed
- Create prototypes for user testing

### Collaboration
- Export early and often during the design process
- Use Penpot's comment system for feedback
- Maintain Canvas Kit design principles
- Document any deviations from the design system

## Troubleshooting

### Export Issues
- **Download doesn't start**: Check browser popup blockers
- **File is corrupted**: Ensure the UI generation completed successfully
- **Missing components**: Check console for any JavaScript errors

### Import Issues in Penpot
- **Components look wrong**: Verify Penpot supports the imported format
- **Missing text**: Text content may need to be re-added manually
- **Layout issues**: Adjust positioning in Penpot as needed

### Styling Issues
- **Wrong colors**: Ensure Canvas Kit tokens are being applied
- **Incorrect spacing**: Check that the spacing scale is properly imported
- **Font issues**: Roboto may need to be loaded in Penpot

## Future Enhancements

- [ ] **Interactive Components**: Export with basic interactions
- [ ] **Advanced Layouts**: Support for complex grid and flex layouts
- [ ] **Icon Support**: Include Canvas Kit icons in exports
- [ ] **Animation**: Export with transition specifications
- [ ] **Component Variants**: Support for different component states
- [ ] **Token Sync**: Automatic token updates between systems

---

**Need Help?** Check the [Canvas Kit Documentation](https://workday.github.io/canvas-kit/) or [Penpot Documentation](https://help.penpot.app/) for additional guidance.