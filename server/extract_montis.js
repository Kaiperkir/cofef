const fs = require('fs');
const path = require('path');

try {
    const filePath = path.join(__dirname, '..', 'чай.json');
    const data = fs.readFileSync(filePath, 'utf8');
    
    // Ищем все вхождения MONTIS с последующим описанием
    const entries = [];
    const regex = /Название лота:\s*([^\n\r]+)[\s\S]*?Бренд \/ Производитель:\s*MONTIS[\s\S]*?Букет вкуса:\s*([^\n\r]+)/gi;
    
    let match;
    while ((match = regex.exec(data)) !== null) {
        entries.push({
            name: match[1].trim(),
            notes: match[2].trim()
        });
    }
    
    console.log(`Найдено ${entries.length} сортов MONTIS`);
    fs.writeFileSync(path.join(__dirname, 'montis_extracted.json'), JSON.stringify(entries, null, 2));
    
} catch (e) {
    console.error(e);
}
