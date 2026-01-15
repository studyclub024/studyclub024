// Content Service - Handles all Firebase data operations with caching
import { db, storage } from '../firebaseConfig';
import {
  Course,
  Chapter,
  Topic,
  FlashcardData,
  ContentSummary,
  UserProgress,
  CacheConfig,
} from '../types/content.types';

class ContentService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheConfig: CacheConfig = {
    ttl: 5 * 60 * 1000, // 5 minutes
    maxSize: 100, // 100 items
  };

  // ==================== CACHING UTILITIES ====================

  private getCacheKey(collection: string, id: string): string {
    return `${collection}:${id}`;
  }

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > this.cacheConfig.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.data as T;
  }

  private setCache(key: string, data: any): void {
    // Implement LRU cache eviction if size exceeds limit
    if (this.cache.size >= this.cacheConfig.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clearCache(): void {
    this.cache.clear();
  }

  // ==================== COURSES ====================

  async getCourses(): Promise<Course[]> {
    const cacheKey = 'courses:all';
    const cached = this.getFromCache<Course[]>(cacheKey);
    if (cached) return cached;

    try {
      const snapshot = await db.collection('courses').get();

      const courses = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Course[];

      // Sort in memory instead of Firestore to avoid index requirements
      courses.sort((a, b) => {
        if (a.class !== b.class) return a.class - b.class;
        return a.subject.localeCompare(b.subject);
      });

      this.setCache(cacheKey, courses);
      return courses;
    } catch (error) {
      console.error('Error fetching courses:', error);
      return [];
    }
  }

  async getCourse(courseId: string): Promise<Course | null> {
    const cacheKey = this.getCacheKey('course', courseId);
    const cached = this.getFromCache<Course>(cacheKey);
    if (cached) return cached;

    try {
      const doc = await db.collection('courses').doc(courseId).get();
      if (!doc.exists) return null;

      const course = {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data()?.createdAt?.toDate(),
        updatedAt: doc.data()?.updatedAt?.toDate(),
      } as Course;

      this.setCache(cacheKey, course);
      return course;
    } catch (error) {
      console.error('Error fetching course:', error);
      return null;
    }
  }

  async getCoursesByClass(classNumber: number): Promise<Course[]> {
    const cacheKey = `courses:class:${classNumber}`;
    const cached = this.getFromCache<Course[]>(cacheKey);
    if (cached) return cached;

    try {
      const snapshot = await db.collection('courses')
        .where('class', '==', classNumber)
        .get();

      const courses = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Course[];

      // Sort by subject in memory
      courses.sort((a, b) => a.subject.localeCompare(b.subject));

      this.setCache(cacheKey, courses);
      return courses;
    } catch (error) {
      console.error('Error fetching courses by class:', error);
      return [];
    }
  }

  // ==================== CHAPTERS ====================

  async getChapters(courseId: string): Promise<Chapter[]> {
    const cacheKey = `chapters:course:${courseId}`;
    const cached = this.getFromCache<Chapter[]>(cacheKey);
    if (cached) return cached;

    try {
      const snapshot = await db.collection('chapters')
        .where('courseId', '==', courseId)
        .get();

      const chapters = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Chapter[];

      // Sort by order in memory to avoid index requirements
      chapters.sort((a, b) => a.order - b.order);

      this.setCache(cacheKey, chapters);
      return chapters;
    } catch (error) {
      console.error('Error fetching chapters:', error);
      return [];
    }
  }

  async getChapter(chapterId: string): Promise<Chapter | null> {
    const cacheKey = this.getCacheKey('chapter', chapterId);
    const cached = this.getFromCache<Chapter>(cacheKey);
    if (cached) return cached;

    try {
      const doc = await db.collection('chapters').doc(chapterId).get();
      if (!doc.exists) return null;

      const chapter = {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data()?.createdAt?.toDate(),
        updatedAt: doc.data()?.updatedAt?.toDate(),
      } as Chapter;

      this.setCache(cacheKey, chapter);
      return chapter;
    } catch (error) {
      console.error('Error fetching chapter:', error);
      return null;
    }
  }

  // ==================== TOPICS ====================

  async getTopics(chapterId: string): Promise<Topic[]> {
    const cacheKey = `topics:chapter:${chapterId}`;
    const cached = this.getFromCache<Topic[]>(cacheKey);
    if (cached) return cached;

    try {
      const snapshot = await db.collection('topics')
        .where('chapterId', '==', chapterId)
        .get();

      const topics = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        metadata: {
          ...doc.data().metadata,
          lastUpdated: doc.data().metadata?.lastUpdated?.toDate(),
        }
      })) as Topic[];

      // Sort by order in memory to avoid index requirements
      topics.sort((a, b) => a.order - b.order);

      this.setCache(cacheKey, topics);
      return topics;
    } catch (error) {
      console.error('Error fetching topics:', error);
      return [];
    }
  }

  // Alias for better API naming
  async getTopicsByChapter(chapterId: string): Promise<Topic[]> {
    return this.getTopics(chapterId);
  }

  async getTopic(topicId: string): Promise<Topic | null> {
    const cacheKey = this.getCacheKey('topic', topicId);
    const cached = this.getFromCache<Topic>(cacheKey);
    if (cached) return cached;

    try {
      const doc = await db.collection('topics').doc(topicId).get();
      if (!doc.exists) return null;

      const topic = {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data()?.createdAt?.toDate(),
        updatedAt: doc.data()?.updatedAt?.toDate(),
        metadata: {
          ...doc.data()?.metadata,
          lastUpdated: doc.data()?.metadata?.lastUpdated?.toDate(),
        }
      } as Topic;

      this.setCache(cacheKey, topic);
      return topic;
    } catch (error) {
      console.error('Error fetching topic:', error);
      return null;
    }
  }

  // ==================== CONTENT (Flashcards, Summary) ====================

  async getFlashcards(topicId: string): Promise<FlashcardData | null> {
    const cacheKey = `flashcards:${topicId}`;
    const cached = this.getFromCache<FlashcardData>(cacheKey);
    if (cached) return cached;

    try {
      const doc = await db.collection('flashcards').doc(topicId).get();
      if (!doc.exists) return null;

      const flashcards = {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data()?.createdAt?.toDate(),
        updatedAt: doc.data()?.updatedAt?.toDate(),
      } as FlashcardData;

      this.setCache(cacheKey, flashcards);
      return flashcards;
    } catch (error) {
      console.error('Error fetching flashcards:', error);
      return null;
    }
  }

  async getSummary(topicId: string): Promise<ContentSummary | null> {
    const cacheKey = `summary:${topicId}`;
    const cached = this.getFromCache<ContentSummary>(cacheKey);
    if (cached) return cached;

    try {
      const doc = await db.collection('content_summaries').doc(topicId).get();
      if (!doc.exists) return null;

      const summary = {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data()?.createdAt?.toDate(),
        updatedAt: doc.data()?.updatedAt?.toDate(),
      } as ContentSummary;

      this.setCache(cacheKey, summary);
      return summary;
    } catch (error) {
      console.error('Error fetching summary:', error);
      return null;
    }
  }

  async getImageUrl(storagePath: string): Promise<string> {
    try {
      const url = await storage.ref(storagePath).getDownloadURL();
      return url;
    } catch (error) {
      console.error('Error getting image URL:', error);
      return '';
    }
  }

  // ==================== USER PROGRESS ====================

  async getUserProgress(userId: string, topicId: string): Promise<UserProgress | null> {
    try {
      const doc = await db.collection('user_progress')
        .where('userId', '==', userId)
        .where('topicId', '==', topicId)
        .limit(1)
        .get();

      if (doc.empty) return null;

      const progress = {
        ...doc.docs[0].data(),
        lastAccessed: doc.docs[0].data().lastAccessed?.toDate(),
      } as UserProgress;

      return progress;
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return null;
    }
  }

  async updateUserProgress(progress: Partial<UserProgress>): Promise<void> {
    try {
      const { userId, topicId } = progress;
      if (!userId || !topicId) throw new Error('userId and topicId required');

      await db.collection('user_progress').add({
        ...progress,
        lastAccessed: new Date(),
      });
    } catch (error) {
      console.error('Error updating user progress:', error);
    }
  }

  // ==================== SEARCH ====================

  async searchTopics(query: string): Promise<Topic[]> {
    try {
      // Simple search implementation
      // For production, use Algolia or Firebase Extensions
      const snapshot = await db.collection('topics')
        .orderBy('title')
        .startAt(query)
        .endAt(query + '\uf8ff')
        .limit(20)
        .get();

      const topics = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        metadata: {
          ...doc.data().metadata,
          lastUpdated: doc.data().metadata?.lastUpdated?.toDate(),
        }
      })) as Topic[];

      return topics;
    } catch (error) {
      console.error('Error searching topics:', error);
      return [];
    }
  }

  // ==================== ADMIN OPERATIONS ====================

  async createCourse(course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await db.collection('courses').add({
        ...course,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      this.clearCache();
      return docRef.id;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  }

  async createChapter(chapter: Omit<Chapter, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await db.collection('chapters').add({
        ...chapter,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      this.clearCache();
      return docRef.id;
    } catch (error) {
      console.error('Error creating chapter:', error);
      throw error;
    }
  }

  async createTopic(topic: Omit<Topic, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await db.collection('topics').add({
        ...topic,
        metadata: {
          ...topic.metadata,
          lastUpdated: new Date(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      this.clearCache();
      return docRef.id;
    } catch (error) {
      console.error('Error creating topic:', error);
      throw error;
    }
  }
}

// Singleton instance
export const contentService = new ContentService();
export default contentService;
