
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
              <span>Last Updated: 02/08/2026</span>
            </div>
          </header>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
            <section>
              <p className="font-medium text-lg text-slate-700 dark:text-slate-300">
                Your privacy matters to us. This Privacy Policy explains how Studyclub24, Inc. (“Studyclub24,” “we,” “our,” or “us”) collects, uses, stores, and shares personal information when you access or use our websites, mobile applications, and related services (collectively, the “Services”).
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                This Privacy Policy applies to Studyclub24 and any affiliated entities we control. By using our Services, you agree to the practices described in this Privacy Policy.
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                Please also review our Terms of Service, which are incorporated into this Privacy Policy by reference. Any capitalized terms not defined here have the meanings set forth in our Terms of Service.
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                If you are a California resident, additional disclosures— including a Notice at Collection—are available in the California Privacy Rights section below.
              </p>
            </section>

            <div className="w-full h-px bg-slate-200 dark:bg-slate-800 my-8" />

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">1. Personal Information We Collect</h2>
              <p className="text-slate-600 dark:text-slate-400">The personal information we collect depends on how you interact with Studyclub24, the features you use, and the choices you make.</p>
              <p className="text-slate-600 dark:text-slate-400">We collect information in the following ways:</p>
              <ul className="list-disc pl-5 text-slate-600 dark:text-slate-400 space-y-2">
                <li>Information you provide directly</li>
                <li>Information collected automatically</li>
                <li>Information received from third parties</li>
                <li>Information we generate or infer from other data</li>
              </ul>
              <p className="text-slate-600 dark:text-slate-400">
                Parental or school consent is required before we collect, use, or disclose personal information from children where required by law. If consent is withdrawn, we will stop processing the child’s information as required. See Children’s Privacy below for more details.
              </p>

              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-6">A. Information You Provide Directly</h3>
              <p className="text-slate-600 dark:text-slate-400">You may provide personal information when creating an account, subscribing, contacting us, or using our Services, including:</p>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-white/5 space-y-4">
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">Account and Contact Information</h4>
                  <ul className="list-disc pl-5 text-slate-600 dark:text-slate-400 mt-2">
                    <li>Name</li>
                    <li>Username</li>
                    <li>Email address</li>
                    <li>Date of birth</li>
                  </ul>
                  <p className="text-sm text-slate-500 mt-2">If you purchase a subscription, our payment processor (Stripe) may also collect billing address and phone number.</p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">Demographic Information</h4>
                  <p className="text-slate-600 dark:text-slate-400">In some cases, we may request age, gender, or similar information (for example, through surveys).</p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">Profile and Educational Information</h4>
                  <p className="text-slate-600 dark:text-slate-400">This may include interests, biography details, education level, intended use of the Services, class information, and linked social media accounts.</p>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">When Studyclub24 is used through a school, we may receive student-related educational records as permitted by our agreements with educational institutions.</p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">Payment Information</h4>
                  <p className="text-slate-600 dark:text-slate-400">Payment details are processed securely by Stripe. Studyclub24 does not store full payment card numbers.</p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">Content and Communications</h4>
                  <p className="text-slate-600 dark:text-slate-400">We collect files, notes, flashcards, documents, images, comments, reviews, and messages you upload or send through our Services or communicate to us directly.</p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">Sensitive Personal Information</h4>
                  <ul className="list-disc pl-5 text-slate-600 dark:text-slate-400 mt-2">
                    <li>Account login credentials (username and password)</li>
                    <li>Payment information handled by Stripe</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-6">B. Information Collected Automatically</h3>
              <p className="text-slate-600 dark:text-slate-400">When you use Studyclub24, we automatically collect certain information, including:</p>
              <ul className="list-disc pl-5 text-slate-600 dark:text-slate-400 space-y-2">
                <li><strong>Device and Identifier Information:</strong> IP address, Device identifiers, Browser type, operating system, language, and settings.</li>
                <li><strong>Usage Data:</strong> Pages viewed, Time spent on pages, Referring URLs, Interaction history within the app or website.</li>
                <li><strong>Location Information:</strong> Approximate location (city, state, country), based on IP address or device settings.</li>
              </ul>

              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-6">C. Information We Generate or Infer</h3>
              <p className="text-slate-600 dark:text-slate-400">We may create insights or predictions based on other data we collect, such as estimating general location or understanding content preferences to personalize your experience.</p>

              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-6">D. Information from Third Parties</h3>
              <p className="text-slate-600 dark:text-slate-400">We may receive personal information from connected services (e.g., Google login), educational platforms (e.g., LMS tools), analytics providers, and schools/educators.</p>
            </section>

            <div className="w-full h-px bg-slate-200 dark:bg-slate-800 my-8" />

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">2. Cookies and Similar Technologies</h2>
              <p className="text-slate-600 dark:text-slate-400">Studyclub24 uses cookies, pixels, mobile identifiers, and similar technologies to operate our Services, understand usage, and improve performance.</p>

              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">What Are Cookies?</h3>
              <p className="text-slate-600 dark:text-slate-400">Cookies are small data files stored on your device that help recognize your browser and remember preferences. We also use web beacons and mobile advertising identifiers to collect usage and analytics data.</p>

              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">How We Use These Technologies</h3>
              <ul className="list-disc pl-5 text-slate-600 dark:text-slate-400 space-y-1">
                <li>Enable core site functionality</li>
                <li>Remember preferences</li>
                <li>Analyze usage and performance</li>
                <li>Prevent fraud</li>
                <li>Deliver relevant advertising where permitted</li>
              </ul>
              <p className="text-slate-600 dark:text-slate-400 italic">We do not use cookies for advertising purposes on children’s accounts.</p>

              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Your Choices</h3>
              <p className="text-slate-600 dark:text-slate-400">You can manage cookies and tracking through browser settings, device controls, and advertising opt-out tools.</p>
            </section>

            <div className="w-full h-px bg-slate-200 dark:bg-slate-800 my-8" />

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">3. How We Use Personal Information</h2>
              <ul className="list-disc pl-5 text-slate-600 dark:text-slate-400 space-y-2">
                <li>Provide and operate the Services</li>
                <li>Personalize learning experiences</li>
                <li>Process payments and subscriptions</li>
                <li>Improve and develop new features</li>
                <li>Conduct research and analytics</li>
                <li>Train and improve AI features that power Studyclub24</li>
                <li>Communicate with users (support, updates, alerts)</li>
                <li>Promote Studyclub24 services and offers</li>
                <li>Maintain security and prevent fraud</li>
                <li>Comply with legal obligations</li>
              </ul>
              <p className="text-slate-600 dark:text-slate-400">Sensitive personal information is used only as necessary to provide services, process payments, secure accounts, and communicate with users.</p>
            </section>

            <div className="w-full h-px bg-slate-200 dark:bg-slate-800 my-8" />

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">4. How We Share Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: "With Other Users", desc: "Content such as flashcards or notes you choose to make public may be visible to others." },
                  { title: "With Service Providers", desc: "We share data with vendors who help us operate Studyclub24 (e.g., hosting, analytics, customer support, security)." },
                  { title: "Payment Processing", desc: "Stripe processes payments and may share information with banks and financial institutions as required." },
                  { title: "Schools and Educators", desc: "When used in an educational setting, student information may be shared with the associated school or teachers." },
                  { title: "Legal and Safety Reasons", desc: "We may disclose information to comply with law, respond to legal requests, protect safety, prevent fraud, or enforce our policies." },
                  { title: "Business Transfers", desc: "Information may be transferred as part of a merger, acquisition, or sale of assets." },
                  { title: "Advertising and Analytics", desc: "Third parties may collect identifiers, usage data, and device information for analytics and advertising purposes." }
                ].map((item, i) => (
                  <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-white/5">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-2">{item.title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
                  </div>
                ))}
              </div>
              <p className="text-slate-600 dark:text-slate-400 mt-4">We may also share de-identified or aggregated information where permitted by law.</p>
            </section>

            {/* Sections 5-15 */}
            <div className="w-full h-px bg-slate-200 dark:bg-slate-800 my-8" />

            <section className="space-y-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">5. Your Choices and Privacy Controls</h2>
                <ul className="list-disc pl-5 text-slate-600 dark:text-slate-400 space-y-2">
                  <li>Access, correction, or deletion through your account settings or by contacting us</li>
                  <li>Email marketing preferences via unsubscribe links or by contacting us</li>
                  <li>Advertising controls through industry opt-out tools (NAI, DAA, Your Online Choices)</li>
                  <li>Browser and device controls for cookies and mobile advertising IDs</li>
                </ul>
                <p className="text-slate-600 dark:text-slate-400 mt-2">We do not currently respond to browser “Do Not Track” signals.</p>
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">6. Children’s Privacy</h2>
                <div className="bg-indigo-50 dark:bg-slate-800 p-6 rounded-2xl">
                  <p className="text-slate-600 dark:text-slate-400 mb-4">Studyclub24 is an educational platform. Some users may be under 13. We comply with the Children’s Online Privacy Protection Act (COPPA) and applicable student privacy laws.</p>
                  <p className="text-slate-600 dark:text-slate-400">Parental or school consent is required where applicable. Parents may request access to, correction, or deletion of their child’s information by contacting us at <a href="mailto:team@studyclub24.com" className="text-indigo-600 font-bold">team@studyclub24.com</a> with “COPPA REQUEST” in the subject line.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white mb-4">7. School and Student Data</h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-2">When used in schools, Studyclub24 complies with FERPA, SOPPA, NY Education Law §2-d, and similar laws.</p>
                  <p className="text-slate-600 dark:text-slate-400">Student records are not sold and only used for educational purposes. Requests should be sent to <a href="mailto:team@studyclub24.com" className="text-indigo-600 font-bold">team@studyclub24.com</a> with “STUDENT DATA REQUEST”.</p>
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white mb-4">8. European Privacy Rights</h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-2">If EU/UK data protection laws apply to you, you have rights including access, correction, deletion, portability, objection, and restriction of processing.</p>
                  <p className="text-slate-600 dark:text-slate-400">We process EU personal data based on consent, contractual necessity, legal obligations, and legitimate interests.</p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">9. California Privacy Rights</h2>
                <ul className="list-disc pl-5 text-slate-600 dark:text-slate-400 space-y-2">
                  <li>Right to know</li>
                  <li>Right to delete or correct</li>
                  <li>Right to opt out of “sale” or “sharing”</li>
                  <li>Right to limit use of sensitive personal information</li>
                  <li>Right to non-discrimination</li>
                </ul>
                <p className="text-slate-600 dark:text-slate-400 mt-2">Requests may be submitted to <a href="mailto:team@studyclub24.com" className="text-indigo-600 font-bold">team@studyclub24.com</a>. We do not sell personal information for money.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white mb-4">10. Data Retention</h2>
                  <p className="text-slate-600 dark:text-slate-400">We retain personal information only as long as needed to provide services, comply with legal obligations, resolve disputes, and enforce agreements.</p>
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white mb-4">11. Data Location</h2>
                  <p className="text-slate-600 dark:text-slate-400">Personal data may be processed in the United States or other countries where our service providers operate. We use contractual safeguards when transferring data internationally.</p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mb-4">12. Security</h2>
                <p className="text-slate-600 dark:text-slate-400">We use reasonable technical and organizational measures to protect personal information. Users are responsible for keeping their login credentials secure.</p>
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mb-4">13. Use of Google User Data</h2>
                <p className="text-slate-600 dark:text-slate-400">Studyclub24 does not use Google user data to train or develop generalized AI or ML models, nor do we transfer Google user data to third-party AI tools.</p>
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mb-4">14. Updates to This Policy</h2>
                <p className="text-slate-600 dark:text-slate-400">We may update this Privacy Policy from time to time. Changes will be reflected by updating the “Last Updated” date. Material changes will be communicated as required by law.</p>
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">15. Contact Us</h2>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <p className="font-bold text-slate-900 dark:text-white">Studyclub24, Inc.</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Mail size={18} className="text-indigo-600" />
                    <a href="mailto:info@studyclub24.com" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600">info@studyclub24.com</a>
                  </div>
                </div>
              </div>

            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
