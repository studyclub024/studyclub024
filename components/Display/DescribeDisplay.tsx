
import React from 'react';
import { DescribeResponse } from '../../types';
import { ScanEye, Lightbulb } from 'lucide-react';
import LatexRenderer from './LatexRenderer';

interface Props {
  data: DescribeResponse;
}

const DescribeDisplay: React.FC<Props> = ({ data }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header & Key Insights Summary */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
          <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600">
            <ScanEye size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{data.title}</h2>
             <p className="text-gray-500 font-medium">Visual Analysis</p>
          </div>
        </div>

        {/* Key Insights - Moved to top for better UX */}
        {data.key_insights && data.key_insights.length > 0 && (
          <div className="mb-8 bg-indigo-50 rounded-xl p-6 border border-indigo-100">
             <h3 className="text-sm font-bold text-indigo-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Lightbulb size={18} /> Key Insights
             </h3>
             <ul className="space-y-3">
                {data.key_insights.map((insight, idx) => (
                  <li key={idx} className="flex gap-3 text-indigo-900 leading-relaxed">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-200 text-indigo-700 flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <span className="font-medium"><LatexRenderer inline>{insight}</LatexRenderer></span>
                  </li>
                ))}
             </ul>
          </div>
        )}
        
        {/* Sections */}
        <div className="space-y-12">
           {data.sections.map((section, idx) => (
             <div key={idx} className="border-l-4 border-gray-200 pl-6 py-1 hover:border-indigo-400 transition-colors">
               <h4 className="text-lg font-bold text-gray-800 mb-2">{section.heading}</h4>
               <div className="text-gray-700 leading-relaxed mb-3">
                   <LatexRenderer>{section.content}</LatexRenderer>
               </div>
               {section.bullets && section.bullets.length > 0 && (
                 <ul className="space-y-2 mt-2">
                   {section.bullets.map((bullet, bIdx) => (
                     <li key={bIdx} className="flex gap-2 text-gray-600 text-sm">
                       <span className="text-gray-400 mt-1">•</span>
                       <span><LatexRenderer inline>{bullet}</LatexRenderer></span>
                     </li>
                   ))}
                 </ul>
               )}
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default DescribeDisplay;
