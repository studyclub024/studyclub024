
import React, { useState, useRef, useEffect } from 'react';
import {
    Mic, Send, Paperclip, Volume2, StopCircle, Loader2,
    Languages, GraduationCap, Briefcase, MessageCircle,
    Sun, BookOpen, User, ChevronLeft, Image as ImageIcon,
    FileText, CheckCircle, Lightbulb, UserCircle2, ArrowRight,
    XCircle, Grid, Clock, List, Trophy, Zap, Check, X, Quote
} from 'lucide-react';
// Corrected imports: Pull types from types.ts instead of the service file
import { generateEnglishLesson, generateSpeech, transcribeAudio, evaluateSpeech, generateGrammarChallenge, extractTextFromMedia } from '../../services/geminiService';
import { EnglishLesson, SpeechEvaluation, GrammarChallenge } from '../../types';
import { FootballIcon } from '../../App';

const NATIVE_LANGUAGES = ['Hindi', 'Marathi', 'Tamil', 'Telugu', 'Gujarati', 'Bengali', 'Urdu', 'Punjabi'];

const TENSES = {
    Present: ['Simple Present', 'Present Continuous', 'Present Perfect', 'Present Perfect Continuous'],
    Past: ['Simple Past', 'Past Continuous', 'Past Perfect', 'Past Perfect Continuous'],
    Future: ['Simple Future', 'Future Continuous', 'Future Perfect', 'Future Perfect Continuous']
};

interface Props {
    onBack: () => void;
    embedded?: boolean;
}

interface ChatMessage {
    id: number;
    role: 'user' | 'ai';
    text: string;
    lesson?: EnglishLesson;
    speechFeedback?: SpeechEvaluation;
}

// PCM Decoding for Chat Audio
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

// Helper to extract readable English text from lesson for TTS
const getLessonAudioText = (lesson: EnglishLesson): string => {
    let text = `${lesson.title}. ${lesson.context}. `;

    if (lesson.grammar_details) {
        text += `When to use: ${lesson.grammar_details.when_to_use.join(', ')}. `;
        text += `Examples: ${lesson.grammar_details.examples.join('. ')}. `;
        text += `Speaking Tip: ${lesson.grammar_details.speaking_tip}.`;
        return text;
    }

    if (lesson.dialogue) {
        text += lesson.dialogue.map(d => d.text).join('. ');
    }

    if (lesson.content_blocks) {
        text += lesson.content_blocks.map(b => b.english_text).join('. ');
    }

    return text;
};

const EnglishLearningApp: React.FC<Props> = ({ onBack, embedded = false }) => {
    // State with LocalStorage
    const [nativeLanguage, setNativeLanguage] = useState<string | null>(() => localStorage.getItem('englishtutor_lang') || null);
    const [messages, setMessages] = useState<ChatMessage[]>(() => {
        try {
            const saved = localStorage.getItem('englishtutor_messages');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const [activeTab, setActiveTab] = useState<'chat' | 'grammar'>('chat');
    const [interactionMode, setInteractionMode] = useState<'chat' | 'voice'>('chat');
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState<number | null>(null); // message ID playing
    const [isRecording, setIsRecording] = useState(false);
    const [showTranslations, setShowTranslations] = useState(true);

    // Challenge State
    const [challenge, setChallenge] = useState<GrammarChallenge | null>(null);
    const [challengeLoading, setChallengeLoading] = useState(false);
    const [userAnswer, setUserAnswer] = useState<string | null>(null);

    // Refs
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const sourceRef = useRef<AudioBufferSourceNode | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    // Using function declarations for hoisting to avoid TDZ (Temporal Dead Zone) ReferenceErrors
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
        setIsPlaying(null);
    }

    function stopRecording() {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
    }

    // Clean up audio on unmount
    useEffect(() => {
        return () => {
            stopAudio();
            if (isRecording) {
                stopRecording();
            }
        };
    }, [isRecording]);

    // Persistence Effects
    useEffect(() => {
        if (nativeLanguage) localStorage.setItem('englishtutor_lang', nativeLanguage);
    }, [nativeLanguage]);

    useEffect(() => {
        localStorage.setItem('englishtutor_messages', JSON.stringify(messages));
    }, [messages]);

    // Scroll to bottom on new message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const playAudio = async (text: string, msgId: number) => {
        if (isPlaying === msgId) {
            stopAudio();
            return;
        }

        stopAudio(); // Stop any other playing
        setIsPlaying(msgId);

        try {
            const base64Audio = await generateSpeech(text);
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            audioContextRef.current = ctx;

            const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
            const source = ctx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(ctx.destination);
            source.onended = () => setIsPlaying(null);
            source.start(0);
            sourceRef.current = source;
        } catch (err) {
            console.error("Audio play failed", err);
            setIsPlaying(null);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : '';
            const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);

            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                stream.getTracks().forEach(track => track.stop());
                const audioBlob = new Blob(audioChunksRef.current, { type: mimeType || 'audio/mp4' });

                setIsLoading(true);
                try {
                    const reader = new FileReader();
                    reader.readAsDataURL(audioBlob);
                    reader.onloadend = async () => {
                        const base64String = reader.result as string;
                        if (base64String) {
                            const base64Audio = base64String.split(',')[1];
                            // Call evaluateSpeech which returns transcript + feedback
                            const evaluation = await evaluateSpeech(base64Audio, audioBlob.type);
                            if (evaluation) {
                                setInputText(evaluation.transcript);
                                if (interactionMode === 'voice') {
                                    handleSendMessage(evaluation.transcript, 'Conversation', evaluation);
                                }
                            }
                        }
                    };
                } catch (e) {
                    console.error("Transcription failed", e);
                } finally {
                    setIsLoading(false);
                    setIsRecording(false);
                }
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Could not access microphone. Please check permissions.");
        }
    };

    const toggleRecording = () => {
        if (isRecording) stopRecording();
        else startRecording();
    };

    const handleSendMessage = async (text: string, context: string = 'Conversation', speechData?: SpeechEvaluation) => {
        if (!text.trim() || !nativeLanguage) return;

        // Switch to chat if in grammar mode
        if (activeTab === 'grammar') setActiveTab('chat');

        const userMsg: ChatMessage = {
            id: Date.now(),
            role: 'user',
            text,
            speechFeedback: speechData
        };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsLoading(true);

        try {
            const lesson = await generateEnglishLesson(text, nativeLanguage, context);
            const aiMsg: ChatMessage = {
                id: Date.now() + 1,
                role: 'ai',
                text: lesson.title, // Fallback text
                lesson: lesson
            };

            setMessages(prev => [...prev, aiMsg]);

            if (interactionMode === 'voice') {
                const audioText = getLessonAudioText(lesson);
                playAudio(audioText, aiMsg.id);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTenseClick = (tense: string) => {
        handleSendMessage(`Teach me the "${tense}" with usage, structure, and mistakes.`, 'Grammar Tense');
    };

    const handleFetchChallenge = async () => {
        setChallengeLoading(true);
        setUserAnswer(null);
        setChallenge(null);
        try {
            const result = await generateGrammarChallenge();
            setChallenge(result);
        } catch (err) {
            console.error(err);
        } finally {
            setChallengeLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        try {
            const extractedText = await extractTextFromMedia(file);
            if (extractedText) {
                handleSendMessage(`Analyze this text: "${extractedText}"`, 'File Analysis');
            }
        } catch (err) {
            console.error("Extraction failed", err);
        } finally {
            setIsLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleWordUsage = () => {
        if (!inputText.trim()) {
            const input = document.querySelector('input[type="text"]') as HTMLInputElement;
            if (input) {
                input.focus();
                input.placeholder = "Type a word here first (e.g., 'Benevolent')...";
            }
            return;
        }
        handleSendMessage(`Generate example sentences for the word: "${inputText}" showing Formal, Informal, and Exam usage.`, 'Word Usage');
    };

    const getScoreColor = (score: number) => {
        if (score >= 8) return 'text-green-600 bg-green-50 border-green-200';
        if (score >= 5) return 'text-orange-600 bg-orange-50 border-orange-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    // --- RENDER: ONBOARDING ---
    if (!nativeLanguage) {
        return (
            <div className={`${embedded ? 'py-12 bg-pink-50/30' : 'min-h-screen bg-pink-50'} flex flex-col items-center justify-center p-4`}>
                {/* Highlighted Back Link at the Top - Hidden if embedded */}
                {!embedded && (
                    <button
                        onClick={onBack}
                        className="mb-8 flex items-center gap-3 px-8 py-4 bg-white text-indigo-600 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all border-4 border-indigo-100 shadow-2xl shadow-indigo-100/50 hover:scale-105 active:scale-95 group"
                    >
                        <ChevronLeft size={22} className="group-hover:-translate-x-1 transition-transform" /> Back to Workspace
                    </button>
                )}

                <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 max-w-md w-full text-center border border-pink-100 relative overflow-hidden animate-fade-in-up">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-full -mr-16 -mt-16 opacity-50" />

                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6 text-pink-500 shadow-inner">
                            <Languages size={40} />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">English Prep</h2>
                        <p className="text-gray-500 mb-10 font-medium leading-relaxed">Select your native language for better learning and personalized translations.</p>

                        <div className="grid grid-cols-2 gap-3">
                            {NATIVE_LANGUAGES.map(lang => (
                                <button
                                    key={lang}
                                    onClick={() => setNativeLanguage(lang)}
                                    className="p-4 rounded-2xl border-2 border-gray-50 hover:border-pink-500 hover:bg-pink-50 text-gray-700 font-black text-xs uppercase tracking-widest transition-all hover:scale-[1.03] active:scale-95"
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- RENDER: LESSON COMPONENT ---
    const renderLesson = (lesson: EnglishLesson, msgId: number) => {
        return (
            <div className="w-full">
                {/* Title & Context */}
                <div className="mb-6 border-b border-gray-100 pb-4">
                    <div className="flex items-start justify-between gap-4">
                        <h3 className="text-xl font-bold text-gray-900 leading-tight">{lesson.title}</h3>
                        <button
                            onClick={() => playAudio(getLessonAudioText(lesson), msgId)}
                            className={`p-2 rounded-full flex-shrink-0 transition-colors ${isPlaying === msgId ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                        >
                            {isPlaying === msgId ? <StopCircle size={20} /> : <Volume2 size={20} />}
                        </button>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 italic">{lesson.context}</p>
                </div>

                {/* GRAMMAR DETAILS MODE */}
                {lesson.grammar_details && (
                    <div className="space-y-6">
                        {/* 1. When to use */}
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                            <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Clock size={14} /> When to Use
                            </h4>
                            <ul className="space-y-2">
                                {lesson.grammar_details.when_to_use.map((use, idx) => (
                                    <li key={idx} className="text-sm text-blue-900 flex gap-2">
                                        <span className="text-blue-500">•</span>
                                        {use}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* 2. Sentence Structure */}
                        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Grid size={14} /> Sentence Structure
                            </h4>
                            <div className="space-y-3 font-mono text-sm">
                                <div className="flex gap-2">
                                    <span className="text-green-600 font-bold w-6">(+)</span>
                                    <span className="text-gray-700">{lesson.grammar_details.structure.affirmative}</span>
                                </div>
                                <div className="flex gap-2">
                                    <span className="text-red-500 font-bold w-6">(-)</span>
                                    <span className="text-gray-700">{lesson.grammar_details.structure.negative}</span>
                                </div>
                                <div className="flex gap-2">
                                    <span className="text-indigo-600 font-bold w-6">(?)</span>
                                    <span className="text-gray-700">{lesson.grammar_details.structure.question}</span>
                                </div>
                            </div>
                        </div>

                        {/* 3. Examples & Real Life */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-xl p-4">
                                <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Examples</h4>
                                <ul className="text-sm space-y-2 text-gray-700 italic">
                                    {lesson.grammar_details.examples.map((ex, i) => <li key={i}>"{ex}"</li>)}
                                </ul>
                            </div>
                            {lesson.grammar_details.real_life_usage && (
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Real Life Context</h4>
                                    <ul className="text-sm space-y-2 text-gray-700">
                                        {lesson.grammar_details.real_life_usage.map((ctx, i) => <li key={i}>• {ctx}</li>)}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* 4. Common Mistakes */}
                        <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                            <h4 className="text-xs font-bold text-red-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <XCircle size={14} /> Common Mistakes
                            </h4>
                            <div className="space-y-3">
                                {lesson.grammar_details.common_mistakes.map((m, idx) => (
                                    <div key={idx} className="text-sm grid grid-cols-1 md:grid-cols-2 gap-2 pb-2 border-b border-red-100 last:border-0 last:pb-0">
                                        <span className="text-red-600 line-through decoration-red-400">❌ {m.wrong}</span>
                                        <span className="text-green-700 font-medium">✅ {m.correct}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 5. Speaking Tip */}
                        <div className="flex gap-3 p-4 bg-indigo-600 text-white rounded-xl shadow-md">
                            <Mic size={20} className="mt-1 flex-shrink-0 text-indigo-200" />
                            <div>
                                <span className="font-bold block text-xs uppercase text-indigo-200 mb-1">Speaking Tip</span>
                                <p className="text-sm font-medium">{lesson.grammar_details.speaking_tip}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* DIALOGUE MODE */}
                {lesson.dialogue && lesson.dialogue.length > 0 && (
                    <div className="space-y-4 mb-6">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Conversation</h4>
                        {lesson.dialogue.map((line, idx) => (
                            <div key={idx} className="flex gap-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                                    {line.speaker.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-indigo-600 mb-0.5">{line.speaker}</p>
                                    <p className="text-gray-800 text-base leading-relaxed">{line.text}</p>
                                    {showTranslations && <p className="text-sm text-gray-500 mt-1 font-medium">{line.translation}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* CONTENT BLOCKS (Q&A / Lists) */}
                {lesson.content_blocks && lesson.content_blocks.length > 0 && (
                    <div className="space-y-4 mb-6">
                        {lesson.content_blocks.map((block, idx) => (
                            <div key={idx} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                {block.heading && <div className="text-xs font-bold text-indigo-600 uppercase mb-2">{block.heading}</div>}
                                <p className="text-lg font-medium text-gray-900 mb-1">{block.english_text}</p>
                                {showTranslations && <p className="text-sm text-gray-500 mb-3">{block.native_text}</p>}

                                {block.tips && block.tips.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {block.tips.map((tip, tIdx) => (
                                            <span key={tIdx} className="inline-flex items-center gap-1 px-2 py-1 bg-white text-gray-600 text-xs rounded border border-gray-200">
                                                <Lightbulb size={10} className="text-yellow-500" /> {tip}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* VOCABULARY & PHRASES (Only if not Grammar Mode, to reduce clutter) */}
                {!lesson.grammar_details && (
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                        {lesson.vocabulary.length > 0 && (
                            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                                <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <BookOpen size={14} /> Key Vocabulary
                                </h4>
                                <ul className="space-y-3">
                                    {lesson.vocabulary.map((v, i) => (
                                        <li key={i} className="text-sm">
                                            <span className="font-bold text-indigo-900 block">{v.word}</span>
                                            <span className="text-indigo-700">{v.meaning}</span>
                                            <p className="text-xs text-indigo-500 mt-0.5 italic">"{v.usage}"</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {lesson.key_phrases && lesson.key_phrases.length > 0 && (
                            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                                <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <MessageCircle size={14} /> Useful Phrases
                                </h4>
                                <ul className="space-y-3">
                                    {lesson.key_phrases.map((p, i) => (
                                        <li key={i} className="text-sm">
                                            <span className="font-bold text-emerald-900 block">{p.phrase}</span>
                                            <span className="text-emerald-700">{p.explanation}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {/* FOOTER: Grammar & Exam Tip (Global) */}
                <div className="space-y-2 text-sm">
                    {!lesson.grammar_details && lesson.grammar_focus && (
                        <div className="flex gap-2 p-3 bg-yellow-50 text-yellow-900 rounded-lg border border-yellow-100">
                            <CheckCircle size={16} className="mt-0.5 flex-shrink-0 text-yellow-600" />
                            <div>
                                <span className="font-bold block text-xs uppercase text-yellow-700 mb-1">Grammar Focus</span>
                                {lesson.grammar_focus}
                            </div>
                        </div>
                    )}
                    {lesson.exam_tip && (
                        <div className="flex gap-2 p-3 bg-purple-50 text-purple-900 rounded-lg border border-purple-100">
                            <GraduationCap size={16} className="mt-0.5 flex-shrink-0 text-purple-600" />
                            <div>
                                <span className="font-bold block text-xs uppercase text-purple-700 mb-1">Exam Tip</span>
                                {lesson.exam_tip}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // --- RENDER: MAIN APP ---
    return (
        <div className={`flex flex-col font-sans ${embedded ? 'bg-transparent' : 'min-h-screen bg-gray-50'}`}>
            {/* Header - Hidden if embedded since App.tsx shows tabs */}
            {!embedded && (
                <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                    <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                                <ChevronLeft size={20} />
                            </button>
                            <div>
                                <h1 className="font-bold text-gray-900 leading-tight">English Tutor</h1>
                                <p className="text-xs text-pink-600 font-medium">{nativeLanguage} ↔ English</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 self-end md:self-auto">
                            <button
                                onClick={() => setShowTranslations(!showTranslations)}
                                className={`hidden lg:flex text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${showTranslations ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-white text-gray-500 border-gray-200'}`}
                            >
                                <Languages size={14} className="mr-1" />
                                {showTranslations ? 'Translations On' : 'Translations Off'}
                            </button>

                            {/* Mode Toggles */}
                            <div className="flex bg-gray-100 p-1 rounded-lg">
                                <button
                                    onClick={() => setActiveTab('chat')}
                                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'chat' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
                                >
                                    <MessageCircle size={14} /> Chat
                                </button>
                                <button
                                    onClick={() => setActiveTab('grammar')}
                                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'grammar' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
                                >
                                    <Grid size={14} /> Grammar
                                </button>
                            </div>

                            {/* Voice Toggle (Independent) */}
                            <button
                                onClick={() => setInteractionMode(interactionMode === 'chat' ? 'voice' : 'chat')}
                                className={`ml-2 px-3 py-1.5 rounded-full border text-sm font-medium transition-all flex items-center gap-1 ${interactionMode === 'voice' ? 'bg-pink-100 text-pink-700 border-pink-200' : 'bg-white text-gray-500 border-gray-200'}`}
                            >
                                <Mic size={14} /> {interactionMode === 'voice' ? 'Voice Mode' : 'Voice Off'}
                            </button>
                        </div>
                    </div>
                </header>
            )}

            {/* Embedded-only control bar */}
            {embedded && (
                <div className="p-4 md:p-6 border-b border-gray-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl theme-bg-soft theme-text flex items-center justify-center">
                            <Languages size={20} />
                        </div>
                        <div>
                            <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">English Protocol</h2>
                            <p className="text-[10px] text-pink-600 font-bold uppercase tracking-widest">{nativeLanguage} ↔ English</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowTranslations(!showTranslations)}
                            className={`flex text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-xl border transition-all ${showTranslations ? 'theme-bg-soft theme-text border-theme/20 shadow-sm' : 'bg-white dark:bg-slate-800 text-gray-400 border-gray-100 dark:border-white/5'}`}
                        >
                            <Languages size={14} className="mr-2" />
                            {showTranslations ? 'Translations On' : 'Translations Off'}
                        </button>

                        <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-xl border dark:border-white/5">
                            <button
                                onClick={() => setActiveTab('chat')}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'chat' ? 'bg-white dark:bg-slate-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-400 dark:text-slate-500'}`}
                            >
                                <MessageCircle size={14} /> Chat
                            </button>
                            <button
                                onClick={() => setActiveTab('grammar')}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'grammar' ? 'bg-white dark:bg-slate-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-400 dark:text-slate-500'}`}
                            >
                                <Grid size={14} /> Grammar
                            </button>
                        </div>

                        <button
                            onClick={() => setInteractionMode(interactionMode === 'chat' ? 'voice' : 'chat')}
                            className={`px-3 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 ${interactionMode === 'voice' ? 'bg-pink-100 dark:bg-pink-500/20 text-pink-700 dark:text-pink-400 border-pink-200 dark:border-pink-500/30' : 'bg-white dark:bg-slate-800 text-gray-400 border-gray-100 dark:border-white/5'}`}
                        >
                            <Mic size={14} /> {interactionMode === 'voice' ? 'Voice Mode' : 'Voice Off'}
                        </button>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <main className="flex-1 container mx-auto px-4 py-6 max-w-3xl flex flex-col">

                {/* TABS CONTENT */}
                {activeTab === 'grammar' ? (
                    <div className="space-y-8 animate-fade-in-up">

                        {/* DAILY CHALLENGE CARD */}
                        <div className="bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl p-6 shadow-lg text-white">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="bg-white/20 p-2 rounded-lg">
                                        <Trophy size={20} className="text-yellow-300" />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-lg">Daily Grammar Challenge</h2>
                                        <p className="text-xs text-indigo-100 opacity-80">Test your skills with a random question!</p>
                                    </div>
                                </div>
                                {(!challenge || userAnswer) && (
                                    <button
                                        onClick={handleFetchChallenge}
                                        disabled={challengeLoading}
                                        className="px-4 py-2 bg-white text-indigo-600 rounded-full font-bold text-sm hover:bg-indigo-50 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {challengeLoading ? <FootballIcon size={16} className="text-indigo-600" /> : <Zap size={16} />}
                                        {challenge ? 'Next Question' : 'Start Challenge'}
                                    </button>
                                )}
                            </div>

                            {challengeLoading && !challenge && (
                                <div className="h-24 flex items-center justify-center text-indigo-200 animate-pulse">
                                    Loading your challenge...
                                </div>
                            )}

                            {challenge && !challengeLoading && (
                                <div className="bg-white/10 rounded-xl p-4 border border-white/20 animate-fade-in-up">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="bg-indigo-500/50 text-xs px-2 py-1 rounded text-indigo-100 uppercase tracking-wide font-bold">{challenge.tense}</span>
                                    </div>
                                    <h3 className="text-xl font-medium mb-6 leading-relaxed">{challenge.question}</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {challenge.options.map((option, idx) => {
                                            const isSelected = userAnswer === option;
                                            const isCorrect = option === challenge.correctAnswer;
                                            let btnClass = "text-left p-3 rounded-lg border text-sm font-medium transition-all ";

                                            if (userAnswer) {
                                                if (isCorrect) btnClass += "bg-green-50 border-green-400 text-white shadow-md";
                                                else if (isSelected) btnClass += "bg-red-50 border-red-400 text-white opacity-60";
                                                else btnClass += "bg-white/5 border-white/10 text-white/50";
                                            } else {
                                                btnClass += "bg-white text-indigo-900 border-transparent hover:bg-indigo-50 hover:border-indigo-200";
                                            }

                                            return (
                                                <button
                                                    key={idx}
                                                    disabled={!!userAnswer}
                                                    onClick={() => setUserAnswer(option)}
                                                    className={btnClass}
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <span>{option}</span>
                                                        {userAnswer && isCorrect && <Check size={16} />}
                                                        {userAnswer && isSelected && !isCorrect && <X size={16} />}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {userAnswer && (
                                        <div className="mt-4 pt-4 border-t border-white/20 animate-fade-in-up">
                                            <p className={`font-bold text-sm mb-1 ${userAnswer === challenge.correctAnswer ? 'text-green-300' : 'text-red-300'}`}>
                                                {userAnswer === challenge.correctAnswer ? 'Correct!' : `Incorrect. The answer is "${challenge.correctAnswer}".`}
                                            </p>
                                            <p className="text-sm text-indigo-100 opacity-90">{challenge.explanation}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">English Tenses Explorer</h2>
                            <p className="text-gray-500">Select a tense to master its rules and usage.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {Object.entries(TENSES).map(([category, list]) => (
                                <div key={category} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="bg-indigo-50 p-4 border-b border-indigo-100">
                                        <h3 className="font-bold text-indigo-900 text-center">{category} Tense</h3>
                                    </div>
                                    <div className="p-2">
                                        {list.map(tense => (
                                            <button
                                                key={tense}
                                                onClick={() => handleTenseClick(tense)}
                                                className="w-full text-left p-3 rounded-lg hover:bg-indigo-50 text-gray-700 font-medium text-sm transition-colors flex items-center justify-between group"
                                            >
                                                {tense}
                                                <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 text-indigo-400 transition-opacity" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 bg-blue-50 p-6 rounded-2xl border border-blue-100 flex gap-4">
                            <div className="bg-white p-3 rounded-full h-fit text-blue-500 shadow-sm">
                                <BookOpen size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-blue-900 text-lg mb-1">Why learn tenses?</h4>
                                <p className="text-blue-800 text-sm leading-relaxed">
                                    Mastering tenses allows you to tell stories, plan for the future, and describe your experiences accurately.
                                    Click any card above to see a detailed breakdown with examples!
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Quick Actions (Chat Mode) */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                            <PresetButton icon={Sun} label="Daily Sentences" onClick={() => handleSendMessage(`Generate 5 daily use sentences and 5 exam-level sentences.`, 'Daily Practice')} />
                            <PresetButton icon={Briefcase} label="Office Talk" onClick={() => handleSendMessage(`Conversation: Requesting leave from a manager.`, 'Workplace')} />
                            <PresetButton icon={User} label="Interview Prep" onClick={() => handleSendMessage(`Common interview question: 'Tell me about yourself'.`, 'Interview Prep')} />
                            <PresetButton icon={Quote} label="Word Usage" onClick={handleWordUsage} />
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col mb-4">
                            <div className="flex-1 overflow-y-auto p-4 space-y-8 bg-slate-50">
                                {messages.length === 0 && (
                                    <div className="text-center text-gray-400 mt-20">
                                        <MessageCircle size={48} className="mx-auto mb-4 opacity-20" />
                                        <p>Start your learning journey!</p>
                                    </div>
                                )}
                                {messages.map((msg) => (
                                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        {msg.role === 'user' ? (
                                            <div className="max-w-[80%] flex flex-col items-end">
                                                <div className="bg-pink-600 text-white rounded-2xl rounded-br-none p-4 shadow-sm">
                                                    {msg.text}
                                                </div>
                                                {msg.speechFeedback && (
                                                    <div className={`mt-2 mr-1 bg-white border p-3 rounded-xl shadow-sm text-sm max-w-xs animate-fade-in-up ${getScoreColor(msg.speechFeedback.score)}`}>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <div className="font-bold flex items-center gap-1">
                                                                <Mic size={12} />
                                                                Score: {msg.speechFeedback.score}/10
                                                            </div>
                                                        </div>
                                                        <p className="text-gray-600 text-xs mb-1">{msg.speechFeedback.feedback}</p>
                                                        {msg.speechFeedback.correction && (
                                                            <div className="mt-2 text-xs border-t border-gray-100 pt-1">
                                                                <span className="text-gray-400">Better: </span>
                                                                <span className="text-gray-800 font-medium">{msg.speechFeedback.correction}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="w-full max-w-3xl bg-white rounded-2xl rounded-bl-none shadow-sm border border-gray-200 p-6 md:p-8">
                                                {msg.lesson ? renderLesson(msg.lesson, msg.id) : <p>{msg.text}</p>}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex justify-start w-full animate-fade-in">
                                        <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm border border-gray-200 flex items-center gap-3 text-gray-500">
                                            <FootballIcon size={24} className="text-pink-600" />
                                            <span className="text-sm font-medium">{isRecording ? 'Listening...' : 'Designing lesson...'}</span>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Bar */}
                            <div className="p-3 bg-white border-t border-gray-200">
                                <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 border border-transparent focus-within:border-pink-300 focus-within:bg-white transition-colors">
                                    <button onClick={() => fileInputRef.current?.click()} className="text-gray-400 hover:text-pink-600"><Paperclip size={20} /></button>
                                    <input
                                        type="text"
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
                                        placeholder={isRecording ? "Listening..." : "Type, paste text, or upload..."}
                                        className="flex-1 bg-transparent border-none focus:ring-0 outline-none text-gray-800 placeholder-gray-400"
                                        disabled={isLoading || isRecording}
                                    />
                                    <button onClick={toggleRecording} className={`p-2 rounded-full transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : interactionMode === 'voice' ? 'text-pink-600 hover:bg-pink-100' : 'text-gray-400 hover:text-gray-600'}`}>
                                        {isRecording ? <StopCircle size={20} /> : <Mic size={20} />}
                                    </button>
                                    <button onClick={() => handleSendMessage(inputText)} disabled={!inputText.trim() || isLoading} className="p-2 bg-pink-600 text-white rounded-full hover:bg-pink-700 disabled:opacity-50"><Send size={18} /></button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept="image/*,application/pdf" />
        </div>
    );
};

const PresetButton = ({ icon: Icon, label, onClick }: { icon: any, label: string, onClick: () => void }) => (
    <button onClick={onClick} className="flex flex-col items-center justify-center gap-2 p-3 bg-white border border-gray-200 rounded-xl hover:border-pink-300 hover:bg-pink-50 transition-all shadow-sm group">
        <div className="w-10 h-10 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center group-hover:bg-pink-200 transition-colors"><Icon size={20} /></div>
        <span className="text-xs font-semibold text-gray-700 group-hover:text-pink-800">{label}</span>
    </button>
);

export default EnglishLearningApp;
