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
    } else { 
      if (file.endsWith('.js') || file.endsWith('.jsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(srcDir);

const codeMap = {
  'CS101': 'CSC101', 'CS102': 'CSC102', 'CS103': 'CSC103',
  'CS201': 'CSC201', 'CS202': 'CSC202', 'CS203': 'CSC203',
  'CS301': 'CSC301', 'CS302': 'CSC302', 'CS303': 'CSC303',
  'CS401': 'CSC401', 'CS402': 'CSC402', 'CS403': 'CSC403',
  'CS404E': 'CSC404', 'CS405E': 'CSC405', 'CS406E': 'CSC406',
  'CS404': 'CSC404', 'CS405': 'CSC405', 'CS406': 'CSC406'
};

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let changed = false;
  
  if (content.includes('CompScience')) {
    content = content.replace(/CompScience University/g, 'MRCA University');
    content = content.replace(/compscience\.edu/g, 'mrca.edu');
    content = content.replace(/CompScience/g, 'MRCA');
    changed = true;
  }
  
  for (const [oldCode, newCode] of Object.entries(codeMap)) {
    if (content.includes(oldCode)) {
      const regex = new RegExp(`\\b${oldCode}\\b`, 'g');
      content = content.replace(regex, newCode);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(f, content, 'utf8');
    console.log(`Updated ${f}`);
  }
});
