import React from 'react';
import { Shield, Check, Zap } from 'lucide-react';

type FooterProps = {
  onOpenLegal?: (section: 'privacy' | 'terms' | 'contact' | 'refund' | 'coppa') => void;
};

const Footer: React.FC<FooterProps> = ({ onOpenLegal }) => {
  return (
    <footer className="bg-white dark:bg-slate-900 py-8 border-t border-gray-100 dark:border-slate-800 mt-auto">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <img src="/studyclub-logo.png" alt="StudyClub24 Logo" className="h-10 w-auto object-contain" />
        </div>

        <div className="flex flex-wrap gap-4 md:gap-6 text-sm text-gray-500 dark:text-slate-400 justify-center">
          <button onClick={() => onOpenLegal && onOpenLegal('privacy')} className="hover:text-indigo-600 dark:hover:text-indigo-400">Privacy Policy</button>
          <button onClick={() => onOpenLegal && onOpenLegal('terms')} className="hover:text-indigo-600 dark:hover:text-indigo-400">Terms & Conditions</button>
          <button onClick={() => onOpenLegal && onOpenLegal('coppa')} className="hover:text-indigo-600 dark:hover:text-indigo-400">COPPA Notice</button>
          <button onClick={() => onOpenLegal && onOpenLegal('refund')} className="hover:text-indigo-600 dark:hover:text-indigo-400">Payment Policy</button>
          <button onClick={() => onOpenLegal && onOpenLegal('contact')} className="hover:text-indigo-600 dark:hover:text-indigo-400">Contact</button>
        </div>

        <div className="text-xs text-gray-400 dark:text-slate-500">© {new Date().getFullYear()} StudyClub24 AI. All Rights Reserved.</div>
      </div>
    </footer>
  );
};

export default Footer;
