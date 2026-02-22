import React from 'react';
import { Moon, Sun } from 'lucide-react';

type PublicHeaderProps = {
    isDarkMode: boolean;
    onToggleDarkMode: () => void;
    isLoggedIn: boolean;
    onLogin: () => void;
    onGetStarted: () => void;
    onLogoClick: () => void;
    onNavigateSection?: (sectionId: string) => void;
};

const PublicHeader: React.FC<PublicHeaderProps> = ({
    isDarkMode,
    onToggleDarkMode,
    isLoggedIn,
    onLogin,
    onGetStarted,
    onLogoClick,
    onNavigateSection
}) => {
    const handleSectionClick = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        if (onNavigateSection) {
            onNavigateSection(id);
        } else {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <nav className="fixed top-0 w-full z-[1000] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 py-4 transition-colors duration-300">
            <div className="container mx-auto px-6 flex items-center justify-between">
                <div className="flex items-center gap-3 cursor-pointer" onClick={onLogoClick}>
                    <img src="/studyclub-logo.png" alt="StudyClub24" className="h-12 w-auto object-contain" />
                </div>

                <div className="hidden md:flex items-center gap-10">
                    <a href="#about" onClick={(e) => handleSectionClick(e, 'about')} className="text-sm font-black uppercase tracking-wide text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all">About</a>
                    <a href="#features" onClick={(e) => handleSectionClick(e, 'features')} className="text-sm font-black uppercase tracking-wide text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all">Our Features</a>
                    <a href="#impact" onClick={(e) => handleSectionClick(e, 'impact')} className="text-sm font-black uppercase tracking-wide text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all">Feedbacks</a>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={onToggleDarkMode}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                        aria-label="Toggle theme"
                    >
                        {isDarkMode ? <Moon size={20} className="text-gray-700 dark:text-gray-300" /> : <Sun size={20} className="text-gray-700" />}
                    </button>
                    {!isLoggedIn ? (
                        <>
                            <button onClick={onLogin} className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Login</button>
                            <button onClick={onGetStarted} className="px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-bold shadow-md hover:bg-indigo-700 transition-all">Sign up</button>
                        </>
                    ) : (
                        <button onClick={onGetStarted} className="px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-bold shadow-md hover:bg-indigo-700 transition-all">Workspace</button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default PublicHeader;
