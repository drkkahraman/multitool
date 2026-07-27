import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Calendar as CalendarIcon,
  CheckSquare,
  Code as CodeIcon,
  Settings as SettingsIcon,
  Plus,
  Trash2,
  Play,
  FileCode,
  RefreshCw,
  Check,
  Terminal,
  Cpu,
  Layers,
  Sparkles,
  Download,
  Hammer,
  Server,
  ChevronLeft,
  ChevronRight,
  Mic,
  MicOff,
  FileText,
  Upload,
  BarChart2,
  Flame,
  Palette,
  Send,
  StickyNote,
  MessageCirclePlus,
  Tag,
  History,
  Globe,
  Archive,
  RotateCcw,
  User,
  Rocket,
  CheckCircle2,
  PartyPopper,
  Volume2,
  VolumeX
} from 'lucide-react';

interface Model {
  name: string;
  model: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  toolCall?: {
    tool: string;
    parameters: any;
    status: 'pending' | 'running' | 'success' | 'error';
    result?: string;
    error?: string;
  };
}

interface EventAttachment {
  name: string;
  type: string;
  dataUrl: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  time?: string;
  endTime?: string;
  description?: string;
  reminderMinutes?: number;
  attachments?: EventAttachment[];
  notifiedExact?: boolean;
  notifiedReminder?: boolean;
}

interface TodoItem {
  id: string;
  task: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  completed: boolean;
  completedAt?: number;
  isRoutine?: boolean;
  routineFrequency?: 'daily' | 'weekly' | 'monthly';
  audioUrl?: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
}

interface NoteItem {
  id: string;
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

interface SandboxFile {
  name: string;
  size: number;
  isDir: boolean;
  updatedAt: string;
}

const TRANSLATIONS = {
  en: {
    welcomeTitle: "Welcome to Multitool AI",
    welcomeDesc: "Your intelligent personal assistant, live web code sandbox, and todo & calendar manager.",
    discoverFeatures: "Select Language & Start 🚀",
    exploreBtn: "Explore Features & Begin 🚀",
    setupSkip: "Skip Setup ⏭️",
    featuresTitle: "What Can You Do? ⚡",
    featuresSub: "Core capabilities of the Multitool platform:",
    feat1Title: "🛠️ Self-Coding & Localhost Sandbox",
    feat1Desc: "Edit source code, compile new APKs, and execute Localhost Node.js servers.",
    feat1Bullet1: "⚡ Instant mobile APK compilation with Vite + Capacitor",
    feat1Bullet2: "🖥 Start and test Express/Node.js servers locally",
    feat1Bullet3: "🌐 Live HTML/JS web preview sandbox environment",
    feat2Title: "🎤 Multi-AI & Voice Assistant",
    feat2Desc: "Voice dictation & intelligent responses with Groq, DeepSeek, OpenAI, Gemini, & Ollama.",
    feat2Bullet1: "🎤 Voice recognition and text-to-speech AI answers",
    feat2Bullet2: "🧠 Support for Groq, DeepSeek, OpenAI, Gemini & OpenRouter",
    feat2Bullet3: "🎭 Customizable Coder, Assistant & Persona modes",
    feat3Title: "📅 Smart Calendar & Gallery Export",
    feat3Desc: "Render daily and weekly agendas as JPEG images and save directly to Gallery.",
    feat3Bullet1: "📅 Timeline, Weekly, and List agenda views",
    feat3Bullet2: "🖼 Export Daily & Weekly Agendas as JPEG to Gallery",
    feat3Bullet3: "🔔 Event reminders and smart local notifications",
    feat4Title: "📝 Todos, Notes & Analytics",
    feat4Desc: "Manage all notes, todo routines, and view productivity metrics in one place.",
    feat4Bullet1: "📝 Save all notes to Gallery as JPEG with one tap",
    feat4Bullet2: "📊 Productivity analytics and routine completion stats",
    feat4Bullet3: "🔒 100% local, privacy-focused on-device storage",
    aiProviderTitle: "AI Provider Setup 🔑",
    aiProviderSub: "Configure your AI model backend. Select your preferred provider and API key.",
    nameLabel: "👤 Your Name",
    namePlaceholder: "Enter your name...",
    selectLang: "App Language",
    selectProvider: "AI Provider",
    selectModelLabel: "Select Model",
    groqLabel: "Groq Cloud (High Speed Cloud)",
    deepseekLabel: "DeepSeek API",
    openaiLabel: "OpenAI (GPT-4o)",
    geminiLabel: "Google Gemini API",
    openrouterLabel: "OpenRouter API",
    ollamaLabel: "Ollama (Local Server)",
    apiKeyLabel: "Groq API Key",
    apiKeyDeepseek: "DeepSeek API Key",
    apiKeyOpenAI: "OpenAI API Key",
    apiKeyGemini: "Google Gemini API Key",
    apiKeyOpenRouter: "OpenRouter API Key",
    ollamaUrlLabel: "Ollama Server URL",
    promptWeightLabel: "System Prompt Complexity (Model Speed)",
    promptWeightHelp: "Reduce system prompt length and tool definitions to significantly speed up local models (Ollama).",
    promptWeightFull: "⚡⚡⚡ Full / Advanced (All 17 Tools & Detailed Persona)",
    promptWeightBalanced: "⚡⚡ Balanced (Essential Notes, Calendar & Todo Tools)",
    promptWeightMinimal: "⚡ Fast / Minimal (Ultra-Fast Response - Lightweight)",
    personaTitle: "Choose Assistant Persona 🎭",
    personaSub: "Select your assistant's primary focus domain:",
    completeTitle: "All Set! 🎉",
    completeDesc: "Multitool AI Agent is fully configured and ready for your commands.",
    startAppBtn: "Start Using Multitool ✨",
    nextBtn: "Next",
    backBtn: "Back",
    setupRestart: "Restart Setup Wizard",
    notes: "Notes",
    notesTitle: "📝 My Notes",
    newNoteHeader: "Create New Note",
    noteTitlePlaceholder: "Note Title...",
    tagsLabel: "Custom Tags",
    tagsPlaceholder: "Custom Tags (comma-separated: #project, #urgent)...",
    noteContentPlaceholder: "Write note content here...",
    saveNoteBtn: "Save Note",
    searchNotesPlaceholder: "Search notes or tags...",
    allTags: "All Tags",
    noNotesYet: "No saved notes found.",
    newChat: "New Chat",
    chatHistory: "Chats History",
    chatHistoryModalTitle: "Saved Chat History",
    noSavedChats: "No saved chats found.",
    startNewChatBtn: "Start New Chat",
    clearCurrentChat: "Clear Current Chat",
    sendMsg: "Send Message",
    isRoutine: "Routine Task",
    routineFrequency: "Frequency",
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
    routines: "Routines",
    activeStatus: "Active",
    noKeyStatus: "No API Key",
    quickAddTodo: "Add Task",
    quickAddEvent: "Add Event",
    quickVoiceNote: "Voice Note",
    quickSummary: "Day Summary",
    quickSandbox: "Sandbox",
    tabChat: "Chat",
    tabNotes: "Notes",
    tabCalendar: "Calendar",
    tabTodos: "To-Do",
    tabAnalytics: "Analytics",
    tabSandbox: "Sandbox",
    welcomeGreeting: "Hello! I am your Multitool AI Assistant. How can I help you today?",
    newChatGreeting: "Hello! Started a new chat. How can I assist you?",
    chatTitlePrefix: "Chat",
    lowPriority: "Low Priority",
    medPriority: "Medium Priority",
    highPriority: "High Priority",
    noTasksFound: "No tasks found.",
    archivedTasks: "Archived Tasks",
    clearArchive: "Clear Archive",
    archived: "Archived",
    viewFlow: "Flow",
    viewWeekly: "Weekly",
    viewList: "List",
    emptyTimeSlot: "Empty Time Slot",
    addEvent: "Add Event",
    eventTitlePlaceholder: "Event Title...",
    eventStartTime: "⏰ Start Time",
    eventEndTime: "⌛ End Time",
    eventDate: "📅 Date",
    eventDescPlaceholder: "Description (Optional)",
    saveEventBtn: "Save Event",
    analyticsHeader: "📊 AI Analytics & Routines",
    getReportNotif: "🔔 Get Report Notification",
    todaysSummary: "📌 Today's Summary",
    taskStatus: "Task Status:",
    todaySchedule: "Today's Schedule:",
    dailyRoutines: "Daily Routines:",
    completedTasksLabel: "Completed Tasks",
    eventsLabel: "Events",
    routinesLabel: "Routines",
    habitsHeader: "Daily Habits & Routines",
    addRoutineBtn: "+ Add Routine",
    noRoutinesYet: "No registered routines yet.",
    aiAdviceHeader: "AI Productivity Insights",
    sandboxHeader: "💻 Code & Localhost Sandbox",
    editorTab: "✏️ Editor",
    livePreviewTab: "🌐 Live Preview",
    filesTab: "📂 Files",
    liveSandboxPreview: "🌐 Live Web Sandbox Preview",
    refreshBtn: "Refresh",
    sandboxFolderLabel: "Sandbox Folder (./sandbox)",
    sandboxEmpty: "Folder is empty.",
    openNewFile: "Open New File:",
    openBtn: "Open",
    selectTemplate: "🚀 Select Template...",
    expressTemplate: "⚡ Express API Server",
    reactTemplate: "⚛️ React Component",
    htmlTemplate: "🎨 HTML5 Page",
    runBtn: "Run",
    saveBtn: "Save",
    languageLabel: "Language",
    settingsTitle: "⚙️ Settings",
    userProfileLabel: "👤 User Profile & Notifications",
    yourNameLabel: "Your Name",
    testNotificationBtn: "Send Test Notification",
    notificationSent: "Notification sent!",
    themeLabel: "Theme & Visual Design Packages",
    aiProviderSettingsLabel: "AI Service Provider",
    providerSelectLabel: "Select Provider",
    loadingModels: "Loading models...",
    saveAndTestBtn: "Save & Test Connection",
    aboutTitle: "About & Details",
    checkUpdatesBtn: "Check for Updates",
    checkingUpdates: "Checking for updates...",
    updateAvailableTitle: "🚀 New Update Available!",
    updateAvailableSub: "Multitool AI version {version} is now available. Download and install now.",
    btnDownloadUpdate: "⚡ Download & Install Update",
    btnDismissUpdate: "Later",
    updateCheckFailed: "Could not check for updates. Please check your network connection.",
    upToDateMsg: "Your app is up to date (v1.1.0).",
    releaseNotesLabel: "Release Notes:",
    aboutDesc: "This app is a mobile assistant with Self-Coding AI and Localhost Node.js support (Multitool).",
    versionLabel: "Version",
    architectureLabel: "Architecture",
    buildLabel: "Build",
    databaseLabel: "Database",
    backupTitle: "Data Backup & Restore",
    backupDesc: "Backup or import all your calendar, todos, chat history and sandbox files in JSON format.",
    exportBtn: "Export (Backup)",
    importBtn: "Import",
    systemLogsTitle: "System Logs",
    noLogs: "No log entries.",
    setupWizardTitle: "🚀 Setup Wizard",
    setupWizardDesc: "Re-run the app setup wizard to reconfigure your AI provider and default role.",
    setupWizardRestartBtn: "Restart Setup Wizard (Setup UI)",
    calendarTitle: "📅 Calendar & Schedule",
    scheduleLabel: "Schedule",
    viewTimeline: "Flow",
    todosTitle: "✔️ To-Do & Routines",
    completionRateLabel: "Overall Completion Rate",
    activeLabel: "Active",
    completedLabel: "Completed",
    archivedLabel: "Archived",
    allTasksLabel: "All Tasks",
    normalTasksLabel: "Normal Tasks",
    routinesTabLabel: "🔄 Routines",
    todoPlaceholder: "Task or routine to do...",
    priorityLow: "Low Priority",
    priorityMedium: "Medium Priority",
    priorityHigh: "High Priority",
    freqDaily: "Every Day (Daily)",
    freqWeekly: "Every Week (Weekly)",
    freqMonthly: "Every Month (Monthly)",
    addTaskBtn: "Add Task",
    voiceNoteBtn: "Voice Note",
    dueDateLabel: "Due Date",
    routineTagDaily: "Daily",
    routineTagWeekly: "Weekly",
    routineTagMonthly: "Monthly",
    completedTag: "Completed",
    archivedTasksHeader: "Archived Tasks",
    clearArchiveConfirm: "Are you sure you want to clear all archived tasks?",
    analyticsTitle: "📊 AI Analytics & Routines",
    getReportBtn: "Get Report Notification",
    todaySummaryHeader: "Today's Summary",
    taskStatusLabel: "Task Status:",
    todayScheduleLabel: "Today's Schedule:",
    dailyRoutinesLabel: "Daily Routines:",
    completedTasksGrid: "Completed Tasks",
    eventsGrid: "Events",
    routineGrid: "Routines",
    dailyHabitsHeader: "Daily Habits & Routines",
    addRoutinePrompt: "New Habit / Routine Name:",
    streakDays: "Days",
    aiProductivityHeader: "AI Personal Productivity Insights",
    sandboxTitle: "💻 Code & Localhost Sandbox",
    previewTab: "Live Preview",
    livePreviewTitle: "Live Web Sandbox Preview",
    sandboxFolderEmpty: "Folder is empty. AI can create files here or you can open new files.",
    newFileOpen: "Open New File:",
    localhostServerBtn: "Localhost Server (3005)",
    exportHtmlBtn: "Export (HTML)",
    buildApkBtn: "Build New APK",
    buildingApk: "Building...",
    consoleTitle: "Console Output & Server Logs",
    clearBtn: "Clear",
    personaCoder: "🛠️ Self-Coder",
    personaCoderDesc: "Focus on coding, running servers, and APK compilation.",
    personaOrganizer: "📅 Organizer",
    personaOrganizerDesc: "Focus on calendar, agenda, and todo management.",
    personaWriter: "✍️ Writer",
    personaWriterDesc: "Focus on summarization, emails, texts, and translation.",
    personaAnalyst: "🧠 Analyst",
    personaAnalystDesc: "Deep logic focus for step-by-step problem analysis.",
    speechNotSupported: "Speech recognition is not supported or not active on your device.",
    speechNotSupportedWeb: "Web speech recognition is not supported on your device or not allowed in this browsing mode.",
    voiceTaskRecorded: "Voice task recorded",
    newVoiceTaskNotifTitle: "New Voice Task 🎙️",
    newVoiceTaskNotifBody: "Task",
    backupError: "Error creating backup",
    importSuccess: "All your data has been imported successfully!",
    importError: "Backup import error",
    fileSaved: "file saved.",
    deleteFileConfirm: "Are you sure you want to delete",
    deleteNoteConfirm: "Are you sure you want to delete this note?",
    noModelError: "Model not found. Please enter a valid API Key in the Settings tab.",
    noOllamaModelError: "No Ollama model selected. Please check the Ollama URL in Settings.",
    downloadApkTitle: "Download Latest APK",
    downloadApkBtn: "Download APK",
    messagesCount: "messages",
    deleteChat: "Delete Chat",
    catAll: "All",
    catGeneral: "General",
    catIdea: "Idea",
    catWork: "Work",
    catPersonal: "Personal",
    catCode: "Code",
    buildApkPrompt: "Can you build a new APK and give me a download link?",
    buildApkCardTitle: "Auto Build APK",
    buildApkCardSub: "Build with Vite + Capacitor + Gradle",
    reminderMinBefore: "min before",
    newFileContent: "// New file content...",
    aiAdviceEmpty: "No tasks or routines added yet. Start tracking your productivity by adding tasks from the To-Do tab!",
    aiAdviceProgress: "today you completed tasks and routines. Great progress! 🚀",
    selectModelPlaceholder: "Select Model...",
    scanModels: "Scan Models",
    scanningModels: "Scanning models...",
    cancelBtn: "Cancel",
    other: "Other",
    resultLabel: "Result:",
    paramsLabel: "Parameters:",
    errorLabel: "Error:",
    noEventsDay: "No events registered for the selected day.",
    noEventsDate: "No events registered for this date.",
    eventsForDateSuffix: "Events",
    eventStartDate: "📅 Start Date",
    eventDuration: "⏱️ Duration (hours): end time auto-set when entered",
    durationPlaceholder: "e.g. 1.5",
    eventEndDate: "📅 End Date",
    eventReminder: "🔔 Reminder",
    eventAddAttachment: "📎 Add Image / File",
    reminderOnTime: "On time",
    reminderHourBefore: "1 hour before",
    chatAssistantHeader: "Multitool Self-Coding Assistant",
    voiceListeningTitle: "Listening... (click to stop)",
    voiceWriteTitle: "Voice Write",
    archiveBtn: "Archive",
    archivedRoutinesHeader: "Archived Routines",
    restoreBtn: "Restore",
    deletePermBtn: "Delete permanently",
    sandboxPreviewTitle: "Sandbox Live Preview",
    namePlaceholderExample: "e.g. Doruk",
    themeSlate: "🌙 Slate Dark",
    themeCyberpunk: "⚡ Cyberpunk Neon",
    themeEmerald: "🌿 Mint Emerald",
    themeOled: "✨ OLED Gold",
    themeDefaultLight: "☀️ Pure Light",
    versionFullLabel: "Multitool AI • Version v1.1.0",
    versionFooterLabel: "Multitool AI • Version 1.1.0",
    prevMonthTitle: "Previous Month",
    nextMonthTitle: "Next Month",
    todayBtn: "Today",
    notifTaskRoutine: "Tasks / Routines",
    notifTasks: "Tasks",
    notifRoutines: "Routines",
    chatPlaceholder: "Type your message or speak...",
    autoTtsLabel: "Auto-read AI Responses (TTS)",
    autoTtsHelp: "Automatically convert AI responses to speech using Text-to-Speech.",
    listenBtn: "Listen",
    stopListenBtn: "Stop",
    tipsCardTitle: "📌 Multitool AI Usage Tips",
    tipsCardContent: "While chatting with the AI, you can ask it to add events to your calendar, update your to-do list, or write notes for you!",
    thinkingProcess: "🧠 Thinking Process",
    notifUpcomingEvent: "⏰ Upcoming Event Alert!",
    notifEventTime: "📅 Event Time!",
    notifMinutesLeft: "min left",
    notifStartingNow: "is starting now",
    notifNewRoutine: "New Routine Added 🔄",
    notifNewTask: "New Task Added ✔️",
    confirmDeleteHabit: '"{title}" will be permanently deleted. This action cannot be undone.',
    confirmClearChatHistory: "Are you sure you want to delete all chat history?",
    logRoutineArchived: 'Routine archived: "{title}"',
    logRoutineRestored: 'Routine restored from archive: "{title}"',
    logRoutineDeleted: 'Routine permanently deleted: "{title}"',
    logSpeechUnsupported: "Speech recognition API not supported.",
    logVoiceStarted: "Voice listening started...",
    logVoiceError: "Voice listening error:",
    logVoiceStartFailed: "Voice listening could not start:",
    logBackupDownloaded: "Data backup downloaded.",
    logBackupImported: "Backup data imported successfully.",
    logAutoArchived: "{count} completed task(s) moved to archive after 24 hours.",
    logChatHistoryLoadError: "Could not load chat history:",
    logNoApiKey: '{label} has no API Key: showing built-in model list. Enter a key and press "Scan Models" for live scanning.',
    logScanningProvider: "Scanning {provider} models...",
    logOllamaNoModel: "No model found on Ollama: start the Ollama server and download a model first.",
    logScanError: "{provider} model scan error:",
    logCalendarFetchError: "Could not fetch calendar events:",
    logTodosFetchError: "Could not fetch to-dos:",
    logSandboxFetchError: "Could not fetch sandbox files:",
    logFileTooBig: '"{name}" is too large (>2MB), not added.',
    logTodoAddError: "Error adding to-do:",
    logTodoUpdateError: "Error updating to-do:",
    logTodoDeleteError: "Error deleting to-do:",
    logToolSuccess: "Tool {tool} executed successfully.",
    logToolFailed: "Tool {tool} execution failed:",
    logChatRunError: "Chat execution error:",
    logAiApkStart: "AI started APK build...",
    logAiModifySource: "AI is modifying app source code:",
    logAiServerStart: "AI is starting localhost server on port {port}",
    termReady: "Terminal ready. Use the buttons to run code or the Localhost server.\n",
    termRunning: "Running: {file}...",
    termRuntimeError: "Runtime Error:",
    termApkBuildStarted: "New APK build started (Vite + Capacitor + Gradle)...",
    termSuccess: "SUCCESS",
    termDownloadLink: "Download Link",
    termError: "ERROR",
    termApkBuildFailed: "APK build failed",
    termConnError: "Connection Error",
    termLocalhostUnreachable: "Could not reach localhost server:",
    termServerStarting: "Localhost Server starting...",
    termServerActive: "SERVER ACTIVE",
    termEndpoint: "Endpoint",
    termLogs: "Logs",
    termServerStartFailed: "Could not start server:",
    termCodeSuccess: "Code ran successfully (Exit Code: {code}).",
    termOutput: "Output / Return:",
    termProgramDone: "Program completed successfully (no output).",
    toolCallLabel: "Tool Call:",
    errChatComm: "An error occurred communicating with the model:",
    errTodoNotFound: "Task not found",
    errFileNotFound: "File not found: {filename}",
    errOfflineJsOnly: "Only JavaScript code can be executed in offline mode.",
    errUnknownTool: "Unknown tool: {tool}",
    errApkBuildFailed: "APK build failed",
    errSourceUpdateFailed: "Source update failed",
    errServerStartFailed: "Could not start server",
    errProviderResp: "{provider} response not successful",
    errProviderNoModel: "No {provider} model found",
    errApiKeyNotSet: "{provider} API Key is not set.",
    errConnError: "Connection error: {status} {body}",
    systemFeedback: "[System Feedback] Tool {tool} executed. Result: {result}",
    toolApkBuildDone: "New APK build completed successfully and placed on the desktop!",
    sandboxOutputTitle: "Sandbox Output",
    consolePreviewTitle: "Console/JS Preview",
    setupIntroTagline: "Your pocket-sized AI dev companion: code, chat, automate, and build APKs right from your phone.",
    setupIntroCta: "Let's Get Started 🚀",
    setupStepLabel: "Step {n} of {total}",
    setupStepIntro: "Welcome",
    setupStepPersonalize: "Personalize",
    setupStepFeatures: "Features",
    setupStepProvider: "AI Provider",
    setupStepPersona: "Persona",
    setupStepAppearance: "Appearance",
    setupStepReview: "Review",
    setupStepDone: "Ready",
    appearanceTitle: "🎨 Pick Your Vibe",
    appearanceSub: "Choose a theme: you can change it anytime in Settings.",
    reviewTitle: "📋 Final Check",
    reviewSub: "Here's your setup. Tweak anything, then launch!",
    reviewNameLbl: "Name",
    reviewLangLbl: "Language",
    reviewProviderLbl: "AI Provider",
    reviewPersonaLbl: "Persona",
    reviewThemeLbl: "Theme",
    reviewLooksGood: "Looks Good • Launch 🚀",
    setupPersonalizeTitle: "Let's Personalize Multitool",
    setupPersonalizeSub: "Tell me your name and pick a language to get started.",
    downloadDayJpeg: "📥 Download Day (JPEG)",
    downloadWeekJpeg: "📥 Download Week (JPEG)",
    downloadNoteJpeg: "📥 Save Note (JPEG)",
    downloadAllNotesJpeg: "📥 Save All Notes (JPEG)",
    noteCardTitle: "Personal Note",
    notesOverviewTitle: "Notes Overview",
    logNoteSavedGallery: "Note saved to gallery",
    agendaCardTitle: "Daily Agenda",
    weeklyAgendaTitle: "Weekly Agenda",
    agendaNoEventsCard: "No events scheduled for this day.",
    agendaEventsCount: "{n} events",
    agendaAllDay: "All day",
    agendaGeneratedBy: "Generated by Multitool AI",
  },
  tr: {
    welcomeTitle: "Multitool AI'a Hoş Geldiniz",
    welcomeDesc: "Akıllı kişisel asistanınız, canlı web sandbox ortamınız, yapılacaklar ve ajanda yöneticiniz.",
    discoverFeatures: "Dil Seçin & Başlayın 🚀",
    exploreBtn: "Yetenekleri Keşfet & Başla 🚀",
    setupSkip: "Kurulumu Atla ⏭️",
    featuresTitle: "Neler Yapabilirsiniz? ⚡",
    featuresSub: "Multitool platformunun sunduğu temel yetenekler:",
    feat1Title: "🛠️ Self-Coding & Localhost Sandbox",
    feat1Desc: "Kaynak kodunu düzenleyin, yeni APK derleyin ve Localhost Node.js sunucusu çalıştırın.",
    feat1Bullet1: "⚡ Vite + Capacitor ile anında mobil APK derleme",
    feat1Bullet2: "🖥 Express/Node.js sunucusu başlatma ve test etme",
    feat1Bullet3: "🌐 Canlı HTML/JS web önizleme sandbox alanı",
    feat2Title: "🎤 Çoklu AI & Sesli Asistan",
    feat2Desc: "Groq, DeepSeek, OpenAI, Gemini ve Ollama ile sesli iletişim ve akıllı yanıtlar.",
    feat2Bullet1: "🎤 Sesli mesaj tanıma ve Türkçe sesli yanıt",
    feat2Bullet2: "🧠 Groq, DeepSeek, OpenAI, Gemini & OpenRouter desteği",
    feat2Bullet3: "🎭 Yazılımcı, Asistan & Kodlama personası seçenekleri",
    feat3Title: "📅 Akıllı Takvim & Galeriye Aktarım",
    feat3Desc: "Zaman çizelgesi ve ajandanızı JPEG görsel formatında doğrudan cihaz galerisine kaydeder.",
    feat3Bullet1: "📅 Zaman Çizelgesi, Haftalık ve Liste ajanda görünümleri",
    feat3Bullet2: "🖼 Günlük ve Haftalık ajandayı JPEG olarak Galeriye Aktarma",
    feat3Bullet3: "🔔 Hatırlatıcı bildirimleri ve etkinlik takibi",
    feat4Title: "📝 Yapılacaklar, Notlar & Üretkenlik Analizi",
    feat4Desc: "Notlarınızı, yapılacak rutinlerinizi ve günlük istatistiklerinizi tek yerden yönetin.",
    feat4Bullet1: "📝 Tüm notları tek tıkla galeriye JPEG olarak kaydetme",
    feat4Bullet2: "📊 Günlük tamamlama istatistikleri ve analizler",
    feat4Bullet3: "🔒 %100 yerel ve gizlilik odaklı cihaz içi saklama",
    aiProviderTitle: "AI Sağlayıcısı Seçin 🔑",
    aiProviderSub: "Yapay zeka motorunuzu ve API anahtarınızı yapılandırın.",
    nameLabel: "👤 Adınız (İsminiz)",
    namePlaceholder: "Adınızı giriniz...",
    selectLang: "Uygulama Dili",
    selectProvider: "Sağlayıcı Seçin",
    selectModelLabel: "Model Seçimi",
    groqLabel: "Groq Cloud (Bulut, Yüksek Hız)",
    deepseekLabel: "DeepSeek API",
    openaiLabel: "OpenAI (GPT-4o)",
    geminiLabel: "Google Gemini API",
    openrouterLabel: "OpenRouter API",
    ollamaLabel: "Ollama (Yerel Sunucu)",
    apiKeyLabel: "Groq API Key",
    apiKeyDeepseek: "DeepSeek API Key",
    apiKeyOpenAI: "OpenAI API Key",
    apiKeyGemini: "Google Gemini API Key",
    apiKeyOpenRouter: "OpenRouter API Key",
    ollamaUrlLabel: "Ollama Sunucu URL",
    promptWeightLabel: "Sistem Prompt Ağırlığı (Model Hızı)",
    promptWeightHelp: "Yerel modellerin (Ollama) yanıt hızını artırmak için sistem promptunu ve araç tanımlarını hafifletebilirsiniz.",
    promptWeightFull: "⚡⚡⚡ Tam / Gelişmiş (Tüm 17 Araç & Detaylı Rol)",
    promptWeightBalanced: "⚡⚡ Dengeli (Temel Not, Takvim & Görev Araçları)",
    promptWeightMinimal: "⚡ Hızlı / Minimal (Çok Hızlı Yanıt - Hafif Prompt)",
    personaTitle: "Asistan Kişiliğinizi Seçin 🎭",
    personaSub: "Asistanın varsayılan odak alanını belirleyin:",
    completeTitle: "Her Şey Hazır! 🎉",
    completeDesc: "Multitool AI Agent tamamen yapılandırıldı. Artık kullanmaya başlayabilirsiniz.",
    startAppBtn: "Uygulamayı Kullanmaya Başla ✨",
    nextBtn: "İleri",
    backBtn: "Geri",
    setupRestart: "Kurulum Sihirbazını Yeniden Başlat",
    notes: "Notlar",
    notesTitle: "📝 Notlarım",
    newNoteHeader: "Yeni Not Oluştur",
    noteTitlePlaceholder: "Not Başlığı...",
    tagsLabel: "Özel Etiketler",
    tagsPlaceholder: "Özel Etiketler (virgülle ayırın: #proje, #acil)...",
    noteContentPlaceholder: "Not içeriğinizi buraya yazın...",
    saveNoteBtn: "Notu Kaydet",
    searchNotesPlaceholder: "Notlarda veya etiketlerde ara...",
    allTags: "Tüm Etiketler",
    noNotesYet: "Henüz kaydedilmiş not bulunmuyor.",
    newChat: "Yeni Sohbet",
    chatHistory: "Sohbet Geçmişi",
    chatHistoryModalTitle: "Sohbet Geçmişi Kayıtları",
    noSavedChats: "Kayıtlı sohbet bulunmuyor.",
    startNewChatBtn: "Yeni Sohbet Başlat",
    clearCurrentChat: "Mevcut Sohbeti Temizle",
    sendMsg: "Mesaj Gönder",
    isRoutine: "Rutin Görev",
    routineFrequency: "Sıklık",
    daily: "Günlük",
    weekly: "Haftalık",
    monthly: "Aylık",
    routines: "Rutinler",
    activeStatus: "Aktif",
    noKeyStatus: "API Key Yok",
    quickAddTodo: "Görev Ekle",
    quickAddEvent: "Etkinlik Ekle",
    quickVoiceNote: "Sesli Not",
    quickSummary: "Günün Özeti",
    quickSandbox: "Sandbox",
    tabChat: "Sohbet",
    tabNotes: "Notlar",
    tabCalendar: "Takvim",
    tabTodos: "Yapılacaklar",
    tabAnalytics: "Analiz",
    tabSandbox: "Sandbox",
    welcomeGreeting: "Merhaba! Ben sizin Multitool AI Asistanınızım. Size nasıl yardımcı olabilirim?",
    newChatGreeting: "Merhaba! Yeni bir sohbet başlattık. Size nasıl yardımcı olabilirim?",
    chatTitlePrefix: "Sohbet",
    lowPriority: "Düşük Öncelik",
    medPriority: "Orta Öncelik",
    highPriority: "Yüksek Öncelik",
    noTasksFound: "Görev bulunamadı.",
    archivedTasks: "Arşivlenmiş Görevler",
    clearArchive: "Arşivi Temizle",
    archived: "Arşivlendi",
    viewFlow: "Akış",
    viewWeekly: "Haftalık",
    viewList: "Liste",
    emptyTimeSlot: "Boş Zaman Dilimi",
    addEvent: "Etkinlik Ekle",
    eventTitlePlaceholder: "Etkinlik Başlığı...",
    eventStartTime: "⏰ Başlangıç Saati",
    eventEndTime: "⌛ Bitiş Saati",
    eventDate: "📅 Tarih",
    eventDescPlaceholder: "Açıklama (Opsiyonel)",
    saveEventBtn: "Etkinlik Kaydet",
    analyticsHeader: "📊 AI Analiz & Rutinler",
    getReportNotif: "🔔 Rapor Bildirimi Al",
    todaysSummary: "📌 Bugünün Özeti",
    taskStatus: "Görev Durumu:",
    todaySchedule: "Bugünkü Program:",
    dailyRoutines: "Günlük Rutinler:",
    completedTasksLabel: "Biten Görev",
    eventsLabel: "Etkinlik",
    routinesLabel: "Rutin",
    habitsHeader: "Günlük Alışkanlıklar & Rutinler",
    addRoutineBtn: "+ Rutin Ekle",
    noRoutinesYet: "Henüz kayıtlı rutin yok.",
    aiAdviceHeader: "AI Kişisel Verimlilik Önerisi",
    sandboxHeader: "💻 Kod & Localhost Sandbox",
    editorTab: "✏️ Editör",
    livePreviewTab: "🌐 Canlı Önizleme",
    filesTab: "📂 Dosyalar",
    liveSandboxPreview: "🌐 Canlı Web Sandbox Önizlemesi",
    refreshBtn: "Yenile",
    sandboxFolderLabel: "Sandbox Klasörü (./sandbox)",
    sandboxEmpty: "Klasör boş.",
    openNewFile: "Yeni Dosya Aç:",
    openBtn: "Aç",
    selectTemplate: "🚀 Şablon Seç...",
    expressTemplate: "⚡ Express API Sunucusu",
    reactTemplate: "⚛️ React Bileşeni",
    htmlTemplate: "🎨 HTML5 Sayfa",
    runBtn: "Çalıştır",
    saveBtn: "Kaydet",
    languageLabel: "Dil",
    settingsTitle: "⚙️ Ayarlar",
    userProfileLabel: "👤 Kullanıcı Profili & Bildirimler",
    yourNameLabel: "Adınız (İsminiz)",
    testNotificationBtn: "Test Bildirimi Gönder",
    notificationSent: "Bildirim gönderildi!",
    themeLabel: "Tema & Görsel Tasarım Paketleri",
    aiProviderSettingsLabel: "Yapay Zeka Servis Sağlayıcısı",
    providerSelectLabel: "Sağlayıcı Seçin",
    loadingModels: "Modeller yükleniyor...",
    saveAndTestBtn: "Kaydet ve Bağlantıyı Sına",
    aboutTitle: "Hakkında & Detaylar",
    checkUpdatesBtn: "Güncellemeleri Kontrol Et",
    checkingUpdates: "Güncellemeler kontrol ediliyor...",
    updateAvailableTitle: "🚀 Yeni Güncelleme Mevcut!",
    updateAvailableSub: "Multitool AI {version} sürümü yayınlandı. Şimdi indirip kurabilirsiniz.",
    btnDownloadUpdate: "⚡ Güncellemeyi İndir ve Kur",
    btnDismissUpdate: "Daha Sonra",
    updateCheckFailed: "Güncelleme kontrolü başarısız oldu. İnternet bağlantınızı kontrol edin.",
    upToDateMsg: "Uygulamanız güncel (v1.1.0).",
    releaseNotesLabel: "Yayın Notları:",
    aboutDesc: "Bu uygulama Self-Coding AI ve Localhost Node.js destekli mobil asistandır (Multitool).",
    versionLabel: "Sürüm",
    architectureLabel: "Mimari",
    buildLabel: "Derleme",
    databaseLabel: "Veritabanı",
    backupTitle: "Veri Yedekleme & Geri Yükleme",
    backupDesc: "Tüm takvim, görev, sohbet ve sandbox verilerinizi JSON formatında yedekleyin veya içe aktarın.",
    exportBtn: "Dışa Aktar (Yedekle)",
    importBtn: "İçe Aktar",
    systemLogsTitle: "Sistem Logları",
    noLogs: "Log kaydı yok.",
    setupWizardTitle: "🚀 Kurulum Sihirbazı",
    setupWizardDesc: "AI sağlayıcınızı ve varsayılan rolünüzü yeniden yapılandırmak için sihirbazı tekrar çalıştırın.",
    setupWizardRestartBtn: "Kurulum Sihirbazını Yeniden Başlat",
    calendarTitle: "📅 Takvim & Program",
    scheduleLabel: "Programı",
    viewTimeline: "Akış",
    todosTitle: "✔️ Yapılacaklar & Rutinler",
    completionRateLabel: "Genel Tamamlanma Oranı",
    activeLabel: "Aktif",
    completedLabel: "Tamamlanan",
    archivedLabel: "Arşivlenen",
    allTasksLabel: "Tüm Görevler",
    normalTasksLabel: "Normal Görevler",
    routinesTabLabel: "🔄 Rutinler",
    todoPlaceholder: "Yapılacak iş veya rutin görevi...",
    priorityLow: "Düşük Öncelik",
    priorityMedium: "Orta Öncelik",
    priorityHigh: "Yüksek Öncelik",
    freqDaily: "Her Gün (Günlük)",
    freqWeekly: "Her Hafta (Haftalık)",
    freqMonthly: "Her Ay (Aylık)",
    addTaskBtn: "Görev Ekle",
    voiceNoteBtn: "Sesli Not",
    dueDateLabel: "Son Gün",
    routineTagDaily: "Günlük",
    routineTagWeekly: "Haftalık",
    routineTagMonthly: "Aylık",
    completedTag: "Tamamlandı",
    archivedTasksHeader: "Arşivlenmiş Görevler",
    clearArchiveConfirm: "Arşivlenmiş tüm görevleri temizlemek istediğinize emin misiniz?",
    analyticsTitle: "📊 AI Analiz & Rutinler",
    getReportBtn: "Rapor Bildirimi Al",
    todaySummaryHeader: "Bugünün Özeti",
    taskStatusLabel: "Görev Durumu:",
    todayScheduleLabel: "Bugünkü Program:",
    dailyRoutinesLabel: "Günlük Rutinler:",
    completedTasksGrid: "Biten Görev",
    eventsGrid: "Etkinlik",
    routineGrid: "Rutin",
    dailyHabitsHeader: "Günlük Alışkanlıklar & Rutinler",
    addRoutinePrompt: "Yeni Alışkanlık / Rutin Adı:",
    streakDays: "Gün",
    aiProductivityHeader: "AI Kişisel Verimlilik Önerisi",
    sandboxTitle: "💻 Kod & Localhost Sandbox",
    previewTab: "Canlı Önizleme",
    livePreviewTitle: "Canlı Web Sandbox Önizlemesi",
    sandboxFolderEmpty: "Klasör boş. AI burada dosya oluşturabilir veya siz yeni dosya açabilirsiniz.",
    newFileOpen: "Yeni Dosya Aç:",
    localhostServerBtn: "Localhost Sunucu (3005)",
    exportHtmlBtn: "Dışa Aktar (HTML)",
    buildApkBtn: "Yeni APK Derle",
    buildingApk: "Derleniyor...",
    consoleTitle: "Konsol Çıktısı & Sunucu Logları",
    clearBtn: "Temizle",
    personaCoder: "🛠️ Self-Coder",
    personaCoderDesc: "Kod yazma, sunucu çalıştırma ve APK derlemeye odaklanır.",
    personaOrganizer: "📅 Organizatör",
    personaOrganizerDesc: "Takvim, ajanda ve yapılacaklar yönetimine odaklanır.",
    personaWriter: "✍️ Yazar",
    personaWriterDesc: "Özetleme, e-posta, metin yazımı ve çeviriye odaklanır.",
    personaAnalyst: "🧠 Analist",
    personaAnalystDesc: "Adım adım problem analizi için derin mantık odağı.",
    speechNotSupported: "Cihazınızda ses tanıma özelliği desteklenmiyor veya aktif değil.",
    speechNotSupportedWeb: "Cihazınızda web ses tanıma desteklenmiyor veya izin verilmeyen bir tarama modundasınız.",
    voiceTaskRecorded: "Sesli görev kaydedildi",
    newVoiceTaskNotifTitle: "Yeni Sesli Görev 🎙️",
    newVoiceTaskNotifBody: "Görev",
    backupError: "Yedek oluşturulurken hata",
    importSuccess: "Tüm verileriniz başarıyla içe aktarıldı!",
    importError: "Yedek içe aktarma hatası",
    fileSaved: "dosyası kaydedildi.",
    deleteFileConfirm: "dosyasını silmek istediğinize emin misiniz?",
    deleteNoteConfirm: "Bu notu silmek istediğinize emin misiniz?",
    noModelError: "Henüz bir model seçilmedi. Lütfen Ayarlar sekmesinden bir model seçin.",
    noOllamaModelError: "Ollama model seçilmedi. Lütfen Ayarlar sekmesinden Ollama URL'sini kontrol edin.",
    downloadApkTitle: "Güncel APK'yı İndir",
    downloadApkBtn: "APK İndir",
    messagesCount: "mesaj",
    deleteChat: "Sohbeti Sil",
    catAll: "Tümü",
    catGeneral: "Genel",
    catIdea: "Fikir",
    catWork: "İş",
    catPersonal: "Kişisel",
    catCode: "Kod",
    buildApkPrompt: "Bana yeni bir APK derleyip indirme bağlantısı verir misin?",
    buildApkCardTitle: "Otomatik APK Derle",
    buildApkCardSub: "Vite + Capacitor + Gradle ile derleme yap",
    reminderMinBefore: "dk önce",
    newFileContent: "// Yeni dosya içeriği...",
    aiAdviceEmpty: "henüz eklenmiş bir görev veya rutin bulunmuyor. Yapılacaklar sekmesinden yeni görev ekleyerek verimlilik takibinizi başlatabilirsiniz!",
    aiAdviceProgress: "bugün toplam görev ve rutin tamamladın. Harika bir ilerleme! 🚀",
    selectModelPlaceholder: "Model Seçiniz...",
    scanModels: "Modelleri Tara",
    scanningModels: "Modeller taranıyor...",
    cancelBtn: "İptal",
    other: "Diğer",
    resultLabel: "Sonuç:",
    paramsLabel: "Parametreler:",
    errorLabel: "Hata:",
    noEventsDay: "Seçili gün için kayıtlı etkinlik yok.",
    noEventsDate: "Bu tarih için kayıtlı etkinlik yok.",
    eventsForDateSuffix: "Etkinlikleri",
    eventStartDate: "📅 Başlangıç Tarihi",
    eventDuration: "⏱️ Süre (saat): girilince bitiş otomatik ayarlanır",
    durationPlaceholder: "örn. 1.5",
    eventEndDate: "📅 Bitiş Tarihi",
    eventReminder: "🔔 Hatırlatıcı",
    eventAddAttachment: "📎 Resim / Dosya Ekle",
    reminderOnTime: "Zamanında",
    reminderHourBefore: "1 saat önce",
    chatAssistantHeader: "Multitool Self-Coding Asistanı",
    voiceListeningTitle: "Dinleniyor... (Durdurmak için tıklayın)",
    voiceWriteTitle: "Sesli Yaz",
    archiveBtn: "Arşivle",
    archivedRoutinesHeader: "Arşivlenen Rutinler",
    restoreBtn: "Geri yükle",
    deletePermBtn: "Kalıcı olarak sil",
    sandboxPreviewTitle: "Sandbox Canlı Önizleme",
    namePlaceholderExample: "ör. Doruk",
    themeSlate: "🌙 Arduvaz Koyu",
    themeCyberpunk: "⚡ Siberpunk Neon",
    themeEmerald: "🌿 Nane Zümrüt",
    themeOled: "✨ OLED Altın",
    themeDefaultLight: "☀️ Saf Aydınlık",
    versionFullLabel: "Multitool AI • Sürüm v1.1.0",
    versionFooterLabel: "Multitool AI • Sürüm 1.1.0",
    prevMonthTitle: "Önceki Ay",
    nextMonthTitle: "Sonraki Ay",
    todayBtn: "Bugün",
    notifTaskRoutine: "Görev / Rutin",
    notifTasks: "Görev",
    notifRoutines: "Rutin",
    chatPlaceholder: "Mesajınızı yazın veya konuşun...",
    autoTtsLabel: "AI Yanıtlarını Otomatik Seslendir (TTS)",
    autoTtsHelp: "Yapay zeka yanıtlarını metinden sese (TTS) dönüştürerek otomatik oku.",
    listenBtn: "Seslendir",
    stopListenBtn: "Durdur",
    tipsCardTitle: "📌 Multitool AI Kullanım İpuçları",
    tipsCardContent: "Yapay zeka ile sohbet ederken takviminize etkinlik ekletebilir, yapılacaklar listenizi güncellettirebilir veya not yazdırabilirsiniz!",
    thinkingProcess: "🧠 Düşünme Süreci",
    notifUpcomingEvent: "⏰ Yaklaşan Etkinlik Uyarısı!",
    notifEventTime: "📅 Etkinlik Zamanı Geldi!",
    notifMinutesLeft: "dakika kaldı",
    notifStartingNow: "başlama zamanı geldi",
    notifNewRoutine: "Yeni Rutin Eklendi 🔄",
    notifNewTask: "Yeni Görev Eklendi ✔️",
    confirmDeleteHabit: '"{title}" kalıcı olarak silinsin mi? Bu işlem geri alınamaz.',
    confirmClearChatHistory: "Sohbet geçmişini tamamen silmek istediğinize emin misiniz?",
    logRoutineArchived: 'Rutin arşivlendi: "{title}"',
    logRoutineRestored: 'Rutin arşivden geri yüklendi: "{title}"',
    logRoutineDeleted: 'Rutin kalıcı olarak silindi: "{title}"',
    logSpeechUnsupported: "Ses tanıma API desteklenmiyor.",
    logVoiceStarted: "Sesli dinleme başladı...",
    logVoiceError: "Sesli dinleme hatası:",
    logVoiceStartFailed: "Sesli dinleme başlatılamadı:",
    logBackupDownloaded: "Veri yedeği indirildi.",
    logBackupImported: "Yedek veriler başarıyla içe aktarıldı.",
    logAutoArchived: "{count} tamamlanan görev 24 saat geçtiği için arşive taşındı.",
    logChatHistoryLoadError: "Sohbet geçmişi yüklenemedi:",
    logNoApiKey: '{label} API Key yok: gömülü model listesi gösteriliyor. Canlı tarama için key girip "Modelleri Tara"ya basın.',
    logScanningProvider: "{provider} modelleri taranıyor...",
    logOllamaNoModel: "Ollama üzerinde model bulunamadı: önce Ollama sunucusunu başlatın ve model indirin.",
    logScanError: "{provider} model tarama hatası:",
    logCalendarFetchError: "Takvim etkinlikleri alınamadı:",
    logTodosFetchError: "Yapılacaklar alınamadı:",
    logSandboxFetchError: "Sandbox dosyaları alınamadı:",
    logFileTooBig: "'{name}' çok büyük (>2MB), eklenmedi.",
    logTodoAddError: "Yapılacak eklenirken hata:",
    logTodoUpdateError: "Yapılacak güncellenirken hata:",
    logTodoDeleteError: "Yapılacak silinirken hata:",
    logToolSuccess: "Araç {tool} yürütmesi başarılı.",
    logToolFailed: "Araç {tool} yürütmesi başarısız:",
    logChatRunError: "Sohbet yürütme hatası:",
    logAiApkStart: "AI APK derlemesi başlattı...",
    logAiModifySource: "AI uygulama kaynak kodunu değiştiriyor:",
    logAiServerStart: "AI {port} portunda localhost sunucusu başlatıyor",
    termReady: "Terminal hazır. Kodu veya Localhost sunucusunu çalıştırmak için butonları kullanın.\n",
    termRunning: "Çalıştırılıyor: {file}...",
    termRuntimeError: "Çalışma Zamanı Hatası:",
    termApkBuildStarted: "Yeni APK derlemesi başlatıldı (Vite + Capacitor + Gradle)...",
    termSuccess: "BAŞARILI",
    termDownloadLink: "İndirme Linki",
    termError: "HATA",
    termApkBuildFailed: "APK derleme başarısız",
    termConnError: "İletişim Hatası",
    termLocalhostUnreachable: "Localhost sunucusuna erişilemedi:",
    termServerStarting: "Localhost Sunucusu başlatılıyor...",
    termServerActive: "SUNUCU AKTİF",
    termEndpoint: "Endpoint",
    termLogs: "Loglar",
    termServerStartFailed: "Sunucu başlatılamadı:",
    termCodeSuccess: "Kod başarıyla çalıştırıldı (Exit Code: {code}).",
    termOutput: "Çıktı / Geri Dönüş:",
    termProgramDone: "Program başarıyla tamamlandı (Çıktı üretilmedi).",
    toolCallLabel: "Araç Çağrısı:",
    errChatComm: "Model ile iletişim kurulurken bir hata oluştu:",
    errTodoNotFound: "İş bulunamadı",
    errFileNotFound: "Dosya bulunamadı: {filename}",
    errOfflineJsOnly: "Offline modda sadece JavaScript kodları çalıştırılabilir.",
    errUnknownTool: "Bilinmeyen araç: {tool}",
    errApkBuildFailed: "APK derlemesi başarısız",
    errSourceUpdateFailed: "Kaynak güncellemesi başarısız",
    errServerStartFailed: "Sunucu başlatılamadı",
    errProviderResp: "{provider} yanıtı başarılı değil",
    errProviderNoModel: "{provider} model bulunamadı",
    errApiKeyNotSet: "{provider} API Key ayarlanmamış.",
    errConnError: "Bağlantı hatası: {status} {body}",
    systemFeedback: "[Sistem Geri Bildirimi] Araç {tool} çalıştırıldı. Sonuç: {result}",
    toolApkBuildDone: "Yeni APK derlemesi başarıyla tamamlandı ve masaüstüne yerleştirildi!",
    sandboxOutputTitle: "Sandbox Çıktısı",
    consolePreviewTitle: "Console/JS Önizleme",
    setupIntroTagline: "Cebindeki AI geliştirici asistanı: kodla, sohbet et, otomatikleştir ve APK'ı telefonundan derle.",
    setupIntroCta: "Başlayalım 🚀",
    setupStepLabel: "Adım {n} / {total}",
    setupStepIntro: "Karşılama",
    setupStepPersonalize: "Kişiselleştir",
    setupStepFeatures: "Yetenekler",
    setupStepProvider: "AI Sağlayıcı",
    setupStepPersona: "Persona",
    setupStepAppearance: "Görünüm",
    setupStepReview: "Özet",
    setupStepDone: "Hazır",
    appearanceTitle: "🎨 Tarzını Seç",
    appearanceSub: "Bir tema seç: istediğin zaman Ayarlar'dan değiştirebilirsin.",
    reviewTitle: "📋 Son Kontrol",
    reviewSub: "Kurulumun hazır. İstersen düzelt, sonra başlat!",
    reviewNameLbl: "İsim",
    reviewLangLbl: "Dil",
    reviewProviderLbl: "AI Sağlayıcı",
    reviewPersonaLbl: "Persona",
    reviewThemeLbl: "Tema",
    reviewLooksGood: "Harika • Başlat 🚀",
    setupPersonalizeTitle: "Multitool'u Kişiselleştirelim",
    setupPersonalizeSub: "Başlamak için adını ve dilini seç.",
    downloadDayJpeg: "📥 Günü İndir (JPEG)",
    downloadWeekJpeg: "📥 Haftayı İndir (JPEG)",
    downloadNoteJpeg: "📥 Galeriye Kaydet (JPEG)",
    downloadAllNotesJpeg: "📥 Tüm Notları Kaydet (JPEG)",
    noteCardTitle: "Kişisel Not",
    notesOverviewTitle: "Notlar Özeti",
    logNoteSavedGallery: "Not galeriye kaydedildi",
    agendaCardTitle: "Günlük Program",
    weeklyAgendaTitle: "Haftalık Program",
    agendaNoEventsCard: "Bu gün için etkinlik yok.",
    agendaEventsCount: "{n} etkinlik",
    agendaAllDay: "Tüm gün",
    agendaGeneratedBy: "Multitool AI tarafından oluşturuldu",
  },
  de: {
    welcomeTitle: "Willkommen bei Multitool AI",
    welcomeDesc: "Ihr intelligenter persönlicher Assistent, Sandbox zur Codeausführung auf dem Gerät und Kalenderorganisator.",
    discoverFeatures: "Sprache wählen & Starten 🚀",
    exploreBtn: "Funktionen erkunden & Starten 🚀",
    featuresTitle: "Was können Sie tun? ⚡",
    featuresSub: "Hauptfunktionen der Multitool-Plattform:",
    feat1Title: "🛠️ Self-Coding & Localhost Sandbox",
    feat1Desc: "Quellcode bearbeiten, neue APKs kompilieren und Localhost Node.js-Server ausführen.",
    feat1Bullet1: "⚡ Sofortiger APK-Build mit Vite + Capacitor",
    feat1Bullet2: "🖥 Express/Node.js-Server lokal starten und testen",
    feat1Bullet3: "🌐 Live HTML/JS Web-Vorschau Sandbox",
    feat2Title: "🎤 Multi-KI & Sprachassistent",
    feat2Desc: "Sprachassistent mit Groq, DeepSeek, OpenAI, Gemini und Ollama.",
    feat2Bullet1: "🎤 Spracherkennung und Sprachausgabe",
    feat2Bullet2: "🧠 Unterstützung für Groq, DeepSeek, OpenAI, Gemini & OpenRouter",
    feat2Bullet3: "🎭 Entwickler-, Assistenten- & Persona-Modi",
    feat3Title: "📅 Smart Kalender & Galerie-Export",
    feat3Desc: "Tages- und Wochenagenden als JPEG-Bilder direkt in die Galerie speichern.",
    feat3Bullet1: "📅 Zeitachsen-, Wochen- und Listen-Agendansichten",
    feat3Bullet2: "🖼 Tages- und Wochenagenda als JPEG in Galerie speichern",
    feat3Bullet3: "🔔 Erinnerungen und intelligente Benachrichtigungen",
    feat4Title: "📝 Aufgaben, Notizen & Analysen",
    feat4Desc: "Verwalten Sie Notizen, Aufgaben und Produktivitätsstatistiken.",
    feat4Bullet1: "📝 Alle Notizen mit einem Klick als JPEG exportieren",
    feat4Bullet2: "📊 Produktivitätsanalysen und Fertigstellungsraten",
    feat4Bullet3: "🔒 100% lokaler, datenschutzorientierter Speicher",
    aiProviderTitle: "KI-Anbieter Einrichtung 🔑",
    aiProviderSub: "Konfigurieren Sie Ihren KI-Anbieter und API-Schlüssel.",
    nameLabel: "👤 Ihr Name",
    namePlaceholder: "Geben Sie Ihren Namen ein...",
    selectLang: "App-Sprache",
    selectProvider: "Anbieter auswählen",
    selectModelLabel: "Modellauswahl",
    groqLabel: "Groq Cloud (Hochgeschwindigkeit)",
    deepseekLabel: "DeepSeek API",
    openaiLabel: "OpenAI (GPT-4o)",
    geminiLabel: "Google Gemini API",
    openrouterLabel: "OpenRouter API",
    ollamaLabel: "Ollama (Lokaler Server)",
    apiKeyLabel: "Groq API-Schlüssel",
    apiKeyDeepseek: "DeepSeek API-Schlüssel",
    apiKeyOpenAI: "OpenAI API-Schlüssel",
    apiKeyGemini: "Google Gemini API-Schlüssel",
    apiKeyOpenRouter: "OpenRouter API-Schlüssel",
    ollamaUrlLabel: "Ollama Server URL",
    promptWeightLabel: "System-Prompt-Komplexität (Modellgeschwindigkeit)",
    promptWeightHelp: "Reduzieren Sie die Prompt-Länge, um lokale Modelle (Ollama) deutlich zu beschleunigen.",
    promptWeightFull: "⚡⚡⚡ Vollständig (Alle 17 Werkzeuge & Detaillierte Persona)",
    promptWeightBalanced: "⚡⚡ Ausgewogen (Notizen-, Kalender- & Aufgaben-Werkzeuge)",
    promptWeightMinimal: "⚡ Schnell / Minimal (Ultra-Schnelle Antwort - Leicht)",
    personaTitle: "Assistenten-Persona wählen 🎭",
    personaSub: "Wählen Sie den primären Fokus Ihres Assistenten:",
    completeTitle: "Alles bereit! 🎉",
    completeDesc: "Multitool AI Agent ist vollständig konfiguriert.",
    startAppBtn: "Multitool starten ✨",
    nextBtn: "Weiter",
    backBtn: "Zurück",
    setupRestart: "Setup-Assistenten neustarten",
    setupSkip: "Einrichtung überspringen ⏭️",
    notes: "Notizen",
    notesTitle: "📝 Meine Notizen",
    newNoteHeader: "Neue Notiz erstellen",
    noteTitlePlaceholder: "Notiztitel...",
    tagsLabel: "Eigene Tags",
    tagsPlaceholder: "Tags (kommagetrennt: #projekt, #dringend)...",
    noteContentPlaceholder: "Notizinhalt hier schreiben...",
    saveNoteBtn: "Notiz speichern",
    searchNotesPlaceholder: "Notizen oder Tags suchen...",
    allTags: "Alle Tags",
    noNotesYet: "Keine gespeicherten Notizen gefunden.",
    newChat: "Neuer Chat",
    chatHistory: "Chat-Verlauf",
    chatHistoryModalTitle: "Gespeicherter Chat-Verlauf",
    noSavedChats: "Keine gespeicherten Chats vorhanden.",
    startNewChatBtn: "Neuen Chat starten",
    clearCurrentChat: "Aktuellen Chat löschen",
    sendMsg: "Nachricht senden",
    isRoutine: "Routinetask",
    routineFrequency: "Häufigkeit",
    daily: "Täglich",
    weekly: "Wöchentlich",
    monthly: "Monatlich",
    routines: "Routinen",
    activeStatus: "Aktiv",
    noKeyStatus: "Kein API-Schlüssel",
    quickAddTodo: "Aufgabe hinzufügen",
    quickAddEvent: "Termin hinzufügen",
    quickVoiceNote: "Sprachnotiz",
    quickSummary: "Tagesübersicht",
    quickSandbox: "Sandbox",
    tabChat: "Chat",
    tabNotes: "Notizen",
    tabCalendar: "Kalender",
    tabTodos: "Aufgaben",
    tabAnalytics: "Analytik",
    tabSandbox: "Sandbox",
    welcomeGreeting: "Hallo! Ich bin Ihr Multitool KI-Assistent. Wie kann ich Ihnen helfen?",
    newChatGreeting: "Hallo! Ein neuer Chat wurde gestartet. Wie kann ich Ihnen helfen?",
    chatTitlePrefix: "Chat",
    lowPriority: "Niedrige Priorität",
    medPriority: "Mittlere Priorität",
    highPriority: "Hohe Priorität",
    noTasksFound: "Keine Aufgaben gefunden.",
    archivedTasks: "Archivierte Aufgaben",
    clearArchive: "Archiv leeren",
    archived: "Archiviert",
    viewFlow: "Ablauf",
    viewWeekly: "Wöchentlich",
    viewList: "Liste",
    emptyTimeSlot: "Freies Zeitfenster",
    addEvent: "Ereignis hinzufügen",
    eventTitlePlaceholder: "Titel des Ereignisses...",
    eventStartTime: "⏰ Startzeit",
    eventEndTime: "⌛ Endzeit",
    eventDate: "📅 Datum",
    eventDescPlaceholder: "Beschreibung (Optional)",
    saveEventBtn: "Ereignis speichern",
    analyticsHeader: "📊 KI-Analytik & Routinen",
    getReportNotif: "🔔 Berichtssignal erhalten",
    todaysSummary: "📌 Tageszusammenfassung",
    taskStatus: "Aufgabenstatus:",
    todaySchedule: "Heutiger Zeitplan:",
    dailyRoutines: "Tägliche Routinen:",
    completedTasksLabel: "Erledigte Aufgaben",
    eventsLabel: "Ereignisse",
    routinesLabel: "Routinen",
    habitsHeader: "Tägliche Gewohnheiten & Routinen",
    addRoutineBtn: "+ Routine hinzufügen",
    noRoutinesYet: "Noch keine Routinen registriert.",
    aiAdviceHeader: "KI-Produktivitätseinblicke",
    sandboxHeader: "💻 Code & Localhost Sandbox",
    editorTab: "✏️ Editor",
    livePreviewTab: "🌐 Live-Vorschau",
    filesTab: "📂 Dateien",
    liveSandboxPreview: "🌐 Live-Web-Sandbox-Vorschau",
    refreshBtn: "Aktualisieren",
    sandboxFolderLabel: "Sandbox-Ordner (./sandbox)",
    sandboxEmpty: "Ordner ist leer.",
    openNewFile: "Neue Datei öffnen:",
    openBtn: "Öffnen",
    selectTemplate: "🚀 Vorlage auswählen...",
    expressTemplate: "⚡ Express API-Server",
    reactTemplate: "⚛️ React-Komponente",
    htmlTemplate: "🎨 HTML5-Seite",
    runBtn: "Ausführen",
    saveBtn: "Speichern",
    languageLabel: "Sprache",
    settingsTitle: "⚙️ Einstellungen",
    userProfileLabel: "👤 Benutzerprofil & Benachrichtigungen",
    yourNameLabel: "Ihr Name",
    testNotificationBtn: "Testbenachrichtigung senden",
    notificationSent: "Benachrichtigung gesendet!",
    themeLabel: "Design & Visuelle Pakete",
    aiProviderSettingsLabel: "KI-Dienstanbieter",
    providerSelectLabel: "Anbieter auswählen",
    loadingModels: "Modelle werden geladen...",
    saveAndTestBtn: "Speichern & Verbindung testen",
    aboutTitle: "Über & Details",
    checkUpdatesBtn: "Auf Updates prüfen",
    checkingUpdates: "Suche nach Updates...",
    updateAvailableTitle: "🚀 Neues Update verfügbar!",
    updateAvailableSub: "Multitool AI Version {version} ist verfügbar. Jetzt herunterladen und installieren.",
    btnDownloadUpdate: "⚡ Update herunterladen & installieren",
    btnDismissUpdate: "Später",
    updateCheckFailed: "Update-Prüfung fehlgeschlagen. Bitte Netzverbindung prüfen.",
    upToDateMsg: "Ihre App ist auf dem neuesten Stand (v1.1.0).",
    releaseNotesLabel: "Versionshinweise:",
    aboutDesc: "Diese App ist ein mobiler Assistent mit Self-Coding KI und Localhost Node.js-Unterstützung (Multitool).",
    versionLabel: "Version",
    architectureLabel: "Architektur",
    buildLabel: "Build",
    databaseLabel: "Datenbank",
    backupTitle: "Datensicherung & Wiederherstellung",
    backupDesc: "Sichern oder importieren Sie alle Kalender-, Aufgaben-, Chat- und Sandbox-Daten im JSON-Format.",
    exportBtn: "Exportieren (Sichern)",
    importBtn: "Importieren",
    systemLogsTitle: "Systemprotokolle",
    noLogs: "Keine Protokolleinträge.",
    setupWizardTitle: "🚀 Einrichtungsassistent",
    setupWizardDesc: "Starten Sie den Einrichtungsassistenten neu, um Ihren KI-Anbieter und die Standardrolle neu zu konfigurieren.",
    setupWizardRestartBtn: "Einrichtungsassistenten neu starten",
    calendarTitle: "📅 Kalender & Zeitplan",
    scheduleLabel: "Zeitplan",
    viewTimeline: "Ablauf",
    todosTitle: "✔️ Aufgaben & Routinen",
    completionRateLabel: "Gesamtabschlussrate",
    activeLabel: "Aktiv",
    completedLabel: "Abgeschlossen",
    archivedLabel: "Archiviert",
    allTasksLabel: "Alle Aufgaben",
    normalTasksLabel: "Normale Aufgaben",
    routinesTabLabel: "🔄 Routinen",
    todoPlaceholder: "Aufgabe oder Routine...",
    priorityLow: "Niedrige Priorität",
    priorityMedium: "Mittlere Priorität",
    priorityHigh: "Hohe Priorität",
    freqDaily: "Jeden Tag (Täglich)",
    freqWeekly: "Jede Woche (Wöchentlich)",
    freqMonthly: "Jeden Monat (Monatlich)",
    addTaskBtn: "Aufgabe hinzufügen",
    voiceNoteBtn: "Sprachnotiz",
    dueDateLabel: "Fälligkeitsdatum",
    routineTagDaily: "Täglich",
    routineTagWeekly: "Wöchentlich",
    routineTagMonthly: "Monatlich",
    completedTag: "Abgeschlossen",
    archivedTasksHeader: "Archivierte Aufgaben",
    clearArchiveConfirm: "Sind Sie sicher, dass Sie alle archivierten Aufgaben löschen möchten?",
    analyticsTitle: "📊 KI-Analytik & Routinen",
    getReportBtn: "Berichtssignal erhalten",
    todaySummaryHeader: "Tageszusammenfassung",
    taskStatusLabel: "Aufgabenstatus:",
    todayScheduleLabel: "Heutiger Zeitplan:",
    dailyRoutinesLabel: "Tägliche Routinen:",
    completedTasksGrid: "Erledigte Aufgaben",
    eventsGrid: "Ereignisse",
    routineGrid: "Routinen",
    dailyHabitsHeader: "Tägliche Gewohnheiten & Routinen",
    addRoutinePrompt: "Neue Gewohnheit / Routine Name:",
    streakDays: "Tage",
    aiProductivityHeader: "KI-Produktivitätseinblicke",
    sandboxTitle: "💻 Code & Localhost Sandbox",
    previewTab: "Live-Vorschau",
    livePreviewTitle: "Live-Web-Sandbox-Vorschau",
    sandboxFolderEmpty: "Ordner ist leer. KI kann hier Dateien erstellen oder Sie können neue Dateien öffnen.",
    newFileOpen: "Neue Datei öffnen:",
    localhostServerBtn: "Localhost Server (3005)",
    exportHtmlBtn: "Exportieren (HTML)",
    buildApkBtn: "Neue APK erstellen",
    buildingApk: "Wird kompiliert...",
    consoleTitle: "Konsolenausgabe & Serverprotokolle",
    clearBtn: "Löschen",
    personaCoder: "🛠️ Self-Coder",
    personaCoderDesc: "Fokus auf Coding, Server und APK-Kompilierung.",
    personaOrganizer: "📅 Organisator",
    personaOrganizerDesc: "Fokus auf Kalender, Agenda und Aufgabenverwaltung.",
    personaWriter: "✍️ Schreiber",
    personaWriterDesc: "Fokus auf Zusammenfassung, E-Mails, Texte und Übersetzung.",
    personaAnalyst: "🧠 Analyst",
    personaAnalystDesc: "Tiefe Logik für schrittweise Problemanalyse.",
    speechNotSupported: "Spracherkennung wird auf Ihrem Gerät nicht unterstützt oder ist nicht aktiv.",
    speechNotSupportedWeb: "Web-Spracherkennung wird auf Ihrem Gerät nicht unterstützt.",
    voiceTaskRecorded: "Sprachaufgabe aufgenommen",
    newVoiceTaskNotifTitle: "Neue Sprachaufgabe 🎙️",
    newVoiceTaskNotifBody: "Aufgabe",
    backupError: "Fehler beim Erstellen der Sicherung",
    importSuccess: "Alle Ihre Daten wurden erfolgreich importiert!",
    importError: "Fehler beim Importieren der Sicherung",
    fileSaved: "Datei gespeichert.",
    deleteFileConfirm: "Möchten Sie diese Datei wirklich löschen?",
    deleteNoteConfirm: "Möchten Sie diese Notiz wirklich löschen?",
    noModelError: "Modell nicht gefunden. Bitte geben Sie einen gültigen API-Schlüssel in den Einstellungen ein.",
    noOllamaModelError: "Kein Ollama-Modell ausgewählt. Bitte prüfen Sie die Ollama-URL in den Einstellungen.",
    downloadApkTitle: "Neueste APK herunterladen",
    downloadApkBtn: "APK herunterladen",
    messagesCount: "Nachrichten",
    deleteChat: "Chat löschen",
    catAll: "Alle",
    catGeneral: "Allgemein",
    catIdea: "Idee",
    catWork: "Arbeit",
    catPersonal: "Persönlich",
    catCode: "Code",
    buildApkPrompt: "Kannst du eine neue APK erstellen und mir einen Download-Link geben?",
    buildApkCardTitle: "Automatische APK erstellen",
    buildApkCardSub: "Mit Vite + Capacitor + Gradle kompilieren",
    reminderMinBefore: "Min. vorher",
    newFileContent: "// Neuer Dateiinhalt...",
    aiAdviceEmpty: "Noch keine Aufgaben oder Routinen hinzugefügt. Starten Sie Ihre Produktivitätsverfolgung!",
    aiAdviceProgress: "heute Aufgaben und Routinen abgeschlossen. Toller Fortschritt! 🚀",
    selectModelPlaceholder: "Modell auswählen...",
    scanModels: "Modelle scannen",
    scanningModels: "Modelle werden gescannt...",
    cancelBtn: "Abbrechen",
    other: "Andere",
    resultLabel: "Ergebnis:",
    paramsLabel: "Parameter:",
    errorLabel: "Fehler:",
    noEventsDay: "Für den ausgewählten Tag sind keine Ereignisse registriert.",
    noEventsDate: "Für dieses Datum sind keine Ereignisse registriert.",
    eventsForDateSuffix: "Ereignisse",
    eventStartDate: "📅 Startdatum",
    eventDuration: "⏱️ Dauer (Stunden): Endzeit wird beim Eingeben automatisch gesetzt",
    durationPlaceholder: "z. B. 1,5",
    eventEndDate: "📅 Enddatum",
    eventReminder: "🔔 Erinnerung",
    eventAddAttachment: "📎 Bild / Datei hinzufügen",
    reminderOnTime: "Pünktlich",
    reminderHourBefore: "1 Stunde vorher",
    chatAssistantHeader: "Multitool Self-Coding Assistent",
    voiceListeningTitle: "Aufnahme... (Klicken zum Stoppen)",
    voiceWriteTitle: "Spracheingabe",
    archiveBtn: "Archivieren",
    archivedRoutinesHeader: "Archivierte Routinen",
    restoreBtn: "Wiederherstellen",
    deletePermBtn: "Dauerhaft löschen",
    sandboxPreviewTitle: "Sandbox Live-Vorschau",
    namePlaceholderExample: "z. B. Doruk",
    themeSlate: "🌙 Schiefer Dunkel",
    themeCyberpunk: "⚡ Cyberpunk Neon",
    themeEmerald: "🌿 Minz-Smaragd",
    themeOled: "✨ OLED Gold",
    themeDefaultLight: "☀️ Reines Licht",
    versionFullLabel: "Multitool AI • Version v1.1.0",
    versionFooterLabel: "Multitool AI • Version 1.1.0",
    prevMonthTitle: "Vorheriger Monat",
    nextMonthTitle: "Nächster Monat",
    todayBtn: "Heute",
    notifTaskRoutine: "Aufgaben / Routinen",
    notifTasks: "Aufgaben",
    notifRoutines: "Routinen",
    chatPlaceholder: "Nachricht eingeben oder sprechen...",
    autoTtsLabel: "KI-Antworten vorlesen (TTS)",
    autoTtsHelp: "KI-Antworten automatisch per Sprachausgabe vorlesen.",
    listenBtn: "Anhören",
    stopListenBtn: "Stoppen",
    tipsCardTitle: "📌 Multitool AI Nutzungstipps",
    tipsCardContent: "Beim Chatten mit der KI können Sie Ereignisse zum Kalender hinzufügen, Ihre To-Do-Liste aktualisieren oder Notizen schreiben lassen!",
    thinkingProcess: "🧠 Denkprozess",
    notifUpcomingEvent: "⏰ Bevorstehendes Ereignis!",
    notifEventTime: "📅 Ereigniszeit!",
    notifMinutesLeft: "Min. verbleibend",
    notifStartingNow: "beginnt jetzt",
    notifNewRoutine: "Neue Routine hinzugefügt 🔄",
    notifNewTask: "Neue Aufgabe hinzugefügt ✔️",
    confirmDeleteHabit: 'Soll "{title}" dauerhaft gelöscht werden? Diese Aktion kann nicht rückgängig gemacht werden.',
    confirmClearChatHistory: "Möchten Sie den gesamten Chatverlauf wirklich löschen?",
    logRoutineArchived: 'Routine archiviert: "{title}"',
    logRoutineRestored: 'Routine aus Archiv wiederhergestellt: "{title}"',
    logRoutineDeleted: 'Routine dauerhaft gelöscht: "{title}"',
    logSpeechUnsupported: "Spracherkennungs-API nicht unterstützt.",
    logVoiceStarted: "Sprachaufnahme gestartet...",
    logVoiceError: "Fehler bei Sprachaufnahme:",
    logVoiceStartFailed: "Sprachaufnahme konnte nicht gestartet werden:",
    logBackupDownloaded: "Datensicherung heruntergeladen.",
    logBackupImported: "Sicherungsdaten erfolgreich importiert.",
    logAutoArchived: "{count} abgeschlossene Aufgabe(n) nach 24 Stunden ins Archiv verschoben.",
    logChatHistoryLoadError: "Chatverlauf konnte nicht geladen werden:",
    logNoApiKey: '{label} hat keinen API-Key: eingebaute Modellliste wird angezeigt. Schlüssel eingeben und "Modelle scannen" für Live-Scan drücken.',
    logScanningProvider: "{provider}-Modelle werden gescannt...",
    logOllamaNoModel: "Kein Modell auf Ollama gefunden: zuerst Ollama-Server starten und Modell herunterladen.",
    logScanError: "{provider} Modell-Scan-Fehler:",
    logCalendarFetchError: "Kalenderereignisse konnten nicht abgerufen werden:",
    logTodosFetchError: "To-Dos konnten nicht abgerufen werden:",
    logSandboxFetchError: "Sandbox-Dateien konnten nicht abgerufen werden:",
    logFileTooBig: '"{name}" ist zu groß (>2MB), nicht hinzugefügt.',
    logTodoAddError: "Fehler beim Hinzufügen der Aufgabe:",
    logTodoUpdateError: "Fehler beim Aktualisieren der Aufgabe:",
    logTodoDeleteError: "Fehler beim Löschen der Aufgabe:",
    logToolSuccess: "Werkzeug {tool} erfolgreich ausgeführt.",
    logToolFailed: "Werkzeug {tool} Ausführung fehlgeschlagen:",
    logChatRunError: "Chat-Ausführungsfehler:",
    logAiApkStart: "KI hat APK-Build gestartet...",
    logAiModifySource: "KI ändert den App-Quellcode:",
    logAiServerStart: "KI startet Localhost-Server auf Port {port}",
    termReady: "Terminal bereit. Schaltflächen verwenden, um Code oder den Localhost-Server auszuführen.\n",
    termRunning: "Wird ausgeführt: {file}...",
    termRuntimeError: "Laufzeitfehler:",
    termApkBuildStarted: "Neuer APK-Build gestartet (Vite + Capacitor + Gradle)...",
    termSuccess: "ERFOLG",
    termDownloadLink: "Download-Link",
    termError: "FEHLER",
    termApkBuildFailed: "APK-Build fehlgeschlagen",
    termConnError: "Verbindungsfehler",
    termLocalhostUnreachable: "Localhost-Server nicht erreichbar:",
    termServerStarting: "Localhost-Server wird gestartet...",
    termServerActive: "SERVER AKTIV",
    termEndpoint: "Endpunkt",
    termLogs: "Logs",
    termServerStartFailed: "Server konnte nicht gestartet werden:",
    termCodeSuccess: "Code erfolgreich ausgeführt (Exit-Code: {code}).",
    termOutput: "Ausgabe / Rückgabe:",
    termProgramDone: "Programm erfolgreich abgeschlossen (keine Ausgabe).",
    toolCallLabel: "Werkzeugaufruf:",
    errChatComm: "Bei der Kommunikation mit dem Modell ist ein Fehler aufgetreten:",
    errTodoNotFound: "Aufgabe nicht gefunden",
    errFileNotFound: "Datei nicht gefunden: {filename}",
    errOfflineJsOnly: "Im Offline-Modus kann nur JavaScript-Code ausgeführt werden.",
    errUnknownTool: "Unbekanntes Werkzeug: {tool}",
    errApkBuildFailed: "APK-Build fehlgeschlagen",
    errSourceUpdateFailed: "Quellcode-Aktualisierung fehlgeschlagen",
    errServerStartFailed: "Server konnte nicht gestartet werden",
    errProviderResp: "{provider} Antwort nicht erfolgreich",
    errProviderNoModel: "Kein {provider} Modell gefunden",
    errApiKeyNotSet: "{provider} API-Key ist nicht festgelegt.",
    errConnError: "Verbindungsfehler: {status} {body}",
    systemFeedback: "[System-Feedback] Werkzeug {tool} ausgeführt. Ergebnis: {result}",
    toolApkBuildDone: "Neuer APK-Build erfolgreich abgeschlossen und auf dem Desktop abgelegt!",
    sandboxOutputTitle: "Sandbox-Ausgabe",
    consolePreviewTitle: "Konsole/JS-Vorschau",
    setupIntroTagline: "Dein AI-Entwicklerbegleiter für die Hosentasche: code, chatte, automatisiere und baue APKs direkt vom Handy.",
    setupIntroCta: "Los geht's 🚀",
    setupStepLabel: "Schritt {n} von {total}",
    setupStepIntro: "Willkommen",
    setupStepPersonalize: "Personalisieren",
    setupStepFeatures: "Funktionen",
    setupStepProvider: "KI-Anbieter",
    setupStepPersona: "Persona",
    setupStepAppearance: "Erscheinungsbild",
    setupStepReview: "Überprüfung",
    setupStepDone: "Bereit",
    appearanceTitle: "🎨 Wähle deinen Stil",
    appearanceSub: "Wähle ein Theme: jederzeit in den Einstellungen änderbar.",
    reviewTitle: "📋 Letzte Kontrolle",
    reviewSub: "Das ist deine Einrichtung. Passe an und starte!",
    reviewNameLbl: "Name",
    reviewLangLbl: "Sprache",
    reviewProviderLbl: "KI-Anbieter",
    reviewPersonaLbl: "Persona",
    reviewThemeLbl: "Theme",
    reviewLooksGood: "Sieht gut aus : Starten 🚀",
    setupPersonalizeTitle: "Personalisieren wir Multitool",
    setupPersonalizeSub: "Nenne deinen Namen und wähle eine Sprache zum Starten.",
    downloadDayJpeg: "📥 Tag herunterladen (JPEG)",
    downloadWeekJpeg: "📥 Woche herunterladen (JPEG)",
    downloadNoteJpeg: "📥 Notiz speichern (JPEG)",
    downloadAllNotesJpeg: "📥 Alle Notizen speichern (JPEG)",
    noteCardTitle: "Persönliche Notiz",
    notesOverviewTitle: "Notizen-Übersicht",
    logNoteSavedGallery: "Notiz in Galeriespeicher",
    agendaCardTitle: "Tagesprogramm",
    weeklyAgendaTitle: "Wochenprogramm",
    agendaNoEventsCard: "Für diesen Tag sind keine Ereignisse geplant.",
    agendaEventsCount: "{n} Ereignisse",
    agendaAllDay: "Ganztägig",
    agendaGeneratedBy: "Erstellt von Multitool AI",
  },
  es: {
    welcomeTitle: "Bienvenido a Multitool AI",
    welcomeDesc: "Tu asistente personal inteligente, entorno de ejecución de código en dispositivo y organizador de calendario.",
    discoverFeatures: "Seleccionar idioma y comenzar 🚀",
    exploreBtn: "Explorar funciones y comenzar 🚀",
    featuresTitle: "¿Qué puedes hacer? ⚡",
    featuresSub: "Funciones principales de la plataforma Multitool:",
    feat1Title: "🛠️ IA de Auto-Código y Sandbox Localhost",
    feat1Desc: "Edita código fuente, compila nuevas APKs y ejecuta servidores Localhost Node.js.",
    feat1Bullet1: "⚡ Construcción instantánea de APKs con Vite + Capacitor",
    feat1Bullet2: "🖥 Inicia y prueba servidores Express/Node.js localmente",
    feat1Bullet3: "🌐 Entorno sandbox con vista previa HTML/JS en vivo",
    feat2Title: "🎤 Asistente Multi-IA y de Voz",
    feat2Desc: "Comunicación por voz con Groq, DeepSeek, OpenAI, Gemini y Ollama.",
    feat2Bullet1: "🎤 Reconocimiento de voz y respuestas por voz",
    feat2Bullet2: "🧠 Soporte para Groq, DeepSeek, OpenAI, Gemini y OpenRouter",
    feat2Bullet3: "🎭 Personas personalizables: Programador y Asistente",
    feat3Title: "📅 Calendario Inteligente y Exportación a Galería",
    feat3Desc: "Guarda tus agendas diarias y semanales como imágenes JPEG en tu galería.",
    feat3Bullet1: "📅 Vistas de agenda por Línea de tiempo, Semanal y Lista",
    feat3Bullet2: "🖼 Guardar agendas en JPEG directamente a la Galería",
    feat3Bullet3: "🔔 Recordatorios de eventos y notificaciones inteligentes",
    feat4Title: "📝 Tareas, Notas y Analítica",
    feat4Desc: "Gestiona tus notas, listas de tareas y analiza tus estadísticas.",
    feat4Bullet1: "📝 Exporta todas tus notas a la Galería como JPEG",
    feat4Bullet2: "📊 Estadísticas de productividad y tareas completadas",
    feat4Bullet3: "🔒 Almacenamiento 100% local y enfocado en la privacidad",
    aiProviderTitle: "Configuración del proveedor de IA 🔑",
    aiProviderSub: "Configura tu motor de IA y tu clave API.",
    nameLabel: "👤 Tu nombre",
    namePlaceholder: "Ingresa tu nombre...",
    selectLang: "Idioma de la aplicación",
    selectProvider: "Seleccionar proveedor",
    selectModelLabel: "Selección de Modelo",
    groqLabel: "Groq Cloud (Alta velocidad)",
    deepseekLabel: "DeepSeek API",
    openaiLabel: "OpenAI (GPT-4o)",
    geminiLabel: "Google Gemini API",
    openrouterLabel: "OpenRouter API",
    ollamaLabel: "Ollama (Servidor local)",
    apiKeyLabel: "Clave API de Groq",
    apiKeyDeepseek: "Clave API de DeepSeek",
    apiKeyOpenAI: "Clave API de OpenAI",
    apiKeyGemini: "Clave API de Google Gemini",
    apiKeyOpenRouter: "Clave API de OpenRouter",
    ollamaUrlLabel: "URL del servidor Ollama",
    promptWeightLabel: "Complejidad del Prompt del Sistema (Velocidad)",
    promptWeightHelp: "Reduce la longitud del prompt para acelerar significativamente los modelos locales (Ollama).",
    promptWeightFull: "⚡⚡⚡ Completo (Todas las 17 Herramientas y Persona Detallada)",
    promptWeightBalanced: "⚡⚡ Equilibrado (Notas, Calendario y Tareas Esenciales)",
    promptWeightMinimal: "⚡ Rápido / Mínimo (Respuesta Ultra-Rápida - Ligero)",
    personaTitle: "Elige la personalidad del asistente 🎭",
    personaSub: "Selecciona el dominio de enfoque principal:",
    completeTitle: "¡Todo listo! 🎉",
    completeDesc: "El agente Multitool AI está completamente configurado.",
    startAppBtn: "Comenzar a usar Multitool ✨",
    nextBtn: "Siguiente",
    backBtn: "Atrás",
    setupRestart: "Reiniciar asistente de configuración",
    setupSkip: "Omitir configuración ⏭️",
    notes: "Notas",
    notesTitle: "📝 Mis Notas",
    newNoteHeader: "Crear nueva nota",
    noteTitlePlaceholder: "Título de la nota...",
    tagsLabel: "Etiquetas personalizadas",
    tagsPlaceholder: "Etiquetas (separadas por comas: #proyecto, #urgente)...",
    noteContentPlaceholder: "Escriba el contenido aquí...",
    saveNoteBtn: "Guardar nota",
    searchNotesPlaceholder: "Buscar notas o etiquetas...",
    allTags: "Todas las etiquetas",
    noNotesYet: "No hay notas guardadas.",
    newChat: "Nuevo Chat",
    chatHistory: "Historial de chats",
    chatHistoryModalTitle: "Historial de chats guardados",
    noSavedChats: "No hay chats guardados.",
    startNewChatBtn: "Iniciar nuevo chat",
    clearCurrentChat: "Borrar chat actual",
    sendMsg: "Enviar mensaje",
    isRoutine: "Tarea de rutina",
    routineFrequency: "Frecuencia",
    daily: "Diario",
    weekly: "Semanal",
    monthly: "Mensual",
    routines: "Rutinas",
    activeStatus: "Activo",
    noKeyStatus: "Sin clave API",
    quickAddTodo: "Agregar tarea",
    quickAddEvent: "Agregar evento",
    quickVoiceNote: "Nota de voz",
    quickSummary: "Resumen del día",
    quickSandbox: "Sandbox",
    tabChat: "Chat",
    tabNotes: "Notas",
    tabCalendar: "Calendario",
    tabTodos: "Tareas",
    tabAnalytics: "Análisis",
    tabSandbox: "Sandbox",
    welcomeGreeting: "¡Hola! Soy tu Asistente Multitool AI. ¿En qué puedo ayudarte hoy?",
    newChatGreeting: "¡Hola! Nuevo chat iniciado. ¿En qué te puedo ayudar?",
    chatTitlePrefix: "Chat",
    lowPriority: "Prioridad Baja",
    medPriority: "Prioridad Media",
    highPriority: "Prioridad Alta",
    noTasksFound: "No se encontraron tareas.",
    archivedTasks: "Tareas Archivadas",
    clearArchive: "Limpiar Archivo",
    archived: "Archivado",
    viewFlow: "Flujo",
    viewWeekly: "Semanal",
    viewList: "Lista",
    emptyTimeSlot: "Espacio Libre",
    addEvent: "Añadir Evento",
    eventTitlePlaceholder: "Título del Evento...",
    eventStartTime: "⏰ Hora de Inicio",
    eventEndTime: "⌛ Hora de Fin",
    eventDate: "📅 Fecha",
    eventDescPlaceholder: "Descripción (Opcional)",
    saveEventBtn: "Guardar Evento",
    analyticsHeader: "📊 Análisis e Rutinas IA",
    getReportNotif: "🔔 Obtener Notificación",
    todaysSummary: "📌 Resumen de Hoy",
    taskStatus: "Estado de Tareas:",
    todaySchedule: "Agenda de Hoy:",
    dailyRoutines: "Rutinas Diarias:",
    completedTasksLabel: "Tareas Completadas",
    eventsLabel: "Eventos",
    routinesLabel: "Rutinas",
    habitsHeader: "Hábitos y Rutinas Diarias",
    addRoutineBtn: "+ Añadir Rutina",
    noRoutinesYet: "No hay rutinas registradas aún.",
    aiAdviceHeader: "Sugerencia de Productividad IA",
    sandboxHeader: "💻 Entorno Sandbox de Código",
    editorTab: "✏️ Editor",
    livePreviewTab: "🌐 Vista Previa",
    filesTab: "📂 Archivos",
    liveSandboxPreview: "🌐 Vista Previa Live Sandbox",
    refreshBtn: "Actualizar",
    sandboxFolderLabel: "Carpeta Sandbox (./sandbox)",
    sandboxEmpty: "La carpeta está vacía.",
    openNewFile: "Abrir Nuevo Archivo:",
    openBtn: "Abrir",
    selectTemplate: "🚀 Seleccionar Plantilla...",
    expressTemplate: "⚡ Servidor API Express",
    reactTemplate: "⚛️ Componente React",
    htmlTemplate: "🎨 Página HTML5",
    runBtn: "Ejecutar",
    saveBtn: "Guardar",
    languageLabel: "Idioma",
    settingsTitle: "⚙️ Configuración",
    userProfileLabel: "👤 Perfil de Usuario & Notificaciones",
    yourNameLabel: "Tu Nombre",
    testNotificationBtn: "Enviar Notificación de Prueba",
    notificationSent: "¡Notificación enviada!",
    themeLabel: "Tema & Paquetes de Diseño Visual",
    aiProviderSettingsLabel: "Proveedor de Servicio IA",
    providerSelectLabel: "Seleccionar Proveedor",
    loadingModels: "Cargando modelos...",
    saveAndTestBtn: "Guardar y Probar Conexión",
    aboutTitle: "Acerca de & Detalles",
    checkUpdatesBtn: "Buscar actualizaciones",
    checkingUpdates: "Buscando actualizaciones...",
    updateAvailableTitle: "🚀 ¡Nueva actualización disponible!",
    updateAvailableSub: "La versión {version} de Multitool AI ya está disponible. Descárguela e instálela ahora.",
    btnDownloadUpdate: "⚡ Descargar e instalar actualización",
    btnDismissUpdate: "Más tarde",
    updateCheckFailed: "Error al buscar actualizaciones. Compruebe su conexión a Internet.",
    upToDateMsg: "Su aplicación está actualizada (v1.1.0).",
    releaseNotesLabel: "Notas de la versión:",
    aboutDesc: "Esta app es un asistente móvil con IA de Auto-Código y soporte Localhost Node.js (Multitool).",
    versionLabel: "Versión",
    architectureLabel: "Arquitectura",
    buildLabel: "Compilación",
    databaseLabel: "Base de Datos",
    backupTitle: "Respaldo & Restauración de Datos",
    backupDesc: "Respalde o importe todos sus datos de calendario, tareas, chat y sandbox en formato JSON.",
    exportBtn: "Exportar (Respaldar)",
    importBtn: "Importar",
    systemLogsTitle: "Registros del Sistema",
    noLogs: "Sin registros.",
    setupWizardTitle: "🚀 Asistente de Configuración",
    setupWizardDesc: "Ejecute nuevamente el asistente para reconfigurar su proveedor de IA y rol predeterminado.",
    setupWizardRestartBtn: "Reiniciar Asistente de Configuración",
    calendarTitle: "📅 Calendario & Agenda",
    scheduleLabel: "Agenda",
    viewTimeline: "Flujo",
    todosTitle: "✔️ Tareas & Rutinas",
    completionRateLabel: "Tasa de Finalización General",
    activeLabel: "Activo",
    completedLabel: "Completado",
    archivedLabel: "Archivado",
    allTasksLabel: "Todas las Tareas",
    normalTasksLabel: "Tareas Normales",
    routinesTabLabel: "🔄 Rutinas",
    todoPlaceholder: "Tarea o rutina por hacer...",
    priorityLow: "Prioridad Baja",
    priorityMedium: "Prioridad Media",
    priorityHigh: "Prioridad Alta",
    freqDaily: "Cada Día (Diario)",
    freqWeekly: "Cada Semana (Semanal)",
    freqMonthly: "Cada Mes (Mensual)",
    addTaskBtn: "Agregar Tarea",
    voiceNoteBtn: "Nota de Voz",
    dueDateLabel: "Fecha Límite",
    routineTagDaily: "Diario",
    routineTagWeekly: "Semanal",
    routineTagMonthly: "Mensual",
    completedTag: "Completado",
    archivedTasksHeader: "Tareas Archivadas",
    clearArchiveConfirm: "¿Está seguro de que desea borrar todas las tareas archivadas?",
    analyticsTitle: "📊 Análisis IA & Rutinas",
    getReportBtn: "Obtener Notificación de Reporte",
    todaySummaryHeader: "Resumen de Hoy",
    taskStatusLabel: "Estado de Tareas:",
    todayScheduleLabel: "Agenda de Hoy:",
    dailyRoutinesLabel: "Rutinas Diarias:",
    completedTasksGrid: "Tareas Completadas",
    eventsGrid: "Eventos",
    routineGrid: "Rutinas",
    dailyHabitsHeader: "Hábitos y Rutinas Diarias",
    addRoutinePrompt: "Nombre de Nueva Rutina / Hábito:",
    streakDays: "Días",
    aiProductivityHeader: "Consejos de Productividad IA",
    sandboxTitle: "💻 Entorno Sandbox de Código",
    previewTab: "Vista Previa",
    livePreviewTitle: "Vista Previa Live Sandbox",
    sandboxFolderEmpty: "La carpeta está vacía. La IA puede crear archivos aquí o puede abrir archivos nuevos.",
    newFileOpen: "Abrir Nuevo Archivo:",
    localhostServerBtn: "Servidor Localhost (3005)",
    exportHtmlBtn: "Exportar (HTML)",
    buildApkBtn: "Compilar Nueva APK",
    buildingApk: "Compilando...",
    consoleTitle: "Salida de Consola & Registros del Servidor",
    clearBtn: "Limpiar",
    personaCoder: "🛠️ Self-Coder",
    personaCoderDesc: "Enfoque en codificación, servidores y compilación APK.",
    personaOrganizer: "📅 Organizador",
    personaOrganizerDesc: "Enfoque en calendario, agenda y gestión de tareas.",
    personaWriter: "✍️ Escritor",
    personaWriterDesc: "Enfoque en resumen, correos, textos y traducción.",
    personaAnalyst: "🧠 Analista",
    personaAnalystDesc: "Lógica profunda para análisis paso a paso.",
    speechNotSupported: "El reconocimiento de voz no es compatible o no está activo en su dispositivo.",
    speechNotSupportedWeb: "El reconocimiento de voz web no es compatible en su dispositivo.",
    voiceTaskRecorded: "Tarea de voz grabada",
    newVoiceTaskNotifTitle: "Nueva Tarea de Voz 🎙️",
    newVoiceTaskNotifBody: "Tarea",
    backupError: "Error al crear el respaldo",
    importSuccess: "¡Todos sus datos han sido importados exitosamente!",
    importError: "Error al importar el respaldo",
    fileSaved: "archivo guardado.",
    deleteFileConfirm: "¿Está seguro de que desea eliminar",
    deleteNoteConfirm: "¿Está seguro de que desea eliminar esta nota?",
    noModelError: "Modelo no encontrado. Ingrese una clave API válida en Configuración.",
    noOllamaModelError: "No se seleccionó modelo Ollama. Verifique la URL de Ollama en Configuración.",
    downloadApkTitle: "Descargar Última APK",
    downloadApkBtn: "Descargar APK",
    messagesCount: "mensajes",
    deleteChat: "Eliminar Chat",
    catAll: "Todos",
    catGeneral: "General",
    catIdea: "Idea",
    catWork: "Trabajo",
    catPersonal: "Personal",
    catCode: "Código",
    buildApkPrompt: "¿Puedes compilar una nueva APK y darme un enlace de descarga?",
    buildApkCardTitle: "Compilar APK Automática",
    buildApkCardSub: "Compilar con Vite + Capacitor + Gradle",
    reminderMinBefore: "min antes",
    newFileContent: "// Contenido del nuevo archivo...",
    aiAdviceEmpty: "Aún no se han agregado tareas o rutinas. ¡Comience a rastrear su productividad!",
    aiAdviceProgress: "hoy completaste tareas y rutinas. ¡Gran progreso! 🚀",
    selectModelPlaceholder: "Seleccionar modelo...",
    scanModels: "Escanear modelos",
    scanningModels: "Escaneando modelos...",
    cancelBtn: "Cancelar",
    other: "Otro",
    resultLabel: "Resultado:",
    paramsLabel: "Parámetros:",
    errorLabel: "Error:",
    noEventsDay: "No hay eventos registrados para el día seleccionado.",
    noEventsDate: "No hay eventos registrados para esta fecha.",
    eventsForDateSuffix: "Eventos",
    eventStartDate: "📅 Fecha de inicio",
    eventDuration: "⏱️ Duración (horas): al ingresar se ajusta el fin automáticamente",
    durationPlaceholder: "ej. 1,5",
    eventEndDate: "📅 Fecha de fin",
    eventReminder: "🔔 Recordatorio",
    eventAddAttachment: "📎 Añadir imagen / archivo",
    reminderOnTime: "A la hora",
    reminderHourBefore: "1 hora antes",
    chatAssistantHeader: "Asistente Self-Coding Multitool",
    voiceListeningTitle: "Escuchando... (clic para detener)",
    voiceWriteTitle: "Escribir por voz",
    archiveBtn: "Archivar",
    archivedRoutinesHeader: "Rutinas archivadas",
    restoreBtn: "Restaurar",
    deletePermBtn: "Eliminar permanentemente",
    sandboxPreviewTitle: "Vista previa en vivo del Sandbox",
    namePlaceholderExample: "ej. Doruk",
    themeSlate: "🌙 Pizarra Oscuro",
    themeCyberpunk: "⚡ Cyberpunk Neón",
    themeEmerald: "🌿 Menta Esmeralda",
    themeOled: "✨ OLED Oro",
    themeDefaultLight: "☀️ Luz Pura",
    versionFullLabel: "Multitool AI : Versión v1.1.0",
    versionFooterLabel: "Multitool AI : Versión 1.1.0",
    prevMonthTitle: "Mes anterior",
    nextMonthTitle: "Mes siguiente",
    todayBtn: "Hoy",
    notifTaskRoutine: "Tareas / Rutinas",
    notifTasks: "Tareas",
    notifRoutines: "Rutinas",
    chatPlaceholder: "Escribe tu mensaje o habla...",
    autoTtsLabel: "Leer respuestas de IA (TTS)",
    autoTtsHelp: "Convertir automáticamente las respuestas de la IA a voz.",
    listenBtn: "Escuchar",
    stopListenBtn: "Detener",
    tipsCardTitle: "📌 Consejos de uso de Multitool AI",
    tipsCardContent: "¡Al chatear con la IA puedes pedirle que añada eventos a tu calendario, actualice tu lista de tareas o escriba notas!",
    thinkingProcess: "🧠 Proceso de pensamiento",
    notifUpcomingEvent: "⏰ ¡Evento próximo!",
    notifEventTime: "📅 ¡Hora del evento!",
    notifMinutesLeft: "min restantes",
    notifStartingNow: "comienza ahora",
    notifNewRoutine: "Nueva rutina añadida 🔄",
    notifNewTask: "Nueva tarea añadida ✔️",
    confirmDeleteHabit: '¿Eliminar "{title}" permanentemente? Esta acción no se puede deshacer.',
    confirmClearChatHistory: "¿Seguro que quieres eliminar todo el historial de chat?",
    logRoutineArchived: 'Rutina archivada: "{title}"',
    logRoutineRestored: 'Rutina restaurada del archivo: "{title}"',
    logRoutineDeleted: 'Rutina eliminada permanentemente: "{title}"',
    logSpeechUnsupported: "API de reconocimiento de voz no soportada.",
    logVoiceStarted: "Escucha de voz iniciada...",
    logVoiceError: "Error de escucha de voz:",
    logVoiceStartFailed: "No se pudo iniciar la escucha de voz:",
    logBackupDownloaded: "Copia de seguridad de datos descargada.",
    logBackupImported: "Datos de copia importados correctamente.",
    logAutoArchived: "{count} tarea(s) completada(s) movida(s) al archivo tras 24 horas.",
    logChatHistoryLoadError: "No se pudo cargar el historial de chat:",
    logNoApiKey: '{label} no tiene API Key: se muestra la lista de modelos integrada. Introduzca una clave y pulse "Escanear modelos" para un escaneo en vivo.',
    logScanningProvider: "Escaneando modelos de {provider}...",
    logOllamaNoModel: "No se encontró modelo en Ollama: primero inicia el servidor Ollama y descarga un modelo.",
    logScanError: "Error de escaneo de modelos de {provider}:",
    logCalendarFetchError: "No se pudieron obtener los eventos del calendario:",
    logTodosFetchError: "No se pudieron obtener las tareas:",
    logSandboxFetchError: "No se pudieron obtener los archivos del sandbox:",
    logFileTooBig: '"{name}" es demasiado grande (>2MB), no se añadió.',
    logTodoAddError: "Error al añadir la tarea:",
    logTodoUpdateError: "Error al actualizar la tarea:",
    logTodoDeleteError: "Error al eliminar la tarea:",
    logToolSuccess: "Herramienta {tool} ejecutada correctamente.",
    logToolFailed: "Ejecución de la herramienta {tool} fallida:",
    logChatRunError: "Error de ejecución del chat:",
    logAiApkStart: "IA inició la compilación del APK...",
    logAiModifySource: "IA está modificando el código fuente de la app:",
    logAiServerStart: "IA está iniciando el servidor localhost en el puerto {port}",
    termReady: "Terminal listo. Usa los botones para ejecutar código o el servidor localhost.\n",
    termRunning: "Ejecutando: {file}...",
    termRuntimeError: "Error de ejecución:",
    termApkBuildStarted: "Nueva compilación de APK iniciada (Vite + Capacitor + Gradle)...",
    termSuccess: "ÉXITO",
    termDownloadLink: "Enlace de descarga",
    termError: "ERROR",
    termApkBuildFailed: "Compilación de APK fallida",
    termConnError: "Error de conexión",
    termLocalhostUnreachable: "No se pudo acceder al servidor localhost:",
    termServerStarting: "Iniciando el servidor localhost...",
    termServerActive: "SERVIDOR ACTIVO",
    termEndpoint: "Endpoint",
    termLogs: "Registros",
    termServerStartFailed: "No se pudo iniciar el servidor:",
    termCodeSuccess: "Código ejecutado correctamente (Código de salida: {code}).",
    termOutput: "Salida / Retorno:",
    termProgramDone: "Programa completado correctamente (sin salida).",
    toolCallLabel: "Llamada a herramienta:",
    errChatComm: "Ocurrió un error al comunicarse con el modelo:",
    errTodoNotFound: "Tarea no encontrada",
    errFileNotFound: "Archivo no encontrado: {filename}",
    errOfflineJsOnly: "En modo offline solo se puede ejecutar código JavaScript.",
    errUnknownTool: "Herramienta desconocida: {tool}",
    errApkBuildFailed: "Compilación de APK fallida",
    errSourceUpdateFailed: "Actualización de código fuente fallida",
    errServerStartFailed: "No se pudo iniciar el servidor",
    errProviderResp: "Respuesta de {provider} no exitosa",
    errProviderNoModel: "No se encontró modelo de {provider}",
    errApiKeyNotSet: "API Key de {provider} no configurada.",
    errConnError: "Error de conexión: {status} {body}",
    systemFeedback: "[Comentario del sistema] Herramienta {tool} ejecutada. Resultado: {result}",
    toolApkBuildDone: "¡Nueva compilación de APK completada con éxito y colocada en el escritorio!",
    sandboxOutputTitle: "Salida del Sandbox",
    consolePreviewTitle: "Vista previa de Consola/JS",
    setupIntroTagline: "Tu compañero de desarrollo IA de bolsillo: programa, chatea, automatiza y compila APKs desde tu móvil.",
    setupIntroCta: "Empecemos 🚀",
    setupStepLabel: "Paso {n} de {total}",
    setupStepIntro: "Bienvenida",
    setupStepPersonalize: "Personalizar",
    setupStepFeatures: "Funciones",
    setupStepProvider: "Proveedor IA",
    setupStepPersona: "Persona",
    setupStepAppearance: "Apariencia",
    setupStepReview: "Revisión",
    setupStepDone: "Listo",
    appearanceTitle: "🎨 Elige tu estilo",
    appearanceSub: "Elige un tema: puedes cambiarlo cuando quieras en Ajustes.",
    reviewTitle: "📋 Revisión Final",
    reviewSub: "Tu configuración lista. Ajusta lo que quieras y ¡lanza!",
    reviewNameLbl: "Nombre",
    reviewLangLbl: "Idioma",
    reviewProviderLbl: "Proveedor IA",
    reviewPersonaLbl: "Persona",
    reviewThemeLbl: "Tema",
    reviewLooksGood: "Perfecto : Lanzar 🚀",
    setupPersonalizeTitle: "Personalicemos Multitool",
    setupPersonalizeSub: "Dime tu nombre y elige un idioma para empezar.",
    downloadDayJpeg: "📥 Descargar día (JPEG)",
    downloadWeekJpeg: "📥 Descargar semana (JPEG)",
    downloadNoteJpeg: "📥 Guardar nota (JPEG)",
    downloadAllNotesJpeg: "📥 Guardar todas las notas (JPEG)",
    noteCardTitle: "Nota Personal",
    notesOverviewTitle: "Resumen de Notas",
    logNoteSavedGallery: "Nota guardada en la galería",
    agendaCardTitle: "Agenda del día",
    weeklyAgendaTitle: "Agenda semanal",
    agendaNoEventsCard: "No hay eventos programados para este día.",
    agendaEventsCount: "{n} eventos",
    agendaAllDay: "Todo el día",
    agendaGeneratedBy: "Generado por Multitool AI",
  },
  fr: {
    welcomeTitle: "Bienvenue sur Multitool AI",
    welcomeDesc: "Votre assistant personnel intelligent, sandbox de code sur appareil et organisateur de calendrier.",
    discoverFeatures: "Choisir la langue et démarrer 🚀",
    exploreBtn: "Explorer les fonctionnalités & démarrer 🚀",
    featuresTitle: "Que pouvez-vous faire ? ⚡",
    featuresSub: "Fonctionnalités clés de la plateforme Multitool :",
    feat1Title: "🛠️ IA Self-Coding et Sandbox Localhost",
    feat1Desc: "Modifiez le code source, compilez de nouveaux APK et exécutez des serveurs Node.js.",
    feat1Bullet1: "⚡ Compilation d'APK instantanée avec Vite + Capacitor",
    feat1Bullet2: "🖥 Lancez et testez des serveurs Express/Node.js en local",
    feat1Bullet3: "🌐 Environnement sandbox avec aperçu web HTML/JS en direct",
    feat2Title: "🎤 Assistant Multi-IA & Vocal",
    feat2Desc: "Communication vocale et réponses intelligentes avec Groq, DeepSeek, OpenAI, Gemini et Ollama.",
    feat2Bullet1: "🎤 Reconnaissance vocale et synthèse vocale",
    feat2Bullet2: "🧠 Prise en charge de Groq, DeepSeek, OpenAI, Gemini & OpenRouter",
    feat2Bullet3: "🎭 Modes de personna personnalisables",
    feat3Title: "📅 Calendrier Intelligent & Export Galerie",
    feat3Desc: "Exportez vos agendas quotidiens et hebdomadaires en JPEG dans votre galerie.",
    feat3Bullet1: "📅 Vues Chronologie, Hebdomadaire et Liste d'agenda",
    feat3Bullet2: "🖼 Enregistrer l'agenda quotidien/hebdomadaire en JPEG dans la Galerie",
    feat3Bullet3: "🔔 Rappels d'événements et notifications",
    feat4Title: "📝 Tâches, Notes & Analytique",
    feat4Desc: "Gérez vos notes, vos tâches et analysez votre productivité.",
    feat4Bullet1: "📝 Exporter toutes vos notes en JPEG dans la Galerie",
    feat4Bullet2: "📊 Statistiques de productivité et de réalisation des tâches",
    feat4Bullet3: "🔒 Stockage 100% local et respectueux de la vie privée",
    aiProviderTitle: "Configuration du fournisseur IA 🔑",
    aiProviderSub: "Configurez votre moteur IA et votre clé API.",
    nameLabel: "👤 Votre nom",
    namePlaceholder: "Entrez votre nom...",
    selectLang: "Choisir la langue",
    selectProvider: "Choisir un fournisseur",
    selectModelLabel: "Sélection de Modèle",
    groqLabel: "Groq Cloud (Haute vitesse)",
    deepseekLabel: "DeepSeek API",
    openaiLabel: "OpenAI (GPT-4o)",
    geminiLabel: "Google Gemini API",
    openrouterLabel: "OpenRouter API",
    ollamaLabel: "Ollama (Serveur local)",
    apiKeyLabel: "Clé API Groq",
    apiKeyDeepseek: "Clé API DeepSeek",
    apiKeyOpenAI: "Clé API OpenAI",
    apiKeyGemini: "Clé API Google Gemini",
    apiKeyOpenRouter: "Clé API OpenRouter",
    ollamaUrlLabel: "URL du serveur Ollama",
    promptWeightLabel: "Complexité du Prompt Système (Vitesse du Modèle)",
    promptWeightHelp: "Réduisez la longueur du prompt pour accélérer considérablement les modèles locaux (Ollama).",
    promptWeightFull: "⚡⚡⚡ Complet (Tous les 17 Outils et Persona Détaillé)",
    promptWeightBalanced: "⚡⚡ Équilibré (Notes, Calendrier et Tâches Essentiels)",
    promptWeightMinimal: "⚡ Rapide / Minimal (Réponse Ultra-Rapide - Léger)",
    personaTitle: "Choisissez le rôle de l'assistant 🎭",
    personaSub: "Sélectionnez le domaine d'expertise principal :",
    completeTitle: "Tout est prêt ! 🎉",
    completeDesc: "Multitool AI Agent est entièrement configuré.",
    startAppBtn: "Démarrer Multitool ✨",
    nextBtn: "Suivant",
    backBtn: "Retour",
    setupRestart: "Redémarrer l'assistant de configuration",
    setupSkip: "Passer la configuration ⏭️",
    notes: "Notes",
    notesTitle: "📝 Mes Notes",
    newNoteHeader: "Créer une nouvelle note",
    noteTitlePlaceholder: "Titre de la note...",
    tagsLabel: "Étiquettes personnalisées",
    tagsPlaceholder: "Étiquettes (séparées par des virgules: #projet, #urgent)...",
    noteContentPlaceholder: "Écrivez le contenu ici...",
    saveNoteBtn: "Enregistrer la note",
    searchNotesPlaceholder: "Rechercher des notes ou étiquettes...",
    allTags: "Toutes les étiquettes",
    noNotesYet: "Aucune note enregistrée.",
    newChat: "Nouveau Chat",
    chatHistory: "Historique des chats",
    chatHistoryModalTitle: "Historique des chats enregistrés",
    noSavedChats: "Aucun chat enregistré.",
    startNewChatBtn: "Démarrer un nouveau chat",
    clearCurrentChat: "Effacer le chat actuel",
    sendMsg: "Envoyer le message",
    isRoutine: "Tâche de routine",
    routineFrequency: "Fréquence",
    daily: "Quotidien",
    weekly: "Hebdomadaire",
    monthly: "Mensuel",
    routines: "Routines",
    activeStatus: "Actif",
    noKeyStatus: "Pas de clé API",
    quickAddTodo: "Ajouter une tâche",
    quickAddEvent: "Ajouter un événement",
    quickVoiceNote: "Note Vocale",
    quickSummary: "Résumé du jour",
    quickSandbox: "Sandbox",
    tabChat: "Chat",
    tabNotes: "Notes",
    tabCalendar: "Calendrier",
    tabTodos: "Tâches",
    tabAnalytics: "Analytique",
    tabSandbox: "Sandbox",
    welcomeGreeting: "Bonjour ! Je suis votre assistant Multitool AI. Comment puis-je vous aider ?",
    newChatGreeting: "Bonjour ! Nouveau chat démarré. Comment puis-je vous aider ?",
    chatTitlePrefix: "Discussion",
    lowPriority: "Priorité Basse",
    medPriority: "Priorité Moyenne",
    highPriority: "Priorité Haute",
    noTasksFound: "Aucune tâche trouvée.",
    archivedTasks: "Tâches Archivées",
    clearArchive: "Vider les archives",
    archived: "Archivé",
    viewFlow: "Flux",
    viewWeekly: "Hebdomadaire",
    viewList: "Liste",
    emptyTimeSlot: "Créneau Libre",
    addEvent: "Ajouter Événement",
    eventTitlePlaceholder: "Titre de l'événement...",
    eventStartTime: "⏰ Heure de Début",
    eventEndTime: "⌛ Heure de Fin",
    eventDate: "📅 Date",
    eventDescPlaceholder: "Description (Optionnel)",
    saveEventBtn: "Enregistrer L'événement",
    analyticsHeader: "📊 Analytique et Routines IA",
    getReportNotif: "🔔 Obtenir Notification",
    todaysSummary: "📌 Résumé d'Aujourd'hui",
    taskStatus: "Statut des Tâches :",
    todaySchedule: "Programme d'Aujourd'hui :",
    dailyRoutines: "Routines Quotidiennes :",
    completedTasksLabel: "Tâches Terminées",
    eventsLabel: "Événements",
    routinesLabel: "Routines",
    habitsHeader: "Habitudes et Routines",
    addRoutineBtn: "+ Ajouter Routine",
    noRoutinesYet: "Aucune routine enregistrée.",
    aiAdviceHeader: "Conseils de Productivité IA",
    sandboxHeader: "💻 Sandbox de Code & Localhost",
    editorTab: "✏️ Éditeur",
    livePreviewTab: "🌐 Aperçu en direct",
    filesTab: "📂 Fichiers",
    liveSandboxPreview: "🌐 Aperçu Web Sandbox en direct",
    refreshBtn: "Actualiser",
    sandboxFolderLabel: "Dossier Sandbox (./sandbox)",
    sandboxEmpty: "Le dossier est vide.",
    openNewFile: "Ouvrir un nouveau fichier :",
    openBtn: "Ouvrir",
    selectTemplate: "🚀 Sélectionner Modèle...",
    expressTemplate: "⚡ Serveur API Express",
    reactTemplate: "⚛️ Composant React",
    htmlTemplate: "🎨 Page HTML5",
    runBtn: "Exécuter",
    saveBtn: "Enregistrer",
    languageLabel: "Langue",
    settingsTitle: "⚙️ Paramètres",
    userProfileLabel: "👤 Profil Utilisateur & Notifications",
    yourNameLabel: "Votre Nom",
    testNotificationBtn: "Envoyer une Notification Test",
    notificationSent: "Notification envoyée !",
    themeLabel: "Thème & Packs de Design Visuel",
    aiProviderSettingsLabel: "Fournisseur de Service IA",
    providerSelectLabel: "Choisir un Fournisseur",
    loadingModels: "Chargement des modèles...",
    saveAndTestBtn: "Sauvegarder & Tester la Connexion",
    aboutTitle: "À Propos & Détails",
    checkUpdatesBtn: "Vérifier les mises à jour",
    checkingUpdates: "Vérification des mises à jour...",
    updateAvailableTitle: "🚀 Nouvelle mise à jour disponible !",
    updateAvailableSub: "La version {version} de Multitool AI est disponible. Téléchargez et installez-la dès maintenant.",
    btnDownloadUpdate: "⚡ Télécharger et installer la mise à jour",
    btnDismissUpdate: "Plus tard",
    updateCheckFailed: "Impossible de vérifier les mises à jour. Vérifiez votre connexion Internet.",
    upToDateMsg: "Votre application est à jour (v1.1.0).",
    releaseNotesLabel: "Notes de mise à jour :",
    aboutDesc: "Cette app est un assistant mobile avec IA Self-Coding et support Localhost Node.js (Multitool).",
    versionLabel: "Version",
    architectureLabel: "Architecture",
    buildLabel: "Compilation",
    databaseLabel: "Base de Données",
    backupTitle: "Sauvegarde & Restauration des Données",
    backupDesc: "Sauvegardez ou importez toutes vos données calendrier, tâches, chat et sandbox au format JSON.",
    exportBtn: "Exporter (Sauvegarder)",
    importBtn: "Importer",
    systemLogsTitle: "Journaux Système",
    noLogs: "Aucune entrée de journal.",
    setupWizardTitle: "🚀 Assistant de Configuration",
    setupWizardDesc: "Relancez l'assistant pour reconfigurer votre fournisseur IA et votre rôle par défaut.",
    setupWizardRestartBtn: "Relancer l'Assistant de Configuration",
    calendarTitle: "📅 Calendrier & Programme",
    scheduleLabel: "Programme",
    viewTimeline: "Flux",
    todosTitle: "✔️ Tâches & Routines",
    completionRateLabel: "Taux d'Achèvement Global",
    activeLabel: "Actif",
    completedLabel: "Terminé",
    archivedLabel: "Archivé",
    allTasksLabel: "Toutes les Tâches",
    normalTasksLabel: "Tâches Normales",
    routinesTabLabel: "🔄 Routines",
    todoPlaceholder: "Tâche ou routine à faire...",
    priorityLow: "Priorité Basse",
    priorityMedium: "Priorité Moyenne",
    priorityHigh: "Priorité Haute",
    freqDaily: "Chaque Jour (Quotidien)",
    freqWeekly: "Chaque Semaine (Hebdomadaire)",
    freqMonthly: "Chaque Mois (Mensuel)",
    addTaskBtn: "Ajouter une Tâche",
    voiceNoteBtn: "Note Vocale",
    dueDateLabel: "Date Limite",
    routineTagDaily: "Quotidien",
    routineTagWeekly: "Hebdomadaire",
    routineTagMonthly: "Mensuel",
    completedTag: "Terminé",
    archivedTasksHeader: "Tâches Archivées",
    clearArchiveConfirm: "Êtes-vous sûr de vouloir supprimer toutes les tâches archivées ?",
    analyticsTitle: "📊 Analytique IA & Routines",
    getReportBtn: "Obtenir Notification de Rapport",
    todaySummaryHeader: "Résumé d'Aujourd'hui",
    taskStatusLabel: "Statut des Tâches :",
    todayScheduleLabel: "Programme d'Aujourd'hui :",
    dailyRoutinesLabel: "Routines Quotidiennes :",
    completedTasksGrid: "Tâches Terminées",
    eventsGrid: "Événements",
    routineGrid: "Routines",
    dailyHabitsHeader: "Habitudes et Routines Quotidiennes",
    addRoutinePrompt: "Nom de la Nouvelle Habitude / Routine :",
    streakDays: "Jours",
    aiProductivityHeader: "Conseils de Productivité IA",
    sandboxTitle: "💻 Sandbox de Code & Localhost",
    previewTab: "Aperçu en Direct",
    livePreviewTitle: "Aperçu Web Sandbox en Direct",
    sandboxFolderEmpty: "Le dossier est vide. L'IA peut créer des fichiers ici ou vous pouvez ouvrir de nouveaux fichiers.",
    newFileOpen: "Ouvrir un Nouveau Fichier :",
    localhostServerBtn: "Serveur Localhost (3005)",
    exportHtmlBtn: "Exporter (HTML)",
    buildApkBtn: "Compiler Nouvelle APK",
    buildingApk: "Compilation...",
    consoleTitle: "Sortie Console & Journaux Serveur",
    clearBtn: "Effacer",
    personaCoder: "🛠️ Self-Coder",
    personaCoderDesc: "Focus sur le codage, les serveurs et la compilation APK.",
    personaOrganizer: "📅 Organisateur",
    personaOrganizerDesc: "Focus sur le calendrier, l'agenda et la gestion des tâches.",
    personaWriter: "✍️ Rédacteur",
    personaWriterDesc: "Focus sur le résumé, les emails, les textes et la traduction.",
    personaAnalyst: "🧠 Analyste",
    personaAnalystDesc: "Logique approfondie pour l'analyse étape par étape.",
    speechNotSupported: "La reconnaissance vocale n'est pas supportée ou n'est pas active sur votre appareil.",
    speechNotSupportedWeb: "La reconnaissance vocale web n'est pas supportée sur votre appareil.",
    voiceTaskRecorded: "Tâche vocale enregistrée",
    newVoiceTaskNotifTitle: "Nouvelle Tâche Vocale 🎙️",
    newVoiceTaskNotifBody: "Tâche",
    backupError: "Erreur lors de la création de la sauvegarde",
    importSuccess: "Toutes vos données ont été importées avec succès !",
    importError: "Erreur d'importation de la sauvegarde",
    fileSaved: "fichier enregistré.",
    deleteFileConfirm: "Êtes-vous sûr de vouloir supprimer",
    deleteNoteConfirm: "Êtes-vous sûr de vouloir supprimer cette note ?",
    noModelError: "Modèle introuvable. Veuillez entrer une clé API valide dans les Paramètres.",
    noOllamaModelError: "Aucun modèle Ollama sélectionné. Vérifiez l'URL Ollama dans les Paramètres.",
    downloadApkTitle: "Télécharger la Dernière APK",
    downloadApkBtn: "Télécharger APK",
    messagesCount: "messages",
    deleteChat: "Supprimer le Chat",
    catAll: "Tous",
    catGeneral: "Général",
    catIdea: "Idée",
    catWork: "Travail",
    catPersonal: "Personnel",
    catCode: "Code",
    buildApkPrompt: "Peux-tu compiler une nouvelle APK et me donner un lien de téléchargement ?",
    buildApkCardTitle: "Compiler APK Automatique",
    buildApkCardSub: "Compiler avec Vite + Capacitor + Gradle",
    reminderMinBefore: "min avant",
    newFileContent: "// Contenu du nouveau fichier...",
    aiAdviceEmpty: "Aucune tâche ou routine ajoutée. Commencez à suivre votre productivité !",
    aiAdviceProgress: "aujourd'hui vous avez complété des tâches et routines. Super progrès ! 🚀",
    selectModelPlaceholder: "Sélectionner le modèle...",
    scanModels: "Scanner les modèles",
    scanningModels: "Scanner les modèles...",
    cancelBtn: "Annuler",
    other: "Autre",
    resultLabel: "Résultat :",
    paramsLabel: "Paramètres :",
    errorLabel: "Erreur :",
    noEventsDay: "Aucun événement enregistré pour le jour sélectionné.",
    noEventsDate: "Aucun événement enregistré pour cette date.",
    eventsForDateSuffix: "Événements",
    eventStartDate: "📅 Date de début",
    eventDuration: "⏱️ Durée (heures): la fin est auto-définie lors de la saisie",
    durationPlaceholder: "ex. 1,5",
    eventEndDate: "📅 Date de fin",
    eventReminder: "🔔 Rappel",
    eventAddAttachment: "📎 Ajouter image / fichier",
    reminderOnTime: "À l'heure",
    reminderHourBefore: "1 heure avant",
    chatAssistantHeader: "Assistant Self-Coding Multitool",
    voiceListeningTitle: "Écoute... (cliquer pour arrêter)",
    voiceWriteTitle: "Écriture vocale",
    archiveBtn: "Archiver",
    archivedRoutinesHeader: "Routines archivées",
    restoreBtn: "Restaurer",
    deletePermBtn: "Supprimer définitivement",
    sandboxPreviewTitle: "Aperçu en direct du Sandbox",
    namePlaceholderExample: "ex. Doruk",
    themeSlate: "🌙 Ardoise Sombre",
    themeCyberpunk: "⚡ Cyberpunk Néon",
    themeEmerald: "🌿 Menthe Émeraude",
    themeOled: "✨ OLED Or",
    themeDefaultLight: "☀️ Lumière Pure",
    versionFullLabel: "Multitool AI : Version v1.1.0",
    versionFooterLabel: "Multitool AI : Version 1.1.0",
    prevMonthTitle: "Mois précédent",
    nextMonthTitle: "Mois suivant",
    todayBtn: "Aujourd'hui",
    notifTaskRoutine: "Tâches / Routines",
    notifTasks: "Tâches",
    notifRoutines: "Routines",
    chatPlaceholder: "Saisissez votre message ou parlez...",
    autoTtsLabel: "Lecture vocale des réponses IA (TTS)",
    autoTtsHelp: "Lire automatiquement les réponses de l'IA par synthèse vocale.",
    listenBtn: "Écouter",
    stopListenBtn: "Arrêter",
    tipsCardTitle: "📌 Conseils d'utilisation Multitool AI",
    tipsCardContent: "En discutant avec l'IA, vous pouvez lui demander d'ajouter des événements à votre calendrier, mettre à jour votre liste de tâches ou écrire des notes !",
    thinkingProcess: "🧠 Processus de réflexion",
    notifUpcomingEvent: "⏰ Événement à venir !",
    notifEventTime: "📅 Heure de l'événement !",
    notifMinutesLeft: "min restantes",
    notifStartingNow: "commence maintenant",
    notifNewRoutine: "Nouvelle routine ajoutée 🔄",
    notifNewTask: "Nouvelle tâche ajoutée ✔️",
    confirmDeleteHabit: 'Supprimer définitivement « {title} » ? Cette action est irréversible.',
    confirmClearChatHistory: "Voulez-vous vraiment supprimer tout l'historique des discussions ?",
    logRoutineArchived: "Routine archivée : « {title} »",
    logRoutineRestored: "Routine restaurée depuis l'archive : « {title} »",
    logRoutineDeleted: "Routine supprimée définitivement : « {title} »",
    logSpeechUnsupported: "API de reconnaissance vocale non prise en charge.",
    logVoiceStarted: "Écoute vocale démarrée...",
    logVoiceError: "Erreur d'écoute vocale :",
    logVoiceStartFailed: "L'écoute vocale n'a pas pu démarrer :",
    logBackupDownloaded: "Sauvegarde des données téléchargée.",
    logBackupImported: "Données de sauvegarde importées avec succès.",
    logAutoArchived: "{count} tâche(s) terminée(s) déplacée(s) vers l'archive après 24 heures.",
    logChatHistoryLoadError: "Impossible de charger l'historique des discussions :",
    logNoApiKey: "{label} n'a pas de clé API: liste de modèles intégrée affichée. Saisissez une clé et cliquez sur « Scanner les modèles » pour un scan en direct.",
    logScanningProvider: "Analyse des modèles {provider}...",
    logOllamaNoModel: "Aucun modèle trouvé sur Ollama: démarrez d'abord le serveur Ollama et téléchargez un modèle.",
    logScanError: "Erreur de scan de modèles {provider} :",
    logCalendarFetchError: "Impossible de récupérer les événements du calendrier :",
    logTodosFetchError: "Impossible de récupérer les tâches :",
    logSandboxFetchError: "Impossible de récupérer les fichiers du sandbox :",
    logFileTooBig: "« {name} » est trop volumineux (>2 Mo), non ajouté.",
    logTodoAddError: "Erreur lors de l'ajout de la tâche :",
    logTodoUpdateError: "Erreur lors de la mise à jour de la tâche :",
    logTodoDeleteError: "Erreur lors de la suppression de la tâche :",
    logToolSuccess: "Outil {tool} exécuté avec succès.",
    logToolFailed: "Échec de l'exécution de l'outil {tool} :",
    logChatRunError: "Erreur d'exécution du chat :",
    logAiApkStart: "L'IA a lancé la compilation de l'APK...",
    logAiModifySource: "L'IA modifie le code source de l'application :",
    logAiServerStart: "L'IA démarre le serveur localhost sur le port {port}",
    termReady: "Terminal prêt. Utilisez les boutons pour exécuter du code ou le serveur localhost.\n",
    termRunning: "Exécution : {file}...",
    termRuntimeError: "Erreur d'exécution :",
    termApkBuildStarted: "Nouvelle compilation de l'APK démarrée (Vite + Capacitor + Gradle)...",
    termSuccess: "SUCCÈS",
    termDownloadLink: "Lien de téléchargement",
    termError: "ERREUR",
    termApkBuildFailed: "Échec de la compilation de l'APK",
    termConnError: "Erreur de connexion",
    termLocalhostUnreachable: "Impossible de joindre le serveur localhost :",
    termServerStarting: "Démarrage du serveur localhost...",
    termServerActive: "SERVEUR ACTIF",
    termEndpoint: "Endpoint",
    termLogs: "Logs",
    termServerStartFailed: "Impossible de démarrer le serveur :",
    termCodeSuccess: "Code exécuté avec succès (code de sortie : {code}).",
    termOutput: "Sortie / Retour :",
    termProgramDone: "Programme terminé avec succès (aucune sortie).",
    toolCallLabel: "Appel d'outil :",
    errChatComm: "Une erreur est survenue lors de la communication avec le modèle :",
    errTodoNotFound: "Tâche introuvable",
    errFileNotFound: "Fichier introuvable : {filename}",
    errOfflineJsOnly: "En mode hors ligne, seul le code JavaScript peut être exécuté.",
    errUnknownTool: "Outil inconnu : {tool}",
    errApkBuildFailed: "Échec de la compilation de l'APK",
    errSourceUpdateFailed: "Échec de la mise à jour du code source",
    errServerStartFailed: "Impossible de démarrer le serveur",
    errProviderResp: "Réponse de {provider} non réussie",
    errProviderNoModel: "Aucun modèle {provider} trouvé",
    errApiKeyNotSet: "La clé API de {provider} n'est pas définie.",
    errConnError: "Erreur de connexion : {status} {body}",
    systemFeedback: "[Retour système] Outil {tool} exécuté. Résultat : {result}",
    toolApkBuildDone: "Nouvelle compilation de l'APK terminée avec succès et placée sur le bureau !",
    sandboxOutputTitle: "Sortie du Sandbox",
    consolePreviewTitle: "Aperçu Console/JS",
    setupIntroTagline: "Ton compagnon de dev IA de poche: code, discute, automatise et compile des APKs depuis ton téléphone.",
    setupIntroCta: "C'est parti 🚀",
    setupStepLabel: "Étape {n} sur {total}",
    setupStepIntro: "Bienvenue",
    setupStepPersonalize: "Personnaliser",
    setupStepFeatures: "Fonctions",
    setupStepProvider: "Fournisseur IA",
    setupStepPersona: "Persona",
    setupStepAppearance: "Apparence",
    setupStepReview: "Vérification",
    setupStepDone: "Prêt",
    appearanceTitle: "🎨 Choisis ton style",
    appearanceSub: "Choisis un thème: modifiable à tout moment dans les Paramètres.",
    reviewTitle: "📋 Vérification finale",
    reviewSub: "Voici ta configuration. Ajuste si besoin, puis lance !",
    reviewNameLbl: "Nom",
    reviewLangLbl: "Langue",
    reviewProviderLbl: "Fournisseur IA",
    reviewPersonaLbl: "Persona",
    reviewThemeLbl: "Thème",
    reviewLooksGood: "Parfait : Lancer 🚀",
    setupPersonalizeTitle: "Personnalisons Multitool",
    setupPersonalizeSub: "Dis-moi ton nom et choisis une langue pour commencer.",
    downloadDayJpeg: "📥 Télécharger le jour (JPEG)",
    downloadWeekJpeg: "📥 Télécharger la semaine (JPEG)",
    downloadNoteJpeg: "📥 Enregistrer la note (JPEG)",
    downloadAllNotesJpeg: "📥 Enregistrer toutes les notes (JPEG)",
    noteCardTitle: "Note Personnelle",
    notesOverviewTitle: "Aperçu des Notes",
    logNoteSavedGallery: "Note enregistrée dans la galerie",
    agendaCardTitle: "Agenda du jour",
    weeklyAgendaTitle: "Agenda semainier",
    agendaNoEventsCard: "Aucun événement prévu pour ce jour.",
    agendaEventsCount: "{n} événements",
    agendaAllDay: "Toute la journée",
    agendaGeneratedBy: "Généré par Multitool AI",
  },
  it: {
    welcomeTitle: "Benvenuto in Multitool AI",
    welcomeDesc: "Il tuo assistente personale intelligente, sandbox per codice su dispositivo e organizzatore di calendario.",
    discoverFeatures: "Seleziona lingua e inizia 🚀",
    exploreBtn: "Esplora le funzionalità e inizia 🚀",
    featuresTitle: "Cosa puoi fare? ⚡",
    featuresSub: "Funzionalità principali della piattaforma Multitool:",
    feat1Title: "🛠️ Self-Coding e Sandbox Web in tempo reale",
    feat1Desc: "Genera codice con l'IA, avvia server Express e testa immediatamente online.",
    feat2Title: "✔️ Attività e Routine",
    feat2Desc: "Gestisci facilmente i tuoi compiti e le routine quotidiane.",
    feat3Title: "📅 Agenda intelligente e Notifiche",
    feat3Desc: "Gestisci eventi e ricevi notifiche di promemoria tempestive.",
    feat4Title: "💬 Chat IA e Modelli di Linguaggio",
    feat4Desc: "Chatta con i modelli Groq Cloud, DeepSeek, OpenAI, Gemini, OpenRouter e Ollama.",
    aiProviderTitle: "Configurazione provider IA 🔑",
    aiProviderSub: "Configura il tuo motore IA e la chiave API.",
    nameLabel: "👤 Il tuo nome",
    namePlaceholder: "Inserisci il tuo nome...",
    selectLang: "Lingua dell'app",
    selectProvider: "Seleziona provider",
    selectModelLabel: "Selezione Modello",
    groqLabel: "Groq Cloud (Alta velocità)",
    deepseekLabel: "DeepSeek API",
    openaiLabel: "OpenAI (GPT-4o)",
    geminiLabel: "Google Gemini API",
    openrouterLabel: "OpenRouter API",
    ollamaLabel: "Ollama (Server locale)",
    apiKeyLabel: "Chiave API Groq",
    apiKeyDeepseek: "Chiave API DeepSeek",
    apiKeyOpenAI: "Chiave API OpenAI",
    apiKeyGemini: "Chiave API Google Gemini",
    apiKeyOpenRouter: "Chiave API OpenRouter",
    ollamaUrlLabel: "URL del server Ollama",
    promptWeightLabel: "Complessità del Prompt di Sistema (Velocità)",
    promptWeightHelp: "Riduci la lunghezza del prompt per velocizzare notevolmente i modelli locali (Ollama).",
    promptWeightFull: "⚡⚡⚡ Completo (Tutti i 17 Strumenti e Persona Dettagliata)",
    promptWeightBalanced: "⚡⚡ Bilanciato (Note, Calendario e Attività Essenziali)",
    promptWeightMinimal: "⚡ Veloce / Minimo (Risposta Ultra-Veloce - Leggero)",
    personaTitle: "Scegli il ruolo dell'assistente 🎭",
    personaSub: "Seleziona il settore di competenza principale:",
    completeTitle: "Tutto pronto! 🎉",
    completeDesc: "Multitool AI Agent è completamente configurato.",
    startAppBtn: "Avvia Multitool ✨",
    nextBtn: "Avanti",
    backBtn: "Indietro",
    setupRestart: "Riavvia procedura guidata",
    notes: "Note",
    notesTitle: "📝 Le Mie Note",
    newNoteHeader: "Crea nuova nota",
    noteTitlePlaceholder: "Titolo della nota...",
    tagsLabel: "Tag personalizzati",
    tagsPlaceholder: "Tag (separati da virgola: #progetto, #urgente)...",
    noteContentPlaceholder: "Scrivi il contenuto qui...",
    saveNoteBtn: "Salva nota",
    searchNotesPlaceholder: "Cerca note o tag...",
    allTags: "Tutti i tag",
    noNotesYet: "Nessuna nota salvata.",
    newChat: "Nuova Chat",
    chatHistory: "Cronologia chat",
    chatHistoryModalTitle: "Cronologia chat salvata",
    noSavedChats: "Nessuna chat salvata.",
    startNewChatBtn: "Avvia nuova chat",
    clearCurrentChat: "Cancella chat attuale",
    sendMsg: "Invia messaggio",
    isRoutine: "Attività di routine",
    routineFrequency: "Frequenza",
    daily: "Giornaliero",
    weekly: "Settimanale",
    monthly: "Mensile",
    routines: "Routine",
    activeStatus: "Attivo",
    noKeyStatus: "Nessuna chiave API",
    quickAddTodo: "Aggiungi attività",
    quickAddEvent: "Aggiungi evento",
    quickVoiceNote: "Nota vocale",
    quickSummary: "Riepilogo del giorno",
    quickSandbox: "Sandbox",
    tabChat: "Chat",
    tabNotes: "Note",
    tabCalendar: "Calendario",
    tabTodos: "Attività",
    tabAnalytics: "Analisi",
    tabSandbox: "Sandbox",
    welcomeGreeting: "Ciao! Sono il tuo Assistente Multitool AI. Come posso aiutarti oggi?",
    newChatGreeting: "Ciao! Nuova chat avviata. Come posso aiutarti?",
    chatTitlePrefix: "Chat",
    lowPriority: "Bassa Priorità",
    medPriority: "Media Priorità",
    highPriority: "Alta Priorità",
    noTasksFound: "Nessuna attività trovata.",
    archivedTasks: "Attività Archiviate",
    clearArchive: "Svuota Archivio",
    archived: "Archiviato",
    viewFlow: "Flusso",
    viewWeekly: "Settimanale",
    viewList: "Lista",
    emptyTimeSlot: "Fascia Oraria Libera",
    addEvent: "Aggiungi Evento",
    eventTitlePlaceholder: "Titolo Evento...",
    eventStartTime: "⏰ Ora Inizio",
    eventEndTime: "⌛ Ora Fine",
    eventDate: "📅 Data",
    eventDescPlaceholder: "Descrizione (Opzionale)",
    saveEventBtn: "Salva Evento",
    analyticsHeader: "📊 Analisi e Routine IA",
    getReportNotif: "🔔 Ricevi Notifica",
    todaysSummary: "📌 Riepilogo di Oggi",
    taskStatus: "Stato Attività:",
    todaySchedule: "Programma di Oggi:",
    dailyRoutines: "Routine Giornaliere:",
    completedTasksLabel: "Attività Completate",
    eventsLabel: "Eventi",
    routinesLabel: "Routine",
    habitsHeader: "Abitudini e Routine",
    addRoutineBtn: "+ Aggiungi Routine",
    noRoutinesYet: "Nessuna routine registrata.",
    aiAdviceHeader: "Consigli di Produttività IA",
    sandboxHeader: "💻 Code & Localhost Sandbox",
    editorTab: "✏️ Editor",
    livePreviewTab: "🌐 Anteprima Live",
    filesTab: "📂 File",
    liveSandboxPreview: "🌐 Anteprima Web Sandbox Live",
    refreshBtn: "Aggiorna",
    sandboxFolderLabel: "Cartella Sandbox (./sandbox)",
    sandboxEmpty: "La cartella è vuota.",
    openNewFile: "Apri Nuovo File:",
    openBtn: "Apri",
    selectTemplate: "🚀 Seleziona Template...",
    expressTemplate: "⚡ Server API Express",
    reactTemplate: "⚛️ Componente React",
    htmlTemplate: "🎨 Pagina HTML5",
    runBtn: "Esegui",
    saveBtn: "Salva",
    languageLabel: "Lingua",
    settingsTitle: "⚙️ Impostazioni",
    userProfileLabel: "👤 Profilo Utente & Notifiche",
    yourNameLabel: "Il Tuo Nome",
    testNotificationBtn: "Invia Notifica di Test",
    notificationSent: "Notifica inviata!",
    themeLabel: "Tema & Pacchetti di Design Visivo",
    aiProviderSettingsLabel: "Fornitore di Servizio IA",
    providerSelectLabel: "Seleziona Fornitore",
    loadingModels: "Caricamento modelli...",
    saveAndTestBtn: "Salva & Testa Connessione",
    aboutTitle: "Informazioni & Dettagli",
    checkUpdatesBtn: "Controlla aggiornamenti",
    checkingUpdates: "Controllo aggiornamenti in corso...",
    updateAvailableTitle: "🚀 Nuovo aggiornamento disponibile!",
    updateAvailableSub: "La versione {version} di Multitool AI è disponibile. Scaricala e installala ora.",
    btnDownloadUpdate: "⚡ Scarica e installa aggiornamento",
    btnDismissUpdate: "Più tardi",
    updateCheckFailed: "Impossibile controllare gli aggiornamenti. Verifica la connessione.",
    upToDateMsg: "La tua app è aggiornata (v1.1.0).",
    releaseNotesLabel: "Note di rilascio:",
    aboutDesc: "Questa app è un assistente mobile con IA Self-Coding e supporto Localhost Node.js (Multitool).",
    versionLabel: "Versione",
    architectureLabel: "Architettura",
    buildLabel: "Compilazione",
    databaseLabel: "Database",
    backupTitle: "Backup & Ripristino Dati",
    backupDesc: "Esegui il backup o importa tutti i dati di calendario, attività, chat e sandbox in formato JSON.",
    exportBtn: "Esporta (Backup)",
    importBtn: "Importa",
    systemLogsTitle: "Registri di Sistema",
    noLogs: "Nessuna voce di registro.",
    setupWizardTitle: "🚀 Procedura Guidata",
    setupWizardDesc: "Riavvia la procedura guidata per riconfigurare il tuo fornitore IA e il ruolo predefinito.",
    setupWizardRestartBtn: "Riavvia Procedura Guidata",
    calendarTitle: "📅 Calendario & Programma",
    scheduleLabel: "Programma",
    viewTimeline: "Flusso",
    todosTitle: "✔️ Attività & Routine",
    completionRateLabel: "Tasso di Completamento Complessivo",
    activeLabel: "Attivo",
    completedLabel: "Completato",
    archivedLabel: "Archiviato",
    allTasksLabel: "Tutte le Attività",
    normalTasksLabel: "Attività Normali",
    routinesTabLabel: "🔄 Routine",
    todoPlaceholder: "Attività o routine da fare...",
    priorityLow: "Bassa Priorità",
    priorityMedium: "Media Priorità",
    priorityHigh: "Alta Priorità",
    freqDaily: "Ogni Giorno (Giornaliero)",
    freqWeekly: "Ogni Settimana (Settimanale)",
    freqMonthly: "Ogni Mese (Mensile)",
    addTaskBtn: "Aggiungi Attività",
    voiceNoteBtn: "Nota Vocale",
    dueDateLabel: "Scadenza",
    routineTagDaily: "Giornaliero",
    routineTagWeekly: "Settimanale",
    routineTagMonthly: "Mensile",
    completedTag: "Completato",
    archivedTasksHeader: "Attività Archiviate",
    clearArchiveConfirm: "Sei sicuro di voler cancellare tutte le attività archiviate?",
    analyticsTitle: "📊 Analisi IA & Routine",
    getReportBtn: "Ricevi Notifica Rapporto",
    todaySummaryHeader: "Riepilogo di Oggi",
    taskStatusLabel: "Stato Attività:",
    todayScheduleLabel: "Programma di Oggi:",
    dailyRoutinesLabel: "Routine Giornaliere:",
    completedTasksGrid: "Attività Completate",
    eventsGrid: "Eventi",
    routineGrid: "Routine",
    dailyHabitsHeader: "Abitudini e Routine Giornaliere",
    addRoutinePrompt: "Nome Nuova Abitudine / Routine:",
    streakDays: "Giorni",
    aiProductivityHeader: "Consigli di Produttività IA",
    sandboxTitle: "💻 Code & Localhost Sandbox",
    previewTab: "Anteprima Live",
    livePreviewTitle: "Anteprima Web Sandbox Live",
    sandboxFolderEmpty: "La cartella è vuota. L'IA può creare file qui oppure puoi aprire nuovi file.",
    newFileOpen: "Apri Nuovo File:",
    localhostServerBtn: "Server Localhost (3005)",
    exportHtmlBtn: "Esporta (HTML)",
    buildApkBtn: "Compila Nuova APK",
    buildingApk: "Compilazione...",
    consoleTitle: "Output Console & Registri Server",
    clearBtn: "Cancella",
    personaCoder: "🛠️ Self-Coder",
    personaCoderDesc: "Focus su codifica, server e compilazione APK.",
    personaOrganizer: "📅 Organizzatore",
    personaOrganizerDesc: "Focus su calendario, agenda e gestione attività.",
    personaWriter: "✍️ Scrittore",
    personaWriterDesc: "Focus su riepilogo, email, testi e traduzione.",
    personaAnalyst: "🧠 Analista",
    personaAnalystDesc: "Logica approfondita per analisi passo passo.",
    speechNotSupported: "Il riconoscimento vocale non è supportato o non è attivo sul tuo dispositivo.",
    speechNotSupportedWeb: "Il riconoscimento vocale web non è supportato sul tuo dispositivo.",
    voiceTaskRecorded: "Attività vocale registrata",
    newVoiceTaskNotifTitle: "Nuova Attività Vocale 🎙️",
    newVoiceTaskNotifBody: "Attività",
    backupError: "Errore durante la creazione del backup",
    importSuccess: "Tutti i tuoi dati sono stati importati con successo!",
    importError: "Errore di importazione del backup",
    fileSaved: "file salvato.",
    deleteFileConfirm: "Sei sicuro di voler eliminare",
    deleteNoteConfirm: "Sei sicuro di voler eliminare questa nota?",
    noModelError: "Modello non trovato. Inserisci una chiave API valida nelle Impostazioni.",
    noOllamaModelError: "Nessun modello Ollama selezionato. Controlla l'URL Ollama nelle Impostazioni.",
    downloadApkTitle: "Scarica Ultima APK",
    downloadApkBtn: "Scarica APK",
    messagesCount: "messaggi",
    deleteChat: "Elimina Chat",
    catAll: "Tutti",
    catGeneral: "Generale",
    catIdea: "Idea",
    catWork: "Lavoro",
    catPersonal: "Personale",
    catCode: "Codice",
    buildApkPrompt: "Puoi compilare una nuova APK e darmi un link per il download?",
    buildApkCardTitle: "Compila APK Automatica",
    buildApkCardSub: "Compila con Vite + Capacitor + Gradle",
    reminderMinBefore: "min prima",
    newFileContent: "// Contenuto del nuovo file...",
    aiAdviceEmpty: "Nessuna attività o routine aggiunta. Inizia a monitorare la tua produttività!",
    aiAdviceProgress: "oggi hai completato attività e routine. Ottimo progresso! 🚀",
    selectModelPlaceholder: "Seleziona modello...",
    scanModels: "Scansiona modelli",
    scanningModels: "Scansione modelli...",
    cancelBtn: "Annulla",
    other: "Altro",
    resultLabel: "Risultato:",
    paramsLabel: "Parametri:",
    errorLabel: "Errore:",
    noEventsDay: "Nessun evento registrato per il giorno selezionato.",
    noEventsDate: "Nessun evento registrato per questa data.",
    eventsForDateSuffix: "Eventi",
    eventStartDate: "📅 Data di inizio",
    eventDuration: "⏱️ Durata (ore): la fine si imposta automaticamente inserendo",
    durationPlaceholder: "es. 1,5",
    eventEndDate: "📅 Data di fine",
    eventReminder: "🔔 Promemoria",
    eventAddAttachment: "📎 Aggiungi immagine / file",
    reminderOnTime: "Puntuale",
    reminderHourBefore: "1 ora prima",
    chatAssistantHeader: "Assistente Self-Coding Multitool",
    voiceListeningTitle: "In ascolto... (clicca per fermare)",
    voiceWriteTitle: "Scrivi con voce",
    archiveBtn: "Archivia",
    archivedRoutinesHeader: "Routine archiviate",
    restoreBtn: "Ripristina",
    deletePermBtn: "Elimina definitivamente",
    sandboxPreviewTitle: "Anteprima live del Sandbox",
    namePlaceholderExample: "es. Doruk",
    themeSlate: "🌙 Ardesia Scuro",
    themeCyberpunk: "⚡ Cyberpunk Neon",
    themeEmerald: "🌿 Menta Smeraldo",
    themeOled: "✨ OLED Oro",
    themeDefaultLight: "☀️ Luce Pura",
    versionFullLabel: "Multitool AI • Versione v1.1.0",
    versionFooterLabel: "Multitool AI • Versione 1.1.0",
    prevMonthTitle: "Mese precedente",
    nextMonthTitle: "Mese successivo",
    todayBtn: "Oggi",
    notifTaskRoutine: "Attività / Routine",
    notifTasks: "Attività",
    notifRoutines: "Routine",
    chatPlaceholder: "Scrivi il tuo messaggio o parla...",
    autoTtsLabel: "Leggi risposte IA (TTS)",
    autoTtsHelp: "Converti automaticamente le risposte dell'IA in sintesi vocale.",
    listenBtn: "Ascolta",
    stopListenBtn: "Ferma",
    tipsCardTitle: "📌 Consigli d'uso di Multitool AI",
    tipsCardContent: "Mentre chatti con l'IA puoi chiederle di aggiungere eventi al calendario, aggiornare la lista delle attività o scrivere note!",
    thinkingProcess: "🧠 Processo di pensiero",
    notifUpcomingEvent: "⏰ Evento in arrivo!",
    notifEventTime: "📅 Ora dell'evento!",
    notifMinutesLeft: "min rimanenti",
    notifStartingNow: "inizia ora",
    notifNewRoutine: "Nuova routine aggiunta 🔄",
    notifNewTask: "Nuova attività aggiunta ✔️",
    confirmDeleteHabit: 'Eliminare definitivamente "{title}"? Questa azione non può essere annullata.',
    confirmClearChatHistory: "Vuoi davvero eliminare tutta la cronologia delle chat?",
    logRoutineArchived: 'Routine archiviata: "{title}"',
    logRoutineRestored: "Routine ripristinata dall'archivio: \"{title}\"",
    logRoutineDeleted: 'Routine eliminata definitivamente: "{title}"',
    logSpeechUnsupported: "API di riconoscimento vocale non supportata.",
    logVoiceStarted: "Ascolto vocale avviato...",
    logVoiceError: "Errore di ascolto vocale:",
    logVoiceStartFailed: "L'ascolto vocale non è potuto avviare:",
    logBackupDownloaded: "Backup dei dati scaricato.",
    logBackupImported: "Dati di backup importati correttamente.",
    logAutoArchived: "{count} attività completata/e spostata/e in archivio dopo 24 ore.",
    logChatHistoryLoadError: "Impossibile caricare la cronologia chat:",
    logNoApiKey: '{label} non ha API Key: mostra lista modelli integrata. Inserisci una chiave e premi "Scansiona modelli" per una scansione live.',
    logScanningProvider: "Scansione modelli {provider}...",
    logOllamaNoModel: "Nessun modello trovato su Ollama: avvia prima il server Ollama e scarica un modello.",
    logScanError: "Errore scansione modelli {provider}:",
    logCalendarFetchError: "Impossibile recuperare gli eventi del calendario:",
    logTodosFetchError: "Impossibile recuperare le attività:",
    logSandboxFetchError: "Impossibile recuperare i file del sandbox:",
    logFileTooBig: '"{name}" è troppo grande (>2MB), non aggiunto.',
    logTodoAddError: "Errore durante l'aggiunta dell'attività:",
    logTodoUpdateError: "Errore durante l'aggiornamento dell'attività:",
    logTodoDeleteError: "Errore durante l'eliminazione dell'attività:",
    logToolSuccess: "Strumento {tool} eseguito correttamente.",
    logToolFailed: "Esecuzione strumento {tool} fallita:",
    logChatRunError: "Errore di esecuzione chat:",
    logAiApkStart: "IA ha avviato la compilazione APK...",
    logAiModifySource: "L'IA sta modificando il codice sorgente dell'app:",
    logAiServerStart: "IA sta avviando il server localhost sulla porta {port}",
    termReady: "Terminal pronto. Usa i pulsanti per eseguire codice o il server localhost.\n",
    termRunning: "Esecuzione: {file}...",
    termRuntimeError: "Errore di runtime:",
    termApkBuildStarted: "Nuova compilazione APK avviata (Vite + Capacitor + Gradle)...",
    termSuccess: "SUCCESSO",
    termDownloadLink: "Link di download",
    termError: "ERRORE",
    termApkBuildFailed: "Compilazione APK fallita",
    termConnError: "Errore di connessione",
    termLocalhostUnreachable: "Impossibile raggiungere il server localhost:",
    termServerStarting: "Avvio del server localhost...",
    termServerActive: "SERVER ATTIVO",
    termEndpoint: "Endpoint",
    termLogs: "Log",
    termServerStartFailed: "Impossibile avviare il server:",
    termCodeSuccess: "Codice eseguito correttamente (Exit Code: {code}).",
    termOutput: "Output / Ritorno:",
    termProgramDone: "Programma completato correttamente (nessun output).",
    toolCallLabel: "Chiamata strumento:",
    errChatComm: "Si è verificato un errore nella comunicazione con il modello:",
    errTodoNotFound: "Attività non trovata",
    errFileNotFound: "File non trovato: {filename}",
    errOfflineJsOnly: "In modalità offline è possibile eseguire solo codice JavaScript.",
    errUnknownTool: "Strumento sconosciuto: {tool}",
    errApkBuildFailed: "Compilazione APK fallita",
    errSourceUpdateFailed: "Aggiornamento sorgente fallito",
    errServerStartFailed: "Impossibile avviare il server",
    errProviderResp: "Risposta di {provider} non riuscita",
    errProviderNoModel: "Nessun modello {provider} trovato",
    errApiKeyNotSet: "API Key di {provider} non impostata.",
    errConnError: "Errore di connessione: {status} {body}",
    systemFeedback: "[Feedback di sistema] Strumento {tool} eseguito. Risultato: {result}",
    toolApkBuildDone: "Nuova compilazione APK completata con successo e salvata sul desktop!",
    sandboxOutputTitle: "Output Sandbox",
    consolePreviewTitle: "Anteprima Console/JS",
    setupIntroTagline: "Il tuo compagno di sviluppo IA tascabile: programma, chatta, automatizza e compila APK dal telefono.",
    setupIntroCta: "Iniziamo 🚀",
    setupSkip: "Salta per ora",
    setupStepLabel: "Passo {n} di {total}",
    setupStepIntro: "Benvenuto",
    setupStepPersonalize: "Personalizza",
    setupStepFeatures: "Funzioni",
    setupStepProvider: "Fornitore IA",
    setupStepPersona: "Persona",
    setupStepAppearance: "Aspetto",
    setupStepReview: "Riepilogo",
    setupStepDone: "Pronto",
    appearanceTitle: "🎨 Scegli il tuo stile",
    appearanceSub: "Scegli un tema: modificabile quando vuoi in Impostazioni.",
    reviewTitle: "📋 Controllo finale",
    reviewSub: "La tua configurazione. Modifica se vuoi, poi avvia!",
    reviewNameLbl: "Nome",
    reviewLangLbl: "Lingua",
    reviewProviderLbl: "Fornitore IA",
    reviewPersonaLbl: "Persona",
    reviewThemeLbl: "Tema",
    reviewLooksGood: "Perfetto • Avvia 🚀",
    setupPersonalizeTitle: "Personalizziamo Multitool",
    setupPersonalizeSub: "Dimmi il tuo nome e scegli una lingua per iniziare.",
    downloadDayJpeg: "📥 Scarica giornata (JPEG)",
    downloadWeekJpeg: "📥 Scarica settimana (JPEG)",
    downloadNoteJpeg: "📥 Salva nota (JPEG)",
    downloadAllNotesJpeg: "📥 Salva tutte le note (JPEG)",
    noteCardTitle: "Nota Personale",
    notesOverviewTitle: "Panoramica delle Note",
    logNoteSavedGallery: "Nota salvata nella galleria",
    agendaCardTitle: "Agenda del giorno",
    weeklyAgendaTitle: "Agenda settimanale",
    agendaNoEventsCard: "Nessun evento programmato per questo giorno.",
    agendaEventsCount: "{n} eventi",
    agendaAllDay: "Tutto il giorno",
    agendaGeneratedBy: "Generato da Multitool AI",
  }
};

// API key gerektirmeden gösterilen güncel gömülü model listeleri.
// "Modelleri Tara" ile API key girildiğinde canlı listeyle güncellenir.
const BUILTIN_MODELS: Record<string, Model[]> = {
  groq: [
    { name: 'llama-3.3-70b-versatile', model: 'llama-3.3-70b-versatile' },
    { name: 'llama-3.1-8b-instant', model: 'llama-3.1-8b-instant' },
    { name: 'llama-3.1-70b-versatile', model: 'llama-3.1-70b-versatile' },
    { name: 'mixtral-8x7b-32768', model: 'mixtral-8x7b-32768' },
    { name: 'gemma2-9b-it', model: 'gemma2-9b-it' }
  ],
  deepseek: [
    { name: 'deepseek-chat', model: 'deepseek-chat' },
    { name: 'deepseek-reasoner', model: 'deepseek-reasoner' }
  ],
  openai: [
    { name: 'gpt-4o-mini', model: 'gpt-4o-mini' },
    { name: 'gpt-4o', model: 'gpt-4o' },
    { name: 'gpt-4.1-mini', model: 'gpt-4.1-mini' },
    { name: 'gpt-4.1', model: 'gpt-4.1' },
    { name: 'o1-mini', model: 'o1-mini' },
    { name: 'o3-mini', model: 'o3-mini' }
  ],
  gemini: [
    { name: 'gemini-2.0-flash', model: 'gemini-2.0-flash' },
    { name: 'gemini-2.5-flash', model: 'gemini-2.5-flash' },
    { name: 'gemini-1.5-flash', model: 'gemini-1.5-flash' },
    { name: 'gemini-1.5-pro', model: 'gemini-1.5-pro' }
  ],
  openrouter: [
    { name: 'google/gemini-2.0-flash-001', model: 'google/gemini-2.0-flash-001' },
    { name: 'deepseek/deepseek-r1:free', model: 'deepseek/deepseek-r1:free' },
    { name: 'meta-llama/llama-3.3-70b-instruct:free', model: 'meta-llama/llama-3.3-70b-instruct:free' },
    { name: 'anthropic/claude-3.5-haiku', model: 'anthropic/claude-3.5-haiku' },
    { name: 'openai/gpt-4o-mini', model: 'openai/gpt-4o-mini' }
  ],
  ollama: []
};

export default function App() {
  const [userName, setUserName] = useState<string>(() => localStorage.getItem('multitool_user_name') || '');

  useEffect(() => {
    localStorage.setItem('multitool_user_name', userName);
  }, [userName]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const interval = setInterval(() => {
      const currentName = localStorage.getItem('multitool_user_name') || userName || (language === 'tr' ? 'Dostum' : 'Friend');
      const msg = language === 'tr' ? `Beni özledin mi, ${currentName}? ✨ Sohbet etmeye veya projelerini geliştirmeye devam edelim!` :
        language === 'de' ? `Hast du mich vermisst, ${currentName}? ✨ Lass uns chatten oder deine Projekte weiterentwickeln!` :
          language === 'es' ? `¿Me extrañaste, ${currentName}? ✨ ¡Sigamos chateando o desarrollando tus proyectos!` :
            language === 'fr' ? `Tu m'as manqué, ${currentName} ? ✨ Continuons à discuter ou à développer vos projets !` :
              language === 'it' ? `Ti sono mancato, ${currentName}? ✨ Continuiamo a chattare o a sviluppare i tuoi progetti!` :
                `Did you miss me, ${currentName}? ✨ Let's continue chatting or developing your projects!`;
      sendNotification('Multitool AI 🤖', msg);
    }, 2 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [userName]);

  const [theme, setTheme] = useState<'default' | 'dark' | 'cyberpunk' | 'emerald' | 'oled'>(() => (localStorage.getItem('multitool_theme') as any) || 'default');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('multitool_theme', theme);
  }, [theme]);

  const [habits, setHabits] = useState<Array<{ id: string; title: string; streak: number; completedToday: boolean }>>(() => {
    const saved = localStorage.getItem('multitool_habits');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('multitool_habits', JSON.stringify(habits));
  }, [habits]);

  type ArchivedHabit = { id: string; title: string; streak: number; completedToday: boolean; archivedAt: string };
  const [archivedHabits, setArchivedHabits] = useState<ArchivedHabit[]>(() => {
    const saved = localStorage.getItem('multitool_habits_archived');
    return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => {
    localStorage.setItem('multitool_habits_archived', JSON.stringify(archivedHabits));
  }, [archivedHabits]);
  const [showArchivedHabits, setShowArchivedHabits] = useState<boolean>(false);

  const archiveHabit = (id: string) => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;
    setArchivedHabits(prev => [{ ...habit, archivedAt: new Date().toISOString() }, ...prev]);
    setHabits(prev => prev.filter(h => h.id !== id));
    addLog(t.logRoutineArchived.replace('{title}', habit.title));
  };
  const restoreHabit = (id: string) => {
    const habit = archivedHabits.find(h => h.id === id);
    if (!habit) return;
    const { archivedAt, ...rest } = habit;
    setHabits(prev => [...prev, { ...rest, completedToday: false }]);
    setArchivedHabits(prev => prev.filter(h => h.id !== id));
    addLog(t.logRoutineRestored.replace('{title}', habit.title));
  };
  const permanentlyDeleteHabit = (id: string) => {
    const habit = archivedHabits.find(h => h.id === id);
    if (!habit) return;
    if (!window.confirm(t.confirmDeleteHabit.replace('{title}', habit.title))) return;
    setArchivedHabits(prev => prev.filter(h => h.id !== id));
    addLog(t.logRoutineDeleted.replace('{title}', habit.title));
  };

  const [activeTab, setActiveTab] = useState<'chat' | 'calendar' | 'todos' | 'notes' | 'dashboard' | 'sandbox' | 'settings'>('chat');

  // GitHub Auto Update Logic
  interface UpdateInfo {
    hasUpdate: boolean;
    latestVersion: string;
    downloadUrl: string;
    releaseNotes: string;
    releaseUrl: string;
  }
  const CURRENT_VERSION = '1.1.0';
  const [availableUpdate, setAvailableUpdate] = useState<UpdateInfo | null>(null);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState<boolean>(false);

  const semverCompare = (v1: string, v2: string): number => {
    const clean = (v: string) => v.replace(/^v/i, '').trim().split('.').map(n => parseInt(n, 10) || 0);
    const p1 = clean(v1);
    const p2 = clean(v2);
    for (let i = 0; i < Math.max(p1.length, p2.length); i++) {
      const num1 = p1[i] || 0;
      const num2 = p2[i] || 0;
      if (num1 > num2) return 1;
      if (num1 < num2) return -1;
    }
    return 0;
  };

  const checkForUpdates = async (manual = false) => {
    setIsCheckingUpdate(true);
    try {
      const res = await fetch('https://api.github.com/repos/drkkahraman/multitool/releases/latest');
      if (!res.ok) {
        if (manual) alert(t.updateCheckFailed);
        setIsCheckingUpdate(false);
        return null;
      }
      const data = await res.json();
      const latestTag = data.tag_name || data.name || '';
      const cleanTag = latestTag.replace(/^v/i, '');

      let apkUrl = '';
      if (data.assets && Array.isArray(data.assets)) {
        const apkAsset = data.assets.find((a: any) => a.name && a.name.endsWith('.apk'));
        if (apkAsset) {
          apkUrl = apkAsset.browser_download_url;
        }
      }
      if (!apkUrl) {
        apkUrl = data.html_url || 'https://github.com/drkkahraman/multitool/releases/latest';
      }

      const isNewer = semverCompare(cleanTag, CURRENT_VERSION) > 0;
      const info: UpdateInfo = {
        hasUpdate: isNewer,
        latestVersion: latestTag.startsWith('v') ? latestTag : `v${latestTag}`,
        downloadUrl: apkUrl,
        releaseNotes: data.body || '',
        releaseUrl: data.html_url || 'https://github.com/drkkahraman/multitool/releases/latest'
      };

      if (isNewer) {
        setAvailableUpdate(info);
        addLog(`Yeni güncelleme bulundu: ${info.latestVersion}`);
      } else if (manual) {
        alert(t.upToDateMsg);
      }
      setIsCheckingUpdate(false);
      return info;
    } catch (err: any) {
      if (manual) alert(t.updateCheckFailed);
      setIsCheckingUpdate(false);
      return null;
    }
  };

  useEffect(() => {
    checkForUpdates(false);
  }, []);

  const handleDownloadUpdate = (url: string) => {
    addLog(`Güncelleme indirme başlatıldı: ${url}`);
    if ((window as any).AndroidNative && typeof (window as any).AndroidNative.openUrl === 'function') {
      (window as any).AndroidNative.openUrl(url);
    } else {
      window.open(url, '_blank');
    }
  };
  const usePhoneFrame = false;
  const [currentTime, setCurrentTime] = useState<string>(() =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const [batteryLevel, setBatteryLevel] = useState<number>(100);
  const [isCharging, setIsCharging] = useState<boolean>(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        setIsCharging(battery.charging);

        const handleLevelChange = () => setBatteryLevel(Math.round(battery.level * 100));
        const handleChargingChange = () => setIsCharging(battery.charging);

        battery.addEventListener('levelchange', handleLevelChange);
        battery.addEventListener('chargingchange', handleChargingChange);
      }).catch(() => { });
    }
  }, []);

  const [hasLoadedHistory, setHasLoadedHistory] = useState<boolean>(true);

  const [provider, setProvider] = useState<'ollama' | 'groq' | 'deepseek' | 'openai' | 'gemini' | 'openrouter'>(() => {
    return (localStorage.getItem('multitool_provider') as any) || 'groq';
  });

  const [ollamaUrl, setOllamaUrl] = useState<string>(() => localStorage.getItem('multitool_ollama_url') || 'http://localhost:11434');
  const [groqApiKey, setGroqApiKey] = useState<string>(() => localStorage.getItem('multitool_groq_api_key') || '');
  const [groqModel, setGroqModel] = useState<string>(() => localStorage.getItem('multitool_groq_model') || '');

  const [deepseekApiKey, setDeepseekApiKey] = useState<string>(() => localStorage.getItem('multitool_deepseek_api_key') || '');
  const [deepseekModel, setDeepseekModel] = useState<string>(() => localStorage.getItem('multitool_deepseek_model') || '');

  const [openaiApiKey, setOpenaiApiKey] = useState<string>(() => localStorage.getItem('multitool_openai_api_key') || '');
  const [openaiModel, setOpenaiModel] = useState<string>(() => localStorage.getItem('multitool_openai_model') || '');

  const [geminiApiKey, setGeminiApiKey] = useState<string>(() => localStorage.getItem('multitool_gemini_api_key') || '');
  const [geminiModel, setGeminiModel] = useState<string>(() => localStorage.getItem('multitool_gemini_model') || '');

  const [openrouterApiKey, setOpenrouterApiKey] = useState<string>(() => localStorage.getItem('multitool_openrouter_api_key') || '');
  const [openrouterModel, setOpenrouterModel] = useState<string>(() => localStorage.getItem('multitool_openrouter_model') || '');

  const [promptWeight, setPromptWeight] = useState<'full' | 'balanced' | 'minimal'>(() => {
    return (localStorage.getItem('multitool_prompt_weight') as any) || 'full';
  });

  const [models, setModels] = useState<Model[]>(() => {
    const p = (localStorage.getItem('multitool_provider') as any) || 'groq';
    return BUILTIN_MODELS[p] || [];
  });
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoadingModels, setIsLoadingModels] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('multitool_provider', provider);
    localStorage.setItem('multitool_ollama_url', ollamaUrl);
    localStorage.setItem('multitool_groq_api_key', groqApiKey);
    localStorage.setItem('multitool_groq_model', groqModel);
    localStorage.setItem('multitool_deepseek_api_key', deepseekApiKey);
    localStorage.setItem('multitool_deepseek_model', deepseekModel);
    localStorage.setItem('multitool_openai_api_key', openaiApiKey);
    localStorage.setItem('multitool_openai_model', openaiModel);
    localStorage.setItem('multitool_gemini_api_key', geminiApiKey);
    localStorage.setItem('multitool_gemini_model', geminiModel);
    localStorage.setItem('multitool_openrouter_api_key', openrouterApiKey);
    localStorage.setItem('multitool_openrouter_model', openrouterModel);
    localStorage.setItem('multitool_prompt_weight', promptWeight);
  }, [provider, ollamaUrl, groqApiKey, groqModel, deepseekApiKey, deepseekModel, openaiApiKey, openaiModel, geminiApiKey, geminiModel, openrouterApiKey, openrouterModel, promptWeight]);

  // Multiple Chat Sessions
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(() => {
    const curT = (TRANSLATIONS as any)[(localStorage.getItem('multitool_language') as any) || 'tr'] || TRANSLATIONS.tr;
    try {
      const saved = localStorage.getItem('multitool_chat_sessions');
      if (saved) return JSON.parse(saved);
      const initialMsgs: Message[] = [
        {
          id: 'welcome',
          role: 'assistant',
          content: curT.welcomeGreeting,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];
      return [{ id: 'session-1', title: `${curT.chatTitlePrefix} 1`, messages: initialMsgs, createdAt: new Date().toISOString() }];
    } catch (e) {
      return [{ id: 'session-1', title: `${curT.chatTitlePrefix} 1`, messages: [], createdAt: new Date().toISOString() }];
    }
  });

  const [activeChatId, setActiveChatId] = useState<string>(() => {
    return localStorage.getItem('multitool_active_chat_id') || (chatSessions[0]?.id || 'session-1');
  });

  useEffect(() => {
    localStorage.setItem('multitool_chat_sessions', JSON.stringify(chatSessions));
  }, [chatSessions]);

  useEffect(() => {
    localStorage.setItem('multitool_active_chat_id', activeChatId);
  }, [activeChatId]);

  const activeSession = chatSessions.find(s => s.id === activeChatId) || chatSessions[0] || { id: 'session-1', title: 'Sohbet 1', messages: [] };
  const messages = activeSession.messages || [];

  const setMessages = (newMessagesOrFn: Message[] | ((prev: Message[]) => Message[])) => {
    setChatSessions(prev => {
      return prev.map(session => {
        if (session.id === activeChatId) {
          const updatedMsgs = typeof newMessagesOrFn === 'function' ? newMessagesOrFn(session.messages || []) : newMessagesOrFn;
          let newTitle = session.title;
          if ((session.title === 'Sohbet 1' || session.title === 'Yeni Sohbet') && updatedMsgs.length > 1) {
            const firstUserMsg = updatedMsgs.find(m => m.role === 'user');
            if (firstUserMsg) {
              newTitle = firstUserMsg.content.slice(0, 20) + (firstUserMsg.content.length > 20 ? '...' : '');
            }
          }
          return { ...session, title: newTitle, messages: updatedMsgs };
        }
        return session;
      });
    });
  };

  const handleCreateNewChat = () => {
    const newId = `session-${Date.now()}`;
    const newTitle = language === 'tr' ? `Sohbet ${chatSessions.length + 1}` : `Chat ${chatSessions.length + 1}`;
    const initialMsgs: Message[] = [
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: t.newChatGreeting || 'Merhaba! Yeni bir sohbet başlattık. Size bugün nasıl yardımcı olabilirim?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
    const newSession: ChatSession = {
      id: newId,
      title: newTitle,
      messages: initialMsgs,
      createdAt: new Date().toISOString()
    };
    setChatSessions(prev => [newSession, ...prev]);
    setActiveChatId(newId);
  };

  const handleDeleteChatSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (chatSessions.length <= 1) {
      handleCreateNewChat();
      return;
    }
    const updated = chatSessions.filter(s => s.id !== id);
    setChatSessions(updated);
    if (activeChatId === id) {
      setActiveChatId(updated[0].id);
    }
  };

  // Notes State
  const [notes, setNotes] = useState<NoteItem[]>(() => {
    try {
      const saved = localStorage.getItem('multitool_notes');
      return saved ? JSON.parse(saved) : [
        {
          id: 'note-1',
          title: t.tipsCardTitle,
          content: t.tipsCardContent,
          category: 'Genel',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    } catch (e) {
      return [];
    }
  });

  const [isChatHistoryModalOpen, setIsChatHistoryModalOpen] = useState<boolean>(false);

  const [newNoteTitle, setNewNoteTitle] = useState<string>('');
  const [newNoteContent, setNewNoteContent] = useState<string>('');
  const [newNoteCategory, setNewNoteCategory] = useState<string>('Genel');
  const [newNoteTagsInput, setNewNoteTagsInput] = useState<string>('');
  const [selectedNoteCategory, setSelectedNoteCategory] = useState<string>('Tümü');
  const [selectedNoteTag, setSelectedNoteTag] = useState<string>('Tümü');
  const [noteSearchQuery, setNoteSearchQuery] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('multitool_notes', JSON.stringify(notes));
  }, [notes]);

  // Routine task states
  const [newTodoIsRoutine, setNewTodoIsRoutine] = useState<boolean>(false);
  const [newTodoFrequency, setNewTodoFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [todoFilterMode, setTodoFilterMode] = useState<'all' | 'normal' | 'routines'>('all');

  const [inputMessage, setInputMessage] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [currentToolExecuting, setCurrentToolExecuting] = useState<string | null>(null);
  const [agentPersona, setAgentPersona] = useState<'coder' | 'organizer' | 'writer' | 'analyst'>('coder');

  const [language, setLanguage] = useState<'en' | 'tr' | 'de' | 'es' | 'fr' | 'it'>(() => (localStorage.getItem('multitool_language') as any) || 'tr');

  useEffect(() => {
    localStorage.setItem('multitool_language', language);
  }, [language]);

  const t = (TRANSLATIONS as any)[language] || TRANSLATIONS.tr;

  const [autoTtsEnabled, setAutoTtsEnabled] = useState<boolean>(() => localStorage.getItem('multitool_auto_tts') === 'true');
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('multitool_auto_tts', String(autoTtsEnabled));
  }, [autoTtsEnabled]);

  useEffect(() => {
    (window as any).onNativeSpeechEnd = () => {
      setSpeakingMessageId(null);
    };
  }, []);

  const speakText = (text: string, messageId?: string) => {
    if (speakingMessageId && messageId && speakingMessageId === messageId) {
      if ((window as any).AndroidNative?.stopSpeech) {
        (window as any).AndroidNative.stopSpeech();
      } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setSpeakingMessageId(null);
      return;
    }

    let cleanText = text
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/#{1,6}\s?/g, '')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/<[^>]*>/g, '')
      .trim();

    if (!cleanText) return;

    const langCode = language === 'tr' ? 'tr-TR' : language === 'de' ? 'de-DE' : language === 'es' ? 'es-ES' : language === 'fr' ? 'fr-FR' : language === 'it' ? 'it-IT' : 'en-US';

    const activeId = messageId || 'active';
    setSpeakingMessageId(activeId);

    // 1. Android Native TTS Engine (Works guaranteed on Samsung Galaxy S26+, S25, S24 & all Androids)
    if ((window as any).AndroidNative?.speakText) {
      (window as any).AndroidNative.speakText(cleanText, langCode);
      return;
    }

    // 2. Web SpeechSynthesis Fallback (For Browsers)
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = langCode;
      utterance.rate = 0.7;
      utterance.pitch = 1.0;

      utterance.onend = () => setSpeakingMessageId(null);
      utterance.onerror = () => setSpeakingMessageId(null);

      window.speechSynthesis.speak(utterance);
    } else {
      alert(t.speechNotSupported || 'Cihazınız ses sentezleme (TTS) desteklemiyor.');
      setSpeakingMessageId(null);
    }
  };

  const [isSetupOpen, setIsSetupOpen] = useState<boolean>(() => localStorage.getItem('multitool_setup_completed') !== 'true');
  const [setupStep, setSetupStep] = useState<number>(1);

  const [isListening, setIsListening] = useState<boolean>(false);

  const sendNotification = (title: string, body: string) => {
    try {
      if ((window as any).AndroidNative?.sendLocalNotification) {
        (window as any).AndroidNative.sendLocalNotification(title, body);
        return;
      }
    } catch (e) { }

    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(title, { body });
      } else {
        Notification.requestPermission().then(p => {
          if (p === 'granted') new Notification(title, { body });
        });
      }
    }
  };

  const [isRecordingAudioTask, setIsRecordingAudioTask] = useState<boolean>(false);
  const [audioRecordTimer, setAudioRecordTimer] = useState<number>(0);
  const audioTaskRecorderRef = useRef<MediaRecorder | null>(null);
  const audioTaskChunksRef = useRef<Blob[]>([]);
  const audioTaskTimerRef = useRef<any>(null);

  const startAudioTaskRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioTaskChunksRef.current = [];

      let mimeType = 'audio/webm';
      if (typeof MediaRecorder !== 'undefined') {
        if (!MediaRecorder.isTypeSupported('audio/webm')) {
          if (MediaRecorder.isTypeSupported('audio/mp4')) mimeType = 'audio/mp4';
          else if (MediaRecorder.isTypeSupported('audio/aac')) mimeType = 'audio/aac';
          else mimeType = '';
        }
      }

      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      audioTaskRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioTaskChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop());

        const audioBlob = new Blob(audioTaskChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          const now = new Date();
          const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const dateStr = now.toLocaleDateString();

          const newTodo: TodoItem = {
            id: Date.now().toString(),
            task: `🎙️ Sesli Not (${dateStr} ${timeStr})`,
            completed: false,
            priority: 'medium',
            audioUrl: base64Audio
          };
          setTodos(prev => [newTodo, ...prev]);
          sendNotification(t.newVoiceTaskNotifTitle || 'Yeni Sesli Not', 'Sesli kayıt göreve eklendi.');
        };
      };

      recorder.start(100);
      setIsRecordingAudioTask(true);
      setAudioRecordTimer(0);

      if (audioTaskTimerRef.current) clearInterval(audioTaskTimerRef.current);
      audioTaskTimerRef.current = setInterval(() => {
        setAudioRecordTimer(prev => prev + 1);
      }, 1000);

    } catch (err: any) {
      alert('Mikrofon erişim izni alınamadı: ' + err.message);
      setIsRecordingAudioTask(false);
    }
  };

  const stopAudioTaskRecording = () => {
    if (audioTaskRecorderRef.current && audioTaskRecorderRef.current.state !== 'inactive') {
      audioTaskRecorderRef.current.stop();
    }
    setIsRecordingAudioTask(false);
    if (audioTaskTimerRef.current) {
      clearInterval(audioTaskTimerRef.current);
      audioTaskTimerRef.current = null;
    }
  };

  const baseInputRef = useRef<string>('');

  const recognitionRef = useRef<any>(null);

  const toggleVoiceRecognition = () => {
    const langCode = language === 'tr' ? 'tr-TR' : language === 'de' ? 'de-DE' : language === 'es' ? 'es-ES' : language === 'fr' ? 'fr-FR' : language === 'it' ? 'it-IT' : 'en-US';

    if ((window as any).AndroidNative?.startSpeechRecognition) {
      (window as any).onNativeSpeechResult = (text: string) => {
        if (text && text.trim()) {
          setInputMessage(prev => prev ? `${prev.trim()} ${text.trim()}` : text.trim());
        }
        setIsListening(false);
      };
      setIsListening(true);
      (window as any).AndroidNative.startSpeechRecognition(langCode);
      return;
    }

    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) { }
      setIsListening(false);
      return;
    }

    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        addLog(t.logSpeechUnsupported);
        alert(t.speechNotSupportedWeb);
        return;
      }
      try {
        const rec = new SpeechRecognition();
        rec.lang = langCode;
        rec.continuous = false;
        rec.interimResults = true;

        baseInputRef.current = inputMessage;

        rec.onstart = () => {
          setIsListening(true);
          addLog(t.logVoiceStarted);
        };

        rec.onresult = (e: any) => {
          let currentTranscript = '';
          for (let i = 0; i < e.results.length; i++) {
            currentTranscript += e.results[i][0].transcript;
          }
          const base = baseInputRef.current;
          const fullText = base ? `${base.trim()} ${currentTranscript.trim()}` : currentTranscript.trim();
          setInputMessage(fullText);
        };

        rec.onerror = (e: any) => {
          addLog(`${t.logVoiceError} ${e.error || e.message}`);
          setIsListening(false);
        };

        rec.onend = () => {
          setIsListening(false);
          addLog('Sesli dinleme bitti.');
        };

        rec.start();
        recognitionRef.current = rec;
      } catch (err: any) {
        addLog(`${t.logVoiceStartFailed} ${err.message}`);
        setIsListening(false);
      }
    }
  };



  const handleExportBackup = () => {
    try {
      const backupData = {
        version: '1.0.0',
        date: new Date().toISOString(),
        calendar: JSON.parse(localStorage.getItem('multitool_calendar') || '[]'),
        todos: JSON.parse(localStorage.getItem('multitool_todos') || '[]'),
        archivedTodos: JSON.parse(localStorage.getItem('multitool_archived_todos') || '[]'),
        chat: messages,
        sandbox: JSON.parse(localStorage.getItem('multitool_sandbox_files') || '[]')
      };
      const jsonStr = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `multitool_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      addLog(t.logBackupDownloaded);
    } catch (err: any) {
      alert(`${t.backupError}: ${err.message}`);
    }
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.calendar) {
          localStorage.setItem('multitool_calendar', JSON.stringify(data.calendar));
          setEvents(data.calendar);
        }
        if (data.todos) {
          localStorage.setItem('multitool_todos', JSON.stringify(data.todos));
          setTodos(data.todos);
        }
        if (data.archivedTodos) {
          localStorage.setItem('multitool_archived_todos', JSON.stringify(data.archivedTodos));
          setArchivedTodos(data.archivedTodos);
        }
        if (data.chat) {
          setMessages(data.chat);
        }
        if (data.sandbox) {
          localStorage.setItem('multitool_sandbox_files', JSON.stringify(data.sandbox));
          fetchSandboxFiles();
        }
        alert(t.importSuccess);
        addLog(t.logBackupImported);
      } catch (err: any) {
        alert(`${t.importError}: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  const PERSONAS = {
    coder: {
      name: t.personaCoder || '🛠️ Self-Coder',
      desc: t.personaCoderDesc || 'Focus on coding, running servers, and APK compilation.',
      promptExtra: language === 'tr' ? 'Sen bir Self-Coding uzmanısın. Kullanıcının isteklerini kod üreterek, localhost sunucuları açarak veya APK derleyerek çözmeye odaklan.' : 'You are a Self-Coding expert. Focus on solving user requests by writing code, spawning localhost servers, or building APKs.'
    },
    organizer: {
      name: t.personaOrganizer || '📅 Organizer',
      desc: t.personaOrganizerDesc || 'Focus on calendar, agenda, and todo management.',
      promptExtra: language === 'tr' ? 'Sen hassas bir kişisel ajanda organizatörüsün. Kullanıcının takvimini, yapılacak işlerini ve günlük programını en verimli şekilde düzenlemeye odaklan.' : 'You are a meticulous personal organizer. Focus on optimizing user calendar, todos, and daily routines.'
    },
    writer: {
      name: t.personaWriter || '✍️ Writer',
      desc: t.personaWriterDesc || 'Focus on summarization, emails, texts, and translation.',
      promptExtra: language === 'tr' ? 'Sen profesyonel bir metin yazarı ve çevirmensin. Dil kullanımı, açıklık ve içerik düzenleme üzerine odaklan.' : 'You are a professional writer and translator. Focus on clarity, tone, and content structure.'
    },
    analyst: {
      name: t.personaAnalyst || '🧠 Analyst',
      desc: t.personaAnalystDesc || 'Deep logic focus for step-by-step problem analysis.',
      promptExtra: language === 'tr' ? 'Sen analitik ve mantıksal bir düşünürsün. Sorunları adımlara bölerek, neden-sonuç ilişkisi kurarak çöz.' : 'You are an analytical logic thinker. Break down problems step by step with clear reasoning.'
    }
  };

  const getLocalTodayDate = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [viewDate, setViewDate] = useState<Date>(new Date());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>(getLocalTodayDate());
  const [newEventTitle, setNewEventTitle] = useState<string>('');
  const [newEventTime, setNewEventTime] = useState<string>('');
  const [newEventEndTime, setNewEventEndTime] = useState<string>('');
  const [newEventDesc, setNewEventDesc] = useState<string>('');
  const [newEventReminder, setNewEventReminder] = useState<number>(0);
  const [calendarViewMode, setCalendarViewMode] = useState<'timeline' | 'weekly' | 'list'>('timeline');
  const [eventModalOpen, setEventModalOpen] = useState<boolean>(false);
  const [newEventEndDate, setNewEventEndDate] = useState<string>('');
  const [newEventDuration, setNewEventDuration] = useState<string>('');
  const [newEventAttachments, setNewEventAttachments] = useState<EventAttachment[]>([]);

  const getWeekDays = (selectedDateStr: string) => {
    const parts = selectedDateStr.split('-').map(Number);
    const currDate = parts.length === 3 ? new Date(parts[0], parts[1] - 1, parts[2]) : new Date();
    const dayOfWeek = currDate.getDay();
    const diffToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(currDate);
    monday.setDate(currDate.getDate() + diffToMon);

    const week = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      const yrStr = day.getFullYear();
      const moStr = String(day.getMonth() + 1).padStart(2, '0');
      const dyStr = String(day.getDate()).padStart(2, '0');
      const dateIso = `${yrStr}-${moStr}-${dyStr}`;
      const locale = language === 'tr' ? 'tr-TR' : language === 'de' ? 'de-DE' : language === 'fr' ? 'fr-FR' : language === 'es' ? 'es-ES' : language === 'it' ? 'it-IT' : 'en-US';
      const dayName = day.toLocaleDateString(locale, { weekday: 'short' });
      const fullDateStr = day.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
      week.push({ dateIso, dayName, dayNumber: dyStr, fullDateStr });
    }
    return week;
  };

  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [archivedTodos, setArchivedTodos] = useState<TodoItem[]>(() => {
    return JSON.parse(localStorage.getItem('multitool_archived_todos') || '[]');
  });
  const [newTodoTask, setNewTodoTask] = useState<string>('');
  const [newTodoPriority, setNewTodoPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTodoDueDate, setNewTodoDueDate] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('multitool_archived_todos', JSON.stringify(archivedTodos));
  }, [archivedTodos]);

  useEffect(() => {
    const calendarMonitor = setInterval(() => {
      if (!events || events.length === 0) return;

      const now = new Date();
      const nowMs = now.getTime();
      let eventsUpdated = false;

      const updatedEvents = events.map(evt => {
        if (!evt.date || !evt.time) return evt;

        try {
          const [yr, mo, dy] = evt.date.split('-').map(Number);
          const [hr, mn] = evt.time.split(':').map(Number);
          const eventDateTime = new Date(yr, mo - 1, dy, hr, mn, 0);
          const eventMs = eventDateTime.getTime();
          if (isNaN(eventMs)) return evt;

          let newEvt = { ...evt };

          if (typeof evt.reminderMinutes === 'number' && evt.reminderMinutes > 0 && !evt.notifiedReminder) {
            const reminderMs = eventMs - (evt.reminderMinutes * 60 * 1000);
            if (nowMs >= reminderMs && nowMs < eventMs) {
              sendNotification(
                t.notifUpcomingEvent,
                `"${evt.title}": ${evt.reminderMinutes} ${t.notifMinutesLeft}! (${evt.time})`
              );
              newEvt.notifiedReminder = true;
              eventsUpdated = true;
            }
          }

          if (!evt.notifiedExact && nowMs >= eventMs && nowMs <= eventMs + (3 * 60 * 1000)) {
            sendNotification(
              t.notifEventTime,
              `"${evt.title}" ${t.notifStartingNow}! (${evt.time})`
            );
            newEvt.notifiedExact = true;
            eventsUpdated = true;
          }

          return newEvt;
        } catch (e) {
          return evt;
        }
      });

      if (eventsUpdated) {
        setEvents(updatedEvents);
        localStorage.setItem('multitool_calendar', JSON.stringify(updatedEvents));
      }
    }, 15000);

    return () => clearInterval(calendarMonitor);
  }, [events]);

  useEffect(() => {
    const hourlyInterval = setInterval(() => {
      const currentName = localStorage.getItem('multitool_user_name') || userName || (language === 'tr' ? 'Dostum' : 'Friend');
      const completedCount = todos.filter(t => t.completed).length + archivedTodos.length;
      const totalCount = todos.length + archivedTodos.length;
      const completedHabits = habits.filter(h => h.completedToday).length;
      const totalHabits = habits.length;

      const title = language === 'tr' ? 'Multitool AI Durum Özeti 📊' :
        language === 'de' ? 'Multitool AI Statusübersicht 📊' :
          language === 'es' ? 'Resumen de Estado Multitool AI 📊' :
            language === 'fr' ? 'Résumé du Statut Multitool AI 📊' :
              language === 'it' ? 'Riepilogo Stato Multitool AI 📊' :
                'Multitool AI Status Summary 📊';

      const body = language === 'tr' ? `${currentName}, saatlik durum özeti: Görevler: ${completedCount}/${totalCount}, Rutinler: ${completedHabits}/${totalHabits}` :
        `${currentName}, hourly status summary: Tasks: ${completedCount}/${totalCount}, Routines: ${completedHabits}/${totalHabits}`;

      sendNotification(title, body);
    }, 60 * 60 * 1000);

    return () => clearInterval(hourlyInterval);
  }, [userName, todos, archivedTodos, habits]);

  useEffect(() => {
    const NOW = Date.now();
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

    let todosChanged = false;
    let archivedChanged = false;

    const remainingTodos: TodoItem[] = [];
    const newlyArchived: TodoItem[] = [];

    todos.forEach(t => {
      if (t.completed) {
        const completedTime = t.completedAt || NOW;
        if ((NOW - completedTime) >= TWENTY_FOUR_HOURS) {
          newlyArchived.push(t);
          archivedChanged = true;
          todosChanged = true;
        } else {
          remainingTodos.push({ ...t, completedAt: completedTime });
        }
      } else {
        remainingTodos.push(t);
      }
    });

    if (todosChanged || archivedChanged) {
      if (newlyArchived.length > 0) {
        setArchivedTodos(prev => [...prev, ...newlyArchived]);
        addLog(t.logAutoArchived.replace('{count}', String(newlyArchived.length)));
      }
      setTodos(remainingTodos);
    }
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('multitool_todos', JSON.stringify(todos));
    try {
      if ((window as any).AndroidWidget?.updateTodos) {
        (window as any).AndroidWidget.updateTodos(JSON.stringify(todos));
      }
    } catch (e) { }
  }, [todos]);

  const [sandboxFiles, setSandboxFiles] = useState<SandboxFile[]>([]);
  const [currentFileName, setCurrentFileName] = useState<string>('server.js');
  const [editorContent, setEditorContent] = useState<string>(
    `const express = require('express');\nconst app = express();\nconst PORT = 3005;\n\napp.get('/api/test', (req, res) => {\n  res.json({ message: "Express Server Ready!", time: new Date() });\n});\n\napp.listen(PORT, () => {\n  console.log(\`Server running at http://localhost:\${PORT}\`);\n});`
  );
  const [editorLanguage, setEditorLanguage] = useState<'javascript' | 'python'>('javascript');
  const [terminalOutput, setTerminalOutput] = useState<string>(t.termReady);
  const [isRunningCode, setIsRunningCode] = useState<boolean>(false);
  const [isBuildingApk, setIsBuildingApk] = useState<boolean>(false);
  const [sandboxTab, setSandboxTab] = useState<'files' | 'editor' | 'preview'>('editor');

  const chatEndRef = useRef<HTMLDivElement>(null);
  const [systemLogs, setSystemLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setSystemLogs(prev => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev.slice(0, 49)]);
  };

  const renderMessageContent = (content: string) => {
    if (content.includes('<think>')) {
      const parts = content.split('<think>');
      const beforeThink = parts[0];
      const afterThink = parts[1] || '';
      let thinkingText = '';
      let actualContent = '';
      if (afterThink.includes('</think>')) {
        const subParts = afterThink.split('</think>');
        thinkingText = subParts[0].trim();
        actualContent = (beforeThink + '\n' + subParts.slice(1).join('</think>')).trim();
      } else {
        thinkingText = afterThink.trim();
        actualContent = beforeThink.trim();
      }
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <details style={{ background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: 'var(--radius-xs)', padding: '8px 12px', fontSize: '11.5px' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '6px', outline: 'none', userSelect: 'none' }}>
              {t.thinkingProcess}
            </summary>
            <div style={{ marginTop: '8px', color: '#cbd5e1', fontStyle: 'normal', fontFamily: 'var(--font-mono)', whiteSpace: 'pre-wrap', borderLeft: '2px solid var(--primary)', paddingLeft: '10px', overflowX: 'auto', maxHeight: '180px', fontSize: '11px' }}>
              {thinkingText}
            </div>
          </details>
          {actualContent && <div style={{ whiteSpace: 'pre-wrap' }}>{actualContent}</div>}
        </div>
      );
    }
    return <div style={{ whiteSpace: 'pre-wrap' }}>{content}</div>;
  };

  useEffect(() => {
    fetchModels();
    fetchCalendarEvents();
    fetchTodos();
    fetchSandboxFiles();
    fetchChatHistory();
  }, []);

  useEffect(() => {
    if (!hasLoadedHistory) return;
    localStorage.setItem('multitool_chats', JSON.stringify(messages));
  }, [messages, hasLoadedHistory]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  useEffect(() => {
    if (currentFileName.endsWith('.py')) {
      setEditorLanguage('python');
    } else {
      setEditorLanguage('javascript');
    }
  }, [currentFileName]);

  const fetchChatHistory = async () => {
    try {
      const localChats = localStorage.getItem('multitool_chats');
      if (localChats) {
        setMessages(JSON.parse(localChats));
      } else {
        setMessages([]);
      }
    } catch (err: any) {
      addLog(`${t.logChatHistoryLoadError} ${err.message}`);
    } finally {
      setHasLoadedHistory(true);
    }
  };

  const handleClearHistory = async () => {
    if (!confirm(t.confirmClearChatHistory)) return;
    setMessages([]);
    localStorage.setItem('multitool_chats', JSON.stringify([]));
    addLog('Chat history cleared');
  };
  const fetchModels = async () => {
    setIsLoadingModels(true);
    const builtin = () => BUILTIN_MODELS[provider] || [];
    const noKey = (label: string) => {
      addLog(t.logNoApiKey.replace('{label}', label));
      setModels(builtin());
      setIsConnected(false);
    };
    try {
      if (provider === 'groq') {
        if (!groqApiKey.trim()) { noKey('Groq'); return; }
        addLog(t.logScanningProvider.replace('{provider}', 'Groq API'));
        const response = await fetch('https://api.groq.com/openai/v1/models', {
          headers: { 'Authorization': `Bearer ${groqApiKey}`, 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error(t.errProviderResp.replace('{provider}', 'Groq'));
        const data = await response.json();
        const groqModels = (data.data || [])
          .filter((m: any) => !['whisper', 'guard', 'vision', 'audio'].some(k => m.id.includes(k)))
          .map((m: any) => ({ name: m.id, model: m.id }));
        if (!groqModels.length) throw new Error(t.errProviderNoModel.replace('{provider}', 'Groq'));
        setModels(groqModels);
        if (groqModel && !groqModels.some((m: any) => m.name === groqModel)) setGroqModel('');
        setIsConnected(true);
        addLog(`${groqModels.length} Groq modeli bulundu`);
        return;
      }

      if (provider === 'deepseek') {
        if (!deepseekApiKey.trim()) { noKey('DeepSeek'); return; }
        addLog(t.logScanningProvider.replace('{provider}', 'DeepSeek API'));
        const response = await fetch('https://api.deepseek.com/models', {
          headers: { 'Authorization': `Bearer ${deepseekApiKey}`, 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error(t.errProviderResp.replace('{provider}', 'DeepSeek'));
        const data = await response.json();
        const dsModels = (data.data || []).map((m: any) => ({ name: m.id, model: m.id }));
        if (!dsModels.length) throw new Error(t.errProviderNoModel.replace('{provider}', 'DeepSeek'));
        setModels(dsModels);
        if (deepseekModel && !dsModels.some((m: any) => m.name === deepseekModel)) setDeepseekModel('');
        setIsConnected(true);
        addLog(`${dsModels.length} DeepSeek modeli bulundu`);
        return;
      }

      if (provider === 'openai') {
        if (!openaiApiKey.trim()) { noKey('OpenAI'); return; }
        addLog(t.logScanningProvider.replace('{provider}', 'OpenAI API'));
        const response = await fetch('https://api.openai.com/v1/models', {
          headers: { 'Authorization': `Bearer ${openaiApiKey}`, 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error(t.errProviderResp.replace('{provider}', 'OpenAI'));
        const data = await response.json();
        const oaiModels = (data.data || [])
          .filter((m: any) => /^(gpt-|o[0-9]|chatgpt)/.test(m.id))
          .filter((m: any) => !['dall-e', 'tts', 'whisper', 'embedding', 'moderation', 'transcribe'].some(k => m.id.includes(k)))
          .map((m: any) => ({ name: m.id, model: m.id }));
        if (!oaiModels.length) throw new Error(t.errProviderNoModel.replace('{provider}', 'OpenAI'));
        setModels(oaiModels);
        if (openaiModel && !oaiModels.some((m: any) => m.name === openaiModel)) setOpenaiModel('');
        setIsConnected(true);
        addLog(`${oaiModels.length} OpenAI modeli bulundu`);
        return;
      }

      if (provider === 'gemini') {
        if (!geminiApiKey.trim()) { noKey('Gemini'); return; }
        addLog(t.logScanningProvider.replace('{provider}', 'Google Gemini API'));
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${geminiApiKey}`);
        if (!response.ok) throw new Error(t.errProviderResp.replace('{provider}', 'Gemini'));
        const data = await response.json();
        const gemModels = (data.models || [])
          .filter((m: any) => Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.includes('generateContent'))
          .map((m: any) => ({ name: (m.name || '').replace(/^models\//, ''), model: (m.name || '').replace(/^models\//, '') }));
        if (!gemModels.length) throw new Error(t.errProviderNoModel.replace('{provider}', 'Gemini'));
        setModels(gemModels);
        if (geminiModel && !gemModels.some((m: any) => m.name === geminiModel)) setGeminiModel('');
        setIsConnected(true);
        addLog(`${gemModels.length} Gemini modeli bulundu`);
        return;
      }

      if (provider === 'openrouter') {
        addLog(t.logScanningProvider.replace('{provider}', 'OpenRouter API'));
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (openrouterApiKey.trim()) headers['Authorization'] = `Bearer ${openrouterApiKey}`;
        const response = await fetch('https://openrouter.ai/api/v1/models', { headers });
        if (!response.ok) throw new Error(t.errProviderResp.replace('{provider}', 'OpenRouter'));
        const data = await response.json();
        const orModels = (data.data || []).map((m: any) => ({ name: m.id, model: m.id }));
        if (!orModels.length) throw new Error(t.errProviderNoModel.replace('{provider}', 'OpenRouter'));
        setModels(orModels);
        if (openrouterModel && !orModels.some((m: any) => m.name === openrouterModel)) setOpenrouterModel('');
        setIsConnected(true);
        addLog(`${orModels.length} OpenRouter modeli bulundu`);
        return;
      }

      // Ollama: key gerekmez, yerel sunucudan taranır
      addLog(t.logScanningProvider.replace('{provider}', 'Ollama'));
      const response = await fetch(`${ollamaUrl}/api/tags`);
      if (!response.ok) throw new Error(t.errProviderResp.replace('{provider}', 'Ollama'));
      const data = await response.json();
      if (data.models && data.models.length > 0) {
        setModels(data.models);
        if (selectedModel && !data.models.some((m: any) => m.name === selectedModel)) setSelectedModel('');
        setIsConnected(true);
        addLog(`${data.models.length} Ollama modeli bulundu`);
      } else {
        setModels([]);
        setIsConnected(false);
        addLog(t.logOllamaNoModel);
      }
    } catch (err: any) {
      addLog(`${t.logScanError.replace('{provider}', provider)} ${err.message}`);
      setModels(builtin());
      setIsConnected(false);
    } finally {
      setIsLoadingModels(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, [provider]);

  const fetchCalendarEvents = async () => {
    try {
      const localEvents = localStorage.getItem('multitool_calendar');
      if (localEvents) {
        setEvents(JSON.parse(localEvents));
      } else {
        setEvents([]);
      }
    } catch (err: any) {
      addLog(`${t.logCalendarFetchError} ${err.message}`);
    }
  };

  const fetchTodos = async () => {
    try {
      const localTodos = localStorage.getItem('multitool_todos');
      if (localTodos) {
        setTodos(JSON.parse(localTodos));
      } else {
        setTodos([]);
      }
    } catch (err: any) {
      addLog(`${t.logTodosFetchError} ${err.message}`);
    }
  };

  const fetchSandboxFiles = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/sandbox/files');
      if (res.ok) {
        const files = await res.json();
        setSandboxFiles(files);
        return;
      }
    } catch (e) { }

    try {
      const localFiles = localStorage.getItem('multitool_files');
      if (localFiles) {
        const parsed = JSON.parse(localFiles);
        setSandboxFiles(parsed.map((f: any) => ({
          name: f.name,
          size: f.content.length,
          isDir: false,
          updatedAt: f.updatedAt || new Date().toISOString()
        })));
      } else {
        setSandboxFiles([]);
      }
    } catch (err: any) {
      addLog(`${t.logSandboxFetchError} ${err.message}`);
    }
  };

  const parseEventDateTime = (dateStr: string, timeStr: string): Date => {
    const d = dateStr || getLocalTodayDate();
    const [hh, mm] = (timeStr || '00:00').split(':').map(Number);
    const [y, m, day] = d.split('-').map(Number);
    return new Date(y, (m || 1) - 1, day || 1, hh || 0, mm || 0, 0, 0);
  };
  const fmtTime = (d: Date) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  const fmtDate = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  // Bitiş değişince duration'ı (saat) otomatik hesapla
  const recomputeDuration = (start: Date, end: Date) => {
    const diff = (end.getTime() - start.getTime()) / 3600000;
    setNewEventDuration(diff > 0 ? String(Math.round(diff * 100) / 100) : '');
  };
  // Duration değişince bitişi otomatik ayarla
  const recomputeEnd = (durStr: string) => {
    const dur = parseFloat(durStr);
    setNewEventDuration(durStr);
    if (isNaN(dur) || dur <= 0) return;
    const start = parseEventDateTime(selectedCalendarDate, newEventTime);
    const end = new Date(start.getTime() + dur * 3600000);
    setNewEventEndTime(fmtTime(end));
    setNewEventEndDate(fmtDate(end));
  };

  const openEventModal = () => {
    setNewEventEndDate(selectedCalendarDate || getLocalTodayDate());
    setNewEventDuration('');
    setNewEventAttachments([]);
    setEventModalOpen(true);
  };
  const closeEventModal = () => setEventModalOpen(false);

  const handleEventFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const list = Array.from(files);
    list.forEach(file => {
      if (file.size > 2 * 1024 * 1024) {
        addLog(t.logFileTooBig.replace('{name}', file.name));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setNewEventAttachments(prev => [...prev, { name: file.name, type: file.type, dataUrl: String(reader.result) }]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleAddEvent = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newEventTitle.trim()) return;

    try {
      const localEvents = localStorage.getItem('multitool_calendar');
      const currentEvents = localEvents ? JSON.parse(localEvents) : [];
      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        title: newEventTitle,
        date: selectedCalendarDate,
        endDate: newEventEndDate || selectedCalendarDate,
        time: newEventTime,
        endTime: newEventEndTime,
        description: newEventDesc,
        reminderMinutes: newEventReminder,
        attachments: newEventAttachments,
        notifiedExact: false,
        notifiedReminder: false
      };
      const updated = [...currentEvents, newEvent];
      localStorage.setItem('multitool_calendar', JSON.stringify(updated));
      setNewEventTitle('');
      setNewEventTime('');
      setNewEventEndTime('');
      setNewEventDesc('');
      setNewEventReminder(0);
      setNewEventEndDate('');
      setNewEventDuration('');
      setNewEventAttachments([]);
      setEvents(updated);
      setEventModalOpen(false);
      sendNotification('Yeni Etkinlik Kaydedildi 📅', `"${newEventTitle}" • ${selectedCalendarDate} ${newEventTime}`);
      addLog(`Manuel etkinlik eklendi: "${newEventTitle}"`);
    } catch (err: any) {
      addLog(`Etkinlik eklenirken hata: ${err.message}`);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      const localEvents = localStorage.getItem('multitool_calendar');
      if (localEvents) {
        const currentEvents = JSON.parse(localEvents);
        const updated = currentEvents.filter((e: any) => e.id !== id);
        localStorage.setItem('multitool_calendar', JSON.stringify(updated));
        setEvents(updated);
        addLog('Event deleted successfully');
      }
    } catch (err: any) {
      addLog(`Etkinlik silinirken hata: ${err.message}`);
    }
  };

  const handleAddTodo = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newTodoTask.trim()) return;

    try {
      const localTodos = localStorage.getItem('multitool_todos');
      const currentTodos = localTodos ? JSON.parse(localTodos) : [];
      const newTodo: TodoItem = {
        id: Date.now().toString(),
        task: newTodoTask,
        priority: newTodoPriority,
        dueDate: newTodoDueDate,
        completed: false,
        isRoutine: newTodoIsRoutine,
        routineFrequency: newTodoIsRoutine ? newTodoFrequency : undefined
      };
      const updated = [...currentTodos, newTodo];
      localStorage.setItem('multitool_todos', JSON.stringify(updated));
      setNewTodoTask('');
      setNewTodoDueDate('');
      setNewTodoIsRoutine(false);
      setTodos(updated);
      sendNotification(newTodoIsRoutine ? t.notifNewRoutine : t.notifNewTask, `"${newTodoTask}"`);
      addLog(`Manual to-do added: "${newTodoTask}"`);
    } catch (err: any) {
      addLog(`${t.logTodoAddError} ${err.message}`);
    }
  };

  const handleToggleTodo = async (id: string, completed: boolean) => {
    try {
      const localTodos = localStorage.getItem('multitool_todos');
      if (localTodos) {
        const currentTodos = JSON.parse(localTodos);
        const updated = currentTodos.map((t: any) =>
          t.id === id
            ? { ...t, completed: !completed, completedAt: !completed ? Date.now() : undefined }
            : t
        );
        localStorage.setItem('multitool_todos', JSON.stringify(updated));
        setTodos(updated);
      }
    } catch (err: any) {
      addLog(`${t.logTodoUpdateError} ${err.message}`);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      const localTodos = localStorage.getItem('multitool_todos');
      if (localTodos) {
        const currentTodos = JSON.parse(localTodos);
        const updated = currentTodos.filter((t: any) => t.id !== id);
        localStorage.setItem('multitool_todos', JSON.stringify(updated));
        setTodos(updated);
        addLog('To-do deleted successfully');
      }
    } catch (err: any) {
      addLog(`${t.logTodoDeleteError} ${err.message}`);
    }
  };

  const handleSaveFile = async () => {
    if (!currentFileName.trim()) return;
    try {
      const res = await fetch('http://localhost:3001/api/sandbox/file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: currentFileName, content: editorContent })
      });
      if (res.ok) {
        fetchSandboxFiles();
        addLog(`File saved: ${currentFileName}`);
        alert(`'${currentFileName}' ${t.fileSaved}`);
        return;
      }
    } catch (e) { }

    try {
      const localFiles = localStorage.getItem('multitool_files');
      let files = localFiles ? JSON.parse(localFiles) : [];
      const index = files.findIndex((f: any) => f.name === currentFileName);
      const newFile = {
        name: currentFileName,
        content: editorContent,
        updatedAt: new Date().toISOString()
      };
      if (index > -1) {
        files[index] = newFile;
      } else {
        files.push(newFile);
      }
      localStorage.setItem('multitool_files', JSON.stringify(files));
      fetchSandboxFiles();
      addLog(`File saved: ${currentFileName}`);
      alert(`'${currentFileName}' ${t.fileSaved}`);
    } catch (err: any) {
      addLog(`Dosya kaydedilirken hata: ${err.message}`);
    }
  };

  const handleReadFile = async (filename: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/sandbox/file?filename=${encodeURIComponent(filename)}`);
      if (res.ok) {
        const data = await res.json();
        setCurrentFileName(data.filename);
        setEditorContent(data.content);
        setSandboxTab('editor');
        addLog(`File loaded into editor: ${filename}`);
        return;
      }
    } catch (e) { }

    try {
      const localFiles = localStorage.getItem('multitool_files');
      if (localFiles) {
        const files = JSON.parse(localFiles);
        const file = files.find((f: any) => f.name === filename);
        if (file) {
          setCurrentFileName(file.name);
          setEditorContent(file.content);
          setSandboxTab('editor');
          addLog(`File loaded into editor: ${filename}`);
        }
      }
    } catch (err: any) {
      addLog(`Dosya okunurken hata: ${err.message}`);
    }
  };

  const handleDeleteFile = async (filename: string) => {
    if (!confirm(`'${filename}': ${t.deleteFileConfirm}`)) return;
    try {
      await fetch(`http://localhost:3001/api/sandbox/file?filename=${encodeURIComponent(filename)}`, { method: 'DELETE' });
    } catch (e) { }

    try {
      const localFiles = localStorage.getItem('multitool_files');
      if (localFiles) {
        const files = JSON.parse(localFiles);
        const updated = files.filter((f: any) => f.name !== filename);
        localStorage.setItem('multitool_files', JSON.stringify(updated));
        fetchSandboxFiles();
        if (currentFileName === filename) {
          setCurrentFileName('server.js');
          setEditorContent(t.newFileContent);
        }
        addLog(`File deleted: ${filename}`);
      }
    } catch (err: any) {
      addLog(`Dosya silinirken hata: ${err.message}`);
    }
  };

  const handleExecuteCode = async () => {
    setIsRunningCode(true);
    setTerminalOutput(`[${new Date().toLocaleTimeString()}] ${t.termRunning.replace('{file}', currentFileName)}...\n`);
    addLog(`Executing JS code from ${currentFileName}...`);
    try {
      const res = await fetch('http://localhost:3001/api/sandbox/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: editorLanguage, code: editorContent, filename: currentFileName })
      });
      if (res.ok) {
        const data = await res.json();
        let output = '';
        if (data.stdout) output += data.stdout;
        if (data.stderr) output += `\n[Hata / Stderr]: ${data.stderr}`;
        if (!output) output = t.termCodeSuccess.replace('{code}', String(data.exitCode)) + '\n';
        setTerminalOutput(prev => prev + output);
        addLog(`Execution completed for ${currentFileName}`);
        setIsRunningCode(false);
        return;
      }
    } catch (e) { }

    setTimeout(() => {
      try {
        let logs: string[] = [];
        const originalLog = console.log;
        const originalError = console.error;
        console.log = (...args) => {
          logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
          originalLog.apply(console, args);
        };
        console.error = (...args) => {
          logs.push('[Hata]: ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
          originalError.apply(console, args);
        };

        try {
          const result = (0, eval)(editorContent);
          let output = '';
          if (logs.length > 0) output += `${logs.join('\n')}\n`;
          if (result !== undefined) {
            output += `[${t.termOutput}] ${typeof result === 'object' ? JSON.stringify(result) : String(result)}\n`;
          }
          if (output === '') output = t.termProgramDone + '\n';
          setTerminalOutput(prev => prev + output);
          addLog(`Execution completed for ${currentFileName}`);
        } catch (evalErr: any) {
          setTerminalOutput(prev => prev + `${logs.join('\n')}\n[${t.termRuntimeError}] ${evalErr.message}\n`);
          addLog(`Code execution failed: ${evalErr.message}`);
        } finally {
          console.log = originalLog;
          console.error = originalError;
        }
      } finally {
        setIsRunningCode(false);
      }
    }, 100);
  };

  const handleBuildApk = async () => {
    setIsBuildingApk(true);
    setTerminalOutput(prev => prev + `[${new Date().toLocaleTimeString()}] ${t.termApkBuildStarted}\n`);
    addLog('Manual APK build triggered...');

    try {
      const res = await fetch('http://localhost:3001/api/build-apk', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setTerminalOutput(prev => prev + `[${t.termSuccess}]: ${data.message}\n🚀 ${t.termDownloadLink}: http://localhost:3001${data.downloadUrl}\n`);
        addLog('APK build finished successfully!');
        window.open('http://localhost:3001/download/multitool.apk', '_blank');
      } else {
        setTerminalOutput(prev => prev + `[${t.termError}]: ${data.error || t.termApkBuildFailed}\n${data.stderr || ''}\n`);
        addLog(`APK build error: ${data.error}`);
      }
    } catch (err: any) {
      setTerminalOutput(prev => prev + `[${t.termConnError}] ${t.termLocalhostUnreachable} ${err.message}\n`);
    } finally {
      setIsBuildingApk(false);
    }
  };

  const handleStartLocalhostServer = async () => {
    setTerminalOutput(prev => prev + `[${new Date().toLocaleTimeString()}] ${t.termServerStarting}\n`);
    addLog('Starting localhost express server...');

    try {
      const res = await fetch('http://localhost:3001/api/localhost/server', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          port: 3005,
          code: editorContent,
          filename: currentFileName
        })
      });
      const data = await res.json();
      if (data.success) {
        setTerminalOutput(prev => prev + `[${t.termServerActive}]: ${data.message}\n🔗 ${t.termEndpoint}: http://localhost:3005/api/test\n[${t.termLogs}]: ${data.logs}\n`);
        addLog('Localhost server running on port 3005');
      } else {
        setTerminalOutput(prev => prev + `[HATA]: ${data.message || data.error}\n`);
      }
    } catch (err: any) {
      setTerminalOutput(prev => prev + `[${t.termConnError}] ${t.termServerStartFailed} ${err.message}\n`);
    }
  };

  const aiLangName = language === 'tr' ? 'Türkçe' : language === 'en' ? 'English' : language === 'de' ? 'Deutsch' : language === 'es' ? 'Español' : language === 'fr' ? 'Français' : 'Italiano';
  const aiLocale = language === 'tr' ? 'tr-TR' : language === 'de' ? 'de-DE' : language === 'es' ? 'es-ES' : language === 'fr' ? 'fr-FR' : language === 'it' ? 'it-IT' : 'en-US';

  const SYSTEM_PROMPT = `Sen Multitool Asistanısın, kullanıcının isteklerini yerine getirmek için özel araçlara (tools) erişimi olan gelişmiş ve self-coding yeteneğine sahip bir AI'sın.
Kullanıcının takvimiyle, yapılacaklar listesiyle, dosya sistemiyle, yerel kod çalıştırmayla VE uygulamanın kendi kaynak kodunu güncelleme / yeni APK derleme istekleriyle ilgili her şeyi yapabilirsin.

Kullanabileceğin Araçlar:
1. "add_calendar_event": Takvime bir etkinlik ekler. Parametreler: {"title": "string", "date": "YYYY-MM-DD", "time": "HH:MM" (başlangıç saati, opsiyonel), "endTime": "HH:MM" (bitiş saati, opsiyonel), "description": "string" (opsiyonel), "reminderMinutes": number (opsiyonel, örn: 30 dk önce uyarılmak istenirse 30, 15 dk önce 15, zamanında uyarılmak için 0)}
2. "get_calendar_events": Tüm takvim etkinliklerini listeler. Parametreler: {}
3. "add_todo_item": Yapılacaklar listesine iş ekler. Parametreler: {"task": "string", "priority": "low"|"medium"|"high" (opsiyonel), "dueDate": "YYYY-MM-DD" (opsiyonel)}
4. "get_todo_items": Yapılacaklar listesindeki tüm işleri listeler. Parametreler: {}
5. "complete_todo_item": Bir yapılacak işini tamamlandı olarak işaretler. Parametreler: {"id": "string"}
6. "write_file": Sandbox klasöründe bir dosya oluşturur/yazar. Parametreler: {"filename": "string", "content": "string"}
7. "read_file": Sandbox klasöründen bir dosyayı okur. Parametreler: {"filename": "string"}
8. "list_files": Sandbox klasöründeki dosyaları listeler. Parametreler: {}
9. "execute_code": Sandbox'ta javascript kodu çalıştırır ve çıktısını alır. Parametreler: {"language": "javascript", "code": "string", "filename": "string" (opsiyonel)}
10. "delete_file": Sandbox'tan bir dosyayı siler. Parametreler: {"filename": "string"}
11. "delete_calendar_event": Bir takvim veya günlük program etkinliğini siler. Parametreler: {"id": "string"}
12. "build_new_apk": Multitool uygulamasını otomatik derler, güncel APK oluşturur ve indirme bağlantısı üretir. Parametreler: {}
13. "modify_app_source": Uygulamanın kendi kaynak kodunu (örneğin "src/App.tsx" veya "src/index.css") günceller. Parametreler: {"filepath": "string", "content": "string"}
14. "run_localhost_server": Localhost üzerinde belirtilen portta çalışan canlı bir Node.js / Express sunucusu başlatır. Parametreler: {"port": number, "code": "string", "filename": "string" (opsiyonel)}
15. "add_note": Notlarıma yeni bir not ekler. Parametreler: {"title": "string", "content": "string", "category": "string" (opsiyonel, örn: Genel, Fikir, İş, Kişisel)}
16. "get_notes": Kullanıcının tüm notlarını listeler veya getirir. Parametreler: {}
17. "delete_note": Notlarımdan belirtilen ID'li notu siler. Parametreler: {"id": "string"}

ÖNEMLİ KURAL:
Bir aracı çağıracağın zaman cevabında sadece ve sadece aşağıdaki gibi tek bir JSON kod bloğu yaz:
\`\`\`json
{
  "tool": "araç_adı",
  "parameters": { ... }
}
\`\`\`
Lütfen kullanıcıya ${aiLangName} dilinde yanıt ver.`;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isThinking) return;

    const userText = inputMessage;
    setInputMessage('');
    setIsThinking(true);

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);

    // Auto-name chat session if title is default
    const activeSession = chatSessions.find(s => s.id === activeChatId);
    if (activeSession && (activeSession.title === 'Yeni Sohbet' || activeSession.title.startsWith('Yeni Sohbet'))) {
      const cleanTitle = userText.trim().replace(/^[\W_]+/, '');
      const shortTitle = cleanTitle.length > 22 ? cleanTitle.substring(0, 22) + '...' : cleanTitle;
      if (shortTitle) {
        setChatSessions(prev => prev.map(s => s.id === activeChatId ? { ...s, title: shortTitle } : s));
      }
    }

    const activeModel =
      provider === 'groq' ? groqModel :
        provider === 'deepseek' ? deepseekModel :
          provider === 'openai' ? openaiModel :
            provider === 'gemini' ? geminiModel :
              provider === 'openrouter' ? openrouterModel :
                selectedModel;
    if (!activeModel) {
      setTimeout(() => {
        const errorMsg: Message = {
          id: `error-${Date.now()}`,
          role: 'system',
          content: `⚠️ ${t.noModelError}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, errorMsg]);
        setIsThinking(false);
      }, 400);
      return;
    }

    runAgentLoop(updatedMessages);
  };

  const runAgentLoop = async (currentHistory: Message[]) => {
    let loopCount = 0;
    const maxLoops = 6;
    let activeHistory = [...currentHistory];

    const nowObj = new Date();
    const localYr = nowObj.getFullYear();
    const localMo = String(nowObj.getMonth() + 1).padStart(2, '0');
    const localDy = String(nowObj.getDate()).padStart(2, '0');
    const localHr = String(nowObj.getHours()).padStart(2, '0');
    const localMi = String(nowObj.getMinutes()).padStart(2, '0');
    const localDateStr = `${localYr}-${localMo}-${localDy}`;
    const localTimeStr = `${localHr}:${localMi}`;
    const localDayName = nowObj.toLocaleDateString(aiLocale, { weekday: 'long' });

    const dynamicTimeContext = `\nLütfen kullanıcıya ${aiLangName} dilinde yanıt ver.
Bugünün GERÇEK yerel tarihi: ${localDateStr} (${localDayName}).
Şu anki GERÇEK yerel saat: ${localTimeStr}.
Etkinlik eklerken veya hatırlatıcı oluştururken bugünün yerel tarihini (${localDateStr}) ve şu anki yerel saati (${localTimeStr}) KESİNLİKLE esas al. Kullanıcı "saat kaç" veya "bugün günlerden ne" diye sorarsa tam olarak ${localTimeStr} ve ${localDateStr} (${localDayName}) bilgisini ver.`;

    let activeSystemPrompt = SYSTEM_PROMPT;
    if (promptWeight === 'minimal') {
      activeSystemPrompt = `Sen Multitool Asistanısın. Yanıtları ${aiLangName} dilinde ver. Kısa ve net ol.
Kullanıcının notları, takvimi, görevleri ve dosyalarıyla ilgili isteklerinde sadece şu JSON formatında araç çağrısı yap:
\`\`\`json
{"tool": "araç_adı", "parameters": {...}}
\`\`\`
Mevcut Araçlar:
- add_note, get_notes, delete_note
- add_calendar_event, get_calendar_events, delete_calendar_event
- add_todo_item, get_todo_items, complete_todo_item
- read_file, write_file, execute_code, list_files, delete_file`;
    } else if (promptWeight === 'balanced') {
      activeSystemPrompt = `Sen Multitool Asistanısın. Kullanıcıya ${aiLangName} dilinde yardımcı olan pratik bir AI'sın.
Notlar, takvim, görevler ve dosya işlemleri için aşağıdaki araçları kullanabilirsin.
Araç çağrısı yapmak için tek bir JSON bloğu dön:
\`\`\`json
{
  "tool": "araç_adı",
  "parameters": { ... }
}
\`\`\`
Araçlar:
1. "add_calendar_event": {"title": "str", "date": "YYYY-MM-DD", "time": "HH:MM", "description": "str"}
2. "get_calendar_events": {}
3. "delete_calendar_event": {"id": "str"}
4. "add_todo_item": {"task": "str", "priority": "low"|"medium"|"high", "dueDate": "YYYY-MM-DD"}
5. "get_todo_items": {}
6. "complete_todo_item": {"id": "str"}
7. "add_note": {"title": "str", "content": "str", "category": "str"}
8. "get_notes": {}
9. "delete_note": {"id": "str"}
10. "write_file": {"filename": "str", "content": "str"}
11. "read_file": {"filename": "str"}
12. "list_files": {}
13. "execute_code": {"code": "str"}`;
    }

    const personaExtra = promptWeight === 'minimal' ? '' : `\n\nAKTİF ROL TALİMATI:\n${PERSONAS[agentPersona].promptExtra}`;
    const fullSystemPrompt = `${activeSystemPrompt}${dynamicTimeContext}${personaExtra}`;

    const formattedHistory = [
      { role: 'system', content: fullSystemPrompt },
      ...activeHistory.map(m => ({ role: m.role, content: m.content }))
    ];

    while (loopCount < maxLoops) {
      loopCount++;
      addLog(`Invoking ${provider.toUpperCase()} model - Iteration ${loopCount}`);
      try {
        let response;
        if (provider === 'ollama') {
          response = await fetch(`${ollamaUrl}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: selectedModel,
              messages: formattedHistory,
              stream: false
            })
          });
        } else {
          let endpoint = '';
          let apiKey = '';
          let modelName = '';
          let extraHeaders: Record<string, string> = {};

          if (provider === 'groq') {
            if (!groqApiKey.trim()) throw new Error(t.errApiKeyNotSet.replace('{provider}', 'Groq'));
            endpoint = 'https://api.groq.com/openai/v1/chat/completions';
            apiKey = groqApiKey;
            modelName = groqModel;
          } else if (provider === 'deepseek') {
            if (!deepseekApiKey.trim()) throw new Error(t.errApiKeyNotSet.replace('{provider}', 'DeepSeek'));
            endpoint = 'https://api.deepseek.com/chat/completions';
            apiKey = deepseekApiKey;
            modelName = deepseekModel;
          } else if (provider === 'openai') {
            if (!openaiApiKey.trim()) throw new Error(t.errApiKeyNotSet.replace('{provider}', 'OpenAI'));
            endpoint = 'https://api.openai.com/v1/chat/completions';
            apiKey = openaiApiKey;
            modelName = openaiModel;
          } else if (provider === 'gemini') {
            if (!geminiApiKey.trim()) throw new Error(t.errApiKeyNotSet.replace('{provider}', 'Gemini'));
            endpoint = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions';
            apiKey = geminiApiKey;
            modelName = geminiModel;
          } else if (provider === 'openrouter') {
            if (!openrouterApiKey.trim()) throw new Error(t.errApiKeyNotSet.replace('{provider}', 'OpenRouter'));
            endpoint = 'https://openrouter.ai/api/v1/chat/completions';
            apiKey = openrouterApiKey;
            modelName = openrouterModel;
            extraHeaders = {
              'HTTP-Referer': 'https://multitool.ai',
              'X-Title': 'Multitool AI Agent'
            };
          }

          response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`,
              ...extraHeaders
            },
            body: JSON.stringify({
              model: modelName,
              messages: formattedHistory,
              temperature: 0.2,
              stream: false
            })
          });
        }

        if (!response.ok) {
          const errBody = await response.text();
          throw new Error(t.errConnError.replace('{status}', String(response.status)).replace('{body}', errBody || ''));
        }

        const data = await response.json();
        let responseText = '';
        if (provider === 'ollama') {
          responseText = data.message?.content || '';
        } else {
          responseText = data.choices?.[0]?.message?.content || data.error?.message || '';
        }

        let jsonStr = '';
        const jsonBlockRegex = /```json\s*(\{[\s\S]*?\})\s*```/;
        const match = responseText.match(jsonBlockRegex);
        if (match) {
          jsonStr = match[1].trim();
        } else {
          const plainCodeBlockRegex = /```\s*(\{[\s\S]*?\})\s*```/;
          const plainMatch = responseText.match(plainCodeBlockRegex);
          if (plainMatch) {
            jsonStr = plainMatch[1].trim();
          } else {
            const firstBrace = responseText.indexOf('{');
            const lastBrace = responseText.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
              jsonStr = responseText.slice(firstBrace, lastBrace + 1).trim();
            }
          }
        }

        let parsedToolCall = null;
        if (jsonStr) {
          try {
            const parsed = JSON.parse(jsonStr);
            if (parsed && typeof parsed === 'object' && parsed.tool) {
              parsedToolCall = parsed;
            }
          } catch (err) {
          }
        }

        if (parsedToolCall) {
          const toolName = parsedToolCall.tool;
          const toolParams = parsedToolCall.parameters || {};

          const toolMsgId = `tool-${Date.now()}`;
          const toolCallMessage: Message = {
            id: toolMsgId,
            role: 'system',
            content: `${t.toolCallLabel} ${toolName}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            toolCall: {
              tool: toolName,
              parameters: toolParams,
              status: 'running'
            }
          };

          setMessages(prev => [...prev, toolCallMessage]);
          setCurrentToolExecuting(toolName);
          addLog(`Executing tool: ${toolName}`);

          let toolResult = '';
          let isSuccess = false;

          try {
            const res = await executeToolLocal(toolName, toolParams);
            toolResult = JSON.stringify(res);
            isSuccess = true;
            addLog(t.logToolSuccess.replace('{tool}', toolName));
          } catch (err: any) {
            toolResult = err.message || 'Hata oluştu';
            isSuccess = false;
            addLog(`${t.logToolFailed.replace('{tool}', toolName)} ${toolResult}`);
          }

          setMessages(prev =>
            prev.map(m =>
              m.id === toolMsgId
                ? {
                  ...m,
                  toolCall: {
                    ...m.toolCall!,
                    status: isSuccess ? 'success' : 'error',
                    result: isSuccess ? toolResult : undefined,
                    error: !isSuccess ? toolResult : undefined
                  }
                }
                : m
            )
          );

          setCurrentToolExecuting(null);

          if (toolName.includes('calendar')) fetchCalendarEvents();
          if (toolName.includes('todo')) fetchTodos();
          if (toolName.includes('file') || toolName.includes('execute')) fetchSandboxFiles();

          const feedbackText = t.systemFeedback.replace('{tool}', toolName).replace('{result}', String(toolResult));
          const assistantMsg: Message = {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content: responseText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };

          const userFeedbackMsg: Message = {
            id: `feedback-${Date.now()}`,
            role: 'user',
            content: feedbackText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };

          activeHistory.push(assistantMsg);
          activeHistory.push(userFeedbackMsg);

          formattedHistory.push({ role: 'assistant', content: responseText });
          formattedHistory.push({ role: 'user', content: feedbackText });

          await new Promise(r => setTimeout(r, 500));
          continue;
        }

        const assistantFinalMsg: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: responseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, assistantFinalMsg]);
        if (autoTtsEnabled) {
          speakText(responseText, assistantFinalMsg.id);
        }
        break;

      } catch (err: any) {
        addLog(`${t.logChatRunError} ${err.message}`);
        setMessages(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            role: 'system',
            content: `${t.errChatComm} ${err.message}.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        break;
      }
    }

    setIsThinking(false);
  };

  const executeToolLocal = async (tool: string, params: any) => {
    const getLocalData = (key: string) => {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : [];
    };
    const saveLocalData = (key: string, data: any) => {
      localStorage.setItem(key, JSON.stringify(data));
    };

    switch (tool) {
      case 'add_calendar_event': {
        const events = getLocalData('multitool_calendar');
        const remMin = typeof params.reminderMinutes === 'number' ? params.reminderMinutes : (params.reminderMinutes ? parseInt(params.reminderMinutes) : 0);
        const startDateStr = params.date || params.startDate || new Date().toISOString().split('T')[0];
        const endDateStr = params.endDate || startDateStr;

        const createdEvents = [];
        const start = new Date(startDateStr);
        const end = new Date(endDateStr);
        const curr = new Date(start);
        let count = 0;

        while (curr <= end && count < 60) {
          const dStr = curr.toISOString().split('T')[0];
          const newEvent = {
            id: (Date.now() + Math.random()).toString(),
            title: params.title,
            date: dStr,
            time: params.time || '',
            endTime: params.endTime || '',
            description: params.description || '',
            reminderMinutes: remMin,
            notifiedExact: false,
            notifiedReminder: false,
            createdAt: new Date().toISOString()
          };
          events.push(newEvent);
          createdEvents.push(newEvent);
          curr.setDate(curr.getDate() + 1);
          count++;
        }

        saveLocalData('multitool_calendar', events);
        return createdEvents.length === 1 ? createdEvents[0] : createdEvents;
      }
      case 'get_calendar_events': {
        return getLocalData('multitool_calendar');
      }
      case 'delete_calendar_event': {
        const events = getLocalData('multitool_calendar');
        const updated = events.filter((e: any) => e.id !== params.id);
        saveLocalData('multitool_calendar', updated);
        return { success: true, message: `Etkinlik '${params.id}' silindi` };
      }
      case 'add_todo_item': {
        const todos = getLocalData('multitool_todos');
        const startDateStr = params.dueDate || params.date || params.startDate || new Date().toISOString().split('T')[0];
        const endDateStr = params.endDate || startDateStr;

        const createdTodos = [];
        const start = new Date(startDateStr);
        const end = new Date(endDateStr);
        const curr = new Date(start);
        let count = 0;

        while (curr <= end && count < 60) {
          const dStr = curr.toISOString().split('T')[0];
          const newTodo = {
            id: (Date.now() + Math.random()).toString(),
            task: params.task,
            priority: params.priority || 'medium',
            dueDate: dStr,
            completed: false,
            isRoutine: params.isRoutine || false,
            routineFrequency: params.routineFrequency || 'daily',
            createdAt: new Date().toISOString()
          };
          todos.push(newTodo);
          createdTodos.push(newTodo);
          curr.setDate(curr.getDate() + 1);
          count++;
        }

        saveLocalData('multitool_todos', todos);
        return createdTodos.length === 1 ? createdTodos[0] : createdTodos;
      }
      case 'get_todo_items': {
        return getLocalData('multitool_todos');
      }
      case 'complete_todo_item': {
        const todos = getLocalData('multitool_todos');
        const index = todos.findIndex((t: any) => t.id === params.id);
        if (index === -1) throw new Error(t.errTodoNotFound);
        todos[index].completed = true;
        saveLocalData('multitool_todos', todos);
        return todos[index];
      }
      case 'write_file': {
        try {
          const res = await fetch('http://localhost:3001/api/sandbox/file', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename: params.filename, content: params.content })
          });
          if (res.ok) return await res.json();
        } catch (e) { }

        const files = getLocalData('multitool_files');
        const index = files.findIndex((f: any) => f.name === params.filename);
        const newFile = {
          name: params.filename,
          content: params.content,
          updatedAt: new Date().toISOString()
        };
        if (index > -1) {
          files[index] = newFile;
        } else {
          files.push(newFile);
        }
        saveLocalData('multitool_files', files);
        return { success: true, message: `Dosya '${params.filename}' kaydedildi` };
      }
      case 'read_file': {
        try {
          const res = await fetch(`http://localhost:3001/api/sandbox/file?filename=${encodeURIComponent(params.filename)}`);
          if (res.ok) return await res.json();
        } catch (e) { }

        const files = getLocalData('multitool_files');
        const file = files.find((f: any) => f.name === params.filename);
        if (!file) throw new Error(t.errFileNotFound.replace('{filename}', params.filename));
        return file;
      }
      case 'list_files': {
        try {
          const res = await fetch('http://localhost:3001/api/sandbox/files');
          if (res.ok) return await res.json();
        } catch (e) { }

        const files = getLocalData('multitool_files');
        return files.map((f: any) => ({
          name: f.name,
          size: f.content.length,
          isDir: false,
          updatedAt: f.updatedAt
        }));
      }
      case 'execute_code': {
        try {
          const res = await fetch('http://localhost:3001/api/sandbox/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ language: params.language || 'javascript', code: params.code, filename: params.filename })
          });
          if (res.ok) return await res.json();
        } catch (e) { }

        if (params.language === 'python') {
          throw new Error(t.errOfflineJsOnly);
        }
        let logs: string[] = [];
        const originalLog = console.log;
        console.log = (...args) => {
          logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
        };
        try {
          const result = (0, eval)(params.code);
          return {
            success: true,
            stdout: logs.join('\n'),
            stderr: '',
            exitCode: 0,
            returnValue: result
          };
        } catch (e: any) {
          return {
            success: false,
            stdout: logs.join('\n'),
            stderr: e.message,
            exitCode: 1
          };
        } finally {
          console.log = originalLog;
        }
      }
      case 'delete_file': {
        const files = getLocalData('multitool_files');
        const updated = files.filter((f: any) => f.name !== params.filename);
        saveLocalData('multitool_files', updated);
        return { success: true, message: `Dosya '${params.filename}' silindi` };
      }
      case 'build_new_apk': {
        addLog(t.logAiApkStart);
        const res = await fetch('http://localhost:3001/api/build-apk', { method: 'POST' });
        const data = await res.json();
        if (!data.success) throw new Error(data.error || t.errApkBuildFailed);
        return {
          success: true,
          message: t.toolApkBuildDone,
          downloadUrl: 'http://localhost:3001/download/multitool.apk'
        };
      }
      case 'modify_app_source': {
        addLog(`${t.logAiModifySource} ${params.filepath}`);
        const res = await fetch('http://localhost:3001/api/app/source', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filepath: params.filepath, content: params.content })
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error || t.errSourceUpdateFailed);
        return data;
      }
      case 'run_localhost_server': {
        addLog(t.logAiServerStart.replace('{port}', String(params.port || 3005)));
        const res = await fetch('http://localhost:3001/api/localhost/server', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            port: params.port || 3005,
            code: params.code,
            filename: params.filename || 'server_runner.js'
          })
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || t.errServerStartFailed);
        return data;
      }
      case 'add_note': {
        const currentNotes = getLocalData('multitool_notes');
        let noteTags: string[] = [];
        if (Array.isArray(params.tags)) {
          noteTags = params.tags;
        } else if (typeof params.tags === 'string') {
          noteTags = params.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
        }
        const newNote: NoteItem = {
          id: Date.now().toString(),
          title: params.title,
          content: params.content,
          category: params.category || t.catGeneral,
          tags: noteTags,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        const updated = [newNote, ...currentNotes];
        saveLocalData('multitool_notes', updated);
        setNotes(updated);
        return newNote;
      }
      case 'get_notes': {
        return getLocalData('multitool_notes');
      }
      case 'delete_note': {
        const currentNotes = getLocalData('multitool_notes');
        const updated = currentNotes.filter((n: any) => n.id !== params.id);
        saveLocalData('multitool_notes', updated);
        setNotes(updated);
        return { success: true };
      }
      default:
        throw new Error(t.errUnknownTool.replace('{tool}', tool));
    }
  };

  const renderCalendarWidget = () => {
    const today = new Date();
    const viewYear = viewDate.getFullYear();
    const viewMonth = viewDate.getMonth();

    const locale = language === 'tr' ? 'tr-TR' : language === 'de' ? 'de-DE' : language === 'fr' ? 'fr-FR' : language === 'es' ? 'es-ES' : language === 'it' ? 'it-IT' : 'en-US';
    const monthTitleRaw = new Date(viewYear, viewMonth, 1).toLocaleDateString(locale, { month: 'long' });
    const capitalizedMonth = monthTitleRaw.charAt(0).toUpperCase() + monthTitleRaw.slice(1);

    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

    const days = [];

    const prevMonthLastDay = new Date(viewYear, viewMonth, 0).getDate();
    const prevMonth = viewMonth === 0 ? 11 : viewMonth - 1;
    const prevYear = viewMonth === 0 ? viewYear - 1 : viewYear;

    for (let i = adjustedFirstDay - 1; i >= 0; i--) {
      const dayNum = prevMonthLastDay - i;
      const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      const isSelected = selectedCalendarDate === dateStr;
      const hasEvents = events.some(e => e.date === dateStr);

      days.push(
        <div
          key={`prev-${dayNum}`}
          className={`calendar-day other-month ${isSelected ? 'selected' : ''}`}
          onClick={() => {
            setSelectedCalendarDate(dateStr);
            setViewDate(new Date(prevYear, prevMonth, 1));
          }}
          title={dateStr}
        >
          {dayNum}
          {hasEvents && <div className="calendar-day-dot"></div>}
        </div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isToday = today.getDate() === day && today.getMonth() === viewMonth && today.getFullYear() === viewYear;
      const isSelected = selectedCalendarDate === dateStr;
      const hasEvents = events.some(e => e.date === dateStr);

      days.push(
        <div
          key={`day-${day}`}
          className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
          onClick={() => setSelectedCalendarDate(dateStr)}
          title={dateStr}
        >
          {day}
          {hasEvents && <div className="calendar-day-dot"></div>}
        </div>
      );
    }

    const totalCellsSoFar = adjustedFirstDay + daysInMonth;
    const totalGridCells = totalCellsSoFar > 35 ? 42 : 35;
    const nextCellsNeeded = totalGridCells - totalCellsSoFar;
    const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1;
    const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear;

    for (let day = 1; day <= nextCellsNeeded; day++) {
      const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isSelected = selectedCalendarDate === dateStr;
      const hasEvents = events.some(e => e.date === dateStr);

      days.push(
        <div
          key={`next-${day}`}
          className={`calendar-day other-month ${isSelected ? 'selected' : ''}`}
          onClick={() => {
            setSelectedCalendarDate(dateStr);
            setViewDate(new Date(nextYear, nextMonth, 1));
          }}
          title={dateStr}
        >
          {day}
          {hasEvents && <div className="calendar-day-dot"></div>}
        </div>
      );
    }

    return (
      <div className="calendar-widget">
        <div className="calendar-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              className="btn-icon"
              onClick={() => setViewDate(new Date(viewYear, viewMonth - 1, 1))}
              title={t.prevMonthTitle}
            >
              <ChevronLeft size={16} />
            </button>
            <span className="calendar-month-title">{capitalizedMonth} {viewYear}</span>
            <button
              className="btn-icon"
              onClick={() => setViewDate(new Date(viewYear, viewMonth + 1, 1))}
              title={t.nextMonthTitle}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              className="btn-secondary"
              style={{ padding: '4px 10px', fontSize: '11px' }}
              onClick={() => {
                const now = new Date();
                setViewDate(now);
                setSelectedCalendarDate(now.toISOString().split('T')[0]);
              }}
              title={t.todayBtn}
            >
              {t.todayBtn}
            </button>
            <button className="btn-icon" onClick={fetchCalendarEvents} title={t.refreshBtn || "Yenile"}>
              <RefreshCw size={14} />
            </button>
          </div>
        </div>
        <div className="calendar-grid">
          {(language === 'tr' ? ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'] :
            language === 'de' ? ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'] :
              language === 'es' ? ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'] :
                language === 'fr' ? ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'] :
                  language === 'it' ? ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'] :
                    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']).map(d => (
                      <div key={d} className="calendar-day-label">{d}</div>
                    ))}
          {days}
        </div>
      </div>
    );
  };

  const getFilteredEvents = () => {
    return events
      .filter(e => e.date === selectedCalendarDate)
      .sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  };

  const loadAppLogo = (): Promise<HTMLImageElement | null> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = '/logo.png';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
    });
  };

  const downloadDayAsJpeg = async () => {
    const dayEvents = getFilteredEvents();
    const logoImg = await loadAppLogo();
    const W = 1080, H = 1350;
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const FONT = 'Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif';

    const dark = theme !== 'default';
    const bg = ctx.createLinearGradient(0, 0, W, H);
    if (dark) { bg.addColorStop(0, '#0f172a'); bg.addColorStop(1, '#1e1b4b'); }
    else { bg.addColorStop(0, '#ffffff'); bg.addColorStop(1, '#eef2ff'); }
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    const ink = dark ? '#f8fafc' : '#0f172a';
    const sub = dark ? '#94a3b8' : '#475569';
    const cardBg = dark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.035)';
    const lineCol = dark ? 'rgba(255,255,255,0.1)' : 'rgba(15,23,42,0.08)';
    const accentGrad = () => { const g = ctx.createLinearGradient(0, 0, W, 0); g.addColorStop(0, '#3b82f6'); g.addColorStop(0.5, '#8b5cf6'); g.addColorStop(1, '#ec4899'); return g; };

    const roundRect = (x: number, y: number, w: number, h: number, rr: number) => {
      ctx.beginPath();
      ctx.moveTo(x + rr, y); ctx.lineTo(x + w - rr, y); ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
      ctx.lineTo(x + w, y + h - rr); ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
      ctx.lineTo(x + rr, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
      ctx.lineTo(x, y + rr); ctx.quadraticCurveTo(x, y, x + rr, y);
      ctx.closePath();
    };

    // top accent band
    ctx.fillStyle = accentGrad(); ctx.fillRect(0, 0, W, 14);

    // brand logo mark (using actual logo image)
    const mkX = 70, mkY = 56, mkS = 64;
    if (logoImg) {
      ctx.save();
      ctx.fillStyle = '#ffffff';
      roundRect(mkX, mkY, mkS, mkS, 16);
      ctx.fill();
      ctx.drawImage(logoImg, mkX + 4, mkY + 4, mkS - 8, mkS - 8);
      ctx.restore();
    } else {
      ctx.fillStyle = accentGrad();
      roundRect(mkX, mkY, mkS, mkS, 16);
      ctx.fill();
      ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.font = `800 ${mkS * 0.5}px ${FONT}`;
      ctx.fillText('M', mkX + mkS / 2 - ctx.measureText('M').width / 2, mkY + mkS / 2 + 2);
    }

    ctx.fillStyle = ink; ctx.font = `800 34px ${FONT}`; ctx.textBaseline = 'alphabetic';
    ctx.fillText('Multitool AI', mkX + mkS + 18, mkY + mkS / 2 + 6);
    ctx.fillStyle = sub; ctx.font = `700 18px ${FONT}`;
    ctx.textAlign = 'right';
    ctx.fillText((t.agendaCardTitle || 'Daily Agenda').toUpperCase(), W - 70, mkY + mkS / 2 + 6);
    ctx.textAlign = 'left';

    // date block
    const dateObj = new Date(selectedCalendarDate + 'T00:00:00');
    const dayName = isNaN(dateObj.getTime()) ? '' : dateObj.toLocaleDateString(aiLocale, { weekday: 'long' });
    const dateStr = isNaN(dateObj.getTime()) ? selectedCalendarDate : dateObj.toLocaleDateString(aiLocale, { day: 'numeric', month: 'long', year: 'numeric' });
    ctx.fillStyle = sub; ctx.font = `700 34px ${FONT}`;
    ctx.fillText(dayName, 70, 230);
    ctx.fillStyle = ink; ctx.font = `900 64px ${FONT}`;
    ctx.fillText(dateStr, 70, 300);

    // divider
    ctx.strokeStyle = lineCol; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(70, 350); ctx.lineTo(W - 70, 350); ctx.stroke();

    // events
    const wrap = (text: string, maxWidth: number, font: string) => {
      ctx.font = font; const words = text.split(' '); const lines: string[] = []; let cur = '';
      for (const w of words) { const test = cur ? cur + ' ' + w : w; if (ctx.measureText(test).width <= maxWidth) cur = test; else { if (cur) lines.push(cur); cur = w; } }
      if (cur) lines.push(cur); return lines.length ? lines : [''];
    };

    let y = 390;
    const cardX = 70, cardW = W - 140, pad = 28, gap = 16;
    if (dayEvents.length === 0) {
      ctx.fillStyle = sub; ctx.font = `600 32px ${FONT}`; ctx.textAlign = 'center';
      ctx.fillText(t.agendaNoEventsCard, W / 2, 560);
      ctx.textAlign = 'left';
    } else {
      for (const evt of dayEvents) {
        const timeText = evt.time ? (evt.time + (evt.endTime ? ` – ${evt.endTime}` : '')) : t.agendaAllDay;
        const titleLines = wrap(evt.title || '', cardW - pad * 2, `800 38px ${FONT}`);
        const descLines = evt.description ? wrap(evt.description, cardW - pad * 2, `400 27px ${FONT}`) : [];
        const innerH = pad + 44 + 10 + titleLines.length * 46 + (descLines.length ? 8 + descLines.length * 34 : 0) + pad;
        if (y + innerH > H - 130) break;
        roundRect(cardX, y, cardW, innerH, 22); ctx.fillStyle = cardBg; ctx.fill();
        ctx.strokeStyle = lineCol; ctx.lineWidth = 2; ctx.stroke();
        // time pill
        ctx.font = `800 22px ${FONT}`;
        const pillText = timeText;
        const pillW = ctx.measureText(pillText).width + 32;
        const pillX = cardX + pad, pillY = y + pad;
        ctx.fillStyle = accentGrad(); roundRect(pillX, pillY, pillW, 40, 20); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.textBaseline = 'middle';
        ctx.fillText(pillText, pillX + 16, pillY + 21);
        ctx.textBaseline = 'alphabetic';
        // title
        ctx.fillStyle = ink; ctx.font = `800 38px ${FONT}`;
        let ty = y + pad + 44 + 10 + 34;
        for (const tl of titleLines) { ctx.fillText(tl, cardX + pad, ty); ty += 46; }
        // desc
        if (descLines.length) {
          ctx.fillStyle = sub; ctx.font = `400 27px ${FONT}`;
          let dy = ty + 4;
          for (const dl of descLines) { ctx.fillText(dl, cardX + pad, dy); dy += 34; }
        }
        y += innerH + gap;
      }
    }

    // footer
    ctx.fillStyle = sub; ctx.font = `700 20px ${FONT}`; ctx.textAlign = 'center';
    const countText = t.agendaEventsCount.replace('{n}', String(dayEvents.length));
    ctx.fillText(`${t.agendaGeneratedBy} • ${countText} • v1.1.0`, W / 2, H - 50);
    ctx.textAlign = 'left';

    const filename = `multitool-agenda-${selectedCalendarDate}.jpg`;
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);

    // 1. Android Native App (APK) Direct Save Interface
    if (typeof (window as any).AndroidNative?.saveImageToGallery === 'function') {
      (window as any).AndroidNative.saveImageToGallery(dataUrl, filename);
      addLog(`${t.agendaCardTitle || 'Günlük Program'}: ${selectedCalendarDate} → Galeriye Kaydedildi (Android) ✓`);
      return;
    }

    // 2. Web Share API & Browser Download Fallbacks
    try {
      canvas.toBlob(async (blob) => {
        let finalBlob = blob;
        if (!finalBlob) {
          const arr = dataUrl.split(',');
          const bstr = atob(arr[1]);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          finalBlob = new Blob([u8arr], { type: 'image/jpeg' });
        }

        const file = new File([finalBlob], filename, { type: 'image/jpeg' });

        if (typeof (navigator as any).canShare === 'function' && (navigator as any).canShare({ files: [file] })) {
          try {
            await (navigator as any).share({
              files: [file],
              title: t.agendaCardTitle || 'Günlük Program'
            });
            addLog(`${t.agendaCardTitle || 'Günlük Program'}: ${selectedCalendarDate} → Shared ✓`);
            return;
          } catch (shareErr: any) {
            if (shareErr.name === 'AbortError') return;
          }
        }

        const blobUrl = URL.createObjectURL(finalBlob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);

        addLog(`${t.agendaCardTitle || 'Günlük Program'}: ${selectedCalendarDate} → JPEG ✓`);
      }, 'image/jpeg', 0.95);
    } catch (err: any) {
      addLog(`JPEG download error: ${err.message}`);
    }
  };

  const downloadWeekAsJpeg = async () => {
    const logoImg = await loadAppLogo();
    const weekDays = getWeekDays(selectedCalendarDate);
    const W = 1200, H = 1600;
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const FONT = 'Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif';

    const dark = theme !== 'default';
    const bg = ctx.createLinearGradient(0, 0, W, H);
    if (dark) { bg.addColorStop(0, '#0f172a'); bg.addColorStop(1, '#1e1b4b'); }
    else { bg.addColorStop(0, '#ffffff'); bg.addColorStop(1, '#eef2ff'); }
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    const ink = dark ? '#f8fafc' : '#0f172a';
    const sub = dark ? '#94a3b8' : '#475569';
    const cardBg = dark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.035)';
    const lineCol = dark ? 'rgba(255,255,255,0.1)' : 'rgba(15,23,42,0.08)';
    const accentGrad = () => {
      const g = ctx.createLinearGradient(0, 0, W, 0);
      g.addColorStop(0, '#3b82f6'); g.addColorStop(0.5, '#8b5cf6'); g.addColorStop(1, '#ec4899');
      return g;
    };

    const roundRect = (x: number, y: number, w: number, h: number, rr: number) => {
      ctx.beginPath();
      ctx.moveTo(x + rr, y); ctx.lineTo(x + w - rr, y); ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
      ctx.lineTo(x + w, y + h - rr); ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
      ctx.lineTo(x + rr, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
      ctx.lineTo(x, y + rr); ctx.quadraticCurveTo(x, y, x + rr, y);
      ctx.closePath();
    };

    // top accent line
    ctx.fillStyle = accentGrad(); ctx.fillRect(0, 0, W, 16);

    // logo & header
    const mkX = 70, mkY = 56, mkS = 64;
    if (logoImg) {
      ctx.save();
      ctx.fillStyle = '#ffffff';
      roundRect(mkX, mkY, mkS, mkS, 16);
      ctx.fill();
      ctx.drawImage(logoImg, mkX + 4, mkY + 4, mkS - 8, mkS - 8);
      ctx.restore();
    } else {
      ctx.fillStyle = accentGrad();
      roundRect(mkX, mkY, mkS, mkS, 16);
      ctx.fill();
      ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.font = `800 ${mkS * 0.5}px ${FONT}`;
      ctx.fillText('M', mkX + mkS / 2 - ctx.measureText('M').width / 2, mkY + mkS / 2 + 2);
    }

    ctx.fillStyle = ink; ctx.font = `800 36px ${FONT}`; ctx.textBaseline = 'alphabetic';
    ctx.fillText('Multitool AI', mkX + mkS + 18, mkY + mkS / 2 + 6);
    ctx.fillStyle = sub; ctx.font = `700 20px ${FONT}`;
    ctx.textAlign = 'right';
    ctx.fillText((t.weeklyAgendaTitle || 'Weekly Agenda').toUpperCase(), W - 70, mkY + mkS / 2 + 6);
    ctx.textAlign = 'left';

    // date range block
    const firstDay = weekDays[0];
    const lastDay = weekDays[6];
    const firstObj = new Date(firstDay.dateIso + 'T00:00:00');
    const lastObj = new Date(lastDay.dateIso + 'T00:00:00');
    const rangeStr = `${firstObj.toLocaleDateString(aiLocale, { day: 'numeric', month: 'short' })} – ${lastObj.toLocaleDateString(aiLocale, { day: 'numeric', month: 'short', year: 'numeric' })}`;

    ctx.fillStyle = sub; ctx.font = `700 30px ${FONT}`;
    ctx.fillText(t.weeklyAgendaTitle || 'Haftalık Program', 70, 220);
    ctx.fillStyle = ink; ctx.font = `900 52px ${FONT}`;
    ctx.fillText(rangeStr, 70, 285);

    // divider
    ctx.strokeStyle = lineCol; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(70, 325); ctx.lineTo(W - 70, 325); ctx.stroke();

    // 7 days cards
    let startY = 355;
    const totalEventsInWeek = events.filter(e => weekDays.some(w => w.dateIso === e.date));

    weekDays.forEach((d) => {
      const dayEvts = events.filter(e => e.date === d.dateIso);
      const dateObj = new Date(d.dateIso + 'T00:00:00');
      const fullDayName = isNaN(dateObj.getTime()) ? d.dayName : dateObj.toLocaleDateString(aiLocale, { weekday: 'long' });
      const formattedDate = isNaN(dateObj.getTime()) ? d.dateIso : dateObj.toLocaleDateString(aiLocale, { day: 'numeric', month: 'short' });

      const isSelected = d.dateIso === selectedCalendarDate;
      const cardH = dayEvts.length === 0 ? 110 : Math.min(220, 110 + dayEvts.length * 40);

      roundRect(70, startY, W - 140, cardH, 20);
      ctx.fillStyle = isSelected ? (dark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.08)') : cardBg;
      ctx.fill();
      ctx.strokeStyle = isSelected ? '#3b82f6' : lineCol;
      ctx.lineWidth = isSelected ? 3 : 2;
      ctx.stroke();

      // day & date title
      ctx.font = `800 24px ${FONT}`;
      ctx.fillStyle = isSelected ? '#3b82f6' : ink;
      ctx.fillText(`${fullDayName.toUpperCase()} • ${formattedDate}`, 96, startY + 45);

      ctx.font = `700 18px ${FONT}`;
      ctx.fillStyle = sub;
      ctx.textAlign = 'right';
      ctx.fillText(dayEvts.length > 0 ? t.agendaEventsCount.replace('{n}', String(dayEvts.length)) : (t.noEventsDay || '-'), W - 96, startY + 45);
      ctx.textAlign = 'left';

      // day events list
      if (dayEvts.length > 0) {
        let evtY = startY + 85;
        dayEvts.slice(0, 3).forEach(evt => {
          const timeStr = evt.time ? `[${evt.time}] ` : '';
          const evtLine = `${timeStr}${evt.title}`;
          ctx.font = `600 20px ${FONT}`;
          ctx.fillStyle = ink;
          ctx.fillText(`• ${evtLine.length > 55 ? evtLine.substring(0, 52) + '...' : evtLine}`, 110, evtY);
          evtY += 36;
        });
        if (dayEvts.length > 3) {
          ctx.font = `700 16px ${FONT}`;
          ctx.fillStyle = sub;
          ctx.fillText(`+ ${dayEvts.length - 3} etkn daha...`, 110, evtY);
        }
      }

      startY += cardH + 16;
    });

    // footer
    ctx.fillStyle = sub; ctx.font = `700 20px ${FONT}`; ctx.textAlign = 'center';
    const countText = t.agendaEventsCount.replace('{n}', String(totalEventsInWeek.length));
    ctx.fillText(`${t.agendaGeneratedBy} • ${countText} • v1.1.0`, W / 2, H - 40);
    ctx.textAlign = 'left';

    const filename = `multitool-weekly-agenda-${selectedCalendarDate}.jpg`;
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);

    if (typeof (window as any).AndroidNative?.saveImageToGallery === 'function') {
      (window as any).AndroidNative.saveImageToGallery(dataUrl, filename);
      addLog(`${t.weeklyAgendaTitle || 'Haftalık Program'}: ${selectedCalendarDate} → Galeriye Kaydedildi (Android) ✓`);
      return;
    }

    try {
      canvas.toBlob(async (blob) => {
        let finalBlob = blob;
        if (!finalBlob) {
          const arr = dataUrl.split(',');
          const bstr = atob(arr[1]);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          finalBlob = new Blob([u8arr], { type: 'image/jpeg' });
        }

        const file = new File([finalBlob], filename, { type: 'image/jpeg' });

        if (typeof (navigator as any).canShare === 'function' && (navigator as any).canShare({ files: [file] })) {
          try {
            await (navigator as any).share({
              files: [file],
              title: t.weeklyAgendaTitle || 'Haftalık Program'
            });
            addLog(`${t.weeklyAgendaTitle || 'Haftalık Program'}: ${selectedCalendarDate} → Shared ✓`);
            return;
          } catch (shareErr: any) {
            if (shareErr.name === 'AbortError') return;
          }
        }

        const blobUrl = URL.createObjectURL(finalBlob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);

        addLog(`${t.weeklyAgendaTitle || 'Haftalık Program'}: ${selectedCalendarDate} → JPEG ✓`);
      }, 'image/jpeg', 0.95);
    } catch (err: any) {
      addLog(`JPEG download error: ${err.message}`);
    }
  };

  const downloadNoteAsJpeg = async (note: NoteItem) => {
    const logoImg = await loadAppLogo();
    const W = 1080;
    const FONT = 'Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
    const dark = theme !== 'default';

    const tmpCanvas = document.createElement('canvas');
    const tmpCtx = tmpCanvas.getContext('2d');

    const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number, font: string) => {
      ctx.font = font;
      const words = text.split(' ');
      const lines: string[] = [];
      let cur = '';
      for (const w of words) {
        const test = cur ? cur + ' ' + w : w;
        if (ctx.measureText(test).width <= maxWidth) {
          cur = test;
        } else {
          if (cur) lines.push(cur);
          cur = w;
        }
      }
      if (cur) lines.push(cur);
      return lines.length ? lines : [''];
    };

    const cardW = W - 140;
    const pad = 40;

    let titleLines: string[] = [note.title || ''];
    let contentLines: string[] = [];

    if (tmpCtx) {
      titleLines = wrapText(tmpCtx, note.title || '', cardW - pad * 2, `800 44px ${FONT}`);
      const rawParagraphs = (note.content || '').split('\n');
      for (const p of rawParagraphs) {
        if (p.trim() === '') {
          contentLines.push('');
        } else {
          const wrapped = wrapText(tmpCtx, p, cardW - pad * 2, `400 30px ${FONT}`);
          contentLines.push(...wrapped);
        }
      }
    }

    const titleH = titleLines.length * 54;
    const tagsH = (note.tags && note.tags.length > 0) ? 50 : 0;
    const contentH = contentLines.length * 44;

    const cardInnerH = pad + 44 + 20 + titleH + (tagsH ? tagsH + 16 : 0) + 24 + contentH + pad;
    const H = Math.max(1350, 360 + cardInnerH + 140);

    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bg = ctx.createLinearGradient(0, 0, W, H);
    if (dark) { bg.addColorStop(0, '#0f172a'); bg.addColorStop(1, '#1e1b4b'); }
    else { bg.addColorStop(0, '#ffffff'); bg.addColorStop(1, '#eef2ff'); }
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    const ink = dark ? '#f8fafc' : '#0f172a';
    const sub = dark ? '#94a3b8' : '#475569';
    const cardBg = dark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.035)';
    const lineCol = dark ? 'rgba(255,255,255,0.1)' : 'rgba(15,23,42,0.08)';
    const accentGrad = () => {
      const g = ctx.createLinearGradient(0, 0, W, 0);
      g.addColorStop(0, '#3b82f6'); g.addColorStop(0.5, '#8b5cf6'); g.addColorStop(1, '#ec4899');
      return g;
    };

    const roundRect = (x: number, y: number, w: number, h: number, rr: number) => {
      ctx.beginPath();
      ctx.moveTo(x + rr, y); ctx.lineTo(x + w - rr, y); ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
      ctx.lineTo(x + w, y + h - rr); ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
      ctx.lineTo(x + rr, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
      ctx.lineTo(x, y + rr); ctx.quadraticCurveTo(x, y, x + rr, y);
      ctx.closePath();
    };

    ctx.fillStyle = accentGrad(); ctx.fillRect(0, 0, W, 14);

    const mkX = 70, mkY = 56, mkS = 64;
    if (logoImg) {
      ctx.save();
      ctx.fillStyle = '#ffffff';
      roundRect(mkX, mkY, mkS, mkS, 16);
      ctx.fill();
      ctx.drawImage(logoImg, mkX + 4, mkY + 4, mkS - 8, mkS - 8);
      ctx.restore();
    } else {
      ctx.fillStyle = accentGrad();
      roundRect(mkX, mkY, mkS, mkS, 16);
      ctx.fill();
      ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.font = `800 ${mkS * 0.5}px ${FONT}`;
      ctx.fillText('M', mkX + mkS / 2 - ctx.measureText('M').width / 2, mkY + mkS / 2 + 2);
    }

    ctx.fillStyle = ink; ctx.font = `800 34px ${FONT}`; ctx.textBaseline = 'alphabetic';
    ctx.fillText('Multitool AI', mkX + mkS + 18, mkY + mkS / 2 + 6);
    ctx.fillStyle = sub; ctx.font = `700 18px ${FONT}`; ctx.textAlign = 'right';
    ctx.fillText((t.noteCardTitle || 'Personal Note').toUpperCase(), W - 70, mkY + mkS / 2 + 6);
    ctx.textAlign = 'left';

    const dateObj = new Date(note.createdAt);
    const dateStr = isNaN(dateObj.getTime()) ? note.createdAt : dateObj.toLocaleDateString(aiLocale, { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    ctx.fillStyle = sub; ctx.font = `700 24px ${FONT}`;
    ctx.fillText(dateStr, 70, 200);

    ctx.strokeStyle = lineCol; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(70, 230); ctx.lineTo(W - 70, 230); ctx.stroke();

    const cardX = 70;
    const cardY = 270;
    roundRect(cardX, cardY, cardW, cardInnerH, 24);
    ctx.fillStyle = cardBg; ctx.fill();
    ctx.strokeStyle = lineCol; ctx.lineWidth = 2; ctx.stroke();

    ctx.font = `800 22px ${FONT}`;
    const catText = note.category || t.catGeneral || 'Genel';
    const catW = ctx.measureText(catText).width + 36;
    const catX = cardX + pad, catY = cardY + pad;
    ctx.fillStyle = accentGrad(); roundRect(catX, catY, catW, 40, 20); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.textBaseline = 'middle';
    ctx.fillText(catText, catX + 18, catY + 21);
    ctx.textBaseline = 'alphabetic';

    ctx.fillStyle = ink; ctx.font = `800 44px ${FONT}`;
    let ty = cardY + pad + 44 + 26;
    for (const tl of titleLines) {
      ctx.fillText(tl, cardX + pad, ty);
      ty += 54;
    }

    if (note.tags && note.tags.length > 0) {
      ty += 6;
      let tagX = cardX + pad;
      ctx.font = `700 20px ${FONT}`;
      for (const tg of note.tags) {
        const tagTxt = `#${tg}`;
        const tagW = ctx.measureText(tagTxt).width + 24;
        if (tagX + tagW > cardX + cardW - pad) {
          tagX = cardX + pad;
          ty += 40;
        }
        ctx.fillStyle = dark ? 'rgba(14, 165, 233, 0.2)' : 'rgba(14, 165, 233, 0.12)';
        roundRect(tagX, ty - 22, tagW, 32, 16); ctx.fill();
        ctx.fillStyle = dark ? '#38bdf8' : '#0284c7';
        ctx.fillText(tagTxt, tagX + 12, ty);
        tagX += tagW + 10;
      }
      ty += 34;
    }

    ctx.fillStyle = ink; ctx.font = `400 30px ${FONT}`;
    ty += 20;
    for (const cl of contentLines) {
      if (cl === '') {
        ty += 22;
      } else {
        ctx.fillText(cl, cardX + pad, ty);
        ty += 44;
      }
    }

    ctx.fillStyle = sub; ctx.font = `700 20px ${FONT}`; ctx.textAlign = 'center';
    ctx.fillText(`${t.agendaGeneratedBy} • ${t.notesTitle || 'Notlar'} • v1.1.0`, W / 2, H - 50);
    ctx.textAlign = 'left';

    const cleanTitle = (note.title || 'note').replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20);
    const filename = `multitool-note-${cleanTitle}-${Date.now()}.jpg`;
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);

    if (typeof (window as any).AndroidNative?.saveImageToGallery === 'function') {
      (window as any).AndroidNative.saveImageToGallery(dataUrl, filename);
      addLog(`${note.title || 'Not'} → ${t.logNoteSavedGallery || 'Galeriye Kaydedildi'} ✓`);
      return;
    }

    try {
      canvas.toBlob(async (blob) => {
        let finalBlob = blob;
        if (!finalBlob) {
          const arr = dataUrl.split(',');
          const bstr = atob(arr[1]);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          finalBlob = new Blob([u8arr], { type: 'image/jpeg' });
        }

        const file = new File([finalBlob], filename, { type: 'image/jpeg' });

        if (typeof (navigator as any).canShare === 'function' && (navigator as any).canShare({ files: [file] })) {
          try {
            await (navigator as any).share({
              files: [file],
              title: note.title || 'Note'
            });
            addLog(`${note.title || 'Not'} → Shared ✓`);
            return;
          } catch (shareErr: any) {
            if (shareErr.name === 'AbortError') return;
          }
        }

        const blobUrl = URL.createObjectURL(finalBlob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);

        addLog(`${note.title || 'Not'} → JPEG ✓`);
      }, 'image/jpeg', 0.95);
    } catch (err: any) {
      addLog(`Note JPEG download error: ${err.message}`);
    }
  };

  const downloadAllNotesAsJpeg = async (notesToExport: NoteItem[]) => {
    if (notesToExport.length === 0) return;
    const logoImg = await loadAppLogo();
    const W = 1200, H = 1600;
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const FONT = 'Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif';

    const dark = theme !== 'default';
    const bg = ctx.createLinearGradient(0, 0, W, H);
    if (dark) { bg.addColorStop(0, '#0f172a'); bg.addColorStop(1, '#1e1b4b'); }
    else { bg.addColorStop(0, '#ffffff'); bg.addColorStop(1, '#eef2ff'); }
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    const ink = dark ? '#f8fafc' : '#0f172a';
    const sub = dark ? '#94a3b8' : '#475569';
    const cardBg = dark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.035)';
    const lineCol = dark ? 'rgba(255,255,255,0.1)' : 'rgba(15,23,42,0.08)';
    const accentGrad = () => {
      const g = ctx.createLinearGradient(0, 0, W, 0);
      g.addColorStop(0, '#3b82f6'); g.addColorStop(0.5, '#8b5cf6'); g.addColorStop(1, '#ec4899');
      return g;
    };

    const roundRect = (x: number, y: number, w: number, h: number, rr: number) => {
      ctx.beginPath();
      ctx.moveTo(x + rr, y); ctx.lineTo(x + w - rr, y); ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
      ctx.lineTo(x + w, y + h - rr); ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
      ctx.lineTo(x + rr, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
      ctx.lineTo(x, y + rr); ctx.quadraticCurveTo(x, y, x + rr, y);
      ctx.closePath();
    };

    ctx.fillStyle = accentGrad(); ctx.fillRect(0, 0, W, 16);

    const mkX = 70, mkY = 56, mkS = 64;
    if (logoImg) {
      ctx.save();
      ctx.fillStyle = '#ffffff';
      roundRect(mkX, mkY, mkS, mkS, 16);
      ctx.fill();
      ctx.drawImage(logoImg, mkX + 4, mkY + 4, mkS - 8, mkS - 8);
      ctx.restore();
    } else {
      ctx.fillStyle = accentGrad();
      roundRect(mkX, mkY, mkS, mkS, 16);
      ctx.fill();
      ctx.fillStyle = '#fff'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.font = `800 ${mkS * 0.5}px ${FONT}`;
      ctx.fillText('M', mkX + mkS / 2 - ctx.measureText('M').width / 2, mkY + mkS / 2 + 2);
    }

    ctx.fillStyle = ink; ctx.font = `800 36px ${FONT}`; ctx.textBaseline = 'alphabetic';
    ctx.fillText('Multitool AI', mkX + mkS + 20, mkY + mkS / 2 + 6);
    ctx.fillStyle = sub; ctx.font = `700 20px ${FONT}`; ctx.textAlign = 'right';
    ctx.fillText((t.notesOverviewTitle || 'Notes Overview').toUpperCase(), W - 70, mkY + mkS / 2 + 6);
    ctx.textAlign = 'left';

    ctx.fillStyle = ink; ctx.font = `900 52px ${FONT}`;
    ctx.fillText(t.notesTitle || '📝 Notlarım', 70, 200);

    ctx.strokeStyle = lineCol; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(70, 230); ctx.lineTo(W - 70, 230); ctx.stroke();

    const wrap = (text: string, maxWidth: number, font: string) => {
      ctx.font = font; const words = text.split(' '); const lines: string[] = []; let cur = '';
      for (const w of words) { const test = cur ? cur + ' ' + w : w; if (ctx.measureText(test).width <= maxWidth) cur = test; else { if (cur) lines.push(cur); cur = w; } }
      if (cur) lines.push(cur); return lines.length ? lines : [''];
    };

    let y = 270;
    const cardX = 70, cardW = W - 140, pad = 24, gap = 16;
    for (const n of notesToExport) {
      const titleLines = wrap(n.title || '', cardW - pad * 2 - 120, `800 32px ${FONT}`);
      const contentLines = wrap(n.content || '', cardW - pad * 2, `400 24px ${FONT}`).slice(0, 3);
      const innerH = pad + 32 + titleLines.length * 38 + contentLines.length * 30 + pad;
      if (y + innerH > H - 100) break;

      roundRect(cardX, y, cardW, innerH, 18);
      ctx.fillStyle = cardBg; ctx.fill();
      ctx.strokeStyle = lineCol; ctx.lineWidth = 2; ctx.stroke();

      ctx.font = `800 18px ${FONT}`;
      const catText = n.category || t.catGeneral || 'Genel';
      const catW = ctx.measureText(catText).width + 24;
      ctx.fillStyle = accentGrad(); roundRect(cardX + pad, y + pad, catW, 32, 16); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.textBaseline = 'middle';
      ctx.fillText(catText, cardX + pad + 12, y + pad + 16);
      ctx.textBaseline = 'alphabetic';

      ctx.fillStyle = ink; ctx.font = `800 32px ${FONT}`;
      let ty = y + pad + 32 + 28;
      for (const tl of titleLines) {
        ctx.fillText(tl, cardX + pad, ty);
        ty += 38;
      }

      ctx.fillStyle = sub; ctx.font = `400 24px ${FONT}`;
      ty += 4;
      for (const cl of contentLines) {
        ctx.fillText(cl, cardX + pad, ty);
        ty += 30;
      }

      y += innerH + gap;
    }

    ctx.fillStyle = sub; ctx.font = `700 20px ${FONT}`; ctx.textAlign = 'center';
    ctx.fillText(`${t.agendaGeneratedBy} • ${notesToExport.length} ${t.notesTitle || 'Notlar'} • v1.1.0`, W / 2, H - 40);
    ctx.textAlign = 'left';

    const filename = `multitool-all-notes-${Date.now()}.jpg`;
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);

    if (typeof (window as any).AndroidNative?.saveImageToGallery === 'function') {
      (window as any).AndroidNative.saveImageToGallery(dataUrl, filename);
      addLog(`Notlar → ${t.logNoteSavedGallery || 'Galeriye Kaydedildi'} ✓`);
      return;
    }

    try {
      canvas.toBlob(async (blob) => {
        let finalBlob = blob;
        if (!finalBlob) {
          const arr = dataUrl.split(',');
          const bstr = atob(arr[1]);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          finalBlob = new Blob([u8arr], { type: 'image/jpeg' });
        }

        const file = new File([finalBlob], filename, { type: 'image/jpeg' });

        if (typeof (navigator as any).canShare === 'function' && (navigator as any).canShare({ files: [file] })) {
          try {
            await (navigator as any).share({
              files: [file],
              title: t.notesTitle || 'Notes'
            });
            addLog(`Notes → Shared ✓`);
            return;
          } catch (shareErr: any) {
            if (shareErr.name === 'AbortError') return;
          }
        }

        const blobUrl = URL.createObjectURL(finalBlob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);

        addLog(`Notes → JPEG ✓`);
      }, 'image/jpeg', 0.95);
    } catch (err: any) {
      addLog(`All Notes JPEG download error: ${err.message}`);
    }
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'chat':
        return (
          <div className="chat-container">
            { }
            <div className="chat-status-bar">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold' }}>Model:</span>
                {provider === 'groq' && (
                  <select className="form-select" style={{ fontSize: '10.5px', padding: '2px 6px', width: 'auto', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} value={groqModel} onChange={(e) => setGroqModel(e.target.value)}>
                    <option value="" disabled>{t.selectModelPlaceholder}</option>
                    {models.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                  </select>
                )}
                {provider === 'deepseek' && (
                  <select className="form-select" style={{ fontSize: '10.5px', padding: '2px 6px', width: 'auto', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} value={deepseekModel} onChange={(e) => setDeepseekModel(e.target.value)}>
                    <option value="" disabled>{t.selectModelPlaceholder}</option>
                    {models.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                  </select>
                )}
                {provider === 'openai' && (
                  <select className="form-select" style={{ fontSize: '10.5px', padding: '2px 6px', width: 'auto', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} value={openaiModel} onChange={(e) => setOpenaiModel(e.target.value)}>
                    <option value="" disabled>{t.selectModelPlaceholder}</option>
                    {models.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                  </select>
                )}
                {provider === 'gemini' && (
                  <select className="form-select" style={{ fontSize: '10.5px', padding: '2px 6px', width: 'auto', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} value={geminiModel} onChange={(e) => setGeminiModel(e.target.value)}>
                    <option value="" disabled>{t.selectModelPlaceholder}</option>
                    {models.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                  </select>
                )}
                {provider === 'openrouter' && (
                  <select className="form-select" style={{ fontSize: '10.5px', padding: '2px 6px', width: 'auto', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} value={openrouterModel} onChange={(e) => setOpenrouterModel(e.target.value)}>
                    <option value="" disabled>{t.selectModelPlaceholder}</option>
                    {models.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                  </select>
                )}
                {provider === 'ollama' && (
                  <select className="form-select" style={{ fontSize: '10.5px', padding: '2px 6px', width: 'auto', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
                    <option value="" disabled>{t.selectModelPlaceholder}</option>
                    {models.length > 0 ? models.map(m => <option key={m.name} value={m.name}>{m.name}</option>) : <option value="ollama">ollama</option>}
                  </select>
                )}
                <span style={{ fontSize: '9.5px', color: 'var(--text-muted)', fontWeight: 'bold' }}>({provider.toUpperCase()})</span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  onClick={handleCreateNewChat}
                  style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid var(--success)', color: 'var(--success)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: 'var(--radius-xs)', fontSize: '10.5px', fontWeight: 'bold' }}
                  title={t.newChat || 'Yeni Sohbet Aç'}
                >
                  <MessageCirclePlus size={12} /> {t.newChat || 'Yeni Sohbet'}
                </button>
                {messages.length > 0 && (
                  <button
                    onClick={handleClearHistory}
                    style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.15)', color: 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px', padding: '3px 6px', borderRadius: 'var(--radius-xs)', fontSize: '10px' }}
                    title={t.clearCurrentChat || 'Mevcut Sohbeti Temizle'}
                  >
                    <Trash2 size={11} />
                  </button>
                )}
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: ((provider === 'groq' && groqApiKey) || (provider === 'deepseek' && deepseekApiKey) || (provider === 'openai' && openaiApiKey) || (provider === 'gemini' && geminiApiKey) || (provider === 'openrouter' && openrouterApiKey) || (provider === 'ollama' && isConnected)) ? 'var(--success)' : 'var(--danger)' }}></span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    {((provider === 'groq' && groqApiKey) || (provider === 'deepseek' && deepseekApiKey) || (provider === 'openai' && openaiApiKey) || (provider === 'gemini' && geminiApiKey) || (provider === 'openrouter' && openrouterApiKey) || (provider === 'ollama' && isConnected)) ? (t.activeStatus || 'Aktif') : (t.noKeyStatus || 'API Key Yok')}
                  </span>
                </span>
              </span>
            </div>

            { }
            {/* Quick Action Shortcuts Bar */}
            <div style={{ display: 'flex', gap: '6px', padding: '6px 12px', background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', overflowX: 'auto' }}>
              <button
                onClick={() => setActiveTab('todos')}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 10px', fontSize: '11px', fontWeight: '700', borderRadius: 'var(--radius-pill)', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--accent-emerald)', color: 'var(--accent-emerald)', cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                <Plus size={13} /> {t.quickAddTodo || 'Görev Ekle'}
              </button>
              <button
                onClick={() => setActiveTab('calendar')}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 10px', fontSize: '11px', fontWeight: '700', borderRadius: 'var(--radius-pill)', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid var(--primary)', color: 'var(--primary)', cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                <CalendarIcon size={13} /> {t.quickAddEvent || 'Etkinlik Ekle'}
              </button>
              {!isRecordingAudioTask ? (
                <button
                  onClick={startAudioTaskRecording}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 10px', fontSize: '11px', fontWeight: '700', borderRadius: 'var(--radius-pill)', background: 'rgba(217, 119, 6, 0.15)', border: '1px solid var(--accent-amber)', color: 'var(--accent-amber)', cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  <Mic size={13} /> {t.quickVoiceNote || 'Sesli Not'}
                </button>
              ) : (
                <button
                  onClick={stopAudioTaskRecording}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 10px', fontSize: '11px', fontWeight: '800', borderRadius: 'var(--radius-pill)', background: '#ef4444', color: '#ffffff', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ffffff', display: 'inline-block' }}></span>
                  Bitir (00:{(audioRecordTimer % 60).toString().padStart(2, '0')})
                </button>
              )}
              <button
                onClick={() => setActiveTab('dashboard')}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 10px', fontSize: '11px', fontWeight: '700', borderRadius: 'var(--radius-pill)', background: 'rgba(14, 165, 233, 0.15)', border: '1px solid var(--accent-cyan)', color: 'var(--accent-cyan)', cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                <BarChart2 size={13} /> {t.quickSummary || 'Günün Özeti'}
              </button>
              <button
                onClick={() => setActiveTab('sandbox')}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 10px', fontSize: '11px', fontWeight: '700', borderRadius: 'var(--radius-pill)', background: 'rgba(168, 85, 247, 0.15)', border: '1px solid #a855f7', color: '#a855f7', cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                <CodeIcon size={13} /> {t.quickSandbox || 'Sandbox'}
              </button>
            </div>

            {/* Chat Sessions Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', overflowX: 'auto' }}>
              <button
                onClick={() => setIsChatHistoryModalOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '11px',
                  fontWeight: '800',
                  background: 'rgba(99, 102, 241, 0.12)',
                  border: '1px solid var(--primary)',
                  color: 'var(--primary)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
                title={t.chatHistory}
              >
                <History size={13} /> {t.chatHistory || 'Sohbet Geçmişi'}
              </button>
              {chatSessions.map(session => (
                <div
                  key={session.id}
                  onClick={() => setActiveChatId(session.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '11px',
                    fontWeight: activeChatId === session.id ? '800' : '600',
                    background: activeChatId === session.id ? 'var(--primary)' : 'var(--bg-tertiary)',
                    color: activeChatId === session.id ? '#ffffff' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    border: activeChatId === session.id ? 'none' : '1px solid var(--border-color)'
                  }}
                >
                  <span>{session.title}</span>
                  {chatSessions.length > 1 && (
                    <span
                      onClick={(e) => handleDeleteChatSession(session.id, e)}
                      style={{ opacity: 0.7, fontSize: '10px', marginLeft: '2px', padding: '1px 3px' }}
                      title={t.deleteChat}
                    >
                      ✕
                    </span>
                  )}
                </div>
              ))}
              <button
                onClick={handleCreateNewChat}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '11px',
                  fontWeight: '800',
                  background: 'rgba(34, 197, 94, 0.15)',
                  border: '1px solid var(--success)',
                  color: 'var(--success)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                <MessageCirclePlus size={13} /> {t.newChat || 'Yeni Sohbet'}
              </button>

              <button
                type="button"
                onClick={() => setAutoTtsEnabled(!autoTtsEnabled)}
                title={t.autoTtsHelp}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '11px',
                  fontWeight: '800',
                  background: autoTtsEnabled ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-card)',
                  border: autoTtsEnabled ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                  color: autoTtsEnabled ? 'var(--primary)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {autoTtsEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
                <span>TTS: {autoTtsEnabled ? 'ON' : 'OFF'}</span>
              </button>
            </div>

            <div style={{ display: 'flex', gap: '6px', padding: '6px 12px', background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', overflowX: 'auto' }}>
              {(Object.keys(PERSONAS) as Array<keyof typeof PERSONAS>).map(pKey => (
                <button
                  key={pKey}
                  onClick={() => setAgentPersona(pKey)}
                  style={{
                    border: agentPersona === pKey ? 'none' : '1px solid var(--border-color)',
                    background: agentPersona === pKey ? 'var(--primary)' : 'var(--bg-card)',
                    color: agentPersona === pKey ? '#ffffff' : 'var(--text-secondary)',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '11px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                  title={PERSONAS[pKey].desc}
                >
                  {PERSONAS[pKey].name}
                </button>
              ))}
            </div>

            { }
            <div className="chat-messages">
              {messages.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '16px', color: 'var(--text-secondary)', textAlign: 'center', padding: '16px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
                    <img src="/logo.png" alt="Multitool Logo" style={{ width: '42px', height: '42px', objectFit: 'contain' }} />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontSize: '18px', fontWeight: '800' }}>{t.chatAssistantHeader}</h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '300px' }}>
                      {t.welcomeDesc || 'Takvim, yapılacaklar, notlar, localhost sunucu ve kendi uygulamasını kodlayıp yeni APK derleyebilen mobil asistanınız.'}
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', width: '100%', maxWidth: '340px', marginTop: '6px' }}>
                    <div onClick={() => setInputMessage(t.buildApkPrompt || 'Bana yeni bir APK derleyip indirme bağlantısı verir misin?')} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Hammer size={16} color="var(--primary)" />
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)' }}>{t.buildApkCardTitle || 'Otomatik APK Derle'}</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{t.buildApkCardSub || 'Vite + Capacitor + Gradle ile derleme yap'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                messages.map((m) => {
                  if (m.toolCall) {
                    return (
                      <div key={m.id} className="tool-call-badge">
                        <div className="tool-call-header">
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>
                            <Cpu size={14} />
                            🛠️ {m.toolCall.tool}
                          </span>
                          <span style={{ fontSize: '10px', textTransform: 'uppercase' }}>
                            {m.toolCall.status}
                          </span>
                        </div>
                        <div className="tool-params">
                          <strong>{t.paramsLabel}</strong> {JSON.stringify(m.toolCall.parameters, null, 2)}
                        </div>
                        {m.toolCall.result && (
                          <div className="tool-result">
                            <strong>{t.resultLabel}</strong><br />{m.toolCall.result}
                          </div>
                        )}
                        {m.toolCall.error && (
                          <div className="tool-result" style={{ color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.05)' }}>
                            <strong>{t.errorLabel}</strong><br />{m.toolCall.error}
                          </div>
                        )}
                      </div>
                    );
                  }

                  if (m.role === 'system') return null;

                  return (
                    <div key={m.id} className={`message-bubble ${m.role}`}>
                      {renderMessageContent(m.content)}
                      <div style={{ display: 'flex', justifyContent: m.role === 'assistant' ? 'space-between' : 'flex-end', alignItems: 'center', fontSize: '9px', opacity: 0.85, marginTop: '6px', gap: '8px' }}>
                        {m.role === 'assistant' && (
                          <button
                            type="button"
                            onClick={() => speakText(m.content, m.id)}
                            title={speakingMessageId === m.id ? (t.stopListenBtn || 'Durdur') : (t.listenBtn || 'Seslendir')}
                            style={{
                              background: speakingMessageId === m.id ? 'var(--primary)' : 'rgba(255,255,255,0.06)',
                              border: speakingMessageId === m.id ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                              color: speakingMessageId === m.id ? '#ffffff' : 'var(--text-secondary)',
                              cursor: 'pointer',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '10px',
                              fontWeight: '700',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            {speakingMessageId === m.id ? <VolumeX size={12} /> : <Volume2 size={12} />}
                            <span>{speakingMessageId === m.id ? (t.stopListenBtn || 'Durdur') : (t.listenBtn || 'Seslendir')}</span>
                          </button>
                        )}
                        <span>{m.timestamp}</span>
                      </div>
                    </div>
                  );
                })
              )}

              {isThinking && (
                <div className="thinking-bubble">
                  <div className="thinking-dot"></div>
                  <div className="thinking-dot"></div>
                  <div className="thinking-dot"></div>
                  {currentToolExecuting && (
                    <span style={{ fontSize: '11px', color: 'var(--accent-cyan)', marginLeft: '8px', fontWeight: 'bold' }}>
                      ({currentToolExecuting}...)
                    </span>
                  )}
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            { }
            <form onSubmit={handleSendMessage} className="chat-input-area">
              <button
                type="button"
                className="btn-icon"
                onClick={toggleVoiceRecognition}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: isListening ? 'var(--danger)' : 'var(--bg-tertiary)',
                  color: isListening ? '#fff' : 'var(--text-secondary)',
                  boxShadow: isListening ? '0 0 10px rgba(239, 68, 68, 0.5)' : 'none'
                }}
                title={isListening ? t.voiceListeningTitle : t.voiceWriteTitle}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
              <textarea
                className="chat-textarea"
                placeholder={t.chatPlaceholder}
                value={inputMessage}
                disabled={isThinking}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
              <button
                type="submit"
                className="chat-send-btn"
                disabled={isThinking || !inputMessage.trim()}
                title={t.sendMsg || 'Gönder'}
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        );
      case 'calendar': {
        const dayEvents = getFilteredEvents();
        const otherEvents = dayEvents.filter(e => {
          if (!e.time) return true;
          const [evHourStr] = e.time.split(':');
          const evHour = parseInt(evHourStr);
          return isNaN(evHour) || evHour < 7 || evHour > 23;
        });

        return (
          <div className="screen-content">
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '800' }}>{t.calendarTitle || '📅 Takvim & Program'}</h3>
            {renderCalendarWidget()}

            <div className="app-card">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <h4 style={{ fontSize: '13.5px', margin: 0, fontWeight: '800', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                    📆 {selectedCalendarDate} {t.scheduleLabel || 'Programı'}
                  </h4>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <button
                      onClick={downloadDayAsJpeg}
                      title={t.downloadDayJpeg}
                      style={{
                        padding: '4px 8px',
                        fontSize: '11px',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: 'rgba(99, 102, 241, 0.12)',
                        color: 'var(--primary)',
                        border: '1px solid var(--primary-glow)',
                        borderRadius: 'var(--radius-xs)',
                        cursor: 'pointer'
                      }}
                    >
                      <Download size={12} /> {t.downloadDayJpeg || 'Günü İndir'}
                    </button>
                    <button
                      onClick={downloadWeekAsJpeg}
                      title={t.downloadWeekJpeg}
                      style={{
                        padding: '4px 8px',
                        fontSize: '11px',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: 'rgba(14, 165, 233, 0.12)',
                        color: 'var(--accent-cyan)',
                        border: '1px solid rgba(14, 165, 233, 0.3)',
                        borderRadius: 'var(--radius-xs)',
                        cursor: 'pointer'
                      }}
                    >
                      <Download size={12} /> {t.downloadWeekJpeg || 'Haftayı İndir'}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', padding: '3px', gap: '4px', border: '1px solid var(--border-color)' }}>
                  <button
                    onClick={() => setCalendarViewMode('timeline')}
                    style={{
                      flex: 1,
                      border: 'none',
                      background: calendarViewMode === 'timeline' ? 'var(--primary-gradient)' : 'transparent',
                      color: calendarViewMode === 'timeline' ? '#ffffff' : 'var(--text-secondary)',
                      padding: '5px 8px',
                      fontSize: '11px',
                      borderRadius: 'var(--radius-xs)',
                      cursor: 'pointer',
                      fontWeight: '700',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {t.viewTimeline || 'Akış'}
                  </button>
                  <button
                    onClick={() => setCalendarViewMode('weekly')}
                    style={{
                      flex: 1,
                      border: 'none',
                      background: calendarViewMode === 'weekly' ? 'var(--primary-gradient)' : 'transparent',
                      color: calendarViewMode === 'weekly' ? '#ffffff' : 'var(--text-secondary)',
                      padding: '5px 8px',
                      fontSize: '11px',
                      borderRadius: 'var(--radius-xs)',
                      cursor: 'pointer',
                      fontWeight: '700',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {t.viewWeekly || 'Haftalık'}
                  </button>
                  <button
                    onClick={() => setCalendarViewMode('list')}
                    style={{
                      flex: 1,
                      border: 'none',
                      background: calendarViewMode === 'list' ? 'var(--primary-gradient)' : 'transparent',
                      color: calendarViewMode === 'list' ? '#ffffff' : 'var(--text-secondary)',
                      padding: '5px 8px',
                      fontSize: '11px',
                      borderRadius: 'var(--radius-xs)',
                      cursor: 'pointer',
                      fontWeight: '700',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {t.viewList || 'Liste'}
                  </button>
                </div>
              </div>

              {calendarViewMode === 'weekly' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                    {getWeekDays(selectedCalendarDate).map(d => {
                      const isSelected = d.dateIso === selectedCalendarDate;
                      const eventsForDay = events.filter(e => e.date === d.dateIso);
                      return (
                        <div
                          key={d.dateIso}
                          onClick={() => setSelectedCalendarDate(d.dateIso)}
                          style={{
                            padding: '8px 2px',
                            borderRadius: 'var(--radius-sm)',
                            background: isSelected ? 'var(--primary-glow)' : 'rgba(0,0,0,0.2)',
                            border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <div style={{ fontSize: '10px', fontWeight: '700', color: isSelected ? 'var(--primary)' : 'var(--text-muted)' }}>
                            {d.dayName}
                          </div>
                          <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', margin: '2px 0' }}>
                            {d.dayNumber}
                          </div>
                          <div style={{ fontSize: '9px', color: eventsForDay.length > 0 ? 'var(--accent-cyan)' : 'var(--text-muted)', fontWeight: '700' }}>
                            {eventsForDay.length > 0 ? `${eventsForDay.length} etkn` : '-'}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '12px', fontWeight: '800', marginBottom: '8px', color: 'var(--text-primary)' }}>
                      📌 {selectedCalendarDate} {t.eventsForDateSuffix}
                    </div>
                    {dayEvents.length === 0 ? (
                      <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', textAlign: 'center', margin: 0, padding: '10px 0' }}>
                        {t.noEventsDay}
                      </p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {dayEvents.map(evt => (
                          <div key={evt.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)', padding: '8px 12px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-color)' }}>
                            <div>
                              <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)' }}>{evt.title}</div>
                              {evt.time && (
                                <div style={{ fontSize: '10.5px', color: 'var(--accent-cyan)', marginTop: '2px' }}>
                                  ⏰ {evt.time} {evt.endTime ? `- ${evt.endTime}` : ''}
                                </div>
                              )}
                              {evt.description && <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{evt.description}</div>}
                            </div>
                            <button className="btn-icon" style={{ color: 'var(--danger)', width: '26px', height: '26px' }} onClick={() => handleDeleteEvent(evt.id)}>
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : calendarViewMode === 'list' ? (
                dayEvents.length === 0 ? (
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: '16px 0' }}>
                    {t.noEventsDate}
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {dayEvents.map(event => (
                      <div key={event.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0, 0, 0, 0.25)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '10px 14px' }}>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>{event.title}</div>
                          {event.time && <div style={{ fontSize: '11px', color: 'var(--accent-cyan)', marginTop: '2px' }}>⏰ {event.time}{event.endTime ? ` - ${event.endTime}` : ''}</div>}
                          {event.description && <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{event.description}</div>}
                        </div>
                        <button className="btn-icon" style={{ color: 'var(--danger)' }} onClick={() => handleDeleteEvent(event.id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '350px', overflowY: 'auto', paddingRight: '4px' }}>
                  {otherEvents.length > 0 && (
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div style={{ width: '40px', fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)', paddingTop: '4px', textAlign: 'right' }}>
                        {t.other}
                      </div>
                      <div style={{ flex: 1, background: 'rgba(0, 0, 0, 0.25)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {otherEvents.map(e => (
                          <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)' }}>{e.title} {e.time ? `(${e.time}${e.endTime ? ` - ${e.endTime}` : ''})` : ''}</div>
                              {e.description && <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{e.description}</div>}
                            </div>
                            <button className="btn-icon" style={{ color: 'var(--danger)', width: '28px', height: '28px' }} onClick={() => handleDeleteEvent(e.id)}>
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {Array.from({ length: 17 }, (_, i) => {
                    const hour = i + 7;
                    const timeString = `${hour.toString().padStart(2, '0')}:00`;
                    const eventsInHour = dayEvents.filter(e => {
                      if (!e.time) return false;
                      const [evHour] = e.time.split(':');
                      return parseInt(evHour) === hour;
                    });
                    return (
                      <div key={timeString} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <div style={{ width: '40px', fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)', paddingTop: '6px', textAlign: 'right' }}>
                          {timeString}
                        </div>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: eventsInHour.length > 0 ? 'var(--primary)' : 'var(--border-color)',
                          marginTop: '8px',
                          zIndex: 2
                        }} />
                        <div style={{ flex: 1, minHeight: '38px', background: eventsInHour.length > 0 ? 'rgba(99, 102, 241, 0.12)' : 'rgba(0,0,0,0.15)', border: eventsInHour.length > 0 ? '1px solid var(--primary)' : '1px dashed var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '6px 12px', display: 'flex', flexDirection: 'column', gap: '6px', cursor: 'pointer' }}
                          onClick={() => {
                            if (eventsInHour.length === 0) {
                              setNewEventTime(timeString);
                              const input = document.getElementById('new-event-title-input');
                              if (input) input.focus();
                            }
                          }}
                        >
                          {eventsInHour.length === 0 ? (
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Plus size={11} /> {t.emptyTimeSlot}
                            </span>
                          ) : (
                            eventsInHour.map(e => (
                              <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                  <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    {e.title} {e.time ? `(${e.time}${e.endTime ? ` - ${e.endTime}` : ''})` : ''}
                                    {e.reminderMinutes ? <span style={{ fontSize: '9.5px', color: 'var(--accent-amber)', background: 'rgba(245, 158, 11, 0.15)', padding: '1px 5px', borderRadius: '4px' }}>⏰ {e.reminderMinutes} {t.reminderMinBefore}</span> : null}
                                  </div>
                                  {e.description && <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{e.description}</div>}
                                </div>
                                <button className="btn-icon" style={{ color: 'var(--danger)', width: '28px', height: '28px' }} onClick={(evt) => { evt.stopPropagation(); handleDeleteEvent(e.id); }}>
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            { }
            <button onClick={openEventModal} className="btn-primary" style={{ width: '100%', padding: '12px' }}>
              <Plus size={16} /> {t.addEvent}
            </button>

            {eventModalOpen && (
              <div
                onClick={closeEventModal}
                style={{
                  position: 'fixed', inset: 0, zIndex: 2000,
                  background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(2px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '14px'
                }}
              >
                <div
                  onClick={(ev) => ev.stopPropagation()}
                  style={{
                    background: 'var(--bg-card)', borderRadius: '18px',
                    width: '100%', maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto',
                    padding: '20px', border: '1px solid var(--border-color)',
                    boxShadow: 'var(--shadow-lg)', display: 'flex', flexDirection: 'column', gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0 }}>{t.addEvent}</h3>
                    <button onClick={closeEventModal} className="btn-icon" style={{ fontSize: '16px', color: 'var(--text-muted)' }}>✕</button>
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '11px' }}>{t.eventTitlePlaceholder}</label>
                    <input
                      type="text"
                      placeholder={t.eventTitlePlaceholder}
                      className="form-input"
                      value={newEventTitle}
                      onChange={(e) => setNewEventTitle(e.target.value)}
                      autoFocus
                    />
                  </div>

                  {/* Başlangıç */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '11px' }}>{t.eventStartDate}</label>
                      <input
                        type="date"
                        className="form-input"
                        value={selectedCalendarDate}
                        onChange={(e) => {
                          setSelectedCalendarDate(e.target.value);
                          if (newEventTime && newEventEndTime) {
                            const s = parseEventDateTime(e.target.value, newEventTime);
                            const end = parseEventDateTime(newEventEndDate || e.target.value, newEventEndTime);
                            recomputeDuration(s, end);
                          }
                        }}
                        style={{ fontSize: '12px', padding: '9px' }}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '11px' }}>{t.eventStartTime}</label>
                      <input
                        type="time"
                        className="form-input"
                        value={newEventTime}
                        onChange={(e) => {
                          setNewEventTime(e.target.value);
                          if (newEventEndTime) {
                            const s = parseEventDateTime(selectedCalendarDate, e.target.value);
                            const end = parseEventDateTime(newEventEndDate || selectedCalendarDate, newEventEndTime);
                            recomputeDuration(s, end);
                          }
                        }}
                        style={{ fontSize: '12px', padding: '9px' }}
                      />
                    </div>
                  </div>

                  {/* Süre (saat) */}
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '11px' }}>{t.eventDuration}</label>
                    <input
                      type="number"
                      min="0"
                      step="0.25"
                      placeholder={t.durationPlaceholder}
                      className="form-input"
                      value={newEventDuration}
                      onChange={(e) => recomputeEnd(e.target.value)}
                      style={{ fontSize: '12px', padding: '9px' }}
                    />
                  </div>

                  {/* Bitiş */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '11px' }}>{t.eventEndDate}</label>
                      <input
                        type="date"
                        className="form-input"
                        value={newEventEndDate}
                        onChange={(e) => {
                          setNewEventEndDate(e.target.value);
                          if (newEventTime && newEventEndTime) {
                            const s = parseEventDateTime(selectedCalendarDate, newEventTime);
                            const end = parseEventDateTime(e.target.value, newEventEndTime);
                            recomputeDuration(s, end);
                          }
                        }}
                        style={{ fontSize: '12px', padding: '9px' }}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '11px' }}>{t.eventEndTime}</label>
                      <input
                        type="time"
                        className="form-input"
                        value={newEventEndTime}
                        onChange={(e) => {
                          setNewEventEndTime(e.target.value);
                          if (newEventTime) {
                            const s = parseEventDateTime(selectedCalendarDate, newEventTime);
                            const end = parseEventDateTime(newEventEndDate || selectedCalendarDate, e.target.value);
                            recomputeDuration(s, end);
                          }
                        }}
                        style={{ fontSize: '12px', padding: '9px' }}
                      />
                    </div>
                  </div>

                  {/* Hatırlatıcı */}
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '11px' }}>{t.eventReminder}</label>
                    <select
                      className="form-select"
                      value={newEventReminder}
                      onChange={(e) => setNewEventReminder(Number(e.target.value))}
                      style={{ fontSize: '12px', padding: '9px' }}
                    >
                      <option value={0}>{t.reminderOnTime}</option>
                      <option value={5}>5 {t.reminderMinBefore}</option>
                      <option value={10}>10 {t.reminderMinBefore}</option>
                      <option value={15}>15 {t.reminderMinBefore}</option>
                      <option value={30}>30 {t.reminderMinBefore}</option>
                      <option value={60}>{t.reminderHourBefore}</option>
                    </select>
                  </div>

                  {/* Açıklama */}
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '11px' }}>{t.eventDescPlaceholder}</label>
                    <textarea
                      placeholder={t.eventDescPlaceholder}
                      className="form-input"
                      value={newEventDesc}
                      onChange={(e) => setNewEventDesc(e.target.value)}
                      rows={3}
                      style={{ fontSize: '12px', padding: '9px', resize: 'vertical', minHeight: '64px' }}
                    />
                  </div>

                  {/* Ek / Resim */}
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '11px' }}>{t.eventAddAttachment}</label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleEventFileChange}
                      style={{ fontSize: '11px', width: '100%' }}
                    />
                    {newEventAttachments.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                        {newEventAttachments.map((att, idx) => (
                          <div key={idx} style={{ position: 'relative', width: '64px', height: '64px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                            {att.type.startsWith('image/') ? (
                              <img src={att.dataUrl} alt={att.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', padding: '4px', textAlign: 'center', color: 'var(--text-muted)' }}>{att.name}</div>
                            )}
                            <button
                              type="button"
                              onClick={() => setNewEventAttachments(prev => prev.filter((_, i) => i !== idx))}
                              style={{ position: 'absolute', top: '2px', right: '2px', width: '18px', height: '18px', borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >✕</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                    <button type="button" className="btn-secondary" style={{ flex: 1, padding: '11px' }} onClick={closeEventModal}>
                      {t.cancelBtn}
                    </button>
                    <button type="button" className="btn-primary" style={{ flex: 1, padding: '11px' }} onClick={() => handleAddEvent()}>
                      <Plus size={16} /> {t.saveEventBtn}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      }
      case 'todos': {
        const filteredTodos = todos.filter(todo => {
          if (todoFilterMode === 'normal') return !todo.isRoutine;
          if (todoFilterMode === 'routines') return !!todo.isRoutine;
          return true;
        });

        const pendingTodos = filteredTodos.filter(t => !t.completed);
        const activeCompletedTodos = filteredTodos.filter(t => t.completed);
        const totalCompleted = activeCompletedTodos.length + archivedTodos.length;
        const totalAllTasks = filteredTodos.length + archivedTodos.length;
        const completionPercentage = totalAllTasks > 0 ? Math.round((totalCompleted / totalAllTasks) * 100) : 0;

        return (
          <div className="screen-content">
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '800' }}>{t.todosTitle || '✔️ Yapılacaklar & Rutinler'}</h3>

            {/* Todo Stats Header */}
            <div className="todo-stats">
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700' }}>
                  <span>{t.completionRateLabel || 'Genel Tamamlanma Oranı'}</span>
                  <span style={{ color: 'var(--primary)', fontWeight: '800' }}>%{completionPercentage}</span>
                </div>
                <div style={{ height: '6px', width: '100%', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${completionPercentage}%`, background: 'var(--primary-gradient)', transition: 'width 0.3s ease' }}></div>
                </div>
                <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  <span>{t.activeLabel || 'Aktif'}: <strong style={{ color: 'var(--text-primary)' }}>{pendingTodos.length}</strong></span>
                  <span>{t.completedLabel || 'Tamamlanan'}: <strong style={{ color: 'var(--text-primary)' }}>{activeCompletedTodos.length}</strong></span>
                  <span>{t.archivedLabel || 'Arşivlenen'}: <strong style={{ color: '#10b981' }}>{archivedTodos.length}</strong></span>
                </div>
              </div>
            </div>

            {/* Todo Filter Tabs */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {[
                { id: 'all', label: t.allTasksLabel || 'Tüm Görevler' },
                { id: 'normal', label: t.normalTasksLabel || 'Normal Görevler' },
                { id: 'routines', label: t.routinesTabLabel || '🔄 Rutinler' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setTodoFilterMode(f.id as any)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '11px',
                    fontWeight: '700',
                    border: todoFilterMode === f.id ? 'none' : '1px solid var(--border-color)',
                    background: todoFilterMode === f.id ? 'var(--primary)' : 'var(--bg-tertiary)',
                    color: todoFilterMode === f.id ? '#ffffff' : 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* New Todo Form */}
            <form onSubmit={handleAddTodo} className="app-card" style={{ gap: '10px' }}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder={t.todoPlaceholder || 'Yapılacak iş veya rutin görevi...'}
                  className="form-input"
                  value={newTodoTask}
                  onChange={(e) => setNewTodoTask(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <select
                    className="form-select"
                    value={newTodoPriority}
                    onChange={(e) => setNewTodoPriority(e.target.value as any)}
                  >
                    <option value="low">{t.priorityLow || 'Düşük Öncelik'}</option>
                    <option value="medium">{t.priorityMedium || 'Orta Öncelik'}</option>
                    <option value="high">{t.priorityHigh || 'Yüksek Öncelik'}</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <input
                    type="date"
                    className="form-input"
                    value={newTodoDueDate}
                    onChange={(e) => setNewTodoDueDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Routine Options */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-tertiary)', padding: '6px 10px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-color)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', fontWeight: '700', cursor: 'pointer', color: 'var(--text-primary)' }}>
                  <input
                    type="checkbox"
                    checked={newTodoIsRoutine}
                    onChange={(e) => setNewTodoIsRoutine(e.target.checked)}
                  />
                  🔄 {t.isRoutine || 'Rutin Görev Yap'}
                </label>
                {newTodoIsRoutine && (
                  <select
                    className="form-select"
                    style={{ fontSize: '11px', padding: '3px 6px', flex: 1 }}
                    value={newTodoFrequency}
                    onChange={(e) => setNewTodoFrequency(e.target.value as any)}
                  >
                    <option value="daily">{t.freqDaily || 'Her Gün (Günlük)'}</option>
                    <option value="weekly">{t.freqWeekly || 'Her Hafta (Haftalık)'}</option>
                    <option value="monthly">{t.freqMonthly || 'Her Ay (Aylık)'}</option>
                  </select>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 2 }}>
                  <Plus size={16} /> {t.addTaskBtn || 'Görev Ekle'}
                </button>
                  {!isRecordingAudioTask ? (
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ flex: 1, fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                      onClick={startAudioTaskRecording}
                    >
                      <Mic size={14} color="var(--primary)" /> {t.voiceNoteBtn || 'Sesli Not'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      style={{ flex: 1, fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: '#ef4444', color: '#ffffff', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: '800', cursor: 'pointer', boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)' }}
                      onClick={stopAudioTaskRecording}
                    >
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffffff', display: 'inline-block' }}></span>
                      🔴 Bitir (00:{(audioRecordTimer % 60).toString().padStart(2, '0')})
                    </button>
                  )}
              </div>
            </form>

            <div className="todo-list">
              {filteredTodos.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', padding: '24px 0' }}>
                  {t.noTasksFound || 'Görev bulunamadı.'}
                </p>
              ) : (
                filteredTodos.map(todo => (
                  <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                    <div
                      className={`todo-checkbox ${todo.completed ? 'checked' : ''}`}
                      onClick={() => handleToggleTodo(todo.id, todo.completed)}
                    >
                      {todo.completed && <Check size={12} />}
                    </div>
                    <div className="todo-content">
                      <span className="todo-text">{todo.task}</span>
                      {todo.audioUrl && (
                        <div style={{ marginTop: '6px' }}>
                          <audio controls src={todo.audioUrl} style={{ height: '36px', width: '100%', maxWidth: '280px', borderRadius: '18px' }} />
                        </div>
                      )}
                      <div className="todo-meta">
                        <span className={`todo-priority ${todo.priority}`}>{todo.priority}</span>
                        {todo.dueDate && <span>📅 {t.dueDateLabel}: {todo.dueDate}</span>}
                        {todo.isRoutine && (
                          <span style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)', padding: '1px 6px', borderRadius: '4px', fontSize: '9.5px', fontWeight: '800' }}>
                            🔄 {t.routines} ({todo.routineFrequency === 'weekly' ? t.routineTagWeekly : todo.routineFrequency === 'monthly' ? t.routineTagMonthly : t.routineTagDaily})
                          </span>
                        )}
                        {todo.completed && <span style={{ color: '#10b981', fontSize: '10px' }}>✓ {t.completedTag}</span>}
                      </div>
                    </div>
                    <button className="btn-icon" style={{ color: 'var(--danger)' }} onClick={() => handleDeleteTodo(todo.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            { }
            {archivedTodos.length > 0 && (
              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                    📦 {t.archivedTasksHeader} ({archivedTodos.length})
                  </h4>
                  <button
                    className="btn-secondary"
                    style={{ fontSize: '11px', padding: '4px 8px', color: 'var(--danger)' }}
                    onClick={() => {
                      if (confirm(t.clearArchiveConfirm)) {
                        setArchivedTodos([]);
                      }
                    }}
                  >
                    {t.clearArchive}
                  </button>
                </div>
                <div className="todo-list" style={{ opacity: 0.85 }}>
                  {archivedTodos.map(todo => (
                    <div key={todo.id} className="todo-item completed" style={{ background: 'var(--bg-tertiary)' }}>
                      <div className="todo-checkbox checked">
                        <Check size={12} />
                      </div>
                      <div className="todo-content">
                        <span className="todo-text" style={{ textDecoration: 'line-through' }}>{todo.task}</span>
                        {todo.audioUrl && (
                          <div style={{ marginTop: '6px' }}>
                            <audio controls src={todo.audioUrl} style={{ height: '36px', width: '100%', maxWidth: '280px', borderRadius: '18px' }} />
                          </div>
                        )}
                        <div className="todo-meta">
                          <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>📦 {t.archived}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      }
      case 'notes': {
        const categories = [t.catAll, t.catGeneral, t.catIdea, t.catWork, t.catPersonal, t.catCode];
        const allCustomTags = [t.catAll, ...Array.from(new Set(notes.flatMap(n => n.tags || [])))];

        const filteredNotes = notes.filter(n => {
          const matchesCat = selectedNoteCategory === t.catAll || n.category === selectedNoteCategory;
          const matchesTag = selectedNoteTag === t.catAll || (n.tags && n.tags.includes(selectedNoteTag));
          const matchesSearch = !noteSearchQuery ||
            n.title.toLowerCase().includes(noteSearchQuery.toLowerCase()) ||
            n.content.toLowerCase().includes(noteSearchQuery.toLowerCase()) ||
            (n.tags && n.tags.some(t => t.toLowerCase().includes(noteSearchQuery.toLowerCase())));
          return matchesCat && matchesTag && matchesSearch;
        });

        const handleAddNoteSubmit = (e: React.FormEvent) => {
          e.preventDefault();
          if (!newNoteTitle.trim() || !newNoteContent.trim()) return;
          const parsedTags = newNoteTagsInput
            .split(',')
            .map(t => t.trim().replace(/^#/, ''))
            .filter(Boolean);

          const newNote: NoteItem = {
            id: Date.now().toString(),
            title: newNoteTitle.trim(),
            content: newNoteContent.trim(),
            category: newNoteCategory || t.catGeneral,
            tags: parsedTags,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          setNotes(prev => [newNote, ...prev]);
          setNewNoteTitle('');
          setNewNoteContent('');
          setNewNoteTagsInput('');
        };

        const handleDeleteNote = (id: string) => {
          if (confirm(t.deleteNoteConfirm)) {
            setNotes(prev => prev.filter(n => n.id !== id));
          }
        };

        return (
          <div className="screen-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '800' }}>{t.notesTitle || '📝 Notlarım'}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {notes.length > 0 && (
                  <button
                    onClick={() => downloadAllNotesAsJpeg(filteredNotes)}
                    title={t.downloadAllNotesJpeg || 'Tüm Notları Kaydet (JPEG)'}
                    style={{
                      border: '1px solid var(--primary-glow)',
                      background: 'rgba(99, 102, 241, 0.15)',
                      color: 'var(--primary)',
                      padding: '4px 8px',
                      fontSize: '11px',
                      borderRadius: 'var(--radius-xs)',
                      cursor: 'pointer',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Download size={13} /> {t.downloadAllNotesJpeg || 'Tüm Notları Kaydet'}
                  </button>
                )}
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t.catAll}: <strong>{notes.length}</strong></span>
              </div>
            </div>

            {/* Note Creation Form */}
            <form onSubmit={handleAddNoteSubmit} className="app-card" style={{ gap: '10px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: '800', margin: 0 }}>{t.newNoteHeader || 'Yeni Not Oluştur'}</h4>
              <div className="form-group">
                <input
                  type="text"
                  placeholder={t.noteTitlePlaceholder || 'Not Başlığı...'}
                  className="form-input"
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <select
                    className="form-select"
                    value={newNoteCategory}
                    onChange={(e) => setNewNoteCategory(e.target.value)}
                  >
                    <option value="Genel">{t.catGeneral}</option>
                    <option value="Fikir">{t.catIdea}</option>
                    <option value="İş">{t.catWork}</option>
                    <option value="Kişisel">{t.catPersonal}</option>
                    <option value="Kod">{t.catCode}</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder={t.tagsPlaceholder || 'Özel Etiketler (virgülle ayırın: #proje, #yazılım, #acil)...'}
                  className="form-input"
                  value={newNoteTagsInput}
                  onChange={(e) => setNewNoteTagsInput(e.target.value)}
                  style={{ fontSize: '11.5px' }}
                />
              </div>
              <div className="form-group">
                <textarea
                  placeholder={t.noteContentPlaceholder || 'Not içeriğinizi buraya yazın...'}
                  className="form-input"
                  style={{ minHeight: '80px', fontFamily: 'inherit', resize: 'vertical' }}
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                <Plus size={16} /> {t.saveNoteBtn || 'Notu Kaydet'}
              </button>
            </form>

            {/* Category and Tag Filters, Search */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input
                type="text"
                placeholder={t.searchNotesPlaceholder || 'Notlarda veya etiketlerde ara...'}
                className="form-input"
                value={noteSearchQuery}
                onChange={(e) => setNoteSearchQuery(e.target.value)}
                style={{ fontSize: '12px', padding: '8px 12px' }}
              />

              <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedNoteCategory(cat)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: '11px',
                      fontWeight: '700',
                      border: selectedNoteCategory === cat ? 'none' : '1px solid var(--border-color)',
                      background: selectedNoteCategory === cat ? 'var(--primary)' : 'var(--bg-tertiary)',
                      color: selectedNoteCategory === cat ? '#ffffff' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {allCustomTags.length > 1 && (
                <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '4px', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 'bold' }}>
                    <Tag size={11} /> Etiketler:
                  </span>
                  {allCustomTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => setSelectedNoteTag(tag)}
                      style={{
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-pill)',
                        fontSize: '10px',
                        fontWeight: '700',
                        border: selectedNoteTag === tag ? 'none' : '1px solid var(--border-color)',
                        background: selectedNoteTag === tag ? 'var(--accent-cyan)' : 'var(--bg-tertiary)',
                        color: selectedNoteTag === tag ? '#ffffff' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {tag === t.catAll ? (t.allTags) : `#${tag}`}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notes Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
              {filteredNotes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: '13px' }}>
                  {t.noNotesYet || 'Henüz kaydedilmiş not bulunmuyor.'}
                </div>
              ) : (
                filteredNotes.map(n => (
                  <div key={n.id} className="app-card" style={{ gap: '6px', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '10px', fontWeight: '800', padding: '2px 6px', borderRadius: '4px', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)', border: '1px solid var(--primary-glow)' }}>
                          {n.category}
                        </span>
                        <h4 style={{ fontSize: '14px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>{n.title}</h4>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <button
                          className="btn-icon"
                          style={{ color: 'var(--primary)', width: '26px', height: '26px' }}
                          onClick={() => downloadNoteAsJpeg(n)}
                          title={t.downloadNoteJpeg || 'Galeriye Kaydet (JPEG)'}
                        >
                          <Download size={12} />
                        </button>
                        <button className="btn-icon" style={{ color: 'var(--danger)', width: '26px', height: '26px' }} onClick={() => handleDeleteNote(n.id)}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', margin: 0, lineHeight: '1.4' }}>
                      {n.content}
                    </p>
                    {n.tags && n.tags.length > 0 && (
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '4px' }}>
                        {n.tags.map(t => (
                          <span key={t} style={{ fontSize: '9.5px', color: 'var(--accent-cyan)', background: 'rgba(14, 165, 233, 0.12)', padding: '1px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                    <div style={{ fontSize: '9.5px', color: 'var(--text-muted)', textAlign: 'right', marginTop: '4px' }}>
                      {new Date(n.createdAt).toLocaleDateString()} {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      }
      case 'dashboard': {
        const completedTodosCount = todos.filter(t => t.completed).length + archivedTodos.length;
        const totalTodosCount = todos.length + archivedTodos.length;
        const completedHabitsCount = habits.filter(h => h.completedToday).length;
        const totalHabitsCount = habits.length;

        const displayName = userName || (language === 'tr' ? 'Dostum' : 'Friend');
        let dynamicAiAdvice = '';
        if (totalTodosCount === 0 && totalHabitsCount === 0) {
          dynamicAiAdvice = `${displayName}, ${t.aiAdviceEmpty || 'henüz görev veya rutin eklenmedi.'}`;
        } else {
          dynamicAiAdvice = `${displayName}, ${t.aiAdviceProgress || 'bugün harika ilerleme!'}`;
        }

        return (
          <div className="screen-content" style={{ gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '800' }}>{t.analyticsTitle || '📊 AI Analiz & Rutinler'}</h3>
              <button
                className="btn-secondary"
                style={{ fontSize: '11px', padding: '6px 10px' }}
                onClick={() => {
                  sendNotification('Multitool AI', `${completedTodosCount}/${totalTodosCount} ${t.notifTasks} / ${completedHabitsCount}/${totalHabitsCount} ${t.notifRoutines}`);
                  alert(t.notificationSent || 'Analiz bildirimi gönderildi!');
                }}
              >
                🔔 {t.getReportBtn || 'Rapor Bildirimi Al'}
              </button>
            </div>

            {/* Today's Executive Summary Card */}
            <div className="app-card" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--primary-glow)', padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px', margin: 0, color: 'var(--primary)' }}>
                  <CalendarIcon size={16} /> 📌 {t.todaySummaryHeader || 'Bugünün Özeti'}
                </h4>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>
                  {new Date().toLocaleDateString(language === 'tr' ? 'tr-TR' : language === 'de' ? 'de-DE' : language === 'fr' ? 'fr-FR' : language === 'es' ? 'es-ES' : language === 'it' ? 'it-IT' : 'en-US', { day: 'numeric', month: 'long', weekday: 'long' })}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-card)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckSquare size={14} color="var(--success)" /> {t.taskStatusLabel || 'Görev Durumu:'}</span>
                  <span style={{ fontWeight: '700', color: 'var(--success)' }}>{completedTodosCount} / {totalTodosCount}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-card)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CalendarIcon size={14} color="var(--primary)" /> {t.todayScheduleLabel || 'Bugünkü Program:'}</span>
                  <span style={{ fontWeight: '700', color: 'var(--primary)' }}>{events.length}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-card)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Flame size={14} color="var(--accent-amber)" /> {t.dailyRoutinesLabel || 'Günlük Rutinler:'}</span>
                  <span style={{ fontWeight: '700', color: 'var(--accent-amber)' }}>{completedHabitsCount} / {totalHabitsCount}</span>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              <div className="app-card" style={{ textAlign: 'center', padding: '10px' }}>
                <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--success)' }}>{completedTodosCount}/{totalTodosCount}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{t.completedTasksGrid || 'Biten Görev'}</div>
              </div>
              <div className="app-card" style={{ textAlign: 'center', padding: '10px' }}>
                <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary)' }}>{events.length}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{t.eventsGrid || 'Etkinlik'}</div>
              </div>
              <div className="app-card" style={{ textAlign: 'center', padding: '10px' }}>
                <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--accent-amber)' }}>{completedHabitsCount}/{totalHabitsCount}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{t.routineGrid || 'Rutin'}</div>
              </div>
            </div>

            {/* Habits & Daily Routines */}
            <div className="app-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                  <Flame size={16} color="var(--accent-amber)" /> {t.dailyHabitsHeader || 'Günlük Alışkanlıklar & Rutinler'} ({habits.length})
                </h4>
                <button
                  className="btn-secondary"
                  style={{ fontSize: '10.5px', padding: '4px 8px' }}
                  onClick={() => {
                    const title = prompt(t.addRoutinePrompt || 'Yeni Alışkanlık / Rutin Adı:');
                    if (title && title.trim()) {
                      setHabits([...habits, { id: Date.now().toString(), title: title.trim(), streak: 1, completedToday: false }]);
                    }
                  }}
                >
                  + {t.addRoutineBtn || 'Rutin Ekle'}
                </button>
              </div>

              {habits.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '16px 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                  {t.noRoutinesYet || 'Henüz kayıtlı rutin yok.'}
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {habits.map((habit) => (
                    <div
                      key={habit.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        background: habit.completedToday ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-sm)',
                        border: habit.completedToday ? '1px solid var(--accent-emerald)' : '1px solid var(--border-color)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                          type="checkbox"
                          checked={habit.completedToday}
                          onChange={() => {
                            setHabits(habits.map(h => {
                              if (h.id === habit.id) {
                                const newStatus = !h.completedToday;
                                return {
                                  ...h,
                                  completedToday: newStatus,
                                  streak: newStatus ? h.streak + 1 : Math.max(0, h.streak - 1)
                                };
                              }
                              return h;
                            }));
                          }}
                          style={{ width: '18px', height: '18px', accentColor: 'var(--accent-emerald)', cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '12.5px', fontWeight: '600', textDecoration: habit.completedToday ? 'line-through' : 'none' }}>
                          {habit.title}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Flame size={13} /> {habit.streak} {t.streakDays}
                        </div>
                        <button
                          className="btn-icon"
                          style={{ color: 'var(--text-muted)', width: '24px', height: '24px' }}
                          title={t.archiveBtn}
                          onClick={() => archiveHabit(habit.id)}
                        >
                          <Archive size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {archivedHabits.length > 0 && (
                <div style={{ marginTop: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                  <button
                    className="btn-secondary"
                    style={{ fontSize: '11px', padding: '6px 10px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    onClick={() => setShowArchivedHabits(s => !s)}
                  >
                    <Archive size={13} /> {t.archivedRoutinesHeader} ({archivedHabits.length}) {showArchivedHabits ? '▲' : '▼'}
                  </button>
                  {showArchivedHabits && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                      {archivedHabits.map((h) => (
                        <div
                          key={h.id}
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '8px 10px', background: 'var(--bg-tertiary)',
                            borderRadius: 'var(--radius-xs)', border: '1px dashed var(--border-color)', opacity: 0.85
                          }}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0, flex: 1 }}>
                            <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {h.title}
                            </span>
                            <span style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>
                              🔥 {h.streak} {t.streakDays} · {new Date(h.archivedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <button
                              className="btn-icon"
                              style={{ color: 'var(--accent-emerald)', width: '24px', height: '24px' }}
                              title={t.restoreBtn}
                              onClick={() => restoreHabit(h.id)}
                            >
                              <RotateCcw size={12} />
                            </button>
                            <button
                              className="btn-icon"
                              style={{ color: 'var(--danger)', width: '24px', height: '24px' }}
                              title={t.deletePermBtn}
                              onClick={() => permanentlyDeleteHabit(h.id)}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* AI Recommendation Box */}
            <div className="app-card" style={{ background: 'var(--bg-tertiary)' }}>
              <h4 style={{ fontSize: '13px', fontWeight: '800', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                <Sparkles size={14} /> {t.aiProductivityHeader}
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: '1.5' }}>
                {dynamicAiAdvice}
              </p>
            </div>
          </div>
        );
      }
      case 'sandbox':
        return (
          <div className="screen-content" style={{ padding: '14px' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '800' }}>{t.sandboxTitle || '💻 Kod & Localhost Sandbox'}</h3>

            <div className="sandbox-tabs">
              <button
                className={`sandbox-tab ${sandboxTab === 'editor' ? 'active' : ''}`}
                onClick={() => setSandboxTab('editor')}
              >
                ✏️ {t.editorTab || 'Editör'}
              </button>
              <button
                className={`sandbox-tab ${sandboxTab === 'preview' ? 'active' : ''}`}
                onClick={() => setSandboxTab('preview')}
              >
                🌐 {t.previewTab || 'Canlı Önizleme'}
              </button>
              <button
                className={`sandbox-tab ${sandboxTab === 'files' ? 'active' : ''}`}
                onClick={() => {
                  setSandboxTab('files');
                  fetchSandboxFiles();
                }}
              >
                📂 {t.filesTab || 'Dosyalar'} ({sandboxFiles.length})
              </button>
            </div>

            {sandboxTab === 'preview' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                    🌐 {t.livePreviewTitle || 'Canlı Web Sandbox Önizlemesi'} ({currentFileName})
                  </span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      className="btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '11px' }}
                      onClick={() => {
                        const iframe = document.getElementById('sandbox-preview-iframe') as HTMLIFrameElement;
                        if (iframe) iframe.srcdoc = currentFileName.endsWith('.html') ? editorContent : `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>body{font-family:sans-serif;padding:20px;color:#0f172a;}</style></head><body><h3>${t.sandboxOutputTitle}</h3><pre style="background:#f1f5f9;padding:12px;border-radius:8px;">${editorContent.replace(/</g, '&lt;')}</pre><script>${editorContent}</script></body></html>`;
                      }}
                    >
                      <RefreshCw size={12} /> {t.refreshBtn || 'Yenile'}
                    </button>
                  </div>
                </div>
                <iframe
                  id="sandbox-preview-iframe"
                  title={t.sandboxPreviewTitle}
                  style={{
                    width: '100%',
                    height: '380px',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    background: '#ffffff'
                  }}
                  srcDoc={
                    currentFileName.endsWith('.html')
                      ? editorContent
                      : `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>body{font-family:sans-serif;padding:16px;color:#0f172a;}</style></head><body><h4 style="margin-bottom:8px;">${t.consolePreviewTitle}</h4><pre style="background:#f1f5f9;padding:12px;border-radius:8px;font-size:12px;overflow:auto;">${editorContent.replace(/</g, '&lt;')}</pre><script>try{ ${editorContent} }catch(e){ document.write('<pre style="color:red">'+e+'</pre>'); }</script></body></html>`
                  }
                />
              </div>
            ) : sandboxTab === 'files' ? (
              <div className="file-list-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{t.sandboxFolderLabel}</span>
                  <button className="btn-icon" onClick={fetchSandboxFiles}>
                    <RefreshCw size={12} />
                  </button>
                </div>
                {sandboxFiles.length === 0 ? (
                  <p style={{ textAlign: 'center', padding: '24px 0', fontSize: '13px', color: 'var(--text-muted)' }}>
                    {t.sandboxFolderEmpty}
                  </p>
                ) : (
                  sandboxFiles.map(file => (
                    <div key={file.name} className="file-item">
                      <div className="file-info" onClick={() => handleReadFile(file.name)}>
                        <FileCode size={16} color="var(--primary)" />
                        <div>
                          <div className="file-name">{file.name}</div>
                          <div className="file-size">{(file.size / 1024).toFixed(2)} KB • {new Date(file.updatedAt).toLocaleTimeString()}</div>
                        </div>
                      </div>
                      <button className="btn-icon" style={{ color: 'var(--danger)' }} onClick={() => handleDeleteFile(file.name)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
                <div className="app-card" style={{ gap: '8px', padding: '12px', marginTop: '12px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700' }}>{t.newFileOpen}</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="server.js"
                      value={currentFileName}
                      onChange={(e) => setCurrentFileName(e.target.value)}
                      style={{ flex: 1, padding: '6px 10px', fontSize: '12px' }}
                    />
                    <button
                      className="btn-primary"
                      onClick={() => {
                        setEditorContent(t.newFileContent);
                        setSandboxTab('editor');
                      }}
                      style={{ padding: '6px 14px', fontSize: '12px' }}
                    >
                      {t.openBtn}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="code-editor-container">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      className="form-input"
                      value={currentFileName}
                      onChange={(e) => setCurrentFileName(e.target.value)}
                      style={{ flex: '1 1 120px', minWidth: '100px', padding: '6px 10px', fontSize: '12px', fontWeight: '800' }}
                    />
                    <select
                      className="form-select"
                      style={{ flex: '1 1 140px', minWidth: '110px', padding: '6px 24px 6px 8px', fontSize: '11px' }}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (!val) return;
                        const templates: Record<string, string> = {
                          express: `const express = require('express');\nconst app = express();\nconst PORT = 3005;\n\napp.get('/api/test', (req, res) => {\n  res.json({ message: "Express Sunucusu Hazır!", time: new Date() });\n});\n\napp.listen(PORT, () => {\n  console.log(\`Sunucu http://localhost:\${PORT} adresinde çalışıyor\`);\n});`,
                          react: `function Counter() {\n  const [count, setCount] = React.useState(0);\n  return (\n    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>\n      <h2>Sayaç: {count}</h2>\n      <button onClick={() => setCount(count + 1)}>Artır</button>\n    </div>\n  );\n}`,
                          html: `<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="utf-8">\n  <title>Sandbox Sayfası</title>\n  <style>body { font-family: sans-serif; padding: 20px; background: #f8fafc; color: #0f172a; }</style>\n</head>\n<body>\n  <h2>Multitool Sandbox Sayfası</h2>\n  <p>Canlı önizleme hazır!</p>\n</body>\n</html>`
                        };
                        if (templates[val]) {
                          setEditorContent(templates[val]);
                          if (val === 'html') setCurrentFileName('index.html');
                          if (val === 'express') setCurrentFileName('server.js');
                        }
                        e.target.value = '';
                      }}
                    >
                      <option value="">{t.selectTemplate}</option>
                      <option value="express">{t.expressTemplate}</option>
                      <option value="react">{t.reactTemplate}</option>
                      <option value="html">{t.htmlTemplate}</option>
                    </select>
                    <button className="btn-icon" onClick={handleSaveFile} title={t.saveBtn} style={{ flexShrink: 0, width: '32px', height: '32px' }}>
                      <Layers size={15} />
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', margin: '4px 0' }}>
                    <button
                      className="btn-primary"
                      onClick={handleExecuteCode}
                      disabled={isRunningCode}
                      style={{ padding: '6px 8px', fontSize: '11px', whiteSpace: 'nowrap' }}
                    >
                      {isRunningCode ? <RefreshCw size={13} className="spin" /> : <Play size={13} />} {t.runBtn}
                    </button>
                    <button
                      className="btn-primary"
                      onClick={handleStartLocalhostServer}
                      style={{ padding: '6px 8px', fontSize: '11px', background: 'rgba(14, 165, 233, 0.2)', border: '1px solid var(--accent-cyan)', color: 'var(--accent-cyan)', whiteSpace: 'nowrap' }}
                    >
                      <Server size={13} /> {t.localhostServerBtn}
                    </button>
                    <button
                      className="btn-primary"
                      onClick={() => {
                        const blob = new Blob([editorContent], { type: 'text/html;charset=utf-8' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = currentFileName || 'multitool_project.html';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        alert(t.notificationSent);
                      }}
                      style={{ padding: '6px 8px', fontSize: '11px', background: 'rgba(217, 119, 6, 0.2)', border: '1px solid var(--accent-amber)', color: 'var(--accent-amber)', whiteSpace: 'nowrap' }}
                    >
                      <Download size={13} /> {t.exportHtmlBtn}
                    </button>
                    <button
                      className="btn-primary"
                      onClick={handleBuildApk}
                      disabled={isBuildingApk}
                      style={{ padding: '6px 8px', fontSize: '11px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid var(--accent-emerald)', color: 'var(--accent-emerald)', whiteSpace: 'nowrap' }}
                    >
                      {isBuildingApk ? <RefreshCw size={13} className="spin" /> : <Hammer size={13} />} {isBuildingApk ? t.buildingApk : t.buildApkBtn}
                    </button>
                  </div>
                </div>

                <textarea
                  className="editor-textarea"
                  value={editorContent}
                  onChange={(e) => setEditorContent(e.target.value)}
                />

                { }
                <div className="terminal-panel">
                  <div className="terminal-header">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Terminal size={13} /> {t.consoleTitle}
                    </span>
                    <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '11px' }} onClick={() => setTerminalOutput('')}>
                      {t.clearBtn}
                    </button>
                  </div>
                  <div className="terminal-output">{terminalOutput}</div>
                </div>
              </div>
            )}
          </div>
        );
      case 'settings':
        return (
          <div className="screen-content">
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '800' }}>{t.settingsTitle || '⚙️ Settings / Ayarlar'}</h3>

            {/* Language Selector Card */}
            <div className="app-card">
              <h4 style={{ fontSize: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                <Globe size={16} color="var(--primary)" /> {t.languageLabel || 'Language / Dil'}
              </h4>
              <div className="form-group" style={{ marginTop: '8px' }}>
                <select
                  className="form-select"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                >
                  <option value="tr">Türkçe 🇹🇷</option>
                  <option value="en">English 🇬🇧</option>
                  <option value="de">Deutsch 🇩🇪</option>
                  <option value="es">Español 🇪🇸</option>
                  <option value="fr">Français 🇫🇷</option>
                  <option value="it">Italiano 🇮🇹</option>
                </select>
              </div>
            </div>

            <div className="app-card">
              <h4 style={{ fontSize: '14px', fontWeight: '800' }}>{t.userProfileLabel || '👤 Kullanıcı Profili & Bildirimler'}</h4>
              <div className="form-group" style={{ marginBottom: '8px' }}>
                <label className="form-label">{t.yourNameLabel || 'Adınız (İsminiz)'}</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder={t.namePlaceholderExample}
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              <button
                className="btn-secondary"
                style={{ fontSize: '11.5px', padding: '8px 12px', width: '100%' }}
                onClick={() => {
                  const name = userName.trim() || 'Doruk';
                  sendNotification('Multitool AI 🤖', `${name} ✨`);
                  alert(t.notificationSent || 'Bildirim gönderildi!');
                }}
              >
                🔔 {t.testNotificationBtn || 'Test Bildirimi Gönder'}
              </button>
            </div>

            {/* Theme Selector Card */}
            <div className="app-card">
              <h4 style={{ fontSize: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                <Palette size={16} color="var(--primary)" /> {t.themeLabel}
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '10px' }}>
                {[
                  { id: 'dark', label: t.themeSlate, color: '#0f172a' },
                  { id: 'cyberpunk', label: t.themeCyberpunk, color: '#09090b' },
                  { id: 'emerald', label: t.themeEmerald, color: '#064e3b' },
                  { id: 'oled', label: t.themeOled, color: '#000000' },
                  { id: 'default', label: t.themeDefaultLight, color: '#ffffff' }
                ].map(th => (
                  <button
                    key={th.id}
                    className="btn-secondary"
                    style={{
                      padding: '10px',
                      fontSize: '11.5px',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      justifyContent: 'flex-start',
                      border: theme === th.id ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                      background: theme === th.id ? 'var(--primary-glow)' : 'var(--bg-secondary)'
                    }}
                    onClick={() => setTheme(th.id as any)}
                  >
                    <span style={{ width: '14px', height: '14px', borderRadius: '50%', background: th.color, border: '1px solid #666' }}></span>
                    {th.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="app-card">
              <h4 style={{ fontSize: '14px', fontWeight: '800' }}>{t.aiProviderSettingsLabel}</h4>
              <div className="form-group" style={{ marginBottom: '8px' }}>
                <label className="form-label">{t.providerSelectLabel}</label>
                <select
                  className="form-select"
                  value={provider}
                  onChange={(e) => setProvider(e.target.value as any)}
                >
                  <option value="groq">{t.groqLabel}</option>
                  <option value="deepseek">{t.deepseekLabel}</option>
                  <option value="openai">{t.openaiLabel}</option>
                  <option value="gemini">{t.geminiLabel}</option>
                  <option value="openrouter">{t.openrouterLabel}</option>
                  <option value="ollama">{t.ollamaLabel}</option>
                </select>
              </div>
              {isLoadingModels && (
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <RefreshCw size={11} className="spin" /> {t.loadingModels}.
                </div>
              )}

              {provider === 'ollama' && (
                <>
                  <div className="form-group">
                    <label className="form-label">{t.ollamaUrlLabel || 'Ollama Sunucu URL'}</label>
                    <input
                      type="text"
                      className="form-input"
                      value={ollamaUrl}
                      onChange={(e) => setOllamaUrl(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t.selectModelLabel}</label>
                    <select className="form-select" value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
                      <option value="" disabled>{t.selectModelPlaceholder}</option>
                      {models.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                    </select>
                  </div>
                </>
              )}

              {provider === 'groq' && (
                <>
                  <div className="form-group">
                    <label className="form-label">{t.apiKeyLabel || 'Groq API Anahtarı'}</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="gsk_..."
                      value={groqApiKey}
                      onChange={(e) => setGroqApiKey(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t.selectModelLabel || 'Model Seçimi'}</label>
                    <select className="form-select" value={groqModel} onChange={(e) => setGroqModel(e.target.value)}>
                      <option value="" disabled>{t.selectModelPlaceholder}</option>
                      {models.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                    </select>
                    <button type="button" className="btn-secondary" style={{ marginTop: '6px', fontSize: '11px', padding: '6px 10px', width: '100%' }} onClick={fetchModels}>
                      🔄 {isLoadingModels ? t.scanningModels : t.scanModels}
                    </button>
                  </div>
                </>
              )}

              {provider === 'deepseek' && (
                <>
                  <div className="form-group">
                    <label className="form-label">{t.apiKeyDeepseek || 'DeepSeek API Key'}</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="sk-..."
                      value={deepseekApiKey}
                      onChange={(e) => setDeepseekApiKey(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t.selectModelLabel || 'Model Seçimi'}</label>
                    <select className="form-select" value={deepseekModel} onChange={(e) => setDeepseekModel(e.target.value)}>
                      <option value="" disabled>{t.selectModelPlaceholder}</option>
                      {models.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                    </select>
                    <button type="button" className="btn-secondary" style={{ marginTop: '6px', fontSize: '11px', padding: '6px 10px', width: '100%' }} onClick={fetchModels}>
                      🔄 {isLoadingModels ? t.scanningModels : t.scanModels}
                    </button>
                  </div>
                </>
              )}

              {provider === 'openai' && (
                <>
                  <div className="form-group">
                    <label className="form-label">{t.apiKeyOpenAI || 'OpenAI API Key'}</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="sk-proj-..."
                      value={openaiApiKey}
                      onChange={(e) => setOpenaiApiKey(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t.selectModelLabel || 'Model Seçimi'}</label>
                    <select className="form-select" value={openaiModel} onChange={(e) => setOpenaiModel(e.target.value)}>
                      <option value="" disabled>{t.selectModelPlaceholder}</option>
                      {models.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                    </select>
                    <button type="button" className="btn-secondary" style={{ marginTop: '6px', fontSize: '11px', padding: '6px 10px', width: '100%' }} onClick={fetchModels}>
                      🔄 {isLoadingModels ? t.scanningModels : t.scanModels}
                    </button>
                  </div>
                </>
              )}

              {provider === 'gemini' && (
                <>
                  <div className="form-group">
                    <label className="form-label">{t.apiKeyGemini || 'Gemini API Key'}</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="AIzaSy..."
                      value={geminiApiKey}
                      onChange={(e) => setGeminiApiKey(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t.selectModelLabel || 'Model Seçimi'}</label>
                    <select className="form-select" value={geminiModel} onChange={(e) => setGeminiModel(e.target.value)}>
                      <option value="" disabled>{t.selectModelPlaceholder}</option>
                      {models.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                    </select>
                    <button type="button" className="btn-secondary" style={{ marginTop: '6px', fontSize: '11px', padding: '6px 10px', width: '100%' }} onClick={fetchModels}>
                      🔄 {isLoadingModels ? t.scanningModels : t.scanModels}
                    </button>
                  </div>
                </>
              )}

              {provider === 'openrouter' && (
                <>
                  <div className="form-group">
                    <label className="form-label">{t.apiKeyOpenRouter || 'OpenRouter API Key'}</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="sk-or-..."
                      value={openrouterApiKey}
                      onChange={(e) => setOpenrouterApiKey(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t.selectModelLabel || 'Model Seçimi'}</label>
                    <select className="form-select" value={openrouterModel} onChange={(e) => setOpenrouterModel(e.target.value)}>
                      <option value="" disabled>{t.selectModelPlaceholder}</option>
                      {models.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                    </select>
                    <button type="button" className="btn-secondary" style={{ marginTop: '6px', fontSize: '11px', padding: '6px 10px', width: '100%' }} onClick={fetchModels}>
                      🔄 {isLoadingModels ? t.scanningModels : t.scanModels}
                    </button>
                  </div>
                </>
              )}

              <div className="form-group" style={{ marginTop: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Cpu size={14} style={{ color: 'var(--accent)' }} /> {t.promptWeightLabel || 'Sistem Prompt Ağırlığı'}
                </label>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  {t.promptWeightHelp}
                </p>
                <select
                  className="form-select"
                  value={promptWeight}
                  onChange={(e) => setPromptWeight(e.target.value as any)}
                >
                  <option value="minimal">{t.promptWeightMinimal}</option>
                  <option value="balanced">{t.promptWeightBalanced}</option>
                  <option value="full">{t.promptWeightFull}</option>
                </select>
              </div>

              <div className="form-group" style={{ marginTop: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Volume2 size={14} style={{ color: 'var(--primary)' }} /> {t.autoTtsLabel || 'AI Yanıtlarını Seslendir (TTS)'}
                </label>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  {t.autoTtsHelp}
                </p>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                  <input
                    type="checkbox"
                    checked={autoTtsEnabled}
                    onChange={(e) => setAutoTtsEnabled(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                  />
                  <span>{autoTtsEnabled ? 'Açık (Otomatik Oku)' : 'Kapalı'}</span>
                </label>
              </div>

              <button className="btn-primary" onClick={fetchModels} style={{ marginTop: '10px' }}>
                <Check size={14} /> {t.saveAndTestBtn}
              </button>
            </div>

            <div className="app-card">
              <h4 style={{ fontSize: '14px', fontWeight: '800' }}>{t.aboutTitle}</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {t.aboutDesc}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: 'var(--radius-xs)', marginBottom: '10px' }}>
                <span>• {t.versionLabel}: <strong>v1.1.0</strong></span>
                <span>• {t.architectureLabel}: <strong>Self-Coding AI & Localhost Node.js</strong></span>
                <span>• {t.buildLabel}: <strong>Vite + Capacitor</strong></span>
                <span>• {t.databaseLabel}: <strong>LocalStorage & Express API</strong></span>
              </div>
              <button
                className="btn-secondary"
                style={{ width: '100%', padding: '10px', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                onClick={() => checkForUpdates(true)}
                disabled={isCheckingUpdate}
              >
                <RefreshCw size={14} className={isCheckingUpdate ? 'spin' : ''} />
                {isCheckingUpdate ? t.checkingUpdates : t.checkUpdatesBtn}
              </button>
            </div>

            { }
            <div className="app-card">
              <h4 style={{ fontSize: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Download size={16} color="var(--primary)" /> {t.backupTitle}
              </h4>
              <p style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                {t.backupDesc}
              </p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <button
                  className="btn-secondary"
                  onClick={handleExportBackup}
                  style={{ flex: 1, padding: '8px 12px', fontSize: '11.5px' }}
                >
                  <Download size={13} /> {t.exportBtn}
                </button>
                <label className="btn-secondary" style={{ flex: 1, padding: '8px 12px', fontSize: '11.5px', textAlign: 'center', cursor: 'pointer' }}>
                  <Upload size={13} /> {t.importBtn}
                  <input type="file" accept=".json" onChange={handleImportBackup} style={{ display: 'none' }} />
                </label>
              </div>
            </div>

            { }
            <div className="app-card">
              <h4 style={{ fontSize: '14px', fontWeight: '800' }}>{t.systemLogsTitle}</h4>
              <div style={{
                background: '#050508',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-xs)',
                padding: '10px',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: '#38bdf8',
                maxHeight: '130px',
                overflowY: 'auto'
              }}>
                {systemLogs.length === 0 ? t.noLogs : systemLogs.map((log, i) => (
                  <div key={i}>{log}</div>
                ))}
              </div>
            </div>
            { }
            <div className="app-card" style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px dashed var(--primary)' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '800', margin: 0, color: 'var(--primary)' }}>{t.setupWizardTitle}</h4>
              <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: '4px 0 8px 0' }}>
                {t.setupWizardDesc}
              </p>
              <button
                className="btn-secondary"
                style={{ width: '100%', padding: '8px 12px', fontSize: '11.5px' }}
                onClick={() => {
                  setSetupStep(1);
                  setIsSetupOpen(true);
                }}
              >
                {t.setupWizardRestartBtn}
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderSetupModal = () => {
    if (!isSetupOpen) return null;

    const t = (TRANSLATIONS as any)[language] || TRANSLATIONS.tr;
    const TOTAL_STEPS = 11;
    const STEP_LABELS = [
      t.setupStepIntro,
      t.setupStepPersonalize,
      t.feat1Title,
      t.feat2Title,
      t.feat3Title,
      t.feat4Title,
      t.setupStepProvider,
      t.setupStepPersona,
      t.setupStepAppearance,
      t.setupStepReview,
      t.setupStepDone
    ];
    const finishSetup = () => {
      localStorage.setItem('multitool_setup_completed', 'true');
      setIsSetupOpen(false);
    };
    const themeLabel = (id: string) => id === 'dark' ? t.themeSlate : id === 'cyberpunk' ? t.themeCyberpunk : id === 'emerald' ? t.themeEmerald : id === 'oled' ? t.themeOled : t.themeDefaultLight;
    const themeColor = (id: string) => id === 'dark' ? '#0f172a' : id === 'cyberpunk' ? '#09090b' : id === 'emerald' ? '#064e3b' : id === 'oled' ? '#000000' : '#ffffff';
    const providerLabel = (p: string) => p === 'groq' ? t.groqLabel : p === 'deepseek' ? t.deepseekLabel : p === 'openai' ? t.openaiLabel : p === 'gemini' ? t.geminiLabel : p === 'openrouter' ? t.openrouterLabel : t.ollamaLabel;
    const langName = (l: string) => l === 'tr' ? 'Türkçe' : l === 'en' ? 'English' : l === 'de' ? 'Deutsch' : l === 'es' ? 'Español' : l === 'fr' ? 'Français' : 'Italiano';

    return (
      <div className="setup-overlay">
        <div className="setup-progress-wrap">
          <div className="setup-progress-bar">
            <div className="setup-progress-fill" style={{ width: `${(setupStep / TOTAL_STEPS) * 100}%` }} />
          </div>
          <div className="setup-progress-meta">
            <span>{t.setupStepLabel.replace('{n}', String(setupStep)).replace('{total}', String(TOTAL_STEPS))}</span>
            <span className="step-name">{STEP_LABELS[setupStep - 1]}</span>
          </div>
        </div>

        {setupStep === 1 && (
          <div className="setup-slide" key="step-1" style={{ textAlign: 'center' }}>
            <div className="setup-intro-glow">
              <div className="setup-logo-bounce" style={{ width: '92px', height: '92px', borderRadius: '26px', background: '#ffffff', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-md)' }}>
                <img src="/logo.png" alt="Logo" style={{ width: '66px', height: '66px', objectFit: 'contain' }} />
              </div>
            </div>
            <div>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '30px', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '6px', letterSpacing: '-0.02em' }}>
                Multitool <span style={{ background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>AI</span>
              </h1>
              <p className="setup-tagline" style={{ fontSize: '14px', maxWidth: '380px', margin: '0 auto', lineHeight: '1.5' }}>
                {t.setupIntroTagline}
              </p>
            </div>
            <button className="btn-primary setup-gradient-btn" style={{ width: '100%', maxWidth: '320px', padding: '15px', fontSize: '16px', fontWeight: '800', borderRadius: '16px', marginTop: '6px' }} onClick={() => setSetupStep(2)}>
              {t.setupIntroCta}
            </button>
            <button className="setup-skip-link" onClick={finishSetup}>{t.setupSkip}</button>
          </div>
        )}

        {setupStep === 2 && (
          <div className="setup-slide" key="step-2">
            <div style={{ textAlign: 'center' }}>
              <div className="setup-icon-box" style={{ margin: '0 auto 8px auto', width: '50px', height: '50px' }}><User size={26} /></div>
              <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)' }}>{t.setupPersonalizeTitle}</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{t.setupPersonalizeSub}</p>
            </div>
            <div className="form-group" style={{ width: '100%', maxWidth: '300px' }}>
              <label className="form-label" style={{ fontSize: '11px' }}>{t.nameLabel}</label>
              <input type="text" className="form-input" placeholder={t.namePlaceholder} value={userName} onChange={(e) => setUserName(e.target.value)} style={{ textAlign: 'center', padding: '11px', fontWeight: '700', borderRadius: '12px' }} />
            </div>
            <div className="form-group" style={{ width: '100%', maxWidth: '300px' }}>
              <label className="form-label" style={{ fontSize: '11px' }}>🌐 {t.selectLang}</label>
              <select className="form-select" value={language} onChange={(e) => setLanguage(e.target.value as any)} style={{ textAlign: 'center', padding: '11px', fontWeight: '700', borderRadius: '12px' }}>
                <option value="tr">🇹🇷 Türkçe</option>
                <option value="en">🇬🇧 English</option>
                <option value="de">🇩🇪 Deutsch</option>
                <option value="es">🇪🇸 Español</option>
                <option value="fr">🇫🇷 Français</option>
                <option value="it">🇮🇹 Italiano</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '300px' }}>
              <button className="btn-secondary" style={{ flex: 1, padding: '12px' }} onClick={() => setSetupStep(1)}>{t.backBtn}</button>
              <button className="btn-primary" style={{ flex: 1, padding: '12px' }} onClick={() => setSetupStep(3)}>{t.nextBtn}</button>
            </div>
            <button className="setup-skip-link" onClick={finishSetup} style={{ marginTop: '8px' }}>{t.setupSkip}</button>
          </div>
        )}

        {/* Step 3: Feature 1 - Self-Coding & Localhost Sandbox */}
        {setupStep === 3 && (
          <div className="setup-slide" key="step-3">
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <div className="setup-icon-box" style={{ margin: '0 auto 8px auto', width: '56px', height: '56px', borderRadius: '18px' }}>
                <Hammer size={30} color="var(--primary)" />
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)' }}>{t.feat1Title}</h2>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '360px', margin: '4px auto 0 auto' }}>{t.feat1Desc}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '380px' }}>
              {[t.feat1Bullet1, t.feat1Bullet2, t.feat1Bullet3].map((b, i) => (
                <div key={i} className="setup-feature-card" style={{ padding: '10px 14px', borderRadius: '12px' }}>
                  <span style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--text-primary)' }}>{b}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '380px', marginTop: '6px' }}>
              <button className="btn-secondary" style={{ flex: 1, padding: '12px' }} onClick={() => setSetupStep(2)}>{t.backBtn}</button>
              <button className="btn-primary" style={{ flex: 1, padding: '12px' }} onClick={() => setSetupStep(4)}>{t.nextBtn}</button>
            </div>
            <button className="setup-skip-link" onClick={finishSetup} style={{ marginTop: '8px' }}>{t.setupSkip}</button>
          </div>
        )}

        {/* Step 4: Feature 2 - Multi-AI & Voice Assistant */}
        {setupStep === 4 && (
          <div className="setup-slide" key="step-4">
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <div className="setup-icon-box" style={{ margin: '0 auto 8px auto', width: '56px', height: '56px', borderRadius: '18px' }}>
                <Mic size={30} color="var(--accent-cyan)" />
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)' }}>{t.feat2Title}</h2>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '360px', margin: '4px auto 0 auto' }}>{t.feat2Desc}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '380px' }}>
              {[t.feat2Bullet1, t.feat2Bullet2, t.feat2Bullet3].map((b, i) => (
                <div key={i} className="setup-feature-card" style={{ padding: '10px 14px', borderRadius: '12px' }}>
                  <span style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--text-primary)' }}>{b}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '380px', marginTop: '6px' }}>
              <button className="btn-secondary" style={{ flex: 1, padding: '12px' }} onClick={() => setSetupStep(3)}>{t.backBtn}</button>
              <button className="btn-primary" style={{ flex: 1, padding: '12px' }} onClick={() => setSetupStep(5)}>{t.nextBtn}</button>
            </div>
            <button className="setup-skip-link" onClick={finishSetup} style={{ marginTop: '8px' }}>{t.setupSkip}</button>
          </div>
        )}

        {/* Step 5: Feature 3 - Smart Calendar & Gallery Export */}
        {setupStep === 5 && (
          <div className="setup-slide" key="step-5">
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <div className="setup-icon-box" style={{ margin: '0 auto 8px auto', width: '56px', height: '56px', borderRadius: '18px' }}>
                <CalendarIcon size={30} color="var(--accent-amber)" />
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)' }}>{t.feat3Title}</h2>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '360px', margin: '4px auto 0 auto' }}>{t.feat3Desc}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '380px' }}>
              {[t.feat3Bullet1, t.feat3Bullet2, t.feat3Bullet3].map((b, i) => (
                <div key={i} className="setup-feature-card" style={{ padding: '10px 14px', borderRadius: '12px' }}>
                  <span style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--text-primary)' }}>{b}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '380px', marginTop: '6px' }}>
              <button className="btn-secondary" style={{ flex: 1, padding: '12px' }} onClick={() => setSetupStep(4)}>{t.backBtn}</button>
              <button className="btn-primary" style={{ flex: 1, padding: '12px' }} onClick={() => setSetupStep(6)}>{t.nextBtn}</button>
            </div>
            <button className="setup-skip-link" onClick={finishSetup} style={{ marginTop: '8px' }}>{t.setupSkip}</button>
          </div>
        )}

        {/* Step 6: Feature 4 - Todos, Notes & Analytics */}
        {setupStep === 6 && (
          <div className="setup-slide" key="step-6">
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <div className="setup-icon-box" style={{ margin: '0 auto 8px auto', width: '56px', height: '56px', borderRadius: '18px' }}>
                <FileText size={30} color="var(--accent-rose)" />
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)' }}>{t.feat4Title}</h2>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '360px', margin: '4px auto 0 auto' }}>{t.feat4Desc}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '380px' }}>
              {[t.feat4Bullet1, t.feat4Bullet2, t.feat4Bullet3].map((b, i) => (
                <div key={i} className="setup-feature-card" style={{ padding: '10px 14px', borderRadius: '12px' }}>
                  <span style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--text-primary)' }}>{b}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '380px', marginTop: '6px' }}>
              <button className="btn-secondary" style={{ flex: 1, padding: '12px' }} onClick={() => setSetupStep(5)}>{t.backBtn}</button>
              <button className="btn-primary" style={{ flex: 1, padding: '12px' }} onClick={() => setSetupStep(7)}>{t.nextBtn}</button>
            </div>
            <button className="setup-skip-link" onClick={finishSetup} style={{ marginTop: '8px' }}>{t.setupSkip}</button>
          </div>
        )}

        {/* Step 7: AI Provider */}
        {setupStep === 7 && (
          <div className="setup-slide" key="step-7">
            <div style={{ textAlign: 'center' }}>
              <div className="setup-icon-box" style={{ margin: '0 auto 8px auto', width: '50px', height: '50px' }}>
                <Cpu size={26} />
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {t.aiProviderTitle}
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                {t.aiProviderSub}
              </p>
            </div>

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">{t.selectProvider}</label>
                <select
                  className="form-select"
                  value={provider}
                  onChange={(e) => setProvider(e.target.value as any)}
                >
                  <option value="groq">{t.groqLabel || 'Groq Cloud'}</option>
                  <option value="deepseek">{t.deepseekLabel || 'DeepSeek API'}</option>
                  <option value="openai">{t.openaiLabel || 'OpenAI (GPT-4o)'}</option>
                  <option value="gemini">{t.geminiLabel || 'Google Gemini API'}</option>
                  <option value="openrouter">{t.openrouterLabel || 'OpenRouter API'}</option>
                  <option value="ollama">{t.ollamaLabel || 'Ollama (Yerel Sunucu)'}</option>
                </select>
              </div>

              {provider === 'groq' && (
                <>
                  <div className="form-group">
                    <label className="form-label">{t.apiKeyLabel || 'Groq API Key'}</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="gsk_..."
                      value={groqApiKey}
                      onChange={(e) => setGroqApiKey(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t.selectModelLabel || 'Model Seçimi'}</label>
                    <select className="form-select" value={groqModel} onChange={(e) => setGroqModel(e.target.value)}>
                      <option value="" disabled>{t.selectModelPlaceholder}</option>
                      {models.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                    </select>
                    <button type="button" className="btn-secondary" style={{ marginTop: '6px', fontSize: '11px', padding: '6px 10px', width: '100%' }} onClick={fetchModels}>
                      🔄 {isLoadingModels ? t.scanningModels : t.scanModels}
                    </button>
                  </div>
                </>
              )}

              {provider === 'deepseek' && (
                <>
                  <div className="form-group">
                    <label className="form-label">{t.apiKeyDeepseek || 'DeepSeek API Key'}</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="sk-..."
                      value={deepseekApiKey}
                      onChange={(e) => setDeepseekApiKey(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t.selectModelLabel || 'Model Seçimi'}</label>
                    <select className="form-select" value={deepseekModel} onChange={(e) => setDeepseekModel(e.target.value)}>
                      <option value="" disabled>{t.selectModelPlaceholder}</option>
                      {models.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                    </select>
                    <button type="button" className="btn-secondary" style={{ marginTop: '6px', fontSize: '11px', padding: '6px 10px', width: '100%' }} onClick={fetchModels}>
                      🔄 {isLoadingModels ? t.scanningModels : t.scanModels}
                    </button>
                  </div>
                </>
              )}

              {provider === 'openai' && (
                <>
                  <div className="form-group">
                    <label className="form-label">{t.apiKeyOpenAI || 'OpenAI API Key'}</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="sk-..."
                      value={openaiApiKey}
                      onChange={(e) => setOpenaiApiKey(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t.selectModelLabel || 'Model Seçimi'}</label>
                    <select className="form-select" value={openaiModel} onChange={(e) => setOpenaiModel(e.target.value)}>
                      <option value="" disabled>{t.selectModelPlaceholder}</option>
                      {models.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                    </select>
                    <button type="button" className="btn-secondary" style={{ marginTop: '6px', fontSize: '11px', padding: '6px 10px', width: '100%' }} onClick={fetchModels}>
                      🔄 {isLoadingModels ? t.scanningModels : t.scanModels}
                    </button>
                  </div>
                </>
              )}

              {provider === 'gemini' && (
                <>
                  <div className="form-group">
                    <label className="form-label">{t.apiKeyGemini || 'Google Gemini API Key'}</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="AIzaSy..."
                      value={geminiApiKey}
                      onChange={(e) => setGeminiApiKey(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t.selectModelLabel || 'Model Seçimi'}</label>
                    <select className="form-select" value={geminiModel} onChange={(e) => setGeminiModel(e.target.value)}>
                      <option value="" disabled>{t.selectModelPlaceholder}</option>
                      {models.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                    </select>
                    <button type="button" className="btn-secondary" style={{ marginTop: '6px', fontSize: '11px', padding: '6px 10px', width: '100%' }} onClick={fetchModels}>
                      🔄 {isLoadingModels ? t.scanningModels : t.scanModels}
                    </button>
                  </div>
                </>
              )}

              {provider === 'openrouter' && (
                <>
                  <div className="form-group">
                    <label className="form-label">{t.apiKeyOpenRouter || 'OpenRouter API Key'}</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="sk-or-v1-..."
                      value={openrouterApiKey}
                      onChange={(e) => setOpenrouterApiKey(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t.selectModelLabel || 'Model Seçimi'}</label>
                    <select className="form-select" value={openrouterModel} onChange={(e) => setOpenrouterModel(e.target.value)}>
                      <option value="" disabled>{t.selectModelPlaceholder}</option>
                      {models.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                    </select>
                    <button type="button" className="btn-secondary" style={{ marginTop: '6px', fontSize: '11px', padding: '6px 10px', width: '100%' }} onClick={fetchModels}>
                      🔄 {isLoadingModels ? t.scanningModels : t.scanModels}
                    </button>
                  </div>
                </>
              )}

              {provider === 'ollama' && (
                <div className="form-group">
                  <label className="form-label">{t.ollamaEndpointLabel || 'Ollama Sunucu Adresi'}</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="http://localhost:11434"
                    value={ollamaUrl}
                    onChange={(e) => setOllamaUrl(e.target.value)}
                  />
                </div>
              )}

              <div className="form-group" style={{ marginTop: '8px' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Cpu size={14} style={{ color: 'var(--accent)' }} /> {t.promptWeightLabel || 'Sistem Prompt Ağırlığı'}
                </label>
                <select
                  className="form-select"
                  value={promptWeight}
                  onChange={(e) => setPromptWeight(e.target.value as any)}
                >
                  <option value="minimal">{t.promptWeightMinimal}</option>
                  <option value="balanced">{t.promptWeightBalanced}</option>
                  <option value="full">{t.promptWeightFull}</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', width: '100%', marginTop: '10px' }}>
              <button
                className="btn-secondary"
                style={{ flex: 1, padding: '12px' }}
                onClick={() => setSetupStep(6)}
              >
                {t.backBtn}
              </button>
              <button
                className="btn-primary"
                style={{ flex: 1, padding: '12px' }}
                onClick={() => setSetupStep(8)}
              >
                {t.nextBtn}
              </button>
            </div>
            <button className="setup-skip-link" onClick={finishSetup} style={{ marginTop: '8px' }}>{t.setupSkip}</button>
          </div>
        )}

        {/* Step 8: Persona */}
        {setupStep === 8 && (
          <div className="setup-slide" key="step-8">
            <div style={{ textAlign: 'center' }}>
              <div className="setup-icon-box" style={{ margin: '0 auto 8px auto', width: '50px', height: '50px' }}><Sparkles size={26} /></div>
              <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)' }}>{t.personaTitle}</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{t.personaSub}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxHeight: '220px', overflowY: 'auto', paddingRight: '4px' }}>
              {(Object.keys(PERSONAS) as Array<keyof typeof PERSONAS>).map((pKey) => (
                <button
                  key={pKey}
                  type="button"
                  style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: agentPersona === pKey ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    background: agentPersona === pKey ? 'var(--bg-card-hover)' : 'var(--bg-card)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                  onClick={() => setAgentPersona(pKey)}
                >
                  <span style={{ fontWeight: '800', fontSize: '13.5px', color: 'var(--text-primary)' }}>{PERSONAS[pKey].name}</span>
                  <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', lineHeight: '1.3' }}>{PERSONAS[pKey].desc}</span>
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px', width: '100%', marginTop: '12px' }}>
              <button
                className="btn-secondary"
                style={{ flex: 1, padding: '12px' }}
                onClick={() => setSetupStep(7)}
              >
                {t.backBtn}
              </button>
              <button
                className="btn-primary"
                style={{ flex: 1, padding: '12px' }}
                onClick={() => setSetupStep(9)}
              >
                {t.nextBtn}
              </button>
            </div>
            <button className="setup-skip-link" onClick={finishSetup} style={{ marginTop: '8px' }}>{t.setupSkip}</button>
          </div>
        )}

        {/* Step 9: Appearance */}
        {setupStep === 9 && (
          <div className="setup-slide" key="step-9">
            <div style={{ textAlign: 'center' }}>
              <div className="setup-icon-box" style={{ margin: '0 auto 8px auto', width: '50px', height: '50px' }}><Palette size={26} /></div>
              <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)' }}>{t.appearanceTitle}</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{t.appearanceSub}</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', width: '100%' }}>
              {['dark', 'cyberpunk', 'emerald', 'oled', 'default'].map((id) => (
                <button key={id} type="button" className="setup-theme-tile" style={{ border: `2px solid ${theme === id ? 'var(--primary)' : 'var(--border-color)'}`, background: theme === id ? 'rgba(37, 99, 235, 0.08)' : 'var(--bg-secondary)' }} onClick={() => setTheme(id as any)}>
                  <span className="setup-theme-swatch" style={{ background: themeColor(id) }} />
                  {themeLabel(id)}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
              <button className="btn-secondary" style={{ flex: 1, padding: '12px' }} onClick={() => setSetupStep(8)}>{t.backBtn}</button>
              <button className="btn-primary" style={{ flex: 1, padding: '12px' }} onClick={() => setSetupStep(10)}>{t.nextBtn}</button>
            </div>
            <button className="setup-skip-link" onClick={finishSetup} style={{ marginTop: '8px' }}>{t.setupSkip}</button>
          </div>
        )}

        {/* Step 10: Review */}
        {setupStep === 10 && (
          <div className="setup-slide" key="step-10">
            <div style={{ textAlign: 'center' }}>
              <div className="setup-icon-box" style={{ margin: '0 auto 8px auto', width: '50px', height: '50px' }}><CheckCircle2 size={26} /></div>
              <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)' }}>{t.reviewTitle}</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{t.reviewSub}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
              <div className="setup-review-row"><span className="label"><User size={14} /> {t.reviewNameLbl}</span><span className="value">{userName || '-'}</span></div>
              <div className="setup-review-row"><span className="label"><Globe size={14} /> {t.reviewLangLbl}</span><span className="value">{langName(language)}</span></div>
              <div className="setup-review-row"><span className="label"><Cpu size={14} /> {t.reviewProviderLbl}</span><span className="value">{providerLabel(provider)}</span></div>
              <div className="setup-review-row"><span className="label"><Sparkles size={14} /> {t.reviewPersonaLbl}</span><span className="value">{PERSONAS[agentPersona].name}</span></div>
              <div className="setup-review-row"><span className="label"><Palette size={14} /> {t.reviewThemeLbl}</span><span className="value">{themeLabel(theme)}</span></div>
            </div>
            <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
              <button className="btn-secondary" style={{ flex: 1, padding: '12px' }} onClick={() => setSetupStep(9)}>{t.backBtn}</button>
              <button className="btn-primary setup-gradient-btn" style={{ flex: 1, padding: '12px' }} onClick={() => setSetupStep(11)}>{t.reviewLooksGood}</button>
            </div>
            <button className="setup-skip-link" onClick={finishSetup} style={{ marginTop: '8px' }}>{t.setupSkip}</button>
          </div>
        )}

        {/* Step 11: Complete */}
        {setupStep === 11 && (
          <div className="setup-slide" key="step-11" style={{ textAlign: 'center', position: 'relative' }}>
            {[...Array(12)].map((_, i) => (
              <span key={i} className="setup-confetti" style={{ left: `${8 + i * 7}%`, background: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#22c55e'][i % 5], ['--cx' as any]: `${(i % 2 === 0 ? -1 : 1) * (18 + (i * 3))}px` }} />
            ))}
            <div className="setup-success-ring"><PartyPopper size={40} /></div>
            <h2 style={{ fontSize: '26px', fontWeight: '900', color: 'var(--text-primary)' }}>
              {t.completeTitle}
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '380px', lineHeight: '1.6' }}>
              {t.completeDesc}
            </p>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: '700', marginTop: '4px' }}>
              {t.versionFullLabel}
            </div>
            <button
              className="btn-primary setup-gradient-btn"
              style={{
                width: '100%',
                maxWidth: '320px',
                padding: '16px',
                fontSize: '16px',
                fontWeight: '800',
                borderRadius: '16px',
                marginTop: '14px'
              }}
              onClick={finishSetup}
            >
              <Rocket size={18} style={{ verticalAlign: '-3px', marginRight: '6px' }} />{t.startAppBtn}
            </button>
          </div>
        )}

        <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginTop: 'auto' }}>
          {t.versionFooterLabel}
        </div>
      </div>
    );
  };

  const renderChatHistoryModal = () => {
    if (!isChatHistoryModalOpen) return null;
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(5px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}
        onClick={() => setIsChatHistoryModalOpen(false)}
      >
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            width: '100%',
            maxWidth: '440px',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'var(--shadow-xl)',
            overflow: 'hidden'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
              <History size={18} color="var(--primary)" /> {t.chatHistoryModalTitle || 'Sohbet Geçmişi Kayıtları'}
            </h3>
            <button
              onClick={() => setIsChatHistoryModalOpen(false)}
              style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              ✕
            </button>
          </div>

          {/* New Chat Action Button */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-tertiary)' }}>
            <button
              onClick={() => {
                handleCreateNewChat();
                setIsChatHistoryModalOpen(false);
              }}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', gap: '6px' }}
            >
              <MessageCirclePlus size={16} /> {t.startNewChatBtn || 'Yeni Sohbet Başlat'}
            </button>
          </div>

          {/* Chat Sessions List */}
          <div style={{ padding: '12px 16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
            {chatSessions.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px 0', fontSize: '13px' }}>
                {t.noSavedChats || 'Kayıtlı sohbet bulunmuyor.'}
              </div>
            ) : (
              chatSessions.map(session => (
                <div
                  key={session.id}
                  onClick={() => {
                    setActiveChatId(session.id);
                    setIsChatHistoryModalOpen(false);
                  }}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    border: session.id === activeChatId ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    background: session.id === activeChatId ? 'rgba(99, 102, 241, 0.08)' : 'var(--bg-card)',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0, paddingRight: '8px' }}>
                    <div style={{ fontWeight: '800', fontSize: '13.5px', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {session.title}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>💬 {session.messages.length} {t.messagesCount}</span>
                      <span>•</span>
                      <span>📅 {new Date(session.createdAt || Date.now()).toLocaleDateString(language === 'tr' ? 'tr-TR' : language === 'de' ? 'de-DE' : language === 'fr' ? 'fr-FR' : language === 'es' ? 'es-ES' : language === 'it' ? 'it-IT' : 'en-US')}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {chatSessions.length > 1 && (
                      <button
                        onClick={(e) => handleDeleteChatSession(session.id, e)}
                        style={{
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: 'none',
                          color: 'var(--danger)',
                          cursor: 'pointer',
                          padding: '6px',
                          borderRadius: 'var(--radius-xs)',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                        title={t.deleteChat}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderUpdateModal = () => {
    if (!availableUpdate) return null;
    return (
      <div className="modal-overlay" style={{ zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', padding: '20px' }}>
        <div className="modal-content" style={{ background: 'var(--bg-card)', border: '1px solid var(--primary)', borderRadius: '24px', padding: '24px', maxWidth: '420px', width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--primary-glow)', border: '1px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
              <Rocket size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                {t.updateAvailableTitle || '🚀 Yeni Güncelleme Mevcut!'}
              </h3>
              <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '700', marginTop: '2px' }}>
                {availableUpdate.latestVersion}
              </div>
            </div>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
            {(t.updateAvailableSub || 'Multitool AI {version} sürümü yayınlandı. Şimdi indirip kurabilirsiniz.').replace('{version}', availableUpdate.latestVersion)}
          </p>

          {availableUpdate.releaseNotes && (
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '12px', maxHeight: '140px', overflowY: 'auto', fontSize: '11.5px', color: 'var(--text-muted)' }}>
              <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                {t.releaseNotesLabel || 'Yayın Notları:'}
              </strong>
              <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: 0 }}>
                {availableUpdate.releaseNotes}
              </pre>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
            <button
              className="btn-primary setup-gradient-btn"
              style={{ width: '100%', padding: '14px', fontSize: '14.5px', fontWeight: '800', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
              onClick={() => handleDownloadUpdate(availableUpdate.downloadUrl)}
            >
              <Download size={18} />
              {t.btnDownloadUpdate || '⚡ Güncellemeyi İndir ve Kur'}
            </button>
            <button
              className="btn-secondary"
              style={{ width: '100%', padding: '10px', fontSize: '12.5px', borderRadius: '12px', cursor: 'pointer' }}
              onClick={() => setAvailableUpdate(null)}
            >
              {t.btnDismissUpdate || 'Daha Sonra'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const appContent = (
    <>
      {renderSetupModal()}
      {renderChatHistoryModal()}
      {renderUpdateModal()}
      { }
      {usePhoneFrame && (
        <div className="phone-status-bar">
          <span className="status-time">{currentTime}</span>
          <span style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '800' }}>
            <Sparkles size={11} color="var(--primary)" /> Multitool AI
          </span>
          <div className="icons">
            <span style={{ fontSize: '10px' }}>5G</span>
            <span style={{ fontSize: '10px', fontWeight: '700' }}>%{batteryLevel}{isCharging ? '⚡' : ''}</span>
            <div className="battery-icon">
              <div
                className="battery-fill"
                style={{
                  width: `${batteryLevel}%`,
                  backgroundColor: batteryLevel <= 20 ? 'var(--danger)' : 'var(--success)'
                }}
              ></div>
            </div>
          </div>
        </div>
      )}

      { }
      <div className="app-header">
        <div className="app-title-container">
          <div className="app-logo" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/logo.png" alt="Logo" style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
          </div>
          <span className="app-title">Multitool Agent</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <a
            href="http://localhost:3001/download/multitool.apk"
            download="multitool.apk"
            className="btn-primary"
            style={{
              padding: '4px 10px',
              fontSize: '11px',
              textDecoration: 'none',
              background: 'var(--primary-gradient)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              borderRadius: 'var(--radius-xs)',
              fontWeight: '700',
              whiteSpace: 'nowrap'
            }}
            title={t.downloadApkTitle}
          >
            <Download size={13} /> {t.downloadApkBtn}
          </a>
          <button
            className="btn-icon"
            onClick={() => setActiveTab('settings')}
            style={{ color: activeTab === 'settings' ? 'var(--primary)' : 'var(--text-secondary)' }}
          >
            <SettingsIcon size={18} />
          </button>
        </div>
      </div>

      { }
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {renderActiveScreen()}
      </div>

      { }
      <div className="phone-bottom-nav">
        <button
          className={`nav-tab-item ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          <MessageSquare size={20} />
          <span>{t.tabChat}</span>
        </button>
        <button
          className={`nav-tab-item ${activeTab === 'notes' ? 'active' : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          <StickyNote size={20} />
          <span>{t.notes || 'Notlar'}</span>
        </button>
        <button
          className={`nav-tab-item ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          <CalendarIcon size={20} />
          <span>{t.tabCalendar}</span>
        </button>
        <button
          className={`nav-tab-item ${activeTab === 'todos' ? 'active' : ''}`}
          onClick={() => setActiveTab('todos')}
        >
          <CheckSquare size={20} />
          <span>{t.tabTodos}</span>
        </button>
        <button
          className={`nav-tab-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <BarChart2 size={20} />
          <span>{t.tabAnalytics}</span>
        </button>
        <button
          className={`nav-tab-item ${activeTab === 'sandbox' ? 'active' : ''}`}
          onClick={() => setActiveTab('sandbox')}
        >
          <CodeIcon size={20} />
          <span>Sandbox</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="app-container">
      <div className="fullscreen-mobile-view">
        {appContent}
      </div>
    </div>
  );
}
