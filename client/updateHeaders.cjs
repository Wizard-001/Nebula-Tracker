const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'src');

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

const files = walk(baseDir);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Change specific Dashboard headers to text-gradient to match fraud-detection-ui
  content = content.replace(/text-white(.*?>Dashboard<\/h1>)/g, 'text-gradient$1');
  content = content.replace(/text-white(.*?>Applications<\/h1>)/g, 'text-gradient$1');
  content = content.replace(/text-white(.*?>AI Analyzer<\/h1>)/g, 'text-gradient$1');
  content = content.replace(/text-white(.*?>Mock Interview<\/h1>)/g, 'text-gradient$1');
  content = content.replace(/text-white(.*?>Add Application<\/h2>)/g, 'text-gradient$1');
  content = content.replace(/text-white(.*?>Edit Application<\/h2>)/g, 'text-gradient$1');

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Processed ${file}`);
});
