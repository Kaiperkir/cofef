const fs = require('fs');
const filePath = 'C:/Users/Kaiper/.gemini/tmp/craft-coffee/chats/session-2026-03-27T14-08-14474a0b.json';

try {
    const content = fs.readFileSync(filePath, 'utf8');
    // Ищем все упоминания товаров в JSON структуре (включая те, что в строках 'content')
    const regex = /"name":\s*"([^"]+)",\s*"brand":\s*"([^"]+)"/g;
    let match;
    const found = new Set();
    while ((match = regex.exec(content)) !== null) {
        found.add(`${match[2]} - ${match[1]}`);
    }
    
    // Также ищем в текстовых блоках 'content'
    const textRegex = /Название лота:\s*([^\n\r]+)[\s\S]*?Бренд \/ Производитель:\s*([^\n\r]+)/g;
    while ((match = textRegex.exec(content)) !== null) {
        found.add(`${match[2].trim()} - ${match[1].trim()}`);
    }

    console.log('--- НАЙДЕНО ТОВАРОВ В СЕССИИ ---');
    found.forEach(item => console.log(item));
} catch (e) {
    console.error(e);
}
