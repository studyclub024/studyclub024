
import React from 'react';
import { ArrowLeft, Shield, Eye, Lock, Trash2, Cookie, Share2, Info, Users, Globe, Mail, MapPin, Zap } from 'lucide-react';

const Privacy: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
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
              <Eye size={32} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
              Privacy Policy
            </h1>
            <div className="flex items-center gap-2 text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">
              <span className="theme-text">Safety Protocol</span>
              <span>•</span>
              <span>Last Updated: January 1, 2026</span>
            </div>
          </header>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-12">
            <section className="bg-indigo-50/50 dark:bg-indigo-900/10 p-8 rounded-3xl border border-indigo-100 dark:border-indigo-900/20">
              <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed m-0 text-lg">
                Welcome to Study Club 24 (“we”, “us”, “our”). This Privacy Policy explains how we collect, use, share and protect your personal information when you access our website, mobile app, and services (“Services”). By using our Services, you agree to the collection and use of information in accordance with this policy.
              </p>
            </section>

            <div className="space-y-16">
              {/* 1. Information Collection */}
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl theme-bg text-white flex items-center justify-center shadow-lg theme-glow">
                    <Info size={24} />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white m-0 uppercase tracking-tight">1. Information We Collect</h2>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border-2 border-dashed theme-border mb-8">
                  <p className="m-0 text-slate-600 dark:text-slate-300 font-bold flex items-center gap-3">
                    <Trash2 className="theme-text" size={20} />
                    Auto-Deletion: All uploaded content is deleted immediately after your session ends.
                  </p>
                </div>

                <div className="grid gap-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-black text-slate-800 dark:text-slate-200 uppercase tracking-wide flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full theme-bg" /> 1.1 Information You Provide
                    </h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                      {[
                        'Name, email and contact details',
                        'Payment and billing via secure partners',
                        'Service content (Notes, PDFs, Text)',
                        'Correspondence and feedback'
                      ].map(item => (
                        <li key={item} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-white/5 text-sm font-medium text-slate-600 dark:text-slate-400">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-black text-slate-800 dark:text-slate-200 uppercase tracking-wide flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full theme-bg" /> 1.2 Automated Data
                    </h3>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl space-y-3">
                      <p className="text-sm text-slate-600 dark:text-slate-400 m-0">We collect device type, OS, IP address, geolocation (approximate), and usage analytics to troubleshooting and personalise your experience.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-black text-slate-800 dark:text-slate-200 uppercase tracking-wide flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full theme-bg" /> 1.3 Cookies
                    </h3>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl flex items-start gap-4">
                      <Cookie className="theme-text shrink-0" size={24} />
                      <p className="text-sm text-slate-600 dark:text-slate-400 m-0 leading-relaxed">We use essential cookies to enable platform functionality and performance analytics. You can disable non-essential cookies via browser settings.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 2. Usage */}
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl theme-bg text-white flex items-center justify-center shadow-lg theme-glow">
                    <Zap size={24} />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white m-0 uppercase tracking-tight">2. How We Use Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { title: 'Service Delivery', desc: 'Process summaries, flashcards, quizzes and manage accounts.' },
                    { title: 'Communication', desc: 'Send transactional alerts and respond to support requests.' },
                    { title: 'Improvement', desc: 'Quality analysis and diagnosing technical bottlenecks.' },
                    { title: 'Legal & Safety', desc: 'Comply with regulations and respond to harmful activity.' }
                  ].map(spec => (
                    <div key={spec.title} className="p-6 bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-sm">
                      <h4 className="text-sm font-black theme-text uppercase tracking-widest mb-2">{spec.title}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 m-0 leading-relaxed">{spec.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* 3. Sharing */}
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl theme-bg text-white flex items-center justify-center shadow-lg theme-glow">
                    <Share2 size={24} />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white m-0 uppercase tracking-tight">3. Sharing Information</h2>
                </div>
                <div className="space-y-6">
                  <div className="flex gap-4 items-start">
                    <div className="bg-theme-soft p-3 rounded-xl theme-text font-black text-xs uppercase">3.1</div>
                    <div>
                      <h4 className="font-black text-slate-800 dark:text-slate-200 mt-0">Service Providers</h4>
                      <p className="text-sm text-slate-500 m-0">Partners like payment processors and cloud hosting who are legally bound to protect your data.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="bg-theme-soft p-3 rounded-xl theme-text font-black text-xs uppercase">3.2</div>
                    <div>
                      <h4 className="font-black text-slate-800 dark:text-slate-200 mt-0">Legal Authorities</h4>
                      <p className="text-sm text-slate-500 m-0">Only when required by court order, law, or to protect the safety of our users.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 4. Storage */}
              <section className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform">
                  <Trash2 size={120} />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-theme-soft theme-text flex items-center justify-center">
                      <Lock size={20} />
                    </div>
                    <h2 className="text-xl font-black uppercase tracking-tight m-0">4. Retention & Deletion</h2>
                  </div>
                  <p className="text-slate-400 font-medium leading-relaxed max-w-2xl">
                    We do not store study materials permanently. Personal info like account data is kept only as long as necessary. If you request deletion, we take commercially reasonable steps to purge data instantly.
                  </p>
                </div>
              </section>

              {/* Footer Sections Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4 p-8 bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-sm">
                  <Users className="theme-text" size={28} />
                  <h3 className="text-lg font-black text-slate-900 dark:text-white m-0 uppercase tracking-tight">6. Children</h3>
                  <p className="text-sm text-slate-500 m-0">Not intended for children under 16. We do not knowingly collect data from minors.</p>
                </div>
                <div className="space-y-4 p-8 bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-sm">
                  <Globe className="theme-text" size={28} />
                  <h3 className="text-lg font-black text-slate-900 dark:text-white m-0 uppercase tracking-tight">7. Third Parties</h3>
                  <p className="text-sm text-slate-500 m-0">Our services may link to 3rd parties like Google Analytics. Review their policies as we aren't responsible for them.</p>
                </div>
              </div>

              {/* Contact Card */}
              <section className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-8 uppercase tracking-tight">9. Contact Us</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm"><Mail className="theme-text" size={20} /></div>
                    <div className="text-sm font-black text-slate-600 dark:text-slate-400 truncate">Email StudyClub24 Support</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm"><MapPin className="theme-text" size={20} /></div>
                    <div className="text-sm font-black text-slate-600 dark:text-slate-400">Headquarters, India</div>
                  </div>
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
