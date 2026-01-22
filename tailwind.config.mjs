/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Lakeside Warmth Color Palette - Cozy & Inviting
        'warm-cream': '#FBF8F4',      // Warm background
        'honey-oak': '#C4956A',        // Primary CTA - warm gold
        'honey-oak-dark': '#A67D52',   // Hover state
        'cabin-brown': '#8B7355',      // Secondary accent
        'forest-sage': '#5D7566',      // Primary brand - earthy green
        'forest-sage-dark': '#4A5F53', // Hover state
        'lake-mist': '#A8B5B0',        // Soft accent
        'hearth-ember': '#B85C38',     // Warm highlight accent
        'pine-dark': '#3D4F47',        // Dark text/headers
        'driftwood': '#B5A99A',        // Neutral accent
        'seashell': '#F5F0E8',         // Card backgrounds - warmer
        'linen': '#EDE8E0',            // Alternate section bg

        // Legacy aliases (for gradual migration)
        'coastal-fog': '#FBF8F4',
        'deep-ocean': '#5D7566',       // Now maps to forest-sage
        'golden-hour': '#C4956A',      // Now maps to honey-oak
        'charcoal': '#3D4F47',         // Now maps to pine-dark

        // Semantic aliases
        primary: '#C4956A',            // honey-oak for CTAs
        'primary-dark': '#A67D52',     // hover state
        secondary: '#5D7566',          // forest-sage
        'secondary-dark': '#4A5F53',   // hover state
        background: '#FBF8F4',         // warm-cream
        card: '#F5F0E8',               // seashell
      },
      fontFamily: {
        sans: ['Source Sans 3', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'serif'],
        display: ['Lora', 'Georgia', 'serif'],
      },
      borderRadius: {
        'cozy-sm': '8px',
        'cozy': '12px',
        'cozy-lg': '20px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem',
        '42': '10.5rem',
        '50': '12.5rem',
        '60': '15rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
