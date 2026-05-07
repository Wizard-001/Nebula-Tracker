const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'src', 'index.css');

const professionalCss = `@import "tailwindcss";

@theme {
  /* Sleek, neutral dark background (not pure black, no red tint) */
  --color-background: #0A0A0A;
  --color-on-background: #F5F5F5;
  
  /* Surfaces with subtle elevation */
  --color-surface: #121212;
  --color-surface-dim: #0F0F0F;
  --color-surface-bright: #1A1A1A;
  --color-surface-container-lowest: #050505;
  --color-surface-container-low: #111111;
  --color-surface-container: #171717;
  --color-surface-container-high: #202020;
  --color-surface-container-highest: #262626;
  
  /* Text colors */
  --color-on-surface: #E5E5E5;
  --color-on-surface-variant: #A3A3A3;
  --color-inverse-surface: #F5F5F5;
  --color-inverse-on-surface: #0A0A0A;
  
  /* Borders */
  --color-outline: #262626;
  --color-outline-variant: #333333;
  
  /* Professional Multi-color Palette (Warm/Tech Vibe, No Blue) */
  --color-primary: #F97316; /* Vibrant Orange */
  --color-on-primary: #111111;
  --color-primary-container: #C2410C; 
  --color-on-primary-container: #FFFFFF;
  
  --color-secondary: #10B981; /* Emerald Green */
  --color-on-secondary: #111111;
  --color-secondary-container: #047857;
  
  --color-tertiary: #EAB308; /* Amber/Yellow */
  
  --color-error: #EF4444; /* Rose/Red for errors */
  --color-on-error: #FFFFFF;

  --font-sans: "Inter", system-ui, sans-serif;
}

@layer base {
  body {
    background-color: var(--color-background);
    color: var(--color-on-background);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
  }
  
  /* Soft, elegant gradient for headers */
  h1, h2 {
    background-image: linear-gradient(135deg, var(--color-primary) 0%, var(--color-tertiary) 100%);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
  }

  a {
    color: var(--color-primary);
    transition: color 0.3s ease;
  }

  a:hover {
    color: var(--color-tertiary);
  }

  input, select, textarea {
    background-color: var(--color-surface-container) !important;
    border: 1px solid var(--color-outline) !important;
    color: var(--color-on-surface) !important;
    transition: border-color 0.3s ease, box-shadow 0.3s ease !important;
  }

  input:focus, select:focus, textarea:focus {
    outline: none !important;
    border-color: var(--color-primary) !important;
    box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.2) !important; /* Orange glow */
  }
}

@utility glass-panel {
  background-color: color-mix(in srgb, var(--color-surface-container) 85%, transparent);
  backdrop-filter: blur(24px);
  border: 1px solid var(--color-outline);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

@utility glass-card {
  background-color: color-mix(in srgb, var(--color-surface-container-high) 80%, transparent);
  backdrop-filter: blur(12px);
  border: 1px solid var(--color-outline);
}

@utility landing-glass {
  background: color-mix(in srgb, var(--color-surface-container) 80%, transparent);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--color-outline);
}

@utility landing-glass-card {
  background: color-mix(in srgb, var(--color-surface-container-high) 80%, transparent);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid var(--color-outline);
}

@utility text-gradient {
  background-clip: text;
  color: transparent;
  background-image: linear-gradient(135deg, var(--color-primary) 0%, var(--color-tertiary) 100%);
}

@utility btn-primary {
  background-color: var(--color-primary);
  color: var(--color-on-primary);
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--color-primary-container);
    color: var(--color-on-primary-container);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
  }
}

@utility btn-secondary {
  background-color: transparent;
  border: 1px solid var(--color-outline-variant);
  color: var(--color-on-surface);
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--color-surface-container-highest);
    border-color: var(--color-primary);
  }
}

@utility btn-cta {
  background-image: linear-gradient(135deg, var(--color-primary) 0%, var(--color-tertiary) 100%);
  color: #111;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(249, 115, 22, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 6px 20px rgba(249, 115, 22, 0.5);
    transform: translateY(-1px);
  }
}

@utility gradient-divider {
  background-image: linear-gradient(to right, transparent, var(--color-primary), var(--color-secondary), transparent);
  height: 1px;
  border: none;
  opacity: 0.5;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--color-background);
}

::-webkit-scrollbar-thumb {
  background: var(--color-outline-variant);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-on-surface-variant);
}
`;

fs.writeFileSync(cssPath, professionalCss, 'utf8');
console.log('index.css updated to professional multi-color theme.');
