#!/usr/bin/env node

// Quick Component Standardization Script  
// Converts common patterns to use StandardComponents

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const standardizations = [
  // Replace common button patterns
  {
    pattern: /className="[^"]*bg-\w+-\d+[^"]*hover:bg-\w+-\d+[^"]*"/g,
    replacement: 'className="btn-primary"',
    note: 'Standardized button styling'
  },
  
  // Replace common card patterns  
  {
    pattern: /className="[^"]*bg-\w+\/\d+[^"]*rounded-\w+[^"]*backdrop-blur[^"]*"/g,
    replacement: 'className="card-glass"',
    note: 'Standardized card styling'
  },
  
  // Add StandardComponents import where needed
  {
    pattern: /(import.*from ['"][^'"]*['"])/g,
    replacement: (match, imports) => {
      if (match.includes('StandardComponents')) return match;
      if (match.includes('react')) {
        return match + '\nimport { Button, Card, Input, Modal } from "../core/StandardComponents"';
      }
      return match;
    },
    note: 'Added StandardComponents import'
  }
];

function standardizeFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  standardizations.forEach(({ pattern, replacement, note }) => {
    const oldContent = content;
    content = content.replace(pattern, replacement);
    if (content !== oldContent) {
      console.log(`✅ ${path.basename(filePath)}: ${note}`);
      changed = true;
    }
  });
  
  if (changed) {
    fs.writeFileSync(filePath, content);
  }
}

// Find and process component files
const componentsDir = path.join(__dirname, '../src/components');
const files = fs.readdirSync(componentsDir)
  .filter(file => file.endsWith('.jsx') || file.endsWith('.js'))
  .slice(0, 10); // Process first 10 files

console.log('🚀 Starting Component Standardization...\n');

files.forEach(file => {
  const filePath = path.join(componentsDir, file);
  try {
    standardizeFile(filePath);
  } catch (error) {
    console.log(`❌ Error processing ${file}:`, error.message);
  }
});

console.log('\n✅ Component standardization complete!');