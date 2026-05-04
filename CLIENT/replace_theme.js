import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directoryPath = path.join(__dirname, 'src');

function findAndReplaceInFiles(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      findAndReplaceInFiles(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      let newContent = content
        .replace(/amber-800/g, 'indigo-600 dark:text-indigo-400')
        .replace(/bg-amber-800/g, 'bg-indigo-600 dark:bg-indigo-500')
        .replace(/amber-700/g, 'indigo-700 dark:text-indigo-500')
        .replace(/bg-amber-700/g, 'bg-indigo-700 dark:bg-indigo-600')
        .replace(/amber-600/g, 'indigo-500 dark:text-indigo-300')
        .replace(/bg-amber-600/g, 'bg-indigo-500 dark:bg-indigo-400')
        .replace(/amber-300/g, 'indigo-300 dark:border-indigo-500')
        .replace(/amber-200/g, 'indigo-200 dark:border-indigo-600')
        .replace(/bg-amber-200/g, 'bg-indigo-100 dark:bg-slate-800')
        .replace(/amber-100/g, 'indigo-100 dark:bg-slate-800')
        .replace(/bg-amber-100/g, 'bg-indigo-50 dark:bg-slate-800')
        .replace(/amber-50/g, 'slate-50 dark:bg-slate-800 dark:text-slate-200')
        .replace(/bg-amber-50/g, 'bg-slate-50 dark:bg-slate-800')
        // Special manual colors
        .replace(/rgb\(255, 241, 173\)/g, '#f8fafc') // light slate
        .replace(/\[rgb\(255,241,173\)\]/g, 'slate-50')
        .replace(/text-slate-50 dark:text-slate-200/g, 'text-slate-800 dark:text-slate-200'); // cleanup
        
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

findAndReplaceInFiles(directoryPath);
