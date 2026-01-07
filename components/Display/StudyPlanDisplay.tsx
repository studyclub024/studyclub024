
import React, { useState, useEffect } from 'react';
import { StudyPlanResponse } from '../../types';
import { Calendar, CheckSquare, Target, BookOpen, ChevronRight, ListChecks } from 'lucide-react';
import LatexRenderer from './LatexRenderer';

interface Props {
  data: StudyPlanResponse;
}

const StudyPlanDisplay: React.FC<Props> = ({ data }) => {
  // Normalize incoming plan data: prefer `schedule`, fallback to legacy `steps` with items
  const schedule = Array.isArray((data as any)?.schedule)
    ? (data as any).schedule
    : Array.isArray((data as any)?.steps)
      ? (data as any).steps.map((s: any, idx: number) => ({
          day: idx + 1,
          topic: s.title || `Day ${idx + 1}`,
          objective: s.summary || s.description || '',
          resources: s.resources || [],
          tasks: s.items || s.tasks || [],
        }))
      : [];

  const [activeDay, setActiveDay] = useState<number>(() => (schedule.length ? schedule[0].day : 1));

  // Ensure active day stays valid when data changes
  useEffect(() => {
    if (schedule.length && !schedule.some(d => d.day === activeDay)) {
      setActiveDay(schedule[0].day);
    }
  }, [data, schedule, activeDay]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
           <Calendar size={180} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
             <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                <Target size={24} className="text-white" />
             </div>
             <span className="text-xs font-black uppercase tracking-[0.2em] text-white/80">Intelligent Roadmap</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">{data.title || 'Study Plan'}</h2>
          <div className="flex flex-wrap gap-4">
             <div className="bg-white/10 px-6 py-2 rounded-full border border-white/20 text-sm font-bold flex items-center gap-2">
                <Calendar size={16} /> {data.duration_days || schedule.length} Days
             </div>
             {data.target_goal && (
                <div className="bg-white/10 px-6 py-2 rounded-full border border-white/20 text-sm font-bold">
                   Goal: {data.target_goal}
                </div>
             )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Day Selector Sidebar */}
        <div className="lg:col-span-4 space-y-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
           <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest px-4 mb-4 flex items-center gap-2">
              <ListChecks size={14} /> Schedule
           </h3>
           {schedule.map((day) => (
             <button
               key={day.day}
               onClick={() => setActiveDay(day.day)}
               className={`w-full flex items-center gap-4 p-5 rounded-3xl transition-all border-2 text-left ${
                 activeDay === day.day 
                   ? 'bg-indigo-600 border-indigo-700 text-white shadow-lg shadow-indigo-100' 
                   : 'bg-white border-transparent text-gray-500 hover:bg-indigo-50 hover:border-indigo-100'
               }`}
             >
               <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 transition-colors ${activeDay === day.day ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'}`}>
                 {day.day}
               </span>
               <div className="flex-1 min-w-0">
                  <div className={`font-bold text-sm truncate ${activeDay === day.day ? 'text-white' : 'text-gray-900'}`}>{day.topic}</div>
                  <div className={`text-[10px] font-bold uppercase tracking-tight mt-0.5 ${activeDay === day.day ? 'text-white/60' : 'text-gray-400'}`}>Session {day.day}</div>
               </div>
               <ChevronRight size={18} className={activeDay === day.day ? 'text-white' : 'text-gray-200'} />
             </button>
           ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-8 animate-fade-in-up">
           {schedule.map((day) => (
             day.day === activeDay && (
               <div key={day.day} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 md:p-12 h-full">
                  <div className="flex items-center gap-4 mb-8">
                     <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl shadow-sm">
                        {day.day}
                     </div>
                     <div>
                        <h4 className="text-2xl font-black text-gray-900 leading-tight">{day.topic}</h4>
                        <p className="text-sm font-medium text-gray-500">Day {day.day} Breakdown</p>
                     </div>
                  </div>

                  <div className="space-y-10">
                     <div>
                        <h5 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                           <Target size={14} /> Core Objective
                        </h5>
                        <div className="text-lg text-gray-700 leading-relaxed font-medium bg-gray-50 p-6 rounded-3xl border border-gray-100">
                           <LatexRenderer>{day.objective}</LatexRenderer>
                        </div>
                     </div>

                     <div>
                        <h5 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                           <CheckSquare size={14} /> Actionable Tasks
                        </h5>
                        <div className="grid gap-3">
                           {day.tasks.map((task, idx) => (
                             <div key={idx} className="flex gap-4 p-5 bg-white border border-gray-100 rounded-2xl hover:border-indigo-200 transition-all group">
                                <div className="w-6 h-6 rounded-lg border-2 border-indigo-100 bg-white group-hover:bg-indigo-50 transition-colors shrink-0 mt-0.5" />
                                <span className="text-gray-700 font-medium leading-relaxed flex-1">
                                   <LatexRenderer inline>{task}</LatexRenderer>
                                </span>
                             </div>
                           ))}
                        </div>
                     </div>

                     {day.resources && day.resources.length > 0 && (
                        <div>
                           <h5 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                              <BookOpen size={14} /> Suggested Resources
                           </h5>
                           <div className="flex flex-wrap gap-2">
                              {day.resources.map((res, idx) => (
                                <span key={idx} className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-xs font-bold border border-indigo-100 flex items-center gap-2">
                                   <div className="w-1 h-1 bg-indigo-400 rounded-full" /> {res}
                                </span>
                              ))}
                           </div>
                        </div>
                     )}
                  </div>
               </div>
             )
           ))}
        </div>
      </div>
    </div>
  );
};

export default StudyPlanDisplay;
