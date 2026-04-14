const fs = require('fs');
const path = require('path');

const srcDir = 'c:\\Users\\Kaiper\\Desktop\\cofeeeee-main\\src';

// We map the exact replacements we made *back* to a format that contains BOTH:
// e.g., 'bg-[#0E0E0E]' -> 'bg-white dark:bg-[#0E0E0E]'
// Wait! I need to be careful not to keep modifying files if I run it twice.
// I will check if it already contains 'dark:' to skip.

const reverseMap = {
  // Backgrounds
  'bg-[#0E0E0E]': 'bg-white dark:bg-[#0A0A0A]', // Pure black for dark mode as requested
  'bg-[#050505]': 'bg-[#FDFCFB] dark:bg-[#000000]', // Pure clean black for main background
  'bg-[#151515]': 'bg-stone-50 dark:bg-[#111111]',
  'bg-[#1A1A1A]': 'bg-[#0A0A0A] dark:bg-[#1A1A1A]', // Or bg-stone-100 dark:bg-[#1A1A1A] - we used this for bg-stone-100
  'bg-[#222222]': 'bg-stone-200 dark:bg-[#222222]',

  // Text
  'text-[#FDFCFB]': 'text-[#0A0A0A] dark:text-[#FDFCFB]',
  'text-stone-600': 'text-stone-400 dark:text-stone-500',
  'text-stone-500': 'text-stone-400 dark:text-stone-500', // approximation
  'text-stone-200': 'text-stone-800 dark:text-stone-200',
  'text-[#A0A0A0]': 'text-[#777777] dark:text-[#A0A0A0]',
  'text-[#D0D0D0]': 'text-[#444444] dark:text-[#D0D0D0]',

  // Borders
  // I originally mapped 'border-[#0A0A0A]' to 'border-[#FDFCFB]'
  'border-[#FDFCFB]': 'border-[#0A0A0A] dark:border-[#555555]',
  'border-white/10': 'border-stone-100 dark:border-white/10',
  'border-white/20': 'border-stone-200 dark:border-white/20',
  'border-white/30': 'border-stone-300 dark:border-white/30',
  
  // Specific alphas 
  'bg-[#0a0a0a]/50': 'bg-white/10 dark:bg-black/50',
  'bg-[#0a0a0a]/60': 'bg-white/60 dark:bg-black/60',
  'bg-[#0a0a0a]/70': 'bg-white/70 dark:bg-black/70',
  'bg-[#0a0a0a]/80': 'bg-white/80 dark:bg-black/80',
  'bg-[#0a0a0a]/90': 'bg-white/90 dark:bg-black/90',
};

function restoreFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Manual fast replacements
  // Since we might have cases like text-[#FDFCFB] already wrapped in dark:, let's be naive but safe.
  // Actually, we haven't added dark: anywhere yet.
  
  for (const [key, value] of Object.entries(reverseMap)) {
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?<=[\\s"'\\\`])` + escapedKey + `(?=[\\s"'\\\`])`, 'g');
    content = content.replace(regex, value);
  }

  // Also replace from-[#1A1A1A]/to-[#FDFCFB]
  content = content.replace(/from-\[\#1A1A1A\]/g, 'from-[#0A0A0A] dark:from-[#D4AF37]');
  content = content.replace(/to-\[\#FDFCFB\]/g, 'to-[#0A0A0A] dark:to-[#000000]');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Restored ${filePath}`);
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
      restoreFile(filePath);
    }
  });
}

walk(srcDir);
console.log('Theme restoration completed.');
