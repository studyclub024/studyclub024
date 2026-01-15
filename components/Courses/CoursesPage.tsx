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
  const uniqueBoards = Array.from(new Set(firebaseCourses.map(c => c.board))).sort();
  const uniqueClasses = Array.from(new Set(firebaseCourses.map(c => c.class))).sort();

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
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <Layers size={24} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                ✦ Curated Academic Protocols
              </span>
            </div>
            <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-4">
              Academic Vault
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
              Explore high-fidelity, pre-built educational pathways for board exams, competitive targets, and core concepts.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search topic or subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Filter size={16} />
                  <span className="font-bold uppercase tracking-wide">Global Filters</span>
                </div>
                {/* Exam/Category Filter */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
                    Exam/Category
                  </label>
                  <select
                    value={selectedExamCategory}
                    onChange={(e) => setSelectedExamCategory(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option>ALL EXAM/CATEGORYS</option>
                    {uniqueBoards.map(board => (
                      <option key={board}>{board.toUpperCase()}</option>
                    ))}
                  </select>
                </div>

                {/* Course Filter */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
                    Course
                  </label>
                  <select
                    value={selectedCourseFilter}
                    onChange={(e) => setSelectedCourseFilter(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option>ALL COURSES</option>
                    {uniqueClasses.map(classNum => (
                      <option key={classNum}>Class {classNum}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Course Cards Grid */}
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">Loading courses...</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen size={64} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">No courses found.</p>
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
                    className="group bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 text-left"
                  >
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Layers size={32} className="text-indigo-600 dark:text-indigo-400" />
                    </div>

                    {/* Course Info */}
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {course.subject} {course.class}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold">
                      {topicCount} topics
                    </p>

                    {/* Board Badge */}
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
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
                      {chapter.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{chapter.description}</p>
                      )}
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
                              {topic.description && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                  {topic.description}
                                </p>
                              )}
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
