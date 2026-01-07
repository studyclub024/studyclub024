import React from 'react';
import { ArrowLeft } from 'lucide-react';
import NotesDisplay from '../Display/NotesDisplay';
import FlashcardDisplay from '../Display/FlashcardDisplay';
import QuizDisplay from '../Display/QuizDisplay';
import StudyPlanDisplay from '../Display/StudyPlanDisplay';
import SimpleTextDisplay from '../Display/SimpleTextDisplay';
import DescribeDisplay from '../Display/DescribeDisplay';
import MathDisplay from '../Display/MathDisplay';

type Props = {
  title: string;
  resultType: string;
  content: any;
  onBack: () => void;
};

const ResultPage: React.FC<Props> = ({ title, resultType, content, onBack }) => {
  const render = () => {
    switch (resultType) {
      case 'notes': return <NotesDisplay data={content} />;
      case 'flashcards': return <FlashcardDisplay data={content} canUseThemes={true} onOpenUpgrade={() => {}} />;
      case 'quiz': return <QuizDisplay data={content} />;
      case 'plan': return <StudyPlanDisplay data={content} />;
      case 'summary': return <SimpleTextDisplay data={content} />;
      case 'eli5': return <SimpleTextDisplay data={content} />;
      case 'describe': return <DescribeDisplay data={content} />;
      case 'math': return <MathDisplay data={content} onRegenerate={() => {}} isRegenerating={false} />;
      default: return <div className="p-8 text-center text-gray-500">No pre-generated content for {resultType}</div>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <button onClick={onBack} className="mb-6 flex items-center gap-2 text-xs font-black uppercase tracking-widest theme-text">
        <ArrowLeft size={14} /> Back to Topic
      </button>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl border theme-border">
        <h3 className="text-2xl font-black mb-4">{title} — {resultType}</h3>
        <div>
          {render()}
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
