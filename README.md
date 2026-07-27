# 🛠️ Multitool AI Agent (v1.1.0)

[![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)](https://github.com/drkkahraman/multitool)
[![Platform](https://img.shields.io/badge/platform-Android%20%7C%20Web-green.svg)](https://capacitorjs.com)
[![Framework](https://img.shields.io/badge/framework-React%2019%20%7C%20Vite%20%7C%20Capacitor-orange.svg)](https://vitejs.dev)
[![License](https://img.shields.io/badge/license-MIT-purple.svg)](LICENSE)

**Multitool AI Agent** is an intelligent mobile assistant featuring autonomous self-coding, live Node.js server execution, automated agenda and task management, automated GitHub releases update detection, modular setup wizard, gallery JPEG note exports, and self-compiling Android APK capabilities directly on-device.

---

## ✨ Key Features

### 🚀 1. Automated GitHub Release Updates
* **Auto-Check on Launch**: Automatically queries GitHub API (`drkkahraman/multitool`) for versions newer than `v1.1.0`.
* **In-App Release Modal**: Displays version release notes and a direct *"⚡ Download & Install Update"* button.
* **Native Android Installer Bridge**: Direct `openUrl` Java bridge to open APK download links directly in the native browser/download manager.

### 📥 2. High-Resolution JPEG Agenda & Note Exports to Gallery
* **Daily & Weekly Agenda Export**: Export single-day agendas and 7-day weekly schedule posters (1200x1600) as high-res JPEG graphics directly to gallery.
* **Personal Notes Gallery Export**: Export individual notes or all notes simultaneously as branded JPEG image cards with one tap.
* **App Branding & Multilingual**: Embeds the official application logo mark and localizes all graphics across 6 supported languages.

### 🧙‍♂️ 3. Modular Multi-Section Setup Wizard & Fast Skip
* **Interactive 11-Step Flow**: Guided onboarding workflow with separate, detailed capability slides for:
  - 🛠️ *Self-Coding & Localhost Sandbox*
  - 🎤 *Multi-AI & Voice Assistant*
  - 📅 *Smart Calendar & Gallery Export*
  - 📝 *Todos, Notes & Analytics*
* **Skip Setup Mechanism**: Option to skip onboarding instantly on any slide and launch directly into the application.
* **Full Multilingual Setup**: Complete localization for setup titles, bullets, personas, and controls across all 6 languages.

### 🤖 4. Self-Coding AI & Localhost Sandbox
* **Code Generation & Editing**: Write and edit JavaScript, Node.js, and HTML/CSS code directly on your mobile device powered by AI.
* **Localhost Server Runner**: Launch live Express/Node.js backend servers running locally on `http://localhost:3005`.
* **Responsive 2x2 Grid Sandbox Controls**: Optimized mobile action button layout for running, serving, exporting, and compiling code without layout clipping.
* **Automated APK Builder**: Update the application's own source code with a single command and trigger the Vite + Capacitor + Gradle build workflow to generate a new downloadable Android APK.

### 🌍 5. Multi-Language Support
* **6 Supported Languages**:
  - 🇹🇷 Turkish
  - 🇬🇧 English
  - 🇩🇪 German
  - 🇪🇸 Spanish
  - 🇫🇷 French
  - 🇮🇹 Italian
* Language preferences are automatically persisted in local storage and applied instantly across the entire application interface.

### 📅 6. Smart Agenda & Calendar
* **Month Navigation**: Easily browse previous and upcoming months.
* **Timeline & List Views**: View scheduled events in chronological timeline format or structured list view.
* **Local Device Notifications**: Receive instant push notifications for upcoming meetings and deadlines.

### ✔️ 7. Todo Management & 24-Hour Auto-Archiving
* **Completion Rate Statistics (%):** Real-time percentage calculation of task productivity.
* **24-Hour Smart Auto-Archive**: Completed tasks are automatically moved to the **Archived Tasks** section after 24 hours.
* **Preserved Productivity Stats**: Archived tasks continue to contribute 100% to your overall completion rate percentage.

### 🎙️ 8. Multi-AI Provider Support & Voice Dictation (STT)
* Supports Groq Cloud, DeepSeek API, OpenAI (GPT-4o), Google Gemini API, OpenRouter, and Ollama (Local).
* Hands-free voice typing in your preferred language by tapping the microphone button.

### 🗣️ 9. Android Native Text-to-Speech (TTS) & Speed Tuning (0.7x)
* **Audible AI Responses**: Per-message playback buttons and auto-read toggle for assistant responses across 6 supported languages.
* **Android Native Engine Bridge**: Integrated `android.speech.tts.TextToSpeech` with `UtteranceProgressListener` for smooth, uninterrupted speech playback on modern devices.
* **Calibrated 0.7x Speed**: Speech rate tuned to 0.7x for clear, articulate voice playback.

### 📼 10. Direct Audio Voice Notes & In-Task Audio Player
* **Live Recording Indicator**: Interactive recording status with live duration timer (`🔴 Kaydı Bitir (00:05)`).
* **Direct Audio Capture**: Record high-quality audio notes stored directly as audio files on task items without relying on text conversion.
* **Embedded Playable Audio**: Play back recorded audio notes anytime using built-in HTML5 audio players in active and archived tasks.

### ⚡ 11. System Prompt Weight Customization for Local LLMs
* **Ollama Speed Tuning**: Adjustable System Prompt Weight presets (Light / Balanced / Detailed) in settings to accelerate response speed for local models.

---

## 🏗️ Technology Stack & Architecture

| Component | Technology Used |
| :--- | :--- |
| **Frontend Framework** | React 19 + TypeScript + Vite |
| **Mobile Runtime** | Capacitor v8 (Native Android Bridge) |
| **Styling & UI** | Vanilla CSS (Theme Tokens & Mobile Grid Constraints) |
| **Icon Set** | Lucide React |
| **AI Backend Engines** | Groq Cloud, DeepSeek, OpenAI, Gemini, OpenRouter & Ollama |
| **Local Sandbox Server** | Node.js + Express (`server.cjs`) |
| **Mobile Compiler** | Gradle + Android SDK Platform 34 |

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* npm or yarn
* Android Studio & SDK (for local APK compilation)

### 1. Clone the Repository
```bash
git clone https://github.com/drkkahraman/multitool.git
cd multitool
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Start Local Background Sandbox Server
```bash
node server.cjs
```

---

## 📱 Building the APK

To compile the Multitool app into an Android APK:

```bash
# Automated Build Script
bash build_apk.sh
```
The compiled APK will automatically be generated and copied to your Desktop (`/home/doruk/Desktop/multitool.apk`).

Alternatively, to compile manually:
```bash
npm run build
npx cap sync
cd android
./gradlew assembleDebug
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
