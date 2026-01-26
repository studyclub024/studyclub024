// Admin Content Uploader Component
import React, { useState, useEffect } from 'react';
import { Upload, FileText, Image, CheckCircle, AlertCircle, Loader2, X } from 'lucide-react';
import { ContentUploadForm, Course, Chapter } from '../../types/content.types';
import { contentProcessor } from '../../services/contentProcessor';
import { contentService } from '../../services/contentService';

interface Props {
  courseId?: string;
  chapterId?: string;
  onClose: () => void;
  onSuccess: () => void;
}

const ContentUploader: React.FC<Props> = ({ courseId, chapterId, onClose, onSuccess }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingChapters, setLoadingChapters] = useState(false);

  const [formData, setFormData] = useState<Partial<ContentUploadForm>>({
    courseId: courseId || '',
    chapterId: chapterId || '',
    difficulty: 'Medium',
    tags: [],
    isPremium: false,
  });

  const [flashcardsFile, setFlashcardsFile] = useState<File | null>(null);
  const [toppersNotesImages, setToppersNotesImages] = useState<File[]>([]);
  const [lastMinuteRevisionPdf, setLastMinuteRevisionPdf] = useState<File | null>(null);
  const [cheatSheetImage, setCheatSheetImage] = useState<File | null>(null);
  const [tagInput, setTagInput] = useState('');

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ stage: string; progress: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Load courses on mount
  useEffect(() => {
    loadCourses();
  }, []);

  // Load chapters when course is selected
  useEffect(() => {
    if (formData.courseId) {
      loadChapters(formData.courseId);
    } else {
      setChapters([]);
      setFormData(prev => ({ ...prev, chapterId: '' }));
    }
  }, [formData.courseId]);

  const loadCourses = async () => {
    setLoadingCourses(true);
    try {
      const allCourses = await contentService.getCourses();
      setCourses(allCourses);
    } catch (error) {
      console.error('Error loading courses:', error);
      setError('Failed to load courses');
    } finally {
      setLoadingCourses(false);
    }
  };

  const loadChapters = async (courseId: string) => {
    setLoadingChapters(true);
    try {
      console.log('Loading chapters for course:', courseId);
      const courseChapters = await contentService.getChapters(courseId);
      console.log('Loaded chapters:', courseChapters);
      setChapters(courseChapters);
      if (courseChapters.length === 0) {
        console.warn('No chapters found for course:', courseId);
      }
    } catch (error) {
      console.error('Error loading chapters:', error);
      setError('Failed to load chapters');
    } finally {
      setLoadingChapters(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'flashcards' | 'toppersNotes' | 'revision' | 'cheatSheet') => {
    const files = e.target.files;
    if (!files) return;

    if (type === 'flashcards') {
      setFlashcardsFile(files[0]);
    } else if (type === 'toppersNotes') {
      setToppersNotesImages(Array.from(files));
    } else if (type === 'revision') {
      setLastMinuteRevisionPdf(files[0]);
    } else if (type === 'cheatSheet') {
      setCheatSheetImage(files[0]);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter(t => t !== tag) || [],
    });
  };

  const validateForm = (): string | null => {
    if (!formData.courseId) return 'Course is required';
    if (!formData.chapterId) return 'Chapter is required';
    if (!formData.topicTitle) return 'Topic title is required';
    if (!flashcardsFile && toppersNotesImages.length === 0 && !lastMinuteRevisionPdf && !cheatSheetImage) {
      return 'At least one content file is required';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(true);

    try {
      // 1. Validate flashcards if provided
      if (flashcardsFile) {
        setUploadProgress({ stage: 'Validating flashcards', progress: 5 });
        const validation = await contentProcessor.validateFlashcardsCSV(flashcardsFile);
        if (!validation.valid) {
          throw new Error(`Flashcards validation failed: ${validation.errors.join(', ')}`);
        }
      }

      // 2. Generate topic ID
      const topicId = contentProcessor.generateTopicId(
        formData.courseId!,
        formData.chapterId!,
        formData.topicTitle!
      );

      // 3. Upload files to Firebase Storage
      setUploadProgress({ stage: 'Uploading files', progress: 20 });
      const uploadedContent = await contentProcessor.publishContent(
        {
          ...formData as ContentUploadForm,
          flashcardsFile: flashcardsFile || undefined,
          toppersNotesImages: toppersNotesImages.length > 0 ? toppersNotesImages : undefined,
          lastMinuteRevisionPdf: lastMinuteRevisionPdf || undefined,
          cheatSheetImage: cheatSheetImage || undefined,
        },
        topicId,
        (stage, progress) => {
          setUploadProgress({ stage, progress });
        }
      );

      // 4. Create topic in Firestore
      setUploadProgress({ stage: 'Creating topic', progress: 90 });
      await contentService.createTopic({
        chapterId: formData.chapterId!,
        courseId: formData.courseId!,
        title: formData.topicTitle!,
        description: formData.topicDescription || '',
        order: 0, // Will be updated later
        difficulty: formData.difficulty!,
        tags: formData.tags || [],
        isPremium: formData.isPremium!,
        content: {
          ...(uploadedContent.flashcardsRef && { flashcardsRef: uploadedContent.flashcardsRef }),
          ...(uploadedContent.toppersNotesRefs && uploadedContent.toppersNotesRefs.length > 0 && { toppersNotesRefs: uploadedContent.toppersNotesRefs }),
          ...(uploadedContent.lastMinuteRevisionRef && { lastMinuteRevisionRef: uploadedContent.lastMinuteRevisionRef }),
          ...(uploadedContent.cheatSheetRef && { cheatSheetRef: uploadedContent.cheatSheetRef }),
        },
        metadata: {
          lastUpdated: new Date(),
          views: 0,
          likes: 0,
          completions: 0,
        },
      });

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);

    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload content');
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl m-4">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">Upload Content</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Add flashcards, summaries, and images for a new topic
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Course & Chapter Dropdowns */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Course *
              </label>
              {loadingCourses ? (
                <div className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-gray-400">
                  Loading courses...
                </div>
              ) : (
                <select
                  value={formData.courseId}
                  onChange={(e) => setFormData({ ...formData, courseId: e.target.value, chapterId: '' })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Select a course</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.name} ({course.board} - Class {course.class})
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Chapter *
              </label>
              {loadingChapters ? (
                <div className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-gray-400">
                  Loading chapters...
                </div>
              ) : (
                <select
                  value={formData.chapterId}
                  onChange={(e) => setFormData({ ...formData, chapterId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                  disabled={!formData.courseId || chapters.length === 0}
                  required
                >
                  <option value="">
                    {!formData.courseId
                      ? 'Select a course first'
                      : chapters.length === 0
                      ? 'No chapters available'
                      : 'Select a chapter'}
                  </option>
                  {chapters.map(chapter => (
                    <option key={chapter.id} value={chapter.id}>
                      {chapter.order}. {chapter.title}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Topic Title */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Topic Title *
            </label>
            <input
              type="text"
              value={formData.topicTitle || ''}
              onChange={(e) => setFormData({ ...formData, topicTitle: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
              placeholder="e.g., Coulomb's Law"
              required
            />
          </div>

          {/* Topic Description */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.topicDescription || ''}
              onChange={(e) => setFormData({ ...formData, topicDescription: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
              rows={3}
              placeholder="Brief description of the topic..."
            />
          </div>

          {/* Difficulty & Premium */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Difficulty
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div className="flex items-center">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPremium}
                  onChange={(e) => setFormData({ ...formData, isPremium: e.target.checked })}
                  className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  Premium Content
                </span>
              </label>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                placeholder="Add tag and press Enter"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags?.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full text-sm flex items-center gap-2"
                >
                  {tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)}>
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* File Uploads */}
          <div className="space-y-4">
            {/* Flashcards CSV */}
            <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-6">
              <label className="flex flex-col items-center cursor-pointer">
                <FileText size={32} className="text-gray-400 mb-2" />
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Flash Cards (CSV)
                </span>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleFileChange(e, 'flashcards')}
                  className="hidden"
                />
                <span className="text-xs text-gray-500">
                  {flashcardsFile ? flashcardsFile.name : 'Click to upload CSV file'}
                </span>
              </label>
            </div>

            {/* Class Topper's Notes */}
            <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-6">
              <label className="flex flex-col items-center cursor-pointer">
                <Image size={32} className="text-gray-400 mb-2" />
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Class Topper's Notes (Handwritten Notes)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileChange(e, 'toppersNotes')}
                  className="hidden"
                />
                <span className="text-xs text-gray-500">
                  {toppersNotesImages.length > 0 ? `${toppersNotesImages.length} image(s) selected` : 'Click to upload images'}
                </span>
              </label>
            </div>

            {/* Last Minute Revision PDF */}
            <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-6">
              <label className="flex flex-col items-center cursor-pointer">
                <FileText size={32} className="text-gray-400 mb-2" />
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Last Minute Revision (PDF)
                </span>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileChange(e, 'revision')}
                  className="hidden"
                />
                <span className="text-xs text-gray-500">
                  {lastMinuteRevisionPdf ? lastMinuteRevisionPdf.name : 'Click to upload PDF file'}
                </span>
              </label>
            </div>

            {/* Cheat Sheet */}
            <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-6">
              <label className="flex flex-col items-center cursor-pointer">
                <Image size={32} className="text-gray-400 mb-2" />
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Cheat Sheet (Image)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'cheatSheet')}
                  className="hidden"
                />
                <span className="text-xs text-gray-500">
                  {cheatSheetImage ? cheatSheetImage.name : 'Click to upload image'}
                </span>
              </label>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle size={20} className="text-red-600 dark:text-red-400" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
              <p className="text-sm text-green-600 dark:text-green-400">
                Content uploaded successfully!
              </p>
            </div>
          )}

          {/* Upload Progress */}
          {uploadProgress && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  {uploadProgress.stage}
                </span>
                <span className="text-sm text-blue-600 dark:text-blue-400">
                  {Math.round(uploadProgress.progress)}%
                </span>
              </div>
              <div className="w-full h-2 bg-blue-200 dark:bg-blue-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${uploadProgress.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || success}
              className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={20} />
                  Upload Content
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContentUploader;
