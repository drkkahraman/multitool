import React, { useState, useEffect } from 'react';
import {
    Cloud,
    User,
    Lock,
    Mail,
    LogOut,
    CheckCircle2,
    AlertCircle,
    Loader2,
    X,
    Users,
    UserPlus,
    Bell,
    EyeOff,
    UserCheck,
    UserX,
    Calendar as CalendarIcon,
    ArrowLeft,
    RefreshCw
} from 'lucide-react';
import { authService, type UserAccount, APPWRITE_PROJECT_NAME } from '../services/auth';
import { friendsService, type FriendRequest, type UserFriend, type UserPrivacySettings, type SharedCalendarEvent } from '../services/friends';

interface CloudAuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    language?: string;
    onUserChanged?: (user: UserAccount | null) => void;
    initialMode?: 'login' | 'register';
}

const TRANSLATIONS: Record<string, any> = {
    tr: {
        subtitle: "Appwrite Güvenli Bulut Hesabı",
        tabProfile: "Profil & Gizlilik",
        tabFriends: "Arkadaşlar",
        tabRequests: "İstekler",
        cloudConnected: "Bulut Senkronizasyonu Aktif",
        logout: "Oturumu Kapat",
        privacyHeading: "Gizlilik ve Paylaşım Ayarları",
        makePrivateTitle: "🔒 Hesabı Gizli Yap",
        makePrivateSub: "Aramalarda ve arkadaş önerilerinde gizlenir.",
        shareCalendarTitle: "📅 Takvimimi Arkadaşlarımla Paylaş",
        shareCalendarSub: "Eklenen arkadaşlarınız etkinliklerinizi görebilir.",
        searchFriendPlaceholder: "Arkadaşının E-posta Adresi...",
        addBtn: "İstek Gönder",
        myFriends: "ARKADAŞLARIM",
        noFriends: "Henüz eklenmiş bir arkadaşınız yok. E-posta adresi ile hemen ekleyin!",
        calendarSharedTag: "📅 Takvim Paylaşıldı",
        pendingRequestsTitle: "GELEN ARKADAŞLIK İSTEKLERİ",
        noRequests: "Bekleyen arkadaşlık isteğiniz bulunmuyor.",
        acceptBtn: "Kabul Et",
        rejectBtn: "Reddet",
        tabLogin: "Giriş Yap",
        tabRegister: "Kayıt Ol",
        nameLabel: "Ad Soyad",
        emailLabel: "E-Posta Adresi",
        passwordLabel: "Şifre",
        submitLogin: "Giriş Yap",
        submitRegister: "Hesabımı Oluştur",
        checkingAuth: "Oturum kontrol ediliyor...",
        loginSuccess: "Giriş başarılı! Bulut senkronizasyonu aktif.",
        registerSuccess: "Hesabınız başarıyla oluşturuldu!",
        loggedOutMsg: "Oturum kapatıldı.",
        hasAccountLink: "Zaten bir hesabın var mı? Giriş Yap!",
        noAccountLink: "Hesabın yok mu? Hemen Kayıt Ol!",
        backBtn: "Geri",
        refreshTitle: "Yenile",
        calendarLoading: "Takvim çekiliyor...",
        friendCalendarEmpty: "Bu arkadaş henüz takvim etkinliği paylaşmadı veya takvimi boş.",
        viewCalendarBtn: "Takvimi Gör",
        removeFriendTitle: "Arkadaşlıktan Çıkar",
        loginErrorDefault: "Giriş başarısız. Lütfen bilgilerinizi kontrol edin.",
        registerErrorDefault: "Kayıt başarısız oldu.",
        fillAllFields: "Lütfen tüm alanları doldurun.",
        enterEmailPassword: "Lütfen e-posta ve şifrenizi girin.",
        passwordMinLength: "Şifre en az 8 karakter olmalıdır.",
        logoutErrorDefault: "Çıkış yapılırken bir hata oluştu.",
        msgSelfRequest: "Kendi e-posta adresinize arkadaş isteği gönderemezsiniz.",
        msgAlreadyFriend: "Bu kullanıcı zaten arkadaş listenizde.",
        msgAlreadyPending: "Bu kullanıcıya zaten beklemede olan bir arkadaş isteği gönderdiniz.",
        msgSent: "{email} adresine arkadaş isteği gönderildi!",
        msgMutualAccepted: "Karşılıklı istek algılandı, arkadaşlığınız oluşturuldu!",
        msgSavedLocalOnly: "İstek yerel olarak kaydedildi ama bulut rölesi şu an yanıt vermiyor.",
        msgNetworkError: "Sunucuyla iletişim kurulamadı. Bağlantınızı kontrol edin."
    },
    en: {
        subtitle: "Appwrite Secure Cloud Account",
        tabProfile: "Profile & Privacy",
        tabFriends: "Friends",
        tabRequests: "Requests",
        cloudConnected: "Cloud Sync Active",
        logout: "Log Out",
        privacyHeading: "Privacy & Sharing Settings",
        makePrivateTitle: "🔒 Private Account",
        makePrivateSub: "Hidden from search and friend recommendations.",
        shareCalendarTitle: "📅 Share Calendar with Friends",
        shareCalendarSub: "Connected friends can view your scheduled events.",
        searchFriendPlaceholder: "Friend's Email Address...",
        addBtn: "Send Request",
        myFriends: "MY FRIENDS",
        noFriends: "No friends added yet. Add one using their email address!",
        calendarSharedTag: "📅 Calendar Shared",
        pendingRequestsTitle: "INCOMING FRIEND REQUESTS",
        noRequests: "No pending friend requests.",
        acceptBtn: "Accept",
        rejectBtn: "Reject",
        tabLogin: "Log In",
        tabRegister: "Register",
        nameLabel: "Full Name",
        emailLabel: "Email Address",
        passwordLabel: "Password",
        submitLogin: "Log In",
        submitRegister: "Create Account",
        checkingAuth: "Checking session...",
        loginSuccess: "Login successful! Cloud sync active.",
        registerSuccess: "Account created successfully!",
        loggedOutMsg: "Logged out successfully.",
        hasAccountLink: "Already have an account? Log In!",
        noAccountLink: "Don't have an account? Register Now!",
        backBtn: "Back",
        refreshTitle: "Refresh",
        calendarLoading: "Loading calendar...",
        friendCalendarEmpty: "This friend hasn't shared any calendar events yet, or their calendar is empty.",
        viewCalendarBtn: "View Calendar",
        removeFriendTitle: "Remove Friend",
        loginErrorDefault: "Login failed. Please check your credentials.",
        registerErrorDefault: "Registration failed.",
        fillAllFields: "Please fill in all fields.",
        enterEmailPassword: "Please enter your email and password.",
        passwordMinLength: "Password must be at least 8 characters.",
        logoutErrorDefault: "An error occurred while logging out.",
        msgSelfRequest: "You cannot send a friend request to your own email address.",
        msgAlreadyFriend: "This user is already in your friends list.",
        msgAlreadyPending: "You already have a pending friend request to this user.",
        msgSent: "Friend request sent to {email}!",
        msgMutualAccepted: "Mutual request detected — you are now friends!",
        msgSavedLocalOnly: "Request saved locally, but the cloud relay is not responding right now.",
        msgNetworkError: "Could not reach the server. Check your connection."
    },
    de: {
        subtitle: "Appwrite Sicheres Cloud-Konto",
        tabProfile: "Profil & Datenschutz",
        tabFriends: "Freunde",
        tabRequests: "Anfragen",
        cloudConnected: "Cloud-Synchronisation aktiv",
        logout: "Abmelden",
        privacyHeading: "Datenschutz- & Freigabeeinstellungen",
        makePrivateTitle: "🔒 Privates Konto",
        makePrivateSub: "In Suche und Freundesvorschlägen ausgeblendet.",
        shareCalendarTitle: "📅 Kalender mit Freunden teilen",
        shareCalendarSub: "Hinzugefügte Freunde können Ihre Termine sehen.",
        searchFriendPlaceholder: "E-Mail-Adresse des Freundes...",
        addBtn: "Senden",
        myFriends: "MEINE FREUNDE",
        noFriends: "Noch keine Freunde hinzugefügt. Über E-Mail hinzufügen!",
        calendarSharedTag: "📅 Kalender geteilt",
        pendingRequestsTitle: "EINGEHENDE FREUNDSCHAFTSANFRAGEN",
        noRequests: "Keine ausstehenden Freundschaftsanfragen.",
        acceptBtn: "Annehmen",
        rejectBtn: "Ablehnen",
        tabLogin: "Anmelden",
        tabRegister: "Registrieren",
        nameLabel: "Vollständiger Name",
        emailLabel: "E-Mail-Adresse",
        passwordLabel: "Passwort",
        submitLogin: "Anmelden",
        submitRegister: "Konto erstellen",
        checkingAuth: "Sitzung wird geprüft...",
        loginSuccess: "Anmeldung erfolgreich! Cloud-Synch aktiv.",
        registerSuccess: "Konto erfolgreich erstellt!",
        loggedOutMsg: "Erfolgreich abgemeldet.",
        hasAccountLink: "Bereits ein Konto? Anmelden!",
        noAccountLink: "Noch kein Konto? Jetzt registrieren!",
        backBtn: "Zurück",
        refreshTitle: "Aktualisieren",
        calendarLoading: "Kalender wird geladen...",
        friendCalendarEmpty: "Dieser Freund hat noch keine Kalendertermine geteilt oder der Kalender ist leer.",
        viewCalendarBtn: "Kalender ansehen",
        removeFriendTitle: "Freund entfernen",
        loginErrorDefault: "Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Daten.",
        registerErrorDefault: "Registrierung fehlgeschlagen.",
        fillAllFields: "Bitte füllen Sie alle Felder aus.",
        enterEmailPassword: "Bitte E-Mail und Passwort eingeben.",
        passwordMinLength: "Das Passwort muss mindestens 8 Zeichen lang sein.",
        logoutErrorDefault: "Beim Abmelden ist ein Fehler aufgetreten.",
        msgSelfRequest: "Sie können keine Freundschaftsanfrage an Ihre eigene E-Mail-Adresse senden.",
        msgAlreadyFriend: "Dieser Benutzer ist bereits in Ihrer Freundesliste.",
        msgAlreadyPending: "Sie haben diesem Benutzer bereits eine ausstehende Freundschaftsanfrage gesendet.",
        msgSent: "Freundschaftsanfrage an {email} gesendet!",
        msgMutualAccepted: "Gegenseitige Anfrage erkannt — Sie sind jetzt Freunde!",
        msgSavedLocalOnly: "Anfrage lokal gespeichert, aber das Cloud-Relay reagiert gerade nicht.",
        msgNetworkError: "Server konnte nicht erreicht werden. Verbindung prüfen."
    },
    es: {
        subtitle: "Cuenta segura en la nube de Appwrite",
        tabProfile: "Perfil y Privacidad",
        tabFriends: "Amigos",
        tabRequests: "Solicitudes",
        cloudConnected: "Sincronización en la nube activa",
        logout: "Cerrar sesión",
        privacyHeading: "Configuración de privacidad y uso compartido",
        makePrivateTitle: "🔒 Cuenta Privada",
        makePrivateSub: "Oculto en búsquedas y recomendaciones.",
        shareCalendarTitle: "📅 Compartir calendario con amigos",
        shareCalendarSub: "Los amigos agregados pueden ver tus eventos.",
        searchFriendPlaceholder: "Correo electrónico del amigo...",
        addBtn: "Enviar",
        myFriends: "MIS AMIGOS",
        noFriends: "Aún no hay amigos agregados. ¡Añade uno con su correo!",
        calendarSharedTag: "📅 Calendario compartido",
        pendingRequestsTitle: "SOLICITUDES DE AMISTAD ENTRANTES",
        noRequests: "No hay solicitudes pendientes.",
        acceptBtn: "Aceptar",
        rejectBtn: "Rechazar",
        tabLogin: "Iniciar sesión",
        tabRegister: "Registrarse",
        nameLabel: "Nombre completo",
        emailLabel: "Correo electrónico",
        passwordLabel: "Contraseña",
        submitLogin: "Iniciar sesión",
        submitRegister: "Crear cuenta",
        checkingAuth: "Comprobando sesión...",
        loginSuccess: "¡Inicio de sesión correcto!",
        registerSuccess: "¡Cuenta creada con éxito!",
        loggedOutMsg: "Sesión cerrada correctamente.",
        hasAccountLink: "¿Ya tienes una cuenta? ¡Iniciar sesión!",
        noAccountLink: "¿No tienes una cuenta? ¡Regístrate ahora!",
        backBtn: "Atrás",
        refreshTitle: "Actualizar",
        calendarLoading: "Cargando calendario...",
        friendCalendarEmpty: "Este amigo aún no ha compartido eventos de calendario o su calendario está vacío.",
        viewCalendarBtn: "Ver Calendario",
        removeFriendTitle: "Eliminar Amigo",
        loginErrorDefault: "Inicio de sesión fallido. Comprueba tus datos.",
        registerErrorDefault: "Error en el registro.",
        fillAllFields: "Por favor, rellena todos los campos.",
        enterEmailPassword: "Por favor, introduce tu correo y contraseña.",
        passwordMinLength: "La contraseña debe tener al menos 8 caracteres.",
        logoutErrorDefault: "Ocurrió un error al cerrar sesión.",
        msgSelfRequest: "No puedes enviar una solicitud de amistad a tu propio correo.",
        msgAlreadyFriend: "Este usuario ya está en tu lista de amigos.",
        msgAlreadyPending: "Ya tienes una solicitud de amistad pendiente con este usuario.",
        msgSent: "¡Solicitud de amistad enviada a {email}!",
        msgMutualAccepted: "Solicitud mutua detectada — ¡ahora son amigos!",
        msgSavedLocalOnly: "Solicitud guardada localmente, pero el relay en la nube no responde ahora.",
        msgNetworkError: "No se pudo contactar con el servidor. Revisa tu conexión."
    },
    fr: {
        subtitle: "Compte Appwrite Cloud Sécurisé",
        tabProfile: "Profil et Confidentialité",
        tabFriends: "Amis",
        tabRequests: "Demandes",
        cloudConnected: "Synchronisation Cloud Active",
        logout: "Se déconnecter",
        privacyHeading: "Paramètres de confidentialité et partage",
        makePrivateTitle: "🔒 Compte Privé",
        makePrivateSub: "Masqué dans la recherche et les suggestions.",
        shareCalendarTitle: "📅 Partager le calendrier avec des amis",
        shareCalendarSub: "Les amis connectés peuvent voir vos événements.",
        searchFriendPlaceholder: "Adresse e-mail de l'ami...",
        addBtn: "Envoyer",
        myFriends: "MES AMIS",
        noFriends: "Aucun ami ajouté. Ajoutez-en un par son e-mail !",
        calendarSharedTag: "📅 Calendrier partagé",
        pendingRequestsTitle: "DEMANDES D'AMITIÉ ENTRANTES",
        noRequests: "Aucune demande d'amitié en attente.",
        acceptBtn: "Accepter",
        rejectBtn: "Refuser",
        tabLogin: "Se connecter",
        tabRegister: "S'inscrire",
        nameLabel: "Nom complet",
        emailLabel: "Adresse e-mail",
        passwordLabel: "Mot de passe",
        submitLogin: "Se connecter",
        submitRegister: "Créer un compte",
        checkingAuth: "Vérification de la session...",
        loginSuccess: "Connexion réussie !",
        registerSuccess: "Compte créé avec succès !",
        loggedOutMsg: "Déconnexion réussie.",
        hasAccountLink: "Vous avez déjà un compte ? Se connecter !",
        noAccountLink: "Vous n'avez pas de compte ? S'inscrire !",
        backBtn: "Retour",
        refreshTitle: "Actualiser",
        calendarLoading: "Chargement du calendrier...",
        friendCalendarEmpty: "Cet ami n'a pas encore partagé d'événements de calendrier, ou son calendrier est vide.",
        viewCalendarBtn: "Voir le Calendrier",
        removeFriendTitle: "Supprimer l'Ami",
        loginErrorDefault: "Échec de la connexion. Vérifiez vos identifiants.",
        registerErrorDefault: "Échec de l'inscription.",
        fillAllFields: "Veuillez remplir tous les champs.",
        enterEmailPassword: "Veuillez saisir votre e-mail et mot de passe.",
        passwordMinLength: "Le mot de passe doit comporter au moins 8 caractères.",
        logoutErrorDefault: "Une erreur est survenue lors de la déconnexion.",
        msgSelfRequest: "Vous ne pouvez pas envoyer une demande d'amitié à votre propre adresse e-mail.",
        msgAlreadyFriend: "Cet utilisateur est déjà dans votre liste d'amis.",
        msgAlreadyPending: "Vous avez déjà une demande d'amitié en attente avec cet utilisateur.",
        msgSent: "Demande d'amitié envoyée à {email} !",
        msgMutualAccepted: "Demande mutuelle détectée — vous êtes maintenant amis !",
        msgSavedLocalOnly: "Demande enregistrée localement, mais le relais cloud ne répond pas pour le moment.",
        msgNetworkError: "Impossible de joindre le serveur. Vérifiez votre connexion."
    },
    it: {
        subtitle: "Account Appwrite Cloud Sicuro",
        tabProfile: "Profilo e Privacy",
        tabFriends: "Amici",
        tabRequests: "Richieste",
        cloudConnected: "Sincronizzazione Cloud Attiva",
        logout: "Disconnettersi",
        privacyHeading: "Impostazioni Privacy e Condivisione",
        makePrivateTitle: "🔒 Account Privato",
        makePrivateSub: "Nascosto dalla ricerca e suggerimenti.",
        shareCalendarTitle: "📅 Condividi Calendario con Amici",
        shareCalendarSub: "Gli amici possono vedere i tuoi eventi.",
        searchFriendPlaceholder: "Indirizzo Email dell'amico...",
        addBtn: "Invia",
        myFriends: "I MIEI AMICI",
        noFriends: "Nessun amico aggiunto. Aggiungine uno via email!",
        calendarSharedTag: "📅 Calendario Condiviso",
        pendingRequestsTitle: "RICHIESTE DI AMICIZIA IN ARRIVO",
        noRequests: "Nessuna richiesta di amicizia in sospeso.",
        acceptBtn: "Accetta",
        rejectBtn: "Rifiuta",
        tabLogin: "Accedi",
        tabRegister: "Registrati",
        nameLabel: "Nome completo",
        emailLabel: "Indirizzo Email",
        passwordLabel: "Password",
        submitLogin: "Accedi",
        submitRegister: "Crea Account",
        checkingAuth: "Verifica sessione in corso...",
        loginSuccess: "Accesso effettuato con successo!",
        registerSuccess: "Account creato con successo!",
        loggedOutMsg: "Disconnessione effettuata.",
        hasAccountLink: "Hai già un account? Accedi!",
        noAccountLink: "Non hai un account? Registrati ora!",
        backBtn: "Indietro",
        refreshTitle: "Aggiorna",
        calendarLoading: "Caricamento calendario...",
        friendCalendarEmpty: "Questo amico non ha ancora condiviso eventi del calendario, o il calendario è vuoto.",
        viewCalendarBtn: "Vedi Calendario",
        removeFriendTitle: "Rimuovi Amico",
        loginErrorDefault: "Accesso fallito. Controlla le tue credenziali.",
        registerErrorDefault: "Registrazione fallita.",
        fillAllFields: "Compila tutti i campi.",
        enterEmailPassword: "Inserisci email e password.",
        passwordMinLength: "La password deve contenere almeno 8 caratteri.",
        logoutErrorDefault: "Si è verificato un errore durante la disconnessione.",
        msgSelfRequest: "Non puoi inviare una richiesta di amicizia alla tua stessa email.",
        msgAlreadyFriend: "Questo utente è già nella tua lista di amici.",
        msgAlreadyPending: "Hai già una richiesta di amicizia in sospeso con questo utente.",
        msgSent: "Richiesta di amicizia inviata a {email}!",
        msgMutualAccepted: "Richiesta reciproca rilevata — ora siete amici!",
        msgSavedLocalOnly: "Richiesta salvata localmente, ma il relay cloud non risponde ora.",
        msgNetworkError: "Impossibile contattare il server. Controlla la connessione."
    }
};

export const CloudAuthModal: React.FC<CloudAuthModalProps> = ({ isOpen, onClose, language = 'tr', onUserChanged, initialMode }) => {
    const t = TRANSLATIONS[language] || TRANSLATIONS['tr'];

    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [loggedInTab, setLoggedInTab] = useState<'profile' | 'friends' | 'requests'>('profile');
    
    const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [actionLoading, setActionLoading] = useState<boolean>(false);
    
    // Auth Form State
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    // Friends & Privacy State
    const [privacy, setPrivacy] = useState<UserPrivacySettings>({ isPrivate: false, shareCalendar: true });
    const [friends, setFriends] = useState<UserFriend[]>([]);
    const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
    const [searchEmail, setSearchEmail] = useState<string>('');
    const [friendActionMsg, setFriendActionMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [selectedFriendCalendar, setSelectedFriendCalendar] = useState<{ friend: UserFriend; events: SharedCalendarEvent[] } | null>(null);
    const [friendCalendarLoading, setFriendCalendarLoading] = useState<boolean>(false);

    const handleViewFriendCalendar = async (friend: UserFriend) => {
        setSelectedFriendCalendar({ friend, events: [] });
        setFriendCalendarLoading(true);
        const evts = await friendsService.getFriendCalendarEvents(friend.email);
        setSelectedFriendCalendar({ friend, events: evts });
        setFriendCalendarLoading(false);
    };

    // Mevcut oturumu ve arkadaş verilerini getir
    useEffect(() => {
        if (isOpen) {
            if (initialMode) {
                setMode(initialMode);
            }
            checkAuth();
            loadFriendData();
        }
    }, [isOpen, initialMode]);

    const checkAuth = async () => {
        setLoading(true);
        setError(null);
        try {
            const user = await authService.getCurrentUser();
            setCurrentUser(user);
            if (onUserChanged) onUserChanged(user);
            loadFriendData(user);
        } catch {
            setCurrentUser(null);
            loadFriendData(null);
        } finally {
            setLoading(false);
        }
    };

    const loadFriendData = async (userObj?: UserAccount | null) => {
        const activeUser = userObj !== undefined ? userObj : currentUser;
        setPrivacy(friendsService.getPrivacySettings());
        if (activeUser?.email) {
            const [frReqs, friends] = await Promise.all([
                friendsService.getPendingRequests(activeUser.email),
                friendsService.getFriendsAsync(activeUser.email)
            ]);
            setPendingRequests(frReqs);
            setFriends(friends);
        } else {
            setFriends(friendsService.getFriends());
            setPendingRequests([]);
        }
    };

    const handleTogglePrivacy = (key: keyof UserPrivacySettings) => {
        const updated = { ...privacy, [key]: !privacy[key] };
        setPrivacy(updated);
        friendsService.savePrivacySettings(updated);

        // Takvim paylaşımı değiştiyse bulutu senkronize et
        if (key === 'shareCalendar' && currentUser?.email) {
            try {
                const localEvents = JSON.parse(localStorage.getItem('multitool_calendar') || '[]');
                friendsService.publishMyCalendarEvents(
                    currentUser.email,
                    currentUser.name || currentUser.email.split('@')[0],
                    localEvents
                );
            } catch { }
        }
    };

    const handleSendFriendRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;

        setActionLoading(true);
        const res = await friendsService.sendFriendRequest(currentUser.email, currentUser.name, searchEmail);
        setActionLoading(false);

        // code alanı varsa çevir, yoksa sunucu mesajını kullan
        let text = res.message;
        if (res.code) {
            const map: Record<string, string> = {
                self_request: t.msgSelfRequest,
                already_friend: t.msgAlreadyFriend,
                already_pending: t.msgAlreadyPending,
                sent: t.msgSent,
                mutual_accepted: t.msgMutualAccepted,
                network_error: t.msgNetworkError
            };
            if (map[res.code]) text = map[res.code].replace('{email}', searchEmail);
        }

        if (res.success) {
            setFriendActionMsg({ type: 'success', text });
            setSearchEmail('');
            await loadFriendData(currentUser);
        } else {
            setFriendActionMsg({ type: 'error', text });
        }
    };

    const handleAcceptRequest = async (reqId: string) => {
        await friendsService.acceptRequest(reqId, currentUser?.name);
        await loadFriendData(currentUser);
    };

    const handleRejectRequest = async (reqId: string) => {
        await friendsService.rejectRequest(reqId);
        await loadFriendData(currentUser);
    };

    const handleRemoveFriend = (friendEmail: string) => {
        friendsService.removeFriend(friendEmail, currentUser?.email);
        loadFriendData();
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError(t.enterEmailPassword);
            return;
        }

        setActionLoading(true);
        setError(null);
        setSuccessMsg(null);

        try {
            await authService.login(email, password);
            const user = await authService.getCurrentUser();
            setCurrentUser(user);
            if (onUserChanged) onUserChanged(user);
            setSuccessMsg(t.loginSuccess);
            loadFriendData();
            setTimeout(() => {
                onClose();
            }, 1000);
        } catch (err: any) {
            setError(err.message || t.loginErrorDefault);
        } finally {
            setActionLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password || !name) {
            setError(t.fillAllFields);
            return;
        }

        if (password.length < 8) {
            setError(t.passwordMinLength);
            return;
        }

        setActionLoading(true);
        setError(null);
        setSuccessMsg(null);

        try {
            await authService.register(email, password, name);
            const user = await authService.getCurrentUser();
            setCurrentUser(user);
            if (onUserChanged) onUserChanged(user);
            setSuccessMsg(t.registerSuccess);
            loadFriendData();
            setTimeout(() => {
                onClose();
            }, 1000);
        } catch (err: any) {
            setError(err.message || t.registerErrorDefault);
        } finally {
            setActionLoading(false);
        }
    };

    const handleLogout = async () => {
        setActionLoading(true);
        try {
            await authService.logout();
            setCurrentUser(null);
            if (onUserChanged) onUserChanged(null);
            setSuccessMsg(t.loggedOutMsg);
        } catch (err: any) {
            setError(err.message || t.logoutErrorDefault);
        } finally {
            setActionLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            zIndex: 100000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px',
            boxSizing: 'border-box',
            overflowX: 'hidden',
            animation: 'fadeIn 0.2s ease'
        }} onClick={onClose}>
            <div style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                width: '100%',
                maxWidth: '440px',
                padding: '20px 16px',
                boxShadow: 'var(--shadow-lg)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                maxHeight: '90vh',
                overflowY: 'auto',
                overflowX: 'hidden',
                boxSizing: 'border-box'
            }} onClick={e => e.stopPropagation()}>

                {/* Kapat Butonu */}
                <button onClick={onClose} className="btn-icon" style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--bg-secondary)',
                    zIndex: 2
                }}>
                    <X size={16} />
                </button>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingRight: '36px', minWidth: 0 }}>
                    <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: 'var(--radius-md)',
                        background: 'linear-gradient(135deg, var(--primary) 0%, #06b6d4 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        boxShadow: 'var(--shadow-glow)',
                        flexShrink: 0
                    }}>
                        <Cloud size={24} />
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                        <h3 style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '18px',
                            fontWeight: 800,
                            color: 'var(--text-primary)',
                            margin: 0,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}>
                            {APPWRITE_PROJECT_NAME}
                        </h3>
                        <p style={{
                            fontSize: '12px',
                            color: 'var(--text-muted)',
                            margin: '2px 0 0 0',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}>
                            {t.subtitle}
                        </p>
                    </div>
                </div>

                {/* Yükleniyor Durumu */}
                {loading ? (
                    <div style={{
                        padding: '40px 0',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '14px',
                        color: 'var(--text-muted)'
                    }}>
                        <Loader2 size={32} className="animate-spin" style={{ color: 'var(--primary)' }} />
                        <span style={{ fontSize: '14px' }}>{t.checkingAuth}</span>
                    </div>
                ) : currentUser ? (
                    /* OTURUM AÇIK İSE */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', boxSizing: 'border-box' }}>

                        {/* İç Sekme Değiştirici */}
                        <div style={{
                            display: 'flex',
                            backgroundColor: 'var(--bg-secondary)',
                            padding: '4px',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-color)',
                            gap: '4px',
                            width: '100%',
                            boxSizing: 'border-box'
                        }}>
                            <button
                                type="button"
                                onClick={() => setLoggedInTab('profile')}
                                style={{
                                    flex: 1,
                                    minWidth: 0,
                                    padding: '8px 4px',
                                    borderRadius: 'var(--radius-sm)',
                                    border: 'none',
                                    backgroundColor: loggedInTab === 'profile' ? 'var(--bg-card)' : 'transparent',
                                    color: loggedInTab === 'profile' ? 'var(--primary)' : 'var(--text-muted)',
                                    fontWeight: loggedInTab === 'profile' ? 700 : 500,
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '4px',
                                    boxShadow: loggedInTab === 'profile' ? 'var(--shadow-sm)' : 'none',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}
                            >
                                <User size={14} style={{ flexShrink: 0 }} /> <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.tabProfile}</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setLoggedInTab('friends')}
                                style={{
                                    flex: 1,
                                    minWidth: 0,
                                    padding: '8px 4px',
                                    borderRadius: 'var(--radius-sm)',
                                    border: 'none',
                                    backgroundColor: loggedInTab === 'friends' ? 'var(--bg-card)' : 'transparent',
                                    color: loggedInTab === 'friends' ? 'var(--primary)' : 'var(--text-muted)',
                                    fontWeight: loggedInTab === 'friends' ? 700 : 500,
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '4px',
                                    boxShadow: loggedInTab === 'friends' ? 'var(--shadow-sm)' : 'none',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}
                            >
                                <Users size={14} style={{ flexShrink: 0 }} /> <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.tabFriends} ({friends.length})</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setLoggedInTab('requests')}
                                style={{
                                    flex: 1,
                                    minWidth: 0,
                                    padding: '8px 4px',
                                    borderRadius: 'var(--radius-sm)',
                                    border: 'none',
                                    backgroundColor: loggedInTab === 'requests' ? 'var(--bg-card)' : 'transparent',
                                    color: loggedInTab === 'requests' ? 'var(--primary)' : 'var(--text-muted)',
                                    fontWeight: loggedInTab === 'requests' ? 700 : 500,
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '4px',
                                    position: 'relative',
                                    boxShadow: loggedInTab === 'requests' ? 'var(--shadow-sm)' : 'none',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}
                            >
                                <Bell size={14} style={{ flexShrink: 0 }} /> <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.tabRequests}</span>
                                {pendingRequests.length > 0 && (
                                    <span style={{
                                        backgroundColor: 'var(--danger)',
                                        color: 'white',
                                        fontSize: '10px',
                                        fontWeight: 800,
                                        borderRadius: '12px',
                                        padding: '1px 5px',
                                        marginLeft: '2px',
                                        flexShrink: 0
                                    }}>
                                        {pendingRequests.length}
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Hata & Başarı Bildirimleri */}
                        {error && (
                            <div style={{
                                backgroundColor: 'rgba(220, 38, 38, 0.1)',
                                border: '1px solid var(--danger)',
                                borderRadius: 'var(--radius-sm)',
                                padding: '12px',
                                fontSize: '12.5px',
                                color: 'var(--danger)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <AlertCircle size={16} /> {error}
                            </div>
                        )}

                        {successMsg && (
                            <div style={{
                                backgroundColor: 'rgba(22, 163, 74, 0.1)',
                                border: '1px solid var(--success)',
                                borderRadius: 'var(--radius-sm)',
                                padding: '12px',
                                fontSize: '12.5px',
                                color: 'var(--success)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <CheckCircle2 size={16} /> {successMsg}
                            </div>
                        )}

                        {/* SEKME 1: PROFİL, E-POSTA DOĞRULAMA VE GİZLİLİK */}
                        {loggedInTab === 'profile' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                
                                {/* Profil Kartı */}
                                <div style={{
                                    backgroundColor: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-md)',
                                    padding: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '14px'
                                }}>
                                    <div style={{
                                        width: '46px',
                                        height: '46px',
                                        borderRadius: '50%',
                                        backgroundColor: 'var(--primary-glow)',
                                        color: 'var(--primary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 800,
                                        fontSize: '18px'
                                    }}>
                                        {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{
                                            fontSize: '15px',
                                            fontWeight: 800,
                                            color: 'var(--text-primary)',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}>
                                            {currentUser.name || 'Multitool User'}
                                        </div>
                                        <div style={{
                                            fontSize: '12.5px',
                                            color: 'var(--text-muted)',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}>
                                            {currentUser.email}
                                        </div>
                                    </div>
                                </div>

                                {/* Gizlilik Ayarları */}
                                <div style={{
                                    backgroundColor: 'var(--bg-card)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-md)',
                                    padding: '16px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '14px'
                                }}>
                                    <h4 style={{ margin: 0, fontSize: '13.5px', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <EyeOff size={16} color="var(--primary)" /> {t.privacyHeading}
                                    </h4>

                                    {/* Hesabı Gizli Yap Toggle */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed var(--border-color)' }}>
                                        <div>
                                            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{t.makePrivateTitle}</div>
                                            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>{t.makePrivateSub}</div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={privacy.isPrivate}
                                            onChange={() => handleTogglePrivacy('isPrivate')}
                                            style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--primary)' }}
                                        />
                                    </div>

                                    {/* Takvimi Paylaş Toggle */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
                                        <div>
                                            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{t.shareCalendarTitle}</div>
                                            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>{t.shareCalendarSub}</div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={privacy.shareCalendar}
                                            onChange={() => handleTogglePrivacy('shareCalendar')}
                                            style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--primary)' }}
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleLogout}
                                    disabled={actionLoading}
                                    className="btn-secondary"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        color: 'var(--danger)',
                                        borderColor: 'rgba(220, 38, 38, 0.3)',
                                        marginTop: '4px'
                                    }}
                                >
                                    {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
                                    {t.logout}
                                </button>
                            </div>
                        )}

                        {/* SEKME 2: ARKADAŞLAR & ARKADAŞ EKLE */}
                        {loggedInTab === 'friends' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                                {/* Arkadaş Arama / Ekleme Formu */}
                                <form onSubmit={handleSendFriendRequest} style={{ display: 'flex', gap: '8px', width: '100%', boxSizing: 'border-box' }}>
                                    <input
                                        type="email"
                                        className="form-input"
                                        placeholder={t.searchFriendPlaceholder}
                                        value={searchEmail}
                                        onChange={e => setSearchEmail(e.target.value)}
                                        style={{ flex: 1, minWidth: 0, fontSize: '12.5px', padding: '9px 12px', boxSizing: 'border-box' }}
                                        required
                                    />
                                    <button type="submit" className="btn-primary" style={{ padding: '9px 12px', fontSize: '12.5px', whiteSpace: 'nowrap', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <UserPlus size={15} /> {t.addBtn}
                                    </button>
                                </form>

                                {friendActionMsg && (
                                    <div style={{
                                        padding: '10px 14px',
                                        borderRadius: 'var(--radius-sm)',
                                        fontSize: '12px',
                                        backgroundColor: friendActionMsg.type === 'success' ? 'rgba(22, 163, 74, 0.1)' : 'rgba(220, 38, 38, 0.1)',
                                        color: friendActionMsg.type === 'success' ? 'var(--success)' : 'var(--danger)',
                                        border: `1px solid ${friendActionMsg.type === 'success' ? 'var(--success)' : 'var(--danger)'}`
                                    }}>
                                        {friendActionMsg.text}
                                    </div>
                                )}

                                 {/* Arkadaş Listesi & Takvim Görünümü */}
                                {selectedFriendCalendar ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <button
                                                onClick={() => setSelectedFriendCalendar(null)}
                                                className="btn-secondary"
                                                style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                                            >
                                                <ArrowLeft size={14} /> {t.backBtn}
                                            </button>
                                            <button
                                                onClick={() => handleViewFriendCalendar(selectedFriendCalendar.friend)}
                                                className="btn-icon"
                                                title={t.refreshTitle}
                                            >
                                                <RefreshCw size={14} className={friendCalendarLoading ? 'spin' : ''} />
                                            </button>
                                        </div>

                                        <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-glow)', border: '1px solid var(--primary)', color: 'var(--primary)', fontWeight: 800, fontSize: '13.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <CalendarIcon size={16} /> {selectedFriendCalendar.friend.name} ({selectedFriendCalendar.friend.email})
                                        </div>

                                        <div style={{ maxHeight: '220px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {friendCalendarLoading ? (
                                                <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)' }}>
                                                    <Loader2 size={22} className="spin" style={{ margin: '0 auto 8px' }} />
                                                    <div style={{ fontSize: '12px' }}>{t.calendarLoading}</div>
                                                </div>
                                            ) : selectedFriendCalendar.events.length === 0 ? (
                                                <div style={{ textAlign: 'center', padding: '24px 12px', color: 'var(--text-muted)', fontSize: '12.5px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                                                    {t.friendCalendarEmpty}
                                                </div>
                                            ) : (
                                                selectedFriendCalendar.events.map(evt => (
                                                    <div key={evt.id} style={{
                                                        padding: '10px 12px',
                                                        backgroundColor: 'var(--bg-secondary)',
                                                        border: '1px solid var(--border-color)',
                                                        borderRadius: 'var(--radius-sm)',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: '4px'
                                                    }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                                                            <span style={{ fontWeight: 800, fontSize: '13px', color: 'var(--text-primary)' }}>{evt.title}</span>
                                                            <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 700, backgroundColor: 'var(--bg-tertiary)', padding: '2px 8px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                                                                {evt.date} {evt.time ? `• ${evt.time}` : ''}
                                                            </span>
                                                        </div>
                                                        {evt.description && (
                                                            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{evt.description}</div>
                                                        )}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '240px', overflowY: 'auto' }}>
                                        <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 800, color: 'var(--text-muted)' }}>
                                            {t.myFriends} ({friends.length})
                                        </h4>

                                        {friends.length === 0 ? (
                                            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', padding: '24px 0' }}>
                                                {t.noFriends}
                                            </div>
                                        ) : (
                                            friends.map(f => (
                                                <div key={f.id} style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    backgroundColor: 'var(--bg-secondary)',
                                                    border: '1px solid var(--border-color)',
                                                    borderRadius: 'var(--radius-md)',
                                                    padding: '12px 14px'
                                                }}>
                                                    <div style={{ minWidth: 0, flex: 1 }}>
                                                        <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                            {f.name}
                                                        </div>
                                                        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{f.email}</div>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <button
                                                            onClick={() => handleViewFriendCalendar(f)}
                                                            className="btn-secondary"
                                                            style={{ padding: '4px 8px', fontSize: '11px', gap: '4px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                                                        >
                                                            <CalendarIcon size={12} /> {t.viewCalendarBtn}
                                                        </button>
                                                        <button
                                                            onClick={() => handleRemoveFriend(f.email)}
                                                            className="btn-icon"
                                                            style={{ width: '30px', height: '30px', color: 'var(--danger)' }}
                                                            title={t.removeFriendTitle}
                                                        >
                                                            <UserX size={15} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* SEKME 3: BEKLEYEN İSTEKLER / BİLDİRİMLER */}
                        {loggedInTab === 'requests' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '260px', overflowY: 'auto' }}>
                                <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 800, color: 'var(--text-muted)' }}>
                                    {t.pendingRequestsTitle} ({pendingRequests.length})
                                </h4>

                                {pendingRequests.length === 0 ? (
                                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', padding: '28px 0' }}>
                                        {t.noRequests}
                                    </div>
                                ) : (
                                    pendingRequests.map(req => (
                                        <div key={req.id} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            backgroundColor: 'var(--bg-secondary)',
                                            border: '1px solid var(--border-color)',
                                            borderRadius: 'var(--radius-md)',
                                            padding: '12px 14px'
                                        }}>
                                            <div style={{ minWidth: 0, flex: 1 }}>
                                                <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
                                                    {req.senderName}
                                                </div>
                                                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{req.senderEmail}</div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button
                                                    onClick={() => handleAcceptRequest(req.id)}
                                                    className="btn-primary"
                                                    style={{ padding: '7px 12px', fontSize: '12px', backgroundColor: 'var(--success)' }}
                                                >
                                                    <UserCheck size={14} /> {t.acceptBtn}
                                                </button>
                                                <button
                                                    onClick={() => handleRejectRequest(req.id)}
                                                    className="btn-secondary"
                                                    style={{ padding: '7px 12px', fontSize: '12px', color: 'var(--danger)' }}
                                                >
                                                    {t.rejectBtn}
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                    </div>
                ) : (
                    /* OTURUM KAPALI İSE (Giriş / Kayıt Formu) */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

                        {/* Mod Değiştirici Tab */}
                        <div style={{
                            display: 'flex',
                            backgroundColor: 'var(--bg-secondary)',
                            padding: '5px',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-color)'
                        }}>
                            <button
                                type="button"
                                onClick={() => { setMode('login'); setError(null); }}
                                style={{
                                    flex: 1,
                                    padding: '10px',
                                    borderRadius: 'var(--radius-sm)',
                                    border: 'none',
                                    backgroundColor: mode === 'login' ? 'var(--bg-card)' : 'transparent',
                                    color: mode === 'login' ? 'var(--primary)' : 'var(--text-muted)',
                                    fontWeight: mode === 'login' ? 700 : 500,
                                    fontSize: '13.5px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    boxShadow: mode === 'login' ? 'var(--shadow-sm)' : 'none'
                                }}
                            >
                                {t.tabLogin}
                            </button>
                            <button
                                type="button"
                                onClick={() => { setMode('register'); setError(null); }}
                                style={{
                                    flex: 1,
                                    padding: '10px',
                                    borderRadius: 'var(--radius-sm)',
                                    border: 'none',
                                    backgroundColor: mode === 'register' ? 'var(--bg-card)' : 'transparent',
                                    color: mode === 'register' ? 'var(--primary)' : 'var(--text-muted)',
                                    fontWeight: mode === 'register' ? 700 : 500,
                                    fontSize: '13.5px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    boxShadow: mode === 'register' ? 'var(--shadow-sm)' : 'none'
                                }}
                            >
                                {t.tabRegister}
                            </button>
                        </div>

                        {/* Hata & Başarı Bildirimleri */}
                        {error && (
                            <div style={{
                                backgroundColor: 'rgba(220, 38, 38, 0.1)',
                                border: '1px solid var(--danger)',
                                borderRadius: 'var(--radius-sm)',
                                padding: '12px',
                                fontSize: '12.5px',
                                color: 'var(--danger)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <AlertCircle size={16} /> {error}
                            </div>
                        )}

                        {successMsg && (
                            <div style={{
                                backgroundColor: 'rgba(22, 163, 74, 0.1)',
                                border: '1px solid var(--success)',
                                borderRadius: 'var(--radius-sm)',
                                padding: '12px',
                                fontSize: '12.5px',
                                color: 'var(--success)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <CheckCircle2 size={16} /> {successMsg}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={mode === 'login' ? handleLogin : handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {mode === 'register' && (
                                <div className="form-group">
                                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                                        <User size={14} /> {t.nameLabel}
                                    </label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Doruk Kahraman"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        style={{ padding: '11px 14px', fontSize: '13.5px' }}
                                        required
                                    />
                                </div>
                            )}

                            <div className="form-group">
                                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                                    <Mail size={14} /> {t.emailLabel}
                                </label>
                                <input
                                    type="email"
                                    className="form-input"
                                    placeholder="ornek@multitool.app"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    style={{ padding: '11px 14px', fontSize: '13.5px' }}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                                    <Lock size={14} /> {t.passwordLabel}
                                </label>
                                <input
                                    type="password"
                                    className="form-input"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    style={{ padding: '11px 14px', fontSize: '13.5px' }}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={actionLoading}
                                style={{
                                    width: '100%',
                                    padding: '13px',
                                    marginTop: '8px',
                                    fontSize: '14.5px',
                                    fontWeight: 700
                                }}
                            >
                                {actionLoading ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <>
                                        <Cloud size={18} />
                                        {mode === 'login' ? t.submitLogin : t.submitRegister}
                                    </>
                                )}
                            </button>

                            <div style={{ textAlign: 'center', marginTop: '6px' }}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMode(mode === 'login' ? 'register' : 'login');
                                        setError(null);
                                        setSuccessMsg(null);
                                    }}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--primary)',
                                        fontSize: '13px',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        padding: '6px 10px',
                                        textDecoration: 'underline'
                                    }}
                                >
                                    {mode === 'register' ? t.hasAccountLink : t.noAccountLink}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};
