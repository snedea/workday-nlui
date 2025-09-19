import * as systemIcons from '@workday/canvas-system-icons-web';
import * as accentIcons from '@workday/canvas-accent-icons-web';
import * as appletIcons from '@workday/canvas-applet-icons-web';
import { LibraryItem } from '../runtime/types';

// Extract icon names from the imports
function extractIconNames(iconModule: any): string[] {
  return Object.keys(iconModule).filter(key =>
    key !== 'default' &&
    typeof iconModule[key] === 'object'
  );
}

// System Icons - UI glyphs for buttons, navigation, etc.
const systemIconNames = extractIconNames(systemIcons);
export const systemIconLibrary: LibraryItem[] = systemIconNames.map(name => ({
  name: name,
  tags: ['system', 'ui', 'glyph', name.toLowerCase().replace(/icon$/i, '')],
  example: `system.${name}`,
  visual: '⚙️',
  _type: 'Icon'
}));

// Accent Icons - Decorative icons for emphasis
const accentIconNames = extractIconNames(accentIcons);
export const accentIconLibrary: LibraryItem[] = accentIconNames.map(name => ({
  name: name,
  tags: ['accent', 'decorative', 'emphasis', name.toLowerCase().replace(/icon$/i, '')],
  example: `accent.${name}`,
  visual: '✨',
  _type: 'Icon'
}));

// Applet Icons - Product entry point icons
const appletIconNames = extractIconNames(appletIcons);
export const appletIconLibrary: LibraryItem[] = appletIconNames.map(name => ({
  name: name,
  tags: ['applet', 'product', 'app', name.toLowerCase().replace(/icon$/i, '')],
  example: `applet.${name}`,
  visual: '📱',
  _type: 'Icon'
}));

// Combined Canvas Icons Library
export const canvasIconsLibrary: LibraryItem[] = [
  ...systemIconLibrary.map(icon => ({
    ...icon,
    name: `System: ${icon.name}`,
    onUseInsert: `[Icon:${icon.example}]`
  })),
  ...accentIconLibrary.map(icon => ({
    ...icon,
    name: `Accent: ${icon.name}`,
    onUseInsert: `[Icon:${icon.example}]`
  })),
  ...appletIconLibrary.map(icon => ({
    ...icon,
    name: `Applet: ${icon.name}`,
    onUseInsert: `[Icon:${icon.example}]`
  }))
];

// Export icon counts for debugging
export const iconCounts = {
  system: systemIconNames.length,
  accent: accentIconNames.length,
  applet: appletIconNames.length,
  total: systemIconNames.length + accentIconNames.length + appletIconNames.length
};

console.log('Canvas Icons Loaded:', iconCounts);