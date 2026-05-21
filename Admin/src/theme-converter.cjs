const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'Pages');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

const replacements = [
  // 1. Text colors
  { from: /text-white/g, to: 'text-slate-900' },
  { from: /text-gray-100/g, to: 'text-slate-800' },
  { from: /text-gray-200/g, to: 'text-slate-700' },
  { from: /text-gray-300/g, to: 'text-slate-600' },
  { from: /text-gray-400/g, to: 'text-slate-500' },
  { from: /text-gray-500/g, to: 'text-slate-500' },
  
  // 2. Backgrounds
  { from: /bg-black\/[0-9]+/g, to: 'bg-white/80' },
  { from: /bg-white\/5/g, to: 'bg-white/90' },
  { from: /bg-white\/10/g, to: 'bg-white' },
  { from: /bg-white\/20/g, to: 'bg-slate-50' },
  { from: /hover:bg-white\/5/g, to: 'hover:bg-slate-50' },
  { from: /hover:bg-white\/10/g, to: 'hover:bg-slate-100' },
  { from: /hover:bg-white\/20/g, to: 'hover:bg-slate-200' },
  { from: /bg-gray-800/g, to: 'bg-white' },
  { from: /bg-gray-900/g, to: 'bg-slate-50' },
  
  // 3. Borders
  { from: /border-white\/5/g, to: 'border-slate-100' },
  { from: /border-white\/10/g, to: 'border-slate-200' },
  { from: /border-white\/20/g, to: 'border-slate-300' },
  { from: /hover:border-white\/20/g, to: 'hover:border-slate-300' },
  
  // 4. Specific dark theme hex codes
  { from: /bg-\[\#030712\]/g, to: 'bg-slate-50' },
  
  // 5. Fixes for primary buttons to keep white text
  { from: /bg-indigo-600([^"']*)text-slate-900/g, to: 'bg-indigo-600$1text-white' },
  { from: /bg-indigo-500([^"']*)text-slate-900/g, to: 'bg-indigo-500$1text-white' },
  { from: /bg-blue-600([^"']*)text-slate-900/g, to: 'bg-blue-600$1text-white' },
  { from: /bg-gradient-to-br([^"']*)text-slate-900/g, to: 'bg-gradient-to-br$1text-white' }
];

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  for (const { from, to } of replacements) {
    content = content.replace(from, to);
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
}
