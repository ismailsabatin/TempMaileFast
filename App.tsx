
import React, { useState, useEffect, useCallback, createContext, useContext, useRef, useMemo } from 'react';
import { HashRouter, Routes, Route, NavLink, Link } from 'react-router-dom';
// FIX: Import the `Token` type to resolve type errors.
import type { Account, Message, FullMessage, Domain, Token } from './types';

// --- CONSTANTS ---
const API_BASE_URL = 'https://api.mail.tm';

// --- TRANSLATIONS (i18n) ---
const translations = {
  en: {
    appName: "TempMailX",
    tagline: "Fast & Secure Temporary Email",
    // Header
    navHome: "Home",
    navFaq: "FAQ",
    navBlog: "Blog",
    navAbout: "About Us",
    navPrivacy: "Privacy Policy",
    navTerms: "Terms of Use",
    // Home Page
    yourTempEmail: "Your Temporary Email Address",
    loadingEmail: "Generating your email...",
    copy: "Copy",
    copied: "Copied!",
    refresh: "Refresh",
    delete: "New Email",
    inbox: "Inbox",
    inboxEmpty: "Your inbox is empty. Waiting for new emails...",
    // Message View
    from: "From",
    to: "To",
    subject: "Subject",
    close: "Close",
    // Static Pages
    faqTitle: "Frequently Asked Questions",
    aboutTitle: "About TempMailX",
    privacyTitle: "Privacy Policy",
    termsTitle: "Terms of Use",
    blogTitle: "Our Blog",
    // Ad Placeholder
    adPlaceholder: "Advertisement",
  },
  ar: {
    appName: "TempMailX",
    tagline: "بريد مؤقت سريع وآمن",
    // Header
    navHome: "الرئيسية",
    navFaq: "الأسئلة الشائعة",
    navBlog: "المدونة",
    navAbout: "من نحن",
    navPrivacy: "سياسة الخصوصية",
    navTerms: "شروط الاستخدام",
    // Home Page
    yourTempEmail: "عنوان بريدك المؤقت",
    loadingEmail: "جاري إنشاء بريدك الإلكتروني...",
    copy: "نسخ",
    copied: "تم النسخ!",
    refresh: "تحديث",
    delete: "بريد جديد",
    inbox: "صندوق الوارد",
    inboxEmpty: "صندوق بريدك فارغ. في انتظار رسائل جديدة...",
    // Message View
    from: "من",
    to: "إلى",
    subject: "الموضوع",
    close: "إغلاق",
    // Static Pages
    faqTitle: "الأسئلة الشائعة",
    aboutTitle: "عن TempMailX",
    privacyTitle: "سياسة الخصوصية",
    termsTitle: "شروط الاستخدام",
    blogTitle: "مدونتنا",
    // Ad Placeholder
    adPlaceholder: "إعلان",
  }
};

type Language = 'en' | 'ar';
type Theme = 'light' | 'dark';

// --- CONTEXT ---
interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  t: (key: keyof typeof translations.en) => string;
}

const AppContext = createContext<AppContextType | null>(null);
const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within an AppProvider");
  return context;
};

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>( (localStorage.getItem('lang') as Language) || 'en');
  const [theme, setTheme] = useState<Theme>( (localStorage.getItem('theme') as Theme) || 'light');

  useEffect(() => {
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  const t = useCallback((key: keyof typeof translations.en) => {
    return translations[lang][key] || translations.en[key];
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, theme, setTheme, t }), [lang, setLang, theme, setTheme, t]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};


// --- ICONS ---
const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m4.93 19.07 1.41-1.41" /><path d="m17.66 6.34 1.41-1.41" /></svg>
);

const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
);

const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 6 9 17l-5-5"/></svg>
);

const RefreshCwIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M3 12a9 9 0 0 1 9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M3 21v-5h5" /></svg>
);

const Trash2Icon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
);

const MailIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);

const LoaderIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
);

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

// --- HOOK: useTempMail ---
const useTempMail = () => {
    const [account, setAccount] = useState<Account | null>(JSON.parse(localStorage.getItem('tempMailAccount') || 'null'));
    const [token, setToken] = useState<Token | null>(JSON.parse(localStorage.getItem('tempMailToken') || 'null'));
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState<boolean>(!account);
    const [error, setError] = useState<string | null>(null);

    const generateRandomString = (length: number) => {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };
    
    const createAccount = useCallback(async () => {
        setLoading(true);
        setError(null);
        setMessages([]);
        try {
            const domainRes = await fetch(`${API_BASE_URL}/domains`);
            if (!domainRes.ok) throw new Error('Failed to fetch domains.');
            const domainsData = await domainRes.json();
            const domains: Domain[] = domainsData['hydra:member'];
            const domain = domains[0]?.domain;
            if (!domain) throw new Error('No available domains found.');
            
            const address = `${generateRandomString(10)}@${domain}`;
            const password = generateRandomString(12);

            const accRes = await fetch(`${API_BASE_URL}/accounts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address, password }),
            });
            if (!accRes.ok) throw new Error('Failed to create account.');
            const newAccount: Account = await accRes.json();
            
            const tokenRes = await fetch(`${API_BASE_URL}/token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address, password }),
            });
            if (!tokenRes.ok) throw new Error('Failed to get token.');
            const newToken: Token = await tokenRes.json();

            setAccount({ ...newAccount, password });
            setToken(newToken);
            localStorage.setItem('tempMailAccount', JSON.stringify({ ...newAccount, password }));
            localStorage.setItem('tempMailToken', JSON.stringify(newToken));
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchMessages = useCallback(async () => {
        if (!token) return;
        try {
            const res = await fetch(`${API_BASE_URL}/messages`, {
                headers: { 'Authorization': `Bearer ${token.token}` }
            });
            if (!res.ok) {
                 if(res.status === 401){
                    // Token expired, let's create a new account
                    console.log("Token expired, creating new account");
                    await createAccount();
                }
                throw new Error('Failed to fetch messages.');
            }
            const data = await res.json();
            const newMessages: Message[] = data['hydra:member'];

            if (newMessages.length > messages.length) {
                // simple notification
                new Notification("New Email Received!", {
                  body: `From: ${newMessages[0].from.address}\nSubject: ${newMessages[0].subject}`,
                  icon: "/vite.svg" 
                });
            }
            setMessages(newMessages);
        } catch (e: any) {
            console.error(e.message);
        }
    }, [token, messages.length, createAccount]);
    
    const deleteAndCreateNewAccount = useCallback(async () => {
        setLoading(true);
        if (account && token) {
            try {
                await fetch(`${API_BASE_URL}/accounts/${account.id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token.token}` }
                });
            } catch (e) {
                console.error("Failed to delete old account, but proceeding to create a new one.", e);
            }
        }
        localStorage.removeItem('tempMailAccount');
        localStorage.removeItem('tempMailToken');
        setAccount(null);
        setToken(null);
        await createAccount();
    }, [account, token, createAccount]);

    useEffect(() => {
        if (!account || !token) {
            createAccount();
        }
    }, [account, token, createAccount]);

    useEffect(() => {
        if (token) {
            Notification.requestPermission();
            const intervalId = setInterval(fetchMessages, 10000); // Poll every 10 seconds
            return () => clearInterval(intervalId);
        }
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, fetchMessages]);

    return { account, messages, loading, error, refresh: fetchMessages, createNew: deleteAndCreateNewAccount };
};

// --- COMPONENTS ---

const Header: React.FC = () => {
    const { lang, setLang, theme, setTheme, t } = useAppContext();
    const [isOpen, setIsOpen] = useState(false);

    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
    const toggleLang = () => setLang(lang === 'en' ? 'ar' : 'en');
    
    const navItemClasses = "text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors";
    const activeNavItemClasses = "text-primary-600 dark:text-primary-400 font-semibold";

    return (
        <header className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-50 shadow-sm">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                           <MailIcon className="h-8 w-8 text-primary-600"/>
                            <span className="text-2xl font-bold text-slate-800 dark:text-white">{t('appName')}</span>
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-center space-x-4">
                            <NavLink to="/" className={({isActive}) => isActive ? activeNavItemClasses : navItemClasses}>{t('navHome')}</NavLink>
                            <NavLink to="/faq" className={({isActive}) => isActive ? activeNavItemClasses : navItemClasses}>{t('navFaq')}</NavLink>
                            <NavLink to="/blog" className={({isActive}) => isActive ? activeNavItemClasses : navItemClasses}>{t('navBlog')}</NavLink>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                         <button onClick={toggleLang} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700">
                           <span className="font-semibold text-sm">{lang === 'en' ? 'AR' : 'EN'}</span>
                        </button>
                        <button onClick={toggleTheme} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700">
                           {theme === 'light' ? <MoonIcon className="h-5 w-5"/> : <SunIcon className="h-5 w-5"/>}
                        </button>
                         <div className="md:hidden">
                            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700">
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    {isOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                 {isOpen && (
                    <div className="md:hidden pb-4">
                        <NavLink to="/" onClick={() => setIsOpen(false)} className={({isActive}) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? activeNavItemClasses : navItemClasses}`}>{t('navHome')}</NavLink>
                        <NavLink to="/faq" onClick={() => setIsOpen(false)} className={({isActive}) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? activeNavItemClasses : navItemClasses}`}>{t('navFaq')}</NavLink>
                        <NavLink to="/blog" onClick={() => setIsOpen(false)} className={({isActive}) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? activeNavItemClasses : navItemClasses}`}>{t('navBlog')}</NavLink>
                    </div>
                )}
            </nav>
        </header>
    );
};

const Footer: React.FC = () => {
    const { t } = useAppContext();
    return (
        <footer className="bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800">
            <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center text-slate-500 dark:text-slate-400">
                <div className="flex justify-center space-x-6 mb-4">
                    <Link to="/about" className="hover:text-primary-600">{t('navAbout')}</Link>
                    <Link to="/privacy" className="hover:text-primary-600">{t('navPrivacy')}</Link>
                    <Link to="/terms" className="hover:text-primary-600">{t('navTerms')}</Link>
                </div>
                <p>&copy; {new Date().getFullYear()} {t('appName')}. All rights reserved.</p>
            </div>
        </footer>
    );
}

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { lang } = useAppContext();
    return (
        <div className={`min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 ${lang === 'ar' ? 'font-arabic' : 'font-sans'}`}>
            <Header />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
            <Footer />
        </div>
    );
};

const MessageViewModal: React.FC<{ messageId: string; onClose: () => void }> = ({ messageId, onClose }) => {
    const { t } = useAppContext();
    const [message, setMessage] = useState<FullMessage | null>(null);
    const [loading, setLoading] = useState(true);
    const modalRef = useRef<HTMLDivElement>(null);
    const token = useMemo(() => JSON.parse(localStorage.getItem('tempMailToken') || 'null'), []);

    useEffect(() => {
        const fetchMessage = async () => {
            if (!token) return;
            setLoading(true);
            try {
                const res = await fetch(`${API_BASE_URL}/messages/${messageId}`, {
                    headers: { 'Authorization': `Bearer ${token.token}` }
                });
                if (!res.ok) throw new Error("Failed to fetch message");
                const data: FullMessage = await res.json();
                setMessage(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchMessage();
    }, [messageId, token]);
    
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
          onClose();
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div ref={modalRef} className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b dark:border-slate-700">
                    <h2 className="text-xl font-semibold truncate">{message?.subject || '...'}</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                {loading ? (
                    <div className="flex-grow flex items-center justify-center">
                        <LoaderIcon className="w-10 h-10 animate-spin text-primary-500" />
                    </div>
                ) : message ? (
                    <>
                        <div className="p-4 text-sm text-slate-600 dark:text-slate-300 border-b dark:border-slate-700">
                            <p><strong className="font-semibold text-slate-800 dark:text-slate-100">{t('from')}:</strong> {message.from.name} &lt;{message.from.address}&gt;</p>
                            <p><strong className="font-semibold text-slate-800 dark:text-slate-100">{t('to')}:</strong> {message.to.map(t => t.address).join(', ')}</p>
                            <p><strong className="font-semibold text-slate-800 dark:text-slate-100">{t('subject')}:</strong> {message.subject}</p>
                        </div>
                        <div className="flex-grow p-4 overflow-y-auto">
                            <iframe 
                              srcDoc={message.html ? message.html.join('') : message.text}
                              title="Email content"
                              className="w-full h-full border-0"
                              sandbox="allow-same-origin"
                            />
                        </div>
                    </>
                ) : (
                    <div className="p-8 text-center text-red-500">Failed to load message.</div>
                )}
            </div>
        </div>
    );
};

// --- PAGES ---

const HomePage: React.FC = () => {
    const { t } = useAppContext();
    const { account, messages, loading, refresh, createNew } = useTempMail();
    const [isCopied, setIsCopied] = useState(false);
    const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);

    const handleCopy = () => {
        if (account?.address) {
            navigator.clipboard.writeText(account.address);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };
    
    return (
        <div className="space-y-8">
            {selectedMessageId && <MessageViewModal messageId={selectedMessageId} onClose={() => setSelectedMessageId(null)} />}
            
            {/* Email Display Section */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 text-center">
                <h2 className="text-lg font-medium text-slate-500 dark:text-slate-400 mb-4">{t('yourTempEmail')}</h2>
                {loading ? (
                    <div className="flex items-center justify-center gap-3 h-12 text-2xl font-bold text-slate-500 dark:text-slate-400">
                        <LoaderIcon className="w-8 h-8 animate-spin"/>
                        <span>{t('loadingEmail')}</span>
                    </div>
                ) : (
                    <p className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400 break-all h-12">{account?.address}</p>
                )}
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button onClick={handleCopy} disabled={loading} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-white font-semibold rounded-md bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300 disabled:cursor-not-allowed transition-all duration-300">
                        {isCopied ? <><CheckIcon className="w-5 h-5"/>{t('copied')}</> : <><CopyIcon className="w-5 h-5"/>{t('copy')}</>}
                    </button>
                    <button onClick={refresh} disabled={loading} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-primary-600 dark:text-primary-400 font-semibold rounded-md border-2 border-primary-600 dark:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 disabled:opacity-50 transition-all duration-300">
                        <RefreshCwIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        {t('refresh')}
                    </button>
                    <button onClick={createNew} disabled={loading} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-red-600 font-semibold rounded-md border-2 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 transition-all duration-300">
                        <Trash2Icon className="w-5 h-5" />
                        {t('delete')}
                    </button>
                </div>
            </div>

            {/* Ad Placeholder */}
            <div className="my-4 text-center text-xs text-slate-500 bg-slate-200 dark:bg-slate-700 py-10 rounded-lg">
                {t('adPlaceholder')}
            </div>

            {/* Inbox Section */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold p-6 border-b border-slate-200 dark:border-slate-700">{t('inbox')}</h2>
                <div className="divide-y divide-slate-200 dark:divide-slate-700">
                    {messages.length > 0 ? (
                        messages.map(msg => (
                            <div key={msg.id} onClick={() => setSelectedMessageId(msg.id)} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors duration-200">
                                <div className="flex justify-between items-start">
                                    <div className="flex-grow truncate">
                                        <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">{msg.from.name || msg.from.address}</p>
                                        <p className="font-medium text-primary-600 dark:text-primary-400 truncate">{msg.subject}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{msg.intro}</p>
                                    </div>
                                    <div className="flex-shrink-0 text-right text-xs text-slate-400 ml-4">
                                        {new Date(msg.createdAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-12 text-center text-slate-500 dark:text-slate-400">
                            {loading ? <LoaderIcon className="w-8 h-8 animate-spin mx-auto"/> : <p>{t('inboxEmpty')}</p>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const StaticPage: React.FC<{titleKey: keyof typeof translations.en, children: React.ReactNode}> = ({ titleKey, children }) => {
    const { t } = useAppContext();
    const title = t(titleKey);
    useEffect(() => {
        document.title = `${title} - TempMailX`;
        return () => { document.title = 'TempMailX - Free Temporary Email' };
    }, [title]);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 md:p-10 prose dark:prose-invert max-w-4xl mx-auto">
            <h1>{title}</h1>
            {children}
        </div>
    );
};

const FaqPage: React.FC = () => (
    <StaticPage titleKey="faqTitle">
        <h3>What is a temporary email?</h3>
        <p>A temporary email is a disposable email address that you can use for a short period to receive emails without revealing your primary email address. It helps protect your privacy and avoid spam.</p>
        <h3>How long does the email last?</h3>
        <p>The email address is active as long as you keep this page open. If you close it, you might lose access, but we save your session in your browser so you can continue where you left off if you reopen it.</p>
        <h3>Is it secure?</h3>
        <p>While temporary emails are great for privacy, they are not as secure as personal email accounts. Do not use them for sensitive information or important accounts.</p>
        <h3>Is my data stored?</h3>
        <p>We do not store your emails or personal data. All messages are handled by the mail.tm service and are deleted from their servers after a certain period.</p>
    </StaticPage>
);

const PrivacyPolicyPage: React.FC = () => (
    <StaticPage titleKey="privacyTitle">
        <p>Your privacy is important to us. TempMailX is designed to be an anonymous service. We do not require any personal information to use our service.</p>
        <h4>Information We Collect</h4>
        <p>We do not collect or store any personal data, IP addresses, or emails you receive. Your session is stored locally in your browser to maintain your temporary email address across page loads.</p>
        <h4>Third-Party Services</h4>
        <p>We use third-party APIs (mail.tm) to provide the email functionality. Please refer to their privacy policy for information on how they handle data. We may use Google AdSense for advertising, which may use cookies to serve personalized ads. You can opt out of personalized advertising by visiting Ads Settings.</p>
        <h4>Data Security</h4>
        <p>We do not save any data on our servers. All communications with the mail service API are done over HTTPS.</p>
    </StaticPage>
);

const TermsOfUsePage: React.FC = () => (
    <StaticPage titleKey="termsTitle">
        <p>By using TempMailX, you agree to these terms of use.</p>
        <h4>Acceptable Use</h4>
        <p>You agree not to use our service for any illegal or unauthorized purpose. This includes but is not limited to sending spam, engaging in fraudulent activities, or registering for illegal services.</p>
        <h4>Disclaimer of Warranty</h4>
        <p>Our service is provided "as is" without any warranty. We are not responsible for any loss of data or inability to receive important emails.</p>
        <h4>Changes to Terms</h4>
        <p>We reserve the right to modify these terms at any time. Your continued use of the service constitutes acceptance of the new terms.</p>
    </StaticPage>
);

const AboutUsPage: React.FC = () => (
    <StaticPage titleKey="aboutTitle">
        <p>TempMailX was created to provide a simple, free, and reliable solution for temporary email needs. In a world where every service asks for your email, we believe in the right to privacy and a spam-free inbox.</p>
        <p>Our mission is to offer a fast and user-friendly tool that helps you protect your online identity. Whether you're signing up for a new service, testing an application, or just want to avoid promotional emails, TempMailX is here to help.</p>
    </StaticPage>
);

const BlogPage: React.FC = () => (
    <StaticPage titleKey="blogTitle">
        <article className="mb-8">
            <h3>What is a Temporary Email and Why Do You Need It?</h3>
            <p>Temporary email addresses provide a disposable address that can be used to sign up for services without giving away your real email. This is crucial for protecting your privacy, avoiding spam, and preventing your personal data from being sold or leaked...</p>
        </article>
        <article>
            <h3>Benefits of Temporary Email for Privacy Protection</h3>
            <p>Using a temporary email is one of the easiest steps you can take to enhance your online privacy. It creates a barrier between your real identity and the online services you use, making it harder for companies to track you and build a profile on you...</p>
        </article>
        <div className="my-8 text-center text-xs text-slate-500 bg-slate-200 dark:bg-slate-700 py-10 rounded-lg">
             Advertisement Placeholder
        </div>
         <article>
            <h3>How to Avoid Spam with a Disposable Email</h3>
            <p>Spam is a nuisance that clutters your inbox. By using a disposable email for one-time sign-ups, forums, or newsletters, you can keep your primary inbox clean and secure...</p>
        </article>
    </StaticPage>
);


// --- APP ---
export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsOfUsePage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/blog" element={<BlogPage />} />
          </Routes>
        </Layout>
      </HashRouter>
    </AppProvider>
  );
}
