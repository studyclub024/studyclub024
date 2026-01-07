
import React from 'react';
import { StudyMode } from '../../types';
import { MODE_CONFIG } from '../../constants';
import * as Icons from 'lucide-react';
import { FootballIcon } from '../../App';

interface ModeSelectorProps {
  selectedMode: string | null;
  onSelectMode: (mode: any) => void;
  disabled?: boolean;
  loadingMode?: string | null;
  cachedModes?: string[];
  config?: Record<string, { label: string; description: string; icon: string; gradient?: string; shadow?: string; textColor?: string }>;
  cols?: number;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ 
  selectedMode, 
  onSelectMode, 
  disabled, 
  loadingMode, 
  cachedModes,
  config = MODE_CONFIG,
  cols = 3
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${cols} gap-6 mb-8`}>
      {Object.keys(config).map((mode) => {
        const itemConfig = config[mode];
        const IconComponent = (Icons as any)[itemConfig.icon] || Icons.HelpCircle;
        const isSelected = selectedMode === mode;
        const isLoading = loadingMode === mode;
        const isCached = cachedModes?.includes(mode);

        let containerClass = "relative flex items-center gap-4 p-5 rounded-[2rem] transition-all duration-300 group text-left overflow-hidden ";
        
        if (disabled) {
           containerClass += "bg-white/50 dark:bg-slate-900/50 border border-white dark:border-white/5 opacity-60 cursor-not-allowed grayscale ";
        } else if (isSelected) {
           containerClass += "ring-4 ring-indigo-500/30 scale-[1.03] shadow-2xl ";
        } else {
           containerClass += "hover:scale-[1.02] hover:shadow-xl cursor-pointer ";
        }

        const gradientClass = `bg-gradient-to-br ${itemConfig.gradient || 'from-gray-400 to-gray-600'}`;

        return (
          <button
            key={mode}
            onClick={() => !disabled && onSelectMode(mode)}
            disabled={disabled}
            className={`${containerClass} ${gradientClass} border border-white/40 dark:border-white/10 backdrop-blur-md`}
            type="button"
          >
            <div className="absolute inset-0 bg-white/10 dark:bg-black/20 pointer-events-none group-hover:bg-white/20 transition-colors" />
            
            <div className="relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 bg-white/20 border border-white/30 dark:border-white/10 shadow-inner backdrop-blur-sm">
              <IconComponent size={32} strokeWidth={2} className="text-white drop-shadow-md" />
            </div>
            
            <div className="relative z-10 flex-1 min-w-0">
              <div className="font-black text-xl mb-0.5 truncate text-white tracking-tight">
                {itemConfig.label}
              </div>
              <div className="text-[11px] text-white/70 font-bold uppercase tracking-widest truncate">
                {itemConfig.description}
              </div>
            </div>
            
            <div className="relative z-10">
                {isLoading ? (
                <div className="text-white">
                    <FootballIcon size={24} />
                </div>
                ) : isCached && !isSelected && !disabled ? (
                    <div className="text-white/80">
                        <Icons.CheckCircle2 size={20} />
                    </div>
                ) : isSelected ? (
                    <div className="text-white">
                        <Icons.Sparkles size={20} className="animate-pulse" />
                    </div>
                ) : null}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ModeSelector;
