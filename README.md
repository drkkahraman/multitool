# 🛠️ Multitool AI Agent (v1.2.0)

[![Version](https://img.shields.io/badge/version-1.2.0-blue.svg)](https://github.com/drkkahraman/multitool)
[![Platform](https://img.shields.io/badge/platform-Android%20%7C%20Web-green.svg)](https://capacitorjs.com)
[![Framework](https://img.shields.io/badge/framework-React%2019%20%7C%20Vite%20%7C%20Capacitor-orange.svg)](https://vitejs.dev)
[![Backend](https://img.shields.io/badge/backend-Appwrite%20Cloud-fd366e.svg)](https://appwrite.io)
[![License](https://img.shields.io/badge/license-MIT-purple.svg)](LICENSE)

**Multitool AI Agent** is an intelligent mobile assistant featuring autonomous self-coding, live Node.js server execution, Multitool Cloud authentication (Appwrite), social friend addition, notification alerts, shared calendars, private accounts, automated agenda and task management, automated GitHub releases update detection, modular setup wizard, gallery JPEG exports, and self-compiling Android APK capabilities directly on-device.

---

## ✨ Key Features

### ☁️ 1. Multitool Cloud & Appwrite Authentication (New in v1.2.0)
* **Secure Authentication**: Register and log in using email & password powered by Appwrite Cloud.
* **Cros-Device Session Sync**: Easily maintain cloud session state across web and Android mobile applications.

### 👥 2. Friends System & Notification Badges (New in v1.2.0)
* **Add Friends by Email**: Send friend requests to other Multitool users directly by email.
* **Notification Alerts**: Live red badge indicator on the top app header `Cloud` icon when pending friend requests arrive.
* **Request Management**: Accept or reject incoming requests with one tap.

### 🔒 3. Private Account & Calendar Sharing Controls (New in v1.2.0)
* **Private Account Toggle (🔒 Hesabı Gizli Yap)**: Protect your account and hide from public search/friend recommendations.
* **Shared Calendars (📅 Takvimimi Paylaş)**: Allow connected friends to view shared agenda events seamlessly.

### 🚀 4. Automated GitHub Release Updates
* **Auto-Check on Launch**: Automatically queries GitHub API (`drkkahraman/multitool`) for versions newer than `v1.2.0`.
* **In-App Release Modal**: Displays version release notes and a direct *"⚡ Download & Install Update"* button.
* **Native Android Installer Bridge**: Direct `openUrl` Java bridge to open APK download links directly in the native browser/download manager.

### 📥 5. High-Resolution JPEG Agenda & Note Exports to Gallery
* **Daily & Weekly Agenda Export**: Export single-day agendas and 7-day weekly schedule posters (1200x1600) as high-res JPEG graphics directly to gallery.
* **Personal Notes Gallery Export**: Export individual notes or all notes simultaneously as branded JPEG image cards with one tap.
* **App Branding & Multilingual**: Embeds the official application logo mark and localizes all graphics across 6 supported languages.

### 🧙‍♂️ 6. Modular Multi-Section Setup Wizard & Fast Skip
* **Interactive 11-Step Flow**: Guided onboarding workflow with separate, detailed capability slides for:
  - 🛠️ *Self-Coding & Localhost Sandbox*
  - 🎤 *Multi-AI & Voice Assistant*
  - 📅 *Smart Calendar & Gallery Export*
  - 📝 *Todos, Notes & Analytics*
* **Skip Setup Mechanism**: Option to skip onboarding instantly on any slide and launch directly into the application.
* **Full Multilingual Setup**: Complete localization for setup titles, bullets, personas, and controls across all 6 languages.

### 🤖 7. Self-Coding AI & Localhost Sandbox
* **Code Generation & Editing**: Write and edit JavaScript, Node.js, and HTML/CSS code directly on your mobile device powered by AI.
* **Localhost Server Runner**: Launch live Express/Node.js backend servers running locally on `http://localhost:3005`.
* **Responsive 2x2 Grid Sandbox Controls**: Optimized mobile action button layout for running, serving, exporting, and compiling code without layout clipping.
* **Automated APK Builder**: Update the application's own source code with a single command and trigger the Vite + Capacitor + Gradle build workflow to generate a new downloadable Android APK.

### 🌍 8. Multi-Language Support
* **6 Supported Languages**:
  - 🇹🇷 Turkish
  - 🇬🇧 English
  - 🇩🇪 German
  - 🇪🇸 Spanish
  - 🇫🇷 French
  - 🇮🇹 Italian
* Language preferences are automatically persisted in local storage and applied instantly across the entire application interface.

### 📅 9. Smart Agenda & Calendar
* **Month Navigation**: Easily browse previous and upcoming months.
* **Timeline & List Views**: View scheduled events in chronological timeline format or structured list view.
* **Local Device Notifications**: Receive instant push notifications for upcoming meetings and deadlines.

### ✔️ 10. Todo Management & 24-Hour Auto-Archiving
* **Completion Rate Statistics (%):** Real-time percentage calculation of task productivity.
* **24-Hour Smart Auto-Archive**: Completed tasks are automatically moved to the **Archived Tasks** section after 24 hours.
* **Preserved Productivity Stats**: Archived tasks continue to contribute 100% to your overall completion rate percentage.

### 🎙️ 11. Multi-AI Provider Support & Voice Dictation (STT)
* Supports Groq Cloud, DeepSeek API, OpenAI (GPT-4o), Google Gemini API, OpenRouter, and Ollama (Local).
* Hands-free voice typing in your preferred language by tapping the microphone button.

### 🗣️ 12. Android Native Text-to-Speech (TTS) & Speed Tuning (0.7x)
* **Audible AI Responses**: Per-message playback buttons and auto-read toggle for assistant responses across 6 supported languages.
* **Android Native Engine Bridge**: Integrated `android.speech.tts.TextToSpeech` with `UtteranceProgressListener` for smooth, uninterrupted speech playback on modern devices.
* **Calibrated 0.7x Speed**: Speech rate tuned to 0.7x for clear, articulate voice playback.

### 📼 13. Direct Audio Voice Notes & In-Task Audio Player
* **Live Recording Indicator**: Interactive recording status with live duration timer (`🔴 Kaydı Bitir (00:05)`).
* **Direct Audio Capture**: Record high-quality audio notes stored directly as audio files on task items without relying on text conversion.
* **Embedded Playable Audio**: Play back recorded audio notes anytime using built-in HTML5 audio players in active and archived tasks.

---

## 🏗️ Technology Stack & Architecture

| Component | Technology Used |
| :--- | :--- |
| **Frontend Framework** | React 19 + TypeScript + Vite |
| **Cloud & Auth Backend** | Appwrite Cloud (`appwrite` SDK) |
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
* Appwrite Cloud account (or local Appwrite instance)
* Android Studio & SDK (for local APK compilation)

### 1. Clone the Repository
```bash
git clone https://github.com/drkkahraman/multitool.git
cd multitool
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your Appwrite details:
```bash
cp .env.example .env
```
Example `.env`:
```env
VITE_APPWRITE_PROJECT_ID="YOUR_APPWRITE_PROJECT_ID"
VITE_APPWRITE_PROJECT_NAME="Multitool Cloud"
VITE_APPWRITE_ENDPOINT="https://fra.cloud.appwrite.io/v1"
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start Development Server
```bash
npm run dev
```

---

## 📱 Building the APK

To compile the Multitool app into an Android APK:

```bash
# Automated Build Script
bash build_apk.sh
```
The compiled APK will automatically be generated and copied to your Desktop (`/home/doruk/Desktop/multitool.apk`).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
