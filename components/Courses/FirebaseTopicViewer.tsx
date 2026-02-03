import React, { useState, useEffect } from 'react';
import { BookOpen, Layers, ChevronLeft, ArrowLeft, ArrowRight, RotateCcw, Image as ImageIcon, FileText } from 'lucide-react';
import { Topic as FirebaseTopic } from '../../types/content.types';
import Papa from 'papaparse';

interface Props {
  topic: FirebaseTopic;
  onBack: () => void;
}

interface FlashcardItem {
  front: string;
  back: string;
  hint?: string;
  imageUrl?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

type TabType = 'flashcards' | 'toppersNotes' | 'revision' | 'cheatSheet';

const FirebaseTopicViewer: React.FC<Props> = ({ topic, onBack }) => {
  const [activeTab, setActiveTab] = useState<TabType>('flashcards');
  const [flashcards, setFlashcards] = useState<FlashcardItem[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Determine which tab to show first
  useEffect(() => {
    if (topic.content.flashcardsRef) setActiveTab('flashcards');
    else if (topic.content.toppersNotesRefs && topic.content.toppersNotesRefs.length > 0) setActiveTab('toppersNotes');
    else if (topic.content.lastMinuteRevisionRef) setActiveTab('revision');
    else if (topic.content.cheatSheetRef) setActiveTab('cheatSheet');
  }, [topic]);

  useEffect(() => {
    loadContent();
  }, [topic]);

  const loadContent = async () => {
    setLoading(true);
    try {
      // Load flashcards if available
      if (topic.content.flashcardsRef) {
        const response = await fetch(topic.content.flashcardsRef);
        const csvText = await response.text();

        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.errors.length > 0) {
              console.error('CSV Parsing errors:', results.errors);
            }
            const cards = results.data.map((row: any) => ({
              front: row.front || '',
              back: row.back || '',
              hint: row.hint || undefined,
              imageUrl: row.imageUrl || undefined,
              difficulty: (row.difficulty?.toLowerCase() || 'medium') as 'easy' | 'medium' | 'hard',
            })).filter(card => card.front && card.back);

            setFlashcards(cards);
          },
        });
      }
    } catch (error: any) {
      console.error('Error loading content:', error);
      setError(error.message || 'Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleReset = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const currentCard = flashcards[currentCardIndex];

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 shadow border border-gray-200 dark:border-slate-700 font-bold text-xs uppercase hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors theme-text"
          >
            <ChevronLeft size={16} /> Back to Courses
          </button>

          {/* Available Study Materials */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-black mb-4 theme-text">📚 Available Study Materials</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Flash Cards */}
              <button
                onClick={() => topic.content.flashcardsRef && setActiveTab('flashcards')}
                disabled={!topic.content.flashcardsRef}
                className={`p-4 rounded-xl border-2 transition-all text-left ${topic.content.flashcardsRef
                  ? activeTab === 'flashcards'
                    ? 'border-emerald-600 bg-emerald-100 dark:bg-emerald-900/40 shadow-lg scale-105'
                    : 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 hover:scale-105 hover:shadow-md cursor-pointer'
                  : 'border-gray-200 dark:border-slate-700 opacity-50 cursor-not-allowed'
                  }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Layers size={20} className={topic.content.flashcardsRef ? 'text-emerald-600' : 'text-gray-400'} />
                  <span className="font-bold text-sm theme-text">Flash Cards</span>
                </div>
                {topic.content.flashcardsRef ? (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                    ✓ {flashcards.length > 0 ? `${flashcards.length} cards` : 'Available'}
                  </p>
                ) : (
                  <p className="text-xs text-gray-400">Not available</p>
                )}
              </button>

              {/* Topper's Notes */}
              <button
                onClick={() => topic.content.toppersNotesRefs && topic.content.toppersNotesRefs.length > 0 && setActiveTab('toppersNotes')}
                disabled={!topic.content.toppersNotesRefs || topic.content.toppersNotesRefs.length === 0}
                className={`p-4 rounded-xl border-2 transition-all text-left ${topic.content.toppersNotesRefs && topic.content.toppersNotesRefs.length > 0
                  ? activeTab === 'toppersNotes'
                    ? 'border-blue-600 bg-blue-100 dark:bg-blue-900/40 shadow-lg scale-105'
                    : 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 hover:scale-105 hover:shadow-md cursor-pointer'
                  : 'border-gray-200 dark:border-slate-700 opacity-50 cursor-not-allowed'
                  }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <ImageIcon size={20} className={topic.content.toppersNotesRefs && topic.content.toppersNotesRefs.length > 0 ? 'text-blue-600' : 'text-gray-400'} />
                  <span className="font-bold text-sm theme-text">Notes</span>
                </div>
                {topic.content.toppersNotesRefs && topic.content.toppersNotesRefs.length > 0 ? (
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                    ✓ {topic.content.toppersNotesRefs.length} pages
                  </p>
                ) : (
                  <p className="text-xs text-gray-400">Not available</p>
                )}
              </button>

              {/* Last Minute Revision */}
              <button
                onClick={() => topic.content.lastMinuteRevisionRef && setActiveTab('revision')}
                disabled={!topic.content.lastMinuteRevisionRef}
                className={`p-4 rounded-xl border-2 transition-all text-left ${topic.content.lastMinuteRevisionRef
                  ? activeTab === 'revision'
                    ? 'border-purple-600 bg-purple-100 dark:bg-purple-900/40 shadow-lg scale-105'
                    : 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 hover:scale-105 hover:shadow-md cursor-pointer'
                  : 'border-gray-200 dark:border-slate-700 opacity-50 cursor-not-allowed'
                  }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <FileText size={20} className={topic.content.lastMinuteRevisionRef ? 'text-purple-600' : 'text-gray-400'} />
                  <span className="font-bold text-sm theme-text">Revision</span>
                </div>
                {topic.content.lastMinuteRevisionRef ? (
                  <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold">
                    ✓ PDF available
                  </p>
                ) : (
                  <p className="text-xs text-gray-400">Not available</p>
                )}
              </button>

              {/* Cheat Sheet */}
              <button
                onClick={() => topic.content.cheatSheetRef && setActiveTab('cheatSheet')}
                disabled={!topic.content.cheatSheetRef}
                className={`p-4 rounded-xl border-2 transition-all text-left ${topic.content.cheatSheetRef
                  ? activeTab === 'cheatSheet'
                    ? 'border-amber-600 bg-amber-100 dark:bg-amber-900/40 shadow-lg scale-105'
                    : 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 hover:scale-105 hover:shadow-md cursor-pointer'
                  : 'border-gray-200 dark:border-slate-700 opacity-50 cursor-not-allowed'
                  }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen size={20} className={topic.content.cheatSheetRef ? 'text-amber-600' : 'text-gray-400'} />
                  <span className="font-bold text-sm theme-text">Cheat Sheet</span>
                </div>
                {topic.content.cheatSheetRef ? (
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
                    ✓ Available
                  </p>
                ) : (
                  <p className="text-xs text-gray-400">Not available</p>
                )}
              </button>
            </div>
          </div>



          {/* Content Display */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
            {/* Content */}
            <div className="p-8">
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">Loading content...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12 text-red-500">
                  <p className="font-bold mb-2">Error loading flashcards</p>
                  <p className="text-sm opacity-75 mb-4">{error}</p>
                  <button
                    onClick={loadContent}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold uppercase transition-transform active:scale-95"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <>
                  {/* Flash Cards Tab */}
                  {activeTab === 'flashcards' && (
                    flashcards.length > 0 ? (
                      <div className="space-y-6">
                        {/* Progress */}
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold theme-text">
                            Card {currentCardIndex + 1} of {flashcards.length}
                          </span>
                          <button
                            onClick={handleReset}
                            className="flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 theme-text transition-colors"
                          >
                            <RotateCcw size={14} />
                            Reset
                          </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300"
                            style={{ width: `${((currentCardIndex + 1) / flashcards.length) * 100}%` }}
                          />
                        </div>

                        {/* Flashcard */}
                        <div className="relative">
                          <div
                            onClick={() => setIsFlipped(!isFlipped)}
                            className="relative min-h-[300px] cursor-pointer perspective-1000"
                          >
                            <div
                              className={`relative w-full min-h-[300px] transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''
                                }`}
                            >
                              {/* Front */}
                              <div className="absolute inset-0 backface-hidden">
                                <div className="h-full bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 flex flex-col items-center justify-center text-white shadow-2xl">
                                  <div className="text-xs font-bold uppercase tracking-wider opacity-75 mb-4">
                                    Question
                                  </div>
                                  <div className="text-2xl font-bold text-center mb-6">
                                    {currentCard.front}
                                  </div>
                                  {currentCard.hint && (
                                    <div className="mt-auto pt-4 text-sm opacity-75 text-center">
                                      💡 Hint: {currentCard.hint}
                                    </div>
                                  )}
                                  <div className="mt-4 text-sm opacity-75">
                                    Click to flip
                                  </div>
                                </div>
                              </div>

                              {/* Back */}
                              <div className="absolute inset-0 backface-hidden rotate-y-180">
                                <div className="h-full bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-8 flex flex-col items-center justify-center text-white shadow-2xl">
                                  <div className="text-xs font-bold uppercase tracking-wider opacity-75 mb-4">
                                    Answer
                                  </div>
                                  <div className="text-2xl font-bold text-center mb-6">
                                    {currentCard.back}
                                  </div>
                                  {currentCard.imageUrl && (
                                    <div className="mt-4 w-full h-48 flex items-center justify-center">
                                      <img
                                        src={currentCard.imageUrl}
                                        alt="Flashcard"
                                        className="max-w-full max-h-full rounded-lg shadow-lg object-contain"
                                      />
                                    </div>
                                  )}
                                  <div className="mt-auto text-sm opacity-75">
                                    Click to flip back
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-between pt-4">
                          <button
                            onClick={handlePrevious}
                            disabled={currentCardIndex === 0}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 font-bold text-sm theme-text hover:bg-gray-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <ArrowLeft size={18} />
                            Previous
                          </button>
                          <button
                            onClick={handleNext}
                            disabled={currentCardIndex === flashcards.length - 1}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            Next
                            <ArrowRight size={18} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        <Layers size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                        <div className="text-lg font-bold mb-2">No flashcards available</div>
                        <div className="text-sm">Flashcards for this topic are not available yet. Please check back later.</div>
                      </div>
                    )
                  )}

                  {/* Topper's Notes Tab */}
                  {activeTab === 'toppersNotes' && topic.content.toppersNotesRefs && topic.content.toppersNotesRefs.length > 0 && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between text-sm mb-4">
                        <span className="font-semibold theme-text">
                          Page {currentImageIndex + 1} of {topic.content.toppersNotesRefs.length}
                        </span>
                      </div>

                      {/* Image Display */}
                      <div className="relative bg-gray-100 dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg h-[60vh] flex items-center justify-center">
                        <img
                          src={topic.content.toppersNotesRefs[currentImageIndex]}
                          alt={`Topper's notes page ${currentImageIndex + 1}`}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Navigation */}
                      <div className="flex items-center justify-between pt-4">
                        <button
                          onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                          disabled={currentImageIndex === 0}
                          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 font-bold text-sm theme-text hover:bg-gray-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <ArrowLeft size={18} />
                          Previous
                        </button>
                        <button
                          onClick={() => setCurrentImageIndex(Math.min(topic.content.toppersNotesRefs!.length - 1, currentImageIndex + 1))}
                          disabled={currentImageIndex === topic.content.toppersNotesRefs.length - 1}
                          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Next
                          <ArrowRight size={18} />
                        </button>
                      </div>

                      {/* Thumbnail Grid */}
                      <div className="grid grid-cols-4 md:grid-cols-6 gap-2 mt-6">
                        {topic.content.toppersNotesRefs.map((imgUrl, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${idx === currentImageIndex
                              ? 'border-indigo-600 shadow-lg scale-105'
                              : 'border-gray-300 dark:border-slate-600 hover:border-indigo-400'
                              }`}
                          >
                            <img
                              src={imgUrl}
                              alt={`Thumbnail ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Last Minute Revision Tab */}
                  {activeTab === 'revision' && topic.content.lastMinuteRevisionRef && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-black theme-text">📚 Last Minute Revision PDF</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Quick revision guide for exam preparation
                          </p>
                        </div>

                      </div>

                      {/* PDF Viewer */}
                      <div className="w-full bg-gray-100 dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg">
                        <iframe
                          src={`https://docs.google.com/viewer?url=${encodeURIComponent(topic.content.lastMinuteRevisionRef)}&embedded=true`}
                          className="w-full h-[75vh] border-0"
                          title="Last Minute Revision PDF"
                        />
                      </div>
                    </div>
                  )}

                  {/* Cheat Sheet Tab */}
                  {activeTab === 'cheatSheet' && topic.content.cheatSheetRef && (
                    <div className="space-y-6">
                      <div className="flex flex-col items-center gap-4">
                        <h3 className="text-xl font-black theme-text">📄 Cheat Sheet</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          Quick reference guide with all essential formulas and concepts
                        </p>

                        {/* Image Display */}
                        <div className="w-full bg-gray-100 dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg h-[70vh] flex items-center justify-center">
                          <img
                            src={topic.content.cheatSheetRef}
                            alt="Cheat Sheet"
                            className="w-full h-full object-contain"
                          />
                        </div>


                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Topic Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
            <h1 className="text-3xl font-black mb-2">{topic.title}</h1>
            {topic.description && (
              <p className="text-lg opacity-90">{topic.description}</p>
            )}
            <div className="mt-4 flex flex-wrap gap-3">
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-semibold">
                📊 {topic.difficulty}
              </span>
              {topic.isPremium && (
                <span className="px-3 py-1 bg-amber-400 text-amber-900 rounded-full text-sm font-bold">
                  ⭐ Premium
                </span>
              )}
              {topic.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-white/20 rounded-full text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirebaseTopicViewer;
