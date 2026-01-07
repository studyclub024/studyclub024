import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Topic } from '../../services/courseLibrary';
import { StudyMode } from '../../types';

const RESULT_OPTIONS: { id: string; label: string }[] = [
  { id: 'flashcards', label: 'Flashcards' },
  { id: 'notes', label: 'Study Notes' },
  { id: 'quiz', label: 'Quiz Me' },
  { id: 'plan', label: 'Study Plan' },
  { id: 'summary', label: 'Summary' },
  { id: 'essay', label: 'Essay' },
  { id: 'eli5', label: 'Explain Like I\'m 5' },
  { id: 'describe', label: 'Describe' },
];

type Props = {
  topic: Topic;
  onBack: () => void;
  onSelectResult: (resultType: string) => void;
};

const TopicPage: React.FC<Props> = ({ topic, onBack, onSelectResult }) => {
  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <button onClick={onBack} className="mb-6 flex items-center gap-2 text-xs font-black uppercase tracking-widest theme-text">
        <ArrowLeft size={14} /> Back
      </button>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 md:p-12 shadow-2xl border theme-border">
        <div className="flex items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white">{topic.label}</h2>
            <p className="text-sm text-gray-500">{topic.category} • {topic.course}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {RESULT_OPTIONS.map(opt => (
            <button key={opt.id} onClick={() => onSelectResult(opt.id)} className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl text-left hover:shadow-md transition-all">
              <div className="font-black text-sm mb-1">{opt.label}</div>
              <div className="text-xs text-gray-500">Pre-generated {opt.label.toLowerCase()}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopicPage;
