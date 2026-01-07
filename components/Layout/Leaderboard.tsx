import React, { useEffect, useState, useRef } from 'react';
// Updated to compat API to resolve named export errors
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { db } from '../../firebaseConfig';
import { UserProfile, AchievementBadge } from '../../types';
import { Trophy, Zap, Crown, Medal, Flame, ShieldAlert, Info, Sparkles, ExternalLink, RefreshCcw } from 'lucide-react';

interface Props {
    // Use firebase.User for the type to resolve named export missing error
    user: firebase.User | null;
    onAchievement: (achievement: AchievementBadge | null) => void;
}

const Leaderboard: React.FC<Props> = ({ user, onAchievement }) => {
  const [topUsers, setTopUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [permissionError, setPermissionError] = useState(false);
  const [indexErrorUrl, setIndexErrorUrl] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const bestRankSessionRef = useRef<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || loading || topUsers.length === 0 || isHovered) return;

    let animationFrameId: number;
    const scrollSpeed = 0.6; // Higher number = faster scroll

    const animate = () => {
      if (scrollContainer) {
        scrollContainer.scrollLeft += scrollSpeed;
        
        // If we reached the end, snap back to start for infinite feel
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth - scrollContainer.clientWidth - 1) {
          scrollContainer.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [loading, topUsers.length, isHovered]);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    // Updated Firestore query to compat style
    const usersRef = db.collection('users');
    const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
    
    const q = usersRef
      .where('stats.lastActiveDate', '>=', twentyFourHoursAgo)
      .orderBy('stats.lastActiveDate', 'desc')
      .orderBy('stats.dailyGenerations', 'desc')
      .limit(40);

    const unsubscribe = q.onSnapshot((snapshot) => {
      if (!isMounted) return;
      
      const users: UserProfile[] = [];
      snapshot.forEach((doc) => {
        users.push(doc.data() as UserProfile);
      });
      
      const sortedUsers = users.sort((a, b) => (b.stats.dailyGenerations || 0) - (a.stats.dailyGenerations || 0));
      
      setTopUsers(sortedUsers);
      setLoading(false);
      setPermissionError(false);
      setIndexErrorUrl(null);

      if (user) {
          const index = sortedUsers.findIndex(u => u.userId === user.uid);
          const currentRank = index !== -1 ? index + 1 : null;
          
          let activeAchievement: AchievementBadge | null = null;

          if (currentRank !== null) {
              const profileData = sortedUsers[index];
              const prevBest = bestRankSessionRef.current;
              
              const isSignificantJump = prevBest !== null && (prevBest - currentRank) >= 5;
              
              const commonFields = {
                  rank: currentRank,
                  userName: profileData.displayName || 'Learner',
                  count: profileData.stats.dailyGenerations || 0,
                  date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
              };

              if (currentRank === 1) {
                  activeAchievement = { ...commonFields, type: 'champion' };
              } else if (currentRank <= 3) {
                  activeAchievement = { ...commonFields, type: 'elite' };
              } else if (currentRank <= 10) {
                  activeAchievement = { ...commonFields, type: 'pro' };
              } else if (isSignificantJump) {
                  activeAchievement = { ...commonFields, type: 'leap', fromRank: prevBest };
              }
              
              if (prevBest === null || currentRank < prevBest) {
                  bestRankSessionRef.current = currentRank;
              }
          }
          
          onAchievement(activeAchievement);
      }
    }, (error: any) => {
      if (!isMounted) return;
      console.error("Leaderboard Error:", error);
      
      if (error.code === 'permission-denied') {
        setPermissionError(true);
      } else if (error.code === 'failed-precondition' || error.message?.includes('index')) {
        const urlMatch = error.message?.match(/https:\/\/console\.firebase\.google\.com[^\s]*/);
        if (urlMatch) {
            setIndexErrorUrl(urlMatch[0]);
        } else {
            setIndexErrorUrl("https://console.firebase.google.com/v1/r/project/my-website-map-470209/firestore/indexes?create_composite=ClNwcm9qZWN0cy9teS13ZWJzaXRlLW1hcC00NzAyMDkvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL3VzZXJzL2luZGV4ZXMvXxABGhgKFHN0YXRzLmxhc3RBY3RpdmVEYXRlEAIaGgoWc3RhdHMuZGFpbHlHZW5lcmF0aW9ucxACGgwKCF9fbmFtZV9fEAI");
        }
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [user?.uid, onAchievement]); 

  if (loading) return null;
  
  if (indexErrorUrl) {
    return (
      <div className="w-full theme-bg-soft border-y theme-border py-4 flex flex-col items-center justify-center gap-4 px-6 animate-fade-in text-center">
        <div className="flex items-center gap-3">
            <div className="theme-bg p-2 rounded-xl text-white shadow-lg theme-glow">
                <ShieldAlert size={20} />
            </div>
            <div className="text-left">
                <span className="text-[10px] font-black uppercase tracking-widest theme-text block">Database Index Required</span>
                <p className="text-[9px] font-bold opacity-70 uppercase">Leaderboard query requires a composite index</p>
            </div>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-3">
            <a 
                href={indexErrorUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 px-5 py-2.5 theme-bg text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl theme-glow"
            >
                Create Index in Firebase <ExternalLink size={12} />
            </a>
            <button 
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 px-5 py-2.5 bg-white theme-text rounded-full text-[10px] font-black uppercase tracking-widest border theme-border hover:bg-gray-50 dark:hover:bg-slate-800 transition-all"
            >
                Index Created? Refresh <RefreshCcw size={12} />
            </button>
        </div>
      </div>
    );
  }

  if (permissionError) {
    return (
      <div className="w-full bg-amber-50 dark:bg-amber-900/10 border-y border-amber-100 dark:border-amber-900/50 py-3 flex flex-col md:flex-row items-center justify-center gap-3 animate-fade-in px-4">
        <div className="flex items-center gap-2">
            <ShieldAlert size={16} className="text-amber-500 shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-400">Database Rules Conflict</span>
        </div>
        <div className="flex items-center gap-1 text-[9px] font-bold text-amber-600 dark:text-amber-500 bg-white dark:bg-slate-900 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800 shadow-sm">
          <Info size={10} /> Update Security Rules to allow "list" and "where" on /users/
        </div>
      </div>
    );
  }

  if (topUsers.length === 0) return null;

  return (
    <div className="w-full bg-white/30 dark:bg-black/20 backdrop-blur-md border-y theme-border py-3 overflow-hidden relative group flex items-center transition-all duration-700">
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 pointer-events-none" />
      
      <div className="flex items-center gap-3 px-6 shrink-0 z-10 relative">
          <div className="flex items-center gap-2 py-1 px-3 theme-bg text-white rounded-full shadow-lg theme-glow">
             <Zap size={14} className="fill-current" />
             <span className="text-[10px] font-black uppercase tracking-[0.1em]">Daily Board</span>
          </div>
      </div>

      <div 
        ref={scrollRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex items-center gap-4 whitespace-nowrap overflow-x-auto scrollbar-hide px-4 py-1 flex-1"
      >
        {topUsers.map((u, idx) => {
          const rank = idx + 1;
          const isTopThree = rank <= 3;
          const isMe = u.userId === user?.uid;
          
          return (
            <div 
              key={u.userId} 
              className={`flex items-center gap-3 px-4 py-2 bg-white dark:bg-slate-900 rounded-2xl border transition-all hover:scale-105 shrink-0 ${isMe ? 'theme-border ring-2 theme-bg-soft' : 'theme-border shadow-sm'}`}
            >
              <div className="flex items-center justify-center">
                {rank === 1 ? <Crown size={18} className="text-yellow-500" /> : 
                 rank === 2 ? <Medal size={18} className="text-slate-400" /> : 
                 rank === 3 ? <Medal size={18} className="text-amber-600" /> : 
                 <span className="text-[10px] font-black opacity-40">#{rank}</span>}
              </div>
              
              <div className="flex flex-col">
                <span className={`text-xs font-black tracking-tight ${isMe ? 'theme-text' : 'text-gray-900 dark:text-white'}`}>
                  {u.displayName || 'Anonymous'} {isMe && "(You)"}
                </span>
                <div className="flex items-center gap-1">
                  <Flame size={10} className="text-orange-500" fill="currentColor" />
                  <span className="text-[9px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-tighter">
                    {u.stats.dailyGenerations || 0} Today
                  </span>
                </div>
              </div>

              {isTopThree && (
                <div className="ml-1 w-2 h-2 rounded-full theme-bg animate-pulse" />
              )}
              
              {isMe && (
                  <Sparkles size={12} className="theme-text opacity-70 ml-1" />
              )}
            </div>
          );
        })}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
};

export default Leaderboard;