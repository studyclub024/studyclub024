import React, { useState, useRef, useEffect } from 'react';
import { StudyContent, StudyMode, FlashcardTheme, SavedMaterial } from '../../types';
import FlashcardDisplay from '../Display/FlashcardDisplay';
import NotesDisplay from '../Display/NotesDisplay';
import QuizDisplay from '../Display/QuizDisplay';
import SimpleTextDisplay from '../Display/SimpleTextDisplay';
import DescribeDisplay from '../Display/DescribeDisplay';
import MathDisplay from '../Display/MathDisplay';
import SubjectNotesDisplay from '../Display/SubjectNotesDisplay';
import StudyPlanDisplay from '../Display/StudyPlanDisplay';
import ChatDisplay from '../Display/ChatDisplay';
import { generateSpeech } from '../../services/geminiService';
import { Volume2, StopCircle, RefreshCw, Share2, Check, Bookmark, AlertCircle, RotateCcw, Lock } from 'lucide-react';
import { FootballIcon } from '../../App';

interface Props {
  content: StudyContent | null;
  onRegenerate: (themeOrMethod?: string) => void;
  onSave: () => void;
  onMastery: () => void;
  isRegenerating: boolean;
  savedMaterials?: SavedMaterial[];
  canUseTTS: boolean;
  onOpenUpgrade: () => void;
  canUseThemes: boolean;
}

// PCM Decoding Helpers
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const MainDisplay: React.FC<Props> = ({ content, onRegenerate, onSave, onMastery, isRegenerating, savedMaterials = [], canUseTTS, onOpenUpgrade, canUseThemes }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [justShared, setJustShared] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  const isSaved = content ? savedMaterials.some(m => JSON.stringify(m.content) === JSON.stringify(content)) : false;

  function stopAudio() {
    if (sourceRef.current) {
      try {
        sourceRef.current.stop();
        sourceRef.current.disconnect();
      } catch (e) { }
      sourceRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (e) { }
      audioContextRef.current = null;
    }
    setIsPlaying(false);
  }

  useEffect(() => {
    return () => stopAudio();
  }, [content]);

  if (!content) return null;

  const getContentText = (content: StudyContent): string => {
    switch (content.mode) {
      case StudyMode.ESSAY: return `${content.title}. ${content.essay}`;
      case StudyMode.ELI5: return `Explain like I'm 5: ${content.topic}. ` + (content.sections || []).map(s => `${s.heading}. ${s.content}.`).join(' ');
      case StudyMode.DESCRIBE: return `Analysis: ${content.title}. ` + (content.sections || []).map(s => `${s.heading}. ${s.content}.`).join(' ');
      case StudyMode.SUMMARY: return `Summary. ${(content.bullets || []).join('. ')}`;
      case StudyMode.NOTES: return `${content.title}. ${(content.sections || []).map(s => `${s.heading}. ${s.bullets.join('. ')}`).join('. ')}`;
      case StudyMode.FLASHCARDS: return `Flashcards. ${(content.cards || []).map((c, i) => `Q: ${c.question}. A: ${c.answer}`).join('. ')}`;
      case StudyMode.QUIZ: return `Quiz. ${(content.mcq || []).map((q, i) => `${q.q}`).join('. ')}`;
      case StudyMode.MATH: return `Math Solution. Final Answer: ${content.final_answer}.`;
      case StudyMode.PLAN: return `Study Plan: ${content.title}. Objective: ${content.target_goal}.`;
      default: return '';
    }
  };

  const handlePlayAudio = async () => {
    if (!canUseTTS) {
      onOpenUpgrade();
      return;
    }
    if (isPlaying) { stopAudio(); return; }
    setIsLoadingAudio(true);
    try {
      const text = getContentText(content);
      const base64Audio = await generateSpeech(text.substring(0, 4000));
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = audioContext;
      const audioBuffer = await decodeAudioData(decode(base64Audio), audioContext, 24000, 1);
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.onended = () => setIsPlaying(false);
      source.start(0);
      sourceRef.current = source;
      setIsPlaying(true);
    } catch (error) { console.error("Audio failed", error); } finally { setIsLoadingAudio(false); }
  };

  const renderContent = () => {
    switch (content.mode) {
      case 'flashcards': return <FlashcardDisplay data={content} onRegenerateWithTheme={(t) => onRegenerate(t)} onMastery={onMastery} isRegenerating={isRegenerating} canUseThemes={canUseThemes} onOpenUpgrade={onOpenUpgrade} />;
      case 'notes': return <NotesDisplay data={content} />;
      case 'quiz': return <QuizDisplay data={content} onMastery={onMastery} />;
      case 'describe': return <DescribeDisplay data={content} />;
      case 'math': return <MathDisplay data={content} onRegenerate={(m) => onRegenerate(m)} isRegenerating={isRegenerating} />;
      case 'math_notes':
      case 'chem_notes':
      case 'physics_notes': return <SubjectNotesDisplay data={content} />;
      case 'summary':
      case 'essay':
      case 'eli5': return <SimpleTextDisplay data={content} />;
      case 'plan': return <StudyPlanDisplay data={content} />;
      case 'chat': return <ChatDisplay data={content} />;
      default: return null;
    }
  };

  return (
    <div className="animate-fade-in-up mt-8 relative min-h-[400px]">
      <div className="flex flex-wrap justify-end mb-4 gap-2">
        <button
          onClick={onSave}
          disabled={isRegenerating || isSaved}
          className={`group flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all shadow-sm ${isSaved ? 'text-gray-500 bg-white border border-gray-100 cursor-default' : 'border border-gray-200 bg-white dark:bg-slate-900 text-gray-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'}`}
        >
          {isSaved ? <Check size={16} className="text-green-500" /> : <Bookmark size={16} />}
          {isSaved ? 'Saved' : 'Save Result'}
        </button>
        <button onClick={() => onRegenerate()} disabled={isRegenerating || isLoadingAudio} className="flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all shadow-sm border border-gray-200 bg-white dark:bg-slate-900 text-gray-600 dark:text-slate-300 hover:bg-gray-50">
          {isRegenerating ? <FootballIcon size={16} className="text-indigo-600" /> : <RefreshCw size={16} />}
          {isRegenerating ? 'Regenerating...' : 'Regenerate'}
        </button>
        <button onClick={handlePlayAudio} disabled={isLoadingAudio || isRegenerating} className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all shadow-sm ${isPlaying ? 'bg-red-100 text-red-700' : 'bg-white dark:bg-slate-900 text-indigo-600 border border-indigo-200 dark:border-indigo-900/50'}`}>
          {isLoadingAudio ? <FootballIcon size={16} className="text-indigo-600" /> : isPlaying ? <StopCircle size={16} /> : <Volume2 size={16} />}
          {isLoadingAudio ? 'Loading...' : isPlaying ? 'Stop' : 'Read'}
          {!canUseTTS && <Lock size={12} className="text-gray-400" />}
        </button>
      </div>

      {renderContent()}
    </div>
  );
};

export default MainDisplay;