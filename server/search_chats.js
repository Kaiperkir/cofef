const fs = require('fs');
const path = require('path');

const chatsDir = 'C:/Users/Kaiper/.gemini/tmp/craft-coffee/chats';
const files = fs.readdirSync(chatsDir).filter(f => f.endsWith('.json'));

let found = false;

for (const file of files) {
  try {
    const data = fs.readFileSync(path.join(chatsDir, file), 'utf8');
    const parsed = JSON.parse(data);
    
    // We need to recursively search for strings
    function searchStrings(obj, currentPath) {
      if (typeof obj === 'string') {
        if (obj.toLowerCase().includes('тоффи') || obj.toLowerCase().includes('моджиана') || obj.toLowerCase().includes('toffee')) {
           console.log(`\n--- FOUND IN FILE: ${file} ---`);
           console.log(obj.substring(0, 500) + (obj.length > 500 ? '...' : ''));
           found = true;
        }
      } else if (Array.isArray(obj)) {
        obj.forEach((item, index) => searchStrings(item, `${currentPath}[${index}]`));
      } else if (obj && typeof obj === 'object') {
        for (const key in obj) {
          searchStrings(obj[key], `${currentPath}.${key}`);
        }
      }
    }
    
    searchStrings(parsed, '');
  } catch(e) {
    // console.error(e);
  }
}

if (!found) console.log('Ничего не найдено в распарсенных JSON.');
