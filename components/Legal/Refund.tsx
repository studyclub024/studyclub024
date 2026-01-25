
import React from 'react';
import { ArrowLeft, CreditCard, ShieldAlert, BadgeMinus, Receipt, HelpCircle, XCircle, Mail, MapPin } from 'lucide-react';

const Refund: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
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
                            <Receipt size={32} />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                            Refund Policy
                        </h1>
                        <div className="flex items-center gap-2 text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">
                            <span className="theme-text">Payment Protocol</span>
                            <span>•</span>
                            <span>Last Updated: January 1, 2026</span>
                        </div>
                    </header>

                    <div className="prose prose-slate dark:prose-invert max-w-none space-y-12">
                        <section className="bg-amber-50 dark:bg-amber-900/10 p-8 rounded-3xl border border-amber-100 dark:border-amber-900/20">
                            <p className="text-amber-900 dark:text-amber-300 font-bold leading-relaxed m-0 text-lg">
                                Thank you for choosing Study Club 24. Please read this policy carefully before making a purchase.
                            </p>
                        </section>

                        <div className="space-y-16">
                            {/* 1. No Refund Policy */}
                            <section className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border-2 border-red-100 dark:border-red-900/20 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <XCircle size={100} />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-500/20">
                                            <BadgeMinus size={24} />
                                        </div>
                                        <h2 className="text-2xl font-black text-slate-900 dark:text-white m-0 uppercase tracking-tight">1. No Refund Policy</h2>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-300 font-bold mb-6">All purchases made on Study Club 24 are final and non-refundable.</p>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                                        {[
                                            'No refunds, returns, or exchanges',
                                            'Applies to all plan durations',
                                            'Applies regardless of usage',
                                            'Activated plans cannot be reversed'
                                        ].map(item => (
                                            <li key={item} className="bg-red-50/50 dark:bg-red-900/5 p-4 rounded-2xl border border-red-100 dark:border-red-900/10 text-xs font-black uppercase tracking-widest text-red-700 dark:text-red-400">
                                                • {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </section>

                            {/* 2. Reasons */}
                            <section>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-10 h-10 rounded-xl theme-bg text-white flex items-center justify-center shadow-lg theme-glow">
                                        <HelpCircle size={20} />
                                    </div>
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white m-0 uppercase tracking-tight">2. Why No Refunds?</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-black theme-text uppercase tracking-[0.2em]">Service Nature</h4>
                                        <ul className="space-y-3 list-none p-0">
                                            {['Immediate digital access', 'On-demand AI processing', 'Instant resource consumption'].map(item => (
                                                <li key={item} className="flex gap-3 text-sm text-slate-600 dark:text-slate-400 font-medium">
                                                    <div className="w-1.5 h-1.5 rounded-full theme-bg mt-1.5 shrink-0" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-black theme-text uppercase tracking-[0.2em]">Platform Integrity</h4>
                                        <ul className="space-y-3 list-none p-0">
                                            {['Extremely affordable pricing', 'Prevent misuse and abuse', 'Fair access to all users'].map(item => (
                                                <li key={item} className="flex gap-3 text-sm text-slate-600 dark:text-slate-400 font-medium">
                                                    <div className="w-1.5 h-1.5 rounded-full theme-bg mt-1.5 shrink-0" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            {/* 3. Before Purchase */}
                            <section className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800">
                                <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tight">3. Before You Purchase</h2>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                                    By completing a payment, you acknowledge and agree to this No Refund Policy. We strongly encourage you to:
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {['Review Plans', 'Check Needs', 'Ask Questions'].map(item => (
                                        <div key={item} className="p-4 bg-white dark:bg-slate-900 rounded-2xl text-center text-[10px] font-black uppercase tracking-widest border border-slate-100 dark:border-white/5">{item}</div>
                                    ))}
                                </div>
                            </section>

                            {/* 4. Exceptions */}
                            <section>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                        <ShieldAlert size={24} />
                                    </div>
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white m-0 uppercase tracking-tight">4. Rare Exceptions</h2>
                                </div>
                                <div className="bg-indigo-50/50 dark:bg-indigo-900/10 p-8 rounded-[2.5rem] border border-indigo-100 dark:border-indigo-900/20">
                                    <p className="font-bold text-indigo-900 dark:text-indigo-300 mb-6">Refunds or adjustments are only considered in two specific cases:</p>
                                    <div className="space-y-4">
                                        <div className="flex gap-4 items-start bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm">
                                            <CreditCard className="theme-text" />
                                            <p className="text-sm m-0 text-slate-600 dark:text-slate-400">Payment deducted but access was not granted after 24 hours.</p>
                                        </div>
                                        <div className="flex gap-4 items-start bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm">
                                            <Receipt className="theme-text" />
                                            <p className="text-sm m-0 text-slate-600 dark:text-slate-400">Duplicate payment due to a confirmed technical system error.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* 5 & 6 Short Sections */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <section className="bg-slate-50 dark:bg-slate-800/30 p-8 rounded-[2rem] border border-slate-100 dark:border-white/5">
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tight">5. Cancellation</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 m-0 leading-relaxed">Cancel auto-renewal at any time to stop future charges. No refunds for the remaining active period.</p>
                                </section>
                                <section className="bg-slate-50 dark:bg-slate-800/30 p-8 rounded-[2rem] border border-slate-100 dark:border-white/5">
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tight">6. Legal Compliance</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 m-0 leading-relaxed font-bold">Compliant with Indian IT Act and Digital Goods norms.</p>
                                </section>
                            </div>

                            {/* Contact Card */}
                            <section className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-8 uppercase tracking-tight">7. Payment Support</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm"><Mail className="theme-text" size={20} /></div>
                                        <div className="text-sm font-black text-slate-600 dark:text-slate-400 truncate">payments@studyclub24.in</div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm"><MapPin className="theme-text" size={20} /></div>
                                        <div className="text-sm font-black text-slate-600 dark:text-slate-400 truncate">Billing HQ, India</div>
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

export default Refund;
