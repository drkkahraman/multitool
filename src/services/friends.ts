// Multitool Cloud — arkadaşlar, arkadaşlık istekleri ve paylaşılan takvim.
// Tüm bulut verisi kullanıcının kendi sunucusundaki HTTP API'ye gider (jsonblob/Appwrite bırakıldı).

export interface FriendRequest {
    id: string;
    senderEmail: string;
    senderName: string;
    receiverEmail: string;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: string;
}

export interface UserFriend {
    id: string;
    name: string;
    email: string;
    isPrivate?: boolean;
    shareCalendar?: boolean;
}

export interface UserPrivacySettings {
    isPrivate: boolean; // Hesabı gizli yap
    shareCalendar: boolean; // Takvimi arkadaşlara aç
}

export interface SharedCalendarEvent {
    id: string;
    userEmail: string;
    userName: string;
    title: string;
    date: string;
    time?: string;
    description?: string;
    createdAt: string;
}

const FRIENDS_STORAGE_KEY = 'multitool_cloud_friends';
const REQUESTS_STORAGE_KEY = 'multitool_cloud_requests';
const PRIVACY_STORAGE_KEY = 'multitool_cloud_privacy';
const SHARED_CALENDAR_KEY = 'multitool_cloud_shared_events';

const PRIMARY_URL = (import.meta.env.VITE_CLOUD_SERVER_URL || 'https://dorukk.dev/multitool-cloud').replace(/\/$/, '');
const FALLBACK_URLS = [
    PRIMARY_URL,
    'https://dorukk.dev/multitool-cloud'
].filter((v, i, a) => Boolean(v) && a.indexOf(v) === i);

const API_KEY = import.meta.env.VITE_CLOUD_API_KEY || 'mtc_sk_24fe2f8b30d8ea5943a45e5c4cac5193054b';

const norm = (s: string) => (s || '').trim().toLowerCase();

// Sunucu API çağrısı yardımcısı
async function _api(path: string, method: string = 'GET', body?: any): Promise<any> {
    const opts: RequestInit = {
        method,
        headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY }
    };
    if (body !== undefined && body !== null) opts.body = JSON.stringify(body);

    let res: Response | null = null;
    for (const baseUrl of FALLBACK_URLS) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);
            res = await fetch(baseUrl + path, {
                ...opts,
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (res) break;
        } catch {
            // try next fallback
        }
    }

    if (!res) {
        throw new Error('Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.');
    }

    let data: any = {};
    try { data = await res.json(); } catch { }
    if (!res.ok) throw new Error(data?.error || `server_${res.status}`);
    return data;
}

export const friendsService = {
    // Gizlilik ayarlarını getir
    getPrivacySettings(): UserPrivacySettings {
        try {
            const data = localStorage.getItem(PRIVACY_STORAGE_KEY);
            return data ? JSON.parse(data) : { isPrivate: false, shareCalendar: true };
        } catch {
            return { isPrivate: false, shareCalendar: true };
        }
    },

    // Gizlilik ayarlarını kaydet
    savePrivacySettings(settings: UserPrivacySettings) {
        localStorage.setItem(PRIVACY_STORAGE_KEY, JSON.stringify(settings));
    },

    // Arkadaşlar listesini getir (yerel önbellek, çevrimdışı yedek)
    getFriends(): UserFriend[] {
        try {
            const data = localStorage.getItem(FRIENDS_STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    },

    // Sunucudan arkadaşları çek ve yerel önbelleği güncelle (yerel arkadaşları koruyarak birleştir)
    async getFriendsAsync(userEmail?: string): Promise<UserFriend[]> {
        if (!userEmail) return this.getFriends();
        try {
            const data = await _api('/api/friends?email=' + encodeURIComponent(norm(userEmail)));
            const serverFriends: UserFriend[] = data.friends || [];
            const localFriends = this.getFriends();
            
            const merged = [...serverFriends];
            for (const lf of localFriends) {
                if (!merged.some(sf => norm(sf.email) === norm(lf.email))) {
                    merged.push(lf);
                }
            }
            localStorage.setItem(FRIENDS_STORAGE_KEY, JSON.stringify(merged));
            return merged;
        } catch (e) {
            console.warn('Sunucudan arkadaşlar alınamadı, yerel önbellek kullanılıyor:', e);
            return this.getFriends();
        }
    },

    // Senkron bekleyen istekleri getir (UI rozeti için, yerel önbellekten)
    getPendingRequestsSync(receiverEmail?: string): FriendRequest[] {
        try {
            const data = localStorage.getItem(REQUESTS_STORAGE_KEY);
            const reqs: FriendRequest[] = data ? JSON.parse(data) : [];
            if (receiverEmail) {
                return reqs.filter(r => r.status === 'pending' && norm(r.receiverEmail) === norm(receiverEmail));
            }
            return reqs.filter(r => r.status === 'pending');
        } catch {
            return [];
        }
    },

    // Bekleyen istekleri sunucudan çek, yerel önbelleği güncelle
    async getPendingRequests(receiverEmail?: string): Promise<FriendRequest[]> {
        if (!receiverEmail) return this.getPendingRequestsSync();
        try {
            const data = await _api('/api/requests?email=' + encodeURIComponent(norm(receiverEmail)));
            const reqs: FriendRequest[] = data.requests || [];
            localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(reqs));
            return reqs;
        } catch (e) {
            console.warn('Sunucudan istekler alınamadı, yerel önbellek kullanılıyor:', e);
            return this.getPendingRequestsSync(receiverEmail);
        }
    },

    // Arkadaş İsteği Gönder — code alanı arayüzde çeviri için kullanılır
    async sendFriendRequest(currentUserEmail: string, currentUserName: string, targetEmail: string): Promise<{ success: boolean; message: string; code?: string }> {
        if (!targetEmail || norm(targetEmail) === norm(currentUserEmail)) {
            return { success: false, message: 'Kendi e-posta adresinize arkadaş isteği gönderemezsiniz.', code: 'self_request' };
        }

        try {
            const res = await _api('/api/requests', 'POST', {
                senderEmail: currentUserEmail.trim(),
                senderName: currentUserName || currentUserEmail.split('@')[0],
                receiverEmail: targetEmail.trim()
            });
            // Sunucu: {success, code}
            return {
                success: !!res.success,
                message: res.code || '',
                code: res.code || 'sent'
            };
        } catch (e: any) {
            // Sunucu 400 ile code döndürebilir (already_friend, already_pending, aynı e-posta)
            if (e.message === 'already_friend' || e.message === 'already_pending' || e.message === 'aynı e-posta') {
                return { success: false, message: e.message, code: e.message };
            }
            return { success: false, message: 'Sunucuyla iletişim kurulamadı.', code: 'network_error' };
        }
    },

    // İsteği Kabul Et — sunucu çift yönlü arkadaşlık oluşturur
    async acceptRequest(requestId: string, receiverName?: string): Promise<boolean> {
        try {
            await _api('/api/requests/' + encodeURIComponent(requestId) + '/accept', 'POST', { receiverName });

            // İsteği yerel önbellekte güncelle ve arkadaş olarak ekle (anlık geri bildirim)
            try {
                const localRequests: FriendRequest[] = JSON.parse(localStorage.getItem(REQUESTS_STORAGE_KEY) || '[]');
                const req = localRequests.find(r => r.id === requestId);
                if (req) {
                    req.status = 'accepted';
                    localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(localRequests));
                    const friends = this.getFriends();
                    if (!friends.some(f => norm(f.email) === norm(req.senderEmail))) {
                        const friendName = req.senderName || req.senderEmail.split('@')[0] || req.senderEmail;
                        friends.push({ id: 'friend_' + Date.now(), name: friendName, email: req.senderEmail, shareCalendar: true });
                        localStorage.setItem(FRIENDS_STORAGE_KEY, JSON.stringify(friends));
                    }
                }
            } catch { }
            return true;
        } catch (e) {
            console.warn('İstek kabul edilemedi:', e);
            return false;
        }
    },

    // İsteği Reddet
    async rejectRequest(requestId: string): Promise<boolean> {
        try { await _api('/api/requests/' + encodeURIComponent(requestId), 'DELETE'); } catch (e) { console.warn(e); }
        try {
            const localRequests: FriendRequest[] = JSON.parse(localStorage.getItem(REQUESTS_STORAGE_KEY) || '[]');
            localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(localRequests.filter(r => r.id !== requestId)));
        } catch { }
        return true;
    },

    // Arkadaş Çıkar — sunucudan ve yerelden kaldırır
    async removeFriend(friendEmail: string, currentUserEmail?: string): Promise<boolean> {
        const friendLower = norm(friendEmail);
        try {
            const friends = this.getFriends();
            localStorage.setItem(FRIENDS_STORAGE_KEY, JSON.stringify(friends.filter(f => norm(f.email) !== friendLower)));
        } catch { }

        if (!currentUserEmail) return false;
        try {
            await _api('/api/friends', 'DELETE', { email: currentUserEmail, friend: friendEmail });
        } catch (e) {
            console.warn('Sunucudan arkadaş kaldırılamadı:', e);
        }
        return true;
    },

    // Kendi takvim etkinliklerini sunucuda yayınla.
    // Gizlilik ayarına sayar: shareCalendar kapalıysa etkinlikleri kaldırır.
    async publishMyCalendarEvents(userEmail: string, userName: string, events: any[]): Promise<boolean> {
        if (!userEmail) return false;
        const { shareCalendar } = this.getPrivacySettings();
        try {
            await _api('/api/calendar/' + encodeURIComponent(norm(userEmail)), 'PUT', {
                userName: userName || userEmail.split('@')[0],
                events,
                shareCalendar
            });
            return true;
        } catch (e) {
            console.warn('Takvim yayınlanamadı:', e);
            return false;
        }
    },

    // Takvim paylaşımını kaldır
    async unpublishMyCalendarEvents(userEmail: string): Promise<boolean> {
        if (!userEmail) return false;
        try {
            await _api('/api/calendar/' + encodeURIComponent(norm(userEmail)), 'DELETE');
        } catch (e) {
            console.warn('Takvim kaldırılamadı:', e);
        }
        return true;
    },

    // Arkadaşın paylaştığı takvim etkinliklerini getir (viewerEmail ile özel paylaşımları da kapsar)
    async getFriendCalendarEvents(friendEmail: string, viewerEmail?: string): Promise<SharedCalendarEvent[]> {
        if (!friendEmail) return [];
        try {
            const url = '/api/calendar/' + encodeURIComponent(norm(friendEmail)) + (viewerEmail ? '?viewerEmail=' + encodeURIComponent(norm(viewerEmail)) : '');
            const data = await _api(url);
            return data.events || [];
        } catch (e) {
            console.warn('Arkadaş takvimi alınamadı:', e);
            return [];
        }
    },

    // Belirli bir arkadaşa özel gün / hafta / ay / tüm takvimi paylaş
    async shareTargetedCalendar(
        ownerEmail: string,
        ownerName: string,
        targetFriendEmail: string,
        scope: 'day' | 'week' | 'month' | 'all',
        targetDate: string,
        events: any[]
    ): Promise<{ success: boolean; message?: string }> {
        if (!ownerEmail || !targetFriendEmail) return { success: false, message: 'Geçersiz kullanıcı bilgisi' };
        try {
            await _api('/api/calendar/share', 'POST', {
                ownerEmail: norm(ownerEmail),
                ownerName: ownerName || ownerEmail.split('@')[0],
                targetFriendEmail: norm(targetFriendEmail),
                scope,
                targetDate: targetDate || '',
                events
            });
            return { success: true };
        } catch (e: any) {
            console.warn('Hedefli takvim paylaşılamadı:', e);
            return { success: false, message: e.message || 'Paylaşım başarısız' };
        }
    },

    // Aktif paylaşımları getir (gönderilen / alınan)
    async getActiveShares(userEmail: string): Promise<{ sent: any[]; received: any[] }> {
        if (!userEmail) return { sent: [], received: [] };
        try {
            const data = await _api('/api/calendar/shares/active?email=' + encodeURIComponent(norm(userEmail)));
            return { sent: data.sent || [], received: data.received || [] };
        } catch (e) {
            console.warn('Aktif paylaşımlar alınamadı:', e);
            return { sent: [], received: [] };
        }
    },

    // Paylaşımı Sil
    async deleteShare(shareId: string): Promise<boolean> {
        if (!shareId) return false;
        try {
            await _api('/api/calendar/share/' + encodeURIComponent(shareId), 'DELETE');
            return true;
        } catch (e) {
            console.warn('Paylaşım silinemedi:', e);
            return false;
        }
    },

    // Paylaşılan Takvim Etkinlikleri (yerel — geri uyumluluk)
    getSharedCalendarEvents() {
        try {
            const data = localStorage.getItem(SHARED_CALENDAR_KEY);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    },

    addSharedCalendarEvent(event: any) {
        const events = this.getSharedCalendarEvents();
        events.push({ ...event, id: 'shared_' + Date.now() });
        localStorage.setItem(SHARED_CALENDAR_KEY, JSON.stringify(events));
    }
};