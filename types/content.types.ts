// Extended types for Firebase-based content management

export interface Course {
  id: string;
  name: string;
  category: string; // e.g., "NCERT Solutions", "CBSE", "ICSE"
  board: string; // e.g., "CBSE", "ICSE", "State Board"
  class: number; // 1-12
  subject: string; // "Physics", "Maths", "Chemistry", etc.
  description?: string;
  thumbnail?: string;
  metadata: {
    totalChapters: number;
    totalTopics: number;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
    icon: string; // lucide icon name
    color: string; // hex color
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Chapter {
  id: string;
  courseId: string;
  chapterNumber: number;
  title: string;
  description?: string;
  thumbnail?: string;
  order: number;
  isPremium: boolean;
  estimatedHours: number;
  metadata: {
    totalTopics: number;
    hasFlashcards: boolean;
    hasSummary: boolean;
    hasQuiz: boolean;
    hasNotes: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Topic {
  id: string;
  chapterId: string;
  courseId: string;
  title: string;
  description?: string;
  order: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  isPremium: boolean;
  content: {
    flashcardsRef?: string; // Storage path to CSV file
    toppersNotesRefs?: string[]; // Storage paths to handwritten notes images
    lastMinuteRevisionRef?: string; // Storage path to PDF
    cheatSheetRef?: string; // Storage path to single cheat sheet image
  };
  metadata: {
    lastUpdated: Date;
    views: number;
    likes: number;
    completions: number;
    averageRating?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface FlashcardData {
  id: string;
  topicId: string;
  flashcards: FlashcardItem[];
  totalCards: number;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FlashcardItem {
  id: string;
  front: string;
  back: string;
  imageUrl?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  order: number;
  hint?: string;
}

export interface ContentSummary {
  id: string;
  topicId: string;
  content: string; // Markdown or HTML
  format: 'markdown' | 'html' | 'plain';
  wordCount: number;
  readingTime: number; // in minutes
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProgress {
  userId: string;
  topicId: string;
  courseId: string;
  chapterId: string;
  completed: boolean;
  flashcardsViewed: number;
  totalFlashcards: number;
  lastAccessed: Date;
  score?: number; // quiz score
  timeSpent: number; // seconds
  bookmarked: boolean;
  notes?: string; // user's personal notes
}

export interface ContentUploadForm {
  courseId: string;
  chapterId: string;
  topicTitle: string;
  topicDescription?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  isPremium: boolean;
  flashcardsFile?: File; // CSV file
  toppersNotesImages?: File[]; // Multiple handwritten note images
  lastMinuteRevisionPdf?: File; // PDF file
  cheatSheetImage?: File; // Single cheat sheet image
}

// Cache configuration
export interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxSize: number; // Maximum cache size
}

// Sync status for offline mode
export interface SyncStatus {
  lastSync: Date;
  pendingUploads: number;
  pendingDownloads: number;
  status: 'synced' | 'syncing' | 'offline' | 'error';
  errorMessage?: string;
}
