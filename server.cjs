const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, 'data');
const SANDBOX_DIR = path.join(__dirname, 'sandbox');
const CALENDAR_FILE = path.join(DATA_DIR, 'calendar.json');
const TODOS_FILE = path.join(DATA_DIR, 'todos.json');
const CHATS_FILE = path.join(DATA_DIR, 'chats.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(SANDBOX_DIR)) {
  fs.mkdirSync(SANDBOX_DIR, { recursive: true });
}

if (!fs.existsSync(CALENDAR_FILE)) {
  fs.writeFileSync(CALENDAR_FILE, JSON.stringify([], null, 2));
}
if (!fs.existsSync(TODOS_FILE)) {
  fs.writeFileSync(TODOS_FILE, JSON.stringify([], null, 2));
}
if (!fs.existsSync(CHATS_FILE)) {
  fs.writeFileSync(CHATS_FILE, JSON.stringify([], null, 2));
}

const readJSON = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

const writeJSON = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

app.get('/api/models', (req, res) => {
  const ollamaUrl = req.query.url || 'http://localhost:11434';
  
  http.get(`${ollamaUrl}/api/tags`, (ollamaRes) => {
    let data = '';
    ollamaRes.on('data', (chunk) => { data += chunk; });
    ollamaRes.on('end', () => {
      try {
        res.json(JSON.parse(data));
      } catch (e) {
        res.status(500).json({ error: 'Ollama yanıtı ayrıştırılamadı' });
      }
    });
  }).on('error', (err) => {
    res.status(500).json({ error: 'Ollama çalışmıyor veya erişilemiyor: ' + err.message });
  });
});

app.post('/api/chat', (req, res) => {
  const { ollamaUrl = 'http://localhost:11434', model, messages, options, stream = false } = req.body;

  const postData = JSON.stringify({
    model,
    messages,
    options,
    stream
  });

  const urlObj = new URL(`${ollamaUrl}/api/chat`);
  const clientOptions = {
    hostname: urlObj.hostname,
    port: urlObj.port,
    path: urlObj.pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const ollamaReq = http.request(clientOptions, (ollamaRes) => {
    res.writeHead(ollamaRes.statusCode, ollamaRes.headers);
    ollamaRes.pipe(res);
  });

  ollamaReq.on('error', (err) => {
    res.status(500).json({ error: 'Ollama çağrısında hata: ' + err.message });
  });

  ollamaReq.write(postData);
  ollamaReq.end();
});


app.get('/api/calendar', (req, res) => {
  const events = readJSON(CALENDAR_FILE);
  res.json(events);
});

app.post('/api/calendar', (req, res) => {
  const { title, date, time = '', description = '' } = req.body;
  if (!title || !date) {
    return res.status(400).json({ error: 'Başlık ve Tarih zorunludur' });
  }

  const events = readJSON(CALENDAR_FILE);
  const newEvent = {
    id: Date.now().toString(),
    title,
    date, // YYYY-MM-DD
    time,
    description,
    createdAt: new Date().toISOString()
  };

  events.push(newEvent);
  writeJSON(CALENDAR_FILE, events);
  res.status(201).json(newEvent);
});

app.delete('/api/calendar/:id', (req, res) => {
  const { id } = req.params;
  let events = readJSON(CALENDAR_FILE);
  const initialLength = events.length;
  events = events.filter(e => e.id !== id);
  
  if (events.length === initialLength) {
    return res.status(404).json({ error: 'Etkinlik bulunamadı' });
  }

  writeJSON(CALENDAR_FILE, events);
  res.json({ success: true, message: 'Etkinlik başarıyla silindi' });
});


app.get('/api/todos', (req, res) => {
  const todos = readJSON(TODOS_FILE);
  res.json(todos);
});

app.post('/api/todos', (req, res) => {
  const { task, priority = 'medium', dueDate = '', completed = false } = req.body;
  if (!task) {
    return res.status(400).json({ error: 'Görev içeriği zorunludur' });
  }

  const todos = readJSON(TODOS_FILE);
  const newTodo = {
    id: Date.now().toString(),
    task,
    priority, // 'low', 'medium', 'high'
    dueDate,
    completed,
    createdAt: new Date().toISOString()
  };

  todos.push(newTodo);
  writeJSON(TODOS_FILE, todos);
  res.status(201).json(newTodo);
});

app.put('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  
  const todos = readJSON(TODOS_FILE);
  const index = todos.findIndex(t => t.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Yapılacak öğesi bulunamadı' });
  }

  todos[index] = { ...todos[index], ...updates };
  writeJSON(TODOS_FILE, todos);
  res.json(todos[index]);
});

app.delete('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  let todos = readJSON(TODOS_FILE);
  const initialLength = todos.length;
  todos = todos.filter(t => t.id !== id);
  
  if (todos.length === initialLength) {
    return res.status(404).json({ error: 'Yapılacak öğesi bulunamadı' });
  }

  writeJSON(TODOS_FILE, todos);
  res.json({ success: true, message: 'Yapılacak öğesi başarıyla silindi' });
});


app.get('/api/sandbox/files', (req, res) => {
  try {
    const files = fs.readdirSync(SANDBOX_DIR);
    const fileList = files.map(file => {
      const filePath = path.join(SANDBOX_DIR, file);
      const stat = fs.statSync(filePath);
      return {
        name: file,
        size: stat.size,
        isDir: stat.isDirectory(),
        updatedAt: stat.mtime.toISOString()
      };
    });
    res.json(fileList);
  } catch (err) {
    res.status(500).json({ error: 'Sandbox dosyaları listelenemedi: ' + err.message });
  }
});

app.get('/api/sandbox/file', (req, res) => {
  const { filename } = req.query;
  if (!filename) {
    return res.status(400).json({ error: 'Dosya adı parametresi zorunludur' });
  }

  const safePath = path.join(SANDBOX_DIR, path.basename(filename));
  if (!fs.existsSync(safePath)) {
    return res.status(404).json({ error: `'${filename}' dosyası bulunamadı` });
  }

  try {
    const content = fs.readFileSync(safePath, 'utf8');
    res.json({ filename, content });
  } catch (err) {
    res.status(500).json({ error: 'Dosya okunamadı: ' + err.message });
  }
});

app.post('/api/sandbox/file', (req, res) => {
  const { filename, content } = req.body;
  if (!filename || content === undefined) {
    return res.status(400).json({ error: 'Dosya adı ve İçerik zorunludur' });
  }

  const safePath = path.join(SANDBOX_DIR, path.basename(filename));

  try {
    fs.writeFileSync(safePath, content, 'utf8');
    res.json({ success: true, message: `'${filename}' dosyası başarıyla yazıldı` });
  } catch (err) {
    res.status(500).json({ error: 'Dosya yazılamadı: ' + err.message });
  }
});

app.delete('/api/sandbox/file', (req, res) => {
  const { filename } = req.query;
  if (!filename) {
    return res.status(400).json({ error: 'Dosya adı parametresi zorunludur' });
  }

  const safePath = path.join(SANDBOX_DIR, path.basename(filename));
  if (!fs.existsSync(safePath)) {
    return res.status(404).json({ error: `'${filename}' dosyası bulunamadı` });
  }

  try {
    fs.unlinkSync(safePath);
    res.json({ success: true, message: `'${filename}' dosyası başarıyla silindi` });
  } catch (err) {
    res.status(500).json({ error: 'Dosya silinemedi: ' + err.message });
  }
});

app.post('/api/sandbox/execute', (req, res) => {
  const { language, code, filename } = req.body;
  if (!language || !code) {
    return res.status(400).json({ error: 'Dil ve Kod zorunludur' });
  }

  const fileExt = language.toLowerCase() === 'python' ? 'py' : 'js';
  const execFile = filename ? path.basename(filename) : `exec_${Date.now()}.${fileExt}`;
  const safePath = path.join(SANDBOX_DIR, execFile);

  try {
    fs.writeFileSync(safePath, code, 'utf8');

    let command = '';
    if (language.toLowerCase() === 'python') {
      command = `python3 "${safePath}"`;
    } else if (language.toLowerCase() === 'javascript' || language.toLowerCase() === 'node') {
      command = `node "${safePath}"`;
    } else {
      return res.status(400).json({ error: 'Desteklenmeyen dil. javascript veya python seçin' });
    }

    exec(command, { timeout: 10000 }, (error, stdout, stderr) => {
      if (!filename) {
        try { fs.unlinkSync(safePath); } catch (e) {}
      }

      if (error && error.killed) {
        return res.json({
          success: false,
          stdout,
          stderr: 'Yürütme zaman aşımına uğradı (10sn sınırı).',
          exitCode: null
        });
      }

      res.json({
        success: !error,
        stdout,
        stderr,
        exitCode: error ? error.code : 0
      });
    });

  } catch (err) {
    res.status(500).json({ error: 'Kod yürütülemedi: ' + err.message });
  }
});

app.get('/api/chat/history', (req, res) => {
  const chats = readJSON(CHATS_FILE);
  res.json(chats);
});

app.post('/api/chat/history', (req, res) => {
  const { messages } = req.body;
  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: 'Mesaj dizisi zorunludur' });
  }
  writeJSON(CHATS_FILE, messages);
  res.json({ success: true });
});

app.get(['/download/multitool.apk', '/multitool.apk', '/apk', '/api/download-apk'], (req, res) => {
  const desktopApk = path.join('/home/doruk/Desktop', 'multitool.apk');
  const rootApk = path.join(__dirname, 'multitool.apk');
  const apkPath = fs.existsSync(desktopApk) ? desktopApk : (fs.existsSync(rootApk) ? rootApk : null);

  if (apkPath) {
    res.download(apkPath, 'multitool.apk');
  } else {
    res.status(404).json({ error: 'multitool.apk bulunamadı. Lütfen önce derleme yapın.' });
  }
});

const AGENDA_DIR = path.join(DATA_DIR, 'agenda-images');
if (!fs.existsSync(AGENDA_DIR)) {
  fs.mkdirSync(AGENDA_DIR, { recursive: true });
}

app.post('/api/save-agenda', (req, res) => {
  try {
    const { filename, dataUrl } = req.body || {};
    if (!filename || !dataUrl || typeof dataUrl !== 'string') {
      return res.status(400).json({ error: 'filename ve dataUrl gerekli' });
    }
    // sanitize filename: keep only safe chars
    const safe = String(filename).replace(/[^a-zA-Z0-9._-]/g, '_');
    if (!safe.endsWith('.jpg') && !safe.endsWith('.jpeg')) {
      return res.status(400).json({ error: 'Geçersiz dosya adı' });
    }
    const m = dataUrl.match(/^data:image\/jpeg;base64,(.+)$/);
    if (!m) {
      return res.status(400).json({ error: 'Geçersiz JPEG dataUrl' });
    }
    const buf = Buffer.from(m[1], 'base64');
    const targetPath = path.join(AGENDA_DIR, safe);
    fs.writeFileSync(targetPath, buf);
    res.json({ success: true, url: '/download/agenda/' + encodeURIComponent(safe), filename: safe });
  } catch (err) {
    res.status(500).json({ error: 'Kaydetme hatası: ' + err.message });
  }
});

app.get('/download/agenda/:filename', (req, res) => {
  const safe = String(req.params.filename).replace(/[^a-zA-Z0-9._-]/g, '_');
  const targetPath = path.join(AGENDA_DIR, safe);
  if (!fs.existsSync(targetPath)) {
    return res.status(404).json({ error: 'Görsel bulunamadı' });
  }
  res.download(targetPath, safe);
});

app.post('/api/build-apk', (req, res) => {
  const buildCmd = 'npm run build && npx cap sync && bash build_apk.sh';
  exec(buildCmd, { cwd: __dirname, timeout: 120000 }, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ success: false, error: error.message, stderr, stdout });
    }
    res.json({
      success: true,
      message: 'APK derleme başarıyla tamamlandı!',
      downloadUrl: '/download/multitool.apk',
      stdout
    });
  });
});

app.post('/api/app/source', (req, res) => {
  const { filepath, content } = req.body;
  if (!filepath || content === undefined) {
    return res.status(400).json({ error: 'filepath ve content gerekli' });
  }

  const targetPath = path.resolve(__dirname, filepath);
  if (!targetPath.startsWith(path.resolve(__dirname))) {
    return res.status(403).json({ error: 'Erişim engellendi' });
  }

  try {
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, content, 'utf8');
    res.json({ success: true, message: `'${filepath}' başarıyla güncellendi.` });
  } catch (err) {
    res.status(500).json({ error: 'Yazma hatası: ' + err.message });
  }
});

let runningServers = {};

app.post('/api/localhost/server', (req, res) => {
  const { action, port = 3005, code, filename = 'server_runner.js' } = req.body;

  if (action === 'stop') {
    if (runningServers[port]) {
      try { runningServers[port].kill(); } catch (e) {}
      delete runningServers[port];
      return res.json({ success: true, message: `Port ${port} üzerindeki sunucu durduruldu.` });
    }
    return res.json({ success: false, message: `Port ${port} üzerinde çalışan sunucu bulunamadı.` });
  }

  if (!code) {
    return res.status(400).json({ error: 'Sunucu kodu gereklidir' });
  }

  const safePath = path.join(SANDBOX_DIR, path.basename(filename));
  fs.writeFileSync(safePath, code, 'utf8');

  if (runningServers[port]) {
    try { runningServers[port].kill(); } catch (e) {}
  }

  const proc = exec(`node "${safePath}"`, { cwd: SANDBOX_DIR });
  runningServers[port] = proc;

  let logs = '';
  if (proc.stdout) proc.stdout.on('data', data => { logs += data; });
  if (proc.stderr) proc.stderr.on('data', data => { logs += data; });

  setTimeout(() => {
    res.json({
      success: true,
      message: `Sunucu http://localhost:${port} adresinde başlatıldı!`,
      logs: logs || 'Sunucu dinlemeye başladı.',
      port
    });
  }, 1200);
});

app.get('/app-ads.txt', (req, res) => {
  const pubPath = path.join(__dirname, 'public', 'app-ads.txt');
  const distPath = path.join(__dirname, 'dist', 'app-ads.txt');
  if (fs.existsSync(pubPath)) return res.sendFile(pubPath);
  if (fs.existsSync(distPath)) return res.sendFile(distPath);
  res.status(404).send('Not found');
});

app.use(express.static(path.join(__dirname, 'dist')));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Multitool server running on http://localhost:${PORT}`);
});
