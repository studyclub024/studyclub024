
import React from 'react';
import { SummaryResponse, EssayResponse, Eli5Response } from '../../types';
import { FileText, List, Baby } from 'lucide-react';
import LatexRenderer from './LatexRenderer';

interface Props {
  data: SummaryResponse | EssayResponse | Eli5Response;
}

const SimpleTextDisplay: React.FC<Props> = ({ data }) => {
  const renderContent = () => {
    switch (data.mode) {
      case 'summary':
        return (
          <>
            <div className="flex items-center gap-2 mb-6 text-indigo-600">
                <List size={24} />
                <h2 className="text-lg md:text-2xl font-bold text-gray-800">Key Points Summary</h2>
            </div>
            <ul className="space-y-4">
              {data.bullets.map((point, idx) => (
                <li key={idx} className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xs">
                    {idx + 1}
                  </span>
                  <span className="text-gray-700 leading-relaxed font-medium w-full">
                      <LatexRenderer inline>{point}</LatexRenderer>
                  </span>
                </li>
              ))}
            </ul>
          </>
        );
      
      case 'essay':
        return (
          <div className="prose prose-indigo max-w-none">
             <div className="flex items-center gap-2 mb-4 text-indigo-600">
                <FileText size={24} />
                <span className="uppercase tracking-widest text-xs font-bold">Generated Essay</span>
            </div>
            <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-8">{data.title}</h2>
            <div className="whitespace-pre-wrap text-gray-700 leading-6 md:leading-8 font-serif text-sm md:text-lg">
                <LatexRenderer>{data.essay}</LatexRenderer>
            </div>
          </div>
        );

      case 'eli5':
        return (
           <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-8 border border-indigo-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-white p-2 rounded-lg shadow-sm text-indigo-500">
                    <Baby size={28} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Simply Put...</h2>
                    <p className="text-indigo-600 font-medium">{data.topic}</p>
                </div>
              </div>
              
              <div className="space-y-12">
                  {data.sections.map((section, idx) => (
                      <div key={idx}>
                          <h3 className="text-xl font-bold text-gray-800 mb-2">{section.heading}</h3>
                          <div className="text-lg text-gray-700 leading-relaxed mb-4">
                              <LatexRenderer>{section.content}</LatexRenderer>
                          </div>
                          {section.bullets && section.bullets.length > 0 && (
                              <ul className="bg-white/60 rounded-xl p-4 space-y-2 border border-indigo-50/50 mb-4">
                                  {section.bullets.map((bullet, bIdx) => (
                                      <li key={bIdx} className="flex gap-2 text-gray-700 font-medium">
                                          <span className="text-indigo-500 mt-1.5">•</span>
                                          <span><LatexRenderer inline>{bullet}</LatexRenderer></span>
                                      </li>
                                  ))}
                              </ul>
                          )}
                      </div>
                  ))}
              </div>
           </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
      {renderContent()}
    </div>
  );
};

export default SimpleTextDisplay;
