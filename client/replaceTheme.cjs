const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(srcDir);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Hardcoded replacements
  content = content.replace(/bg-\[#050510\]/g, 'bg-background');
  content = content.replace(/text-white\/40/g, 'text-on-surface-variant');
  content = content.replace(/text-white\/50/g, 'text-on-surface-variant');
  content = content.replace(/border-white\/5/g, 'border-outline');
  content = content.replace(/border-white\/10/g, 'border-outline');
  content = content.replace(/border-white\/20/g, 'border-outline-variant');

  // Regex replacements for colors
  const replaceColor = (colorName, variableName) => {
    const regex = new RegExp(`(from|via|to|bg|text|border|shadow|ring|fill|stroke)-${colorName}-[0-9]{3}(/[0-9]+)?`, 'g');
    content = content.replace(regex, `$1-${variableName}$2`);
  };

  replaceColor('purple', 'primary');
  replaceColor('blue', 'secondary');
  replaceColor('cyan', 'tertiary');
  replaceColor('emerald', 'primary'); // Kanban, SpatialHub used emerald, let's map to primary
  replaceColor('rose', 'secondary'); // Map rose to secondary
  replaceColor('indigo', 'secondary');
  replaceColor('teal', 'tertiary');
  replaceColor('orange', 'primary'); // Keep orange as primary

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Processed ${file}`);
});
