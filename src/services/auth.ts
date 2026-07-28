// Multitool Cloud — Kimlik doğrulama (kullanıcının kendi sunucusu, Appwrite kullanılmıyor).

export interface UserAccount {
    id: string;
    email: string;
    name: string;
}

// Appwrite kaldırıldı; header başlığında gösterilen proje adı sabit olarak korunur.
export const APPWRITE_PROJECT_NAME = 'Multitool Cloud';

const PRIMARY_URL = (import.meta.env.VITE_CLOUD_SERVER_URL || 'https://dorukk.dev/multitool-cloud').replace(/\/$/, '');
const FALLBACK_URLS = [
    PRIMARY_URL,
    'https://dorukk.dev/multitool-cloud'
].filter((v, i, a) => Boolean(v) && a.indexOf(v) === i);

const API_KEY = import.meta.env.VITE_CLOUD_API_KEY || 'mtc_sk_24fe2f8b30d8ea5943a45e5c4cac5193054b';
const TOKEN_KEY = 'multitool_cloud_token';
const USER_KEY = 'multitool_cloud_user';

function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}
function setToken(token: string | null) {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
}

async function _fetchCandidate(path: string, options: RequestInit): Promise<Response> {
    for (const baseUrl of FALLBACK_URLS) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);
            const res = await fetch(baseUrl + path, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            return res;
        } catch {
            // try next fallback
        }
    }
    throw new Error('Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.');
}

async function _post(path: string, body: any, withToken = false): Promise<any> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
    };
    if (withToken) {
        const tok = getToken();
        if (tok) headers['x-auth-token'] = tok;
    }
    const res = await _fetchCandidate(path, {
        method: 'POST',
        headers,
        body: JSON.stringify(body || {})
    });
    let data: any = {};
    try { data = await res.json(); } catch { }
    if (!res.ok) throw new Error(data?.error || `server_${res.status}`);
    return data;
}

async function _get(path: string): Promise<any> {
    const tok = getToken();
    const res = await _fetchCandidate(path, {
        headers: {
            'x-api-key': API_KEY,
            ...(tok ? { 'x-auth-token': tok } : {})
        }
    });
    let data: any = {};
    try { data = await res.json(); } catch { }
    if (!res.ok) throw new Error(data?.error || `server_${res.status}`);
    return data;
}

export const authService = {
    // Mevcut oturum açmış kullanıcıyı getir
    async getCurrentUser(): Promise<UserAccount | null> {
        if (!getToken()) return null;
        try {
            const data = await _get('/api/auth/me');
            const user = data.user as UserAccount;
            localStorage.setItem(USER_KEY, JSON.stringify(user));
            return user;
        } catch {
            setToken(null);
            return null;
        }
    },

    // Yeni Kullanıcı Kaydı
    async register(email: string, pass: string, name: string) {
        try {
            const data = await _post('/api/auth/register', { email, password: pass, name });
            setToken(data.token);
            const user = data.user as UserAccount;
            localStorage.setItem(USER_KEY, JSON.stringify(user));
            return user;
        } catch (error: any) {
            throw new Error(error.message || 'Kayıt olunurken bir hata oluştu');
        }
    },

    // E-posta ve Şifre ile Giriş
    async login(email: string, pass: string) {
        try {
            const data = await _post('/api/auth/login', { email, password: pass });
            setToken(data.token);
            const user = data.user as UserAccount;
            localStorage.setItem(USER_KEY, JSON.stringify(user));
            return user;
        } catch (error: any) {
            throw new Error(error.message || 'Giriş yapılırken bir hata oluştu');
        }
    },

    // Oturumu Kapat (Çıkış Yap)
    async logout() {
        try {
            await _post('/api/auth/logout', {}, true);
        } catch (error: any) {
            // Token zaten geçersiz olabilir, sessizce devam et
        }
        setToken(null);
        localStorage.removeItem(USER_KEY);
    },

    // E-posta doğrulama — Appwrite kaldırıldığı için artık kullanılmıyor (no-op)
    async sendVerification() {
        return { ok: true };
    },

    async confirmVerification() {
        return { ok: true };
    }
};