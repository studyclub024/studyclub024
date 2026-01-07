
import React from 'react';
import { NotesResponse } from '../../types';
import { BookOpen } from 'lucide-react';
import LatexRenderer from './LatexRenderer';

interface Props {
  data: NotesResponse;
}

const NotesDisplay: React.FC<Props> = ({ data }) => {
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-indigo-50 p-8 border-b border-indigo-100">
        <div className="flex items-center gap-3 text-indigo-600 mb-2">
            <BookOpen size={20} />
            <span className="uppercase tracking-wider text-xs font-bold">Study Notes</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900">{data.title}</h2>
      </div>
      
      <div className="p-8 space-y-12">
        {data.sections.map((section, idx) => (
          <div key={idx} className="relative pl-6 border-l-2 border-indigo-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">{section.heading}</h3>
            <ul className="space-y-3">
              {section.bullets.map((bullet, bIdx) => (
                <li key={bIdx} className="text-gray-600 leading-relaxed flex items-start gap-2">
                  <span className="mt-2 w-1.5 h-1.5 bg-indigo-400 rounded-full flex-shrink-0" />
                  <span className="w-full"><LatexRenderer inline>{bullet}</LatexRenderer></span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesDisplay;
