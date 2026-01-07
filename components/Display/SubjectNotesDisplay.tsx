
import React, { useState } from 'react';
import { ChemNotesResponse, MathNotesResponse, PhysicsNotesResponse } from '../../types';
import { FlaskConical, Atom, Sigma, AlertTriangle, Lightbulb, BookOpen, CheckCircle, XCircle } from 'lucide-react';
import LatexRenderer from './LatexRenderer';

interface Props {
  data: ChemNotesResponse | MathNotesResponse | PhysicsNotesResponse;
}

const SubjectNotesDisplay: React.FC<Props> = ({ data }) => {
  const [quizState, setQuizState] = useState<{ [key: number]: string | null }>({});
  const [showResults, setShowResults] = useState(false);

  const handleOptionSelect = (qIdx: number, option: string) => {
    if (showResults) return;
    setQuizState(prev => ({ ...prev, [qIdx]: option }));
  };

  // CHEMISTRY RENDERER
  if (data.mode === 'chem_notes') {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
           <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600"><FlaskConical size={24} /></div>
              <div>
                  <h2 className="text-xl font-bold text-gray-900">{data.topic}</h2>
                  <p className="text-sm text-gray-500">Chemistry Notes</p>
              </div>
           </div>

           <div className="space-y-6">
              {data.reactions?.map((reaction, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded">{reaction.type || 'Reaction'}</span>
                      </div>
                      <div className="text-lg font-mono text-gray-800 mb-2">
                          <LatexRenderer>{reaction.equation}</LatexRenderer>
                      </div>
                      <div className="text-sm text-gray-600">
                          <LatexRenderer inline>{reaction.description}</LatexRenderer>
                      </div>
                  </div>
              ))}
           </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Lightbulb size={18} className="text-amber-500"/> Key Concepts</h3>
                <ul className="space-y-4">
                    {data.key_concepts?.map((concept, idx) => (
                        <li key={idx}>
                            <span className="font-bold text-gray-900 block text-sm">{concept.concept}</span>
                            <span className="text-sm text-gray-600">
                                <LatexRenderer inline>{concept.explanation}</LatexRenderer>
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
            {data.safety && (
                <div className="bg-red-50 rounded-2xl p-6 border border-red-100 h-fit">
                    <h3 className="font-bold text-red-800 mb-2 flex items-center gap-2"><AlertTriangle size={18}/> Safety Notes</h3>
                    <p className="text-sm text-red-700 leading-relaxed">
                        <LatexRenderer inline>{data.safety}</LatexRenderer>
                    </p>
                </div>
            )}
        </div>
      </div>
    );
  }

  // MATH RENDERER
  if (data.mode === 'math_notes') {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
           <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Sigma size={24} /></div>
              <div>
                  <h2 className="text-xl font-bold text-gray-900">{data.topic}</h2>
                  <p className="text-sm text-gray-500">Mathematical Concepts</p>
              </div>
           </div>

           {/* Definitions */}
           {data.definitions && data.definitions.length > 0 && (
            <div className="mb-8">
               <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Definitions</h3>
               <div className="grid gap-3">
                   {data.definitions.map((def, idx) => (
                       <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                           <span className="font-bold text-indigo-700 mr-2">{def.term}:</span>
                           <span className="text-gray-700 text-sm"><LatexRenderer inline>{def.definition}</LatexRenderer></span>
                       </div>
                   ))}
               </div>
            </div>
           )}

           {/* Theorems & Formulas */}
           <div className="space-y-4">
               {data.theorems?.map((thm, idx) => (
                   <div key={idx} className="border-l-4 border-indigo-400 pl-4 py-1">
                       <h4 className="font-bold text-gray-900">{thm.name}</h4>
                       <p className="text-sm text-gray-600 mb-2"><LatexRenderer inline>{thm.statement}</LatexRenderer></p>
                       {thm.latex && <div className="text-lg text-gray-800"><LatexRenderer>{thm.latex}</LatexRenderer></div>}
                   </div>
               ))}
               {data.formulas?.map((formula, idx) => (
                   <div key={idx} className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 text-center">
                       <div className="text-xs text-indigo-500 font-bold uppercase mb-2">{formula.name}</div>
                       <div className="text-xl text-indigo-900 mb-2"><LatexRenderer>{formula.latex}</LatexRenderer></div>
                       <div className="text-xs text-indigo-400"><LatexRenderer inline>{formula.usage}</LatexRenderer></div>
                   </div>
               ))}
           </div>
         </div>

         {/* Examples */}
         {data.examples && data.examples.length > 0 && (
         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
             <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><BookOpen size={18} className="text-indigo-500"/> Example Problems</h3>
             <div className="space-y-6">
                 {data.examples.map((ex, idx) => (
                     <div key={idx} className="bg-gray-50 rounded-xl p-5">
                         <div className="font-bold text-gray-900 mb-2">Problem: <span className="font-normal text-gray-700"><LatexRenderer>{ex.problem}</LatexRenderer></span></div>
                         <div className="border-t border-gray-200 pt-2 mt-2">
                             <span className="text-xs font-bold text-green-600 uppercase">Solution</span>
                             <div className="mt-1 text-gray-700"><LatexRenderer>{ex.solution}</LatexRenderer></div>
                         </div>
                     </div>
                 ))}
             </div>
         </div>
         )}
         
         {/* Practice Quiz */}
         {data.quiz && data.quiz.length > 0 && (
             <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2"><CheckCircle size={18} className="text-indigo-500"/> Practice Quiz</h3>
                    {showResults && (
                        <button 
                            onClick={() => { setShowResults(false); setQuizState({}); }}
                            className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
                        >
                            Reset Quiz
                        </button>
                    )}
                </div>
                
                <div className="space-y-6">
                    {data.quiz.map((q, qIdx) => {
                        const userAns = quizState[qIdx];
                        const isCorrect = userAns === q.answer;
                        
                        return (
                            <div key={qIdx} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                <p className="font-medium text-gray-900 mb-3"><LatexRenderer inline>{q.q}</LatexRenderer></p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {q.options.map((opt, oIdx) => {
                                        let btnClass = "text-left p-2 rounded-lg border text-sm transition-all ";
                                        if (showResults) {
                                            if (opt === q.answer) btnClass += "bg-green-50 border-green-500 text-green-700 font-medium";
                                            else if (userAns === opt) btnClass += "bg-red-50 border-red-500 text-red-700";
                                            else btnClass += "border-gray-200 opacity-60";
                                        } else {
                                            if (userAns === opt) btnClass += "bg-indigo-50 border-indigo-500 text-indigo-700";
                                            else btnClass += "bg-white border-gray-200 hover:bg-gray-50";
                                        }
                                        
                                        return (
                                            <button 
                                                key={oIdx}
                                                disabled={showResults}
                                                onClick={() => handleOptionSelect(qIdx, opt)}
                                                className={btnClass}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <span><LatexRenderer inline>{opt}</LatexRenderer></span>
                                                    {showResults && opt === q.answer && <CheckCircle size={14} className="text-green-600" />}
                                                    {showResults && userAns === opt && opt !== q.answer && <XCircle size={14} className="text-red-600" />}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                {!showResults && (
                    <div className="mt-6 text-center">
                        <button 
                            onClick={() => setShowResults(true)}
                            disabled={Object.keys(quizState).length < (data.quiz.length || 0)}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-full font-bold text-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                        >
                            Check Answers
                        </button>
                    </div>
                )}
             </div>
         )}
      </div>
    );
  }

  // PHYSICS RENDERER
  if (data.mode === 'physics_notes') {
    return (
       <div className="max-w-3xl mx-auto space-y-6">
         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
           <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="bg-violet-100 p-2 rounded-lg text-violet-600"><Atom size={24} /></div>
              <div>
                  <h2 className="text-xl font-bold text-gray-900">{data.topic}</h2>
                  <p className="text-sm text-gray-500">Physics Principles</p>
              </div>
           </div>
           
           {/* Principles */}
           <div className="grid gap-4 mb-8">
               {data.principles?.map((p, idx) => (
                   <div key={idx} className="bg-violet-50 p-4 rounded-xl border border-violet-100">
                       <h4 className="font-bold text-violet-900 mb-1">{p.name}</h4>
                       <p className="text-sm text-violet-800"><LatexRenderer inline>{p.description}</LatexRenderer></p>
                   </div>
               ))}
           </div>

           {/* Formulas */}
           <div className="space-y-4">
               <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Key Formulas</h3>
               {data.formulas?.map((f, idx) => (
                   <div key={idx} className="flex flex-col md:flex-row md:items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                       <div className="flex-1">
                           <div className="font-bold text-gray-700 text-sm mb-1">{f.name}</div>
                           <div className="text-xl"><LatexRenderer>{f.latex}</LatexRenderer></div>
                       </div>
                       {f.derivation_note && (
                           <div className="md:w-1/3 text-xs text-gray-500 bg-white p-2 rounded border border-gray-100 italic">
                               Note: <LatexRenderer inline>{f.derivation_note}</LatexRenderer>
                           </div>
                       )}
                   </div>
               ))}
           </div>
         </div>

         {/* Real World Applications */}
         <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-lg">
             <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Lightbulb size={18} className="text-yellow-400"/> Real World Applications</h3>
             <div className="space-y-4">
                 {data.applications?.map((app, idx) => (
                     <div key={idx} className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                         <div className="font-bold text-violet-200 text-sm mb-1">{app.context}</div>
                         <p className="text-sm text-gray-200 leading-relaxed"><LatexRenderer inline>{app.explanation}</LatexRenderer></p>
                     </div>
                 ))}
             </div>
         </div>
       </div>
    );
  }

  return null;
};

export default SubjectNotesDisplay;
