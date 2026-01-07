import { chatReply } from './geminiService';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
  ts: number;
};

export type ChatSession = {
  id: string;
  name: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
};

const STORAGE_KEY = 'studyclub_chat_sessions_v1';
const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

const now = () => Date.now();

const defaultSessionName = (index = 1) => `Session ${index}`;

export const loadSessions = (): ChatSession[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ChatSession[];
    // prune messages per session
    let changed = false;
    const pruned = parsed.map(s => {
      const m = s.messages.filter(msg => now() - msg.ts < TTL_MS);
      if (m.length !== s.messages.length) changed = true;
      return { ...s, messages: m };
    });
    if (changed) saveSessions(pruned);
    return pruned;
  } catch (e) {
    console.error('Failed to load chat sessions', e);
    return [];
  }
};

export const saveSessions = (sessions: ChatSession[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (e) {
    console.error('Failed to save chat sessions', e);
  }
};

export const createSession = (name?: string): ChatSession => {
  const sessions = loadSessions();
  const idx = sessions.length + 1;
  const s: ChatSession = { id: String(Date.now()) + '-' + Math.random().toString(36).slice(2, 8), name: name || defaultSessionName(idx), messages: [], createdAt: now(), updatedAt: now() };
  const next = [s, ...sessions];
  saveSessions(next);
  return s;
};

export const deleteSession = (id: string) => {
  const sessions = loadSessions().filter(s => s.id !== id);
  saveSessions(sessions);
};

export const renameSession = (id: string, name: string) => {
  const sessions = loadSessions().map(s => s.id === id ? { ...s, name, updatedAt: now() } : s);
  saveSessions(sessions);
};

export const getSession = (id: string): ChatSession | null => {
  const sessions = loadSessions();
  return sessions.find(s => s.id === id) || null;
};

export const addMessage = (sessionId: string, message: ChatMessage) => {
  const sessions = loadSessions();
  const updated = sessions.map(s => s.id === sessionId ? { ...s, messages: [...s.messages, message], updatedAt: now() } : s);
  saveSessions(updated);
  return getSession(sessionId);
};

export const clearSession = (sessionId: string) => {
  const sessions = loadSessions().map(s => s.id === sessionId ? { ...s, messages: [], updatedAt: now() } : s);
  saveSessions(sessions);
};

export const pruneExpired = () => {
  const sessions = loadSessions();
  saveSessions(sessions);
  return sessions;
};

export const sendMessageToAI = async (sessionId: string, message: string): Promise<string> => {
  try {
    const session = getSession(sessionId);
    const history = session ? session.messages : [];
    const shortHistory = (history || []).map(m => ({ role: m.role, text: m.text }));
    const reply = await chatReply(message, shortHistory as any);
    return reply;
  } catch (e) {
    console.error('Chat send failed', e);
    return "Sorry, I couldn't reach the AI service. Please try again later.";
  }
};