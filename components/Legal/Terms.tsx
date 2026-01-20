
import React from 'react';
import { ArrowLeft, Shield, Scroll, CheckCircle2 } from 'lucide-react';

const Terms: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="mb-8 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:theme-text transition-all flex items-center gap-2 shadow-sm"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-bold uppercase tracking-widest">Back</span>
        </button>

        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-16 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-white/5">
          <header className="mb-12">
            <div className="inline-flex p-3 theme-bg-soft theme-text rounded-2xl mb-6 shadow-sm">
              <Scroll size={32} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
              Terms & Conditions
            </h1>
            <div className="flex items-center gap-2 text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">
              <span className="theme-text">Study Club 24 Protocol</span>
              <span>•</span>
              <span>Last Updated: January 1, 2026</span>
            </div>
          </header>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-10">
            <section className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-white/5">
              <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed m-0">
                Welcome to Study Club 24 (“Platform”, “we”, “us”, “our”). By accessing or using our website, mobile app, or services (“Services”), you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our Services.
              </p>
            </section>

            <div className="grid gap-10">
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg theme-bg text-white flex items-center justify-center font-black">1</div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white m-0 uppercase tracking-tight">Eligibility</h2>
                </div>
                <ul className="list-none p-0 space-y-3">
                  <li className="flex gap-3 text-slate-600 dark:text-slate-400">
                    <CheckCircle2 size={18} className="theme-text shrink-0 mt-0.5" />
                    <span>You must be at least 14 years of age to use our Services.</span>
                  </li>
                  <li className="flex gap-3 text-slate-600 dark:text-slate-400">
                    <CheckCircle2 size={18} className="theme-text shrink-0 mt-0.5" />
                    <span>If you are under 18, you confirm that you have parental or guardian consent.</span>
                  </li>
                </ul>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg theme-bg text-white flex items-center justify-center font-black">2</div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white m-0 uppercase tracking-tight">Description of Services</h2>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">Study Club 24 provides tools that help students:</p>
                <ul className="list-none p-0 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {['Generate flashcards', 'Create summaries', 'Extract topics', 'Generate quizzes/tests', 'And many more educational services'].map((item) => (
                    <li key={item} className="flex gap-3 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                      <CheckCircle2 size={18} className="theme-text shrink-0" />
                      <span className="font-bold text-xs uppercase tracking-wider">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-sm font-bold theme-text uppercase tracking-widest bg-theme-soft p-4 rounded-2xl border theme-border">
                  Uploaded content is processed only for the current session and deleted after use.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg theme-bg text-white flex items-center justify-center font-black">3</div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white m-0 uppercase tracking-tight">User Responsibilities</h2>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">You agree:</p>
                <ul className="list-none p-0 space-y-4">
                  {[
                    'To use the Service only for lawful, educational purposes',
                    'Not to upload illegal, harmful, copyrighted, or abusive content',
                    'Not to misuse, reverse-engineer, or overload the platform'
                  ].map((item) => (
                    <li key={item} className="flex gap-4 text-slate-600 dark:text-slate-400 items-start">
                      <Shield size={20} className="theme-text shrink-0 mt-1" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm italic text-slate-500">We reserve the right to suspend or terminate access for misuse.</p>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section className="bg-slate-50 dark:bg-slate-800/30 p-6 rounded-[2rem] border border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg theme-bg text-white flex items-center justify-center font-black text-xs">4</div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white m-0 uppercase tracking-tight">Account & Access</h2>
                  </div>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-2">
                    <li>Maintain account confidentiality</li>
                    <li>responsibility for all account activity</li>
                    <li>No liability for unauthorized use</li>
                  </ul>
                </section>

                <section className="bg-slate-50 dark:bg-slate-800/30 p-6 rounded-[2rem] border border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg theme-bg text-white flex items-center justify-center font-black text-xs">5</div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white m-0 uppercase tracking-tight">Intellectual Property</h2>
                  </div>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-2">
                    <li>Platform branding belongs to us</li>
                    <li>You retain ownership of uploaded content</li>
                    <li>We don't claim ownership of study materials</li>
                  </ul>
                </section>
              </div>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg theme-bg text-white flex items-center justify-center font-black">6</div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white m-0 uppercase tracking-tight">Subscription & Pricing</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['Clear Transparent Pricing', 'Daily/Weekly/Yearly Plans', 'Prior Notice for Updates'].map(item => (
                    <div key={item} className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-center text-[10px] font-black uppercase tracking-widest">{item}</div>
                  ))}
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg theme-bg text-white flex items-center justify-center font-black">7</div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white m-0 uppercase tracking-tight">Service Availability</h2>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  We aim for high availability but do not guarantee uninterrupted access. Services may be temporarily unavailable due to maintenance or technical issues.
                </p>
              </section>

              <section className="bg-red-50 dark:bg-red-900/10 p-8 rounded-[2rem] border border-red-100 dark:border-red-900/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-black">8</div>
                  <h2 className="text-xl font-black text-red-900 dark:text-red-400 m-0 uppercase tracking-tight">Limitation of Liability</h2>
                </div>
                <p className="text-red-800 dark:text-red-300 font-bold mb-4">Study Club 24 is provided on an “as-is” basis. We are not responsible for:</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {['Academic outcomes', 'Exam results', 'Misinterpretation'].map(item => (
                    <div key={item} className="px-4 py-2 bg-white/50 dark:bg-red-950/20 rounded-xl text-red-700 dark:text-red-400 text-xs font-black uppercase tracking-widest">{item}</div>
                  ))}
                </div>
                <p className="text-red-600 dark:text-red-400 text-sm italic font-medium">Use the platform as a study aid, not as a sole source of learning.</p>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg theme-bg text-white flex items-center justify-center font-black text-xs">9</div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white m-0 uppercase tracking-tight">Termination</h2>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Violation of terms, platform misuse, or legal requirements may result in access termination.</p>
                </section>

                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg theme-bg text-white flex items-center justify-center font-black text-xs">10</div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white m-0 uppercase tracking-tight">Governing Law</h2>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-bold">Laws of India • Exclusive Jurisdiction: Indian Courts</p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
