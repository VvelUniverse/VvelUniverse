const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'Category', 'Sub-Category');

function getHtmlFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getHtmlFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

function removeKeyframes(content) {
  const pattern = /@keyframes\s+hype[\w-]*/g;
  let match;
  while ((match = pattern.exec(content)) !== null) {
    const start = match.index;
    const braceStart = content.indexOf('{', start);
    if (braceStart === -1) break;
    let depth = 0;
    let end = braceStart;
    for (let i = braceStart; i < content.length; i++) {
      const char = content[i];
      if (char === '{') {
        depth++;
      } else if (char === '}') {
        depth--;
        if (depth === 0) {
          end = i + 1;
          break;
        }
      }
    }
    content = content.slice(0, start) + content.slice(end);
    pattern.lastIndex = 0;
  }
  return content;
}

const htmlFiles = getHtmlFiles(targetDir);
const buttonRegex = /\s*<button[^>]*hypePost[^>]*>[\s\S]*?<\/button>\s*/gi;
const countDivRegex = /\s*<div[^>]*class="[^"]*hype-count-display[^"]*"[\s\S]*?<\/div>\s*/gi;
const cssSelectorRegex = /^[ \t]*\.[^\n\{]*hype[^\n\{]*\{[\s\S]*?\}\s*/gm;

let updatedFiles = 0;

for (const file of htmlFiles) {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;

  content = content.replace(buttonRegex, '');
  content = content.replace(countDivRegex, '');
  content = content.replace(cssSelectorRegex, '');
  content = removeKeyframes(content);

  content = content.replace(/\n{3,}/g, '\n\n');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    updatedFiles++;
    console.log(` Cleaned hype elements from ${file}`);
  }
}

console.log(`\nCompleted. Updated ${updatedFiles} files.`);
