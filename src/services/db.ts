// IndexedDB Storage Service for Audio Recordings and Large Data Assets
// Handles large media files without hitting browser localStorage 5MB quota limits.

const DB_NAME = 'MultitoolAppDB';
const DB_VERSION = 1;
const STORE_AUDIO = 'audio_notes';

function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        if (typeof window === 'undefined' || !window.indexedDB) {
            reject(new Error('IndexedDB is not supported in this environment.'));
            return;
        }
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_AUDIO)) {
                db.createObjectStore(STORE_AUDIO);
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export const dbService = {
    async setAudioNote(id: string, base64Data: string): Promise<boolean> {
        try {
            const db = await openDB();
            return new Promise((resolve, reject) => {
                const tx = db.transaction(STORE_AUDIO, 'readwrite');
                const store = tx.objectStore(STORE_AUDIO);
                const req = store.put(base64Data, id);
                req.onsuccess = () => resolve(true);
                req.onerror = () => reject(req.error);
            });
        } catch (e) {
            console.warn('Failed to save audio to IndexedDB:', e);
            return false;
        }
    },

    async getAudioNote(id: string): Promise<string | null> {
        try {
            const db = await openDB();
            return new Promise((resolve, reject) => {
                const tx = db.transaction(STORE_AUDIO, 'readonly');
                const store = tx.objectStore(STORE_AUDIO);
                const req = store.get(id);
                req.onsuccess = () => resolve(req.result || null);
                req.onerror = () => reject(req.error);
            });
        } catch (e) {
            console.warn('Failed to read audio from IndexedDB:', e);
            return null;
        }
    },

    async deleteAudioNote(id: string): Promise<boolean> {
        try {
            const db = await openDB();
            return new Promise((resolve, reject) => {
                const tx = db.transaction(STORE_AUDIO, 'readwrite');
                const store = tx.objectStore(STORE_AUDIO);
                const req = store.delete(id);
                req.onsuccess = () => resolve(true);
                req.onerror = () => reject(req.error);
            });
        } catch (e) {
            console.warn('Failed to delete audio from IndexedDB:', e);
            return false;
        }
    }
};
