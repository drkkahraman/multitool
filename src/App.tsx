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
  Upload
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

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  description?: string;
}

interface TodoItem {
  id: string;
  task: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  completed: boolean;
  completedAt?: number;
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
    welcomeDesc: "Your intelligent personal assistant, on-device code execution sandbox, and calendar organizer.",
    discoverFeatures: "Select Language & Start 🚀",
    exploreBtn: "Explore Features & Begin 🚀",
    featuresTitle: "What Can You Do? ⚡",
    featuresSub: "Core capabilities of the Multitool platform:",
    feat1Title: "🛠️ Self-Coding & Live Web Sandbox",
    feat1Desc: "Generate code with AI, launch Express servers, and test instantly in live web previews.",
    feat2Title: "🎙️ Voice Assistant & Dictation (TTS / STT)",
    feat2Desc: "Listen to assistant responses out loud or speak to type your messages hands-free.",
    feat3Title: "📅 Smart Agenda & Device Notifications",
    feat3Desc: "Manage events and receive local device push notifications for upcoming deadlines.",
    feat4Title: "📸 Vision & Document Summarizer",
    feat4Desc: "Upload PDF/TXT documents or image captures for instant AI analysis.",
    aiProviderTitle: "AI Provider Setup 🔑",
    aiProviderSub: "Configure your AI model backend. Groq Cloud offers ultra-fast free responses.",
    selectLang: "App Language",
    selectProvider: "AI Provider",
    groqLabel: "Groq Cloud (High Speed Cloud)",
    ollamaLabel: "Ollama (Local Server)",
    apiKeyLabel: "Groq API Key (Optional)",
    personaTitle: "Choose Assistant Persona 🎭",
    personaSub: "Select your assistant's primary focus domain:",
    completeTitle: "All Set! 🎉",
    completeDesc: "Multitool AI Agent is fully configured and ready for your commands.",
    startAppBtn: "Start Using Multitool ✨",
    nextBtn: "Next",
    backBtn: "Back",
    setupRestart: "Restart Setup Wizard (Setup UI)"
  },
  tr: {
    welcomeTitle: "Multitool AI'a Hoş Geldiniz",
    welcomeDesc: "Kendi kodunu yazıp derleyen, sesli yanıt veren ve ajandanızı yöneten akıllı mobil asistanınız.",
    discoverFeatures: "Dil Seçin & Başlayın 🚀",
    exploreBtn: "Yetenekleri Keşfet & Başla 🚀",
    featuresTitle: "Neler Yapabilirsiniz? ⚡",
    featuresSub: "Multitool platformunun sunduğu temel yetenekler:",
    feat1Title: "🛠️ Self-Coding & Canlı Web Sandbox",
    feat1Desc: "AI ile kod yazın, Express sunucusu başlatın ve web ortamında anında test edin.",
    feat2Title: "🎙️ Sesli Yanıt & Dikte (TTS / STT)",
    feat2Desc: "Asistanın mesajlarını Türkçe sesli dinleyin veya konuşarak mesaj yazdırın.",
    feat3Title: "📅 Akıllı Ajanda & Cihaz Bildirimleri",
    feat3Desc: "Etkinliklerinizi yönetin, AI yerel cihazınıza anlık bildirim düşürsün.",
    feat4Title: "📸 Görsel & Doküman Özetleyici",
    feat4Desc: "PDF, TXT dosyalarını veya fotoğrafları yükleyip AI ile anında analiz edin.",
    aiProviderTitle: "AI Sağlayıcısı Seçin 🔑",
    aiProviderSub: "Yapay zeka motorunuzu yapılandırın. Groq Cloud yüksek hızlı yanıtlar verir.",
    selectLang: "Uygulama Dili",
    selectProvider: "Sağlayıcı Seçin",
    groqLabel: "Groq Cloud (Bulut - Yüksek Hız)",
    ollamaLabel: "Ollama (Yerel Sunucu)",
    apiKeyLabel: "Groq API Key (İsteğe Bağlı)",
    personaTitle: "Asistan Kişiliğinizi Seçin 🎭",
    personaSub: "Asistanın varsayılan odak alanını belirleyin:",
    completeTitle: "Her Şey Hazır! 🎉",
    completeDesc: "Multitool AI Agent tamamen yapılandırıldı. Artık kullanmaya başlayabilirsiniz.",
    startAppBtn: "Uygulamayı Kullanmaya Başla ✨",
    nextBtn: "İleri",
    backBtn: "Geri",
    setupRestart: "Kurulum Sihirbazını (Setup UI) Yeniden Başlat"
  },
  de: {
    welcomeTitle: "Willkommen bei Multitool AI",
    welcomeDesc: "Ihr intelligenter persönlicher Assistent, Sandbox zur Codeausführung auf dem Gerät und Kalenderorganisator.",
    discoverFeatures: "Sprache wählen & Starten 🚀",
    exploreBtn: "Funktionen erkunden & Starten 🚀",
    featuresTitle: "Was können Sie tun? ⚡",
    featuresSub: "Kernfunktionen der Multitool-Plattform:",
    feat1Title: "🛠️ Self-Coding & Live-Web-Sandbox",
    feat1Desc: "Generieren Sie Code mit KI, starten Sie Express-Server und testen Sie sofort in Web-Vorschauen.",
    feat2Title: "🎙️ Sprachassistent & Diktat (TTS / STT)",
    feat2Desc: "Hören Sie sich Antworten an oder sprechen Sie, um Freihand-Nachrichten einzugeben.",
    feat3Title: "📅 Smarter Kalender & Benachrichtigungen",
    feat3Desc: "Verwalten Sie Termine und erhalten Sie lokale Push-Benachrichtigungen.",
    feat4Title: "📸 Bild- & Dokumenten-Analyse",
    feat4Desc: "Laden Sie PDF/TXT-Dokumente oder Bilder für die KI-Analyse hoch.",
    aiProviderTitle: "KI-Anbieter Einrichtung 🔑",
    aiProviderSub: "Konfigurieren Sie Ihren KI-Anbieter. Groq Cloud bietet schnelle kostenlose Antworten.",
    selectLang: "App-Sprache",
    selectProvider: "Anbieter auswählen",
    groqLabel: "Groq Cloud (Hochgeschwindigkeit)",
    ollamaLabel: "Ollama (Lokaler Server)",
    apiKeyLabel: "Groq API-Schlüssel (Optional)",
    personaTitle: "Assistenten-Persona wählen 🎭",
    personaSub: "Wählen Sie den primären Fokus Ihres Assistenten:",
    completeTitle: "Alles bereit! 🎉",
    completeDesc: "Multitool AI Agent ist vollständig konfiguriert.",
    startAppBtn: "Multitool starten ✨",
    nextBtn: "Weiter",
    backBtn: "Zurück",
    setupRestart: "Setup-Assistenten neustarten"
  },
  es: {
    welcomeTitle: "Bienvenido a Multitool AI",
    welcomeDesc: "Tu asistente personal inteligente, entorno de ejecución de código en dispositivo y organizador de calendario.",
    discoverFeatures: "Seleccionar idioma y comenzar 🚀",
    exploreBtn: "Explorar funciones y comenzar 🚀",
    featuresTitle: "¿Qué puedes hacer? ⚡",
    featuresSub: "Capacidades principales de la plataforma Multitool:",
    feat1Title: "🛠️ Auto-código y Sandbox web en vivo",
    feat1Desc: "Genera código con IA, inicia servidores Express y prueba al instante en vistas previas web.",
    feat2Title: "🎙️ Asistente de voz y dictado (TTS / STT)",
    feat2Desc: "Escucha respuestas en voz alta o habla para escribir mensajes sin manos.",
    feat3Title: "📅 Agenda inteligente y notificaciones",
    feat3Desc: "Gestiona eventos y recibe notificaciones locales push para fechas límite.",
    feat4Title: "📸 Resumidor de visión y documentos",
    feat4Desc: "Sube documentos PDF/TXT o fotos para análisis de IA instantáneo.",
    aiProviderTitle: "Configuración de proveedor de IA 🔑",
    aiProviderSub: "Configura tu motor de IA. Groq Cloud ofrece respuestas rápidas gratuitas.",
    selectLang: "Idioma de la aplicación",
    selectProvider: "Seleccionar proveedor",
    groqLabel: "Groq Cloud (Alta velocidad)",
    ollamaLabel: "Ollama (Servidor local)",
    apiKeyLabel: "Clave API de Groq (Opcional)",
    personaTitle: "Elige la personalidad del asistente 🎭",
    personaSub: "Selecciona el dominio de enfoque principal:",
    completeTitle: "¡Todo listo! 🎉",
    completeDesc: "El agente Multitool AI está completamente configurado.",
    startAppBtn: "Comenzar a usar Multitool ✨",
    nextBtn: "Siguiente",
    backBtn: "Atrás",
    setupRestart: "Reiniciar asistente de configuración"
  },
  fr: {
    welcomeTitle: "Bienvenue sur Multitool AI",
    welcomeDesc: "Votre assistant personnel intelligent, sandbox de code sur appareil et organisateur de calendrier.",
    discoverFeatures: "Choisir la langue et démarrer 🚀",
    exploreBtn: "Explorer les fonctionnalités & démarrer 🚀",
    featuresTitle: "Que pouvez-vous faire ? ⚡",
    featuresSub: "Fonctionnalités clés de la plateforme Multitool :",
    feat1Title: "🛠️ Self-Coding & Sandbox Web en direct",
    feat1Desc: "Générez du code avec l'IA, lancez des serveurs Express et testez en direct.",
    feat2Title: "🎙️ Assistant vocal & Dictée (TTS / STT)",
    feat2Desc: "Écoutez les réponses ou parlez pour dicter vos messages sans mains.",
    feat3Title: "📅 Agenda intelligent & Notifications",
    feat3Desc: "Gérez vos événements et recevez des notifications locales.",
    feat4Title: "📸 Analyseur d'images & documents",
    feat4Desc: "Téléchargez des fichiers PDF/TXT ou des images pour une analyse IA instantanée.",
    aiProviderTitle: "Configuration du fournisseur IA 🔑",
    aiProviderSub: "Configurez votre moteur IA. Groq Cloud offre des réponses ultra-rapides.",
    selectLang: "Langue de l'application",
    selectProvider: "Choisir un fournisseur",
    groqLabel: "Groq Cloud (Haute vitesse)",
    ollamaLabel: "Ollama (Serveur local)",
    apiKeyLabel: "Clé API Groq (Optionnel)",
    personaTitle: "Choisissez le rôle de l'assistant 🎭",
    personaSub: "Sélectionnez le domaine d'expertise principal :",
    completeTitle: "Tout est prêt ! 🎉",
    completeDesc: "Multitool AI Agent est entièrement configuré.",
    startAppBtn: "Démarrer Multitool ✨",
    nextBtn: "Suivant",
    backBtn: "Retour",
    setupRestart: "Redémarrer l'assistant de configuration"
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
    feat2Title: "🎙️ Assistente vocale e Dettatura (TTS / STT)",
    feat2Desc: "Ascolta le risposte o parla per digitare messaggi a mani libere.",
    feat3Title: "📅 Agenda intelligente e Notifiche",
    feat3Desc: "Gestisci eventi e ricevi notifiche push locali per le scadenze.",
    feat4Title: "📸 Analisi immagini e documenti",
    feat4Desc: "Carica documenti PDF/TXT o foto per l'analisi immediata dell'IA.",
    aiProviderTitle: "Configurazione provider IA 🔑",
    aiProviderSub: "Configura il tuo provider IA. Groq Cloud offre risposte ultra-veloci.",
    selectLang: "Lingua dell'app",
    selectProvider: "Seleziona provider",
    groqLabel: "Groq Cloud (Alta velocità)",
    ollamaLabel: "Ollama (Server locale)",
    apiKeyLabel: "Chiave API Groq (Opzionale)",
    personaTitle: "Scegli il ruolo dell'assistente 🎭",
    personaSub: "Seleziona il settore di competenza principale:",
    completeTitle: "Tutto pronto! 🎉",
    completeDesc: "Multitool AI Agent è completamente configurato.",
    startAppBtn: "Avvia Multitool ✨",
    nextBtn: "Avanti",
    backBtn: "Indietro",
    setupRestart: "Riavvia procedura guidata"
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'calendar' | 'todos' | 'sandbox' | 'settings'>('chat');
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
      }).catch(() => {});
    }
  }, []);

  const [provider, setProvider] = useState<'ollama' | 'groq'>(() => {
    return (localStorage.getItem('multitool_provider') as 'ollama' | 'groq') || 'ollama';
  });
  const [ollamaUrl, setOllamaUrl] = useState<string>(() => {
    return localStorage.getItem('multitool_ollama_url') || 'http://localhost:11434';
  });
  const [groqApiKey, setGroqApiKey] = useState<string>(() => {
    return localStorage.getItem('multitool_groq_api_key') || '';
  });
  const [groqModel, setGroqModel] = useState<string>(() => {
    return localStorage.getItem('multitool_groq_model') || 'llama-3.3-70b-specdec';
  });
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoadingModels, setIsLoadingModels] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('multitool_provider', provider);
    localStorage.setItem('multitool_ollama_url', ollamaUrl);
    localStorage.setItem('multitool_groq_api_key', groqApiKey);
    localStorage.setItem('multitool_groq_model', groqModel);
  }, [provider, ollamaUrl, groqApiKey, groqModel]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [currentToolExecuting, setCurrentToolExecuting] = useState<string | null>(null);
  const [hasLoadedHistory, setHasLoadedHistory] = useState<boolean>(false);
  const [agentPersona, setAgentPersona] = useState<'coder' | 'organizer' | 'writer' | 'analyst'>('coder');

  const [language, setLanguage] = useState<'en' | 'tr' | 'de' | 'es' | 'fr' | 'it'>(() => (localStorage.getItem('multitool_language') as any) || 'en');

  useEffect(() => {
    localStorage.setItem('multitool_language', language);
  }, [language]);

  const [isSetupOpen, setIsSetupOpen] = useState<boolean>(() => localStorage.getItem('multitool_setup_completed') !== 'true');
  const [setupStep, setSetupStep] = useState<number>(1);

  const [isListening, setIsListening] = useState<boolean>(false);

  const sendNotification = (title: string, body: string) => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(title, { body });
      } else if (Notification.permission === 'default') {
        Notification.requestPermission().then(p => {
          if (p === 'granted') new Notification(title, { body });
        });
      }
    }
  };

  const baseInputRef = useRef<string>('');

  const recognitionRef = useRef<any>(null);

  const toggleVoiceRecognition = () => {
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {}
      setIsListening(false);
      return;
    }

    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        addLog('Ses tanıma API desteklenmiyor.');
        alert('Cihazınızda web ses tanıma desteklenmiyor veya izin verilmeyen bir taranma modundasınız.');
        return;
      }
      try {
        const rec = new SpeechRecognition();
        rec.lang = language === 'tr' ? 'tr-TR' : language === 'de' ? 'de-DE' : language === 'es' ? 'es-ES' : language === 'fr' ? 'fr-FR' : language === 'it' ? 'it-IT' : 'en-US';
        rec.continuous = false;
        rec.interimResults = true;

        baseInputRef.current = inputMessage;

        rec.onstart = () => {
          setIsListening(true);
          addLog('Sesli dinleme başladı...');
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
          addLog(`Sesli dinleme hatası: ${e.error || e.message}`);
          setIsListening(false);
        };

        rec.onend = () => {
          setIsListening(false);
          addLog('Sesli dinleme bitti.');
        };

        rec.start();
        recognitionRef.current = rec;
      } catch (err: any) {
        addLog(`Sesli dinleme başlatılamadı: ${err.message}`);
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
      addLog('Veri yedeği indirildi.');
    } catch (err: any) {
      alert(`Yedek oluşturulurken hata: ${err.message}`);
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
        alert('Tüm verileriniz başarıyla içe aktarıldı!');
        addLog('Yedek veriler başarıyla içe aktarıldı.');
      } catch (err: any) {
        alert(`Yedek içe aktarma hatası: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  const PERSONAS = {
    coder: {
      name: '🛠️ Self-Coder',
      desc: 'Kod yazma, sunucu çalıştırma ve yeni APK derleme odağı.',
      promptExtra: 'Sen bir Self-Coding uzmanısın. Kullanıcının isteklerini kod üreterek, localhost sunucuları açarak veya APK derleyerek çözmeye odaklan.'
    },
    organizer: {
      name: '📅 Organizatör',
      desc: 'Takvim, ajanda ve yapılacaklar yönetimi odağı.',
      promptExtra: 'Sen hassas bir kişisel ajanda organizatörüsün. Kullanıcının takvimini, yapılacak işlerini ve günlük programını en verimli şekilde düzenlemeye odaklan.'
    },
    writer: {
      name: '✍️ Metin Yazarı',
      desc: 'Özet çıkarma, e-posta, metin ve çeviri odağı.',
      promptExtra: 'Sen profesyonel bir metin yazarı ve çevirmensin. Dil kullanımı, açıklık ve içerik düzenleme üzerine odaklan.'
    },
    analyst: {
      name: '🧠 Analist',
      desc: 'Problemleri adım adım analiz eden derin mantık odağı.',
      promptExtra: 'Sen analitik ve mantıksal bir düşünürsün. Sorunları adımlara bölerek, neden-sonuç ilişkisi kurarak çöz.'
    }
  };

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [viewDate, setViewDate] = useState<Date>(new Date());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [newEventTitle, setNewEventTitle] = useState<string>('');
  const [newEventTime, setNewEventTime] = useState<string>('');
  const [newEventDesc, setNewEventDesc] = useState<string>('');
  const [calendarViewMode, setCalendarViewMode] = useState<'timeline' | 'list'>('timeline');

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
        addLog(`${newlyArchived.length} tamamlanan görev 24 saat geçtiği için arşive taşındı.`);
      }
      setTodos(remainingTodos);
      localStorage.setItem('multitool_todos', JSON.stringify(remainingTodos));
    }
  }, [todos]);

  const [sandboxFiles, setSandboxFiles] = useState<SandboxFile[]>([]);
  const [currentFileName, setCurrentFileName] = useState<string>('server.js');
  const [editorContent, setEditorContent] = useState<string>(
    `const express = require('express');\nconst app = express();\nconst PORT = 3005;\n\napp.get('/api/test', (req, res) => {\n  res.json({ message: "Express Server Ready!", time: new Date() });\n});\n\napp.listen(PORT, () => {\n  console.log(\`Server running at http://localhost:\${PORT}\`);\n});`
  );
  const [editorLanguage, setEditorLanguage] = useState<'javascript' | 'python'>('javascript');
  const [terminalOutput, setTerminalOutput] = useState<string>('Terminal hazır. Kodu veya Localhost sunucusunu çalıştırmak için butonları kullanın.\n');
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
              🧠 Düşünme Süreci
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
      addLog(`Failed to load chat history: ${err.message}`);
    } finally {
      setHasLoadedHistory(true);
    }
  };

  const handleClearHistory = async () => {
    if (!confirm('Sohbet geçmişini tamamen silmek istediğinize emin misiniz?')) return;
    setMessages([]);
    localStorage.setItem('multitool_chats', JSON.stringify([]));
    addLog('Chat history cleared');
  };
  const fetchModels = async () => {
    setIsLoadingModels(true);
    if (provider === 'groq') {
      addLog('Groq API models fetching...');
      try {
        if (!groqApiKey.trim()) {
          throw new Error('Groq API Key boş bırakılamaz.');
        }
        const response = await fetch('https://api.groq.com/openai/v1/models', {
          headers: {
            'Authorization': `Bearer ${groqApiKey}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          const errBody = await response.text();
          throw new Error(`Groq API response error: ${response.status} ${errBody || ''}`);
        }
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          const filtered = data.data.filter((m: any) =>
            !m.id.includes('whisper') &&
            !m.id.includes('guard') &&
            !m.id.includes('vision') &&
            !m.id.includes('audio')
          );
          const groqModels = filtered.map((m: any) => ({
            name: m.id,
            model: m.id
          }));
          setModels(groqModels);
          if (groqModels.length > 0) {
            if (!groqModel || !groqModels.some((m: any) => m.name === groqModel)) {
              setGroqModel(groqModels[0].name);
            }
          }
          setIsConnected(true);
          addLog(`Successfully loaded ${groqModels.length} Groq models`);
        } else {
          setModels([]);
          setIsConnected(false);
          addLog('No models found in Groq API response');
        }
      } catch (err: any) {
        setModels([]);
        setIsConnected(false);
        addLog(`Groq connection error: ${err.message}`);
      } finally {
        setIsLoadingModels(false);
      }
      return;
    }
    addLog('Fetching Ollama models directly...');
    try {
      const response = await fetch(`${ollamaUrl}/api/tags`);
      if (!response.ok) throw new Error('Ollama response was not ok');
      const data = await response.json();
      if (data.models && data.models.length > 0) {
        setModels(data.models);
        setSelectedModel(data.models[0].name);
        setIsConnected(true);
        addLog(`Successfully loaded ${data.models.length} models`);
      } else {
        setModels([]);
        setIsConnected(false);
        addLog('No models found in Ollama instance');
      }
    } catch (err: any) {
      setModels([]);
      setIsConnected(false);
      addLog(`Failed to connect to Ollama: ${err.message}`);
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
      addLog(`Failed to fetch calendar events: ${err.message}`);
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
      addLog(`Failed to fetch todos: ${err.message}`);
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
    } catch (e) {}

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
      addLog(`Failed to fetch sandbox files: ${err.message}`);
    }
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
        time: newEventTime,
        description: newEventDesc
      };
      const updated = [...currentEvents, newEvent];
      localStorage.setItem('multitool_calendar', JSON.stringify(updated));
      setNewEventTitle('');
      setNewEventTime('');
      setNewEventDesc('');
      setEvents(updated);
      sendNotification('Yeni Etkinlik Kaydedildi 📅', `"${newEventTitle}" - ${selectedCalendarDate} ${newEventTime}`);
      addLog(`Manual event added: "${newEventTitle}"`);
    } catch (err: any) {
      addLog(`Error adding event: ${err.message}`);
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
      addLog(`Error deleting event: ${err.message}`);
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
        completed: false
      };
      const updated = [...currentTodos, newTodo];
      localStorage.setItem('multitool_todos', JSON.stringify(updated));
      setNewTodoTask('');
      setNewTodoDueDate('');
      setTodos(updated);
      sendNotification('Yeni Görev Eklendi ✔️', `"${newTodoTask}"`);
      addLog(`Manual to-do added: "${newTodoTask}"`);
    } catch (err: any) {
      addLog(`Error adding to-do: ${err.message}`);
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
      addLog(`Error updating to-do: ${err.message}`);
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
      addLog(`Error deleting to-do: ${err.message}`);
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
        alert(`'${currentFileName}' dosyası kaydedildi.`);
        return;
      }
    } catch (e) {}

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
      alert(`'${currentFileName}' dosyası kaydedildi.`);
    } catch (err: any) {
      addLog(`Error saving file: ${err.message}`);
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
    } catch (e) {}

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
      addLog(`Error reading file: ${err.message}`);
    }
  };

  const handleDeleteFile = async (filename: string) => {
    if (!confirm(`'${filename}' dosyasını silmek istediğinize emin misiniz?`)) return;
    try {
      await fetch(`http://localhost:3001/api/sandbox/file?filename=${encodeURIComponent(filename)}`, { method: 'DELETE' });
    } catch (e) {}

    try {
      const localFiles = localStorage.getItem('multitool_files');
      if (localFiles) {
        const files = JSON.parse(localFiles);
        const updated = files.filter((f: any) => f.name !== filename);
        localStorage.setItem('multitool_files', JSON.stringify(updated));
        fetchSandboxFiles();
        if (currentFileName === filename) {
          setCurrentFileName('server.js');
          setEditorContent('// Yeni dosya');
        }
        addLog(`File deleted: ${filename}`);
      }
    } catch (err: any) {
      addLog(`Error deleting file: ${err.message}`);
    }
  };

  const handleExecuteCode = async () => {
    setIsRunningCode(true);
    setTerminalOutput(`[${new Date().toLocaleTimeString()}] Çalıştırılıyor: ${currentFileName}...\n`);
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
        if (!output) output = `Kod başarıyla çalıştırıldı (Exit Code: ${data.exitCode}).\n`;
        setTerminalOutput(prev => prev + output);
        addLog(`Execution completed for ${currentFileName}`);
        setIsRunningCode(false);
        return;
      }
    } catch (e) {}

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
            output += `[Çıktı / Geri Dönüş]: ${typeof result === 'object' ? JSON.stringify(result) : String(result)}\n`;
          }
          if (output === '') output = 'Program başarıyla tamamlandı (Çıktı üretilmedi).\n';
          setTerminalOutput(prev => prev + output);
          addLog(`Execution completed for ${currentFileName}`);
        } catch (evalErr: any) {
          setTerminalOutput(prev => prev + `${logs.join('\n')}\n[Çalışma Zamanı Hatası]: ${evalErr.message}\n`);
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
    setTerminalOutput(prev => prev + `[${new Date().toLocaleTimeString()}] Yeni APK derlemesi başlatıldı (Vite + Capacitor + Gradle)...\n`);
    addLog('Manual APK build triggered...');

    try {
      const res = await fetch('http://localhost:3001/api/build-apk', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setTerminalOutput(prev => prev + `[BAŞARILI]: ${data.message}\n🚀 İndirme Linki: http://localhost:3001${data.downloadUrl}\n`);
        addLog('APK build finished successfully!');
        window.open('http://localhost:3001/download/multitool.apk', '_blank');
      } else {
        setTerminalOutput(prev => prev + `[HATA]: ${data.error || 'APK derleme başarısız'}\n${data.stderr || ''}\n`);
        addLog(`APK build error: ${data.error}`);
      }
    } catch (err: any) {
      setTerminalOutput(prev => prev + `[İletişim Hatası]: Localhost sunucusuna erişilemedi: ${err.message}\n`);
    } finally {
      setIsBuildingApk(false);
    }
  };

  const handleStartLocalhostServer = async () => {
    setTerminalOutput(prev => prev + `[${new Date().toLocaleTimeString()}] Localhost Sunucusu başlatılıyor...\n`);
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
        setTerminalOutput(prev => prev + `[SUNUCU AKTİF]: ${data.message}\n🔗 Endpoint: http://localhost:3005/api/test\n[Loglar]: ${data.logs}\n`);
        addLog('Localhost server running on port 3005');
      } else {
        setTerminalOutput(prev => prev + `[HATA]: ${data.message || data.error}\n`);
      }
    } catch (err: any) {
      setTerminalOutput(prev => prev + `[İletişim Hatası]: Sunucu başlatılamadı: ${err.message}\n`);
    }
  };

  const SYSTEM_PROMPT = `Sen Multitool Asistanısın, kullanıcının isteklerini yerine getirmek için özel araçlara (tools) erişimi olan gelişmiş ve self-coding yeteneğine sahip bir AI'sın.
Kullanıcının takvimiyle, yapılacaklar listesiyle, dosya sistemiyle, yerel kod çalıştırmayla VE uygulamanın kendi kaynak kodunu güncelleme / yeni APK derleme istekleriyle ilgili her şeyi yapabilirsin.

Kullanabileceğin Araçlar:
1. "add_calendar_event": Takvime bir etkinlik ekler. Parametreler: {"title": "string", "date": "YYYY-MM-DD", "time": "HH:MM" (opsiyonel), "description": "string" (opsiyonel)}
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

ÖNEMLİ KURAL:
Bir aracı çağıracağın zaman cevabında sadece ve sadece aşağıdaki gibi tek bir JSON kod bloğu yaz:
\`\`\`json
{
  "tool": "araç_adı",
  "parameters": { ... }
}
\`\`\`
Lütfen kullanıcıyla Türkçe konuş. Bugünün tarihi: ${new Date().toISOString().split('T')[0]}.`;

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

    const activeModel = provider === 'groq' ? groqModel : selectedModel;
    if (!activeModel) {
      setTimeout(() => {
        const errorMsg: Message = {
          id: `error-${Date.now()}`,
          role: 'system',
          content: provider === 'groq'
            ? '⚠️ Groq model bulunamadı. Lütfen Ayarlar sekmesinden geçerli bir Groq API Key girin ve "Kaydet ve Bağlantıyı Sına" butonuna basın.'
            : '⚠️ Ollama model seçilmedi. Lütfen Ayarlar sekmesinden Ollama URL\'sini kontrol edin.',
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

    const fullSystemPrompt = `${SYSTEM_PROMPT}\n\nAKTİF ROL TALİMATI:\n${PERSONAS[agentPersona].promptExtra}`;

    const formattedHistory = [
      { role: 'system', content: fullSystemPrompt },
      ...activeHistory.map(m => ({ role: m.role, content: m.content }))
    ];

    while (loopCount < maxLoops) {
      loopCount++;
      addLog(`Invoking ${provider === 'groq' ? 'Groq' : 'Ollama'} model - Iteration ${loopCount}`);
      try {
        let response;
        if (provider === 'groq') {
          if (!groqApiKey.trim()) {
            throw new Error('Groq API Key ayarlanmamış.');
          }
          response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${groqApiKey}`
            },
            body: JSON.stringify({
              model: groqModel,
              messages: formattedHistory,
              temperature: 0.2,
              stream: false
            })
          });
        } else {
          response = await fetch(`${ollamaUrl}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: selectedModel,
              messages: formattedHistory,
              stream: false
            })
          });
        }

        if (!response.ok) {
          const errBody = await response.text();
          throw new Error(`Bağlantı hatası: ${response.status} ${errBody || ''}`);
        }

        const data = await response.json();
        let responseText = '';
        if (provider === 'groq') {
          responseText = data.choices?.[0]?.message?.content || '';
        } else {
          responseText = data.message?.content || '';
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
            content: `Araç Çağrısı: ${toolName}`,
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
            addLog(`Tool ${toolName} execution success.`);
          } catch (err: any) {
            toolResult = err.message || 'Error occurred';
            isSuccess = false;
            addLog(`Tool ${toolName} execution failed: ${toolResult}`);
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

          const feedbackText = `[Sistem Geri Bildirimi] Araç '${toolName}' çalıştırıldı. Sonuç: ${toolResult}`;
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
        break;

      } catch (err: any) {
        addLog(`Chat execution error: ${err.message}`);
        setMessages(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            role: 'system',
            content: `Model ile iletişim kurulurken bir hata oluştu: ${err.message}.`,
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
        const newEvent = {
          id: Date.now().toString(),
          title: params.title,
          date: params.date,
          time: params.time || '',
          description: params.description || '',
          createdAt: new Date().toISOString()
        };
        events.push(newEvent);
        saveLocalData('multitool_calendar', events);
        return newEvent;
      }
      case 'get_calendar_events': {
        return getLocalData('multitool_calendar');
      }
      case 'delete_calendar_event': {
        const events = getLocalData('multitool_calendar');
        const updated = events.filter((e: any) => e.id !== params.id);
        saveLocalData('multitool_calendar', updated);
        return { success: true, message: `Event '${params.id}' deleted` };
      }
      case 'add_todo_item': {
        const todos = getLocalData('multitool_todos');
        const newTodo = {
          id: Date.now().toString(),
          task: params.task,
          priority: params.priority || 'medium',
          dueDate: params.dueDate || '',
          completed: false,
          createdAt: new Date().toISOString()
        };
        todos.push(newTodo);
        saveLocalData('multitool_todos', todos);
        return newTodo;
      }
      case 'get_todo_items': {
        return getLocalData('multitool_todos');
      }
      case 'complete_todo_item': {
        const todos = getLocalData('multitool_todos');
        const index = todos.findIndex((t: any) => t.id === params.id);
        if (index === -1) throw new Error('İş bulunamadı');
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
        } catch (e) {}

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
        return { success: true, message: `File '${params.filename}' saved` };
      }
      case 'read_file': {
        try {
          const res = await fetch(`http://localhost:3001/api/sandbox/file?filename=${encodeURIComponent(params.filename)}`);
          if (res.ok) return await res.json();
        } catch (e) {}

        const files = getLocalData('multitool_files');
        const file = files.find((f: any) => f.name === params.filename);
        if (!file) throw new Error(`Dosya bulunamadı: ${params.filename}`);
        return file;
      }
      case 'list_files': {
        try {
          const res = await fetch('http://localhost:3001/api/sandbox/files');
          if (res.ok) return await res.json();
        } catch (e) {}

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
        } catch (e) {}

        if (params.language === 'python') {
          throw new Error('Offline modda sadece JavaScript kodları çalıştırılabilir.');
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
        return { success: true, message: `File '${params.filename}' deleted` };
      }
      case 'build_new_apk': {
        addLog('AI triggered APK build...');
        const res = await fetch('http://localhost:3001/api/build-apk', { method: 'POST' });
        const data = await res.json();
        if (!data.success) throw new Error(data.error || 'APK build failed');
        return {
          success: true,
          message: 'Yeni APK derlemesi başarıyla tamamlandı ve masaüstüne yerleştirildi!',
          downloadUrl: 'http://localhost:3001/download/multitool.apk'
        };
      }
      case 'modify_app_source': {
        addLog(`AI modifying app source code: ${params.filepath}`);
        const res = await fetch('http://localhost:3001/api/app/source', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filepath: params.filepath, content: params.content })
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error || 'Source update failed');
        return data;
      }
      case 'run_localhost_server': {
        addLog(`AI starting localhost server on port ${params.port || 3005}`);
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
        if (!data.success) throw new Error(data.message || 'Server start failed');
        return data;
      }
      default:
        throw new Error(`Bilinmeyen araç: ${tool}`);
    }
  };

  const renderCalendarWidget = () => {
    const today = new Date();
    const viewYear = viewDate.getFullYear();
    const viewMonth = viewDate.getMonth();

    const monthNames = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];

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
              title="Önceki Ay"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="calendar-month-title">{monthNames[viewMonth]} {viewYear}</span>
            <button
              className="btn-icon"
              onClick={() => setViewDate(new Date(viewYear, viewMonth + 1, 1))}
              title="Sonraki Ay"
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
              title="Bugüne Git"
            >
              Bugün
            </button>
            <button className="btn-icon" onClick={fetchCalendarEvents} title="Yenile">
              <RefreshCw size={14} />
            </button>
          </div>
        </div>
        <div className="calendar-grid">
          {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(d => (
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

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'chat':
        return (
          <div className="chat-container">
            {}
            <div className="chat-status-bar">
               <span>
                 Model: <strong style={{ color: 'var(--text-primary)' }}>{provider === 'groq' ? groqModel : (selectedModel || 'Seçilmedi')}</strong> ({provider === 'groq' ? 'Groq' : 'Ollama'})
               </span>
               <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                 {messages.length > 0 && (
                   <button
                     onClick={handleClearHistory}
                     style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: 'var(--radius-xs)', fontSize: '10.5px', fontWeight: 'bold' }}
                     title="Sohbeti Temizle"
                   >
                     <Trash2 size={11} /> Temizle
                   </button>
                 )}
                 <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                   <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: (provider === 'groq' ? (groqApiKey ? 'var(--success)' : 'var(--danger)') : (isConnected ? 'var(--success)' : 'var(--danger)')) }}></span>
                   <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{provider === 'groq' ? (groqApiKey ? 'Groq Aktif' : 'API Key Yok') : (isConnected ? 'Ollama Bağlı' : 'Bağlantı Yok')}</span>
                 </span>
               </span>
            </div>

            {}
            <div style={{ display: 'flex', gap: '6px', padding: '6px 12px', background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', overflowX: 'auto' }}>
               {(Object.keys(PERSONAS) as Array<keyof typeof PERSONAS>).map(pKey => (
                 <button
                   key={pKey}
                   onClick={() => setAgentPersona(pKey)}
                   style={{
                     border: agentPersona === pKey ? 'none' : '1px solid var(--border-color)',
                     background: agentPersona === pKey ? 'var(--primary)' : '#ffffff',
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

            {}
            <div className="chat-messages">
              {messages.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '16px', color: 'var(--text-secondary)', textAlign: 'center', padding: '16px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#ffffff', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
                    <img src="/logo.png" alt="Multitool Logo" style={{ width: '42px', height: '42px', objectFit: 'contain' }} />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontSize: '18px', fontWeight: '800' }}>Multitool Self-Coding Agent</h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '300px' }}>
                      Takvim, yapılacaklar, localhost sunucu ve kendi uygulamasını kodlayıp yeni APK derleyebilen mobil asistanınız.
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', width: '100%', maxWidth: '340px', marginTop: '6px' }}>
                    <div onClick={() => setInputMessage('Bana yeni bir APK derleyip indirme bağlantısı verir misin?')} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Hammer size={16} color="var(--primary)" />
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)' }}>Yeni APK Derle & Yükle</div>
                        <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>"Uygulamayı derle ve yeni APK oluştur"</div>
                      </div>
                    </div>

                    <div onClick={() => setInputMessage('Localhost 3005 portunda çalışan bir Express sunucusu kodu yaz ve başlat.')} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Server size={16} color="var(--accent-cyan)" />
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)' }}>Localhost Server Başlat</div>
                        <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>"Localhost 3005'te Express sunucusu çalıştır"</div>
                      </div>
                    </div>

                    <div onClick={() => setInputMessage('Yarın saat 14:00 için Dişçi Randevusu takvimime ekler misin?')} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <CalendarIcon size={16} color="var(--accent-emerald)" />
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)' }}>Takvime Etkinlik Ekle</div>
                        <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>"Yarın 14:00 için Dişçi Randevusu ekle"</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                messages.map((m) => {
                  if (m.toolCall) {
                    return (
                      <div key={m.id} className="tool-call-card">
                        <div className={`tool-header ${m.toolCall.status === 'success' ? 'done' : m.toolCall.status === 'error' ? 'error' : ''}`}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Cpu size={14} />
                            🛠️ {m.toolCall.tool}
                          </span>
                          <span style={{ fontSize: '10px', textTransform: 'uppercase' }}>
                            {m.toolCall.status}
                          </span>
                        </div>
                        <div className="tool-params">
                          <strong>Parametreler:</strong> {JSON.stringify(m.toolCall.parameters, null, 2)}
                        </div>
                        {m.toolCall.result && (
                          <div className="tool-result">
                            <strong>Sonuç:</strong><br />{m.toolCall.result}
                          </div>
                        )}
                        {m.toolCall.error && (
                          <div className="tool-result" style={{ color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.05)' }}>
                            <strong>Hata:</strong><br />{m.toolCall.error}
                          </div>
                        )}
                      </div>
                    );
                  }

                  if (m.role === 'system') return null;

                  return (
                    <div key={m.id} className={`message-bubble ${m.role}`}>
                      {renderMessageContent(m.content)}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', fontSize: '9px', opacity: 0.7, marginTop: '4px' }}>
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

            {}
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
                title={isListening ? "Dinleniyor... (Durdurmak için tıklayın)" : "Sesli Yaz"}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
              <textarea
                className="chat-textarea"
                placeholder="Mesajınızı yazın veya konuşun..."
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
              >
                <Plus size={20} style={{ transform: 'rotate(45deg)' }} />
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
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '800' }}>📅 Takvim & Program</h3>
            {renderCalendarWidget()}

            <div className="app-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '4px' }}>
                <h4 style={{ fontSize: '13px', margin: 0, fontWeight: '800' }}>
                  📆 {selectedCalendarDate} Programı
                </h4>
                <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-xs)', padding: '2px', border: '1px solid var(--border-color)' }}>
                  <button
                    onClick={() => setCalendarViewMode('timeline')}
                    style={{
                      border: 'none',
                      background: calendarViewMode === 'timeline' ? 'var(--primary-gradient)' : 'none',
                      color: calendarViewMode === 'timeline' ? '#fff' : 'var(--text-secondary)',
                      padding: '4px 10px',
                      fontSize: '10.5px',
                      borderRadius: 'var(--radius-xs)',
                      cursor: 'pointer',
                      fontWeight: '700'
                    }}
                  >
                    Akış
                  </button>
                  <button
                    onClick={() => setCalendarViewMode('list')}
                    style={{
                      border: 'none',
                      background: calendarViewMode === 'list' ? 'var(--primary-gradient)' : 'none',
                      color: calendarViewMode === 'list' ? '#fff' : 'var(--text-secondary)',
                      padding: '4px 10px',
                      fontSize: '10.5px',
                      borderRadius: 'var(--radius-xs)',
                      cursor: 'pointer',
                      fontWeight: '700'
                    }}
                  >
                    Liste
                  </button>
                </div>
              </div>

              {calendarViewMode === 'list' ? (
                dayEvents.length === 0 ? (
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: '16px 0' }}>
                    Bu tarih için kayıtlı etkinlik yok.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {dayEvents.map(event => (
                      <div key={event.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0, 0, 0, 0.25)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '10px 14px' }}>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>{event.title}</div>
                          {event.time && <div style={{ fontSize: '11px', color: 'var(--accent-cyan)', marginTop: '2px' }}>⏰ {event.time}</div>}
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
                        Diğer
                      </div>
                      <div style={{ flex: 1, background: 'rgba(0, 0, 0, 0.25)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {otherEvents.map(e => (
                          <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)' }}>{e.title} {e.time ? `(${e.time})` : ''}</div>
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
                              <Plus size={11} /> Boş Zaman Dilimi
                            </span>
                          ) : (
                            eventsInHour.map(e => (
                              <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                  <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)' }}>{e.title}</div>
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

            {}
            <form onSubmit={handleAddEvent} className="app-card" style={{ gap: '12px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: '800' }}>Etkinlik Ekle</h4>
              <div className="form-group">
                <input
                  type="text"
                  id="new-event-title-input"
                  placeholder="Etkinlik Başlığı"
                  className="form-input"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <input
                    type="time"
                    className="form-input"
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <input
                    type="date"
                    className="form-input"
                    value={selectedCalendarDate}
                    onChange={(e) => setSelectedCalendarDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Açıklama (Opsiyonel)"
                  className="form-input"
                  value={newEventDesc}
                  onChange={(e) => setNewEventDesc(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                <Plus size={16} /> Etkinlik Kaydet
              </button>
            </form>
          </div>
        );
      }
      case 'todos': {
        const pendingTodos = todos.filter(t => !t.completed);
        const activeCompletedTodos = todos.filter(t => t.completed);
        const totalCompleted = activeCompletedTodos.length + archivedTodos.length;
        const totalAllTasks = todos.length + archivedTodos.length;
        const completionPercentage = totalAllTasks > 0 ? Math.round((totalCompleted / totalAllTasks) * 100) : 0;

        return (
          <div className="screen-content">
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '800' }}>✔️ Yapılacaklar Listesi</h3>

            {}
            <div className="todo-stats">
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700' }}>
                  <span>Genel Tamamlanma Oranı</span>
                  <span style={{ color: 'var(--primary)', fontWeight: '800' }}>%{completionPercentage}</span>
                </div>
                <div style={{ height: '6px', width: '100%', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${completionPercentage}%`, background: 'var(--primary-gradient)', transition: 'width 0.3s ease' }}></div>
                </div>
                <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  <span>Aktif: <strong style={{ color: 'var(--text-primary)' }}>{pendingTodos.length}</strong></span>
                  <span>Tamamlanan: <strong style={{ color: 'var(--text-primary)' }}>{activeCompletedTodos.length}</strong></span>
                  <span>Arşivlenen (24 Saat Saçılan): <strong style={{ color: '#10b981' }}>{archivedTodos.length}</strong></span>
                </div>
              </div>
            </div>

            {}
            <form onSubmit={handleAddTodo} className="app-card" style={{ gap: '12px' }}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Yapılacak iş..."
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
                    <option value="low">Düşük Öncelik</option>
                    <option value="medium">Orta Öncelik</option>
                    <option value="high">Yüksek Öncelik</option>
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
              <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                <Plus size={16} /> Görev Ekle
              </button>
            </form>

            {}
            <div className="todo-list">
              {todos.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', padding: '24px 0' }}>
                  Aktif görev yok. Harika gidiyorsunuz!
                </p>
              ) : (
                todos.map(todo => (
                  <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                    <div
                      className={`todo-checkbox ${todo.completed ? 'checked' : ''}`}
                      onClick={() => handleToggleTodo(todo.id, todo.completed)}
                    >
                      {todo.completed && <Check size={12} />}
                    </div>
                    <div className="todo-content">
                      <span className="todo-text">{todo.task}</span>
                      <div className="todo-meta">
                        <span className={`todo-priority ${todo.priority}`}>{todo.priority}</span>
                        {todo.dueDate && <span>📅 Son Gün: {todo.dueDate}</span>}
                        {todo.completed && <span style={{ color: '#10b981', fontSize: '10px' }}>✓ Tamamlandı (24 saat sonra arşive gidecek)</span>}
                      </div>
                    </div>
                    <button className="btn-icon" style={{ color: 'var(--danger)' }} onClick={() => handleDeleteTodo(todo.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {}
            {archivedTodos.length > 0 && (
              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                    📦 Arşivlenmiş Görevler ({archivedTodos.length})
                  </h4>
                  <button
                    className="btn-secondary"
                    style={{ fontSize: '11px', padding: '4px 8px', color: 'var(--danger)' }}
                    onClick={() => {
                      if (confirm('Arşivlenmiş tüm görevleri temizlemek istediğinize emin misiniz?')) {
                        setArchivedTodos([]);
                      }
                    }}
                  >
                    Arşivi Temizle
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
                        <div className="todo-meta">
                          <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>📦 Arşivlendi (Orana Dahil)</span>
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
      case 'sandbox':
        return (
          <div className="screen-content" style={{ padding: '14px' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '800' }}>💻 Kod & Localhost Sandbox</h3>

            <div className="sandbox-tabs">
              <button
                className={`sandbox-tab ${sandboxTab === 'editor' ? 'active' : ''}`}
                onClick={() => setSandboxTab('editor')}
              >
                ✏️ Editör
              </button>
              <button
                className={`sandbox-tab ${sandboxTab === 'preview' ? 'active' : ''}`}
                onClick={() => setSandboxTab('preview')}
              >
                🌐 Canlı Önizleme
              </button>
              <button
                className={`sandbox-tab ${sandboxTab === 'files' ? 'active' : ''}`}
                onClick={() => {
                  setSandboxTab('files');
                  fetchSandboxFiles();
                }}
              >
                📂 Dosyalar ({sandboxFiles.length})
              </button>
            </div>

            {sandboxTab === 'preview' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                    🌐 Canlı Web Sandbox Önizlemesi ({currentFileName})
                  </span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      className="btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '11px' }}
                      onClick={() => {
                        const iframe = document.getElementById('sandbox-preview-iframe') as HTMLIFrameElement;
                        if (iframe) iframe.srcdoc = currentFileName.endsWith('.html') ? editorContent : `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>body{font-family:sans-serif;padding:20px;color:#0f172a;}</style></head><body><h3>Sandbox Çıktısı</h3><pre style="background:#f1f5f9;padding:12px;border-radius:8px;">${editorContent.replace(/</g, '&lt;')}</pre><script>${editorContent}</script></body></html>`;
                      }}
                    >
                      <RefreshCw size={12} /> Yenile
                    </button>
                  </div>
                </div>
                <iframe
                  id="sandbox-preview-iframe"
                  title="Sandbox Live Preview"
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
                      : `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>body{font-family:sans-serif;padding:16px;color:#0f172a;}</style></head><body><h4 style="margin-bottom:8px;">Console/JS Önizleme</h4><pre style="background:#f1f5f9;padding:12px;border-radius:8px;font-size:12px;overflow:auto;">${editorContent.replace(/</g, '&lt;')}</pre><script>try{ ${editorContent} }catch(e){ document.write('<pre style="color:red">'+e+'</pre>'); }</script></body></html>`
                  }
                />
              </div>
            ) : sandboxTab === 'files' ? (
              <div className="file-list-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Sandbox Klasörü (./sandbox)</span>
                  <button className="btn-icon" onClick={fetchSandboxFiles}>
                    <RefreshCw size={12} />
                  </button>
                </div>
                {sandboxFiles.length === 0 ? (
                  <p style={{ textAlign: 'center', padding: '24px 0', fontSize: '13px', color: 'var(--text-muted)' }}>
                    Klasör boş. Buraya AI dosya oluşturabilir veya kendiniz yeni dosya açabilirsiniz.
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
                  <span style={{ fontSize: '12px', fontWeight: '700' }}>Yeni Dosya Aç:</span>
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
                        setEditorContent('// Yeni dosya içeriği...');
                        setSandboxTab('editor');
                      }}
                      style={{ padding: '6px 14px', fontSize: '12px' }}
                    >
                      Aç
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="code-editor-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="text"
                    className="form-input"
                    value={currentFileName}
                    onChange={(e) => setCurrentFileName(e.target.value)}
                    style={{ flex: 1, padding: '6px 10px', fontSize: '12px', fontWeight: '800' }}
                  />
                  <select
                    className="form-select"
                    style={{ width: 'auto', padding: '6px 8px', fontSize: '11px' }}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!val) return;
                      const templates: Record<string, string> = {
                        express: `const express = require('express');\nconst app = express();\nconst PORT = 3005;\n\napp.get('/api/test', (req, res) => {\n  res.json({ message: "Express Server Ready!", time: new Date() });\n});\n\napp.listen(PORT, () => {\n  console.log(\`Server running at http://localhost:\${PORT}\`);\n});`,
                        react: `function Counter() {\n  const [count, setCount] = React.useState(0);\n  return (\n    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>\n      <h2>Counter: {count}</h2>\n      <button onClick={() => setCount(count + 1)}>Increment</button>\n    </div>\n  );\n}`,
                        html: `<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="utf-8">\n  <title>Sandbox Page</title>\n  <style>body { font-family: sans-serif; padding: 20px; background: #f8fafc; color: #0f172a; }</style>\n</head>\n<body>\n  <h2>Multitool Sandbox Page</h2>\n  <p>Live preview ready!</p>\n</body>\n</html>`
                      };
                      if (templates[val]) {
                        setEditorContent(templates[val]);
                        if (val === 'html') setCurrentFileName('index.html');
                        if (val === 'express') setCurrentFileName('server.js');
                      }
                      e.target.value = '';
                    }}
                  >
                    <option value="">🚀 Şablon Seç...</option>
                    <option value="express">⚡ Express API Sunucusu</option>
                    <option value="react">⚛️ React Bileşeni</option>
                    <option value="html">🎨 HTML5 Sayfa</option>
                  </select>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button className="btn-icon" onClick={handleSaveFile} title="Kaydet">
                      <Layers size={16} />
                    </button>
                    <button
                      className="btn-primary"
                      onClick={handleExecuteCode}
                      disabled={isRunningCode}
                      style={{ padding: '6px 10px', fontSize: '11px' }}
                    >
                      {isRunningCode ? <RefreshCw size={13} className="spin" /> : <Play size={13} />} Çalıştır
                    </button>
                  </div>
                </div>

                {}
                <div style={{ display: 'flex', gap: '8px', margin: '8px 0' }}>
                  <button
                    className="btn-primary"
                    onClick={handleStartLocalhostServer}
                    style={{ flex: 1, padding: '6px 10px', fontSize: '11px', background: 'rgba(14, 165, 233, 0.2)', border: '1px solid var(--accent-cyan)', color: 'var(--accent-cyan)' }}
                  >
                    <Server size={13} /> Localhost Server Başlat (3005)
                  </button>
                  <button
                    className="btn-primary"
                    onClick={handleBuildApk}
                    disabled={isBuildingApk}
                    style={{ flex: 1, padding: '6px 10px', fontSize: '11px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid var(--accent-emerald)', color: 'var(--accent-emerald)' }}
                  >
                    {isBuildingApk ? <RefreshCw size={13} className="spin" /> : <Hammer size={13} />} {isBuildingApk ? 'Derleniyor...' : 'Yeni APK Derle'}
                  </button>
                </div>

                <textarea
                  className="editor-textarea"
                  value={editorContent}
                  onChange={(e) => setEditorContent(e.target.value)}
                />

                {}
                <div className="terminal-panel">
                  <div className="terminal-header">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Terminal size={13} /> Konsol Çıktısı & Sunucu Logları
                    </span>
                    <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '11px' }} onClick={() => setTerminalOutput('')}>
                      Temizle
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
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '800' }}>⚙️ Ayarlar</h3>

            <div className="app-card">
              <h4 style={{ fontSize: '14px', fontWeight: '800' }}>Yapay Zeka Servis Sağlayıcısı</h4>
              <div className="form-group" style={{ marginBottom: '8px' }}>
                <label className="form-label">Sağlayıcı</label>
                <select
                  className="form-select"
                  value={provider}
                  onChange={(e) => setProvider(e.target.value as 'ollama' | 'groq')}
                >
                  <option value="ollama">Ollama (Yerel Sunucu)</option>
                  <option value="groq">Groq Cloud (Bulut API)</option>
                </select>
              </div>

              {provider === 'ollama' ? (
                <>
                  <div className="form-group">
                    <label className="form-label">Ollama API URL</label>
                    <input
                      type="text"
                      className="form-input"
                      value={ollamaUrl}
                      onChange={(e) => setOllamaUrl(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Model Seçimi</label>
                    {isLoadingModels ? (
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <RefreshCw size={12} className="spin" /> Modeller yükleniyor...
                      </div>
                    ) : (
                      <select
                        className="form-select"
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                      >
                        {models.length === 0 ? (
                          <option value="">Model bulunamadı (Ollama kontrol edin)</option>
                        ) : (
                          models.map(m => (
                            <option key={m.name} value={m.name}>{m.name}</option>
                          ))
                        )}
                      </select>
                    )}
                  </div>
                  <button className="btn-primary" onClick={fetchModels} style={{ marginTop: '4px' }}>
                    <RefreshCw size={14} /> Bağlantıyı Yenile
                  </button>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label className="form-label">Groq API Key</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="gsk_..."
                      value={groqApiKey}
                      onChange={(e) => setGroqApiKey(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Model Seçimi</label>
                    {isLoadingModels ? (
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <RefreshCw size={12} className="spin" /> Modeller yükleniyor...
                      </div>
                    ) : (
                      <select
                        className="form-select"
                        value={groqModel}
                        onChange={(e) => setGroqModel(e.target.value)}
                      >
                        {models.length === 0 ? (
                          <option value="">Model bulunamadı (API Anahtarını sına tuşuna basın)</option>
                        ) : (
                          models.map(m => (
                            <option key={m.name} value={m.name}>{m.name}</option>
                          ))
                        )}
                      </select>
                    )}
                  </div>
                  <button className="btn-primary" onClick={fetchModels} style={{ marginTop: '4px' }}>
                    <Check size={14} /> Kaydet ve Bağlantıyı Sına
                  </button>
                </>
              )}
            </div>

            <div className="app-card">
              <h4 style={{ fontSize: '14px', fontWeight: '800' }}>Hakkında & Detaylar</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Bu uygulama, Self-Coding AI ve Localhost Node.js desteğine sahip mobil asistan uygulamasıdır (Multitool).
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: 'var(--radius-xs)' }}>
                <span>• Sürüm: <strong>v1.0.0</strong></span>
                <span>• Mimari: <strong>Self-Coding AI & Localhost Node.js</strong></span>
                <span>• Derleme: <strong>Otomatik APK Derleyici (Vite + Capacitor)</strong></span>
                <span>• Veritabanı: <strong>LocalStorage & Express API</strong></span>
              </div>
            </div>

            {}
            <div className="app-card">
              <h4 style={{ fontSize: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Download size={16} color="var(--primary)" /> Veri Yedekleme & Geri Yükleme
              </h4>
              <p style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                Tüm takvim, yapılacaklar, sohbet geçmişi ve sandbox dosyalarınızı JSON formatında yedekleyin veya içe aktarın.
              </p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <button
                  className="btn-secondary"
                  onClick={handleExportBackup}
                  style={{ flex: 1, padding: '8px 12px', fontSize: '11.5px' }}
                >
                  <Download size={13} /> Dışa Aktar (Yedekle)
                </button>
                <label className="btn-secondary" style={{ flex: 1, padding: '8px 12px', fontSize: '11.5px', textAlign: 'center', cursor: 'pointer' }}>
                  <Upload size={13} /> İçe Aktar
                  <input type="file" accept=".json" onChange={handleImportBackup} style={{ display: 'none' }} />
                </label>
              </div>
            </div>

            {}
            <div className="app-card">
              <h4 style={{ fontSize: '14px', fontWeight: '800' }}>Sistem Logları</h4>
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
                {systemLogs.length === 0 ? 'Log kaydı yok.' : systemLogs.map((log, i) => (
                  <div key={i}>{log}</div>
                ))}
              </div>
            </div>
            {}
            <div className="app-card" style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px dashed var(--primary)' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '800', margin: 0, color: 'var(--primary)' }}>🚀 Kurulum Sihirbazı</h4>
              <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: '4px 0 8px 0' }}>
                Uygulama açılış sihirbazını tekrar çalıştırarak AI sağlayıcınızı ve varsayılan rolünüzü yeniden yapılandırın.
              </p>
              <button
                className="btn-secondary"
                style={{ width: '100%', padding: '8px 12px', fontSize: '11.5px' }}
                onClick={() => {
                  setSetupStep(1);
                  setIsSetupOpen(true);
                }}
              >
                Kurulum Sihirbazını (Setup UI) Yeniden Başlat
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

    const t = (TRANSLATIONS as any)[language] || TRANSLATIONS.en;

    return (
      <div className="setup-overlay">
        {}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '8px 0' }}>
          {[1, 2, 3, 4, 5].map(step => (
            <div
              key={step}
              className={`setup-step-dot ${step === setupStep ? 'active' : ''}`}
            />
          ))}
        </div>

        {}
        {setupStep === 1 && (
          <div className="setup-slide" key="step-1">
            <div className="setup-logo-bounce" style={{
              width: '88px',
              height: '88px',
              borderRadius: '24px',
              background: '#ffffff',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-md)',
              marginBottom: '8px'
            }}>
              <img src="/logo.png" alt="Logo" style={{ width: '64px', height: '64px', objectFit: 'contain' }} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
                {t.welcomeTitle}
              </h1>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto', lineHeight: '1.6' }}>
                {t.welcomeDesc}
              </p>
            </div>

            {}
            <div className="form-group" style={{ width: '100%', maxWidth: '280px', marginTop: '10px' }}>
              <label className="form-label" style={{ fontSize: '11px', textAlign: 'center', width: '100%' }}>🌐 {t.selectLang}</label>
              <select
                className="form-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                style={{ textAlign: 'center', padding: '10px', fontWeight: '700', borderRadius: '12px' }}
              >
                <option value="en">🇬🇧 English (Default)</option>
                <option value="tr">🇹🇷 Türkçe</option>
                <option value="de">🇩🇪 Deutsch</option>
                <option value="es">🇪🇸 Español</option>
                <option value="fr">🇫🇷 Français</option>
                <option value="it">🇮🇹 Italiano</option>
              </select>
            </div>

            <button
              className="btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '15px', borderRadius: '14px', marginTop: '12px' }}
              onClick={() => setSetupStep(2)}
            >
              {t.exploreBtn}
            </button>
          </div>
        )}

        {}
        {setupStep === 2 && (
          <div className="setup-slide" key="step-2">
            <div style={{ textAlign: 'center', marginBottom: '4px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {t.featuresTitle}
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                {t.featuresSub}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
              <div className="setup-feature-card">
                <div className="setup-icon-box">
                  <CodeIcon size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)' }}>{t.feat1Title}</h4>
                  <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: 0 }}>
                    {t.feat1Desc}
                  </p>
                </div>
              </div>

              <div className="setup-feature-card">
                <div className="setup-icon-box">
                  <Mic size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)' }}>{t.feat2Title}</h4>
                  <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: 0 }}>
                    {t.feat2Desc}
                  </p>
                </div>
              </div>

              <div className="setup-feature-card">
                <div className="setup-icon-box">
                  <CalendarIcon size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)' }}>{t.feat3Title}</h4>
                  <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: 0 }}>
                    {t.feat3Desc}
                  </p>
                </div>
              </div>

              <div className="setup-feature-card">
                <div className="setup-icon-box">
                  <FileText size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--text-primary)' }}>{t.feat4Title}</h4>
                  <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', margin: 0 }}>
                    {t.feat4Desc}
                  </p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', width: '100%', marginTop: '8px' }}>
              <button
                className="btn-secondary"
                style={{ flex: 1, padding: '12px' }}
                onClick={() => setSetupStep(1)}
              >
                {t.backBtn}
              </button>
              <button
                className="btn-primary"
                style={{ flex: 1, padding: '12px' }}
                onClick={() => setSetupStep(3)}
              >
                {t.nextBtn}
              </button>
            </div>
          </div>
        )}

        {}
        {setupStep === 3 && (
          <div className="setup-slide" key="step-3">
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
                  onChange={(e) => setProvider(e.target.value as 'ollama' | 'groq')}
                >
                  <option value="groq">{t.groqLabel}</option>
                  <option value="ollama">{t.ollamaLabel}</option>
                </select>
              </div>

              {provider === 'groq' ? (
                <div className="form-group">
                  <label className="form-label">{t.apiKeyLabel}</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="gsk_..."
                    value={groqApiKey}
                    onChange={(e) => setGroqApiKey(e.target.value)}
                  />
                </div>
              ) : (
                <div className="form-group">
                  <label className="form-label">Ollama URL</label>
                  <input
                    type="text"
                    className="form-input"
                    value={ollamaUrl}
                    onChange={(e) => setOllamaUrl(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px', width: '100%', marginTop: '12px' }}>
              <button
                className="btn-secondary"
                style={{ flex: 1, padding: '12px' }}
                onClick={() => setSetupStep(2)}
              >
                {t.backBtn}
              </button>
              <button
                className="btn-primary"
                style={{ flex: 1, padding: '12px' }}
                onClick={() => setSetupStep(4)}
              >
                {t.nextBtn}
              </button>
            </div>
          </div>
        )}

        {}
        {setupStep === 4 && (
          <div className="setup-slide" key="step-4">
            <div style={{ textAlign: 'center' }}>
              <div className="setup-icon-box" style={{ margin: '0 auto 8px auto', width: '50px', height: '50px' }}>
                <Sparkles size={26} />
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {t.personaTitle}
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                {t.personaSub}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', width: '100%' }}>
              {(Object.keys(PERSONAS) as Array<keyof typeof PERSONAS>).map((pKey) => (
                <button
                  key={pKey}
                  type="button"
                  style={{
                    padding: '14px 12px',
                    borderRadius: '14px',
                    border: `2px solid ${agentPersona === pKey ? 'var(--primary)' : 'var(--border-color)'}`,
                    background: agentPersona === pKey ? 'rgba(37, 99, 235, 0.08)' : '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    boxShadow: agentPersona === pKey ? 'var(--shadow-sm)' : 'none'
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
                onClick={() => setSetupStep(3)}
              >
                {t.backBtn}
              </button>
              <button
                className="btn-primary"
                style={{ flex: 1, padding: '12px' }}
                onClick={() => setSetupStep(5)}
              >
                {t.nextBtn}
              </button>
            </div>
          </div>
        )}

        {}
        {setupStep === 5 && (
          <div className="setup-slide" key="step-5" style={{ textAlign: 'center' }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'rgba(34, 197, 94, 0.15)',
              color: '#22c55e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              marginBottom: '8px',
              boxShadow: '0 0 20px rgba(34, 197, 94, 0.2)'
            }}>
              ✓
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)' }}>
              {t.completeTitle}
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '380px', lineHeight: '1.6' }}>
              {t.completeDesc}
            </p>
            <button
              className="btn-primary"
              style={{
                width: '100%',
                padding: '15px',
                fontSize: '16px',
                fontWeight: '800',
                borderRadius: '16px',
                marginTop: '16px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
              }}
              onClick={() => {
                localStorage.setItem('multitool_setup_completed', 'true');
                setIsSetupOpen(false);
              }}
            >
              {t.startAppBtn}
            </button>
          </div>
        )}

        {}
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginTop: 'auto' }}>
          Multitool AI • Version 2.0
        </div>
      </div>
    );
  };

  const appContent = (
    <>
      {renderSetupModal()}
      {}
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

      {}
      <div className="app-header">
        <div className="app-title-container">
          <div className="app-logo" style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
              fontWeight: '700'
            }}
            title="Güncel APK'yı İndir"
          >
            <Download size={13} /> APK İndir
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

      {}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {renderActiveScreen()}
      </div>

      {}
      <div className="phone-bottom-nav">
        <button
          className={`nav-tab-item ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          <MessageSquare size={20} />
          <span>Sohbet</span>
        </button>
        <button
          className={`nav-tab-item ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          <CalendarIcon size={20} />
          <span>Takvim</span>
        </button>
        <button
          className={`nav-tab-item ${activeTab === 'todos' ? 'active' : ''}`}
          onClick={() => setActiveTab('todos')}
        >
          <CheckSquare size={20} />
          <span>Yapılacaklar</span>
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
