
import React from 'react';
import { ArrowLeft, Mail, Phone, MapPin, MessageSquare, Send } from 'lucide-react';

const Contact: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="mb-8 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:theme-text transition-all flex items-center gap-2 shadow-sm"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-bold uppercase tracking-widest">Back</span>
        </button>

        <div className="bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-white/5 flex flex-col md:flex-row items-stretch">

          {/* Left Side: Details */}
          <div className="flex-1 p-8 md:p-16 lg:p-20 space-y-10">
            <header>
              <div className="inline-flex p-3 theme-bg-soft theme-text rounded-2xl mb-6 shadow-sm">
                <MessageSquare size={32} />
              </div>
              <h1 className="text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-6 uppercase">
                Contact Us
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed max-w-md">
                Have a question or need technical support? Our academic success team is here to help you 24/7.
              </p>
            </header>

            <div className="grid gap-8">
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center theme-text group-hover:theme-bg group-hover:text-white transition-all shadow-sm">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black theme-text uppercase tracking-widest mb-1">Email Support</h4>
                  <p className="text-slate-900 dark:text-white font-bold tracking-tight">info@studyclub24.com</p>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center theme-text group-hover:theme-bg group-hover:text-white transition-all shadow-sm">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black theme-text uppercase tracking-widest mb-1">Quick Call</h4>
                  <p className="text-slate-900 dark:text-white font-bold tracking-tight">+91 73850 52289</p>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center theme-text group-hover:theme-bg group-hover:text-white transition-all shadow-sm">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black theme-text uppercase tracking-widest mb-1">Our Location</h4>
                  <p className="text-slate-900 dark:text-white font-bold tracking-tight leading-snug">
                    Dubey Layout, Plot no 20/A, Nagpur,<br />
                    Maharashtra, 440036 IN
                  </p>
                </div>
              </div>
            </div>

            <button className="theme-bg text-white px-10 py-5 rounded-2xl font-black uppercase text-sm tracking-widest shadow-xl shadow-theme/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
              Know More <Send size={18} />
            </button>
          </div>

          {/* Right Side: Image/Illustration */}
          <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center p-8 md:p-12 lg:p-20 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-theme/5 to-transparent pointer-events-none" />
            <div className="relative z-10 w-full max-w-lg aspect-square">
              <img
                src="C:/Users/Sansari/.gemini/antigravity/brain/91888cf1-1ed4-4c98-9d7a-73fc853a2d28/contact_support_illustration_1768473725051.png"
                alt="Contact Support Illustration"
                className="w-full h-full object-contain animate-float"
              />
            </div>

            {/* Decorative blobs matching the illustration vibe */}
            <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 left-1/4 w-40 h-40 bg-theme/10 rounded-full blur-3xl" />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
