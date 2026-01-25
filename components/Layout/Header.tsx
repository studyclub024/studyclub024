
import React, { useState, useRef, useEffect } from 'react';
import { GraduationCap, Sun, Moon, User, Sparkles, ChevronDown, Check, Layout, Scroll, Gamepad2, ShieldAlert, TreePine, Wand, Flame, Radio, Ghost, Zap, Shield, CloudLightning, Dna, Rocket, Crown, Lock, BookOpen, LogOut, Edit3, Calendar, Trash2, ArrowRight } from 'lucide-react';
import { FlashcardTheme, UserProfile } from '../../types';
import { THEME_CONFIG } from '../../constants';


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
  userProfile?: UserProfile | null;
  onLogout?: () => void;
  onOpenUpgrade?: () => void;
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

const Header: React.FC<Props> = ({ isDarkMode, onToggleDarkMode, onProfileClick, onCoursesClick, onLogoClick, isActiveProfile, isActiveCourses, activeFramework, onSetFramework, planId, canUseThemes, userProfile, onLogout, onOpenUpgrade }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

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
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
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
          <div className="p-1 rounded-xl bg-white shadow-md border border-indigo-100 flex items-center justify-center overflow-hidden shrink-0 transition-all hover:scale-105">
            <img src="https://firebasestorage.googleapis.com/v0/b/my-website-map-470209.firebasestorage.app/o/logos%2Fsc.png?alt=media" alt="SC Logo" className="w-10 h-10 object-contain" />
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
                <span className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Fun Themes</span>
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
                          className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all text-left ${isSelected
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


            {onOpenUpgrade && planId !== 'yearly-pro' && (
              <button
                onClick={onOpenUpgrade}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all border shadow-sm theme-bg theme-border hover:opacity-90"
              >
                <Sparkles size={16} />
                <span className="hidden sm:inline">Upgrade</span>
              </button>
            )}

            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all border shadow-sm ${isActiveProfile || isProfileDropdownOpen
                  ? 'theme-bg theme-border'
                  : 'bg-white dark:bg-slate-900 dark:text-white hover:theme-bg-soft hover:theme-text theme-border'
                  }`}
              >
                <User size={16} />
                <span className="hidden sm:inline">Profile</span>
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border dark:border-white/10 p-2 animate-fade-in-up origin-top-right z-50">
                  <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-[1.5rem] mb-2 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-indigo-100 dark:bg-slate-700 flex items-center justify-center text-indigo-600 dark:text-white font-bold text-2xl uppercase shrink-0 overflow-hidden border-2 border-white dark:border-slate-600 shadow-sm">
                      {userProfile?.photoURL ? (
                        <img src={userProfile.photoURL} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        userProfile?.displayName?.charAt(0) || 'U'
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-black text-lg text-gray-900 dark:text-white truncate leading-tight">{userProfile?.displayName || 'User'}</h3>
                      <p className="text-xs text-gray-400 truncate font-medium">{userProfile?.email}</p>
                    </div>
                  </div>

                  <div className="px-4 py-3 mb-2 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-900/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">{userProfile?.subscriptionPlanId?.replace('-', ' ') || 'Free Plan'}</span>
                      {['monthly-pro', 'yearly-pro', 'study-pro'].includes(planId) && (
                        <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1">
                          <Crown size={10} fill="currentColor" /> PRO
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] font-bold text-gray-400 flex items-center gap-1.5">
                      <Calendar size={12} />
                      Plan Expires: {userProfile?.planExpiry ? new Date(userProfile.planExpiry).toLocaleDateString() : 'Never'}
                    </div>
                  </div>


                  <div className="space-y-1">
                    <button
                      onClick={() => { onProfileClick(); setIsProfileDropdownOpen(false); }}
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-2xl transition-all text-xs font-bold text-gray-600 dark:text-gray-300 group"
                    >
                      <div className="p-2 bg-indigo-50 dark:bg-slate-700 text-indigo-600 dark:text-white rounded-xl group-hover:scale-110 transition-transform">
                        <Edit3 size={16} />
                      </div>
                      Edit Profile
                    </button>

                    {onLogout && (
                      <button
                        onClick={() => { onLogout(); setIsProfileDropdownOpen(false); }}
                        className="w-full flex items-center gap-3 p-3 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-all text-xs font-bold text-red-600 group mt-1"
                      >
                        <div className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl group-hover:scale-110 transition-transform">
                          <LogOut size={16} />
                        </div>
                        Logout
                      </button>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-white/5 text-center">
                    <button
                      onClick={() => { onProfileClick(); setIsProfileDropdownOpen(false); }}
                      className="text-[9px] font-bold uppercase tracking-widest text-gray-300 hover:text-red-400 transition-colors"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              )}
            </div>


          </div>
        </div>
      </div>
    </header>
  );
};

// ChatButton defined locally to avoid coupling with layout imports


export default Header;
