#!/usr/bin/env tsx

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

interface TailwindMatch {
  file: string;
  line: number;
  column: number;
  matchedClass: string;
  category: string;
  context: string;
}

interface Summary {
  totalFiles: number;
  filesWithTailwind: number;
  totalMatches: number;
  categoryCounts: Record<string, number>;
  fileCounts: Record<string, number>;
  topClasses: Record<string, number>;
}

const TAILWIND_PATTERNS = {
  layout: /\b(flex|grid|block|inline|hidden|visible|container|space-[xy]-\d+|divide-[xy](-\d+)?)\b/g,
  spacing: /\b([pm][xy]?-\d+(\.\d+)?|gap-\d+(\.\d+)?|space-[xy]-\d+(\.\d+)?)\b/g,
  sizing: /\b([wh]-(\d+(\.\d+)?|full|screen|auto|fit|max|min)|max-[wh]-\w+|min-[wh]-\w+)\b/g,
  typography: /\b(text-(\w+|\d+xl?|xs|sm|lg)|font-\w+|leading-\w+|tracking-\w+|whitespace-\w+)\b/g,
  colors: /\b(bg-\w+(-\d+)?|text-\w+(-\d+)?|border-\w+(-\d+)?)\b/g,
  borders: /\b(border(-[lrtbxy])?(-\d+)?|rounded(-\w+)?|ring(-\d+)?|outline-\w+)\b/g,
  effects: /\b(shadow(-\w+)?|opacity-\d+|blur(-\w+)?|brightness-\d+|contrast-\d+)\b/g,
  positioning: /\b(relative|absolute|fixed|sticky|static|top-\d+|right-\d+|bottom-\d+|left-\d+|z-\d+)\b/g,
  flexbox: /\b(items-\w+|justify-\w+|content-\w+|self-\w+|flex-\w+|order-\d+|grow|shrink)\b/g,
  grid: /\b(grid-cols-\d+|grid-rows-\d+|col-span-\d+|row-span-\d+|col-start-\d+|row-start-\d+)\b/g,
  responsive: /\b(sm:|md:|lg:|xl:|2xl:)\S*/g,
  transitions: /\b(transition(-\w+)?|duration-\d+|ease-\w+|delay-\d+|animate-\w+)\b/g,
  transforms: /\b(transform|translate-[xy]-\d+|rotate-\d+|scale-\d+|skew-[xy]-\d+)\b/g,
  overflow: /\b(overflow-\w+|truncate|text-ellipsis|whitespace-\w+)\b/g,
  cursor: /\b(cursor-\w+|pointer-events-\w+|select-\w+)\b/g
};

function getAllFiles(dir: string, extensions: string[]): string[] {
  const files: string[] = [];

  function walk(currentDir: string) {
    const items = readdirSync(currentDir);

    for (const item of items) {
      const fullPath = join(currentDir, item);
      const stat = statSync(fullPath);

      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        walk(fullPath);
      } else if (stat.isFile() && extensions.includes(extname(item))) {
        files.push(fullPath);
      }
    }
  }

  walk(dir);
  return files;
}

function categorizeClass(className: string): string {
  for (const [category, pattern] of Object.entries(TAILWIND_PATTERNS)) {
    pattern.lastIndex = 0; // Reset regex state
    if (pattern.test(className)) {
      return category;
    }
  }
  return 'other';
}

function scanFile(filePath: string): TailwindMatch[] {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const matches: TailwindMatch[] = [];

  // Match className prop with various quote styles
  const classNameRegex = /className\s*=\s*["'`]([^"'`]*?)["'`]/g;
  const templateLiteralRegex = /className\s*=\s*`([^`]*?)`/g;
  const dynamicClassRegex = /className\s*=\s*\{[^}]*?["'`]([^"'`]*?)["'`][^}]*?\}/g;

  const allRegexes = [classNameRegex, templateLiteralRegex, dynamicClassRegex];

  lines.forEach((line, lineIndex) => {
    allRegexes.forEach(regex => {
      regex.lastIndex = 0; // Reset regex state
      let match;

      while ((match = regex.exec(line)) !== null) {
        const classString = match[1];
        if (!classString) continue;

        // Split class string and check each class
        const classes = classString.split(/\s+/).filter(cls => cls.length > 0);

        classes.forEach(cls => {
          // Check if this looks like a Tailwind class
          if (categorizeClass(cls) !== 'other' || cls.includes('-') || cls.includes(':')) {
            matches.push({
              file: filePath.replace(process.cwd() + '/', ''),
              line: lineIndex + 1,
              column: match.index! + 1,
              matchedClass: cls,
              category: categorizeClass(cls),
              context: line.trim()
            });
          }
        });
      }
    });
  });

  return matches;
}

function generateSummary(matches: TailwindMatch[], totalFiles: number): Summary {
  const filesWithTailwind = new Set(matches.map(m => m.file)).size;
  const categoryCounts: Record<string, number> = {};
  const fileCounts: Record<string, number> = {};
  const topClasses: Record<string, number> = {};

  matches.forEach(match => {
    categoryCounts[match.category] = (categoryCounts[match.category] || 0) + 1;
    fileCounts[match.file] = (fileCounts[match.file] || 0) + 1;
    topClasses[match.matchedClass] = (topClasses[match.matchedClass] || 0) + 1;
  });

  return {
    totalFiles,
    filesWithTailwind,
    totalMatches: matches.length,
    categoryCounts,
    fileCounts,
    topClasses
  };
}

function generateCSV(matches: TailwindMatch[]): string {
  const headers = ['file', 'line', 'column', 'class', 'category', 'context'];
  const rows = matches.map(match => [
    match.file,
    match.line.toString(),
    match.column.toString(),
    match.matchedClass,
    match.category,
    `"${match.context.replace(/"/g, '""')}"`
  ]);

  return [headers, ...rows].map(row => row.join(',')).join('\n');
}

function generateMarkdownSummary(summary: Summary, matches: TailwindMatch[]): string {
  const sortedCategories = Object.entries(summary.categoryCounts)
    .sort(([,a], [,b]) => b - a);

  const sortedFiles = Object.entries(summary.fileCounts)
    .sort(([,a], [,b]) => b - a);

  const sortedClasses = Object.entries(summary.topClasses)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 20);

  return `# Tailwind CSS Audit Summary

## Overview
- **Total files scanned:** ${summary.totalFiles}
- **Files with Tailwind classes:** ${summary.filesWithTailwind}
- **Total Tailwind class instances:** ${summary.totalMatches}
- **Coverage:** ${((summary.filesWithTailwind / summary.totalFiles) * 100).toFixed(1)}%

## Usage by Category
${sortedCategories.map(([cat, count]) => `- **${cat}:** ${count} instances`).join('\n')}

## Files with Most Usage (Priority for refactoring)
${sortedFiles.slice(0, 10).map(([file, count]) => `- \`${file}\`: ${count} instances`).join('\n')}

## Most Common Classes
${sortedClasses.map(([cls, count]) => `- \`${cls}\`: ${count} uses`).join('\n')}

## Recommended Removal Strategy
1. **High Priority:** ${sortedFiles.slice(0, 3).map(([file]) => `\`${file}\``).join(', ')}
2. **Medium Priority:** ${sortedFiles.slice(3, 6).map(([file]) => `\`${file}\``).join(', ')}
3. **Low Priority:** Remaining files with minimal usage

## Next Steps
- Start with high-priority files that have the most Tailwind usage
- Focus on converting layout and spacing utilities first (${summary.categoryCounts.layout + summary.categoryCounts.spacing} instances)
- Consider creating CSS modules or styled-components for frequently used patterns
`;
}

async function main() {
  console.log('🔍 Starting Tailwind CSS audit...');

  const srcDir = join(process.cwd(), 'src');
  const extensions = ['.tsx', '.jsx', '.ts', '.js'];

  const files = getAllFiles(srcDir, extensions);
  console.log(`📁 Found ${files.length} source files`);

  const allMatches: TailwindMatch[] = [];

  for (const file of files) {
    const matches = scanFile(file);
    allMatches.push(...matches);
    if (matches.length > 0) {
      console.log(`  ✓ ${file.replace(process.cwd() + '/', '')}: ${matches.length} Tailwind classes`);
    }
  }

  const summary = generateSummary(allMatches, files.length);

  // Write JSON report
  const jsonReport = {
    summary,
    matches: allMatches,
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  };

  writeFileSync('audit/tailwind-usage.json', JSON.stringify(jsonReport, null, 2));
  console.log('📄 Generated audit/tailwind-usage.json');

  // Write CSV export
  writeFileSync('audit/tailwind-usage.csv', generateCSV(allMatches));
  console.log('📊 Generated audit/tailwind-usage.csv');

  // Write summary markdown
  writeFileSync('audit/summary.md', generateMarkdownSummary(summary, allMatches));
  console.log('📋 Generated audit/summary.md');

  console.log('\n🎯 Audit Summary:');
  console.log(`   ${summary.totalMatches} Tailwind classes found across ${summary.filesWithTailwind} files`);
  console.log(`   Top categories: ${Object.entries(summary.categoryCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([cat, count]) => `${cat} (${count})`)
    .join(', ')}`);

  console.log('\n✅ Audit complete!');
}

// Run if this is the main module
main().catch(console.error);