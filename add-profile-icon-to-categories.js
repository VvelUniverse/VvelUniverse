const fs = require('fs');
const path = require('path');

// Function to find all HTML files in Category/Sub-Category
function findCategoryFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findCategoryFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Function to add profile-icon.js script
function addProfileIconScript(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Check if profile-icon.js is already included
  if (content.includes('profile-icon.js')) {
    return false;
  }
  
  // Find the closing body tag or last script tag
  // Try to add before closing body tag
  if (content.includes('</body>')) {
    // Check if there's already a script section before </body>
    const bodyEndIndex = content.lastIndexOf('</body>');
    const beforeBody = content.substring(0, bodyEndIndex);
    
    // Add the script before </body>
    const scriptTag = '\n  <script src="/profile-icon.js"></script>\n';
    
    // Check if there are other scripts before </body>
    if (beforeBody.includes('</script>')) {
      // Add after the last script tag
      const lastScriptIndex = beforeBody.lastIndexOf('</script>');
      const insertIndex = lastScriptIndex + '</script>'.length;
      content = content.slice(0, insertIndex) + scriptTag + content.slice(insertIndex);
    } else {
      // Add directly before </body>
      content = content.slice(0, bodyEndIndex) + scriptTag + content.slice(bodyEndIndex);
    }
    
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Added: ${filePath}`);
    return true;
  }
  
  return false;
}

// Main execution
const categoryDir = path.join(__dirname, 'Category', 'Sub-Category');
console.log('Adding profile-icon.js to category pages...\n');

const htmlFiles = findCategoryFiles(categoryDir);
let fixedCount = 0;

for (const file of htmlFiles) {
  if (addProfileIconScript(file)) {
    fixedCount++;
  }
}

console.log(`\n✅ Added profile-icon.js to ${fixedCount} files out of ${htmlFiles.length} total files.`);

