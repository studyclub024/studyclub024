import React, { useState, useEffect } from 'react';
import { FlashcardsResponse, FlashcardTheme } from '../../types';
import { 
  ChevronLeft, ChevronRight, RotateCcw, Play, Eye, EyeOff, Sparkles, 
  RefreshCcw, Scroll, Gamepad2, ShieldAlert, Book, CheckCircle2, 
  XCircle, Trophy, Coins, Map as MapIcon, Zap, Swords, Skull, Landmark,
  Palette, Layout, TreePine, Wand, Flame, Ghost, Radio, Lock
} from 'lucide-react';
import LatexRenderer from './LatexRenderer';
import { THEME_CONFIG } from '../../constants';

interface Props {
  data: FlashcardsResponse;
  onRegenerateWithTheme?: (theme: FlashcardTheme) => void;
  onMastery?: () => void;
  isRegenerating?: boolean;
  canUseThemes: boolean;
  onOpenUpgrade: () => void;
}

const FlashcardDisplay: React.FC<Props> = ({ data, onRegenerateWithTheme, onMastery, isRegenerating, canUseThemes, onOpenUpgrade }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);

  const [masteredIndices, setMasteredIndices] = useState<Set<number>>(new Set());
  const [failedIndices, setFailedIndices] = useState<Set<number>>(new Set());
  const [feedbackState, setFeedbackState] = useState<'success' | 'failure' | null>(null);

  const currentCard = data.cards[currentIndex];
  const theme = data.theme || FlashcardTheme.CLASSIC;
  const config = THEME_CONFIG[theme];

  const handleNext = () => {
    setIsFlipped(false);
    setFeedbackState(null);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % data.cards.length);
    }, 200);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setFeedbackState(null);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + data.cards.length) % data.cards.length);
    }, 200);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const markCorrect = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!masteredIndices.has(currentIndex)) {
        onMastery?.();
    }
    setMasteredIndices(prev => new Set(prev).add(currentIndex));
    setFailedIndices(prev => {
        const next = new Set(prev);
        next.delete(currentIndex);
        return next;
    });
    setFeedbackState('success');
    setTimeout(() => setFeedbackState(null), 1500);
  };

  const markWrong = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFailedIndices(prev => new Set(prev).add(currentIndex));
    setMasteredIndices(prev => {
        const next = new Set(prev);
        next.delete(currentIndex);
        return next;
    });
    setFeedbackState('failure');
    setTimeout(() => setFeedbackState(null), 1500);
  };

  const getCardStyle = () => {
    switch (theme) {
      case FlashcardTheme.GOT: return "bg-[#f4ead5] border-[#d4bc8d] border-8 shadow-[0_20px_50px_rgba(0,0,0,0.2)] font-serif parchment-texture";
      case FlashcardTheme.GAME: return "bg-[#0b0c10] border-[#45a29e] border-2 shadow-[0_0_40px_rgba(69,162,158,0.4)] neon-glow";
      case FlashcardTheme.HEIST: return "bg-[#8b0000] border-[#ffcc00] border-4 shadow-[0_15px_45px_rgba(139,0,0,0.5)] mission-board";
      case FlashcardTheme.JUMANJI: return "bg-[#2d4a22] border-[#5d4037] border-8 shadow-2xl jumanji-board font-serif";
      case FlashcardTheme.POTTER: return "bg-[#1a1a2e] border-[#c5a059] border-4 shadow-2xl potter-magic";
      case FlashcardTheme.LOTR: return "bg-[#2b1b12] border-[#daa520] border-2 shadow-2xl lotr-scroll font-serif";
      case FlashcardTheme.STRANGER: return "bg-[#050505] border-[#e11d48] border-4 shadow-2xl stranger-retro";
      default: return "bg-white dark:bg-slate-900 border-gray-200 dark:border-white/10 border-2 shadow-xl";
    }
  };

  const getTextColor = (role: 'q' | 'a' | 'label') => {
    if (theme === FlashcardTheme.GAME) return role === 'label' ? 'text-pink-500' : 'text-[#66fcf1]';
    if (theme === FlashcardTheme.HEIST) return role === 'label' ? 'text-amber-400' : 'text-white';
    if (theme === FlashcardTheme.GOT) return role === 'label' ? 'text-amber-900' : 'text-[#3c2f2f]';
    if (theme === FlashcardTheme.JUMANJI) return role === 'label' ? 'text-[#cddc39]' : 'text-white';
    if (theme === FlashcardTheme.POTTER) return role === 'label' ? 'text-[#e94560]' : 'text-amber-200';
    if (theme === FlashcardTheme.LOTR) return role === 'label' ? 'text-[#daa520]' : 'text-[#f4e4bc]';
    if (theme === FlashcardTheme.STRANGER) return role === 'label' ? 'text-red-600' : 'text-white';
    return role === 'label' ? 'text-indigo-500' : 'text-gray-800 dark:text-slate-100';
  };

  const getLabelBg = () => {
    if (theme === FlashcardTheme.GAME) return 'bg-pink-500/10 border border-pink-500/30';
    if (theme === FlashcardTheme.HEIST) return 'bg-black/40 border border-amber-500/30';
    if (theme === FlashcardTheme.GOT) return 'bg-amber-800/10 border border-amber-800/20';
    if (theme === FlashcardTheme.JUMANJI) return 'bg-black/30 border border-[#5d4037]';
    if (theme === FlashcardTheme.POTTER) return 'bg-white/5 border border-[#c5a059]/30';
    if (theme === FlashcardTheme.LOTR) return 'bg-black/40 border border-[#daa520]/20';
    if (theme === FlashcardTheme.STRANGER) return 'bg-red-950/20 border border-red-900/50';
    return 'bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-500/20';
  };

  return (
    <div className="max-w-3xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div className="space-y-1">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic">Training Portal</h2>
            <div className={`px-4 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm ${getLabelBg()} ${getTextColor('label')}`}>
               <Sparkles size={14} /> {config.label} Protocol Engaged
            </div>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-4 py-3 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm flex-1 sm:flex-none">
                <div className="flex flex-col items-end">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Mastery</span>
                    <span className="text-lg font-black text-gray-800 dark:text-white">{Math.round((masteredIndices.size / data.cards.length) * 100)}%</span>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getLabelBg()} ${getTextColor('label')}`}>
                   {theme === FlashcardTheme.GOT ? <MapIcon size={20} /> : 
                    theme === FlashcardTheme.HEIST ? <Coins size={20} /> : 
                    theme === FlashcardTheme.JUMANJI ? <TreePine size={20} /> :
                    theme === FlashcardTheme.POTTER ? <Wand size={20} /> :
                    theme === FlashcardTheme.STRANGER ? <Radio size={20} /> :
                    theme === FlashcardTheme.LOTR ? <Flame size={20} /> :
                    theme === FlashcardTheme.GAME ? <Zap size={20} /> : <Trophy size={20} />}
                </div>
            </div>

            <button 
                onClick={() => {
                  if (canUseThemes) setShowThemePicker(true);
                  else onOpenUpgrade();
                }}
                className="group flex items-center gap-3 bg-white dark:bg-slate-900 px-5 py-3 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all text-gray-500 hover:text-indigo-600 flex-1 sm:flex-none"
                title="Select Theme"
            >
                <div className="flex flex-col items-start">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">Framework</span>
                      {!canUseThemes && <Lock size={10} className="text-amber-500" />}
                    </div>
                    <span className="text-xs font-black uppercase tracking-tighter text-gray-900 dark:text-white group-hover:text-indigo-600">Select Theme</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                   <Palette size={20} />
                </div>
            </button>
        </div>
      </div>

      {showThemePicker && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 md:p-10 max-w-2xl w-full shadow-2xl animate-fade-in-up border border-white/20 overflow-y-auto max-h-[90vh]">
                <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 rounded-2xl"><Palette size={32} /></div>
                    <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Switch Framework</h3>
                </div>
                <p className="text-gray-500 dark:text-slate-400 mb-10 font-medium leading-relaxed">Choose a visual framework to rewire how you memorize this specific material.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(THEME_CONFIG).map(([t, cfg]) => {
                        const Icon = (t === 'got' ? Scroll : t === 'game' ? Gamepad2 : t === 'heist' ? ShieldAlert : t === 'jumanji' ? TreePine : t === 'potter' ? Wand : t === 'lotr' ? Flame : t === 'stranger' ? Radio : Book);
                        const isSelected = theme === t;
                        return (
                            <button 
                                key={t}
                                onClick={() => {
                                    if (onRegenerateWithTheme) onRegenerateWithTheme(t as FlashcardTheme);
                                    setShowThemePicker(false);
                                }}
                                className={`flex items-center gap-4 p-5 rounded-[1.5rem] border-4 transition-all group text-left ${isSelected ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-500/10 shadow-lg' : 'border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 hover:border-indigo-200'}`}
                            >
                                <div className={`p-4 rounded-xl shadow-sm ${isSelected ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-900 text-gray-400 group-hover:text-indigo-600'}`}>
                                    <Icon size={24} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-black text-lg text-gray-900 dark:text-white leading-tight truncate">{cfg.label}</div>
                                    <div className="text-xs text-gray-500 dark:text-slate-400 font-medium truncate">{cfg.description}</div>
                                </div>
                                {isSelected && <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white shrink-0"><CheckCircle2 size={16} /></div>}
                            </button>
                        );
                    })}
                </div>
                <button 
                    onClick={() => setShowThemePicker(false)}
                    className="mt-10 w-full py-4 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                >
                    Cancel
                </button>
            </div>
        </div>
      )}

      <div 
        className="relative w-full h-[38rem] perspective-1000 cursor-pointer group"
        onClick={handleFlip}
      >
        <div className={`relative w-full h-full duration-700 transition-all transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
          <div 
            className={`absolute top-0 left-0 w-full h-full rounded-[3rem] p-12 flex flex-col items-center justify-center text-center backface-hidden z-[2] ${getCardStyle()}`}
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
          >
            <div className={`text-[10px] font-black uppercase tracking-[0.3em] mb-12 px-8 py-2 rounded-full shadow-sm ${getLabelBg()} ${getTextColor('label')}`}>
                {config.labelQ}
            </div>
            <div className={`text-3xl font-black leading-tight overflow-y-auto w-full px-6 max-h-[16rem] ${getTextColor('q')}`}>
                <LatexRenderer>{currentCard.question}</LatexRenderer>
            </div>
            <div className="mt-16 flex flex-col items-center gap-3">
               <div className="w-12 h-12 rounded-full flex items-center justify-center bg-black/5 animate-pulse">
                  <RotateCcw size={20} className="text-gray-400" />
               </div>
               <span className="text-[11px] font-black uppercase tracking-widest text-gray-400 opacity-60">Click to reveal</span>
            </div>
          </div>

          <div 
            className={`absolute top-0 left-0 w-full h-full rounded-[3rem] p-10 flex flex-col items-center backface-hidden rotate-y-180 overflow-y-auto z-[1] ${getCardStyle()}`}
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg) translateZ(0)' }}
          >
            <div className={`text-[10px] font-black uppercase tracking-[0.3em] mb-8 px-8 py-2 rounded-full shadow-sm ${getLabelBg()} ${getTextColor('label')}`}>
                {config.labelA}
            </div>
            <div className={`w-full text-xl font-bold leading-relaxed mb-8 ${getTextColor('a')}`}>
                <LatexRenderer>{currentCard.answer}</LatexRenderer>
            </div>
            <div className="mt-auto flex gap-4 w-full" onClick={(e) => e.stopPropagation()}>
                <button onClick={markWrong} className="flex-1 py-4 bg-red-600/10 border-2 border-red-600/20 text-red-600 rounded-2xl font-black text-xs uppercase transition-all flex items-center justify-center gap-2 active:scale-95"><Skull size={16} /> Failure</button>
                <button onClick={markCorrect} className="flex-[2] py-4 bg-green-600 text-white rounded-2xl font-black text-xs uppercase shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95"><CheckCircle2 size={16} /> Success</button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-8 mt-12 px-4">
        <button onClick={(e) => { e.stopPropagation(); handlePrev(); }} className="p-6 rounded-[2rem] bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 text-gray-400 hover:text-indigo-600 transition-all shadow-lg active:scale-90"><ChevronLeft size={36} /></button>
        <div className="flex-1 flex flex-col items-center gap-3">
            <div className="h-2 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner max-w-sm"><div className="h-full bg-indigo-600 transition-all duration-700" style={{ width: `${((currentIndex + 1) / data.cards.length) * 100}%` }} /></div>
            <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em]">Index {currentIndex + 1} / {data.cards.length}</span>
        </div>
        <button onClick={(e) => { e.stopPropagation(); handleNext(); }} className="p-6 rounded-[2rem] bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 text-gray-400 hover:text-indigo-600 transition-all shadow-lg active:scale-90"><ChevronRight size={36} /></button>
      </div>
    </div>
  );
};

export default FlashcardDisplay;