
import React, { useRef, useState, useEffect } from 'react';
import { AchievementBadge } from '../../types';
import BadgeSVG from '../Display/BadgeSVG';
import { X, Share2, Download, Check, MessageSquare, Twitter, Linkedin, Copy, Trophy, Crown, Sparkles, Zap, Loader2 } from 'lucide-react';
import { FootballIcon } from '../../App';

interface Props {
  achievement: AchievementBadge;
  onClose: () => void;
}

const ShareAchievementModal: React.FC<Props> = ({ achievement, onClose }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const isChampion = achievement.rank === 1;
  const isElite = achievement.rank > 1 && achievement.rank <= 3;
  
  const getShareText = () => {
    if (isChampion) return `I'M RANK #1 ON STUDYCLUB24! 🏆 King of the leaderboard today with ${achievement.count} modules generated! 📚🔥 Join the club 👉 studyclub24.app`;
    if (isElite) return `Just broke into the Global Top 3 on StudyClub24! 👑 Ranked #${achievement.rank} with ${achievement.count} study modules! 🚀 studyclub24.app`;
    if (achievement.type === 'leap') return `Massive Rank Leap! ⚡ I jumped to #${achievement.rank} on StudyClub24! 📈 studyclub24.app`;
    return `I'm ranked #${achievement.rank} globally on StudyClub24! 🚀 Generated ${achievement.count} study modules today! 📚🔥 studyclub24.app`;
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Academic Achievement unlocked!',
          text: getShareText(),
          url: 'https://studyclub24.app',
        });
      } catch (err) {
        console.error("Share failed", err);
      }
    } else {
        handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getShareText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      const svg = document.getElementById('achievement-badge');
      if (!svg) return;

      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      const svgSize = 1000; // Even higher res for sharing
      canvas.width = svgSize;
      canvas.height = svgSize;

      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        if (ctx) {
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, svgSize, svgSize);
          const pngUrl = canvas.toDataURL('image/png');
          const downloadLink = document.createElement('a');
          downloadLink.href = pngUrl;
          downloadLink.download = `StudyClub24_${achievement.type}_Rank${achievement.rank}.png`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        }
        URL.revokeObjectURL(url);
        setIsExporting(false);
      };
      img.src = url;
    } catch (e) {
      console.error(e);
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in overflow-y-auto">
      {/* Background Celebration Elements */}
      {isChampion && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="absolute animate-float opacity-30 text-yellow-400"
              style={{ 
                left: `${Math.random() * 100}%`, 
                top: `${Math.random() * 100}%`, 
                animationDelay: `${Math.random() * 5}s`,
                fontSize: `${12 + Math.random() * 24}px`
              }}
            >
              <Crown />
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-[3rem] w-full max-w-lg overflow-hidden shadow-2xl animate-scale-in flex flex-col relative">
        {/* Confetti Overlay for Rank #1 */}
        {isChampion && (
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-yellow-100/50 to-transparent pointer-events-none" />
        )}

        {/* Header */}
        <div className="p-8 flex items-center justify-between border-b border-gray-100 bg-white/80 backdrop-blur-sm z-10">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${isChampion ? 'bg-yellow-100 text-yellow-600' : 'bg-indigo-100 text-indigo-600'}`}>
               {isChampion ? <Crown size={28} /> : isElite ? <Trophy size={28} /> : <Zap size={28} />}
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-900 leading-tight">
                {isChampion ? 'The Master Protagonist' : isElite ? 'Elite Academic Tier' : 'Major Milestone Hit'}
              </h3>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1 italic">
                Verified Achievement Locked
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900">
            <X size={24} />
          </button>
        </div>

        {/* Badge Preview */}
        <div className="p-10 bg-slate-50/50 flex items-center justify-center relative overflow-hidden group">
            <div className="w-72 h-72 md:w-96 md:h-96 relative transform transition-transform group-hover:scale-105 duration-500">
                <BadgeSVG achievement={achievement} id="achievement-badge" />
                
                {/* Visual Flair */}
                <div className="absolute -inset-4 bg-indigo-600/5 rounded-full blur-2xl animate-pulse -z-10" />
                {isChampion && <div className="absolute -inset-10 bg-yellow-400/10 rounded-full blur-3xl animate-spin-slow -z-10" />}
            </div>
        </div>

        {/* Progress Message */}
        <div className="px-8 pt-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-100 rounded-full text-[10px] font-black uppercase text-gray-500 tracking-widest mb-4">
                <Sparkles size={12} className="text-indigo-500" /> New Record Established
            </div>
            <p className="text-gray-600 font-medium text-sm px-4">
              Your dedication is rewriting the standards. Download your badge or share your current standing with the community.
            </p>
        </div>

        {/* Action Controls */}
        <div className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <button 
                    onClick={handleNativeShare}
                    className={`flex items-center justify-center gap-3 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg active:scale-95 ${
                        isChampion 
                        ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-yellow-200' 
                        : 'bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700'
                    }`}
                >
                    <Share2 size={18} /> Broadcast Rank
                </button>
                <button 
                    onClick={handleDownload}
                    disabled={isExporting}
                    className="flex items-center justify-center gap-3 py-4 bg-white text-gray-700 border-2 border-gray-100 rounded-2xl font-black uppercase tracking-widest text-xs hover:border-indigo-200 hover:bg-indigo-50/30 transition-all active:scale-95"
                >
                    {/* Fixed: Removed variant="none" as it's not a valid prop for FootballIcon */}
                    {isExporting ? <FootballIcon size={18} className="text-indigo-600" /> : <Download size={18} />} 
                    {isExporting ? 'Preparing...' : 'Secure Image'}
                </button>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="h-px bg-gray-100 flex-1" />
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Quick Socials</p>
                    <div className="h-px bg-gray-100 flex-1" />
                </div>
                <div className="flex justify-center gap-8">
                    <SocialIcon icon={Twitter} color="text-sky-500" label="X" onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(getShareText())}`)} />
                    <SocialIcon icon={Linkedin} color="text-blue-700" label="LinkedIn" onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://studyclub24.app')}`)} />
                    <SocialIcon icon={MessageSquare} color="text-green-500" label="WhatsApp" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(getShareText())}`)} />
                    <SocialIcon icon={copied ? Check : Copy} color={copied ? "text-green-600" : "text-gray-400"} label={copied ? "Copied" : "Copy Link"} onClick={handleCopyLink} />
                </div>
            </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}} />
    </div>
  );
};

const SocialIcon = ({ icon: Icon, color, label, onClick }: any) => (
    <button onClick={onClick} className="flex flex-col items-center gap-3 group">
        <div className={`p-4 rounded-2xl bg-white border border-gray-100 shadow-sm group-hover:shadow-md group-hover:border-gray-200 transition-all ${color}`}>
            <Icon size={24} strokeWidth={2.5} />
        </div>
        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest group-hover:text-gray-900">{label}</span>
    </button>
);

export default ShareAchievementModal;
