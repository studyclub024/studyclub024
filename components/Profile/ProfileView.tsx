import React, { useState } from 'react';
// Updated to compat API to resolve named export errors
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import { auth, db, storage } from '../../firebaseConfig';
import { UserProfile, FlashcardTheme, StudyHistoryItem, StudyMode } from '../../types';
import { PREBUILT_AVATARS } from '../Auth/AuthScreen';
import { THEME_CONFIG } from '../../constants';
import { PLANS } from '../Subscription/SubscriptionScreen';
import {
  Trophy, Flame, Brain, Target, Settings,
  Layout, Zap, ChevronRight, User,
  LogOut, ShieldCheck, PieChart, Clock, Calendar,
  Edit2, Save, X, Loader2, ArrowUpCircle, Scroll, Gamepad2, ShieldAlert, TreePine, Wand, Radio,
  Trash2, RotateCcw, HelpCircle, FileText, List, Baby, ScanEye, Calculator, GraduationCap, Lock, Crown
} from 'lucide-react';
import { FootballIcon } from '../../App';

interface Props {
  profile: UserProfile;
  history: StudyHistoryItem[];
  onUpdatePreferences: (prefs: Partial<UserProfile['preferences']>) => void;
  onLogout: () => void;
  onOpenUpgrade: () => void;
  onClearHistory: () => void;
  onRestoreSession: (item: StudyHistoryItem) => void;
  canUseThemes: boolean;
  currentAchievement: any | null;
  onShareAchievement: () => void;
}

const getThemeIcon = (theme: string) => {
  switch (theme) {
    case 'classic': return Layout;
    case 'got': return Scroll;
    case 'game': return Gamepad2;
    case 'heist': return ShieldAlert;
    case 'jumanji': return TreePine;
    case 'potter': return Wand;
    case 'lotr': return Flame;
    case 'stranger': return Radio;
    default: return Layout;
  }
};

const getModeIcon = (mode: StudyMode) => {
  switch (mode) {
    case StudyMode.FLASHCARDS: return Layout;
    case StudyMode.NOTES: return FileText;
    case StudyMode.QUIZ: return HelpCircle;
    case StudyMode.SUMMARY: return List;
    case StudyMode.ELI5: return Baby;
    case StudyMode.DESCRIBE: return ScanEye;
    case StudyMode.MATH: return Calculator;
    case StudyMode.PLAN: return GraduationCap;
    case StudyMode.ESSAY: return FileText;
    default: return Zap;
  }
};

const ProfileView: React.FC<Props> = ({ profile, history, onUpdatePreferences, onLogout, onOpenUpgrade, onClearHistory, onRestoreSession, canUseThemes, currentAchievement, onShareAchievement }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile.displayName);
  const [editAvatar, setEditAvatar] = useState(profile.photoURL || PREBUILT_AVATARS[0]);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const activePlan = PLANS.find(p => p.id === profile.subscriptionPlanId);
  const isTopTier = profile.subscriptionPlanId === 'study-pro';

  const getAchievementDetails = (type: string) => {
    switch (type) {
      case 'champion': return { label: 'Daily Champion', icon: Crown, color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-500/10', border: 'border-yellow-200 dark:border-yellow-500/20', desc: 'Ranked #1 on the leaderboard today!' };
      case 'elite': return { label: 'Elite Learner', icon: Trophy, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-500/10', border: 'border-indigo-200 dark:border-indigo-500/20', desc: 'Reached the Top 3 on the leaderboard!' };
      case 'pro': return { label: 'Academic Pro', icon: Zap, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-500/10', border: 'border-orange-200 dark:border-orange-500/20', desc: 'Ranked in the Top 10 today!' };
      case 'leap': return { label: 'Rank Jumper', icon: ArrowUpCircle, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-500/20', desc: 'Made a significant jump in ranking!' };
      case 'rank': return { label: 'Top Achiever', icon: Target, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-500/10', border: 'border-blue-200 dark:border-blue-500/20', desc: 'Secured a spot in the Top 100 on the leaderboard!' };
      default: return { label: 'Rank Achiever', icon: Target, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-500/10', border: 'border-blue-200 dark:border-blue-500/20', desc: 'Maintained a strong position on the board.' };
    }
  };

  const handleSaveProfile = async () => {
    if (!auth.currentUser) return;
    setIsSaving(true);
    try {
      // Updated Firestore query to compat style
      const userDocRef = db.collection('users').doc(auth.currentUser.uid);
      await userDocRef.update({
        displayName: editName,
        photoURL: editAvatar
      });
      setIsEditing(false);
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!auth.currentUser) return;
    const confirmDelete = window.confirm("WARNING: This will permanently delete your account, all saved study materials, and your uploaded files. This action cannot be undone. Are you sure?");
    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      const uid = auth.currentUser.uid;
      const storageFolderPath = `user_uploads/${uid}`;
      // Updated Storage query to compat style
      const folderRef = storage.ref(storageFolderPath);

      try {
        const fileList = await folderRef.listAll();
        const deletePromises = fileList.items.map((fileRef) => fileRef.delete());
        await Promise.all(deletePromises);
      } catch (storageErr) {
        console.warn("Storage deletion skipped or failed:", storageErr);
      }

      // Updated Firestore query to compat style
      await db.collection('users').doc(uid).delete();
      // Replaced modular deleteUser with compat instance method
      await auth.currentUser.delete();
      onLogout();
    } catch (err: any) {
      console.error("Delete account error:", err);
      if (err.code === 'auth/requires-recent-login') {
        alert("For security, account deletion requires a recent login. Please log out and log back in to verify your identity.");
      } else {
        alert("Failed to delete account. Please try logging in again first.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(diff / 3600000);
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up pb-20 px-2 md:px-0">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 md:p-10 shadow-xl shadow-indigo-100/50 dark:shadow-none border border-gray-100 dark:border-white/5 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 dark:bg-indigo-500/10 rounded-full -mr-32 -mt-32 opacity-50" />
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="relative group shrink-0">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] bg-indigo-100 dark:bg-indigo-500/20 overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl flex items-center justify-center text-indigo-600">
              {isEditing ? (
                <div className="grid grid-cols-3 gap-1 p-2 bg-white dark:bg-slate-800 h-full w-full overflow-y-auto">
                  {PREBUILT_AVATARS.map((av, idx) => (
                    <button key={idx} onClick={() => setEditAvatar(av)} className={`rounded-lg overflow-hidden border-2 transition-all ${editAvatar === av ? 'border-indigo-600' : 'border-transparent'}`} aria-label={`Choose avatar option ${idx + 1}`}>
                      <img src={av} className="w-full h-full object-cover" alt={`Avatar option ${idx + 1}`} />
                    </button>
                  ))}
                </div>
              ) : (
                profile.photoURL ? <img src={profile.photoURL} className="w-full h-full object-cover" alt={`${profile.displayName}'s profile picture`} /> : <User size={48} />
              )}
            </div>
            {!isEditing && (
              <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-xl shadow-lg border-2 border-white dark:border-slate-800">
                <ShieldCheck size={20} />
              </div>
            )}
          </div>
          <div className="text-center md:text-left flex-1 min-w-0">
            {isEditing ? (
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-1 bg-gray-50 dark:bg-slate-800 border-b-2 border-indigo-600 outline-none w-full max-w-md px-2"
                aria-label="Edit display name"
              />
            ) : (
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-1 truncate">{profile.displayName}</h2>
            )}
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 text-gray-500 dark:text-slate-400 font-medium text-sm mb-6">
              <span className="truncate">{profile.email}</span>
              <span className="hidden md:inline text-gray-300 dark:text-slate-700">•</span>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold">
                <Calendar size={14} className="shrink-0" />
                <span className="whitespace-nowrap">Plan Expires: {profile.planExpiry}</span>
                <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 rounded-md text-[10px] font-black uppercase tracking-wider ml-1">{activePlan?.name || 'Standard'}</span>
                {!isTopTier && (
                  <button onClick={onOpenUpgrade} className="ml-2 flex items-center gap-1 text-[10px] text-pink-600 hover:text-pink-700 font-black uppercase tracking-widest transition-colors">
                    Upgrade <ArrowUpCircle size={12} />
                  </button>
                )}
              </div>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              {isEditing ? (
                <>
                  <button onClick={handleSaveProfile} disabled={isSaving} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 min-w-[140px]">
                    {isSaving ? <FootballIcon size={16} className="text-white" /> : <Save size={14} />}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button onClick={() => { setIsEditing(false); setEditName(profile.displayName); setEditAvatar(profile.photoURL || PREBUILT_AVATARS[0]); }} className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 px-6 py-2 rounded-xl font-black text-xs uppercase flex items-center gap-2">
                    <X size={14} /> Cancel
                  </button>
                </>
              ) : (
                <button onClick={() => setIsEditing(true)} className="bg-indigo-50 dark:bg-indigo-500/10 px-6 py-2 rounded-xl text-indigo-700 dark:text-indigo-400 font-bold text-xs flex items-center gap-2 border border-indigo-100 dark:border-indigo-500/20">
                  <Edit2 size={14} /> Edit Profile
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full md:w-auto mt-4 md:mt-0">
            <button onClick={onLogout} className="px-6 py-3 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center md:justify-start gap-2 hover:bg-red-600 hover:text-white transition-all shadow-sm">
              <LogOut size={16} /> Logout
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="px-6 py-2 text-gray-400 dark:text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-red-500 transition-colors disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete Account"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatsCard icon={Flame} label="Study Streak" value={`${profile.stats.streakDays} Days`} color="text-orange-600" bg="bg-orange-50 dark:bg-orange-500/10" />
        <StatsCard icon={Brain} label="Total Generations" value={profile.stats.totalGenerations} color="text-violet-600" bg="bg-violet-50 dark:bg-violet-500/10" />
        <StatsCard icon={Target} label="Concepts Mastered" value={profile.stats.masteredConcepts} color="text-emerald-600" bg="bg-emerald-50 dark:bg-emerald-500/10" />
        <StatsCard icon={PieChart} label="IQ Mastery" value="84%" color="text-indigo-600" bg="bg-indigo-50 dark:bg-indigo-500/10" />
      </div>

      {currentAchievement && (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 md:p-8 border border-gray-100 dark:border-white/5 shadow-xl shadow-indigo-100/20 overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
            <Trophy size={120} className="text-indigo-600" />
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 relative z-10">
            <div className={`w-20 h-20 md:w-24 md:h-24 rounded-3xl flex items-center justify-center shadow-lg transform rotate-3 group-hover:rotate-0 transition-transform duration-500 ${getAchievementDetails(currentAchievement.type).bg} ${getAchievementDetails(currentAchievement.type).color}`}>
              {React.createElement(getAchievementDetails(currentAchievement.type).icon, { size: 40 })}
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                  {getAchievementDetails(currentAchievement.type).label}
                </h3>
                <span className="px-3 py-1 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest self-center md:self-auto">Rank #{currentAchievement.rank}</span>
              </div>
              <p className="text-gray-500 dark:text-slate-400 font-medium text-sm mb-0">
                {getAchievementDetails(currentAchievement.type).desc}
              </p>
              <div className="mt-2 text-[10px] font-bold text-gray-400 dark:text-slate-600 uppercase tracking-widest">Unlocked on {currentAchievement.date}</div>
            </div>

            <button
              onClick={onShareAchievement}
              className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-3 group/btn"
            >
              Share Success <Edit2 size={16} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 md:p-8 border border-gray-100 dark:border-white/5 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center"><Settings size={20} /></div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white">Academic Preferences</h3>
            </div>
            <div className="space-y-10">
              <div>
                <label className="text-xs font-black text-gray-400 dark:text-slate-400 uppercase tracking-widest block mb-4 ml-1">Default Learning Framework</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(THEME_CONFIG).map(([theme, cfg]) => {
                    const IconComp = getThemeIcon(theme);
                    const isSelected = profile.preferences.flashcardTheme === theme;
                    const isLocked = !canUseThemes && theme !== FlashcardTheme.CLASSIC;

                    return (
                      <button
                        key={theme}
                        onClick={() => {
                          if (canUseThemes || theme === FlashcardTheme.CLASSIC) {
                            onUpdatePreferences({ flashcardTheme: theme as FlashcardTheme });
                          } else {
                            onOpenUpgrade();
                          }
                        }}
                        className={`relative p-4 rounded-2xl border-2 transition-all text-left ${isSelected ? 'border-indigo-600 bg-indigo-50/30 dark:bg-indigo-500/20' : 'border-gray-50 dark:border-white/5 bg-gray-50 dark:bg-slate-800 hover:border-indigo-200'} ${isLocked ? 'opacity-60' : ''}`}
                      >
                        <div className={`p-2 rounded-lg bg-white dark:bg-slate-900 shadow-sm mb-3 w-fit ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-slate-600'}`}>
                          <IconComp size={18} />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="font-black text-xs text-gray-900 dark:text-white mb-0.5">{cfg.label}</div>
                          {isLocked && <Lock size={10} className="text-amber-500" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="text-xs font-black text-gray-400 dark:text-slate-400 uppercase tracking-widest block mb-4 ml-1">Native Language (Tutor)</label>
                  <select value={profile.preferences.nativeLanguage} onChange={(e) => onUpdatePreferences({ nativeLanguage: e.target.value })} className="w-full p-4 bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-white/5 rounded-2xl outline-none focus:border-indigo-500 font-bold text-gray-700 dark:text-slate-300 appearance-none">
                    <option value="Hindi">Hindi</option><option value="Marathi">Marathi</option><option value="Tamil">Tamil</option><option value="Telugu">Telugu</option><option value="Urdu">Urdu</option><option value="Bengali">Bengali</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-black text-gray-400 dark:text-slate-400 uppercase tracking-widest block mb-4 ml-1">Difficulty Baseline</label>
                  <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-2xl">
                    {['beginner', 'intermediate', 'expert'].map((level) => (
                      <button key={level} onClick={() => onUpdatePreferences({ studyDifficulty: level as any })} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all ${profile.preferences.studyDifficulty === level ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-md' : 'text-gray-400 dark:text-slate-600'}`}>{level}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 md:p-8 border border-gray-100 dark:border-white/5 shadow-sm h-[600px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center"><Clock size={20} /></div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white">Recent Sessions</h3>
              </div>
              {history.length > 0 && (
                <button onClick={onClearHistory} className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Clear all history">
                  <Trash2 size={18} />
                </button>
              )}
            </div>
            <div className="space-y-3 flex-1 overflow-y-auto pr-2 scrollbar-thin">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 opacity-30 text-center">
                  <Zap size={48} className="mb-4 text-gray-400" />
                  <p className="font-bold dark:text-slate-400">No sessions recorded yet.</p>
                </div>
              ) : (
                history.map(item => {
                  const ModeIcon = getModeIcon(item.mode);
                  return (
                    <button
                      key={item.id}
                      onClick={() => onRestoreSession(item)}
                      className="w-full group p-4 rounded-2xl border border-gray-50 dark:border-white/5 bg-gray-50/30 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-200 transition-all flex items-center gap-4 text-left active:scale-[0.98]"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm group-hover:scale-110 transition-transform">
                        <ModeIcon size={20} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-black text-xs text-gray-900 dark:text-white truncate mb-1 group-hover:text-indigo-600 transition-colors">{item.topic}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black uppercase text-indigo-500/70">{item.mode}</span>
                          <span className="text-[9px] font-bold text-gray-400 dark:text-slate-400 flex items-center gap-1">
                            <div className="w-0.5 h-0.5 rounded-full bg-gray-300" /> {formatTimeAgo(item.timestamp)}
                          </span>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500 shadow-sm">
                        <RotateCcw size={14} />
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatsCard = ({ icon: Icon, label, value, color, bg }: { icon: any, label: string, value: any, color: string, bg: string }) => (
  <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 md:p-8 border border-gray-100 dark:border-white/5 shadow-sm flex flex-col items-center text-center group hover:-translate-y-1 transition-all">
    <div className={`w-10 h-10 md:w-14 md:h-14 ${bg} ${color} rounded-xl md:rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform`}><Icon size={24} /></div>
    <div className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mb-1">{value}</div>
    <div className="text-[8px] md:text-[10px] font-black text-gray-400 dark:text-slate-400 uppercase tracking-widest leading-tight">{label}</div>
  </div>
);

export default ProfileView;