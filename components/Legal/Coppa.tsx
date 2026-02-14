import React from 'react';
import { ArrowLeft, Shield, Baby, FileCheck } from 'lucide-react';

const Coppa: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
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
                            <Baby size={32} />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                            COPPA Notice to Parents
                        </h1>
                        <div className="flex items-center gap-2 text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">
                            <span className="theme-text">Child Safety Protocol</span>
                            <span>•</span>
                            <span>Last Updated: February 8, 2026</span>
                        </div>
                    </header>

                    <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
                        <section>
                            <p className="font-medium text-lg text-slate-700 dark:text-slate-300">
                                Studyclub24 (“Studyclub24,” “we,” “us,” or “our”) provides an educational study platform designed primarily for users aged 13 and older. However, we recognize that children under the age of 13 (“children” or “child”) may access the Service in limited circumstances.
                            </p>
                            <p className="text-slate-600 dark:text-slate-400">
                                This COPPA Notice to Parents supplements our Privacy Policy and explains how Studyclub24 handles children’s information, what limited data may be processed, and the rights parents and guardians have under the Children’s Online Privacy Protection Act (“COPPA”).
                            </p>
                        </section>

                        <div className="w-full h-px bg-slate-200 dark:bg-slate-800 my-8" />

                        <section className="space-y-4">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">1. Our Core Privacy Commitment</h2>
                            <p className="text-slate-600 dark:text-slate-400">Studyclub24 does not store children’s personal information. Any information involving a child is:</p>
                            <ul className="list-disc pl-5 text-slate-600 dark:text-slate-400 space-y-2">
                                <li>processed temporarily and minimally</li>
                                <li>used only to operate the Service</li>
                                <li>not retained, sold, or used for advertising</li>
                                <li>handled through trusted third-party providers when necessary</li>
                            </ul>

                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-8">2. How We Obtain Parental Consent</h2>
                            <p className="text-slate-600 dark:text-slate-400">We require verifiable parental consent before allowing a child under 13 to use the Service.</p>

                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-4">A. School-Based Use</h3>
                            <p className="text-slate-600 dark:text-slate-400">When Studyclub24 is used through a school or educational institution:</p>
                            <ul className="list-disc pl-5 text-slate-600 dark:text-slate-400 mt-2 space-y-1">
                                <li>We rely on the school to act as the parent’s agent under COPPA</li>
                                <li>Schools are responsible for notifying parents and obtaining consent</li>
                                <li>Parents should contact their school regarding permissions or concerns</li>
                            </ul>

                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-4">B. Personal (Non-School) Use</h3>
                            <p className="text-slate-600 dark:text-slate-400">If a child attempts to use Studyclub24 outside of a school setting:</p>
                            <ul className="list-disc pl-5 text-slate-600 dark:text-slate-400 mt-2 space-y-1">
                                <li>Access is restricted until verifiable parental consent is obtained</li>
                                <li>Consent may be collected through a trusted third-party identity or account provider that supports parental approval</li>
                                <li>If consent is not provided within a reasonable time, access is denied and any temporarily processed data is deleted</li>
                            </ul>

                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-8">3. Information We May Process from Children</h2>

                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-4">Information Processed Directly (Not Stored)</h3>
                            <p className="text-slate-600 dark:text-slate-400">We may temporarily process limited information such as:</p>
                            <ul className="list-disc pl-5 text-slate-600 dark:text-slate-400 mt-2 space-y-1">
                                <li>Username or display name</li>
                                <li>Login credentials (via third-party authentication)</li>
                                <li>Study materials or educational inputs submitted by the child</li>
                            </ul>
                            <p className="text-slate-600 dark:text-slate-400 mt-2">This information is not permanently stored by Studyclub24.</p>

                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-4">Information Processed Automatically</h3>
                            <p className="text-slate-600 dark:text-slate-400">To operate and secure the Service, we may temporarily process:</p>
                            <ul className="list-disc pl-5 text-slate-600 dark:text-slate-400 mt-2 space-y-1">
                                <li>IP address (used only to infer general location such as country or state)</li>
                                <li>Device and browser type</li>
                                <li>Basic usage data (e.g., session duration)</li>
                            </ul>
                            <p className="text-slate-600 dark:text-slate-400 mt-2">This information is used only for security, functionality, and performance; not used for behavioral advertising; and not retained beyond operational necessity.</p>

                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-8">4. Cookies and Similar Technologies</h2>
                            <p className="text-slate-600 dark:text-slate-400">Studyclub24 may use strictly necessary cookies or similar technologies to maintain user sessions, ensure platform security, and support core functionality.</p>
                            <p className="text-slate-600 dark:text-slate-400 mt-2">We do not use cookies or identifiers for advertising or marketing purposes for children.</p>

                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-8">5. Payments and Financial Information</h2>
                            <p className="text-slate-600 dark:text-slate-400">Children are not permitted to make purchases on Studyclub24.</p>
                            <ul className="list-disc pl-5 text-slate-600 dark:text-slate-400 mt-2 space-y-1">
                                <li>We do not knowingly collect or store payment information from children</li>
                                <li>Any paid access must be handled by a parent, guardian, or school</li>
                                <li>Payment processing (if applicable) is handled entirely by third-party providers</li>
                            </ul>

                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-8">6. How Information May Be Shared</h2>
                            <p className="text-slate-600 dark:text-slate-400">We do not sell or rent children’s personal information. Limited information may be shared only:</p>
                            <ul className="list-disc pl-5 text-slate-600 dark:text-slate-400 mt-2 space-y-1">
                                <li>with schools or educators (for school-based accounts)</li>
                                <li>with service providers strictly necessary to operate the Service</li>
                                <li>when required by law, court order, or to protect safety and security</li>
                            </ul>
                            <p className="text-slate-600 dark:text-slate-400 mt-2">Children’s study content may be visible to teachers or classmates only within controlled educational settings.</p>

                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-8">7. Data Retention and Deletion</h2>
                            <p className="text-slate-600 dark:text-slate-400">Studyclub24 follows a minimal retention approach:</p>
                            <ul className="list-disc pl-5 text-slate-600 dark:text-slate-400 mt-2 space-y-1">
                                <li>Children’s information is not stored long-term</li>
                                <li>Temporary data is deleted once no longer necessary</li>
                                <li>If parental consent is denied or revoked, access is terminated and data is deleted</li>
                            </ul>
                            <p className="text-slate-600 dark:text-slate-400 mt-2">We may retain limited information only where legally required (e.g., security or compliance obligations).</p>

                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-8">8. Parents’ Rights Under COPPA</h2>
                            <p className="text-slate-600 dark:text-slate-400">Parents and legal guardians have the right to:</p>
                            <ul className="list-disc pl-5 text-slate-600 dark:text-slate-400 mt-2 space-y-1">
                                <li>Review the information processed about their child</li>
                                <li>Withdraw consent at any time</li>
                                <li>Request deletion of their child’s information</li>
                                <li>Refuse further collection or use of information</li>
                            </ul>
                            <p className="text-slate-600 dark:text-slate-400 mt-2">Withdrawing consent will result in the child losing access to the Service.</p>

                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-8">9. How to Contact Us</h2>
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                                <p className="font-bold text-slate-900 dark:text-white">Studyclub24, Inc.</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span>Email:</span>
                                    <a href="mailto:info@studyclub24.com" className="text-indigo-600 font-bold hover:underline">info@studyclub24.com</a>
                                </div>
                                <p className="text-sm text-slate-400 mt-2">Subject Line: “COPPA REQUEST”</p>
                            </div>

                            <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">10. Additional Information</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm">For more details about our privacy practices, please review our Privacy Policy. Parents are also encouraged to learn more about COPPA by visiting the Federal Trade Commission website at <a href="https://www.ftc.gov" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">www.ftc.gov</a>.</p>
                            </div>

                            <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-slate-400 text-sm">
                                © 2026 Studyclub24, Inc. All rights reserved.
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Coppa;
