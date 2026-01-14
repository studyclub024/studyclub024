import React, { useState, useMemo } from 'react';
import { Search, Filter, BookOpen, ChevronRight, Bookmark, ArrowLeft, Layers, CheckCircle, GraduationCap, Star, Zap, Clock, User, ArrowUpRight, Trophy, Microscope, Landmark, Calculator } from 'lucide-react';
import { Course, StudyContent, StudyMode, FlashcardTheme } from '../../types';
import courseLibrary, { Topic } from '../../services/courseLibrary';
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

// Generate filter options dynamically from topic library
const getAllCategories = (topics: Topic[]) => {
  const set = new Set(topics.map(t => t.category));
  return Array.from(set);
};

const getAllCourses = (topics: Topic[]) => {
  const set = new Set(topics.map(t => t.course));
  return Array.from(set);
};

const CoursesPage: React.FC = () => {
  // legacy selectedCourse removed; topic navigation uses `selectedTopicId`
  const [topicLibrary] = useState<Topic[]>(() => courseLibrary.getTopics());
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [selectedResultType, setSelectedResultType] = useState<string | null>(null);

  // Hierarchical navigation state: Category -> Sub-Category (Course) -> Topic
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [classFilter, setClassFilter] = useState('');

  // Get dynamic filter options
  const allCategories = useMemo(() => getAllCategories(topicLibrary), [topicLibrary]);
  const allCourses = useMemo(() => getAllCourses(topicLibrary), [topicLibrary]);

  // Filter topics based on search and filters
  const filteredTopics = useMemo(() => {
    return topicLibrary.filter(topic => {
      const matchesSearch = !searchQuery ||
        topic.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = !catFilter || topic.category === catFilter;
      const matchesCourse = !classFilter || topic.course === classFilter;

      return matchesSearch && matchesCat && matchesCourse;
    });
  }, [topicLibrary, searchQuery, catFilter, classFilter]);

  // Derived lists from filteredTopics (so filters and search work together)
  const categories = useMemo(() => {
    const set = new Set(filteredTopics.map(t => t.category));
    return Array.from(set);
  }, [filteredTopics]);

  const subCourses = useMemo(() => {
    if (!selectedCategory) return [];
    const set = new Set(filteredTopics.filter(t => t.category === selectedCategory).map(t => t.course));
    return Array.from(set);
  }, [filteredTopics, selectedCategory]);

  const topicsForCourse = useMemo(() => {
    if (!selectedCourse || !selectedCategory) return [];
    return filteredTopics.filter(t => t.category === selectedCategory && t.course === selectedCourse);
  }, [filteredTopics, selectedCategory, selectedCourse]);

  const renderContent = (content: StudyContent) => {
    switch (content.mode) {
      case 'notes': return <NotesDisplay data={content as any} />;
      case 'flashcards': return <FlashcardDisplay data={content as any} canUseThemes={true} onOpenUpgrade={() => { }} />;
      case 'quiz': return <QuizDisplay data={content as any} />;
      case 'math': return <MathDisplay data={content as any} onRegenerate={() => { }} isRegenerating={false} />;
      case 'eli5': return <SimpleTextDisplay data={content as any} />;
      case 'describe': return <DescribeDisplay data={content as any} />;
      case 'plan': return <StudyPlanDisplay data={content as any} />;
      case 'summary': return <SimpleTextDisplay data={content as any} />;
      default: return <div className="p-10 text-center text-gray-400">Component not found for {content.mode}</div>;
    }
  };

  const getSubjectIcon = (subject: string) => {
    switch (subject.toLowerCase()) {
      case 'physics': return Microscope;
      case 'maths': return Calculator;
      case 'chemistry': return Zap;
      case 'biology': return Star;
      case 'english': return BookOpen;
      default: return BookOpen;
    }
  };

  // If a result is selected, show result page
  if (selectedTopicId && selectedResultType) {
    const topic = courseLibrary.getTopicById(selectedTopicId);
    const content = topic?.results[selectedResultType] || null;
    return (
      <ErrorBoundary>
        <ResultPage
          title={topic ? topic.label : 'Topic'}
          resultType={selectedResultType}
          content={content}
          onBack={() => setSelectedResultType(null)}
        />
      </ErrorBoundary>
    );
  }

  // If a topic is selected (from library), show TopicPage
  if (selectedTopicId) {
    const topic = courseLibrary.getTopicById(selectedTopicId);
    if (!topic) {
      setSelectedTopicId(null);
      return null;
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorBoundary>
          {(() => {
            const PageComponent = getTopicComponentById(topic.id);
            if (PageComponent) {
              return (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <button onClick={() => setSelectedTopicId(null)} className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-white/5 font-bold text-xs uppercase tracking-widest hover:theme-text transition-all">← Back to Vault</button>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{topic.course} Protocol</div>
                  </div>
                  <div className="-mx-2 md:mx-0 overflow-hidden rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-white/5 bg-white dark:bg-slate-900 animate-fade-in">
                    <PageComponent />
                  </div>

                </div>
              );
            }
            return (
              <TopicPage
                topic={topic}
                onBack={() => setSelectedTopicId(null)}
                onSelectResult={(type) => setSelectedResultType(type)}
              />
            );
          })()}
        </ErrorBoundary>
      </div>
    );
  }


  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in space-y-12">
      <div className="flex items-center justify-between mb-6">
        {(selectedCategory || selectedCourse) ? (
          <button
            onClick={() => {
              if (searchQuery) {
                setSearchQuery('');
              } else if (selectedCourse) {
                setSelectedCourse(null);
              } else if (selectedCategory) {
                setSelectedCategory(null);
              }
            }}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 transition-all"
          >
            ← Back
          </button>
        ) : (
          <div />
        )}

        {searchQuery ? (
          <div className="text-sm font-bold theme-text">Search Results for "{searchQuery}"</div>
        ) : selectedCategory ? (
          <div className="text-sm font-bold opacity-80">{selectedCategory}{selectedCourse ? ` / ${selectedCourse}` : ''}</div>
        ) : (
          <div />
        )}
        <div />
      </div>
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 theme-bg-soft theme-text rounded-full text-[10px] font-black uppercase tracking-widest border theme-border">
            <Star size={12} fill="currentColor" /> Curated Academic Protocols
          </div>
          <h2 className="text-5xl font-black text-gray-950 dark:text-white tracking-tighter leading-tight">Academic Vault</h2>
          <p className="text-gray-500 dark:text-slate-400 font-medium max-w-xl text-lg">
            Explore high-fidelity, pre-built educational pathways for board exams, competitive targets, and core concepts.
          </p>
        </div>

        <div className="w-full md:w-[400px] relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:theme-text transition-colors" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topic or subject..."
            className="w-full pl-16 pr-8 py-4 bg-white dark:bg-slate-900 border-2 border-gray-100 dark:border-white/5 rounded-[2rem] outline-none focus:border-theme font-semibold dark:text-white shadow-xl shadow-gray-100/30 dark:shadow-none transition-all"
          />
        </div>
      </div>

      {/* Modern Filter Hub */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 shadow-sm border theme-border flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2 text-gray-400 font-black text-[10px] uppercase tracking-widest border-r theme-border pr-6">
          <Filter size={14} /> Global Filters
        </div>

        <div className="flex flex-wrap gap-4 flex-1">
          <FilterSelect label="Exam/Category" value={catFilter} onChange={setCatFilter} options={allCategories} />
          <FilterSelect label="Course" value={classFilter} onChange={setClassFilter} options={allCourses} />
        </div>

        {(catFilter || classFilter) && (
          <button
            onClick={() => { setCatFilter(''); setClassFilter(''); }}
            className="text-pink-600 font-black text-[10px] uppercase tracking-widest hover:underline"
          >
            Reset
          </button>
        )}
      </div>

      {/* Hierarchical Grid or Search Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
        {searchQuery ? (
          filteredTopics.length > 0 ? filteredTopics.map(topic => (
            <div key={topic.id} onClick={() => setSelectedTopicId(topic.id)} className="group relative bg-white dark:bg-slate-900 rounded-[3rem] p-6 border-2 border-transparent hover:border-theme shadow-xl transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 theme-bg-soft theme-text rounded-2xl">
                  {(() => {
                    const Icon = getSubjectIcon(topic.course.split(' ')[0]);
                    return <Icon />;
                  })()}
                </div>
                {topic.isPremium ? <div className="text-amber-600 font-black text-[10px] uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full">Premium</div> : null}
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-1">{topic.label}</h3>
              <p className="text-[10px] font-black theme-text uppercase tracking-widest opacity-60">{topic.course} • {topic.category}</p>
            </div>
          )) : (
            <div className="col-span-full py-40 flex flex-col items-center justify-center text-center opacity-30 grayscale">
              <Bookmark size={80} className="mb-6" />
              <p className="text-2xl font-black uppercase tracking-[0.2em]">No Results Found</p>
              <button onClick={() => setSearchQuery('')} className="mt-4 theme-text font-bold hover:underline">Clear Search</button>
            </div>
          )
        ) : (
          <>
            {/* If no category selected => show categories */}
            {!selectedCategory && categories.map(cat => (
              <div key={cat} onClick={() => { setSelectedCategory(cat); setSelectedCourse(null); }} className="group relative bg-white dark:bg-slate-900 rounded-[2rem] p-8 border-2 border-transparent hover:border-theme shadow-xl transition-all cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 theme-bg-soft theme-text rounded-2xl"><BookOpen /></div>
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">{cat}</h3>
                <p className="text-sm text-gray-500">{topicLibrary.filter(t => t.category === cat).length} topics available</p>
              </div>
            ))}

            {/* If category selected but no course selected => show sub-courses (courses) */}
            {selectedCategory && !selectedCourse && subCourses.map(courseName => (
              <div key={courseName} onClick={() => setSelectedCourse(courseName)} className="group relative bg-white dark:bg-slate-900 rounded-[2rem] p-8 border-2 border-transparent hover:border-theme shadow-xl transition-all cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 theme-bg-soft theme-text rounded-2xl"><Layers /></div>
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">{courseName}</h3>
                <p className="text-sm text-gray-500">{topicLibrary.filter(t => t.course === courseName && t.category === selectedCategory).length} topics</p>
              </div>
            ))}

            {/* If course selected => show topics under that course */}
            {selectedCategory && selectedCourse && (
              topicsForCourse.length > 0 ? topicsForCourse.map(topic => (
                <div key={topic.id} onClick={() => setSelectedTopicId(topic.id)} className="group relative bg-white dark:bg-slate-900 rounded-[3rem] p-6 border-2 border-transparent hover:border-theme shadow transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 theme-bg-soft theme-text rounded-2xl"><BookOpen /></div>
                    {topic.isPremium ? <div className="text-amber-600 font-black">Premium</div> : null}
                  </div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white mb-1">{topic.label}</h3>
                  <p className="text-sm text-gray-500">{topic.course} • {topic.category}</p>
                </div>
              )) : (
                <div className="col-span-full py-40 flex flex-col items-center justify-center text-center opacity-30 grayscale">
                  <Bookmark size={80} className="mb-6" />
                  <p className="text-2xl font-black uppercase tracking-[0.2em]">No Topics Found</p>
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
};

const FilterSelect = ({ label, value, onChange, options }: any) => (
  <div className="flex flex-col gap-1.5 min-w-[120px]">
    <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-gray-50 dark:bg-slate-800 px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-tight text-gray-700 dark:text-white outline-none focus:ring-2 ring-indigo-100 dark:ring-indigo-900/50 border-none appearance-none cursor-pointer shadow-sm transition-all hover:bg-white dark:hover:bg-slate-700"
    >
      <option value="">All {label}s</option>
      {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

export default CoursesPage;