#!/usr/bin/env node

// Migration script to fix remaining store usage issues

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storeUsagePatterns = [
  // Common useStore destructuring patterns and their replacements
  {
    pattern: /const { ([^}]+) } = useStore\(\)/g,
    replacement: (match, props) => {
      const propsList = props.split(',').map(p => p.trim());
      const mappings = {
        'user': 'useBeyFlowStore(state => state.user)',
        'messages': 'useBeyFlowStore(state => state.chat.messages)',
        'addMessage': 'useBeyFlowStore(state => state.chat.addMessage)',
        'themePersona': 'useBeyFlowStore(state => state.ui.themePersona)',
        'setThemePersona': 'useBeyFlowStore(state => state.ui.setThemePersona)',
        'spectrum': 'useBeyFlowStore(state => state.ui.spectrum)',
        'setSpectrum': 'useBeyFlowStore(state => state.ui.setSpectrum)',
        'currentModule': 'useBeyFlowStore(state => state.ui.currentModule)',
        'setModule': 'useBeyFlowStore(state => state.ui.setCurrentModule)',
        'audio': 'useBeyFlowStore(state => state.audio)',
        'updateAudio': 'useBeyFlowStore(state => state.audio.update)',
        'ui': 'useBeyFlowStore(state => state.ui)',
        'colorMode': 'useBeyFlowStore(state => state.ui.colorMode)',
        'sceneConfig': 'useBeyFlowStore(state => state.scene.config)',
        'updateSceneConfig': 'useBeyFlowStore(state => state.scene.updateConfig)',
        'webhook': 'useBeyFlowStore(state => state.integrations.webhook)',
        'contacts': 'useBeyFlowStore(state => state.contacts)',
        'analytics': 'useBeyFlowStore(state => state.analytics)',
        'updateAnalytics': 'useBeyFlowStore(state => state.analytics.update)',
        'isLoading': 'useBeyFlowStore(state => state.ui.loading)',
        'setLoading': 'useBeyFlowStore(state => state.ui.setLoading)',
        'setUser': 'useBeyFlowStore(state => state.setUser)',
        'clearMessages': 'useBeyFlowStore(state => state.chat.clearMessages)',
        'updateUI': 'useBeyFlowStore(state => state.ui.update)',
        'setAudioUrl': 'useBeyFlowStore(state => state.audio.setUrl)'
      };
      
      // Create individual const declarations for each property
      return propsList.map(prop => {
        const cleanProp = prop.trim();
        const storeCall = mappings[cleanProp] || `useBeyFlowStore(state => state.${cleanProp})`;
        return `  const ${cleanProp} = ${storeCall}`;
      }).join('\n');
    }
  }
];

function migrateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  storeUsagePatterns.forEach(({ pattern, replacement }) => {
    const oldContent = content;
    content = content.replace(pattern, replacement);
    if (content !== oldContent) {
      console.log(`✅ ${path.basename(filePath)}: Updated store usage patterns`);
      changed = true;
    }
  });
  
  if (changed) {
    fs.writeFileSync(filePath, content);
  }
}

// Find and process files with useStore usage
const srcDir = path.join(__dirname, '../src');

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('useStore()')) {
        try {
          migrateFile(filePath);
        } catch (error) {
          console.log(`❌ Error processing ${file}:`, error.message);
        }
      }
    }
  });
}

console.log('🚀 Starting store migration...\n');
processDirectory(srcDir);
console.log('\n✅ Store migration complete!');