/**
 * Multitool Cloud Backend
 * -----------------------
 * Basit, dosya tabanlı (data.json) HTTP API.
 * Arkadaşlık istekleri, çift yönlü arkadaşlık ve paylaşılan takvim etkinliklerini tutar.
 * Tek process (pm2) altında çalışır; yazma işlemleri basit bir mutex ile serileştirilir.
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const DATA_FILE = process.env.DATA_FILE || path.join(__dirname, 'data.json');
// Basit API anahtarı koruması (app tarafında da aynı key gönderilir)
const API_KEY = process.env.MULTITOOL_API_KEY || 'mt_cloud_default_key';

// ---- Veri katmanı ----
const emptyData = () => ({ users: [], sessions: [], requests: [], friendships: [], calendar: {}, shares: [] });

function loadData() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const raw = fs.readFileSync(DATA_FILE, 'utf8');
            const parsed = JSON.parse(raw);
            return {
                users: Array.isArray(parsed.users) ? parsed.users : [],
                sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
                requests: Array.isArray(parsed.requests) ? parsed.requests : [],
                friendships: Array.isArray(parsed.friendships) ? parsed.friendships : [],
                calendar: (parsed.calendar && typeof parsed.calendar === 'object') ? parsed.calendar : {},
                shares: Array.isArray(parsed.shares) ? parsed.shares : []
            };
        }
    } catch (e) {
        console.error('Veri okunamadı, sıfırlanıyor:', e.message);
    }
    return emptyData();
}

function saveData(data) {
    const tmp = DATA_FILE + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
    fs.renameSync(tmp, DATA_FILE);
}

// ---- Şifre hash (scrypt) ----
function makeHash(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(password, Buffer.from(salt, 'hex'), 64).toString('hex');
    return salt + ':' + hash;
}
function verifyHash(password, stored) {
    const parts = String(stored || '').split(':');
    if (parts.length !== 2) return false;
    const [salt, hash] = parts;
    try {
        const computed = crypto.scryptSync(password, Buffer.from(salt, 'hex'), 64).toString('hex');
        // Sabit zamanlı karşılaştırma
        return computed.length === hash.length && crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(hash));
    } catch {
        return false;
    }
}
function makeToken() {
    return 'mtc_tok_' + crypto.randomBytes(32).toString('hex');
}

// Basit yazma mutex'i (tek process, async güvenliği)
let writeLock = Promise.resolve();
const withLock = (fn) => {
    const run = writeLock.then(() => fn());
    writeLock = run.catch(() => {});
    return run;
};

// ---- Yardımcılar ----
const norm = (s) => (s || '').toString().trim().toLowerCase();
const newId = (p) => p + '_' + Date.now() + '_' + crypto.randomBytes(4).toString('hex');

function findFriendship(data, a, b) {
    const A = norm(a), B = norm(b);
    return data.friendships.find(fr =>
        (norm(fr.a) === A && norm(fr.b) === B) || (norm(fr.a) === B && norm(fr.b) === A)
    );
}

// ---- App ----
const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

// API anahtarı kontrolü (header veya query)
function auth(req, res, next) {
    const key = req.headers['x-api-key'] || req.query.key;
    if (key !== API_KEY) {
        return res.status(401).json({ error: 'unauthorized' });
    }
    next();
}

// Oturum token kontrolü — req.user set eder
function authUser(req, res, next) {
    const token = req.headers['x-auth-token'];
    if (!token) return res.status(401).json({ error: 'oturum gerekli' });
    const data = loadData();
    const session = data.sessions.find(s => s.token === token);
    if (!session) return res.status(401).json({ error: 'geçersiz oturum' });
    const user = data.users.find(u => norm(u.email) === norm(session.email));
    if (!user) return res.status(401).json({ error: 'kullanıcı bulunamadı' });
    req.user = { id: user.id, email: user.email, name: user.name };
    next();
}

app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));
app.get('/app-ads.txt', (req, res) => {
    res.sendFile(path.join(__dirname, 'app-ads.txt'));
});

// Tarayıcıdan açılınca anlamlı bir durum sayfası
app.get('/', (req, res) => {
    res.type('html').send(`<!doctype html><html lang="tr"><head><meta charset="utf-8">
<title>Multitool Cloud</title><style>
body{font-family:system-ui,sans-serif;background:#0b1020;color:#e5e7eb;display:flex;min-height:100vh;margin:0;align-items:center;justify-content:center}
.card{background:#111827;border:1px solid #1f2937;border-radius:16px;padding:32px 40px;max-width:480px;text-align:center;box-shadow:0 0 40px rgba(99,102,241,.15)}
.dot{width:14px;height:14px;border-radius:50%;background:#22c55e;display:inline-block;margin-right:8px;box-shadow:0 0 10px #22c55e}
h1{font-size:22px;margin:8px 0 4px}
p{color:#9ca3af;margin:6px 0;font-size:14px}
code{background:#1f2937;padding:2px 8px;border-radius:6px;color:#a5b4fc;font-size:13px}
</style></head><body><div class="card">
<div><span class="dot"></span><strong>ONLINE</strong></div>
<h1>Multitool Cloud Backend</h1>
<p>Sunucu çalışıyor. Port: <code>3077</code></p>
<p>Sistem durumu: <a href="/api/health" style="color:#a5b4fc">/api/health</a></p>
<p style="font-size:12px;opacity:.6">pm2 process · multitool-cloud</p>
</div></body></html>`);
});

// --- Kimlik Doğrulama (Auth) ---
app.post('/api/auth/register', auth, async (req, res) => {
    const { email, password, name } = req.body || {};
    if (!email || !password || !name) return res.status(400).json({ error: 'Tüm alanlar gerekli' });
    if (password.length < 8) return res.status(400).json({ error: 'Şifre en az 8 karakter olmalı' });

    const E = norm(email);
    const result = await withLock(() => {
        const data = loadData();
        if (data.users.some(u => norm(u.email) === E)) {
            return { error: 'Bu e-posta zaten kayıtlı' };
        }
        const user = {
            id: newId('user'),
            email: email.trim(),
            name: name.trim(),
            passHash: makeHash(password),
            createdAt: new Date().toISOString()
        };
        data.users.push(user);
        const token = makeToken();
        data.sessions.push({ token, email: E, createdAt: new Date().toISOString() });
        saveData(data);
        return { token, user: { id: user.id, email: user.email, name: user.name } };
    });
    if (result.error) return res.status(400).json({ error: result.error });
    res.json(result);
});

app.post('/api/auth/login', auth, async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'E-posta ve şifre gerekli' });
    const E = norm(email);

    const result = await withLock(() => {
        const data = loadData();
        const user = data.users.find(u => norm(u.email) === E);
        if (!user || !verifyHash(password, user.passHash)) {
            return { error: 'E-posta veya şifre hatalı' };
        }
        const token = makeToken();
        data.sessions.push({ token, email: E, createdAt: new Date().toISOString() });
        saveData(data);
        return { token, user: { id: user.id, email: user.email, name: user.name } };
    });
    if (result.error) return res.status(401).json({ error: result.error });
    res.json(result);
});

app.post('/api/auth/logout', auth, authUser, async (req, res) => {
    const token = req.headers['x-auth-token'];
    await withLock(() => {
        const data = loadData();
        data.sessions = data.sessions.filter(s => s.token !== token);
        saveData(data);
    });
    res.json({ ok: true });
});

app.get('/api/auth/me', auth, authUser, (req, res) => {
    res.json({ user: req.user });
});

// --- Arkadaşlıklar (çift yönlü) ---
app.get('/api/friends', auth, (req, res) => {
    const email = norm(req.query.email);
    if (!email) return res.status(400).json({ error: 'email gerekli' });
    const data = loadData();
    const friends = data.friendships
        .filter(fr => norm(fr.a) === email || norm(fr.b) === email)
        .map(fr => {
            const isA = norm(fr.a) === email;
            const friendEmail = (isA ? fr.b : fr.a);
            return {
                id: fr.id,
                name: isA ? (fr.bName || friendEmail.split('@')[0]) : (fr.aName || friendEmail.split('@')[0]),
                email: friendEmail,
                shareCalendar: true
            };
        });
    res.json({ friends });
});

app.post('/api/friends', auth, async (req, res) => {
    const { a, aName, b, bName } = req.body || {};
    if (!a || !b) return res.status(400).json({ error: 'a ve b gerekli' });
    const A = norm(a), B = norm(b);
    if (A === B) return res.status(400).json({ error: 'aynı e-posta' });

    const result = await withLock(() => {
        const data = loadData();
        if (findFriendship(data, A, B)) {
            return { created: false, message: 'zaten arkadaş' };
        }
        const fr = {
            id: newId('friend'),
            a: A,
            aName: aName || A.split('@')[0],
            b: B,
            bName: bName || B.split('@')[0],
            createdAt: new Date().toISOString()
        };
        data.friendships.push(fr);
        saveData(data);
        return { created: true, friendship: fr };
    });
    res.json(result);
});

app.delete('/api/friends', auth, async (req, res) => {
    const { email, friend } = req.body || {};
    if (!email || !friend) return res.status(400).json({ error: 'email ve friend gerekli' });
    const A = norm(email), B = norm(friend);

    const result = await withLock(() => {
        const data = loadData();
        const before = data.friendships.length;
        data.friendships = data.friendships.filter(fr =>
            !((norm(fr.a) === A && norm(fr.b) === B) || (norm(fr.a) === B && norm(fr.b) === A))
        );
        const removed = data.friendships.length < before;
        if (removed) saveData(data);
        return { removed };
    });
    res.json(result);
});

// --- Arkadaşlık istekleri ---
app.get('/api/requests', auth, (req, res) => {
    const email = norm(req.query.email);
    if (!email) return res.status(400).json({ error: 'email gerekli' });
    const data = loadData();
    const requests = data.requests.filter(r =>
        norm(r.receiverEmail) === email && r.status === 'pending'
    );
    res.json({ requests });
});

// Bekleyen tüm istekleri döndür (gönderenin tekrar göndermemek için kontrolü)
app.get('/api/requests/all', auth, (req, res) => {
    const data = loadData();
    res.json({ requests: data.requests.filter(r => r.status === 'pending') });
});

app.post('/api/requests', auth, async (req, res) => {
    const { senderEmail, senderName, receiverEmail } = req.body || {};
    if (!senderEmail || !receiverEmail) return res.status(400).json({ error: 'senderEmail ve receiverEmail gerekli' });
    const S = norm(senderEmail), R = norm(receiverEmail);
    if (S === R) return res.status(400).json({ error: 'aynı e-posta' });

    const result = await withLock(() => {
        const data = loadData();
        // Zaten arkadaş mı?
        if (findFriendship(data, S, R)) {
            return { success: false, code: 'already_friend' };
        }
        // Bekleyen aynı istek var mı?
        const dupPending = data.requests.find(r =>
            norm(r.senderEmail) === S && norm(r.receiverEmail) === R && r.status === 'pending'
        );
        if (dupPending) {
            return { success: false, code: 'already_pending' };
        }
        // Karşı tarafın bana isteği var mı? Varsa otomatik arkadaş ol
        const reverse = data.requests.find(r =>
            norm(r.senderEmail) === R && norm(r.receiverEmail) === S && r.status === 'pending'
        );
        if (reverse) {
            reverse.status = 'accepted';
            const fr = {
                id: newId('friend'),
                a: R, aName: reverse.senderName || R.split('@')[0],
                b: S, bName: senderName || S.split('@')[0],
                createdAt: new Date().toISOString()
            };
            data.friendships.push(fr);
            // Diğer bekleyen aynı-yönlü istekleri de temizle
            data.requests = data.requests.filter(r => !(norm(r.senderEmail) === S && norm(r.receiverEmail) === R));
            saveData(data);
            return { success: true, code: 'mutual_accepted', friendship: fr };
        }
        const req = {
            id: newId('req'),
            senderEmail: senderEmail.trim(),
            senderName: senderName || senderEmail.split('@')[0],
            receiverEmail: receiverEmail.trim(),
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        data.requests.push(req);
        saveData(data);
        return { success: true, code: 'sent', request: req };
    });
    res.json(result);
});

app.post('/api/requests/:id/accept', auth, async (req, res) => {
    const id = req.params.id;
    const { receiverName } = req.body || {};
    const result = await withLock(() => {
        const data = loadData();
        const r = data.requests.find(rq => rq.id === id);
        if (!r) return { success: false, code: 'not_found' };
        r.status = 'accepted';
        const A = norm(r.senderEmail), B = norm(r.receiverEmail);
        if (!findFriendship(data, A, B)) {
            data.friendships.push({
                id: newId('friend'),
                a: A, aName: r.senderName || A.split('@')[0],
                b: B, bName: receiverName || B.split('@')[0],
                createdAt: new Date().toISOString()
            });
        }
        saveData(data);
        return { success: true, code: 'accepted' };
    });
    res.json(result);
});

app.delete('/api/requests/:id', auth, async (req, res) => {
    const id = req.params.id;
    const result = await withLock(() => {
        const data = loadData();
        const before = data.requests.length;
        data.requests = data.requests.filter(r => r.id !== id);
        if (data.requests.length < before) saveData(data);
        return { success: true };
    });
    res.json(result);
});

// --- Paylaşılan takvim ---
// --- Paylaşılan takvim ---
app.get('/api/calendar/:email', auth, (req, res) => {
    const email = norm(req.params.email);
    const viewerEmail = norm(req.query.viewerEmail);
    const data = loadData();

    const generalEvents = data.calendar[email] || [];
    const targetedShares = (data.shares || []).filter(sh => 
        norm(sh.ownerEmail) === email && 
        (!viewerEmail || norm(sh.targetFriendEmail) === viewerEmail || norm(sh.targetFriendEmail) === 'all')
    );

    let allEvents = [...generalEvents];
    targetedShares.forEach(sh => {
        if (Array.isArray(sh.events)) {
            sh.events.forEach(evt => {
                if (!allEvents.some(e => e.id === evt.id || (e.title === evt.title && e.date === evt.date))) {
                    allEvents.push(evt);
                }
            });
        }
    });

    res.json({ events: allEvents, shares: targetedShares });
});

// Belirli bir arkadaşa özel gün/hafta/ay/tümü takvim paylaşımı gönder
app.post('/api/calendar/share', auth, async (req, res) => {
    const { ownerEmail, ownerName, targetFriendEmail, scope, targetDate, events } = req.body || {};
    if (!ownerEmail || !targetFriendEmail || !Array.isArray(events)) {
        return res.status(400).json({ error: 'Eksik veya hatalı parametreler' });
    }

    const O = norm(ownerEmail);
    const T = norm(targetFriendEmail);

    const result = await withLock(() => {
        const data = loadData();
        if (!Array.isArray(data.shares)) data.shares = [];

        // Eski aynı kapsamdaki paylaşımı güncelle veya yenisini ekle
        const existingIdx = data.shares.findIndex(s => 
            norm(s.ownerEmail) === O && 
            norm(s.targetFriendEmail) === T && 
            s.scope === (scope || 'all') &&
            s.targetDate === (targetDate || '')
        );

        const shareItem = {
            id: newId('share'),
            ownerEmail: O,
            ownerName: ownerName || O.split('@')[0],
            targetFriendEmail: T,
            scope: scope || 'all',
            targetDate: targetDate || '',
            events: events.map(evt => ({
                id: evt.id || newId('evt'),
                userEmail: O,
                userName: ownerName || O.split('@')[0],
                title: evt.title || '',
                date: evt.date || '',
                time: evt.time || '',
                description: evt.description || '',
                createdAt: evt.createdAt || new Date().toISOString()
            })),
            createdAt: new Date().toISOString()
        };

        if (existingIdx !== -1) {
            data.shares[existingIdx] = shareItem;
        } else {
            data.shares.push(shareItem);
        }

        saveData(data);
        return { ok: true, share: shareItem };
    });

    res.json(result);
});

// Bir kullanıcının yaptığı ve aldığı aktif paylaşımları getir
app.get('/api/calendar/shares/active', auth, (req, res) => {
    const email = norm(req.query.email);
    if (!email) return res.status(400).json({ error: 'email gerekli' });
    const data = loadData();

    const sent = (data.shares || []).filter(s => norm(s.ownerEmail) === email);
    const received = (data.shares || []).filter(s => norm(s.targetFriendEmail) === email || norm(s.targetFriendEmail) === 'all');

    res.json({ sent, received });
});

// Paylaşımı Sil
app.delete('/api/calendar/share/:id', auth, async (req, res) => {
    const id = req.params.id;
    const result = await withLock(() => {
        const data = loadData();
        const before = (data.shares || []).length;
        data.shares = (data.shares || []).filter(s => s.id !== id);
        if (data.shares.length < before) saveData(data);
        return { ok: true };
    });
    res.json(result);
});

// Kullanıcının tüm genel paylaşılan etkinliklerini değiştir (replace)
app.put('/api/calendar/:email', auth, async (req, res) => {
    const email = norm(req.params.email);
    const { userName, events, shareCalendar } = req.body || {};
    const result = await withLock(() => {
        const data = loadData();
        if (shareCalendar === false || !Array.isArray(events)) {
            delete data.calendar[email];
        } else {
            data.calendar[email] = (events || []).map(evt => ({
                id: evt.id || newId('evt'),
                userEmail: email,
                userName: userName || email.split('@')[0],
                title: evt.title || '',
                date: evt.date || '',
                time: evt.time || '',
                description: evt.description || '',
                createdAt: evt.createdAt || new Date().toISOString()
            }));
        }
        saveData(data);
        return { ok: true };
    });
    res.json(result);
});

app.delete('/api/calendar/:email', auth, async (req, res) => {
    const email = norm(req.params.email);
    const result = await withLock(() => {
        const data = loadData();
        if (data.calendar[email]) {
            delete data.calendar[email];
            saveData(data);
        }
        return { ok: true };
    });
    res.json(result);
});

app.listen(PORT, HOST, () => {
    console.log(`Multitool Cloud backend ${HOST}:${PORT} üzerinde çalışıyor`);
});