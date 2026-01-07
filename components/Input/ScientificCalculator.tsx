import React, { useState } from 'react';
import { Send, Delete, Grid } from 'lucide-react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSolve: (method?: string) => void;
  disabled: boolean;
  extraButtons?: React.ReactNode;
}

type Tab = 'Algebra' | 'Trigonometry' | 'Calculus';

const ScientificCalculator: React.FC<Props> = ({ value, onChange, onSolve, disabled, extraButtons }) => {
  const [activeTab, setActiveTab] = useState<Tab>('Algebra');

  const insert = (text: string) => {
    onChange(value + text);
  };

  const backspace = () => {
    onChange(value.slice(0, -1));
  };

  const clear = () => {
    onChange('');
  };

  const renderButton = (label: React.ReactNode, action?: () => void, primary?: boolean, valueToInsert?: string) => (
    <button
      onClick={action ? action : () => insert(valueToInsert || label as string)}
      disabled={disabled}
      className={`
        rounded-xl p-3 text-sm md:text-lg font-black transition-all shadow-sm active:scale-95 border flex items-center justify-center uppercase tracking-tighter
        ${primary 
            ? 'theme-bg text-white border-white/20 hover:opacity-90 shadow-theme-soft' 
            : 'bg-white text-gray-700 dark:text-white theme-border hover:theme-bg-soft'
        }
        ${label === '=' ? 'theme-bg-soft theme-text border-2 theme-border' : ''}
      `}
    >
      {label}
    </button>
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border theme-border overflow-hidden transition-all duration-700 theme-glow">
      {/* 1. Display Area */}
      <div className="theme-bg-soft p-6 md:p-8 border-b theme-border relative">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-black theme-text uppercase tracking-[0.2em] opacity-80">Symbolic Input Interface</span>
            <div className="flex gap-2">
                {extraButtons}
            </div>
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSolve()}
            placeholder="Enter equation (e.g. 4x² - 5x - 12 = 0)"
            className="w-full bg-transparent text-2xl md:text-4xl font-black text-gray-800 dark:text-white outline-none placeholder-gray-300 dark:placeholder-slate-700 font-sans tracking-tight"
            disabled={disabled}
            autoComplete="off"
          />
      </div>

      {/* 2. Tabs */}
      <div className="flex border-b theme-border">
        {(['Algebra', 'Trigonometry', 'Calculus'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.15em] transition-all ${activeTab === tab ? 'bg-white dark:bg-slate-800 theme-text border-b-4 theme-border' : 'theme-bg-soft text-gray-400 hover:text-gray-600 dark:hover:text-slate-300'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 3. Keypad */}
      <div className="p-4 md:p-6 bg-gray-50/50 dark:bg-slate-950/50">
        <div className="grid grid-cols-5 gap-2 md:gap-3">
           {/* Context Specific Keys */}
           {activeTab === 'Algebra' && (
              <>
                 {renderButton(<span className="text-xs">x²</span>, undefined, false, '^2')}
                 {renderButton('√')}
                 {renderButton('(')}
                 {renderButton(')')}
                 <button onClick={backspace} className="bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white rounded-xl p-3 flex items-center justify-center transition-all"><Delete size={20} /></button>
                 
                 {renderButton('^')}
                 {renderButton('log')}
                 {renderButton('ln')}
                 {renderButton('/')}
                 <button onClick={clear} className="bg-gray-200 dark:bg-slate-800 text-gray-600 dark:text-slate-400 border theme-border hover:bg-gray-300 dark:hover:bg-slate-700 rounded-xl p-3 font-black text-[10px] uppercase">AC</button>
              </>
           )}

           {activeTab === 'Trigonometry' && (
              <>
                 {renderButton('sin')}
                 {renderButton('cos')}
                 {renderButton('tan')}
                 {renderButton('(')}
                 <button onClick={backspace} className="bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white rounded-xl p-3 flex items-center justify-center transition-all"><Delete size={20} /></button>

                 {renderButton('asin')}
                 {renderButton('acos')}
                 {renderButton('atan')}
                 {renderButton('π')}
                 <button onClick={clear} className="bg-gray-200 dark:bg-slate-800 text-gray-600 dark:text-slate-400 border theme-border hover:bg-gray-300 dark:hover:bg-slate-700 rounded-xl p-3 font-black text-[10px] uppercase">AC</button>
              </>
           )}

           {activeTab === 'Calculus' && (
              <>
                 {renderButton('d/dx')}
                 {renderButton('∫')}
                 {renderButton('lim')}
                 {renderButton('∑')}
                 <button onClick={backspace} className="bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white rounded-xl p-3 flex items-center justify-center transition-all"><Delete size={20} /></button>

                 {renderButton('∞')}
                 {renderButton(<span className="italic font-serif">e</span>, undefined, false, 'e')}
                 {renderButton('dt')}
                 {renderButton('dx')}
                 <button onClick={clear} className="bg-gray-200 dark:bg-slate-800 text-gray-600 dark:text-slate-400 border theme-border hover:bg-gray-300 dark:hover:bg-slate-700 rounded-xl p-3 font-black text-[10px] uppercase">AC</button>
              </>
           )}

           {/* Generic Numeric Keypad */}
           {renderButton('7')}
           {renderButton('8')}
           {renderButton('9')}
           {renderButton('×', undefined, false, '*')}
           {renderButton(<span className="italic font-serif">x</span>, undefined, false, 'x')} 

           {renderButton('4')}
           {renderButton('5')}
           {renderButton('6')}
           {renderButton('-')}
           {renderButton(<span className="italic font-serif">y</span>, undefined, false, 'y')}

           {renderButton('1')}
           {renderButton('2')}
           {renderButton('3')}
           {renderButton('+')}
           {renderButton('=', undefined, false)}

           {renderButton('0')}
           {renderButton('.')}
           <button 
             onClick={() => onSolve('GRAPHICAL_ANALYSIS')} 
             disabled={disabled || !value.trim()}
             title="Plot Equation"
             className="theme-bg-soft theme-text border theme-border hover:bg-white dark:hover:bg-slate-800 rounded-xl p-3 flex items-center justify-center transition-all shadow-sm group"
           >
             <Grid size={20} className="group-hover:scale-110 transition-transform" />
           </button>
           {renderButton('<')}
           
           <button 
             onClick={() => onSolve()} 
             disabled={disabled || !value.trim()}
             title="Solve Equation"
             className="theme-bg text-white border-white/20 hover:opacity-90 rounded-xl p-3 flex items-center justify-center shadow-xl shadow-theme-soft disabled:opacity-50 active:scale-90 transition-all"
           >
             <Send size={20} />
           </button>
        </div>
      </div>
    </div>
  );
};

export default ScientificCalculator;