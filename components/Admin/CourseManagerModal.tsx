import React, { useEffect, useMemo, useState } from 'react';
import { X, BookOpen, PlusCircle, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { contentService } from '../../services/contentService';
import type { Course, Chapter } from '../../types/content.types';

type Tab = 'course' | 'chapter';

type Props = {
  onClose: () => void;
};

const CourseManagerModal: React.FC<Props> = ({ onClose }) => {
  const [tab, setTab] = useState<Tab>('course');

  const [loading, setLoading] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [chapters, setChapters] = useState<Chapter[]>([]);

  // ---------------------- course form ----------------------
  const [courseName, setCourseName] = useState('');
  const [courseSubject, setCourseSubject] = useState('');
  const [courseClass, setCourseClass] = useState<number>(10);
  const [courseBoard, setCourseBoard] = useState('CBSE');
  const [courseCategory, setCourseCategory] = useState('NCERT Solutions');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseDifficulty, setCourseDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>('Intermediate');
  const [courseIcon, setCourseIcon] = useState('BookOpen');
  const [courseColor, setCourseColor] = useState('#3b82f6');

  // ---------------------- chapter form ----------------------
  const [chapterNumber, setChapterNumber] = useState<number>(1);
  const [chapterTitle, setChapterTitle] = useState('');
  const [chapterDescription, setChapterDescription] = useState('');
  const [chapterOrder, setChapterOrder] = useState<number>(1);
  const [chapterPremium, setChapterPremium] = useState(false);
  const [chapterEstimatedHours, setChapterEstimatedHours] = useState<number>(6);

  const selectedCourse = useMemo(
    () => courses.find(c => c.id === selectedCourseId) || null,
    [courses, selectedCourseId]
  );

  const loadCourses = async () => {
    setLoadingCourses(true);
    try {
      const list = await contentService.getCourses();
      setCourses(list);
      if (!selectedCourseId && list.length > 0) {
        setSelectedCourseId(list[0].id);
      }
    } catch (e) {
      console.error(e);
      setError('Failed to load courses');
    } finally {
      setLoadingCourses(false);
    }
  };

  const loadChapters = async (courseId: string) => {
    if (!courseId) {
      setChapters([]);
      return;
    }
    setLoadingChapters(true);
    try {
      const list = await contentService.getChapters(courseId);
      setChapters(list);
    } catch (e) {
      console.error(e);
      setError('Failed to load chapters');
    } finally {
      setLoadingChapters(false);
    }
  };

  useEffect(() => {
    loadCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadChapters(selectedCourseId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCourseId]);

  const resetMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!courseName.trim()) return setError('Course name is required');
    if (!courseSubject.trim()) return setError('Subject is required');
    if (!courseBoard.trim()) return setError('Board is required');

    setLoading(true);
    try {
      const newCourseId = await contentService.createCourse({
        name: courseName.trim(),
        category: courseCategory.trim() || 'NCERT Solutions',
        board: courseBoard.trim(),
        class: Number(courseClass),
        subject: courseSubject.trim(),
        description: courseDescription.trim() || undefined,
        metadata: {
          totalChapters: 0,
          totalTopics: 0,
          difficulty: courseDifficulty,
          icon: courseIcon.trim() || 'BookOpen',
          color: courseColor || '#3b82f6',
        },
      });

      await loadCourses();
      setSelectedCourseId(newCourseId);
      setTab('chapter');
      setSuccess('Course created successfully. Now add chapters.');

      setCourseName('');
      setCourseSubject('');
      setCourseDescription('');
    } catch (err: any) {
      setError(err?.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!selectedCourseId) return setError('Select a course first');
    if (!chapterTitle.trim()) return setError('Chapter title is required');

    setLoading(true);
    try {
      await contentService.createChapter({
        courseId: selectedCourseId,
        chapterNumber: Number(chapterNumber),
        title: chapterTitle.trim(),
        description: chapterDescription.trim() || undefined,
        order: Number(chapterOrder),
        isPremium: Boolean(chapterPremium),
        estimatedHours: Number(chapterEstimatedHours),
        metadata: {
          totalTopics: 0,
          hasFlashcards: false,
          hasSummary: false,
          hasQuiz: false,
          hasNotes: false,
        },
      });

      setSuccess('Chapter added successfully');
      setChapterTitle('');
      setChapterDescription('');

      await loadChapters(selectedCourseId);
    } catch (err: any) {
      setError(err?.message || 'Failed to create chapter');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <BookOpen size={20} className="text-indigo-600 dark:text-indigo-300" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-black text-gray-900 dark:text-white">Course & Chapter Manager</h2>
              <p className="text-xs text-gray-500 dark:text-slate-400">Create courses and add chapters from the UI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => { resetMessages(); setTab('course'); }}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border-2 transition-all ${tab === 'course' ? 'theme-bg text-white border-transparent' : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-slate-700'}`}
            >
              Create Course
            </button>
            <button
              onClick={() => { resetMessages(); setTab('chapter'); }}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border-2 transition-all ${tab === 'chapter' ? 'theme-bg text-white border-transparent' : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-slate-700'}`}
            >
              Add Chapter
            </button>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-4 p-4 rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 flex items-start gap-3">
              <AlertCircle size={18} className="text-red-600 dark:text-red-400 mt-0.5" />
              <div className="text-sm text-red-700 dark:text-red-300">{error}</div>
            </div>
          )}
          {success && (
            <div className="mb-4 p-4 rounded-xl border border-green-200 dark:border-green-900/30 bg-green-50 dark:bg-green-900/10 flex items-start gap-3">
              <CheckCircle size={18} className="text-green-600 dark:text-green-400 mt-0.5" />
              <div className="text-sm text-green-700 dark:text-green-300">{success}</div>
            </div>
          )}

          {tab === 'course' ? (
            <form onSubmit={handleCreateCourse} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-600 dark:text-slate-300">Course name</label>
                <input
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  className="mt-1 w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-white/5 outline-none focus:border-indigo-400 dark:text-white"
                  placeholder="e.g. Physics Class 12"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 dark:text-slate-300">Subject</label>
                <input
                  value={courseSubject}
                  onChange={(e) => setCourseSubject(e.target.value)}
                  className="mt-1 w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-white/5 outline-none focus:border-indigo-400 dark:text-white"
                  placeholder="e.g. Physics"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 dark:text-slate-300">Class</label>
                <input
                  type="number"
                  value={courseClass}
                  onChange={(e) => setCourseClass(Number(e.target.value))}
                  min={1}
                  max={12}
                  className="mt-1 w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-white/5 outline-none focus:border-indigo-400 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 dark:text-slate-300">Board</label>
                <input
                  value={courseBoard}
                  onChange={(e) => setCourseBoard(e.target.value)}
                  className="mt-1 w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-white/5 outline-none focus:border-indigo-400 dark:text-white"
                  placeholder="e.g. CBSE"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 dark:text-slate-300">Category</label>
                <input
                  value={courseCategory}
                  onChange={(e) => setCourseCategory(e.target.value)}
                  className="mt-1 w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-white/5 outline-none focus:border-indigo-400 dark:text-white"
                  placeholder="e.g. NCERT Solutions"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-600 dark:text-slate-300">Description (optional)</label>
                <textarea
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  className="mt-1 w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-white/5 outline-none focus:border-indigo-400 dark:text-white"
                  rows={3}
                  placeholder="Short description shown in the course card"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 dark:text-slate-300">Difficulty</label>
                <select
                  value={courseDifficulty}
                  onChange={(e) => setCourseDifficulty(e.target.value as any)}
                  className="mt-1 w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-white/5 outline-none focus:border-indigo-400 dark:text-white"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 dark:text-slate-300">Icon</label>
                  <input
                    value={courseIcon}
                    onChange={(e) => setCourseIcon(e.target.value)}
                    className="mt-1 w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-white/5 outline-none focus:border-indigo-400 dark:text-white"
                    placeholder="lucide icon name"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 dark:text-slate-300">Color</label>
                  <input
                    value={courseColor}
                    onChange={(e) => setCourseColor(e.target.value)}
                    className="mt-1 w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-white/5 outline-none focus:border-indigo-400 dark:text-white"
                    placeholder="#3b82f6"
                  />
                </div>
              </div>

              <div className="md:col-span-2 flex items-center justify-between mt-2">
                <div className="text-xs text-gray-500 dark:text-slate-400">
                  {loadingCourses ? 'Loading courses…' : `Existing courses: ${courses.length}`}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-3 rounded-xl theme-bg text-white font-black uppercase tracking-widest text-xs flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <PlusCircle size={18} />}
                  Create Course
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Left: form */}
              <form onSubmit={handleCreateChapter} className="lg:col-span-3 space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 dark:text-slate-300">Course</label>
                  <select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    disabled={loadingCourses}
                    className="mt-1 w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-white/5 outline-none focus:border-indigo-400 dark:text-white disabled:opacity-60"
                  >
                    <option value="" disabled>Choose a course</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.subject} (Class {c.class}) — {c.name}
                      </option>
                    ))}
                  </select>
                  {selectedCourse && (
                    <div className="mt-1 text-[11px] text-gray-500 dark:text-slate-400">
                      Selected: <span className="font-semibold">{selectedCourse.name}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-600 dark:text-slate-300">Chapter #</label>
                    <input
                      type="number"
                      value={chapterNumber}
                      onChange={(e) => {
                        const n = Number(e.target.value);
                        setChapterNumber(n);
                        if (!Number.isNaN(n)) setChapterOrder(n);
                      }}
                      min={1}
                      className="mt-1 w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-white/5 outline-none focus:border-indigo-400 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 dark:text-slate-300">Order</label>
                    <input
                      type="number"
                      value={chapterOrder}
                      onChange={(e) => setChapterOrder(Number(e.target.value))}
                      min={0}
                      className="mt-1 w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-white/5 outline-none focus:border-indigo-400 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 dark:text-slate-300">Hours</label>
                    <input
                      type="number"
                      value={chapterEstimatedHours}
                      onChange={(e) => setChapterEstimatedHours(Number(e.target.value))}
                      min={0}
                      className="mt-1 w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-white/5 outline-none focus:border-indigo-400 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 dark:text-slate-300">Title</label>
                  <input
                    value={chapterTitle}
                    onChange={(e) => setChapterTitle(e.target.value)}
                    className="mt-1 w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-white/5 outline-none focus:border-indigo-400 dark:text-white"
                    placeholder="e.g. Electric Charges and Fields"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 dark:text-slate-300">Description (optional)</label>
                  <textarea
                    value={chapterDescription}
                    onChange={(e) => setChapterDescription(e.target.value)}
                    className="mt-1 w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-white/5 outline-none focus:border-indigo-400 dark:text-white"
                    rows={3}
                    placeholder="Short chapter overview"
                  />
                </div>

                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={chapterPremium}
                    onChange={(e) => setChapterPremium(e.target.checked)}
                    className="w-4 h-4"
                  />
                  Premium chapter
                </label>

                <div className="flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={loading || !selectedCourseId}
                    className="px-5 py-3 rounded-xl theme-bg text-white font-black uppercase tracking-widest text-xs flex items-center gap-2 disabled:opacity-50"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <PlusCircle size={18} />}
                    Add Chapter
                  </button>
                </div>
              </form>

              {/* Right: preview list */}
              <div className="lg:col-span-2">
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-slate-400">
                      Existing chapters
                    </div>
                    <button
                      type="button"
                      onClick={() => loadChapters(selectedCourseId)}
                      disabled={loadingChapters}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-300 hover:underline disabled:opacity-50"
                    >
                      Refresh
                    </button>
                  </div>

                  {loadingChapters ? (
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
                      <Loader2 size={16} className="animate-spin" /> Loading…
                    </div>
                  ) : chapters.length === 0 ? (
                    <div className="text-sm text-gray-500 dark:text-slate-400">No chapters yet.</div>
                  ) : (
                    <div className="space-y-2 max-h-72 overflow-auto pr-1">
                      {chapters
                        .slice()
                        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                        .map(ch => (
                          <div
                            key={ch.id}
                            className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5"
                          >
                            <div className="text-sm font-bold text-gray-900 dark:text-white">
                              {ch.chapterNumber}. {ch.title}
                            </div>
                            <div className="text-[11px] text-gray-500 dark:text-slate-400">
                              order: {ch.order} · {ch.isPremium ? 'premium' : 'free'}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
          <div className="text-xs text-gray-500 dark:text-slate-400">
            If you get permission errors, confirm Firestore rules and that your user has <code>role: "admin"</code>.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border-2 border-gray-100 dark:border-white/5 text-gray-700 dark:text-slate-200 text-xs font-black uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseManagerModal;
