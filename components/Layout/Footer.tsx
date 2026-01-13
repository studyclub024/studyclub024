import React from 'react';
import { GraduationCap, Shield, Check, Zap } from 'lucide-react';

type FooterProps = {
  onOpenLegal?: (section: 'privacy' | 'terms' | 'contact') => void;
};

const Footer: React.FC<FooterProps> = ({ onOpenLegal }) => {
  return (
    <footer className="bg-white dark:bg-slate-900 py-8 border-t border-gray-100 dark:border-slate-800 mt-auto">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="bg-gray-100 dark:bg-slate-800 p-2 rounded-lg text-gray-400 dark:text-slate-400"><GraduationCap size={18} /></div>
          <span className="font-black text-gray-900 dark:text-white">StudyClub24</span>
        </div>

        <div className="flex gap-6 text-sm text-gray-500 dark:text-slate-400">
          <button onClick={() => onOpenLegal && onOpenLegal('privacy')} className="hover:text-indigo-600 dark:hover:text-indigo-400">Privacy</button>
          <button onClick={() => onOpenLegal && onOpenLegal('terms')} className="hover:text-indigo-600 dark:hover:text-indigo-400">Terms</button>
          <button onClick={() => onOpenLegal && onOpenLegal('contact')} className="hover:text-indigo-600 dark:hover:text-indigo-400">Contact</button>
        </div>

        <div className="text-xs text-gray-400 dark:text-slate-500">© {new Date().getFullYear()} StudyClub24 AI. All Rights Reserved.</div>
      </div>
    </footer>
  );
};

export default Footer;
