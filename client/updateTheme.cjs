const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'src', 'index.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');

// Update theme variables
cssContent = cssContent.replace(/--color-background: #050505;/g, '--color-background: #000000;');
cssContent = cssContent.replace(/--color-surface: #050505;/g, '--color-surface: #000000;');
cssContent = cssContent.replace(/--color-surface-dim: #050505;/g, '--color-surface-dim: #000000;');
cssContent = cssContent.replace(/--color-surface-bright: #1A1A1A;/g, '--color-surface-bright: #150000;');
cssContent = cssContent.replace(/--color-surface-container-lowest: #0a0a0a;/g, '--color-surface-container-lowest: #050000;');
cssContent = cssContent.replace(/--color-surface-container-low: #111111;/g, '--color-surface-container-low: #100000;');
cssContent = cssContent.replace(/--color-surface-container: #1A1A1A;/g, '--color-surface-container: #1a0505;');
cssContent = cssContent.replace(/--color-surface-container-high: #222222;/g, '--color-surface-container-high: #250505;');
cssContent = cssContent.replace(/--color-surface-container-highest: #2A2A2A;/g, '--color-surface-container-highest: #300505;');

// Update primary/secondary colors to intense red
cssContent = cssContent.replace(/--color-primary: #E64A19;/g, '--color-primary: #ff3333;');
cssContent = cssContent.replace(/--color-primary-container: #B71C1C;/g, '--color-primary-container: #aa0000;');
cssContent = cssContent.replace(/--color-secondary: #D32F2F;/g, '--color-secondary: #ef4444;');
cssContent = cssContent.replace(/--color-tertiary: #FF5722;/g, '--color-tertiary: #ff4500;');

// Make gradients more intense
cssContent = cssContent.replace(/linear-gradient\(45deg, var\(--color-secondary\), var\(--color-tertiary\)\)/g, 'linear-gradient(135deg, #ff4500 0%, #aa0000 100%)');

// Update glows
cssContent = cssContent.replace(/rgba\(211, 47, 47, 0\.2\)/g, 'rgba(255, 51, 51, 0.4)');
cssContent = cssContent.replace(/rgba\(211, 47, 47, 0\.1\)/g, 'rgba(255, 51, 51, 0.1)');
cssContent = cssContent.replace(/rgba\(211, 47, 47, 0\.5\)/g, 'rgba(255, 51, 51, 0.5)');
cssContent = cssContent.replace(/rgba\(230, 74, 25, 0\.4\)/g, 'rgba(255, 51, 51, 0.4)');
cssContent = cssContent.replace(/rgba\(230, 74, 25, 0\.6\)/g, 'rgba(255, 51, 51, 0.6)');

fs.writeFileSync(cssPath, cssContent, 'utf8');
console.log('index.css updated to intense red theme.');
