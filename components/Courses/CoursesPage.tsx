import React, { useState, useEffect } from 'react';
import {
  Search,
  BookOpen,
  ChevronRight,
  Microscope,
  Calculator,
  Zap,
  Layers,
  Filter
} from 'lucide-react';

import courseLibrary from '../../services/courseLibrary';
import { contentService } from '../../services/contentService';
import { Course as FirebaseCourse, Chapter as FirebaseChapter, Topic as FirebaseTopic } from '../../types/content.types';

import TopicPage from './TopicPage';
import ResultPage from './ResultPage';

import NotesDisplay from '../Display/NotesDisplay';
import FlashcardDisplay from '../Display/FlashcardDisplay';
import QuizDisplay from '../Display/QuizDisplay';
import MathDisplay from '../Display/MathDisplay';
import StudyPlanDisplay from '../Display/StudyPlanDisplay';
import SimpleTextDisplay from '../Display/SimpleTextDisplay';
import DescribeDisplay from '../Display/DescribeDisplay';

import ErrorBoundary from '../common/ErrorBoundary';
import { getTopicComponentById } from './TopicPages';
import FirebaseTopicViewer from './FirebaseTopicViewer';

/* ---------------- component ---------------- */

const CoursesPage: React.FC = () => {
  const [firebaseCourses, setFirebaseCourses] = useState<FirebaseCourse[]>([]);
  const [firebaseChapters, setFirebaseChapters] = useState<Record<string, FirebaseChapter[]>>({});
  const [firebaseTopics, setFirebaseTopics] = useState<Record<string, FirebaseTopic[]>>({});
  const [selectedCourse, setSelectedCourse] = useState<FirebaseCourse | null>(null);
  const [selectedFirebaseTopic, setSelectedFirebaseTopic] = useState<FirebaseTopic | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExamCategory, setSelectedExamCategory] = useState('ALL EXAM/CATEGORYS');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('ALL COURSES');

  // Keep for legacy topic pages only
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [selectedResultType, setSelectedResultType] = useState<string | null>(null);

  /* ---------------- effects ---------------- */

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        const courses = await contentService.getCourses();
        setFirebaseCourses(courses);

        const chaptersMap: Record<string, FirebaseChapter[]> = {};
        const topicsMap: Record<string, FirebaseTopic[]> = {};

        for (const course of courses) {
          const chapters = await contentService.getChapters(course.id);
          chaptersMap[course.id] = chapters;

          // Load topics for each chapter
          for (const chapter of chapters) {
            try {
              const topics = await contentService.getTopicsByChapter(chapter.id);
              topicsMap[chapter.id] = topics;
            } catch (e) {
              console.error(`Failed to load topics for chapter ${chapter.id}:`, e);
              topicsMap[chapter.id] = [];
            }
          }
        }

        setFirebaseChapters(chaptersMap);
        setFirebaseTopics(topicsMap);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  /* ---------------- helpers ---------------- */

  const getSubjectIcon = (subject: string) => {
    switch (subject.toLowerCase()) {
      case 'physics':
        return Microscope;
      case 'maths':
      case 'mathematics':
        return Calculator;
      case 'chemistry':
        return Zap;
      case 'science':
        return Microscope;
      default:
        return BookOpen;
    }
  };

  /* ---------------- result page ---------------- */

  if (selectedTopicId && selectedResultType) {
    const topic = courseLibrary.getTopicById(selectedTopicId);
    const content = topic?.results[selectedResultType] || null;

    return (
      <ErrorBoundary>
        <ResultPage
          title={topic?.label || 'Topic'}
          resultType={selectedResultType}
          content={content}
          onBack={() => setSelectedResultType(null)}
        />
      </ErrorBoundary>
    );
  }

  /* ---------------- Firebase topic viewer ---------------- */

  if (selectedFirebaseTopic) {
    return (
      <ErrorBoundary>
        <FirebaseTopicViewer
          topic={selectedFirebaseTopic}
          onBack={() => setSelectedFirebaseTopic(null)}
        />
      </ErrorBoundary>
    );
  }

  /* ---------------- topic page ---------------- */

  if (selectedTopicId) {
    const topic = courseLibrary.getTopicById(selectedTopicId);
    if (!topic) return null;

    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorBoundary>
          {(() => {
            const PageComponent = getTopicComponentById(topic.id);
            if (PageComponent) {
              return (
                <div className="space-y-6">
                  <button
                    onClick={() => setSelectedTopicId(null)}
                    className="px-4 py-2 rounded-xl bg-white shadow border font-bold text-xs uppercase"
                  >
                    ← Back
                  </button>
                  <PageComponent />
                </div>
              );
            }

            return (
              <TopicPage
                topic={topic}
                onBack={() => setSelectedTopicId(null)}
                onSelectResult={setSelectedResultType}
              />
            );
          })()}
        </ErrorBoundary>
      </div>
    );
  }

  /* ---------------- main page ---------------- */

  // Get unique boards and classes for filters
  // Ensure JEE Main and NEET are always available options
  const uniqueBoards = Array.from(new Set([...firebaseCourses.map(c => c.board), 'JEE MAIN', 'NEET'])).sort();

  // Filter classes based on selected board (if any)
  const availableClasses = firebaseCourses
    .filter(c => selectedExamCategory === 'ALL EXAM/CATEGORYS' || c.board === selectedExamCategory)
    .map(c => c.class);
  const uniqueClasses = Array.from(new Set(availableClasses)).sort((a, b) => {
    // Convert to strings for localeCompare if needed, though they should be strings from firebase
    const strA = String(a);
    const strB = String(b);
    const numA = parseInt(strA);
    const numB = parseInt(strB);
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
    return strA.localeCompare(strB);
  });

  // Filter courses based on search and filters
  const filteredCourses = firebaseCourses.filter(course => {
    const searchLower = searchQuery.toLowerCase();

    // Search filter
    const matchesSearch = !searchQuery ||
      course.subject.toLowerCase().includes(searchLower) ||
      course.board.toLowerCase().includes(searchLower) ||
      `class ${course.class}`.includes(searchLower);

    // Board/Exam filter
    const matchesBoard = selectedExamCategory === 'ALL EXAM/CATEGORYS' ||
      course.board.toUpperCase() === selectedExamCategory.toUpperCase();

    // Class filter
    const matchesClass = selectedCourseFilter === 'ALL COURSES' ||
      `Class ${course.class}` === selectedCourseFilter;

    return matchesSearch && matchesBoard && matchesClass;
  });

  // Count total topics for a course
  const getTotalTopics = (courseId: string) => {
    const chapters = firebaseChapters[courseId] || [];
    return chapters.reduce((total, chapter) => {
      const topics = firebaseTopics[chapter.id] || [];
      return total + topics.length;
    }, 0);
  };

  // Course card view
  if (!selectedCourse) {
    const isStep1 = selectedExamCategory === 'ALL EXAM/CATEGORYS' && !searchQuery;
    const isStep2 = !isStep1 && selectedCourseFilter === 'ALL COURSES' && !searchQuery;
    const isStep3 = !isStep1 && !isStep2;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className={`flex items-center gap-3 mb-3 ${searchQuery ? '' : 'justify-center md:justify-start'}`}>
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <Layers size={24} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                ✦ Curated Academic Protocols
              </span>
            </div>
            <h1 className={`text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 ${searchQuery ? '' : 'text-center md:text-left'}`}>
              Academic Vault
            </h1>
            <p className={`text-lg text-gray-600 dark:text-gray-400 max-w-2xl ${searchQuery ? '' : 'mx-auto md:mx-0 text-center md:text-left'}`}>
              Explore high-fidelity, pre-built educational pathways for board exams, competitive targets, and core concepts.
            </p>
          </div>

          {/* Search Bar - Always Visible */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search specific topics, subjects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
              />
            </div>
          </div>

          {/* Navigation/Breadcrumbs (Only visible in Steps 2 & 3) */}
          {!isStep1 && !searchQuery && (
            <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
              <button
                onClick={() => { setSelectedExamCategory('ALL EXAM/CATEGORYS'); setSelectedCourseFilter('ALL COURSES'); }}
                className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-bold whitespace-nowrap"
              >
                Categories
              </button>
              <ChevronRight size={16} className="text-gray-400" />
              <button
                onClick={() => setSelectedCourseFilter('ALL COURSES')}
                className={`px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap ${isStep2 ? 'bg-indigo-600 text-white' : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'}`}
              >
                {selectedExamCategory}
              </button>
              {isStep3 && (
                <>
                  <ChevronRight size={16} className="text-gray-400" />
                  <span className="px-3 py-1 rounded-full bg-indigo-600 text-white text-sm font-bold whitespace-nowrap">
                    {selectedCourseFilter}
                  </span>
                </>
              )}
            </div>
          )}

          {/* Render Content Based on Step */}
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">Loading Protocol...</p>
            </div>
          ) : (
            <>
              {/* Step 1: Category Selection */}
              {isStep1 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {uniqueBoards.map(board => (
                    <button
                      key={board}
                      onClick={() => setSelectedExamCategory(board)}
                      className="group bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-transparent hover:border-indigo-500 hover:shadow-2xl transition-all duration-300 text-center"
                    >
                      <div className="w-16 h-16 mx-auto bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <BookOpen size={32} className="text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <h3 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {board}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-semibold">
                        Select Category →
                      </p>
                    </button>
                  ))}
                </div>
              )}

              {/* Step 2: Class Selection */}
              {isStep2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-center mb-8 theme-text">Select Class</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {uniqueClasses.map(className => (
                      <button
                        key={className}
                        onClick={() => setSelectedCourseFilter(`Class ${className}`)}
                        className="group bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-transparent hover:border-purple-500 hover:shadow-xl transition-all duration-300 text-center"
                      >
                        <div className="w-12 h-12 mx-auto bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <Layers size={24} className="text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="text-lg font-black text-gray-900 dark:text-white">
                          Class {className}
                        </h3>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Subject Selection (Existing Grid) */}
              {isStep3 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-2xl font-bold mb-6 theme-text">
                    {searchQuery ? `Search Results for "${searchQuery}"` : 'Select Subject'}
                  </h2>

                  {filteredCourses.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl">
                      <BookOpen size={64} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                      <p className="text-gray-600 dark:text-gray-400 text-lg">No courses found matching your criteria.</p>
                      <button
                        onClick={() => { setSearchQuery(''); setSelectedExamCategory('ALL EXAM/CATEGORYS'); setSelectedCourseFilter('ALL COURSES'); }}
                        className="mt-4 text-indigo-600 font-bold hover:underline"
                      >
                        Clear Filters
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredCourses.map(course => {
                        const Icon = getSubjectIcon(course.subject);
                        const topicCount = getTotalTopics(course.id);

                        return (
                          <button
                            key={course.id}
                            onClick={() => setSelectedCourse(course)}
                            className="group bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 text-left border border-transparent hover:border-indigo-500"
                          >
                            {/* Icon */}
                            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                              <Icon size={32} className="text-indigo-600 dark:text-indigo-400" />
                            </div>

                            {/* Course Info */}
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {course.subject}
                            </h3>
                            <div className="flex items-center justify-between mt-4">
                              <span className="text-sm text-gray-500 dark:text-gray-400 font-semibold">
                                {topicCount} topics
                              </span>
                              <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-slate-700 rounded-full text-xs font-bold text-gray-600 dark:text-gray-400">
                                {course.board}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  // Course detail view with chapters and topics
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Button */}
        <button
          onClick={() => setSelectedCourse(null)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 shadow border border-gray-200 dark:border-slate-700 font-bold text-xs uppercase hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors theme-text mb-6"
        >
          ← Back to Courses
        </button>

        {/* Course Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-white/20 rounded-2xl">
              <Layers size={40} />
            </div>
            <div>
              <h1 className="text-4xl font-black mb-2">
                {selectedCourse.subject} {selectedCourse.class}
              </h1>
              <p className="text-lg opacity-90">
                {selectedCourse.board} • {selectedCourse.description}
              </p>
            </div>
          </div>
        </div>

        {/* Chapters */}
        <div className="space-y-4">
          {(firebaseChapters[selectedCourse.id] || []).map(chapter => {
            const topics = firebaseTopics[chapter.id] || [];

            return (
              <div key={chapter.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
                {/* Chapter Header */}
                <div className="p-6 border-b border-gray-200 dark:border-slate-700">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 flex items-center justify-center text-lg font-black">
                      {chapter.order}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">{chapter.title}</h2>
                    </div>
                    <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                      {topics.length} topics
                    </span>
                  </div>
                </div>

                {/* Topics */}
                <div className="p-6">
                  {topics.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                      No topics available yet
                    </p>
                  ) : (
                    <div className="grid gap-3">
                      {topics.map(topic => (
                        <button
                          key={topic.id}
                          onClick={() => setSelectedFirebaseTopic(topic)}
                          className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors group border border-gray-100 dark:border-slate-700"
                        >
                          <div className="flex items-center gap-3">
                            <BookOpen size={20} className="text-indigo-500" />
                            <div className="text-left">
                              <p className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                {topic.title}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {topic.isPremium && (
                              <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 text-xs font-bold rounded">
                                PRO
                              </span>
                            )}
                            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 dark:bg-slate-600 text-gray-600 dark:text-gray-300">
                              {topic.difficulty}
                            </span>
                            <ChevronRight size={20} className="text-gray-400 group-hover:text-indigo-600" />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
