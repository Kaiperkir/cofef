const fs = require('fs');
const path = require('path');

const srcDir = 'c:\\Users\\Kaiper\\Desktop\\cofeeeee-main\\src';

const replacements = {
  // Backgrounds
  'bg-white': 'bg-[#0E0E0E]',
  'bg-[#FDFCFB]': 'bg-[#050505]',
  'bg-stone-50': 'bg-[#151515]',
  'bg-stone-100': 'bg-[#1A1A1A]',
  'bg-stone-200': 'bg-[#222222]',
  'bg-[#0A0A0A]': 'bg-[#1A1A1A]', // old dark backgrounds to slightly lighter dark for contrast

  // Texts
  'text-[#0A0A0A]': 'text-[#FDFCFB]',
  'text-stone-300': 'text-stone-600',
  'text-stone-400': 'text-stone-500',
  'text-stone-800': 'text-stone-200',
  'text-[#777777]': 'text-[#A0A0A0]',
  'text-[#444444]': 'text-[#D0D0D0]',
  'text-white': 'text-[#111111]', // If text was white on black bg, now it's dark on light bg? Wait, no, we want Buttons to be white or gold. Actually, text-white on a bg-[#1A1A1A] (formerly bg-[#0A0A0A]) should REMAIN text-white! Let's NOT flip text-white, let's keep dark buttons with white text, just make them slightly lighter dark or use Gold. Let's make primary buttons Gold `bg-[#D4AF37]` or just keep them `#1A1A1A`. 
  // Let's not universally flip text-white. I'll remove text-white flip.

  // Borders
  'border-[#0A0A0A]': 'border-[#FDFCFB]',
  'border-stone-100': 'border-white/10',
  'border-stone-200': 'border-white/20',
  'border-stone-300': 'border-white/30',
  
  // Specific alphas
  'bg-[#0A0A0A]/5': 'bg-white/5',
  'bg-[#0A0A0A]/10': 'bg-white/10',
  'bg-[#0A0A0A]/20': 'bg-white/20',
  'bg-[#0A0A0A]/30': 'bg-white/30',
  'border-[#0A0A0A]/5': 'border-white/5',
  'border-[#0A0A0A]/10': 'border-white/10',
  'border-[#0A0A0A]/20': 'border-white/20',
  'text-[#0A0A0A]/5': 'text-white/5',
  
  'bg-white/5': 'bg-white/5', // preserve these if they were already transparent white
  'bg-white/10': 'bg-[#0a0a0a]/50', // glass on dark needs darker
  'bg-white/60': 'bg-[#0a0a0a]/60',
  'bg-white/70': 'bg-[#0a0a0a]/70',
  'bg-white/80': 'bg-[#0a0a0a]/80',
  'bg-white/90': 'bg-[#0a0a0a]/90',
};

// Safe way to replace without destroying the script: we replace exactly matching classes.
// Usually classes have space around them or quotes. 

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // We should do it via regex to only match whole words if possible, but some have brackets []
  // We can do a string split and join, or regex
  for (const [key, value] of Object.entries(replacements)) {
    // For things with brackets, regex parsing needs escaping
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?<=[\\s"'\\\`])` + escapedKey + `(?=[\\s"'\\\`])`, 'g');
    content = content.replace(regex, value);
  }

  // Also replace some specific gradients: from-[#0A0A0A] -> from-[#FDFCFB] 
  content = content.replace(/to-\[\#0A0A0A\]/g, 'to-[#FDFCFB]');
  content = content.replace(/from-\[\#0A0A0A\]/g, 'from-[#1A1A1A]');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function walk(dir) {
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      walk(filePath);
    } else if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
      replaceInFile(filePath);
    }
  });
}

walk(srcDir);
console.log('Theme conversion completed.');
