const fs = require('fs');
const filePath = 'C:/Users/Kaiper/.gemini/tmp/craft-coffee/chats/session-2026-03-27T14-08-14474a0b.json';

try {
    const content = fs.readFileSync(filePath, 'utf8');
    // Ищем любые упоминания MONTIS и связанных слов
    const regex = /MONTIS[^\}]*?}/gi;
    const matches = content.match(regex) || [];
    
    console.log('--- FOUND MONTIS BLOCKS ---');
    matches.forEach(m => console.log(m));
    
    // Ищем в текстовых блоках 'content' по кириллице
    const cyrillicRegex = /[А-Яа-я\s]+(Моджиана|Тоффи|Серрадо|Сантос)[А-Яа-я\s]*/g;
    const textMatches = content.match(cyrillicRegex) || [];
    console.log('--- FOUND TEXT MATCHES ---');
    textMatches.forEach(m => console.log(m.trim()));

} catch (e) {
    console.error(e);
}
