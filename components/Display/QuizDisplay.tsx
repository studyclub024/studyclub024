
import React, { useState } from 'react';
import { QuizResponse } from '../../types';
import { CheckCircle, XCircle, AlertCircle, HelpCircle } from 'lucide-react';
import LatexRenderer from './LatexRenderer';

interface Props {
  data: QuizResponse;
  onMastery?: () => void;
  fullWidth?: boolean;
}

const QuizDisplay: React.FC<Props> = ({ data, onMastery, fullWidth }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const handleOptionSelect = (qIndex: number, option: string) => {
    if (showResults) return;
    setSelectedAnswers(prev => ({ ...prev, [qIndex]: option }));
  };

  // Normalise incoming data to support legacy shapes (some topics use `questions` with {q, a})
  const mcq = Array.isArray(data?.mcq) ? data.mcq : (Array.isArray((data as any)?.questions) ? (data as any).questions.map((q: any) => ({ q: q.q || q.question, options: q.options || q.choices || [], answer: q.answer || q.a || '' })) : []);
  const short = Array.isArray(data?.short) ? data.short : (Array.isArray((data as any)?.questions) ? (data as any).questions.map((q: any) => ({ q: q.q || q.question, answer: q.a || q.answer || '' })) : []);

  const calculateScore = () => {
    let score = 0;
    mcq.forEach((q, idx) => {
      const selected = selectedAnswers[idx];
      if (!selected) return;
      if (selected === q.answer) {
        score++;
      }
    });
    return score;
  };

  const handleSubmit = () => {
    setShowResults(true);
    mcq.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) {
        onMastery?.();
      }
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`${fullWidth ? 'w-full' : 'max-w-4xl mx-auto'} space-y-10 pb-20`}>
      <div className="flex items-center justify-between border-b border-gray-100 pb-4 md:pb-6">
        <div>
          <h2 className="text-xl md:text-3xl font-black text-gray-950 tracking-tight">Active Assessment</h2>
          <p className="text-gray-500 font-medium text-xs md:text-sm mt-1">Test your knowledge of the analyzed material.</p>
        </div>
        {showResults && (
          <div className="bg-indigo-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-2xl font-black text-sm md:text-base shadow-lg shadow-indigo-100 animate-scale-in">
            Score: {calculateScore()} / {mcq.length}
          </div>
        )}
      </div>

      {mcq.length === 0 && (
        <div className="p-6 bg-yellow-50 border border-yellow-100 rounded-lg text-sm text-yellow-700">
          No multiple-choice questions are available for this topic — showing constructive responses below.
        </div>
      )}

      <div className="space-y-8">
        {mcq.map((question, idx) => {
          const userSelected = selectedAnswers[idx];

          return (
            <div key={idx} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
              <div className="p-4 md:p-10">
                <div className="flex gap-3 md:gap-5 mb-4 md:mb-8">
                  <span className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-base md:text-lg">
                    {idx + 1}
                  </span>
                  <div className="text-base md:text-xl text-gray-950 font-semibold pt-1 leading-relaxed w-full">
                    <LatexRenderer>{question.q}</LatexRenderer>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {question.options.map((option, optIdx) => {
                    let buttonStyle = "border-gray-100 bg-gray-50/50 hover:bg-white hover:border-indigo-300 hover:shadow-sm";

                    if (showResults) {
                      if (option === question.answer) {
                        buttonStyle = "bg-green-50 border-green-500 text-green-900 font-bold shadow-sm ring-2 ring-green-100";
                      } else if (userSelected === option) {
                        buttonStyle = "bg-red-50 border-red-500 text-red-900 opacity-90";
                      } else {
                        buttonStyle = "opacity-40 border-gray-100 grayscale-[0.5]";
                      }
                    } else if (userSelected === option) {
                      buttonStyle = "bg-indigo-50 border-indigo-600 text-indigo-950 font-bold shadow-md ring-4 ring-indigo-50";
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleOptionSelect(idx, option)}
                        disabled={showResults}
                        className={`relative p-3 md:p-6 rounded-2xl border-2 text-left transition-all min-h-[4rem] md:min-h-[5rem] flex items-center group/opt ${buttonStyle}`}
                      >
                        <div className="flex items-center justify-between w-full gap-3 md:gap-4">
                          <span className="w-full text-sm md:text-lg"><LatexRenderer inline>{option}</LatexRenderer></span>
                          {showResults && option === question.answer && <CheckCircle size={22} className="text-green-600 flex-shrink-0" />}
                          {showResults && userSelected === option && option !== question.answer && <XCircle size={22} className="text-red-600 flex-shrink-0" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {showResults && (
                  <div className="mt-4 md:mt-8 pt-4 md:pt-6 border-t border-gray-50 animate-fade-in-up">
                    <div className="flex items-start gap-2 md:gap-3 bg-gray-50 p-3 md:p-5 rounded-2xl border border-gray-100">
                      <HelpCircle size={16} className="text-indigo-400 mt-1 flex-shrink-0 md:w-[18px] md:h-[18px]" />
                      <div className="text-xs md:text-sm text-gray-700 leading-relaxed font-medium">
                        <span className="text-gray-950 font-bold block mb-1 uppercase tracking-widest text-[10px]">Rationalization</span>
                        The correct answer is <span className="text-indigo-600 font-bold">{question.answer}</span>. Ensure you understand the underlying concepts before proceeding.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {short && short.length > 0 && (
        <div className="mt-12 md:mt-16 space-y-6 md:space-y-8">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="h-px bg-gray-200 flex-1"></div>
            <h3 className="text-sm md:text-xl font-black text-gray-400 uppercase tracking-widest">Constructive Responses</h3>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>
          <div className="grid gap-4 md:gap-6">
            {short.map((item, idx) => (
              <div key={idx} className="bg-white rounded-[2rem] p-4 md:p-10 border border-gray-100 shadow-sm">
                <div className="text-base md:text-xl font-bold text-gray-950 mb-4 md:mb-6 flex gap-2 md:gap-4">
                  <span className="text-indigo-300 font-black">Q.</span>
                  <div className="w-full"><LatexRenderer>{item.q}</LatexRenderer></div>
                </div>
                <div className={`transition-all duration-500 ease-out overflow-hidden ${showResults ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="bg-indigo-600 text-white p-4 md:p-8 rounded-[1.5rem] shadow-xl shadow-indigo-100">
                    <span className="font-black text-[10px] uppercase tracking-widest block mb-2 md:mb-3 opacity-70">Official Answer Key</span>
                    <div className="text-sm md:text-lg leading-relaxed"><LatexRenderer className="text-white">{item.answer}</LatexRenderer></div>
                  </div>
                </div>
                {!showResults && <p className="text-xs text-gray-400 font-bold uppercase tracking-widest text-center mt-2 opacity-60 italic">Submit quiz to reveal answers</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col items-center gap-4 pt-10">
        {!showResults ? (
          <button
            onClick={handleSubmit}
            disabled={Object.keys(selectedAnswers).length === 0}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 px-14 rounded-2xl shadow-2xl shadow-indigo-200 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed uppercase tracking-widest text-sm"
          >
            Submit All Answers
          </button>
        ) : (
          <button
            onClick={() => {
              setShowResults(false);
              setSelectedAnswers({});
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="bg-gray-950 hover:bg-black text-white font-black py-5 px-14 rounded-2xl shadow-2xl shadow-gray-200 transition-all transform hover:scale-105 active:scale-95 uppercase tracking-widest text-sm"
          >
            Reset Practice Session
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizDisplay;
