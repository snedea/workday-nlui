// Canvas Kit v14 Design Tokens for Penpot
// This file provides the complete Canvas Kit token library that can be used
// to create a Penpot token library file

export const CANVAS_KIT_TOKENS_PENPOT = {
  metadata: {
    name: "Canvas Kit v14 Design Tokens",
    version: "14.0.0",
    description: "Official Workday Canvas Kit design tokens for Penpot",
    author: "Workday Canvas Kit Team",
    url: "https://github.com/Workday/canvas-kit"
  },

  colors: {
    // Primary Brand Colors
    blueberry: {
      100: { value: "#e6f2ff", description: "Lightest blueberry for backgrounds and subtle accents" },
      200: { value: "#cce5ff", description: "Light blueberry for hover states and secondary backgrounds" },
      300: { value: "#99cbff", description: "Medium-light blueberry for disabled states" },
      400: { value: "#4da3ff", description: "Medium blueberry for interactive elements" },
      500: { value: "#0875e1", description: "Primary blueberry - main brand color" },
      600: { value: "#005cb4", description: "Dark blueberry for emphasis and dark themes" }
    },

    // Status Colors
    success: {
      light: { value: "#d7f4e4", description: "Light green for success backgrounds" },
      main: { value: "#008537", description: "Primary success color" },
      dark: { value: "#005423", description: "Dark success for text and emphasis" }
    },

    error: {
      light: { value: "#ffeaea", description: "Light red for error backgrounds" },
      main: { value: "#de2e21", description: "Primary error color" },
      dark: { value: "#8f1e16", description: "Dark error for text and emphasis" }
    },

    warning: {
      light: { value: "#fff5e6", description: "Light orange for warning backgrounds" },
      main: { value: "#ff9800", description: "Primary warning color" },
      dark: { value: "#c77700", description: "Dark warning for text and emphasis" }
    },

    // Neutral Colors (Soap Scale)
    soap: {
      100: { value: "#ffffff", description: "Pure white - primary background" },
      200: { value: "#f7f7f7", description: "Very light gray - secondary backgrounds" },
      300: { value: "#e8e8e8", description: "Light gray - borders and dividers" },
      400: { value: "#d2d2d2", description: "Medium-light gray - disabled text" },
      500: { value: "#949494", description: "Medium gray - placeholder text" },
      600: { value: "#666666", description: "Dark gray - primary text color" }
    }
  },

  spacing: {
    xxxs: { value: 4, unit: "px", description: "Extra extra extra small spacing" },
    xxs: { value: 8, unit: "px", description: "Extra extra small spacing" },
    xs: { value: 12, unit: "px", description: "Extra small spacing" },
    s: { value: 16, unit: "px", description: "Small spacing - base unit" },
    m: { value: 24, unit: "px", description: "Medium spacing" },
    l: { value: 32, unit: "px", description: "Large spacing" },
    xl: { value: 40, unit: "px", description: "Extra large spacing" },
    xxl: { value: 64, unit: "px", description: "Extra extra large spacing" }
  },

  typography: {
    fontFamily: {
      primary: { value: "Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", description: "Primary font stack" },
      monospace: { value: "'Monaco', 'Consolas', 'Courier New', monospace", description: "Monospace font for code" }
    },

    fontSize: {
      xs: { value: 12, unit: "px", description: "Extra small text" },
      sm: { value: 14, unit: "px", description: "Small text - body default" },
      base: { value: 16, unit: "px", description: "Base text size" },
      lg: { value: 18, unit: "px", description: "Large text" },
      xl: { value: 20, unit: "px", description: "Extra large text - small headings" },
      "2xl": { value: 24, unit: "px", description: "2X large text - medium headings" },
      "3xl": { value: 28, unit: "px", description: "3X large text - large headings" },
      "4xl": { value: 32, unit: "px", description: "4X large text - page titles" }
    },

    fontWeight: {
      normal: { value: 400, description: "Normal text weight" },
      medium: { value: 500, description: "Medium text weight - for emphasis" },
      semibold: { value: 600, description: "Semi-bold - for headings" },
      bold: { value: 700, description: "Bold text - for strong emphasis" }
    },

    lineHeight: {
      tight: { value: 1.2, description: "Tight line height for headings" },
      snug: { value: 1.3, description: "Snug line height for subheadings" },
      normal: { value: 1.5, description: "Normal line height for body text" },
      relaxed: { value: 1.6, description: "Relaxed line height for large text blocks" }
    }
  },

  borderRadius: {
    none: { value: 0, unit: "px", description: "No border radius" },
    sm: { value: 2, unit: "px", description: "Small border radius" },
    base: { value: 4, unit: "px", description: "Base border radius - most common" },
    md: { value: 6, unit: "px", description: "Medium border radius" },
    lg: { value: 8, unit: "px", description: "Large border radius" },
    xl: { value: 12, unit: "px", description: "Extra large border radius" },
    pill: { value: 9999, unit: "px", description: "Pill shape - fully rounded" },
    circle: { value: "50%", unit: "%", description: "Perfect circle" }
  },

  shadows: {
    sm: {
      value: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      description: "Small shadow for subtle elevation"
    },
    base: {
      value: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      description: "Base shadow for cards and modals"
    },
    md: {
      value: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      description: "Medium shadow for dropdowns"
    },
    lg: {
      value: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      description: "Large shadow for overlays"
    },
    xl: {
      value: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      description: "Extra large shadow for modals"
    }
  },

  components: {
    button: {
      height: {
        sm: { value: 32, unit: "px", description: "Small button height" },
        md: { value: 40, unit: "px", description: "Medium button height - default" },
        lg: { value: 48, unit: "px", description: "Large button height" }
      },
      padding: {
        sm: { value: "8px 12px", description: "Small button padding" },
        md: { value: "12px 24px", description: "Medium button padding - default" },
        lg: { value: "16px 32px", description: "Large button padding" }
      }
    },

    input: {
      height: {
        sm: { value: 32, unit: "px", description: "Small input height" },
        md: { value: 40, unit: "px", description: "Medium input height - default" },
        lg: { value: 48, unit: "px", description: "Large input height" }
      },
      padding: {
        horizontal: { value: 12, unit: "px", description: "Input horizontal padding" },
        vertical: { value: 8, unit: "px", description: "Input vertical padding" }
      }
    },

    card: {
      padding: {
        sm: { value: 16, unit: "px", description: "Small card padding" },
        md: { value: 24, unit: "px", description: "Medium card padding - default" },
        lg: { value: 32, unit: "px", description: "Large card padding" }
      }
    }
  }
};

// Helper function to generate a Canvas Kit token library file for Penpot
export function generateCanvasKitTokensFile(): string {
  return JSON.stringify(CANVAS_KIT_TOKENS_PENPOT, null, 2);
}

// Helper function to get a flattened list of all colors for easy access
export function getCanvasKitColors() {
  const colors: { [key: string]: string } = {};

  Object.entries(CANVAS_KIT_TOKENS_PENPOT.colors).forEach(([colorName, colorScale]) => {
    Object.entries(colorScale).forEach(([scale, token]) => {
      colors[`${colorName}.${scale}`] = token.value;
    });
  });

  return colors;
}

// Helper function to get all spacing values
export function getCanvasKitSpacing() {
  const spacing: { [key: string]: number } = {};

  Object.entries(CANVAS_KIT_TOKENS_PENPOT.spacing).forEach(([name, token]) => {
    spacing[name] = token.value;
  });

  return spacing;
}