
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
// Updated to compat API to resolve named export errors
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { auth, db } from './firebaseConfig';
import AuthScreen from './components/Auth/AuthScreen';
import Header from './components/Layout/Header';
import Leaderboard from './components/Layout/Leaderboard';
import ModeSelector from './components/Input/ModeSelector';
import MainDisplay from './components/Layout/MainDisplay';
import ShareAchievementModal from './components/Layout/ShareAchievementModal';
import EnglishLearningApp from './components/English/EnglishLearningApp';
import ScientificCalculator from './components/Input/ScientificCalculator';
import ProfileView from './components/Profile/ProfileView';
import CoursesPage from './components/Courses/CoursesPage';
import ErrorBoundary from './components/common/ErrorBoundary';
import SubscriptionScreen from './components/Subscription/SubscriptionScreen';
import NotificationModal from './components/common/NotificationModal';
import { StudyMode, StudyContent, SavedMaterial, FlashcardTheme, UserProfile, StudyHistoryItem, AchievementBadge, SubscriptionPlan } from './types';
import { generateStudyMaterial, extractTextFromMedia, processUrlInput, detectEquations, transcribeAudio } from './services/geminiService';
import { GoogleGenAI, LiveServerMessage, Modality, Blob as GenAIBlob } from '@google/genai';
import { 
  Loader2, Image as ImageIcon, Camera, 
  FileText, Link as LinkIcon, Trash2, GraduationCap, 
  Landmark, Microscope, Languages, BookOpen, Bookmark, FolderOpen, Search, Sparkles, Calculator, LogOut, ScanLine, Type, Wand2, Scroll, Gamepad2, ShieldAlert, Users, Globe, ArrowRight, Target, ChevronRight, User as UserIcon, Calendar, X, Circle, Info, ShieldAlert as ShieldIcon, Copy, Check, ExternalLink, Share2,
  Trophy, Crown, Zap, Flame, Rocket, ChevronLeft, Play, Grid, Mic, StopCircle, Focus, Eye, Edit3, Lock
} from 'lucide-react';
import { MATH_MODE_CONFIG, THEME_CONFIG } from './constants';
import Homepage from './components/Homepage';
import Privacy from './components/Legal/Privacy';
import Terms from './components/Legal/Terms';
import Contact from './components/Legal/Contact';
import Footer from './components/Layout/Footer';
import { isNativePlatform } from './services/platform';

const EXAM_OPTIONS = [
  { id: 'UPSC Prelims', label: 'UPSC Prelims', icon: Landmark, color: 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20' },
  { id: 'SSC / Banking', label: 'SSC / Banking', icon: BookOpen, color: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20' },
  { id: 'NEET / JEE', label: 'NEET / JEE', icon: Microscope, color: 'bg-green-50 text-green-600 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20' },
  { id: 'State PSC Exams', label: 'State PSC Exams', icon: GraduationCap, color: 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20' },
];

const TABS = [
  { id: 'students', label: 'Students', mobileLabel: 'Students', icon: Users, premium: false },
  { id: 'exams', label: 'Exams', mobileLabel: 'Exams', icon: GraduationCap, premium: false },
  { id: 'equations', label: 'Equations', mobileLabel: 'Math', icon: Calculator, premium: false },
  { id: 'english', label: 'English', mobileLabel: 'Lang', icon: Languages, premium: true },
];

type InputToolType = 'text' | 'image' | 'pdf' | 'url' | 'voice';

function encodePCM(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function createPCMBlob(data: Float32Array): GenAIBlob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encodePCM(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

export const FootballIcon = ({ size = 32, className = "" }: { size?: number, className?: string }) => (
  <div className={`animate-football flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
    <svg viewBox="0 0 24 24" width="85%" height="85%" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" role="img" aria-labelledby="loading-title">
      <title id="loading-title">Bouncing football loading indicator</title>
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M12 2a14.5 14.5 0 0 0 0 20"></path>
      <path d="M2 12a14.5 14.5 0 0 0 20 0"></path>
      <path d="M4.5 9.5a14.5 14.5 0 0 1 15 0"></path>
      <path d="M4.5 14.5a14.5 14.5 0 0 0 15 0"></path>
    </svg>
  </div>
);

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '79, 70, 229';
}

const App: React.FC = () => {
  const [isNative, setIsNative] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  // Use firebase.User for the type to resolve named export missing error
  const [currentUser, setCurrentUser] = useState<firebase.User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('studyclub24_theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const [activeTab, setActiveTab] = useState<string>('students');
  const [showResultView, setShowResultView] = useState(false);
  const [tabInputs, setTabInputs] = useState<Record<string, string>>({
    students: '',
    exams: '',
    equations: '',
  });
  
  const [tabResults, setTabResults] = useState<Record<string, StudyContent | null>>({});
  const [tabCaches, setTabCaches] = useState<Record<string, Partial<Record<StudyMode, StudyContent>>>>({});
  const [tabSelectedModes, setTabSelectedModes] = useState<Record<string, StudyMode | null>>({});
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [mathInputMode, setMathInputMode] = useState<'content' | 'manual'>('content');
  const [detectedEquations, setDetectedEquations] = useState<string[]>([]);
  const [isDetectingEquations, setIsDetectingEquations] = useState(false);
  const [selectedEquationIndex, setSelectedEquationIndex] = useState<number | null>(null);
  const [equationManualText, setEquationManualText] = useState('');
  const [savedMaterials, setSavedMaterials] = useState<SavedMaterial[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [studyHistory, setStudyHistory] = useState<StudyHistoryItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  
  const [tabProcessedStates, setTabProcessedStates] = useState<Record<string, boolean>>({
    students: false,
    exams: false,
    equations: false,
  });
  
  const [isRecording, setIsRecording] = useState(false);
  const [liveTranscription, setLiveTranscription] = useState('');
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const [currentAchievement, setCurrentAchievement] = useState<AchievementBadge | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [librarySearchQuery, setLibrarySearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatingMode, setGeneratingMode] = useState<StudyMode | null>(null);
  const [extractingSource, setExtractingSource] = useState<'image' | 'pdf' | 'url' | 'voice' | null>(null);
  const [error, setError] = useState<React.ReactNode | null>(null);
  const [activeInputTool, setActiveInputTool] = useState<InputToolType>('text');
  // Legal pages state (privacy/terms/contact)
  const [legalPage, setLegalPage] = useState<'privacy' | 'terms' | 'contact' | null>(null);

  // Notification modal state
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'warning'; title: string; message: string } | null>(null);

  const [urlValue, setUrlValue] = useState('');
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const detectionTimeoutRef = useRef<number | null>(null);

  const filteredLibrary = useMemo(() => {
    return savedMaterials.filter(item => 
      item.label.toLowerCase().includes(librarySearchQuery.toLowerCase()) ||
      item.mode.toLowerCase().includes(librarySearchQuery.toLowerCase())
    );
  }, [savedMaterials, librarySearchQuery]);

  // Premium Gating Functions
  const userPlan = userProfile?.subscriptionPlanId || 'free';
  const isFree = userPlan === 'free';
  const isCrashCourse = userPlan === 'crash-course';
  const isInstantHelp = userPlan === 'instant-help';
  const isFocusedPrep = userPlan === 'focused-prep';
  const isStudyPro = userPlan === 'study-pro';

  const canUseFeature = (feature: 'themes' | 'save' | 'english' | 'sharing' | 'tts' | 'regen' | 'courses' | 'flashcards' | 'summaries' | 'test' | 'studyplan'): boolean => {
    if (isStudyPro) return true;
    
    switch (feature) {
      case 'courses': return isCrashCourse || isFocusedPrep || isStudyPro;
      case 'flashcards':
      case 'summaries':
      case 'test': return isInstantHelp || isFocusedPrep || isStudyPro;
      case 'studyplan': return isInstantHelp || isFocusedPrep || isStudyPro;
      case 'themes':
      case 'english': return isFocusedPrep || isStudyPro;
      case 'save':
      case 'sharing': return isStudyPro;
      case 'tts': return isInstantHelp || isFocusedPrep || isStudyPro;
      case 'regen': return !isFree && !isCrashCourse;
      default: return false;
    }
  };

  const getInputLimits = () => {
    if (isStudyPro) return Infinity;
    if (isFree || isCrashCourse) return 0; // No notes upload
    if (isInstantHelp) return 5; // 5 per day
    if (isFocusedPrep) return 10; // 10 per day
    return 0;
  };

  const checkLimitBeforeSubmit = (): { allowed: boolean; reason?: string } => {
    const totalGen = userProfile?.stats.totalGenerations || 0;
    const dailyGen = userProfile?.stats.dailyGenerations || 0;
    const limit = getInputLimits();

    if ((isFree || isCrashCourse) && limit === 0) {
      return { allowed: false, reason: "Notes upload not available on your plan. Upgrade to unlock." };
    }
    
    if (!isStudyPro && limit > 0 && dailyGen >= limit) {
      return { allowed: false, reason: `You've reached your daily limit of ${limit} notes upload. Upgrade to Study Pro for unlimited access.` };
    }

    return { allowed: true };
  };

  // Expose notification function to razorpayService
  useEffect(() => {
    window.showNotification = (type, title, message) => {
      setNotification({ type, title, message });
    };
    return () => {
      delete window.showNotification;
    };
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('studyclub24_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('studyclub24_theme', 'light');
    }
    
    const framework = userProfile?.preferences.flashcardTheme || FlashcardTheme.CLASSIC;
    const config = THEME_CONFIG[framework];
    
    document.documentElement.setAttribute('data-framework', framework);
    document.documentElement.style.setProperty('--primary-theme', config.primary);
    document.documentElement.style.setProperty('--accent-theme', config.accent);
    document.documentElement.style.setProperty('--primary-rgb', hexToRgb(config.primary));
    
  }, [isDarkMode, userProfile?.preferences.flashcardTheme]);

  useEffect(() => {
    // Replaced modular onAuthStateChanged with compat instance method
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setAuthLoading(true);
      if (user) {
        setIsHydrated(false);
        const uid = user.uid;
        const historyKey = `studyclub24_history_${uid}`;
        const libraryKey = `studyclub24_library_${uid}`;
        const inputKey = `studyclub24_tab_inputs_${uid}`;
        const examKey = `studyclub24_selected_exam_${uid}`;
        const resultsKey = `studyclub24_tab_results_${uid}`;
        const cachesKey = `studyclub24_tab_caches_${uid}`;
        const selectedModesKey = `studyclub24_selected_modes_${uid}`;
        const viewStateKey = `studyclub24_view_state_${uid}`;
        const activeTabKey = `studyclub24_active_tab_${uid}`;
        const processedKey = `studyclub24_processed_states_${uid}`;
        
        try {
          const storedHistory = localStorage.getItem(historyKey);
          const storedLibrary = localStorage.getItem(libraryKey);
          const storedInputs = localStorage.getItem(inputKey);
          const storedExam = localStorage.getItem(examKey);
          const storedResults = localStorage.getItem(resultsKey);
          const storedCaches = localStorage.getItem(cachesKey);
          const storedModes = localStorage.getItem(selectedModesKey);
          const storedView = localStorage.getItem(viewStateKey);
          const storedActiveTab = localStorage.getItem(activeTabKey);
          const storedProcessed = localStorage.getItem(processedKey);

          setStudyHistory(storedHistory ? JSON.parse(storedHistory) : []);
          setSavedMaterials(storedLibrary ? JSON.parse(storedLibrary) : []);
          setTabInputs(storedInputs ? JSON.parse(storedInputs) : { students: '', exams: '', equations: '' });
          setSelectedExam(storedExam ? JSON.parse(storedExam) : null);
          setTabResults(storedResults ? JSON.parse(storedResults) : {});
          setTabCaches(storedCaches ? JSON.parse(storedCaches) : {});
          setTabSelectedModes(storedModes ? JSON.parse(storedModes) : {});
          setShowResultView(storedView ? JSON.parse(storedView) : false);
          setActiveTab(storedActiveTab ? JSON.parse(storedActiveTab) : 'students');
          setTabProcessedStates(storedProcessed ? JSON.parse(storedProcessed) : { students: false, exams: false, equations: false });
        } catch (e) {
          console.error("Hydration Error:", e);
        }

        setIsHydrated(true);
        setCurrentUser(user);
        setError(null);
      } else {
        setIsHydrated(false);
        setCurrentUser(null);
        setUserProfile(null);
        setStudyHistory([]);
        setSavedMaterials([]);
        setTabResults({});
        setTabCaches({});
        setTabSelectedModes({});
        setShowResultView(false);
        setTabInputs({ students: '', exams: '', equations: '' });
        setTabProcessedStates({ students: false, exams: false, equations: false });
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentUser && isHydrated) {
      const uid = currentUser.uid;
      localStorage.setItem(`studyclub24_history_${uid}`, JSON.stringify(studyHistory));
      localStorage.setItem(`studyclub24_library_${uid}`, JSON.stringify(savedMaterials));
      localStorage.setItem(`studyclub24_tab_inputs_${uid}`, JSON.stringify(tabInputs));
      localStorage.setItem(`studyclub24_selected_exam_${uid}`, JSON.stringify(selectedExam));
      localStorage.setItem(`studyclub24_tab_results_${uid}`, JSON.stringify(tabResults));
      localStorage.setItem(`studyclub24_tab_caches_${uid}`, JSON.stringify(tabCaches));
      localStorage.setItem(`studyclub24_selected_modes_${uid}`, JSON.stringify(tabSelectedModes));
      localStorage.setItem(`studyclub24_view_state_${uid}`, JSON.stringify(showResultView));
      localStorage.setItem(`studyclub24_active_tab_${uid}`, JSON.stringify(activeTab));
      localStorage.setItem(`studyclub24_processed_states_${uid}`, JSON.stringify(tabProcessedStates));
    }
  }, [studyHistory, savedMaterials, tabInputs, selectedExam, tabResults, tabCaches, tabSelectedModes, showResultView, activeTab, currentUser, isHydrated, tabProcessedStates]);

  useEffect(() => {
    if (!currentUser) {
      setUserProfile(null);
      return;
    }
    // Updated Firestore query to compat style
    const userDocRef = db.collection('users').doc(currentUser.uid);
    const unsubscribe = userDocRef.onSnapshot((snapshot) => {
      if (snapshot.exists) {
        const data = snapshot.data() as UserProfile;
        // Daily reset logic
        const lastActive = data.stats.lastActiveDate || 0;
        const today = new Date().setHours(0, 0, 0, 0);
        const lastDay = new Date(lastActive).setHours(0, 0, 0, 0);
        
        if (today > lastDay) {
          userDocRef.update({ 'stats.dailyGenerations': 0, 'stats.lastActiveDate': Date.now() });
        }
        
        setUserProfile(data);
      }
    });
    return () => unsubscribe();
  }, [currentUser?.uid]); 

  const updateFirestoreStats = async (updates: Partial<UserProfile['stats']>) => {
    if (!currentUser) return;
    // Updated Firestore query to compat style
    const userDocRef = db.collection('users').doc(currentUser.uid);
    const newStats = { ...userProfile?.stats, ...updates };
    try {
      await userDocRef.update({ stats: newStats });
    } catch (err) {
      console.error("Update Stats Error:", err);
    }
  };

  const handleUpdatePreferences = async (prefs: Partial<UserProfile['preferences']>) => {
    if (!currentUser) return;
    // Updated Firestore query to compat style
    const userDocRef = db.collection('users').doc(currentUser.uid);
    try {
      await userDocRef.update({
        preferences: { ...userProfile?.preferences, ...prefs }
      });
    } catch (err) {
      console.error("Update Preferences Error:", err);
    }
  };

  // Fixed: Added handleClearHistory to clear session history
  const handleClearHistory = () => {
    if (window.confirm("Clear all your recent study sessions?")) {
      setStudyHistory([]);
    }
  };

  // Fixed: Implementation of voice recording for transcription
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        setIsLoading(true);
        setExtractingSource('voice');
        try {
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            const resultData = reader.result as string;
            const base64 = resultData.split(',')[1];
            const text = await transcribeAudio(base64, audioBlob.type);
            handleTextChange(text);
          };
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
          setExtractingSource(null);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Mic access denied", err);
      setError("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setIsRecording(false);
  };

  const toggleVoiceRecording = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  const handleLogout = async () => {
    // Replaced modular signOut with compat instance method
    try { await auth.signOut(); } catch (err) { console.error("Logout failed", err); }
  };

  const handleAchievementUpdate = useCallback((achievement: AchievementBadge | null) => {
      if (achievement && (!currentAchievement || achievement.type !== currentAchievement.type || achievement.rank !== currentAchievement.rank)) {
          setCurrentAchievement(achievement);
          // Only show sharing modal if allowed
          if (canUseFeature('sharing')) {
            setShowShareModal(true);
          }
      } else if (!achievement) {
          setCurrentAchievement(null);
      }
  }, [currentAchievement, userPlan]);

  const runEquationDetection = async (text: string) => {
    if (text.trim().length > 3) {
      setIsDetectingEquations(true);
      try {
        const eqs = await detectEquations(text);
        setDetectedEquations(eqs);
        if (eqs.length > 0) setSelectedEquationIndex(0);
        else setSelectedEquationIndex(null);
      } catch (err) { 
        console.error("Equation Detection Error:", err); 
      } finally { 
        setIsDetectingEquations(false); 
      }
    } else {
      setDetectedEquations([]);
    }
  };

  const handleTextChange = async (text: string) => {
    const prevText = activeTab === 'equations' ? (mathInputMode === 'content' ? tabInputs.equations : equationManualText) : tabInputs[activeTab];
    if (activeTab === 'equations' && mathInputMode === 'manual') {
      setEquationManualText(text);
    } else {
      setTabInputs(prev => ({ ...prev, [activeTab]: text }));
    }
    
    if (text !== prevText) {
        setTabResults(prev => ({ ...prev, [activeTab]: null }));
        setTabCaches(prev => ({ ...prev, [activeTab]: {} }));
        setTabProcessedStates(prev => ({ ...prev, [activeTab]: false }));
        
        if (detectionTimeoutRef.current) window.clearTimeout(detectionTimeoutRef.current);
        detectionTimeoutRef.current = window.setTimeout(() => {
            runEquationDetection(text);
        }, 1200); 
    }
    
    if (!text.trim()) {
      setTabProcessedStates(prev => ({ ...prev, [activeTab]: false }));
      setDetectedEquations([]);
    }
  };

  const handleResetCurrentTab = () => {
    if (activeTab === 'equations') { setEquationManualText(''); setTabInputs(prev => ({ ...prev, equations: '' })); setDetectedEquations([]); setSelectedEquationIndex(null); }
    else { setTabInputs(prev => ({ ...prev, [activeTab]: '' })); if (activeTab === 'exams') setSelectedExam(null); }
    setTabResults(prev => ({ ...prev, [activeTab]: null }));
    setTabCaches(prev => ({ ...prev, [activeTab]: {} }));
    setTabSelectedModes(prev => ({ ...prev, [activeTab]: null }));
    setTabProcessedStates(prev => ({ ...prev, [activeTab]: false }));
    setError(null); setUrlValue(''); setActiveInputTool('text');
  };

  const handleUrlExtraction = async () => {
    if (!urlValue.trim()) return;
    setIsLoading(true); setExtractingSource('url'); setError(null);
    try {
      const text = await processUrlInput(urlValue);
      setTabInputs(prev => ({ ...prev, [activeTab]: text }));
      setActiveInputTool('text'); setUrlValue('');
      setTabProcessedStates(prev => ({ ...prev, [activeTab]: false }));
      runEquationDetection(text);
    } catch (err: any) { setError(err.message); } finally { setIsLoading(false); setExtractingSource(null); }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setIsLoading(true); setExtractingSource(file.type.startsWith('image/') ? 'image' : 'pdf'); setError(null);
    try {
      const text = await extractTextFromMedia(file);
      setTabInputs(prev => ({ ...prev, [activeTab]: text }));
      setActiveInputTool('text');
      setTabProcessedStates(prev => ({ ...prev, [activeTab]: false }));
      runEquationDetection(text);
    } catch (err: any) { setError(err.message); } finally { setIsLoading(false); setExtractingSource(null); if (e.target) e.target.value = ''; }
  };

  const handleGenerate = async (mode: StudyMode, method?: string, theme?: FlashcardTheme, forceRegenerate = false) => {
    if (!hasContent) return;

    // Check Limits
    const limitCheck = checkLimitBeforeSubmit();
    if (!limitCheck.allowed) {
      setError(
        <div className="flex flex-col gap-4">
           <div className="flex items-center gap-3 text-red-600">
             <ShieldAlert size={24} />
             <span className="font-black uppercase tracking-tight">Access Locked</span>
           </div>
           <p className="text-sm font-bold text-slate-600 leading-relaxed">{limitCheck.reason}</p>
           <button onClick={() => setShowUpgradeModal(true)} className="theme-bg text-white py-3 rounded-xl font-black uppercase text-xs tracking-widest shadow-xl shadow-theme-soft hover:opacity-90">View Plans</button>
        </div>
      );
      return;
    }

    // Regeneration Gate
    if (forceRegenerate && !canUseFeature('regen')) {
      setShowUpgradeModal(true);
      return;
    }

    setShowResultView(true);
    setTabProcessedStates(prev => ({ ...prev, [activeTab]: true }));
    const currentTabCache = tabCaches[activeTab] || {};
    if (!forceRegenerate && currentTabCache[mode] && !theme) {
      setTabResults(prev => ({ ...prev, [activeTab]: currentTabCache[mode] as StudyContent }));
      setTabSelectedModes(prev => ({ ...prev, [activeTab]: mode }));
      return;
    }
    setIsLoading(true); setGeneratingMode(mode); setError(null);
    try {
      const inputToUse = activeTab === 'equations' 
        ? (mathInputMode === 'content' ? (selectedEquationIndex !== null ? detectedEquations[selectedEquationIndex] : '') : equationManualText)
        : tabInputs[activeTab];
      const themeToUse = (mode === StudyMode.FLASHCARDS && !theme) ? userProfile?.preferences.flashcardTheme : theme;
      const result = await generateStudyMaterial(inputToUse, mode, selectedExam || method || 'DEFAULT', themeToUse);
      setTabResults(prev => ({ ...prev, [activeTab]: result }));
      setTabSelectedModes(prev => ({ ...prev, [activeTab]: mode }));
      setTabCaches(prev => ({ ...prev, [activeTab]: { ...(prev[activeTab] || {}), [mode]: result } }));
      if (userProfile) {
        updateFirestoreStats({ 
          totalGenerations: userProfile.stats.totalGenerations + 1,
          dailyGenerations: (userProfile.stats.dailyGenerations || 0) + 1,
          lastActiveDate: Date.now()
        });
      }
      const historyItem: StudyHistoryItem = { 
        id: Date.now().toString(), 
        timestamp: Date.now(), 
        topic: inputToUse.substring(0, 100), 
        mode 
      };
      setStudyHistory(prev => [historyItem, ...prev].slice(0, 50));
      
      // Clear input fields after successful generation
      if (activeTab === 'equations') {
        if (mathInputMode === 'content') {
          setTabInputs(prev => ({ ...prev, equations: '' }));
          setDetectedEquations([]);
          setSelectedEquationIndex(null);
        } else {
          setEquationManualText('');
        }
      } else {
        setTabInputs(prev => ({ ...prev, [activeTab]: '' }));
        if (activeTab === 'exams') setSelectedExam(null);
      }
    } catch (err: any) { 
        setError(err.message); 
        setShowResultView(false);
    } finally { 
        setIsLoading(false); setGeneratingMode(null); 
    }
  };

  const handleRestoreSession = (item: StudyHistoryItem) => {
      const targetTab = item.mode === StudyMode.MATH ? 'equations' : 'students';
      setActiveTab(targetTab);
      if (targetTab === 'equations') {
          setMathInputMode('manual');
          setEquationManualText(item.topic);
      } else {
          setTabInputs(prev => ({ ...prev, [targetTab]: item.topic }));
      }
      handleGenerate(item.mode);
  };

  const handleSave = () => {
    if (!canUseFeature('save')) {
      setShowUpgradeModal(true);
      return;
    }
    const content = tabResults[activeTab];
    if (!content) return;
    const newSaved: SavedMaterial = { id: Date.now().toString(), timestamp: Date.now(), exam: selectedExam || 'General', mode: content.mode, content, label: currentInput.substring(0, 50) + '...' };
    setSavedMaterials(prev => [newSaved, ...prev]);
    if (userProfile) updateFirestoreStats({ masteredConcepts: userProfile.stats.masteredConcepts + 1 });
  };

  const currentInput = activeTab === 'equations' ? (mathInputMode === 'content' ? tabInputs.equations : equationManualText) : (tabInputs[activeTab] || '');
  const hasContent = activeTab === 'equations' ? (mathInputMode === 'content' ? (detectedEquations.length > 0 || isDetectingEquations) : !!equationManualText.trim()) : !!currentInput.trim();
  const isProcessed = tabProcessedStates[activeTab];

  const getTabPlaceholder = () => {
    if (activeTab === 'equations') {
      return mathInputMode === 'content' 
        ? "Paste messy notes to automatically extract mathematical equations..." 
        : "Enter equation manually (e.g. 4x² - 5x - 12 = 0)...";
    }
    if (activeTab === 'exams') {
      return "Input exam syllabus or preparation content for targeted academic analysis...";
    }
    return "Add your study material (notes, text, or concepts) here to begin interpretation...";
  };

  useEffect(() => {
    try { setIsNative(isNativePlatform()); } catch (e) { setIsNative(false); }
  }, []);

  if (authLoading) return <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center p-4"><Loader2 className="animate-spin text-indigo-600" size={48} /></div>;

  // Platform-aware routing rules
  if (isNative) {
    // Mobile app: never show homepage — force auth screen when unauthenticated
    if (!currentUser) return <AuthScreen />;
  } else {
    // Web: homepage is primary entry and is always accessible without auth
    if (!currentUser) {
      // If a legal page is requested, render it instead of the homepage
      if (legalPage === 'privacy') return (
        <div className="min-h-screen bg-[#F8F9FC] dark:bg-slate-950 pb-20 transition-colors framework-context">
          <Header
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            onProfileClick={() => setShowAuthModal(true)}
            onCoursesClick={() => setActiveTab('courses')}
            onLogoClick={() => { setLegalPage(null); setActiveTab('students'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            isActiveProfile={activeTab === 'profile'}
            isActiveCourses={activeTab === 'courses'}
            activeFramework={userProfile?.preferences.flashcardTheme || FlashcardTheme.CLASSIC}
            onSetFramework={(f) => handleUpdatePreferences({ flashcardTheme: f })}
            planId={userPlan}
            canUseThemes={canUseFeature('themes')}
          />
          <main className="container mx-auto px-4 py-8"><Privacy onBack={() => setLegalPage(null)} /></main>
          <Footer onOpenLegal={(s) => setLegalPage(s)} />
        </div>
      );
      if (legalPage === 'terms') return (
        <div className="min-h-screen bg-[#F8F9FC] dark:bg-slate-950 pb-20 transition-colors framework-context">
          <Header
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            onProfileClick={() => setShowAuthModal(true)}
            onCoursesClick={() => setActiveTab('courses')}
            onLogoClick={() => { setLegalPage(null); setActiveTab('students'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            isActiveProfile={activeTab === 'profile'}
            isActiveCourses={activeTab === 'courses'}
            activeFramework={userProfile?.preferences.flashcardTheme || FlashcardTheme.CLASSIC}
            onSetFramework={(f) => handleUpdatePreferences({ flashcardTheme: f })}
            planId={userPlan}
            canUseThemes={canUseFeature('themes')}
          />
          <main className="container mx-auto px-4 py-8"><Terms onBack={() => setLegalPage(null)} /></main>
          <Footer onOpenLegal={(s) => setLegalPage(s)} />
        </div>
      );
      if (legalPage === 'contact') return (
        <div className="min-h-screen bg-[#F8F9FC] dark:bg-slate-950 pb-20 transition-colors framework-context">
          <Header
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            onProfileClick={() => setShowAuthModal(true)}
            onCoursesClick={() => setActiveTab('courses')}
            onLogoClick={() => { setLegalPage(null); setActiveTab('students'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            isActiveProfile={activeTab === 'profile'}
            isActiveCourses={activeTab === 'courses'}
            activeFramework={userProfile?.preferences.flashcardTheme || FlashcardTheme.CLASSIC}
            onSetFramework={(f) => handleUpdatePreferences({ flashcardTheme: f })}
            planId={userPlan}
            canUseThemes={canUseFeature('themes')}
          />
          <main className="container mx-auto px-4 py-8"><Contact onBack={() => setLegalPage(null)} /></main>
          <Footer onOpenLegal={(s) => setLegalPage(s)} />
        </div>
      );

      return (
        <>
          <Homepage onOpenAuth={() => setShowAuthModal(true)} onOpenLegal={(s) => setLegalPage(s)} />
          {showAuthModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowAuthModal(false)}>
              <div className="absolute inset-0 bg-black/40" />
              <div className="w-full max-w-md mx-4 relative" onClick={(e) => e.stopPropagation()}>
                <AuthScreen onClose={() => setShowAuthModal(false)} isModal={true} />
              </div>
            </div>
          )}
        </>
      );
    }
  }

  // If a legal page is requested while authenticated, render it at top level
  if (legalPage === 'privacy') return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-slate-950 pb-20 transition-colors framework-context">
      <Header
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onProfileClick={() => setActiveTab('profile')}
        onCoursesClick={() => setActiveTab('courses')}
        onLogoClick={() => { setLegalPage(null); setActiveTab('students'); setError(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        isActiveProfile={activeTab === 'profile'}
        isActiveCourses={activeTab === 'courses'}
        activeFramework={userProfile?.preferences.flashcardTheme || FlashcardTheme.CLASSIC}
        onSetFramework={(f) => {
          if (canUseFeature('themes')) handleUpdatePreferences({ flashcardTheme: f }); else setShowUpgradeModal(true);
        }}
        planId={userPlan}
        canUseThemes={canUseFeature('themes')}
      />
      <main className="container mx-auto px-4 py-8"><Privacy onBack={() => setLegalPage(null)} /></main>
      <Footer onOpenLegal={(s) => setLegalPage(s)} />
    </div>
  );
  if (legalPage === 'terms') return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-slate-950 pb-20 transition-colors framework-context">
      <Header
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onProfileClick={() => setActiveTab('profile')}
        onCoursesClick={() => setActiveTab('courses')}
        onLogoClick={() => { setLegalPage(null); setActiveTab('students'); setError(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        isActiveProfile={activeTab === 'profile'}
        isActiveCourses={activeTab === 'courses'}
        activeFramework={userProfile?.preferences.flashcardTheme || FlashcardTheme.CLASSIC}
        onSetFramework={(f) => {
          if (canUseFeature('themes')) handleUpdatePreferences({ flashcardTheme: f }); else setShowUpgradeModal(true);
        }}
        planId={userPlan}
        canUseThemes={canUseFeature('themes')}
      />
      <main className="container mx-auto px-4 py-8"><Terms onBack={() => setLegalPage(null)} /></main>
      <Footer onOpenLegal={(s) => setLegalPage(s)} />
    </div>
  );
  if (legalPage === 'contact') return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-slate-950 pb-20 transition-colors framework-context">
      <Header
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onProfileClick={() => setActiveTab('profile')}
        onCoursesClick={() => setActiveTab('courses')}
        onLogoClick={() => { setLegalPage(null); setActiveTab('students'); setError(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        isActiveProfile={activeTab === 'profile'}
        isActiveCourses={activeTab === 'courses'}
        activeFramework={userProfile?.preferences.flashcardTheme || FlashcardTheme.CLASSIC}
        onSetFramework={(f) => {
          if (canUseFeature('themes')) handleUpdatePreferences({ flashcardTheme: f }); else setShowUpgradeModal(true);
        }}
        planId={userPlan}
        canUseThemes={canUseFeature('themes')}
      />
      <main className="container mx-auto px-4 py-8"><Contact onBack={() => setLegalPage(null)} /></main>
      <Footer onOpenLegal={(s) => setLegalPage(s)} />
    </div>
  );

  
  if (activeTab === 'english') {
    if (!canUseFeature('english')) {
       return (
         <div className="min-h-screen bg-[#F8F9FC] dark:bg-slate-950 pb-20 transition-colors framework-context">
           <Header
             isDarkMode={isDarkMode}
             onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
             onProfileClick={() => setActiveTab('profile')}
             onCoursesClick={() => setActiveTab('courses')}
             onLogoClick={() => { setActiveTab('students'); setError(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
             isActiveProfile={activeTab === 'profile'}
             isActiveCourses={activeTab === 'courses'}
             activeFramework={userProfile?.preferences.flashcardTheme || FlashcardTheme.CLASSIC}
             onSetFramework={(f) => {
               if (canUseFeature('themes')) handleUpdatePreferences({ flashcardTheme: f }); else setShowUpgradeModal(true);
             }}
             planId={userPlan}
             canUseThemes={canUseFeature('themes')}
           />
           <main className="container mx-auto px-4 py-12 flex items-center justify-center">
             <div className="bg-white p-12 rounded-[3rem] shadow-2xl max-w-lg border border-pink-100 flex flex-col items-center">
               <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center text-pink-500 mb-8 ring-8 ring-pink-50/50">
                  <Lock size={40} />
               </div>
               <h2 className="text-3xl font-black text-slate-900 mb-4">🔒 Unlock Prep Protocol</h2>
               <p className="text-slate-500 font-medium leading-relaxed mb-10">The English Learning Suite is available for students on <span className="font-bold text-pink-600">Monthly or higher plans</span>. Upgrade to access conversational AI, voice evaluation, and grammar challenges.</p>
               <div className="flex flex-col gap-3 w-full">
                   <button onClick={() => setShowUpgradeModal(true)} className="w-full py-4 bg-pink-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-pink-200 active:scale-95 transition-all">Upgrade Now</button>
                   <button onClick={() => setActiveTab('students')} className="w-full py-4 bg-white text-slate-400 font-bold uppercase text-xs tracking-widest hover:text-slate-600">Maybe Later</button>
               </div>
             </div>
           </main>
           <Footer onOpenLegal={(s) => setLegalPage(s)} />
         </div>
       );
    }
    return (
      <div className="min-h-screen bg-[#F8F9FC] dark:bg-slate-950 pb-20 transition-colors framework-context">
        <Header
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          onProfileClick={() => setActiveTab('profile')}
          onCoursesClick={() => setActiveTab('courses')}
          onLogoClick={() => { setActiveTab('students'); setError(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          isActiveProfile={activeTab === 'profile'}
          isActiveCourses={activeTab === 'courses'}
          activeFramework={userProfile?.preferences.flashcardTheme || FlashcardTheme.CLASSIC}
          onSetFramework={(f) => {
            if (canUseFeature('themes')) handleUpdatePreferences({ flashcardTheme: f }); else setShowUpgradeModal(true);
          }}
          planId={userPlan}
          canUseThemes={canUseFeature('themes')}
        />
        <main className="container mx-auto px-4 py-8">
          <EnglishLearningApp onBack={() => setActiveTab('students')} />
        </main>
        <Footer onOpenLegal={(s) => setLegalPage(s)} />
      </div>
    );
  }

  if (activeTab === 'courses') {
    return (
      <div className="min-h-screen bg-[#F8F9FC] dark:bg-slate-950 pb-20 transition-colors framework-context">
        <Header 
          isDarkMode={isDarkMode} 
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
          onProfileClick={() => { setActiveTab('profile'); setShowResultView(false); }}
          onCoursesClick={() => setActiveTab('courses')}
          onLogoClick={() => { setActiveTab('students'); setShowResultView(false); setError(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          isActiveProfile={activeTab === 'profile'}
          isActiveCourses={activeTab === 'courses'}
          activeFramework={userProfile?.preferences.flashcardTheme || FlashcardTheme.CLASSIC}
          onSetFramework={(f) => handleUpdatePreferences({ flashcardTheme: f })}
          planId={userPlan}
          canUseThemes={canUseFeature('themes')}
        />
        <ErrorBoundary>
          <CoursesPage />
        </ErrorBoundary>
        <Footer onOpenLegal={(s) => setLegalPage(s)} />
      </div>
    );
  }

  if (showResultView) {
      return (
          <div className="min-h-screen bg-[#F8F9FC] dark:bg-slate-950 pb-20 animate-fade-in transition-colors framework-context">
              <Header 
                isDarkMode={isDarkMode} 
                onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
                onProfileClick={() => { setActiveTab('profile'); setShowResultView(false); }}
                onCoursesClick={() => { setActiveTab('courses'); setShowResultView(false); }}
                onLogoClick={() => { setActiveTab('students'); setShowResultView(false); setError(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                isActiveProfile={activeTab === 'profile'}
                isActiveCourses={activeTab === 'courses'}
                activeFramework={userProfile?.preferences.flashcardTheme || FlashcardTheme.CLASSIC}
                onSetFramework={(f) => {
                  if (canUseFeature('themes')) {
                    handleUpdatePreferences({ flashcardTheme: f });
                  } else {
                    setShowUpgradeModal(true);
                  }
                }}
                planId={userPlan}
                canUseThemes={canUseFeature('themes')}
              />
              <main className="container mx-auto px-4 py-8 min-h-[70vh] flex flex-col items-center">
                  <div className="w-full max-w-6xl">
                    <button onClick={() => setShowResultView(false)} className="mb-6 flex items-center gap-2 theme-text font-black text-xs uppercase tracking-widest hover:underline transition-all active:scale-95">
                      <ChevronLeft size={16} /> Back to Editor
                    </button>
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-40 animate-fade-in">
                            <FootballIcon size={120} className="theme-text mb-8" />
                            <p className="theme-text font-black uppercase tracking-[0.4em] text-sm animate-pulse">Upgrading Knowledge...</p>
                        </div>
                    ) : tabResults[activeTab] ? (
                        <MainDisplay 
                            content={tabResults[activeTab] || null} 
                            onRegenerate={(themeOrMethod) => { 
                                if (activeTab === 'equations') { 
                                    handleGenerate(StudyMode.MATH, themeOrMethod as string, undefined, true); 
                                } else { 
                                    if (themeOrMethod && !canUseFeature('themes')) {
                                      setShowUpgradeModal(true);
                                    } else {
                                      handleGenerate(tabSelectedModes[activeTab] as StudyMode, undefined, themeOrMethod as FlashcardTheme, true); 
                                    }
                                } 
                            }} 
                            onSave={handleSave} 
                            onMastery={() => {}} 
                            isRegenerating={isLoading} 
                            savedMaterials={savedMaterials}
                            canUseTTS={canUseFeature('tts')}
                            onOpenUpgrade={() => setShowUpgradeModal(true)}
                            canUseThemes={canUseFeature('themes')}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 opacity-50">
                             <Bookmark size={80} className="text-gray-200 dark:text-slate-700 mb-6" />
                             <p className="text-xl font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Protocol data missing</p>
                             <button onClick={() => setShowResultView(false)} className="mt-6 theme-text font-black text-xs uppercase tracking-widest hover:underline">Return to start</button>
                        </div>
                    )}
                  </div>
              </main>
              <Footer onOpenLegal={(s) => setLegalPage(s)} />
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-slate-950 pb-20 transition-colors framework-context">
      <Header 
        isDarkMode={isDarkMode} 
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
        onProfileClick={() => { setActiveTab('profile'); setShowResultView(false); }}
        onCoursesClick={() => setActiveTab('courses')}
        onLogoClick={() => { setActiveTab('students'); setShowResultView(false); setError(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        isActiveProfile={activeTab === 'profile'}
        isActiveCourses={activeTab === 'courses'}
        activeFramework={userProfile?.preferences.flashcardTheme || FlashcardTheme.CLASSIC}
        onSetFramework={(f) => {
          if (canUseFeature('themes')) {
            handleUpdatePreferences({ flashcardTheme: f });
          } else {
            setShowUpgradeModal(true);
          }
        }}
        planId={userPlan}
        canUseThemes={canUseFeature('themes')}
      />
      <main className="container mx-auto px-2 md:px-4 pt-4 md:pt-8">
        <div className="flex flex-col gap-6 md:gap-8 max-w-6xl mx-auto">
          <div className="grid grid-cols-4 md:flex md:overflow-x-auto gap-1 md:gap-2 pb-1">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setError(null); }}
                className={`group relative flex flex-col md:flex-row items-center justify-center gap-1 md:gap-3 px-1 md:px-6 py-3 md:py-4 rounded-xl md:rounded-[1.75rem] font-bold text-[9px] md:text-sm transition-all shadow-sm border ${
                  activeTab === tab.id ? 'theme-bg text-white border-white/20' : 'bg-white dark:bg-slate-900 text-gray-500 dark:text-slate-400 border-gray-100 dark:border-white/5'
                }`}
              >
                <tab.icon size={18} className="md:w-5 md:h-5" strokeWidth={2.5} />
                <span className="md:inline hidden">{tab.label}</span>
                <span className="md:hidden inline text-center leading-tight">{tab.mobileLabel}</span>
                {tab.premium && isFree && (
                  <Lock size={10} className="absolute top-1 right-1 text-pink-500" />
                )}
              </button>
            ))}
          </div>

          <Leaderboard key={currentUser ? currentUser.uid : null} user={currentUser} onAchievement={handleAchievementUpdate} />

          <div className="space-y-6 md:space-y-8 animate-fade-in-up px-1 md:px-0">
            {isFree && (
               <div className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-800 p-4 rounded-3xl border border-slate-200 dark:border-white/5 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-slate-300 animate-pulse" /> Sponsored Content Placeholder
               </div>
            )}

            {error && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-[2.5rem] p-8 shadow-xl shadow-amber-100/50 animate-fade-in text-amber-900 dark:text-amber-200">
                {error}
              </div>
            )}

            {activeTab === 'profile' && userProfile ? (
              <ProfileView 
                profile={userProfile} 
                history={studyHistory} 
                onUpdatePreferences={handleUpdatePreferences} 
                onLogout={handleLogout} 
                onOpenUpgrade={() => setShowUpgradeModal(true)} 
                onClearHistory={handleClearHistory} 
                onRestoreSession={handleRestoreSession} 
                canUseThemes={canUseFeature('themes')}
              />
            ) : activeTab === 'equations' && mathInputMode === 'manual' ? (
                <ScientificCalculator value={equationManualText} onChange={setEquationManualText} onSolve={(method) => handleGenerate(StudyMode.MATH, method)} disabled={isLoading} extraButtons={<button onClick={handleResetCurrentTab} className="p-2 text-gray-400 hover:text-red-500" aria-label="Clear equation input"><Trash2 size={20} /></button>} />
            ) : activeTab === 'exams' && !selectedExam ? (
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-16 shadow-xl shadow-indigo-100/50 dark:shadow-none border border-gray-100 dark:border-white/5">
                    <div className="text-center mb-8 md:mb-12">
                        <div className="inline-flex p-3 md:p-4 theme-bg-soft theme-text rounded-2xl md:rounded-3xl mb-4 md:mb-6"><Target size={32} /></div>
                        <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">Select Your Exam Goal</h2>
                        <p className="text-sm md:text-gray-500 dark:text-slate-400 font-medium mt-1 md:mt-2">Personalize the AI intelligence for your target.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        {EXAM_OPTIONS.map((exam) => (
                            <button key={exam.id} onClick={() => setSelectedExam(exam.id)} className="group relative flex items-center gap-4 md:gap-6 p-5 md:p-8 bg-white dark:bg-slate-800 border-2 border-gray-50 dark:border-white/5 rounded-2xl md:rounded-[2rem] text-left transition-all hover:border-theme">
                                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center ${exam.color} shadow-sm`}><exam.icon size={24} /></div>
                                <div className="flex-1">
                                    <h4 className="text-lg md:text-xl font-black text-gray-900 dark:text-white group-hover:theme-text">{exam.label}</h4>
                                    <p className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">Ready for Analysis</p>
                                </div>
                                <ChevronRight size={20} className="text-gray-200 dark:text-slate-700" />
                            </button>
                        ))}
                    </div>
                </div>
            ) : activeTab !== 'profile' && activeTab !== 'courses' && !error && (
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-xl shadow-indigo-100/50 dark:shadow-none border border-gray-100 dark:border-white/5 relative overflow-hidden transition-all duration-700">
                {extractingSource && <div className="absolute inset-0 z-[100] bg-white/60 dark:bg-slate-900/60 backdrop-blur-md flex flex-col items-center justify-center animate-fade-in"><FootballIcon size={80} className="theme-text" /></div>}
                
                {activeTab === 'equations' && (
                  <div className="flex bg-gray-200/50 dark:bg-slate-900/50 p-1 rounded-xl md:rounded-2xl w-full md:w-fit mb-6">
                    <button onClick={() => setMathInputMode('content')} className={`flex-1 md:flex-none px-4 md:px-5 py-2 md:py-2.5 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${mathInputMode === 'content' ? 'bg-white dark:bg-slate-800 theme-text shadow-md' : 'text-gray-500 dark:text-slate-500'}`}>Smart Extract</button>
                    <button onClick={() => setMathInputMode('manual')} className={`flex-1 md:flex-none px-4 md:px-5 py-2 md:py-2.5 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${mathInputMode === 'manual' ? 'bg-white dark:bg-slate-800 theme-text shadow-md' : 'text-gray-500 dark:text-slate-500'}`}>Manual Entry</button>
                  </div>
                )}

                {activeInputTool === 'url' ? (
                  <div className="w-full h-48 md:h-56 flex flex-col items-center justify-center p-4 md:p-10 space-y-4 md:space-y-6">
                    <div className="theme-bg-soft theme-text p-4 md:p-6 rounded-full animate-pulse"><Globe size={32} /></div>
                    <div className="w-full max-w-xl relative">
                      <input type="text" value={urlValue} onChange={(e) => { setUrlValue(e.target.value); setError(null); }} placeholder="Paste Link..." className="w-full pl-5 md:pl-6 pr-14 md:pr-16 py-4 md:py-5 bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-white/5 rounded-xl md:rounded-2xl outline-none focus:border-theme font-medium text-base md:text-lg dark:text-white" aria-label="Link to study material" />
                      <button onClick={handleUrlExtraction} disabled={!urlValue.trim()} className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 p-2.5 md:p-3 theme-bg text-white rounded-lg md:rounded-xl transition-all active:scale-90" aria-label="Extract content from link"><ArrowRight size={18} /></button>
                    </div>
                  </div>
                ) : (
                  <div className="relative group/input">
                    <textarea 
                      value={activeTab === 'equations' ? (mathInputMode === 'manual' ? equationManualText : tabInputs.equations) : tabInputs[activeTab]} 
                      onChange={(e) => handleTextChange(e.target.value)} 
                      readOnly={isProcessed}
                      placeholder={getTabPlaceholder()} 
                      className={`w-full h-48 md:h-56 bg-gray-50/50 dark:bg-slate-800/50 border-2 transition-all border-gray-100 dark:border-white/5 rounded-2xl md:rounded-[2rem] p-6 md:p-10 outline-none font-medium text-base md:text-xl resize-none dark:text-white ${isRecording ? 'ring-4 ring-red-500/20 border-red-500 shadow-xl' : 'focus:border-theme'} ${isProcessed ? 'opacity-70 cursor-default' : ''}`} 
                      aria-label="Study material text input"
                    />
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-6 md:mt-8">
                  {isProcessed ? (
                    <div className="flex flex-1 flex-col sm:flex-row items-center gap-3 animate-fade-in-up">
                       <button 
                         onClick={() => setTabProcessedStates(prev => ({ ...prev, [activeTab]: false }))}
                         className="flex-1 w-full sm:w-auto flex items-center justify-center gap-3 py-4 bg-white dark:bg-slate-800 theme-text border-2 theme-border rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-50 transition-all active:scale-95"
                       >
                         <Edit3 size={18} /> Edit Content
                       </button>
                       <button 
                         onClick={handleResetCurrentTab}
                         className="flex-1 w-full sm:w-auto flex items-center justify-center gap-3 py-4 bg-red-50 dark:bg-red-900/10 text-red-600 rounded-2xl font-black uppercase tracking-widest text-xs border border-red-100 dark:border-red-900/30 hover:bg-red-100 transition-all active:scale-95"
                       >
                         <Trash2 size={18} /> Delete Session
                       </button>
                    </div>
                  ) : hasContent ? (
                    <button 
                      onClick={() => {
                        if (activeTab === 'students') {
                          setTabProcessedStates(prev => ({ ...prev, students: true }));
                        } else if (activeTab === 'exams') {
                          handleGenerate(StudyMode.NOTES);
                        } else if (activeTab === 'equations') {
                          handleGenerate(StudyMode.MATH);
                        }
                      }} 
                      disabled={isLoading} 
                      className="flex-1 flex items-center justify-center gap-3 py-4 theme-bg text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-theme-soft hover:opacity-90 transition-all active:scale-95"
                    >
                      <Play size={18} fill="currentColor" /> {activeTab === 'students' ? 'Result Options' : 'Generate Analysis'}
                    </button>
                  ) : (
                    <>
                      <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-xl border border-gray-200/50 dark:border-white/5">
                        <button onClick={() => setActiveInputTool('text')} className={`flex items-center gap-1.5 px-3 md:px-5 py-2 md:py-2.5 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest ${activeInputTool === 'text' ? 'bg-white dark:bg-slate-700 theme-text shadow-sm' : 'text-gray-400 dark:text-slate-500'}`} aria-label="Switch to text input mode"><Type size={14} /> Text</button>
                        <button onClick={() => setActiveInputTool('url')} className={`flex items-center gap-1.5 px-3 md:px-5 py-2 md:py-2.5 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest ${activeInputTool === 'url' ? 'bg-white dark:bg-slate-700 theme-text shadow-sm' : 'text-gray-400 dark:text-slate-500'}`} aria-label="Switch to link input mode"><LinkIcon size={14} /> Link</button>
                      </div>
                      
                      <button 
                        onClick={() => {
                          if (isMonthlyOrAbove) toggleVoiceRecording();
                          else setShowUpgradeModal(true);
                        }} 
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 md:gap-3 px-4 md:px-8 py-3 md:py-4 rounded-xl text-[10px] md:text-sm font-black uppercase tracking-widest transition-all ${isRecording ? 'bg-red-500 text-white shadow-xl shadow-red-200 scale-105' : 'bg-white dark:bg-slate-700 text-pink-600 dark:text-pink-400 border-2 border-pink-100 dark:border-pink-500/20 hover:border-pink-300 active:scale-95'}`}
                        aria-label={isRecording ? "Stop voice recording" : "Start voice recording"}
                      >
                        {isRecording ? <StopCircle size={18} /> : (isMonthlyOrAbove ? <Mic size={18} /> : <Lock size={18} />)} {isRecording ? 'Stop' : 'Voice'}
                      </button>

                      <button onClick={() => imageInputRef.current?.click()} className="flex-1 md:flex-none flex items-center justify-center gap-2 md:gap-3 px-4 md:px-8 py-3 md:py-4 theme-bg text-white rounded-xl text-[10px] md:text-sm font-black uppercase tracking-widest transition-all hover:opacity-90 active:scale-95" aria-label="Scan image for text"><Camera size={18} /> Scan</button>
                      <button onClick={() => pdfInputRef.current?.click()} className="flex-1 md:flex-none flex items-center justify-center gap-2 md:gap-3 px-4 md:px-8 py-3 md:py-4 bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-200 border-2 border-gray-100 dark:border-white/5 rounded-xl text-[10px] md:text-sm font-black uppercase tracking-widest transition-all hover:bg-gray-50 active:scale-95" aria-label="Upload PDF document"><FileText size={18} /> Docs</button>
                    </>
                  )}
                  
                  {!isProcessed && (
                    <button onClick={handleResetCurrentTab} className="p-3 md:p-4 text-gray-300 dark:text-slate-700 hover:text-red-500 ml-auto transition-colors active:scale-90" aria-label="Clear current input"><Trash2 size={20} /></button>
                  )}
                  
                  <input type="file" ref={imageInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                  <input type="file" ref={pdfInputRef} className="hidden" accept="application/pdf" onChange={handleFileChange} />
                </div>
              </div>
            )}

            {activeTab === 'equations' && (detectedEquations.length > 0 || isDetectingEquations) && (
               <div className="animate-fade-in-up space-y-4">
                  <div className="flex items-center justify-between px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 theme-bg-soft theme-text rounded-xl flex items-center justify-center shadow-sm border theme-border">
                            <ScanLine size={20} className={isDetectingEquations ? 'animate-pulse' : ''} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Focus Protocol: Identified Equations</h3>
                            <p className="text-[10px] font-black theme-text uppercase tracking-widest opacity-60">Symbolic HUD Scanner Active</p>
                        </div>
                      </div>
                      <button onClick={() => { setMathInputMode('content'); }} className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border theme-border rounded-xl text-[10px] font-black uppercase tracking-widest theme-text hover:bg-gray-50 transition-all shadow-sm">
                          Solve Mode <ArrowRight size={14} />
                      </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 px-2">
                     {isDetectingEquations ? (
                        <div className="col-span-full flex items-center justify-center gap-3 text-gray-400 text-xs font-bold uppercase tracking-widest p-10 bg-white/30 dark:bg-slate-900/30 rounded-[2rem] border-2 border-dashed theme-border animate-pulse">
                           <Loader2 size={24} className="animate-spin theme-text" /> 
                           Deep Scanning Neural Patterns...
                        </div>
                     ) : (
                        detectedEquations.map((eq, idx) => {
                           const isSelected = selectedEquationIndex === idx;
                           return (
                               <div 
                                 key={idx} 
                                 className={`group relative p-6 rounded-[2rem] border-2 transition-all duration-500 overflow-hidden flex flex-col justify-between h-48 ${isSelected ? 'theme-bg theme-glow border-white/20 scale-[1.02]' : 'bg-white dark:bg-slate-900 border-gray-100 dark:border-white/5 hover:border-theme hover:bg-theme-bg-soft shadow-sm'}`}
                               >
                                   <div className={`absolute top-0 right-0 w-24 h-24 opacity-10 group-hover:opacity-20 transition-opacity -mr-8 -mt-8 ${isSelected ? 'text-white' : 'theme-text'}`}>
                                       <Focus size={80} />
                                   </div>
                                   <div className="relative z-10 flex flex-col h-full">
                                       <div className={`text-[9px] font-black uppercase tracking-widest mb-4 ${isSelected ? 'text-white/60' : 'text-gray-400'}`}>
                                            Formula ID #{idx + 1}
                                       </div>
                                       <div className={`text-xl font-black mb-auto truncate font-mono ${isSelected ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                                           {eq}
                                       </div>
                                       <div className="flex gap-2 mt-4">
                                           <button 
                                                onClick={() => {
                                                    setSelectedEquationIndex(idx);
                                                    setMathInputMode('content');
                                                }}
                                                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isSelected ? 'bg-white/20 text-white' : 'theme-bg-soft theme-text hover:bg-white border theme-border shadow-sm'}`}
                                           >
                                               {isSelected ? 'Selected' : 'Select'}
                                           </button>
                                           <button 
                                                onClick={() => {
                                                    setSelectedEquationIndex(idx);
                                                    setMathInputMode('content');
                                                    handleGenerate(StudyMode.MATH);
                                                }}
                                                className={`p-3 rounded-xl transition-all shadow-lg ${isSelected ? 'bg-white text-indigo-600' : 'theme-bg text-white hover:opacity-90 shadow-theme-soft'}`}
                                                title="Immediate Step-by-Step Analysis"
                                           >
                                               <Wand2 size={16} />
                                           </button>
                                       </div>
                                   </div>
                               </div>
                           );
                        })
                     )}
                  </div>
               </div>
            )}

            {activeTab === 'students' && isProcessed && (
              <div className="animate-fade-in-up">
                <div className="flex items-center gap-3 mb-8 px-2">
                   <div className="w-10 h-10 theme-bg-soft theme-text rounded-xl flex items-center justify-center shadow-sm border theme-border">
                      <Wand2 size={20} />
                   </div>
                   <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Select Intelligence Protocol</h3>
                </div>
                <ModeSelector 
                  selectedMode={tabSelectedModes[activeTab]} 
                  onSelectMode={(mode) => handleGenerate(mode)}
                  disabled={isLoading}
                  loadingMode={generatingMode}
                  cachedModes={Object.keys(tabCaches[activeTab] || {})}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {showLibrary && (
        <div className="fixed inset-0 z-[500] bg-black/60 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-white/20 relative">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 theme-bg-soft rounded-2xl theme-text shadow-sm border theme-border"><FolderOpen size={32} /></div>
                <div>
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white">Knowledge Vault</h3>
                  <p className="text-gray-500 dark:text-slate-400 font-medium">Access your processed study materials.</p>
                </div>
              </div>
              <button onClick={() => setShowLibrary(false)} className="p-3 bg-gray-50 dark:bg-slate-800 rounded-2xl text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all active:scale-90" aria-label="Close library"><X size={24} /></button>
            </div>
            <div className="relative mb-8">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                value={librarySearchQuery}
                onChange={(e) => setLibrarySearchQuery(e.target.value)}
                placeholder="Search materials..." 
                className="w-full pl-14 pr-6 py-4 bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-white/5 rounded-2xl outline-none focus:border-theme font-medium dark:text-white transition-all shadow-sm"
                aria-label="Search library"
              />
            </div>
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin">
              {filteredLibrary.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 opacity-30 text-center">
                  <Bookmark size={64} className="mb-4 text-gray-400" />
                  <p className="font-bold text-lg dark:text-slate-500">No materials found in vault.</p>
                </div>
              ) : (
                filteredLibrary.map(item => (
                  <button 
                    key={item.id} 
                    onClick={() => { setTabResults(prev => ({ ...prev, [activeTab]: item.content })); setTabSelectedModes(prev => ({ ...prev, [activeTab]: item.mode as StudyMode })); setShowResultView(true); setShowLibrary(false); }}
                    className="w-full flex items-center justify-between p-6 bg-gray-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 border-2 border-transparent hover:border-theme rounded-3xl transition-all text-left group active:scale-[0.98] shadow-sm"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center theme-text shadow-sm group-hover:scale-110 transition-transform border theme-border"><BookOpen size={24} /></div>
                      <div className="min-w-0 flex-1">
                        <div className="font-black text-xs text-gray-900 dark:text-white truncate mb-1">{item.label}</div>
                        <div className="flex items-center gap-3 mt-1">
                           <span className="text-[10px] font-black uppercase theme-text theme-bg-soft px-2 py-0.5 rounded-md border theme-border">{item.mode}</span>
                           <span className="text-[10px] font-bold text-gray-400">{new Date(item.timestamp).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-300 dark:text-slate-700 group-hover:theme-text transition-colors shrink-0" />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {!showResultView && activeTab !== 'profile' && activeTab !== 'english' && activeTab !== 'courses' && (
        <button 
          onClick={() => setShowLibrary(true)}
          className="fixed bottom-24 right-6 md:bottom-10 md:right-10 w-16 h-16 bg-white dark:bg-slate-900 theme-text rounded-2xl shadow-2xl border-4 theme-border flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 group theme-glow"
          title="Open Library"
          aria-label="Open study material library"
        >
          <FolderOpen size={28} className="group-hover:rotate-6 transition-transform" />
          {savedMaterials.length > 0 && (
            <span className="absolute -top-2 -right-2 theme-bg text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white shadow-lg animate-bounce">
              {savedMaterials.length}
            </span>
          )}
        </button>
      )}

      {currentAchievement && showShareModal && (
          <ShareAchievementModal 
              achievement={currentAchievement} 
              onClose={() => setShowShareModal(false)} 
          />
      )}
      
      {showUpgradeModal && (
          <SubscriptionScreen 
              onSelect={async (plan) => {
                if (currentUser) {
                   try {
                     // Updated Firestore query to compat style
                     const userDocRef = db.collection('users').doc(currentUser.uid);
                     
                     // FIXED: Calculate expiry based on selected plan duration
                     const now = new Date();
                     let daysToAdd = 0;
                     switch(plan.id) {
                       case 'crash-course':
                       case 'instant-help':
                       case 'focused-prep':
                       case 'study-pro': 
                         daysToAdd = 30; 
                         break;
                       default: daysToAdd = 365; 
                     }
                     
                     now.setDate(now.getDate() + daysToAdd);
                     const expiryStr = now.toLocaleDateString(undefined, { 
                       year: 'numeric', 
                       month: 'long', 
                       day: 'numeric' 
                     });

                     // Update Firestore with new plan and expiry
                     await userDocRef.update({ 
                       subscriptionPlanId: plan.id,
                       planExpiry: expiryStr,
                       'stats.lastActiveDate': Date.now() // Track upgrade timestamp
                     });
                     
                     // Immediately update local state to reflect plan change
                     // This ensures UI updates instantly without waiting for onSnapshot
                     setUserProfile(prev => prev ? {
                       ...prev,
                       subscriptionPlanId: plan.id,
                       planExpiry: expiryStr
                     } : null);
                     
                     // Show success feedback
                     setError(null);
                   } catch (err: any) {
                     console.error("Plan upgrade failed:", err);
                     setError(`Failed to upgrade plan: ${err.message || 'Please try again.'}`);
                   }
                }
                setShowUpgradeModal(false); 
              }}
              onClose={() => setShowUpgradeModal(false)}
          />
      )}

      {/* Notification Modal */}
      {notification && (
        <NotificationModal
          isOpen={true}
          onClose={() => setNotification(null)}
          type={notification.type}
          title={notification.title}
          message={notification.message}
        />
      )}

      <Footer onOpenLegal={(s) => setLegalPage(s)} />
    </div>
  );
};

export default App;
