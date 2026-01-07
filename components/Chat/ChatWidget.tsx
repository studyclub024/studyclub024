import React, { useEffect, useRef, useState } from 'react';
import { Send, X, Edit2, Trash, Plus } from 'lucide-react';
import { loadSessions, createSession, deleteSession, renameSession, getSession, addMessage, pruneExpired, sendMessageToAI, clearSession, ChatMessage, ChatSession } from '../../services/chatService';
import { isAIAvailable } from '../../services/geminiService';

const formatTime = (ts: number) => new Date(ts).toLocaleTimeString();

const ChatWidget: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const s = pruneExpired();
    setSessions(s);
    if (s.length === 0) {
      const newS = createSession('General');
      setSessions([newS]);
      setSelectedSessionId(newS.id);
      setMessages([]);
    } else {
      setSelectedSessionId(prev => prev || s[0].id);
      const curr = s.find(x => x.id === (selectedSessionId || s[0].id));
      setMessages(curr ? curr.messages : []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

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

    // optimistic assistant placeholder
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

  if (!open) return null;

  return (
    <div className="fixed right-6 bottom-6 w-[380px] md:w-[420px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border theme-border z-[120] flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b dark:border-white/5">
        <div className="flex items-center gap-3">
          <img src="/assets/StudyClub24_icon.svg" alt="chat" width={28} height={28} />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <select value={selectedSessionId || ''} onChange={(e) => selectSession(e.target.value)} className="text-sm font-bold bg-transparent outline-none">
                {sessions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <button title="New" onClick={handleCreate} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-slate-800"><Plus size={14} /></button>
              <button title="Rename" onClick={() => selectedSessionId && handleRename(selectedSessionId)} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-slate-800"><Edit2 size={14} /></button>
              <button title="Delete" onClick={() => selectedSessionId && handleDelete(selectedSessionId)} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-slate-800"><Trash size={14} /></button>
            </div>
            <div className="text-[11px] text-gray-500">Session history lasts 24hrs</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">&nbsp;</span>
          <button onClick={handleClear} className="px-2 py-1 text-xs bg-gray-100 dark:bg-slate-800 rounded">Clear</button>
          <button onClick={onClose} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-slate-800"><X size={16} /></button>
        </div>
      </div>

      <div ref={listRef} className="p-4 space-y-4 overflow-auto max-h-[360px]"> 
        {messages.length === 0 && (
          <div className="text-center text-gray-400">Ask anything — the AI will help. Chat history auto-deletes after 24 hours.</div>
        )}
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white'} rounded-xl p-3 max-w-[78%]`}>
              <div className="text-sm">{m.text}</div>
              <div className="text-[10px] opacity-60 text-right mt-1">{formatTime(m.ts)}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t dark:border-white/5 flex items-center gap-3">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }} placeholder="Type your question..." className="flex-1 px-4 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 border-none outline-none" />
        <button onClick={handleSend} disabled={isSending} className="px-4 py-2 rounded-xl bg-indigo-600 text-white flex items-center gap-2">
          <Send size={16} /> <span className="hidden sm:inline">Send</span>
        </button>
      </div>
    </div>
  );
};

export default ChatWidget;