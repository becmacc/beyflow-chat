# 🍌 Banana Flow - Lightweight Automation System

## Overview
The **Banana Flow** is a lightweight, parallel automation system designed for BeyFlow Chat. It handles background processes, event orchestration, and automated workflows without impacting the main chat experience.

## 🎯 Purpose
- **Background Orchestration**: Handle non-blocking automation flows
- **Event Processing**: React to user interactions and system events
- **API Integration**: Connect with external services (Gmail, Gemini, Make.com)
- **Image Generation Prep**: Prepare data for AI image generation workflows

## 📁 File Structure
```
src/automation/
├── BananaFlowIntegration.jsx    # React integration hooks
├── nanoAgent.js                 # Core Banana Agent class  
├── event_router.js              # Event routing and mapping
├── batch_sequences.json         # Flow configurations
├── nano_manifest.txt           # System documentation
└── sequence_directives.txt      # Usage guidelines
```

## 🚀 Available Flows

### 1. **ChatToGmailSync**
- **Trigger**: `chat_message`
- **Actions**: Format email → Send to Gmail → Log to sheet
- **Use Case**: Archive important chat conversations

### 2. **VoiceFeedbackLoop**
- **Trigger**: `audio_played`  
- **Actions**: Capture sentiment → Update UI → Adjust gradient
- **Use Case**: Enhance dopaminergic experience based on audio

### 3. **GeminiAssist**
- **Trigger**: `ai_prompt`
- **Actions**: Send to Gemini → Receive summary → Update dashboard
- **Use Case**: AI-powered content analysis and generation

### 4. **BrandAssetReaction**
- **Trigger**: `brand_interaction`
- **Actions**: Capture sentiment → Adjust gradient → Update UI
- **Use Case**: React to brand asset interactions

### 5. **SessionAnalytics**
- **Trigger**: `session_event`
- **Actions**: Log to sheet → Update dashboard
- **Use Case**: Track user behavior and session metrics

### 6. **ImageGenerationPrep** ⭐
- **Trigger**: `image_request`
- **Actions**: Format email → Send to Gemini → Update dashboard
- **Use Case**: **Prepare data for AI image generation**

## 🔧 Integration

### React Hooks
```jsx
import { useBananaFlow, useBananaFlowTrigger } from './automation/BananaFlowIntegration'

// Full integration with stats
const { isActive, stats, triggerFlow, triggerImageGeneration } = useBananaFlow()

// Simple trigger hook
const { triggerImageGeneration } = useBananaFlowTrigger()
```

### Manual Flow Triggers
```jsx
// Trigger image generation flow
await triggerImageGeneration("sunset over mountains", {
  style: "photorealistic",
  resolution: "1024x1024"
})

// Trigger custom flow
await triggerFlow('brand_interaction', {
  assetType: 'beymedia-logo',
  interaction: 'hover'
})
```

## 🖼️ Image Generation Ready

The **ImageGenerationPrep** flow is specifically designed to handle image generation workflows:

1. **Captures**: User prompts, style preferences, metadata
2. **Formats**: Data into structured format for AI services
3. **Routes**: To appropriate AI image generation service
4. **Logs**: Generation requests for analytics

### Usage Example
```jsx
const handleImageRequest = async () => {
  const result = await triggerImageGeneration(
    "BeyMedia logo integrated into futuristic chat interface", 
    {
      style: "corporate-modern",
      includeElements: ["logo", "chat-bubbles", "gradient"],
      aspectRatio: "16:9"
    }
  )
  
  if (result.success) {
    console.log('Image generation flow started:', result.sequenceId)
  }
}
```

## 📊 Monitoring

### Status Indicator
The `BananaFlowStatus` component shows:
- ✅ Active status indicator
- 📊 Total flows executed
- ⚡ Currently active sequences

### Stats Available
```jsx
const stats = {
  sequencesRun: 42,        // Total flows executed
  errors: 0,               // Error count
  averageTime: 350,        // Average execution time (ms)
  activeSequences: 2,      // Currently running
  isRunning: true          // Agent status
}
```

## ⚙️ Configuration

### Flow Settings (batch_sequences.json)
```json
{
  "name": "ImageGenerationPrep",
  "trigger": "image_request",
  "actions": ["format_email", "send_to_gemini", "update_dashboard"],
  "priority": "medium",
  "delay": 400,
  "enabled": true
}
```

### Global Settings
- **maxConcurrentSequences**: 5
- **defaultDelay**: 250ms between actions
- **logLevel**: info
- **enableStats**: true

## 🎨 Brand Integration

Banana Flow automatically reacts to brand asset interactions:
- **BeyMedia logo clicks** → Dopamine gradient shifts
- **Pattern hovering** → UI state updates
- **Voice interactions** → Audio-reactive animations

## 🔄 Auto-Triggers

The system automatically triggers flows based on:
- ✅ **New chat messages** → ChatToGmailSync
- ✅ **Audio playback** → VoiceFeedbackLoop  
- ✅ **UI interactions** → SessionAnalytics
- ✅ **Brand interactions** → BrandAssetReaction

## 🚀 Status

**✅ FULLY INTEGRATED** - The Banana Flow system is now active in your BeyFlow Chat application, ready to handle image generation requests and all other automation workflows!

The system runs silently in the background, enhancing the user experience while preparing your app for seamless AI image generation integration.