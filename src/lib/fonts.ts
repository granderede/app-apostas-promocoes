/**
 * 🎨 Font Configuration for Lasy AI Templates
 * 
 * Font families ready to use with Tailwind CSS.
 * No external imports needed - using system fonts for optimal performance.
 */

/**
 * Font family configurations for easy use
 */
export const fontFamilies = {
  // Sans-serif fonts
  inter: 'ui-sans-serif, system-ui, sans-serif',
  roboto: 'ui-sans-serif, system-ui, sans-serif',
  openSans: 'ui-sans-serif, system-ui, sans-serif',
  
  // Monospace fonts
  sourceCode: 'ui-monospace, SFMono-Regular, monospace',
  firaCode: 'ui-monospace, SFMono-Regular, monospace',
  jetbrains: 'ui-monospace, SFMono-Regular, monospace',
} as const

/**
 * CSS custom properties for fonts (use in globals.css)
 */
export const fontCSSVars = `
  --font-inter: ${fontFamilies.inter};
  --font-roboto: ${fontFamilies.roboto};
  --font-open-sans: ${fontFamilies.openSans};
  --font-source-code: ${fontFamilies.sourceCode};
  --font-fira-code: ${fontFamilies.firaCode};
  --font-jetbrains: ${fontFamilies.jetbrains};
`

/**
 * Tailwind CSS font family configuration
 * Add this to your tailwind.config.js
 */
export const tailwindFontConfig = {
  fontFamily: {
    'inter': ['var(--font-inter)'],
    'roboto': ['var(--font-roboto)'],
    'open-sans': ['var(--font-open-sans)'],
    'source-code': ['var(--font-source-code)'],
    'fira-code': ['var(--font-fira-code)'],
    'jetbrains': ['var(--font-jetbrains)'],
  }
}

/**
 * Usage Examples:
 * 
 * 1. In CSS/Tailwind:
 *    className="font-inter"
 *    className="font-fira-code"
 * 
 * 2. In styled-components:
 *    font-family: ${fontFamilies.inter};
 * 
 * 3. In component styles:
 *    style={{ fontFamily: fontFamilies.firaCode }}
 */
