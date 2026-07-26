# 🛠️ Multitool AI Agent (v1.0.0)

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/doruk/multitool)
[![Platform](https://img.shields.io/badge/platform-Android%20%7C%20Web-green.svg)](https://capacitorjs.com)
[![Framework](https://img.shields.io/badge/framework-React%2019%20%7C%20Vite%20%7C%20Capacitor-orange.svg)](https://vitejs.dev)
[![License](https://img.shields.io/badge/license-MIT-purple.svg)](LICENSE)

**Multitool AI Agent** is an intelligent mobile assistant featuring autonomous self-coding, live Node.js server execution, automated agenda and task management, and self-compiling Android APK capabilities directly on-device.

---

## ✨ Key Features

### 🤖 1. Self-Coding AI & Live Web Sandbox
* **Code Generation & Editing**: Write and edit JavaScript, Node.js, and HTML/CSS code directly on your mobile device powered by AI.
* **Localhost Server Runner**: Launch live Express/Node.js backend servers running locally on `http://localhost:3005`.
* **Automated APK Builder**: Update the application's own source code with a single command and trigger the Vite + Capacitor + Gradle build workflow to generate a new downloadable Android APK.

### 🌍 2. Multi-Language Support & Onboarding Wizard (Setup UI)
* **Onboarding Setup Wizard**: Animated full-screen setup experience on initial launch.
* **6 Supported Languages**:
  - 🇬🇧 English *(Default)*
  - 🇹🇷 Turkish
  - 🇩🇪 German
  - 🇪🇸 Spanish
  - 🇫🇷 French
  - 🇮🇹 Italian
* Language preferences are automatically persisted in local storage and applied instantly across the entire application interface.

### 📅 3. Smart Agenda & Calendar
* **Month Navigation**: Easily browse previous and upcoming months.
* **Timeline & List Views**: View scheduled events in chronological timeline format or structured list view.
* **Local Device Notifications**: Receive instant push notifications for upcoming meetings and deadlines.

### ✔️ 4. Todo Management & 24-Hour Auto-Archiving
* **Completion Rate Statistics (%):** Real-time percentage calculation of task productivity.
* **24-Hour Smart Auto-Archive**: Completed tasks are automatically moved to the **Archived Tasks** section after 24 hours.
* **Preserved Productivity Stats**: Archived tasks continue to contribute 100% to your overall completion rate percentage.

### 🎙️ 5. Voice Dictation (STT)
* Hands-free voice typing in your preferred language by tapping the microphone button.
* Advanced real-time transcription merging eliminates duplicate word repetitions.

### 🎨 6. Minimalist White Theme
* Clean, modern, responsive white light mode theme tailored for Android mobile viewports.

---

## 🏗️ Technology Stack & Architecture

| Component | Technology Used |
| :--- | :--- |
| **Frontend Framework** | React 19 + TypeScript + Vite |
| **Mobile Runtime** | Capacitor v8 (Native Android Bridge) |
| **Styling & UI** | Vanilla CSS (Glassmorphism & Custom Tokens) |
| **Icon Set** | Lucide React |
| **AI Backend Engines** | Groq Cloud API & Ollama (Local Server) |
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
git clone https://github.com/doruk/multitool.git
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
