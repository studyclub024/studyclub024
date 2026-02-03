import React, { useState, useRef, useEffect } from 'react';
import { GraduationCap, Rocket, ArrowRight, Layers, Calculator, Languages, Brain, Globe, Shield, Zap, Star, Trophy, Crown, Check, FileText, X } from 'lucide-react';
import ModeSelector from './Input/ModeSelector';
import Footer from './Layout/Footer';
import { PLANS, ALL_FEATURES, PLAN_FEATURES_MAP } from './Subscription/SubscriptionScreen';
import { MODE_CONFIG } from '../constants';
import { StudyMode } from '../types';

// All features comparison list


type HomepageProps = {
  onOpenAuth?: () => void;
  onGetStarted?: () => void;
  onOpenUpgrade?: () => void;
  onOpenSelectMode?: (mode: string) => void;
  isLoggedIn?: boolean;
  onOpenLegal?: (section: 'privacy' | 'terms' | 'contact' | 'refund') => void;
};

const FeatureCard: React.FC<{
  icon: React.ElementType;
  title: string;
  desc: string;
  color?: string;
  bg?: string;
  descColor?: string;
}> = ({ icon: Icon, title, desc, color = 'text-indigo-600', bg = 'bg-indigo-50', descColor = 'text-gray-600' }) => (
  <div className={`rounded-2xl p-6 ${bg} shadow-sm border border-gray-50`}>
    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${color} bg-white/60`}> <Icon size={20} /> </div>
    <h4 className="font-black text-lg mb-2">{title}</h4>
    <p className={`text-sm ${descColor}`}>{desc}</p>
  </div>
);

const scrollToSection = (e: React.MouseEvent, id: string) => {
  e.preventDefault();
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const Homepage: React.FC<HomepageProps> = ({ onOpenAuth, onGetStarted, onOpenUpgrade, onOpenSelectMode, isLoggedIn = false, onOpenLegal }) => {
  // Preview demo states
  const [previewUsedOnce, setPreviewUsedOnce] = useState(false);
  const [previewFileName, setPreviewFileName] = useState<string>('');
  const [previewText, setPreviewText] = useState<string>('');
  const [previewStatus, setPreviewStatus] = useState<string>('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleLogin = () => {
    if (onOpenAuth) onOpenAuth();
    else alert('Open auth modal');
  };

  const handleGetStarted = () => {
    if (!isLoggedIn) {
      // If user is not logged in, open auth modal
      if (onOpenAuth) onOpenAuth();
      else alert('Please login to continue');
    } else {
      // If logged in, proceed to workspace
      if (onGetStarted) onGetStarted();
      else alert('Get started clicked');
    }
  };

  const handleUpgradePlan = (planId: string) => {
    if (!isLoggedIn) {
      // Store the plan and open auth
      setSelectedPlan(planId);
      if (onOpenAuth) onOpenAuth();
    } else {
      // User is logged in, proceed with upgrade
      if (onOpenUpgrade) onOpenUpgrade();
    }
  };

  // After successful login, trigger the upgrade flow
  useEffect(() => {
    if (isLoggedIn && selectedPlan) {
      // Open upgrade modal with the selected plan
      if (onOpenUpgrade) onOpenUpgrade();
      setSelectedPlan(null);
    }
  }, [isLoggedIn, selectedPlan, onOpenUpgrade]);

  // About section reveal
  const aboutRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!aboutRef.current) return;
    const items = Array.from(aboutRef.current.querySelectorAll('.reveal-item')) as HTMLElement[];
    if (!items.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const el = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          el.classList.add('translate-y-0', 'opacity-100');
          el.classList.remove('translate-y-6', 'opacity-0');
        }
      });
    }, { threshold: 0.2 });

    items.forEach((it) => observer.observe(it));
    return () => observer.disconnect();
  }, []);


  const handleDemo = () => {
    // Check if user is logged in first
    if (!isLoggedIn) {
      if (onOpenAuth) onOpenAuth();
      return;
    }
    if (previewUsedOnce) {
      handleGoToPricing();
      return;
    }
    setPreviewFileName('Demo Sample');
    setPreviewText('Demo 1-minute summary\n\nKey points:\n- This is a demo preview that highlights the main concepts.\n- Practice the example problems shown.\n- Review the summary to revise quickly.');
    setPreviewStatus('done');
    setPreviewOpen(true);
    setPreviewUsedOnce(true);
  };

  const handleStartUpload = () => {
    // Check if user is logged in first
    if (!isLoggedIn) {
      if (onOpenAuth) onOpenAuth();
      return;
    }
    if (previewUsedOnce) {
      handleGoToPricing();
      return;
    }
    fileInputRef.current?.click();
  };

  const handleGoToPricing = () => {
    const el = document.getElementById('pricing');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (typeof window !== 'undefined' && !(typeof onOpenUpgrade === 'function')) window.dispatchEvent(new CustomEvent('openUpgrade'));
    if (onOpenUpgrade) onOpenUpgrade();
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] font-sans overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900 flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-[1000] bg-white/80 backdrop-blur-xl border-b border-gray-100 py-4">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/studyclub-logo.jpg" alt="StudyClub24" className="h-12 w-auto object-contain" />
          </div>

          <div className="hidden md:flex items-center gap-10">
            <a href="#about" onClick={(e) => scrollToSection(e, 'about')} className="text-sm font-black uppercase tracking-wide text-gray-500 hover:text-indigo-600 transition-all">About</a>
            <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="text-sm font-black uppercase tracking-wide text-gray-500 hover:text-indigo-600 transition-all">Our Features</a>
            <a href="#pricing" onClick={(e) => scrollToSection(e, 'pricing')} className="text-sm font-black uppercase tracking-wide text-gray-500 hover:text-indigo-600 transition-all">Pricing</a>
            <a href="#impact" onClick={(e) => scrollToSection(e, 'impact')} className="text-sm font-black uppercase tracking-wide text-gray-500 hover:text-indigo-600 transition-all">Feedbacks</a>
          </div>

          <div className="flex items-center gap-4">
            {!isLoggedIn ? (
              <>
                <button onClick={handleLogin} className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-indigo-600 transition-colors">Login</button>
                <button onClick={handleGetStarted} className="px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-bold shadow-md hover:bg-indigo-700 transition-all">Sign up</button>
              </>
            ) : (
              <button onClick={handleGetStarted} className="px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-bold shadow-md hover:bg-indigo-700 transition-all">Workspace</button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero */}
        <section className="pt-28 pb-16 px-6">
          <div className="container mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wide mb-6">
              <Rocket size={14} /> The Next Evolution in Learning
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="text-left">
                <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">Built by a <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-600">Student.</span><br />For Students.</h1>
                <p className="mt-6 text-gray-600 max-w-xl">Long notes. Heavy syllabus. Zero clarity.
                  This tool was created to fix that.
                  Upload your notes or click a picture, and we help you turn them into:
                  flashcards, summaries, tests, study plans, and more.
                  <strong>Study better. Stress less. And enjoy learning.</strong>
                </p>

                <div className="mt-8 flex items-center gap-4">
                  <button onClick={handleLogin} className="inline-flex items-center gap-3 px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold shadow-lg hover:scale-105 transition-transform">Start Studying for Free <ArrowRight size={18} /></button>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <h3 className="font-black mb-4">Try a Smart Preview</h3>
                <div className="text-sm text-gray-600">Upload a study guide and get a 1-minute summary — optimized for quick revision.</div>
                <div className="mt-6 flex gap-3">
                  <button onClick={handleStartUpload} className="flex-1 py-3 bg-indigo-50 rounded-md font-bold text-indigo-700 inline-flex items-center justify-center gap-3">
                    <FileText size={16} /> Upload PDF
                  </button>
                  <button onClick={handleDemo} className="py-3 px-4 rounded-md border">Demo</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About - Our Story */}
        <section id="about" ref={aboutRef} className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-hidden">
          <div className="container mx-auto px-6">

            {/* Story Content - Full Width */}
            <div className="max-w-6xl mx-auto text-center">
              <p className="text-sm font-black uppercase tracking-[0.3em] text-orange-500 mb-4">How It Started</p>
              <h2 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight mb-8">
                Our Dream is <span className="text-indigo-600">Better Learning</span><br />For Every Student
              </h2>
              <div className="space-y-4 text-lg text-gray-700 leading-relaxed text-left mb-8">
                <p>This platform began with Shreya, a student who struggled with long notes, heavy syllabus, and the constant pressure to keep up. Studying felt confusing, revision felt endless, and no matter how much time she put in, clarity always felt missing.</p>
                <p>Instead of accepting this as "normal student life", she asked a simple question: <span className="font-bold text-gray-900">Why does studying have to be this hard?</span></p>
                <p>Shreya started researching better ways to learn, organize information, and revise effectively. She built a small tool for herself that could turn long notes into simpler formats, help her plan what to study next, and make learning feel lighter.</p>
                <p className="font-semibold text-gray-900">When it started helping her, she shared it with others. And it helped them too.</p>
                <p className="font-bold text-xl text-gray-900">That's when Study Club became something for every student who's ever felt stuck while studying.</p>
              </div>

              {/* Quote - Simple */}
              <div className="mt-12 pt-8 border-t-2 border-indigo-200">
                <p className="text-xl md:text-2xl italic text-gray-700 mb-4">
                  "I didn't build this to be perfect. I built it because I needed something that made studying feel less stressful."
                </p>
                <p className="text-base font-bold text-gray-900">— Shreya, Student & Founder</p>
              </div>
            </div>

          </div>
        </section>

        {/* What This Tool Does Section */}
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              {/* What This Tool Does */}
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">What This Tool Does</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">Everything you need to study smarter and perform better</p>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {/* Easy Notes */}
                <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center mb-4">
                    <FileText size={24} className="text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-3">Easy Notes</h3>
                  <p className="text-gray-600 mb-4">Upload a PDF or click a photo of handwritten notes.</p>
                  <p className="text-sm font-bold text-gray-700 mb-2">We turn long, messy content into:</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <Check size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Clean summaries</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Flashcards</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Quick revision notes</span>
                    </li>
                  </ul>
                  <p className="text-xs text-gray-500 mt-4 italic">No rewriting. No extra effort.</p>
                </div>

                {/* Study Roadmap */}
                <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center mb-4">
                    <Layers size={24} className="text-purple-600" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-3">Study Roadmap</h3>
                  <p className="text-gray-600 mb-4">Never ask "What should I study today?" again.</p>
                  <p className="text-sm font-bold text-gray-700 mb-2">Get a clear study path that:</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <Check size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Breaks the syllabus into steps</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Helps with revision planning</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Keeps you focused before exams</span>
                    </li>
                  </ul>
                  <p className="text-xs text-gray-500 mt-4 italic">One subject at a time. One step at a time.</p>
                </div>

                {/* Crash Courses */}
                <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                    <Rocket size={24} className="text-blue-600" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-3">Crash Courses</h3>
                  <p className="text-gray-600 mb-4">Short on time? We've got you.</p>
                  <p className="text-sm font-bold text-gray-700 mb-2">Ready-to-use crash courses designed for:</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <Check size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Fast understanding</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Quick revision</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Exam-focused preparation</span>
                    </li>
                  </ul>
                  <p className="text-xs text-gray-500 mt-4 italic">Perfect for last-minute confidence boosts.</p>
                </div>

                {/* Solve Math's */}
                <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center mb-4">
                    <Calculator size={24} className="text-green-600" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-3">Solve Math's</h3>
                  <p className="text-gray-600 mb-4">Just type your equation.</p>
                  <p className="text-sm font-bold text-gray-700 mb-2">We don't just give answers.</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <Check size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Explain how and why, step by step</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Visual problem breakdown</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Multiple approaches</span>
                    </li>
                  </ul>
                  <p className="text-xs text-gray-500 mt-4 italic">So maths actually makes sense.</p>
                </div>

                {/* Learn English */}
                <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center mb-4">
                    <Languages size={24} className="text-orange-600" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-3">Learn English</h3>
                  <p className="text-gray-600 mb-4">Improve your English without pressure.</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <Check size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Vocabulary building</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Sentence construction</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Better understanding</span>
                    </li>
                  </ul>
                  <p className="text-xs text-gray-500 mt-4 italic">Simple. Practical. No boring lessons.</p>
                </div>

                {/* Competitive Exams */}
                <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center mb-4">
                    <Trophy size={24} className="text-red-600" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-3">Competitive Exams</h3>
                  <p className="text-gray-600 mb-4">Built keeping Indian education in mind.</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <Check size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Board exams</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Competitive exams</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Heavy syllabus, limited time</span>
                    </li>
                  </ul>
                  <p className="text-xs text-gray-500 mt-4 italic">Structured learning that actually helps.</p>
                </div>
              </div>

              {/* Video Lectures & Themes Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Video Lectures */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border-2 border-indigo-200">
                  <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center mb-4">
                    <Brain size={24} className="text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-3">Video Lectures (Coming Soon)</h3>
                  <p className="text-gray-700 mb-3">Soon, your notes won't just be text.</p>
                  <p className="text-gray-600">They'll turn into video-style explanations so you can watch, listen, and revise anytime.</p>
                </div>

                {/* Student Favourite */}
                <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-8 border-2 border-pink-200">
                  <div className="w-12 h-12 rounded-lg bg-pink-100 flex items-center justify-center mb-4">
                    <Star size={24} className="text-pink-600" fill="currentColor" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-3">Student Favourite 💙</h3>
                  <p className="text-gray-700 mb-3">Who said studying has to be boring?</p>
                  <p className="text-sm font-bold text-gray-700 mb-2">Choose study themes like:</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <Check size={14} className="text-pink-600 flex-shrink-0 mt-0.5" />
                      <span>Game of Thrones</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={14} className="text-pink-600 flex-shrink-0 mt-0.5" />
                      <span>Money Heist</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check size={14} className="text-pink-600 flex-shrink-0 mt-0.5" />
                      <span>Lord of the Rings & More coming soon</span>
                    </li>
                  </ul>
                  <p className="text-xs text-gray-500 mt-4 italic">Because learning should feel fun too.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Result Protocols */}
        <section id="features" className="py-16">
          <div className="container mx-auto px-6">
            <div className="bg-gradient-to-r from-[#06102a] via-[#11214a] to-[#3b1260] rounded-2xl p-8 md:p-12 text-white overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

                {/* Left image/illustration */}
                <div className="rounded-2xl overflow-hidden flex items-center justify-center">
                  <div className="relative w-full rounded-2xl bg-gradient-to-br from-indigo-800 via-blue-700 to-pink-600 p-8 md:p-12 flex items-center justify-center" style={{ minHeight: 340 }}>
                    {/* Decorative ring + graduate illustration */}
                    <div className="relative flex items-center justify-center">
                      <div className="w-56 h-56 md:w-72 md:h-72 rounded-full bg-white/6 flex items-center justify-center">
                        <div className="text-6xl md:text-8xl">🎓</div>
                      </div>
                      <div className="absolute -left-12 -bottom-8 w-40 h-40 rounded-full bg-white/4 blur-3xl" />
                    </div>
                  </div>
                </div>

                {/* Right content */}
                <div>
                  <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-300 mb-3">Our Features</h2>
                  <h3 className="text-3xl md:text-4xl font-black mb-4">WHAT THIS TOOL DOES (Simple, Friendly)</h3>
                  <p className="text-gray-200 mb-6">Flashcards, Study Notes, Tests, Study Plans, Lesson Summary, Essay, Logical Explanations, & Explain the topic like you are 5 year old.</p>

                  <div className="mb-8">
                    <ModeSelector
                      selectedMode={null}
                      onSelectMode={(mode) => {
                        if (onOpenSelectMode) onOpenSelectMode(mode);
                        else { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('selectMode', { detail: mode })); }
                      }}
                      disabled={false}
                      loadingMode={null}
                      cachedModes={[]}
                      cols={2}
                      config={((): any => {
                        const order = [
                          StudyMode.FLASHCARDS,
                          StudyMode.NOTES,
                          StudyMode.QUIZ,
                          StudyMode.PLAN,
                          StudyMode.SUMMARY,
                          StudyMode.ESSAY,
                          StudyMode.ELI5,
                          StudyMode.DESCRIBE,
                          StudyMode.CHAT
                        ];
                        const cfg: Record<string, any> = {};
                        order.forEach((k) => { if ((MODE_CONFIG as any)[k]) cfg[k] = (MODE_CONFIG as any)[k]; });
                        return cfg;
                      })()}
                    />
                  </div>

                  <div className="mt-6 flex items-center gap-4">
                    <button onClick={() => { if (onGetStarted) onGetStarted(); }} className="px-6 py-3 bg-white text-indigo-800 rounded-full font-bold">Try it now</button>
                    <button onClick={handleGoToPricing} className="px-6 py-3 border border-white text-white rounded-full">Start free trial</button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Pricing (shared with Subscription modal) */}
        <section id="pricing" className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">The Membership</h2>
              <h3 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Flexible Plans for Every Learner</h3>
              <p className="text-gray-500 font-medium max-w-2xl mx-auto">Choose the protocol that matches your academic ambition. Unlock the full power of StudyClub24 today.</p>
            </div>

            <div className="flex flex-wrap justify-center gap-6">
              {PLANS.map((plan, idx) => (
                <div
                  key={plan.id}
                  className={`relative flex flex-col bg-white rounded-[2.5rem] p-8 border-2 transition-all hover:scale-[1.02] group w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(25%-1.5rem)] min-w-[280px] ${plan.isPopular ? 'border-indigo-600 shadow-2xl shadow-indigo-100 ring-4 ring-indigo-50' : 'border-gray-50 shadow-xl shadow-gray-100 hover:border-indigo-200'}`}
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                      Best Value
                    </div>
                  )}

                  <div className="mb-6">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center text-white mb-6 shadow-lg group-hover:rotate-6 transition-transform`}>
                      {plan.id === 'crash-course' && <Zap size={24} />}
                      {plan.id === 'instant-help' && <Shield size={24} />}
                      {plan.id === 'focused-prep' && <Trophy size={24} />}
                      {plan.id === 'study-pro' && <Crown size={24} />}
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-xs text-gray-400 font-medium leading-relaxed min-h-[3rem]">{plan.description}</p>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-gray-900">{plan.price}</span>
                      <span className="text-gray-400 font-bold text-sm">/{plan.period}</span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4 mb-8">
                    {plan.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex gap-3">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center">
                          <Check size={12} className="text-indigo-600" strokeWidth={3} />
                        </div>
                        <span className="text-xs font-bold text-gray-600 leading-tight">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleUpgradePlan(plan.id)}
                    className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 group/btn active:scale-95 ${plan.isPopular
                      ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 hover:-translate-y-1'
                      : 'bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-600 hover:text-white hover:shadow-xl hover:shadow-indigo-200 hover:-translate-y-1'
                      }`}
                  >
                    Upgrade Now <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              ))}
            </div>

            {/* Feature Comparison Table */}
            <div className="mt-20 mb-16">
              <h3 className="text-2xl font-black text-gray-900 text-center mb-12">Detailed Feature Comparison</h3>

              <div className="overflow-x-auto rounded-3xl border border-gray-200 bg-white">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-6 py-6 text-left text-sm font-black text-gray-900 bg-gray-50 min-w-[250px]">
                        Feature / Plan
                      </th>
                      {PLANS.map((plan) => (
                        <th key={plan.id} className="px-6 py-6 text-center text-xs font-black text-gray-900 bg-gray-50 min-w-[140px]">
                          <div className="text-sm">{plan.name}</div>
                          <div className="text-base mt-2">{plan.price}<span className="text-xs">/{plan.period}</span></div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ALL_FEATURES.map((feature, idx) => (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-bold text-gray-700">
                          {feature}
                        </td>
                        {PLANS.map((plan) => (
                          <td key={plan.id} className="px-6 py-4 text-center">
                            {PLAN_FEATURES_MAP[plan.id][feature] ? (
                              <div className="flex justify-center">
                                <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center">
                                  <Check size={16} className="text-green-600" strokeWidth={3} />
                                </div>
                              </div>
                            ) : (
                              <div className="flex justify-center">
                                <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center">
                                  <X size={16} className="text-red-600" strokeWidth={3} />
                                </div>
                              </div>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                    {/* Upgrade Now Buttons Row */}
                    <tr className="bg-gray-50">
                      <td className="px-6 py-6 text-sm font-black text-gray-900">
                        Choose Plan
                      </td>
                      {PLANS.map((plan) => (
                        <td key={plan.id} className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleUpgradePlan(plan.id)}
                            className={`w-full px-4 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 group/btn active:scale-95 ${plan.isPopular
                              ? 'bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-300 hover:-translate-y-1'
                              : 'bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-600 hover:text-white hover:shadow-xl hover:shadow-indigo-200 hover:-translate-y-1'
                              }`}
                          >
                            Upgrade Now
                            <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                          </button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-20 text-center space-y-6">
              <div className="flex flex-wrap justify-center gap-12 text-gray-400">
                <div className="flex items-center gap-2">
                  <Shield size={20} />
                  <span className="text-xs font-bold uppercase tracking-widest">Secure Activation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={20} />
                  <span className="text-xs font-bold uppercase tracking-widest">Instant Upgrade</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap size={20} />
                  <span className="text-xs font-bold uppercase tracking-widest">Cancel Anytime</span>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 font-medium">Pricing shown is in INR. Taxes may apply. By selecting a plan, you agree to our Terms of Protocol and Privacy Policy.</p>
            </div>
          </div>
        </section>

        {/* Why We Exist, By Students For Students, The Promise */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-6">
            {/* Section Header */}
            <div className="text-center mb-16">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-4">OUR VALUES</p>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Building the future of learning.</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">Made by students who understand the struggle. Designed for everyone who wants to learn better.</p>
            </div>

            {/* Three Staggered Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">

              {/* Card 01 - Why We Exist */}
              <div className="relative">
                <div className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow">
                  {/* Image/Icon Area */}
                  <div className="relative bg-gradient-to-br from-indigo-100 to-indigo-50 h-64 flex items-center justify-center">
                    <div className="text-7xl">🎯</div>
                    {/* Number Badge */}
                    <div className="absolute bottom-4 left-4 bg-gradient-to-br from-indigo-50 to-white rounded-2xl px-4 py-2">
                      <span className="text-2xl font-black text-gray-900">01</span>
                    </div>
                  </div>
                  {/* Content */}
                  <div className="p-8">
                    <h3 className="text-2xl font-black text-gray-900 mb-4">Why We Exist</h3>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">We exist because studying shouldn't feel overwhelming. Students don't fail because they don't work hard—they struggle because they don't have the right structure and tools.</p>
                    <div className="space-y-2 mb-4">
                      <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide">Our goal is to make learning:</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold">Clear</span>
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold">Organized</span>
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold">Less stressful</span>
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold">Enjoyable</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 italic border-t pt-4">So students can focus on understanding, not just memorizing.</p>
                  </div>
                </div>
              </div>

              {/* Card 02 - By Students, For Students (Center - Larger/Lower) */}
              <div className="relative md:mt-12">
                <div className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow">
                  {/* Image/Icon Area */}
                  <div className="relative bg-gradient-to-br from-purple-100 to-purple-50 h-72 flex items-center justify-center">
                    <div className="text-8xl">👥</div>
                    {/* Number Badge */}
                    <div className="absolute bottom-4 left-4 bg-gradient-to-br from-purple-50 to-white rounded-2xl px-4 py-2">
                      <span className="text-2xl font-black text-gray-900">02</span>
                    </div>
                  </div>
                  {/* Content */}
                  <div className="p-8">
                    <h3 className="text-2xl font-black text-gray-900 mb-4">By Students, For Students</h3>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">This platform is built by students, shaped by real experiences. Every feature comes from real struggles we've all faced.</p>
                    <div className="space-y-2 mb-4">
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-sm text-gray-700">
                          <Check size={16} className="text-purple-600 flex-shrink-0 mt-0.5" />
                          <span>Too much content</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-gray-700">
                          <Check size={16} className="text-purple-600 flex-shrink-0 mt-0.5" />
                          <span>Too little time</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-gray-700">
                          <Check size={16} className="text-purple-600 flex-shrink-0 mt-0.5" />
                          <span>No clear study direction</span>
                        </li>
                      </ul>
                    </div>
                    <p className="text-xs text-gray-500 italic border-t pt-4">We build only what genuinely helps students learn better, nothing extra, nothing complicated.</p>
                  </div>
                </div>
              </div>

              {/* Card 03 - The Promise */}
              <div className="relative">
                <div className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow">
                  {/* Image/Icon Area */}
                  <div className="relative bg-gradient-to-br from-pink-100 to-pink-50 h-64 flex items-center justify-center">
                    <div className="text-7xl">🤝</div>
                    {/* Number Badge */}
                    <div className="absolute bottom-4 left-4 bg-gradient-to-br from-pink-50 to-white rounded-2xl px-4 py-2">
                      <span className="text-2xl font-black text-gray-900">03</span>
                    </div>
                  </div>
                  {/* Content */}
                  <div className="p-8">
                    <h3 className="text-2xl font-black text-gray-900 mb-4">The Promise</h3>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">We promise to always keep this platform focused on what matters most—your learning journey.</p>
                    <div className="space-y-2 mb-4">
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-sm text-gray-700">
                          <Check size={16} className="text-pink-600 flex-shrink-0 mt-0.5" />
                          <span className="font-semibold">Student-first</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-gray-700">
                          <Check size={16} className="text-pink-600 flex-shrink-0 mt-0.5" />
                          <span className="font-semibold">Easy to use</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-gray-700">
                          <Check size={16} className="text-pink-600 flex-shrink-0 mt-0.5" />
                          <span className="font-semibold">Free to start</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-gray-700">
                          <Check size={16} className="text-pink-600 flex-shrink-0 mt-0.5" />
                          <span className="font-semibold">Focused on real learning</span>
                        </li>
                      </ul>
                    </div>
                    <p className="text-xs text-gray-500 italic border-t pt-4">Because better study tools should be accessible to everyone.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Feedbacks */}
        <section id="impact" className="py-16 bg-white">
          <div className="container mx-auto px-6 text-center">
            <div className="mb-6">
              <h3 className="text-xl font-black mb-2">Study Club is Free for Every Student</h3>
              <p className="text-gray-500 text-sm">Feedback</p>
            </div>

            <div className="flex justify-center gap-2 text-yellow-400 mb-6"><Star fill="currentColor" /><Star fill="currentColor" /><Star fill="currentColor" /></div>
            <p className="text-xl font-black italic">"StudyClub24 changed how I prepare for exams. It explains the logic behind every step."</p>
            <div className="mt-8">
              <div className="inline-flex items-center gap-3 bg-indigo-100 rounded-full px-4 py-2">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">R</div>
                <div className="text-left">
                  <div className="font-black">Rohan Mehta</div>
                  <div className="text-xs text-gray-500">Medical Aspirant, New Delhi</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-indigo-700 to-pink-500 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-black mb-2">Our goal is simple</h2>
            <p className="mb-6 text-gray-100">No paywalls to start, No barriers to learning, Make studying easier and accessible for everyone.</p>
            <button onClick={handleLogin} className="px-8 py-3 bg-white text-indigo-700 rounded-full font-bold">Start Free Protocol</button>
          </div>
        </section>
      </main>

      <Footer onOpenLegal={onOpenLegal} />
    </div>
  );
};

export default Homepage;
