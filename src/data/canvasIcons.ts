import { LibraryItem } from '../runtime/types';

// Lazy loading function for icon modules
async function loadIconModule(module: string) {
  try {
    return await import(module);
  } catch (error) {
    console.warn(`Failed to load icon module ${module}:`, error);
    return {};
  }
}

// Extract icon names from the imports
function extractIconNames(iconModule: any): string[] {
  return Object.keys(iconModule).filter(key =>
    key !== 'default' &&
    typeof iconModule[key] === 'object'
  );
}

// Cache for loaded icon libraries
let iconLibraryCache: LibraryItem[] | null = null;
let iconCountsCache: any = null;

// Async function to load all Canvas Kit icons
export async function loadCanvasIconsLibrary(): Promise<LibraryItem[]> {
  if (iconLibraryCache) {
    return iconLibraryCache;
  }

  const [systemIcons, accentIcons, appletIcons] = await Promise.all([
    loadIconModule('@workday/canvas-system-icons-web'),
    loadIconModule('@workday/canvas-accent-icons-web'),
    loadIconModule('@workday/canvas-applet-icons-web')
  ]);

  // System Icons - UI glyphs for buttons, navigation, etc.
  const systemIconNames = extractIconNames(systemIcons);
  const systemIconLibrary: LibraryItem[] = systemIconNames.map(name => ({
    name: name,
    tags: ['system', 'ui', 'glyph', name.toLowerCase().replace(/icon$/i, '')],
    example: `system.${name}`,
    visual: '⚙️',
    _type: 'Icon'
  }));

  // Accent Icons - Decorative icons for emphasis
  const accentIconNames = extractIconNames(accentIcons);
  const accentIconLibrary: LibraryItem[] = accentIconNames.map(name => ({
    name: name,
    tags: ['accent', 'decorative', 'emphasis', name.toLowerCase().replace(/icon$/i, '')],
    example: `accent.${name}`,
    visual: '✨',
    _type: 'Icon'
  }));

  // Applet Icons - Product entry point icons
  const appletIconNames = extractIconNames(appletIcons);
  const appletIconLibrary: LibraryItem[] = appletIconNames.map(name => ({
    name: name,
    tags: ['applet', 'product', 'app', name.toLowerCase().replace(/icon$/i, '')],
    example: `applet.${name}`,
    visual: '📱',
    _type: 'Icon'
  }));

  // Combined Canvas Icons Library
  iconLibraryCache = [
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

  // Cache icon counts for debugging
  iconCountsCache = {
    system: systemIconNames.length,
    accent: accentIconNames.length,
    applet: appletIconNames.length,
    total: systemIconNames.length + accentIconNames.length + appletIconNames.length
  };

  console.log('Canvas Icons Loaded Async:', iconCountsCache);
  return iconLibraryCache;
}

// Synchronous fallback that returns empty array (for immediate use)
export const canvasIconsLibrary: LibraryItem[] = [];

// Export icon counts for debugging (will be populated after async load)
export const iconCounts = iconCountsCache || {
  system: 0,
  accent: 0,
  applet: 0,
  total: 0
};