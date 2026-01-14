import React, { useEffect, useRef, useState } from 'react';
import { Send, Plus, Edit2, Trash, X, MessageSquare } from 'lucide-react';
import { loadSessions, createSession, deleteSession, renameSession, getSession, addMessage, pruneExpired, sendMessageToAI, clearSession, ChatMessage, ChatSession } from '../../services/chatService';
import { isAIAvailable } from '../../services/geminiService';
import { ChatResponse } from '../../types';

const formatTime = (ts: number) => new Date(ts).toLocaleTimeString();

interface Props {
    data: ChatResponse;
}

const ChatDisplay: React.FC<Props> = ({ data }) => {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isSending, setIsSending] = useState(false);
    const listRef = useRef<HTMLDivElement | null>(null);
    const [initialProcessed, setInitialProcessed] = useState(false);

    useEffect(() => {
        const s = pruneExpired();
        setSessions(s);
        if (s.length === 0) {
            const newS = createSession('Study Session');
            setSessions([newS]);
            setSelectedSessionId(newS.id);
            setMessages([]);
        } else {
            const initId = s[0].id;
            setSelectedSessionId(prev => prev || initId);
            const curr = s.find(x => x.id === (selectedSessionId || initId));
            setMessages(curr ? curr.messages : []);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const id = setInterval(() => {
            const pruned = pruneExpired();
            setSessions(pruned);
            const curr = selectedSessionId ? pruned.find(s => s.id === selectedSessionId) : pruned[0];
            setMessages(curr ? curr.messages : []);
        }, 60 * 60 * 1000); // hourly
        return () => clearInterval(id);
    }, [selectedSessionId]);

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [messages]);

    // Handle initial message passed from data
    // Handle new initial message passed from data - resets session and auto-starts
    useEffect(() => {
        if (data.initialMessage) {
            // Check if this content was already processed to avoid loops, 
            // but here we actually WANT to reset if the parent says so.
            // A simple way is to check if we are already "sending" or if messages are empty.
            // But the user wants "delete previous chat and start fresh".

            // We'll create a new fresh session for this content analysis.
            const newSession = createSession(`Analysis ${new Date().toLocaleTimeString()}`);
            setSessions(prev => [newSession, ...prev]);
            setSelectedSessionId(newSession.id);
            setMessages([]); // Clear local view immediately

            // Construct the proactive prompt
            const contextPrompt = `Here is the study material content:\n\n"${data.initialMessage}"\n\nPlease analyze this content and ask me what I would like to do with it. Offer options such as Summary, Quiz, etc. based on the content.`;

            // Add as USER message strictly so AI sees it
            const userMsg: ChatMessage = { id: String(Date.now()) + '-u-init', role: 'user', text: contextPrompt, ts: Date.now() };
            addMessage(newSession.id, userMsg);

            // Trigger AI response for this new session
            setIsSending(true);

            (async () => {
                try {
                    // Update local view
                    setMessages([userMsg]);

                    // Optimistic loading
                    const placeholder: ChatMessage = { id: String(Date.now()) + '-a-load', role: 'assistant', text: 'Analyzing content...', ts: Date.now() };
                    addMessage(newSession.id, placeholder);
                    setMessages(prev => [...prev, placeholder]); // show loading

                    const reply = await sendMessageToAI(newSession.id, userMsg.text);

                    // Replace loading with actual reply
                    const assistantMsg: ChatMessage = { id: String(Date.now()) + '-a-init', role: 'assistant', text: reply, ts: Date.now() };
                    addMessage(newSession.id, assistantMsg);

                    // Force refresh of messages to ensure we have clear history minus the placeholder if we want (or just append)
                    // Re-fetching session is safest to sync perfectly
                    const updatedSession = getSession(newSession.id);
                    if (updatedSession) setMessages(updatedSession.messages);
                } catch (e) {
                    console.error(e);
                    const err: ChatMessage = { id: String(Date.now()) + '-err', role: 'assistant', text: 'Error starting analysis.', ts: Date.now() };
                    addMessage(newSession.id, err);
                    setMessages(prev => [...prev, err]);
                } finally {
                    setIsSending(false);
                }
            })();
        }
    }, [data.initialMessage]); // Dependency on initialMessage changing

    const refreshSessions = () => {
        const s = loadSessions();
        setSessions(s);
        return s;
    };

    const selectSession = (id: string) => {
        setSelectedSessionId(id);
        const s = getSession(id);
        setMessages(s ? s.messages : []);
    };

    const handleCreate = () => {
        const name = prompt('Name for the new chat session?') || undefined;
        const s = createSession(name);
        setSessions(prev => [s, ...prev]);
        selectSession(s.id);
    };

    const handleRename = (id: string) => {
        const s = getSession(id);
        if (!s) return;
        const name = prompt('Rename session', s.name);
        if (!name) return;
        renameSession(id, name);
        refreshSessions();
    };

    const handleDelete = (id: string) => {
        if (!confirm('Delete this session? This removes its messages locally.')) return;
        deleteSession(id);
        const s = refreshSessions();
        if (s.length === 0) {
            const newS = createSession('General');
            setSessions([newS]);
            selectSession(newS.id);
        } else {
            selectSession(s[0].id);
        }
    };

    const pushSessionMessages = (sessionId: string) => {
        const s = getSession(sessionId);
        setMessages(s ? s.messages : []);
    };

    const handleSend = async () => {
        if (!input.trim()) return;
        if (!isAIAvailable()) {
            alert('AI features are disabled: GEMINI_API_KEY is not configured.');
            return;
        }
        const sid = selectedSessionId || (createSession('General').id);
        if (!selectedSessionId) {
            setSelectedSessionId(sid);
            refreshSessions();
        }

        const userMsg: ChatMessage = { id: String(Date.now()) + '-u', role: 'user', text: input.trim(), ts: Date.now() };
        addMessage(sid, userMsg);
        pushSessionMessages(sid);

        setInput('');
        setIsSending(true);

        const placeholder: ChatMessage = { id: String(Date.now()) + '-a', role: 'assistant', text: 'Thinking...', ts: Date.now() };
        addMessage(sid, placeholder);
        pushSessionMessages(sid);

        try {
            const reply = await sendMessageToAI(sid, userMsg.text);
            const assistantMsg: ChatMessage = { id: String(Date.now()) + '-a2', role: 'assistant', text: reply, ts: Date.now() };
            addMessage(sid, assistantMsg);
            pushSessionMessages(sid);
        } catch (e) {
            const assistantMsg: ChatMessage = { id: String(Date.now()) + '-aerr', role: 'assistant', text: "Error: couldn't fetch response.", ts: Date.now() };
            addMessage(sid, assistantMsg);
            pushSessionMessages(sid);
        } finally {
            setIsSending(false);
        }
    };

    const handleClear = () => {
        if (!selectedSessionId) return;
        if (!confirm('Clear chat history for this session?')) return;
        clearSession(selectedSessionId);
        pushSessionMessages(selectedSessionId);
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl border theme-border overflow-hidden flex flex-col h-[650px]">
            <div className="flex items-center justify-between px-6 py-4 border-b dark:border-white/5 bg-gray-50/50 dark:bg-slate-800/50">
                <div className="flex items-center gap-4">
                    <div className="p-3 theme-bg rounded-xl text-white shadow-md">
                        <MessageSquare size={20} />
                    </div>
                    <div className="flex flex-col">
                        <h3 className="font-black text-gray-900 dark:text-white leading-tight">AI Study Chat</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <select
                                value={selectedSessionId || ''}
                                onChange={(e) => selectSession(e.target.value)}
                                className="text-xs font-bold bg-transparent outline-none text-gray-500 hover:text-indigo-600 cursor-pointer transition-colors max-w-[150px] truncate"
                            >
                                {sessions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                            <div className="h-3 w-px bg-gray-300 dark:bg-white/10" />
                            <button title="New Session" onClick={handleCreate} className="p-1 rounded hover:bg-white dark:hover:bg-slate-700 text-gray-400 hover:text-indigo-500 transition-colors"><Plus size={14} /></button>
                            <button title="Rename Session" onClick={() => selectedSessionId && handleRename(selectedSessionId)} className="p-1 rounded hover:bg-white dark:hover:bg-slate-700 text-gray-400 hover:text-indigo-500 transition-colors"><Edit2 size={14} /></button>
                            <button title="Delete Session" onClick={() => selectedSessionId && handleDelete(selectedSessionId)} className="p-1 rounded hover:bg-white dark:hover:bg-slate-700 text-gray-400 hover:text-red-500 transition-colors"><Trash size={14} /></button>
                        </div>
                    </div>
                </div>
                <div>
                    <button onClick={handleClear} className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors bg-white dark:bg-slate-800 border theme-border rounded-xl">Clear History</button>
                </div>
            </div>

            <div ref={listRef} className="flex-1 p-6 space-y-6 overflow-y-auto bg-gray-50/30 dark:bg-slate-900/30">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full opacity-40">
                        <MessageSquare size={64} className="mb-4 text-gray-300 dark:text-slate-600" />
                        <p className="font-bold text-gray-400 dark:text-slate-500">Start a conversation to clear your doubts.</p>
                    </div>
                )}
                {messages.map(m => (
                    <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`${m.role === 'user' ? 'items-end' : 'items-start'} flex flex-col max-w-[80%]`}>
                            <div className={`${m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 border theme-border rounded-tl-none'} rounded-2xl p-4 shadow-sm`}>
                                <div className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{m.text}</div>
                            </div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1.5 px-1">{formatTime(m.ts)}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border-t dark:border-white/5">
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-slate-800 p-2 pr-3 rounded-[1.5rem] border border-gray-100 dark:border-white/5 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all shadow-inner">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                        placeholder="Type your question..."
                        className="flex-1 px-4 py-3 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400"
                    />
                    <button
                        onClick={handleSend}
                        disabled={isSending || !input.trim()}
                        className={`p-3 rounded-xl transition-all ${input.trim() ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-gray-200 dark:bg-slate-700 text-gray-400'}`}
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatDisplay;
