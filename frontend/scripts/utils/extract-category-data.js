const fs = require('fs');
const path = require('path');

if (process.argv.length < 3) {
  console.error('Usage: node extract-category-data.js <path-to-home.html>');
  process.exit(1);
}

const filePath = path.resolve(process.argv[2]);
const content = fs.readFileSync(filePath, 'utf8');

function decodeHtml(str = '') {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

let routes = {};
const routesMatch = content.match(/const\s+routes\s*=\s*\{([\s\S]*?)\};/);
if (routesMatch) {
  const literal = `{${routesMatch[1]}}`;
  try {
    // eslint-disable-next-line no-new-func
    routes = Function(`"use strict"; return (${literal});`)();
  } catch (error) {
    console.error('Failed to parse routes object:', error.message);
  }
}

const cards = [];
const cardRegex = /<div class="[^"]*?-card[^"]*"[^>]*data-[^=]+="([^"]+)"[\s\S]*?<div class="[^"]*icon">([\s\S]*?)<\/div>[\s\S]*?<div class="[^"]*name">([\s\S]*?)<\/div>[\s\S]*?<div class="[^"]*desc">([\s\S]*?)<\/div>/gi;

let match;
while ((match = cardRegex.exec(content)) !== null) {
  const key = match[1].trim();
  const emoji = decodeHtml(match[2].trim());
  const label = decodeHtml(match[3].trim());
  const description = decodeHtml(match[4].trim());
  cards.push({ key, emoji, label, description, route: routes[key] || '' });
}

console.log(JSON.stringify(cards, null, 2));
