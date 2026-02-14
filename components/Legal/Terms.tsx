
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
              <span>Last Updated: February 8, 2026</span>
            </div>
          </header>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
            <section className="bg-red-50 dark:bg-red-900/10 p-6 rounded-3xl border border-red-100 dark:border-red-900/20 text-center">
              <p className="text-red-700 dark:text-red-300 font-bold m-0 uppercase tracking-wide text-sm">
                IMPORTANT NOTICE: THIS AGREEMENT CONTAINS A MANDATORY ARBITRATION CLAUSE AND A WAIVER OF JURY TRIAL. PLEASE READ IT CAREFULLY.
              </p>
            </section>

            <section>
              <p className="font-medium text-lg text-slate-700 dark:text-slate-300">
                Studyclub24, Inc. (“Studyclub24,” “we,” “us,” or “our”) operates the Studyclub24 website, mobile applications, and related tools and services (collectively, the “Service”).
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                These Terms of Service (“Terms” or “Agreement”) govern your access to and use of the Service. By accessing, registering for, or using the Service, you agree to be legally bound by this Agreement. If you do not agree, you may not use the Service.
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                We may update these Terms from time to time. Continued use of the Service after changes are posted constitutes acceptance of the updated Terms.
              </p>
            </section>

            <div className="w-full h-px bg-slate-200 dark:bg-slate-800 my-8" />

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">1. License to Use the Service</h2>
              <p className="text-slate-600 dark:text-slate-400">Subject to your compliance with this Agreement, Studyclub24 grants you a limited, revocable, non-exclusive, non-transferable, non-sublicensable license to access and use the Service for lawful purposes. No rights are granted except as expressly stated.</p>

              <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-8">2. Incorporated Policies</h2>
              <p className="text-slate-600 dark:text-slate-400">The following policies are incorporated by reference and form part of this Agreement:</p>
              <ul className="list-disc pl-5 text-slate-600 dark:text-slate-400 space-y-2">
                <li>Privacy Policy</li>
                <li>Copyright & DMCA Policy</li>
                <li>Complaint and Abuse Policies</li>
              </ul>

              <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-8">3. Service Description</h2>
              <p className="text-slate-600 dark:text-slate-400">Studyclub24 is an educational and study-support platform that may use automated systems and artificial intelligence to provide certain features.</p>
              <p className="text-slate-600 dark:text-slate-400">Access to some features may require account creation and/or payment. The Service may be accessed through a web browser or mobile application.</p>
              <p className="text-slate-600 dark:text-slate-400">If you use the Service on behalf of a school, organization, or other entity, you represent that you have authority to bind that entity to this Agreement.</p>

              <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-8">4. Eligibility</h2>
              <ul className="list-disc pl-5 text-slate-600 dark:text-slate-400 space-y-2">
                <li>You must be at least 13 years old to use the Service.</li>
                <li>Users under 18 may require parental or guardian consent.</li>
                <li>By using the Service, you represent and warrant that you meet all eligibility requirements.</li>
              </ul>
              <p className="text-slate-600 dark:text-slate-400">We may restrict or modify eligibility at any time.</p>

              <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-8">5. Availability and Modifications</h2>
              <p className="text-slate-600 dark:text-slate-400">We do not guarantee uninterrupted or error-free operation of the Service. The Service and its features may change, be suspended, or discontinued at any time without notice or liability.</p>
              <p className="text-slate-600 dark:text-slate-400">Content provided through the Service is for educational and informational purposes only.</p>

              <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-8">6. Payments, Subscriptions, and No Refund Policy</h2>

              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-4">Payments</h3>
              <p className="text-slate-600 dark:text-slate-400">Some features require payment. All fees are charged in advance using a third-party payment processor. You authorize Studyclub24 and its payment processor to charge your selected payment method for all applicable fees.</p>

              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-4">Auto-Renewal</h3>
              <p className="text-slate-600 dark:text-slate-400">If you purchase a recurring subscription, it will automatically renew unless canceled before the end of the current billing period.</p>

              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-4">No Refund Policy</h3>
              <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-2xl border border-red-100 dark:border-red-900/20">
                <p className="font-bold text-red-700 dark:text-red-400 mb-2">ALL PAYMENTS ARE FINAL.</p>
                <p className="text-slate-600 dark:text-slate-400">Studyclub24 does not offer refunds, credits, or prorated reimbursements, including but not limited to:</p>
                <ul className="list-disc pl-5 text-slate-600 dark:text-slate-400 mt-2 space-y-1">
                  <li>Unused time</li>
                  <li>Accidental purchases</li>
                  <li>Dissatisfaction with the Service</li>
                  <li>Feature changes or removals</li>
                  <li>Service interruptions</li>
                  <li>Account termination</li>
                </ul>
                <p className="text-slate-600 dark:text-slate-400 mt-4">Canceling a subscription stops future charges only and does not entitle you to any refund. Refunds will only be issued if required by applicable law or by a third-party platform (e.g., Apple or Google) under their own policies.</p>
              </div>

              <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-8">7. User Responsibilities and Conduct</h2>
              <p className="text-slate-600 dark:text-slate-400">You agree that you will:</p>
              <ul className="list-disc pl-5 text-slate-600 dark:text-slate-400 space-y-1">
                <li>Provide accurate and lawful information</li>
                <li>Use the Service responsibly and legally</li>
                <li>Maintain the security of your login credentials</li>
                <li>Have all rights and permissions required to submit content</li>
              </ul>
              <p className="text-slate-600 dark:text-slate-400 mt-4">You agree not to:</p>
              <ul className="list-disc pl-5 text-slate-600 dark:text-slate-400 space-y-1">
                <li>Upload unlawful, harmful, obscene, or infringing content</li>
                <li>Introduce malware or harmful code</li>
                <li>Reverse engineer or interfere with the Service</li>
                <li>Scrape, crawl, or harvest data</li>
                <li>Harass, threaten, impersonate, or endanger others</li>
                <li>Misuse the Service or use it for competitive intelligence</li>
              </ul>
              <p className="text-slate-600 dark:text-slate-400 mt-2">We may suspend or terminate access for violations at our sole discretion.</p>

              <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-8">8. User Content and AI Use</h2>
              <p className="text-slate-600 dark:text-slate-400">You retain ownership of content you submit. However, by submitting content, you grant Studyclub24 a non-exclusive, worldwide, royalty-free license to process and use such content solely to provide the requested Service, including AI-powered features.</p>
              <p className="text-slate-600 dark:text-slate-400 mt-2">You acknowledge and agree that:</p>
              <ul className="list-disc pl-5 text-slate-600 dark:text-slate-400 space-y-1">
                <li>Content may be processed automatically</li>
                <li>Outputs may be generated using automated or AI-based systems</li>
                <li>Outputs are provided “as is” and may contain inaccuracies</li>
              </ul>
              <p className="text-slate-600 dark:text-slate-400 mt-2">Studyclub24 does not guarantee the accuracy, completeness, or suitability of AI-generated results.</p>

              <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-8">9. Data Collection and Storage</h2>
              <p className="text-slate-600 dark:text-slate-400">Studyclub24 is designed to minimize data retention. We do not store personal user data on our servers, except for limited, temporary processing strictly necessary to operate the Service (such as authentication, security, or billing coordination through third-party providers).</p>
              <ul className="list-disc pl-5 text-slate-600 dark:text-slate-400 mt-2 space-y-1">
                <li>Payment information is handled exclusively by third-party payment processors.</li>
                <li>Studyclub24 does not store credit card or banking details.</li>
                <li>User content is not retained beyond what is technically necessary to deliver the Service.</li>
              </ul>
              <p className="text-slate-600 dark:text-slate-400 mt-2">For details, see our Privacy Policy.</p>

              <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-8">10. Content Sharing and Risk</h2>
              <p className="text-slate-600 dark:text-slate-400">You are solely responsible for any content you choose to share. You understand that sharing information may expose it to others and agree that Studyclub24 is not responsible for any consequences arising from such sharing.</p>

              <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-8">11. Intellectual Property</h2>
              <p className="text-slate-600 dark:text-slate-400">All software, designs, logos, trademarks, content, and functionality of the Service are owned by Studyclub24 or its licensors and are protected by intellectual property laws. Nothing in this Agreement transfers ownership to you.</p>

              <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-8">12. Enforcement and Termination</h2>
              <p className="text-slate-600 dark:text-slate-400">We may restrict, suspend, or terminate your access at any time, with or without notice. Sections relating to intellectual property, disclaimers, liability limitations, arbitration, and indemnification survive termination.</p>

              <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-8">13. Third-Party Services</h2>
              <p className="text-slate-600 dark:text-slate-400">The Service may contain links or integrations with third-party services. Studyclub24 does not control or endorse third-party services and is not responsible for their content, policies, or practices.</p>

              <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-8">14. Disclaimers</h2>
              <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                <p className="font-bold text-slate-800 dark:text-slate-200 uppercase mb-2">THE SERVICE IS PROVIDED “AS IS” AND “AS AVAILABLE.”</p>
                <p className="text-slate-600 dark:text-slate-400 mb-2">TO THE MAXIMUM EXTENT PERMITTED BY LAW, STUDYCLUB24 DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</p>
                <p className="text-slate-600 dark:text-slate-400">WE DO NOT GUARANTEE ACCURACY, AVAILABILITY, SECURITY, OR ERROR-FREE OPERATION, INCLUDING ANY AI-GENERATED OUTPUTS.</p>
              </div>

              <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-8">15. Limitation of Liability</h2>
              <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                <p className="text-slate-600 dark:text-slate-400 mb-2">TO THE MAXIMUM EXTENT PERMITTED BY LAW, STUDYCLUB24 SHALL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, OR PUNITIVE DAMAGES.</p>
                <p className="text-slate-600 dark:text-slate-400">TOTAL LIABILITY SHALL NOT EXCEED USD $500, REGARDLESS OF THE TYPE OF CLAIM.</p>
              </div>

              <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-8">16. Indemnification</h2>
              <p className="text-slate-600 dark:text-slate-400">You agree to indemnify and hold harmless Studyclub24 and its affiliates from any claims, damages, losses, or expenses arising from:</p>
              <ul className="list-disc pl-5 text-slate-600 dark:text-slate-400 mt-2 space-y-1">
                <li>Your use of the Service</li>
                <li>Your submitted content</li>
                <li>Your violation of these Terms</li>
                <li>Any unlawful conduct</li>
              </ul>

              <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-8">17. Arbitration and Governing Law</h2>
              <p className="text-slate-600 dark:text-slate-400">Any dispute arising from or relating to the Service shall be resolved by binding individual arbitration, not class actions.</p>
              <ul className="list-disc pl-5 text-slate-600 dark:text-slate-400 mt-2 space-y-1">
                <li>Governing law: State of New York</li>
                <li>Arbitration provider: American Arbitration Association (AAA)</li>
                <li>Location: New York, New York</li>
                <li>Jury trials are waived</li>
              </ul>
              <p className="text-slate-600 dark:text-slate-400 mt-2">Studyclub24 may seek injunctive relief in court for intellectual property violations or unpaid fees.</p>

              <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-8">18. Children’s Policy</h2>
              <p className="text-slate-600 dark:text-slate-400">Studyclub24 is not intended for children under 13. If we become aware that personal information from a child has been processed without proper consent, we will delete it as required by law. Parents are encouraged to use available parental control tools.</p>

              <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-8">19. General Terms</h2>
              <ul className="list-disc pl-5 text-slate-600 dark:text-slate-400 space-y-1">
                <li><strong>Severability:</strong> Invalid provisions do not affect the remainder</li>
                <li><strong>No Partnership:</strong> No agency or partnership is created</li>
                <li><strong>Assignment:</strong> We may assign this Agreement; you may not without consent</li>
                <li><strong>Electronic Signatures:</strong> Accepted where legally valid</li>
                <li><strong>No Waiver:</strong> Failure to enforce is not a waiver</li>
                <li><strong>Entire Agreement:</strong> This Agreement supersedes all prior agreements</li>
              </ul>

              <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-8">20. Contact Information</h2>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                <p className="font-bold text-slate-900 dark:text-white">Studyclub24, Inc.</p>
                <div className="flex items-center gap-2 mt-2">
                  <span>Email:</span>
                  <a href="mailto:info@studyclub24.com" className="text-indigo-600 font-bold hover:underline">info@studyclub24.com</a>
                </div>
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

export default Terms;
