/**
 * Start.io Ad Service for Multitool
 * -------------------------------
 * - Interstitial: periyodik (5 dk) + manuel tetikleme. VIP kullanıcılar muaf.
 * - Rewarded video: izleyene 2 saat reklamsız pencere.
 * - VIP kontrolü: sunucudan gelen user.vip alanı (fallback: e-posta whitelist).
 *
 * Native köprü (AndroidNative):
 *   showStartIoAd()           -> interstitial
 *   showUnityRewardedAd()     -> Start.io REWARDED_VIDEO (isim Unity kalsa da)
 *   Eventler: startio-reward-earned | startio-ad-shown | startio-ad-closed
 */

export const START_IO_APP_ID = '206953182';

// VIP e-posta listesi — sunucu tarafındaki VIP_EMAILS ile aynı.
// Offline / eski önbelleğe alınmış kullanıcı nesnesi için yedek (fallback) olarak kullanılır.
const VIP_EMAILS = new Set([
    'ebrumetek@gmail.com',
    'akbulutk@gmail.com',
    'drkkahraman@gmail.com'
].map(e => e.trim().toLowerCase()));

const ADFREE_KEY = 'multitool_adfree_until';
const ADFREE_DURATION_MS = 2 * 60 * 60 * 1000; // 2 saat
const PERIODIC_AD_INTERVAL_MS = 5 * 60 * 1000;  // 5 dakika

let adTimer: any = null;
let rewardListenerBound = false;

// Giriş yapmış kullanıcının VIP (kalıcı muaf) olup olmadığını döndürür.
// Önce sunucudan gelen user.vip alanına, yoksa e-posta whitelist'ine bakar.
export const isAdExempt = (): boolean => {
    try {
        const raw = localStorage.getItem('multitool_cloud_user');
        if (raw) {
            const user = JSON.parse(raw);
            if (user && user.vip === true) return true;
            if (user && typeof user.email === 'string' && VIP_EMAILS.has(user.email.trim().toLowerCase())) {
                return true;
            }
        }
    } catch {
        // yok say
    }
    return false;
};

// --- Geçici reklamsız pencere (rewarded ödülü) ---
export const getAdFreeUntil = (): number => {
    const raw = localStorage.getItem(ADFREE_KEY);
    const ts = raw ? parseInt(raw, 10) : 0;
    return isNaN(ts) ? 0 : ts;
};

export const isAdFreeActive = (): boolean => {
    return Date.now() < getAdFreeUntil();
};

export const grantTwoHoursAdFree = (): number => {
    const until = Date.now() + ADFREE_DURATION_MS;
    localStorage.setItem(ADFREE_KEY, String(until));
    return until;
};

export const getRemainingAdFreeTimeFormatted = (): string => {
    const remaining = getAdFreeUntil() - Date.now();
    if (remaining <= 0) return '0 dk';
    const totalMin = Math.floor(remaining / 60000);
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return h > 0 ? `${h} sa ${m} dk` : `${m} dk`;
};

// Reklam göstermeli mi? VIP (kalıcı) veya aktif reklamsız pencere varsa hayır.
const shouldShowAds = (): boolean => {
    return !isAdExempt() && !isAdFreeActive();
};

// --- Interstitial ---
export const triggerStartIoAd = (forceManual: boolean = false): void => {
    // VIP ve aktif reklamsız pencere: atla (manuel test zorlanırsa bile VIP atlar).
    if (isAdExempt()) {
        console.log('[Start.io] Ad bypassed for VIP user.');
        return;
    }
    if (!forceManual && isAdFreeActive()) {
        console.log('[Start.io] Ad bypassed (ad-free window active).');
        return;
    }

    try {
        if (typeof window !== 'undefined' && (window as any).AndroidNative?.showStartIoAd) {
            (window as any).AndroidNative.showStartIoAd();
        } else {
            // Web önizleme (tarayıcıda native köprü yok)
            console.log(`[Start.io] Web ad trigger (App ID: ${START_IO_APP_ID})`);
            window.dispatchEvent(new CustomEvent('show-startio-web-ad'));
        }
    } catch (e) {
        console.error('[Start.io] Error triggering ad:', e);
    }
};

// Legacy alias
export const triggerUnityInterstitialAd = triggerStartIoAd;

// Native taraftan gelen "ödül kazanıldı" olayını dinle ve 2 saat reklamsız ver.
export const bindRewardListener = (): void => {
    if (rewardListenerBound || typeof window === 'undefined') return;
    rewardListenerBound = true;
    window.addEventListener('startio-reward-earned', () => {
        grantTwoHoursAdFree();
        console.log('[Start.io] Reward earned — 2h ad-free granted.');
        window.dispatchEvent(new CustomEvent('startio-reward-granted'));
    });
};

// Modül yüklendiğinde dinleyiciyi otomatik bağla
if (typeof window !== 'undefined') {
    bindRewardListener();
}

// --- Start.io Rewarded video: 2 saat reklamsız ---
export const triggerStartIoRewardedAd = (): void => {
    bindRewardListener();
    try {
        if (typeof window !== 'undefined' && (window as any).AndroidNative?.showUnityRewardedAd) {
            (window as any).AndroidNative.showUnityRewardedAd();
        } else {
            // Web ortamında native köprü yoksa simulated reklam göster ve ödül ver
            console.log('[Start.io] Web rewarded simulated — launching web ad modal.');
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('show-rewarded-web-ad'));
            }
        }
    } catch (e) {
        console.error('[Start.io] Error triggering rewarded ad:', e);
    }
};

// Legacy alias
export const triggerUnityRewardedAd = triggerStartIoRewardedAd;

// Kullanıcı aksiyon sayacı (şimdilik yer tutucu — istenirse frekans kontrolü için kullanılır).
export const trackUserActionForAd = (): void => {
    // reserved for future action-based ad frequency
};

// 5 dakikalık periyodik interstitial timer — yalnızca reklam göstermesi gereken kullanıcılar için.
export const initPeriodicAdTimer = (): void => {
    if (adTimer) clearInterval(adTimer);
    bindRewardListener();

    if (!shouldShowAds()) {
        console.log('[Start.io] Periodic ad timer disabled (VIP or ad-free window).');
        return;
    }

    console.log('[Start.io] Periodic 5-minute ad timer initialized.');
    adTimer = setInterval(() => {
        if (shouldShowAds()) {
            triggerStartIoAd();
        }
    }, PERIODIC_AD_INTERVAL_MS);
};

export const getAppAdsTxtUrl = (): string => {
    return '/app-ads.txt';
};