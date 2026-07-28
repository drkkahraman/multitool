# 🛠️ Multitool AI Agent (v1.2.1)

[![Version](https://img.shields.io/badge/version-1.2.1-blue.svg)](https://github.com/drkkahraman/multitool)
[![Platform](https://img.shields.io/badge/platform-Android%20%7C%20Web-green.svg)](https://capacitorjs.com)
[![Framework](https://img.shields.io/badge/framework-React%2019%20%7C%20Vite%20%7C%20Capacitor-orange.svg)](https://vitejs.dev)
[![Backend](https://img.shields.io/badge/backend-Express%20Cloud%20Server-6366f1.svg)](https://dorukk.dev/multitool-cloud)
[![License](https://img.shields.io/badge/license-MIT-purple.svg)](LICENSE)

**Multitool AI Agent** is an intelligent mobile assistant featuring autonomous self-coding, live Node.js server execution, Multitool Cloud authentication (Express API), social friend addition, targeted calendar sharing (day, week, month), closed-app system notifications, automated agenda and task management, automated GitHub release update detection, modular setup wizard, gallery JPEG exports, and self-compiling Android APK capabilities directly on-device.

---

## ✨ Key Features

### 📅 1. Granular Targeted Calendar Sharing (v1.2.1)
* **Targeted Friend Scope**: Share specific calendar timeframes with individual friends instead of blanket sharing.
* **Flexible Scope Options**:
  * 📅 **Daily (Belirli Gün)**: Share events for a single selected date.
  * 🗓️ **Weekly (Belirli Hafta)**: Share all events across the selected week (Monday to Sunday).
  * 📆 **Monthly (Belirli Ay)**: Share events for an entire target month.
  * 🌐 **Full Calendar (Tüm Takvim)**: Option to grant complete calendar access.
* **Live Matching Preview**: Shows instant event count preview matching the selected range before sending.
* **Active Share Management**: View active sent shares and revoke access with a single tap.

### ⏰ 2. Closed-App Background Notifications (v1.2.1)
* **Android `AlarmManager` Integration**: Notifications and calendar alerts trigger precisely on time even when the application is completely closed or the device is asleep.
* **Native `NotificationReceiver`**: System-level Android receiver delivers sound, vibration, and lock-screen alerts directly from Android OS.

### 📋 3. First-Launch Version Changelog Modal (v1.2.1)
* **What's New Modal**: Automatic first-launch changelog modal highlighting major version updates upon upgrading to v1.2.1.
* **Complete Localization**: Fully translated across all 6 supported languages.

### ☁️ 4. Multitool Cloud Express Backend (v1.2.1)
* **Production Backend Service**: Active Express cloud backend (`https://dorukk.dev/multitool-cloud`) running on dedicated server `92.249.61.108`.
* **Targeted Shares Uploader & Filtering**: Dynamic API logic filtering friend calendar views based on active permissions and viewer email.

### 👥 5. Friends System & Notification Badges
* **Add Friends by Email**: Send friend requests to other Multitool users directly by email or username.
* **Notification Alerts**: Live red badge indicator on the top app header `Cloud` icon when pending friend requests arrive.
* **Request Management**: Accept or reject incoming requests with one tap.

### 🔒 6. Private Account & Privacy Controls
* **Private Account Toggle (🔒 Hesabı Gizli Yap)**: Protect your account and hide from public search and friend recommendations.
* **Calendar Privacy**: Toggle general calendar visibility anytime from your profile settings.

### 🚀 7. Automated GitHub Release Updates
* **Auto-Check on Launch**: Automatically queries GitHub API (`drkkahraman/multitool`) for versions newer than `v1.2.1`.
* **In-App Release Modal**: Displays version release notes and a direct *"⚡ Download & Install Update"* button.
* **Native Android Installer Bridge**: Direct `openUrl` Java bridge to open APK download links directly in the native browser/download manager.

### 📥 8. High-Resolution JPEG Agenda & Note Exports to Gallery
* **Daily & Weekly Agenda Export**: Export single-day agendas and 7-day weekly schedule posters (1200x1600) as high-res JPEG graphics directly to gallery.
* **Personal Notes Gallery Export**: Export individual notes or all notes simultaneously as branded JPEG image cards with one tap.
* **App Branding & Multilingual**: Embeds the official application logo mark and localizes all graphics across 6 supported languages.

### 🧙‍♂️ 9. Modular Multi-Section Setup Wizard & Fast Skip
* **Interactive 11-Step Flow**: Guided onboarding workflow with separate, detailed capability slides.
* **Skip Setup Mechanism**: Option to skip onboarding instantly on any slide and launch directly into the application.
* **Full Multilingual Setup**: Complete localization for setup titles, bullets, personas, and controls across all 6 languages.

### 🤖 10. Self-Coding AI & Localhost Sandbox
* **Code Generation & Editing**: Write and edit JavaScript, Node.js, and HTML/CSS code directly on your mobile device powered by AI.
* **Localhost Server Runner**: Launch live Express/Node.js backend servers running locally on `http://localhost:3005`.
* **Responsive 2x2 Grid Sandbox Controls**: Optimized mobile action button layout for running, serving, exporting, and compiling code without layout clipping.
* **Automated APK Builder**: Update the application's own source code with a single command and trigger the Vite + Capacitor + Gradle build workflow to generate a new downloadable Android APK.

### 🌍 11. Multi-Language Support (6 Languages)
* **Supported Languages**:
  - 🇹🇷 Turkish
  - 🇬🇧 English
  - 🇩🇪 German
  - 🇪🇸 Spanish
  - 🇫🇷 French
  - 🇮🇹 Italian
* Language preferences are automatically persisted in local storage and applied instantly across the entire application interface.

### 🎙️ 12. Multi-AI Provider Support & Audio Voice Notes
* **AI Providers**: Supports Groq Cloud, DeepSeek API, OpenAI (GPT-4o), Google Gemini API, OpenRouter, and Ollama (Local).
* **IndexedDB Voice Storage**: Audio voice notes are saved in IndexedDB (`dbService`), avoiding `localStorage` quota limits.
* **Embedded Playable Audio**: Play back recorded audio notes anytime using built-in HTML5 audio players in active and archived tasks.

---

## 🏗️ Technology Stack & Architecture

| Component | Technology Used |
| :--- | :--- |
| **Frontend Framework** | React 19 + TypeScript + Vite |
| **Cloud & Auth Backend** | Multitool Cloud Express (`https://dorukk.dev/multitool-cloud` / `92.249.61.108`) |
| **Mobile Runtime** | Capacitor v8 (Native Android Bridge & AlarmManager) |
| **Styling & UI** | Vanilla CSS (Theme Tokens & Mobile Grid Constraints) |
| **Icon Set** | Lucide React |
| **AI Backend Engines** | Groq Cloud, DeepSeek, OpenAI, Gemini, OpenRouter & Ollama |
| **Local Sandbox Server** | Node.js + Express (`cloud-server/server.js`) |
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

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Example `.env`:
```env
VITE_CLOUD_SERVER_URL="https://dorukk.dev/multitool-cloud"
VITE_CLOUD_API_KEY="mtc_sk_24fe2f8b30d8ea5943a45e5c4cac5193054b"
```

### 3. Install Dependencies & Start App
```bash
npm install
npm run dev
```

### 4. Self-Hosted Cloud Server (Optional)
To run your own backend instance:
```bash
cd cloud-server
npm install
npm start
```

---

## 📱 Building the APK

To compile the Multitool app into an Android APK:

```bash
# Automated Build Script
bash build_apk.sh
```
The compiled APK will automatically be generated and copied to your Desktop (`/home/doruk/Desktop/multitool-v1.2.1.apk`).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
