
import React from 'react';
import { NotesResponse } from '../../types';
import { BookOpen } from 'lucide-react';
import LatexRenderer from './LatexRenderer';

interface Props {
  data: NotesResponse;
  fullWidth?: boolean;
}

const NotesDisplay: React.FC<Props> = ({ data, fullWidth }) => {
  return (
    <div className={`${fullWidth ? 'w-full' : 'max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700'} overflow-hidden`}>
      <div className="bg-indigo-50 dark:bg-indigo-900/30 p-8 border-b border-indigo-100 dark:border-indigo-800/50">
        <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 mb-2">
          <BookOpen size={20} />
          <span className="uppercase tracking-wider text-xs font-bold">Study Notes</span>
        </div>
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white">{data.title}</h2>
      </div>

      <div className="p-8 space-y-12">
        {data.sections.map((section, idx) => (
          <div key={idx} className="relative pl-6 border-l-2 border-indigo-100 dark:border-indigo-800">
            <h3 className="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">{section.heading}</h3>
            <ul className="space-y-3">
              {section.bullets.map((bullet, bIdx) => (
                <li key={bIdx} className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed flex items-start gap-2">
                  <span className="mt-2 w-1.5 h-1.5 bg-indigo-400 dark:bg-indigo-500 rounded-full flex-shrink-0" />
                  <span className="w-full"><LatexRenderer>{bullet}</LatexRenderer></span>
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
