
import React, { useState, useRef, useEffect } from 'react';
import { GraduationCap, Sun, Moon, User, Sparkles, ChevronDown, Check, Layout, Scroll, Gamepad2, ShieldAlert, TreePine, Wand, Flame, Radio, Ghost, Zap, Shield, CloudLightning, Dna, Rocket, Crown, Lock, BookOpen } from 'lucide-react';
import { FlashcardTheme } from '../../types';
import { THEME_CONFIG } from '../../constants';
import ChatWidget from '../Chat/ChatWidget';

interface Props {
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  onProfileClick: () => void;
  onCoursesClick: () => void;
  onLogoClick?: () => void;
  isActiveProfile: boolean;
  isActiveCourses: boolean;
  activeFramework: FlashcardTheme;
  onSetFramework: (theme: FlashcardTheme) => void;
  planId: string;
  canUseThemes: boolean;
}

const getFrameworkIcon = (theme: FlashcardTheme) => {
  switch (theme) {
    case FlashcardTheme.CLASSIC: return Layout;
    case FlashcardTheme.GOT: return Scroll;
    case FlashcardTheme.GAME: return Gamepad2;
    case FlashcardTheme.HEIST: return ShieldAlert;
    case FlashcardTheme.JUMANJI: return TreePine;
    case FlashcardTheme.POTTER: return Wand;
    case FlashcardTheme.LOTR: return Flame;
    case FlashcardTheme.STRANGER: return Radio;
    case FlashcardTheme.SPIDER: return Ghost; 
    case FlashcardTheme.IRON: return Zap;
    case FlashcardTheme.CAPTAIN: return Shield;
    case FlashcardTheme.THOR: return CloudLightning;
    case FlashcardTheme.HULK: return Dna;
    case FlashcardTheme.DEADPOOL: return Rocket;
    case FlashcardTheme.BATMAN: return Moon;
    default: return Sparkles;
  }
};

const Header: React.FC<Props> = ({ isDarkMode, onToggleDarkMode, onProfileClick, onCoursesClick, isActiveProfile, isActiveCourses, activeFramework, onSetFramework, planId, canUseThemes }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const frameworkConfig = THEME_CONFIG[activeFramework];
  const ActiveIcon = getFrameworkIcon(activeFramework);

  const [isChatOpen, setIsChatOpen] = useState(false);

  const hasCoursesAccess = ['crash-course', 'focused-prep', 'study-pro'].includes(planId);

  // Expose chat toggler to the nested ChatButton component by window (small pragmatic approach)
  (window as any)._stc_setChatOpen = (v: boolean) => setIsChatOpen(v);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      className="bg-white border-b border-indigo-100 dark:theme-border sticky top-0 z-[100] transition-all duration-700"
      style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 1rem)', paddingBottom: '1rem' }}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
                <button onClick={() => onLogoClick?.()} aria-label="Go to homepage" className="flex items-center gap-3 rounded-lg hover:bg-gray-50 p-1 transition-all">
            <div className="theme-bg p-2 rounded-xl text-white shadow-lg theme-glow shrink-0 transition-all">
              <GraduationCap size={24} />
            </div>
            <div className="hidden xs:block min-w-0 text-left">
              <h1 className="text-xl font-bold tracking-tight truncate">StudyClub24</h1>
              <div className="flex items-center gap-1.5 overflow-hidden">
                 <span className="text-[10px] theme-text font-black uppercase tracking-widest truncate">{frameworkConfig.label}</span>
                 <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600 shrink-0" />
                 <div className="flex items-center gap-1">
                   {['monthly-pro', 'yearly-pro'].includes(planId) ? <Crown size={10} className="text-yellow-500" /> : null}
                   <p className="text-[10px] opacity-60 font-bold uppercase truncate">{planId.replace('-', ' ')}</p>
                 </div>
              </div>
            </div>
          </button>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex items-center bg-gray-100 dark:bg-slate-800 p-1 rounded-2xl border dark:border-white/5 transition-all" ref={dropdownRef}>
            <button 
              onClick={onToggleDarkMode}
              className="p-2.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 theme-text transition-all active:scale-90"
              aria-label="Toggle Environment Light/Dark"
            >
              {isDarkMode ? <Moon size={18} fill="currentColor" /> : <Sun size={18} />}
            </button>
            <div className="w-px h-4 bg-gray-200 dark:bg-white/10 mx-1" />
            <div className="relative">
                <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white dark:hover:bg-slate-700 transition-all group"
                >
                <ActiveIcon size={18} className="theme-text" />
                {!canUseThemes && <Lock size={10} className="absolute top-0 right-0 text-amber-500" />}
                <ChevronDown size={12} className="text-gray-400 transition-transform" />
                </button>

                {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-900 rounded-[1.5rem] shadow-2xl border dark:border-white/10 p-2 animate-fade-in-up origin-top-right">
                    <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] px-3 py-2 mb-1 border-b dark:border-white/5">
                    Atmospheric Protocol
                    </div>
                    <div className="grid grid-cols-1 gap-1 max-h-[320px] overflow-y-auto scrollbar-thin">
                    {Object.entries(THEME_CONFIG).map(([themeKey, cfg]) => {
                        const Icon = getFrameworkIcon(themeKey as FlashcardTheme);
                        const isSelected = activeFramework === themeKey;
                        const isLocked = !canUseThemes && themeKey !== FlashcardTheme.CLASSIC;
                        
                        return (
                        <button
                            key={themeKey}
                            onClick={() => {
                              onSetFramework(themeKey as FlashcardTheme);
                              if (canUseThemes) setIsDropdownOpen(false);
                            }}
                            className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all text-left ${
                            isSelected 
                                ? 'theme-bg-soft theme-text' 
                                : 'hover:bg-gray-50 dark:hover:bg-slate-800'
                            } ${isLocked ? 'opacity-60' : ''}`}
                        >
                            <div className={`p-2 rounded-lg ${isSelected ? 'theme-bg text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-400'}`}>
                            <Icon size={16} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-1.5">
                                <div className="text-[11px] font-black uppercase tracking-tight leading-none">{cfg.label}</div>
                                {isLocked && <Lock size={10} className="text-amber-500" />}
                              </div>
                              <div className="text-[8px] opacity-60 font-medium mt-1 uppercase tracking-tighter">{cfg.description}</div>
                            </div>
                            {isSelected && <Check size={14} className="theme-text shrink-0" />}
                        </button>
                        );
                    })}
                    </div>
                </div>
                )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasCoursesAccess && (
              <button 
                onClick={onCoursesClick}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all border shadow-sm ${
                  isActiveCourses 
                    ? 'theme-bg text-white theme-border' 
                    : 'bg-white dark:bg-slate-900 dark:text-white hover:theme-bg-soft hover:theme-text theme-border'
                }`}
              >
                <BookOpen size={16} />
                <span className="hidden sm:inline">Courses</span>
              </button>
            )}

            <button 
              onClick={onProfileClick}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all border shadow-sm ${
                isActiveProfile 
                  ? 'theme-bg text-white theme-border' 
                  : 'bg-white dark:bg-slate-900 dark:text-white hover:theme-bg-soft hover:theme-text theme-border'
              }`}
            >
              <User size={16} />
              <span className="hidden sm:inline">Profile</span>
            </button>

            {/* Chat button */}
            <ChatButton />
          </div>
        </div>
      </div>
    </header>
  );
};

// ChatButton defined locally to avoid coupling with layout imports
const ChatButton: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 px-3 py-2.5 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all border shadow-sm bg-white dark:bg-slate-900 hover:theme-bg-soft hover:theme-text theme-border">
        <img src="/assets/StudyClub24_icon.svg" alt="chat" width={16} height={16} />
        <span className="hidden sm:inline">Chat</span>
      </button>
      {open && <div className="absolute right-0 mt-2"><ChatWidget open={open} onClose={() => setOpen(false)} /></div>}
    </div>
  );
};

export default Header;
