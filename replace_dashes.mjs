import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, 'src');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.js') || file.endsWith('.jsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(srcDir);

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let changed = false;
  
  // Replace spaced em-dash
  if (content.includes(' — ')) {
    content = content.replace(/ — /g, ', ');
    changed = true;
  }
  
  // Replace unspaced em-dash
  if (content.includes('—')) {
    content = content.replace(/—/g, ', ');
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(f, content, 'utf8');
    console.log(`Updated dashes in ${f}`);
  }
});
