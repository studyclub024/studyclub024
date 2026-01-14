
import React from 'react';
import { DescribeResponse } from '../../types';
import { ScanEye, Lightbulb, ChevronLeft, ChevronRight, Image as ImageIcon, Maximize2 } from 'lucide-react';
import LatexRenderer from './LatexRenderer';

interface Props {
  data: DescribeResponse;
  fullWidth?: boolean;
}

const DescribeDisplay: React.FC<Props> = ({ data, fullWidth }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const images = data.images || [];
  const captions = data.captions || [];

  const handleNext = () => setCurrentIndex(prev => (prev + 1) % images.length);
  const handlePrev = () => setCurrentIndex(prev => (prev - 1 + images.length) % images.length);

  return (
    <div className={`${fullWidth ? 'w-full' : 'max-w-3xl mx-auto'} space-y-6`}>
      {/* Header & Key Insights Summary */}
      <div className={`${fullWidth ? '' : 'bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-slate-700'}`}>
        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 dark:border-white/5 pb-4">
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
          <div className="mb-8 theme-bg-soft rounded-2xl p-6 border theme-border">
            <h3 className="text-[10px] font-black theme-text uppercase tracking-widest mb-4 flex items-center gap-2">
              <Lightbulb size={16} /> Key Insights Summary
            </h3>
            <ul className="space-y-3">
              {data.key_insights.map((insight, idx) => (
                <li key={idx} className="flex gap-4 text-gray-700 dark:text-slate-300 leading-relaxed text-sm">
                  <span className="flex-shrink-0 w-6 h-6 rounded-lg theme-bg text-white flex items-center justify-center text-[10px] font-black">
                    {idx + 1}
                  </span>
                  <span className="font-medium"><LatexRenderer inline>{insight}</LatexRenderer></span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Integrated Image Slider */}
        {images.length > 0 && (
          <div className="mb-12 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg theme-bg-soft theme-text flex items-center justify-center">
                  <ImageIcon size={18} />
                </div>
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-500">Visual Evidence ({currentIndex + 1}/{images.length})</h3>
              </div>
              <div className="flex gap-2">
                <button onClick={handlePrev} className="p-2 rounded-xl bg-gray-50 dark:bg-slate-800 hover:theme-bg-soft hover:theme-text transition-all border border-gray-100 dark:border-white/5 shadow-sm">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={handleNext} className="p-2 rounded-xl bg-gray-50 dark:bg-slate-800 hover:theme-bg-soft hover:theme-text transition-all border border-gray-100 dark:border-white/5 shadow-sm">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="relative group overflow-hidden rounded-[2.5rem] bg-gray-100 dark:bg-slate-800 border-4 border-white dark:border-slate-700 shadow-2xl aspect-video">
              <img
                src={images[currentIndex]}
                alt={captions[currentIndex] || 'Analysis Visual'}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-8 theme-bg rounded-full" />
                  <p className="text-white font-black uppercase tracking-widest text-xs">Fig {currentIndex + 1}</p>
                </div>
                <p className="text-white/80 text-sm font-medium leading-relaxed max-w-2xl">{captions[currentIndex]}</p>
              </div>

              {/* Dots indicator */}
              <div className="absolute bottom-6 right-8 flex gap-2">
                {images.map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-8 theme-bg shadow-[0_0_15px_rgba(theme)]' : 'w-2 bg-white/30'}`} />
                ))}
              </div>
            </div>

            {/* Caption below for accessibility/no-hover */}
            <div className="px-4 py-3 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
              <p className="text-[11px] font-medium text-gray-500 dark:text-slate-400 italic">
                <strong className="theme-text uppercase font-black not-italic mr-2">Caption:</strong>
                {captions[currentIndex]}
              </p>
            </div>
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
