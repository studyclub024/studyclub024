
import React, { useState } from 'react';
import { MathResponse } from '../../types';
import { ChevronDown, ChevronUp, Calculator, GitBranch, ArrowRightLeft, Sigma, Hash, ListPlus, Wand2, Square, Grid, ShieldCheck } from 'lucide-react';
import LatexRenderer from './LatexRenderer';
import MathGraph from './MathGraph';

interface Props {
  data: MathResponse;
  onRegenerate: (method: string) => void;
  isRegenerating: boolean;
}

const SOLVE_METHODS = [
  { id: 'DEFAULT', label: 'Step-by-Step', icon: Wand2 },
  { id: 'QUADRATIC_FORMULA', label: 'Quadratic Formula', icon: Sigma },
  { id: 'FACTORIZATION', label: 'Factorization', icon: GitBranch },
  { id: 'COMPLETING_THE_SQUARE', label: 'Complete Square', icon: Square },
  { id: 'GRAPHICAL_ANALYSIS', label: 'Graphical', icon: Grid },
  { id: 'DISCRIMINANT', label: 'Discriminant', icon: ArrowRightLeft },
  { id: 'NUM_SOLUTIONS', label: 'No. of Solutions', icon: Hash },
];

const MathDisplay: React.FC<Props> = ({ data, onRegenerate, isRegenerating }) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(0); // Default first step open

  const toggleStep = (index: number) => {
    setExpandedStep(expandedStep === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      
      {/* 1. Equation Header */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center relative overflow-hidden">
        {(data as any).is_verified && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 animate-fade-in shadow-sm">
             <ShieldCheck size={14} strokeWidth={3} />
             <span className="text-[9px] font-black uppercase tracking-widest">Symbolic Engine Verified</span>
          </div>
        )}
        <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Original Equation</h2>
        <div className="text-2xl sm:text-4xl text-indigo-900 bg-indigo-50/50 py-6 px-8 rounded-2xl inline-block border border-indigo-100/50 min-w-[240px] shadow-inner">
           <LatexRenderer>{data.equation}</LatexRenderer>
        </div>
        <div className="mt-6 flex justify-center gap-2">
            <span className="bg-indigo-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-full shadow-sm uppercase tracking-wide">
               {data.method_used.replace(/_/g, ' ')}
            </span>
        </div>
      </div>

      {/* 2. Solve By Options */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-4 ml-2">Alternative Methods</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
              {SOLVE_METHODS.map((method) => (
                  <button
                      key={method.id}
                      onClick={() => onRegenerate(method.id)}
                      disabled={isRegenerating}
                      className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all border group active:scale-95 disabled:opacity-50 ${data.method_used === method.id ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'hover:bg-indigo-50 hover:text-indigo-600 border-transparent hover:border-indigo-100'}`}
                  >
                      <div className={`p-2.5 rounded-xl transition-all border ${data.method_used === method.id ? 'bg-white text-indigo-600 shadow-sm border-indigo-100' : 'bg-gray-50 text-gray-400 group-hover:bg-white group-hover:text-indigo-600 group-hover:shadow-md border-transparent group-hover:border-indigo-100'}`}>
                          <method.icon size={20} />
                      </div>
                      <span className="text-[9px] font-bold text-center leading-tight uppercase tracking-tight">{method.label}</span>
                  </button>
              ))}
          </div>
      </div>

      {/* Graphical Representation Section */}
      {data.graph_data && (
          <div className="animate-fade-in-up">
              <MathGraph graphData={data.graph_data} />
          </div>
      )}

      {/* 3. Final Answer Card */}
      <div className="bg-indigo-900 rounded-3xl p-10 text-white shadow-xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
             <Calculator size={140} />
         </div>
         <div className="relative z-10">
            <h3 className="text-indigo-300 text-xs font-bold uppercase tracking-widest mb-4">Solution Found</h3>
            <div className="text-3xl sm:text-5xl font-bold leading-tight mb-4">
                <LatexRenderer className="text-white">{data.final_answer}</LatexRenderer>
            </div>
            {data.final_answer_approx && (
                <div className="mt-4 pt-4 border-t border-white/10 text-indigo-200 text-xl flex items-center gap-2">
                    <span className="text-indigo-400 font-medium">≈</span>
                    <LatexRenderer inline className="text-indigo-100">{data.final_answer_approx}</LatexRenderer>
                </div>
            )}
         </div>
      </div>

      {/* 3.5 Alternative Forms */}
      {data.alternative_forms && data.alternative_forms.length > 0 && (
         <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6 text-gray-900">
               <ListPlus size={22} className="text-indigo-600" />
               <h3 className="font-bold text-lg">Other Forms</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {data.alternative_forms.map((form, idx) => (
                  <div key={idx} className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 flex items-center justify-center">
                     <LatexRenderer className="text-lg text-gray-700">{form}</LatexRenderer>
                  </div>
               ))}
            </div>
         </div>
      )}

      {/* 4. Step-by-Step Accordion */}
      <div className="space-y-4">
          <h3 className="text-xl font-extrabold text-gray-900 ml-2 tracking-tight">Step-by-Step Breakdown</h3>
          {data.steps.map((step, idx) => {
              const isOpen = expandedStep === idx;
              return (
                  <div 
                    key={idx} 
                    className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen ? 'border-indigo-200 shadow-lg ring-1 ring-indigo-50' : 'border-gray-100 hover:border-indigo-100 shadow-sm'}`}
                  >
                      <button 
                        onClick={() => toggleStep(idx)}
                        className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                      >
                          <div className="flex items-center gap-5">
                              <span className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base transition-all ${isOpen ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-gray-100 text-gray-400'}`}>
                                  {idx + 1}
                              </span>
                              <span className={`font-bold text-lg ${isOpen ? 'text-indigo-950' : 'text-gray-600'}`}>
                                  {step.title}
                              </span>
                          </div>
                          <div className={`p-2 rounded-full transition-colors ${isOpen ? 'bg-indigo-50 text-indigo-500' : 'text-gray-300'}`}>
                            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </div>
                      </button>

                      <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                          <div className="px-6 pb-8 pl-[4.75rem]">
                              <div className="bg-indigo-50/30 rounded-2xl p-6 text-gray-900 mb-5 border border-indigo-100/30">
                                  <LatexRenderer className="text-xl">{step.expression}</LatexRenderer>
                              </div>
                              <div className="text-gray-600 text-base leading-relaxed border-l-2 border-indigo-100 pl-5">
                                  <LatexRenderer inline>{step.explanation}</LatexRenderer>
                              </div>
                          </div>
                      </div>
                  </div>
              );
          })}
      </div>
    </div>
  );
};

export default MathDisplay;
