# 🛠️ Multitool AI Agent (v1.2.4)

[![Version](https://img.shields.io/badge/version-1.2.4-blue.svg)](https://github.com/drkkahraman/multitool)
[![Platform](https://img.shields.io/badge/platform-Android%20%7C%20Web-green.svg)](https://capacitorjs.com)
[![Framework](https://img.shields.io/badge/framework-React%2019%20%7C%20Vite%20%7C%20Capacitor-orange.svg)](https://vitejs.dev)
[![Backend](https://img.shields.io/badge/backend-Express%20Cloud%20Server-6366f1.svg)](https://dorukk.dev/multitool-cloud)
[![Ads](https://img.shields.io/badge/ads-Start.io%20Ads-purple.svg)](https://github.com/drkkahraman/multitool)
[![License](https://img.shields.io/badge/license-MIT-purple.svg)](LICENSE)

**Multitool AI Agent** is an intelligent mobile assistant featuring autonomous self-coding, live Node.js server execution, Multitool Cloud authentication (Express API), social friend addition, targeted calendar sharing (day, week, month), closed-app system notifications, automated agenda and task management, automated GitHub release update detection, Start.io native ad integration with 2-hour ad-free rewarded unlocks, zero-config default AI execution, modular setup wizard, gallery JPEG exports, and self-compiling Android APK capabilities directly on-device.

---

## ✨ Key Features (v1.2.4)

### 🎬 1. Native Start.io Ad Integration & Rewarded Unlocks (v1.2.4)
* **Start.io Engine**: Powered exclusively by Start.io native SDK (`App ID: 206953182`).
* **Rewarded Video Unlocks**: Watch rewarded video ads to unlock a **2-hour completely ad-free window**.
* **Multi-Tier Fallback Protection**: Automatic failover (`REWARDED_VIDEO` ➔ `FULLPAGE` ➔ direct fallback) guarantees smooth operation with zero ad loading error popups.
* **Clean UI Guarantee**: Zero persistent bottom banners for an unobstructed user experience.

### 🤖 2. Zero-Configuration Default AI Model
* **Instant Out-of-the-Box AI**: Ships pre-configured with the `qwen/qwen3.7-27b` model and built-in API access key via Groq.
* **No Mandatory Setup**: Users can start chatting immediately upon opening the app without needing to acquire or type an API key.
* **Customizable via Settings**: Full flexibility to switch providers (DeepSeek, Gemini, OpenAI, Ollama, OpenRouter) or scan models anytime from Settings.

### 📅 3. Granular Targeted Calendar Sharing
* **Targeted Friend Scope**: Share specific calendar timeframes with individual friends instead of blanket sharing.
* **Flexible Scope Options**:
  * 📅 **Daily (Belirli Gün)**: Share events for a single selected date.
  * 🗓️ **Weekly (Belirli Hafta)**: Share all events across the selected week (Monday to Sunday).
  * 📆 **Monthly (Belirli Ay)**: Share events for an entire target month.
  * 🌐 **Full Calendar (Tüm Takvim)**: Option to grant complete calendar access.
* **Live Matching Preview**: Shows instant event count preview matching the selected range before sending.

### ⏰ 4. Closed-App Background Notifications
* **Android `AlarmManager` Integration**: Notifications and calendar alerts trigger precisely on time even when the application is completely closed or the device is asleep.
* **Native `NotificationReceiver`**: System-level Android receiver delivers sound, vibration, and lock-screen alerts directly from Android OS.

### ☁️ 5. Multitool Cloud Express Backend
* **Production Backend Service**: Active Express cloud backend (`https://dorukk.dev/multitool-cloud`) running on dedicated server `92.249.61.108`.
* **Targeted Shares Uploader & Filtering**: Dynamic API logic filtering friend calendar views based on active permissions and viewer email.

### 👥 6. Friends System & Notification Badges
* **Add Friends by Email**: Send friend requests to other Multitool users directly by email or username.
* **Notification Alerts**: Live red badge indicator on the top app header `Cloud` icon when pending friend requests arrive.

### 🚀 7. Automated GitHub Release Updates
* **Auto-Check on Launch**: Automatically queries GitHub API (`drkkahraman/multitool`) for versions newer than `v1.2.4`.
* **In-App Release Modal**: Displays version release notes and a direct *"⚡ Download & Install Update"* button.

### 📥 8. High-Resolution JPEG Agenda & Note Exports to Gallery
* **Daily & Weekly Agenda Export**: Export single-day agendas and 7-day weekly schedule posters (1200x1600) as high-res JPEG graphics directly to gallery.
* **Personal Notes Gallery Export**: Export individual notes or all notes simultaneously as branded JPEG image cards.

### 🧙‍♂️ 9. Modular Multi-Section Setup Wizard & Fast Skip
* **Interactive 11-Step Flow**: Guided onboarding workflow with separate, detailed capability slides.
* **Skip Setup Mechanism**: Option to skip onboarding instantly on any slide and launch directly into the application.

---

## 🏗️ Technology Stack & Architecture

| Component | Technology Used |
| :--- | :--- |
| **Frontend Framework** | React 19 + TypeScript + Vite |
| **Cloud & Auth Backend** | Multitool Cloud Express (`https://dorukk.dev/multitool-cloud` / `92.249.61.108`) |
| **Mobile Runtime** | Capacitor v8 (Native Android Bridge & AlarmManager) |
| **Ad Engine** | Start.io Native SDK |
| **Styling & UI** | Vanilla CSS (Theme Tokens & Mobile Grid Constraints) |
| **AI Backend Engines** | Groq (`qwen/qwen3.7-27b` default), DeepSeek, OpenAI, Gemini, OpenRouter & Ollama |
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

---

## 📱 Building the APK

To compile the Multitool app into an Android APK:

```bash
# Automated Build Script
bash build_apk.sh
```
The compiled APK will automatically be generated and copied to your Desktop (`/home/doruk/Masaüstü/multitool.apk`).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
