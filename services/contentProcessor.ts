// Content Processor - Handles file processing and conversion
import Papa from 'papaparse';
import { FlashcardItem, ContentUploadForm } from '../types/content.types';
import { storage } from '../firebaseConfig';

export class ContentProcessor {
  // ==================== CSV FLASHCARDS PROCESSING ====================

  async processFlashcards(csvFile: File): Promise<FlashcardItem[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(csvFile, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            const flashcards: FlashcardItem[] = results.data.map((row: any, index: number) => {
              // Expected CSV columns: front, back, difficulty (optional), hint (optional), imageUrl (optional)
              if (!row.front || !row.back) {
                throw new Error(`Row ${index + 1}: 'front' and 'back' columns are required`);
              }

              return {
                id: `fc-${Date.now()}-${index}`,
                front: row.front.trim(),
                back: row.back.trim(),
                imageUrl: row.imageUrl?.trim() || undefined,
                difficulty: (row.difficulty?.toLowerCase() || 'medium') as 'easy' | 'medium' | 'hard',
                order: index + 1,
                hint: row.hint?.trim() || undefined,
              };
            });

            resolve(flashcards);
          } catch (error) {
            reject(error);
          }
        },
        error: (error) => {
          reject(new Error(`CSV parsing error: ${error.message}`));
        },
      });
    });
  }

  validateFlashcardsCSV(csvFile: File): Promise<{ valid: boolean; errors: string[] }> {
    return new Promise((resolve) => {
      const errors: string[] = [];

      Papa.parse(csvFile, {
        header: true,
        preview: 5, // Check first 5 rows
        complete: (results) => {
          if (!results.meta.fields?.includes('front')) {
            errors.push("Missing required column: 'front'");
          }
          if (!results.meta.fields?.includes('back')) {
            errors.push("Missing required column: 'back'");
          }

          results.data.forEach((row: any, index: number) => {
            if (!row.front) errors.push(`Row ${index + 1}: 'front' is empty`);
            if (!row.back) errors.push(`Row ${index + 1}: 'back' is empty`);
          });

          resolve({ valid: errors.length === 0, errors });
        },
        error: (error) => {
          errors.push(`CSV parsing error: ${error.message}`);
          resolve({ valid: false, errors });
        },
      });
    });
  }

  // ==================== SUMMARY PROCESSING ====================

  async processSummary(file: File): Promise<string> {
    const fileType = file.name.split('.').pop()?.toLowerCase();

    if (fileType === 'txt' || fileType === 'md') {
      // Plain text or markdown
      return await this.readTextFile(file);
    } else if (fileType === 'docx') {
      // Word document - for now, just read as text
      // In production, use mammoth.js to convert .docx to HTML
      console.warn('Word document conversion not fully implemented. Reading as binary.');
      return await this.readTextFile(file);
    } else {
      throw new Error(`Unsupported file type: ${fileType}. Use .txt, .md, or .docx`);
    }
  }

  private readTextFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        resolve(text);
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  calculateReadingTime(text: string): number {
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  // ==================== IMAGE PROCESSING ====================

  async processImages(images: File[]): Promise<{ name: string; size: number; url?: string }[]> {
    const processedImages = images.map((image) => {
      // Validate image
      if (!image.type.startsWith('image/')) {
        throw new Error(`File ${image.name} is not an image`);
      }

      // Check size (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (image.size > maxSize) {
        throw new Error(`Image ${image.name} exceeds 5MB limit`);
      }

      return {
        name: image.name,
        size: image.size,
      };
    });

    return processedImages;
  }

  async compressImage(file: File, maxWidth: number = 1200): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;

          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject(new Error('Failed to compress image'));
            },
            file.type,
            0.85 // 85% quality
          );
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read image'));
      reader.readAsDataURL(file);
    });
  }

  // ==================== FILE UPLOAD TO FIREBASE STORAGE ====================

  async uploadFile(
    file: File,
    path: string,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const storageRef = storage.ref(path);
      const uploadTask = storageRef.put(file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress?.(progress);
        },
        (error) => {
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  }

  async uploadMultipleFiles(
    files: File[],
    basePath: string,
    onProgress?: (fileIndex: number, progress: number) => void
  ): Promise<string[]> {
    const uploadPromises = files.map((file, index) => {
      const fileName = `${Date.now()}-${file.name}`;
      const path = `${basePath}/${fileName}`;
      return this.uploadFile(file, path, (progress) => {
        onProgress?.(index, progress);
      });
    });

    return Promise.all(uploadPromises);
  }

  // ==================== COMPLETE CONTENT PUBLISHING ====================

  async publishContent(
    data: ContentUploadForm,
    topicId: string,
    onProgress?: (stage: string, progress: number) => void
  ): Promise<{
    flashcardsRef?: string;
    toppersNotesRefs?: string[];
    lastMinuteRevisionRef?: string;
    cheatSheetRef?: string;
  }> {
    const results: {
      flashcardsRef?: string;
      toppersNotesRefs?: string[];
      lastMinuteRevisionRef?: string;
      cheatSheetRef?: string;
    } = {};

    try {
      // 1. Upload flashcards CSV
      if (data.flashcardsFile) {
        onProgress?.('Uploading flashcards', 10);
        const flashcardsPath = `courses/${data.courseId}/${data.chapterId}/flashcards/${topicId}.csv`;
        results.flashcardsRef = await this.uploadFile(data.flashcardsFile, flashcardsPath);
      }

      // 2. Upload Class Topper's Notes (multiple images)
      if (data.toppersNotesImages && data.toppersNotesImages.length > 0) {
        onProgress?.('Uploading toppers notes', 35);
        const toppersNotesPath = `courses/${data.courseId}/${data.chapterId}/toppers-notes/${topicId}`;
        results.toppersNotesRefs = await this.uploadMultipleFiles(data.toppersNotesImages, toppersNotesPath);
      }

      // 3. Upload Last Minute Revision PDF
      if (data.lastMinuteRevisionPdf) {
        onProgress?.('Uploading revision PDF', 65);
        const revisionPath = `courses/${data.courseId}/${data.chapterId}/revision/${topicId}.pdf`;
        results.lastMinuteRevisionRef = await this.uploadFile(data.lastMinuteRevisionPdf, revisionPath);
      }

      // 4. Upload Cheat Sheet image
      if (data.cheatSheetImage) {
        onProgress?.('Uploading cheat sheet', 85);
        const cheatSheetPath = `courses/${data.courseId}/${data.chapterId}/cheat-sheets/${topicId}.${data.cheatSheetImage.name.split('.').pop()}`;
        results.cheatSheetRef = await this.uploadFile(data.cheatSheetImage, cheatSheetPath);
      }

      onProgress?.('Complete', 100);
      return results;
    } catch (error) {
      console.error('Error publishing content:', error);
      throw error;
    }
  }

  // ==================== UTILITIES ====================

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  generateTopicId(courseId: string, chapterId: string, title: string): string {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return `${courseId}-${chapterId}-${slug}`;
  }
}

export const contentProcessor = new ContentProcessor();
export default contentProcessor;
