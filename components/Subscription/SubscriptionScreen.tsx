
import React, { useState, useEffect } from 'react';
import { SubscriptionPlan } from '../../types';
import { Check, Zap, Star, Shield, Trophy, Crown, ArrowRight, X, Loader, Globe, Lock, Type, Clock } from 'lucide-react';
import razorpayService from '../../services/razorpayService';
import { auth, db } from '../../firebaseConfig';

// All features comparison list
export const ALL_FEATURES = [
  'Course & Question Paper',
  'Notes Upload',
  'Unlimited Flashcards',
  'Unlimited Summaries',
  'Unlimited Test',
  'Study Plan',
  'Save Flashcards',
  'Share Flashcards',
  'Language Learning',
  'Theme For Fun Learning',
  'Podcast',
  'Chat'
];

// Feature details map for each plan
export const PLAN_FEATURES_MAP: Record<string, Record<string, boolean>> = {
  'free': {
    'Course & Question Paper': true,
    'Notes Upload': true,
    'Unlimited Flashcards': true,
    'Unlimited Summaries': true,
    'Unlimited Test': true,
    'Study Plan': true,
    'Save Flashcards': true,
    'Share Flashcards': true,
    'Language Learning': true,
    'Theme For Fun Learning': true,
    'Podcast': false,
    'Chat': false,
  },

  'instant-help': {
    // 'Course & Question Paper': false,
    'Notes Upload': true,
    'Unlimited Flashcards': true,
    'Unlimited Summaries': true,
    'Unlimited Test': true,
    'Study Plan': true,
    'Save Flashcards': false,
    'Share Flashcards': false,
    'Language Learning': false,
    'Theme For Fun Learning': false,
    'Podcast': false,
    'Chat': false,
  },
  'focused-prep': {
    // 'Course & Question Paper': true,
    'Notes Upload': true,
    'Unlimited Flashcards': true,
    'Unlimited Summaries': true,
    'Unlimited Test': true,
    'Study Plan': true,
    'Save Flashcards': false,
    'Share Flashcards': false,
    'Language Learning': true,
    'Theme For Fun Learning': true,
    'Podcast': false,
    'Chat': false,
  },
  'study-pro': {
    // 'Course & Question Paper': true,
    'Notes Upload': true,
    'Unlimited Flashcards': true,
    'Unlimited Summaries': true,
    'Unlimited Test': true,
    'Study Plan': true,
    'Save Flashcards': true,
    'Share Flashcards': true,
    'Language Learning': true,
    'Theme For Fun Learning': true,
    'Podcast': true,
    'Chat': true,
  },
};

export const PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free Plan',
    price: '₹0',
    period: 'for 3 Days',
    description: 'Start your journey',
    features: ['3 Uploads/day', 'Course & Question Paper', 'Flashcards', 'Summaries', 'Test', 'Study Plan', 'Save & Share Cards', 'Language Learning', 'Fun Themes'],
    gradient: 'from-gray-400 to-slate-500'
  },

  {
    id: 'instant-help',
    name: 'Instant help',
    price: '₹5',
    period: 'day Billed Monthly',
    description: 'Less than a cup of tea',
    isPopular: true,
    features: ['5 Notes Upload/day', 'Unlimited Flashcards', 'Unlimited Summaries', 'Unlimited Test', 'Study Plan'],
    gradient: 'from-violet-500 to-fuchsia-500'
  },
  {
    id: 'focused-prep',
    name: 'Focused Prep',
    price: '₹7',
    period: 'day Billed Monthly',
    description: 'Less than Lays Packet',
    features: [/*'Course & Question Paper',*/ '10 Notes Upload/day', 'Unlimited Flashcards', 'Unlimited Summaries', 'Unlimited Test', 'Study Plan', 'Language Learning', 'Theme For Fun Learning'],
    gradient: 'from-fuchsia-500 to-rose-500'
  },
  {
    id: 'study-pro',
    name: 'Study Pro ⭐',
    price: '₹499',
    period: 'Month Billed Monthly',
    description: 'Less than a Cafe outing',
    features: [/*'Course & Question Paper',*/ 'Unlimited Notes Upload', 'Unlimited Flashcards', 'Unlimited Summaries', 'Unlimited Test', 'Study Plan', 'Save Flashcards', 'Share Flashcards', 'Language Learning', 'Theme For Fun Learning', 'Podcast', 'Chat'],
    gradient: 'from-amber-400 to-yellow-600'
  }
];

export const US_PLANS: SubscriptionPlan[] = [
  {
    id: 'us-ultra-unlimited-monthly',
    name: 'Student Ultra Unlimited',
    price: '$10.99',
    currency: 'USD',
    period: 'Month',
    description: 'Billed Monthly',
    features: ['Unlimited Notes Upload', 'Unlimited Flashcards', 'Unlimited Summaries', 'Unlimited Test', 'Study Plan', 'Save & Share Cards', 'Language Learning', 'Fun Themes', 'Courses & Exams'],
    gradient: 'from-amber-400 to-yellow-600',
    billingAmount: 1099
  },
  {
    id: 'us-instant-help-annual',
    name: 'Student Instant Help',
    price: '$3.08',
    currency: 'USD',
    period: '/mo',
    description: '$36.99 Billed Annually',
    features: ['5 Notes Upload/day', 'Unlimited Flashcards', 'Unlimited Summaries', 'Unlimited Test', 'Study Plan', 'No Save/Share', 'No Language/Themes', 'No Courses'],
    gradient: 'from-violet-500 to-fuchsia-500',
    billingAmount: 3699
  },
  {
    id: 'us-ultra-unlimited-annual',
    name: 'Student Ultra Unlimited',
    price: '$5.83',
    currency: 'USD',
    period: '/mo',
    description: '$69.99 Billed Annually',
    isPopular: true,
    features: ['Unlimited Notes Upload', 'Unlimited Flashcards', 'Unlimited Summaries', 'Unlimited Test', 'Study Plan', 'Save & Share Cards', 'Language Learning', 'Fun Themes', 'Courses & Exams'],
    gradient: 'from-fuchsia-500 to-rose-500',
    billingAmount: 6999
  }
];

export const US_FREE_TRIAL: SubscriptionPlan = {
  id: 'us-free-trial',
  name: 'Free 3-Day Trial',
  price: '$0.00',
  currency: 'USD',
  period: '3 Days',
  description: 'Full Access for 3 Days',
  features: ['All Features Unlocked'],
  gradient: 'from-gray-800 to-gray-900',
  billingAmount: 0
};

interface Props {
  onSelect: (plan: SubscriptionPlan) => void;
  onClose?: () => void;
  isLoggedIn?: boolean;
  onOpenAuth?: () => void;
  currentPlanId?: string;
  cancellable?: boolean;
}

const SubscriptionScreen: React.FC<Props> = ({ onSelect, onClose, isLoggedIn = false, onOpenAuth, currentPlanId, cancellable = true }) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [userPhone, setUserPhone] = useState<string | undefined>(undefined);
  const [country, setCountry] = useState<'IN' | 'US'>('US');

  const plansToDisplay = country === 'IN' ? PLANS : US_PLANS;

  // Fetch user phone from Firestore
  useEffect(() => {
    const fetchUserPhone = async () => {
      if (isLoggedIn && auth.currentUser) {
        try {
          const userDoc = await db.collection('users').doc(auth.currentUser.uid).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            if (userData?.phoneNumber) {
              setUserPhone(userData.phoneNumber);
            }
          }
        } catch (error) {
          console.error("Error fetching user phone from Firestore:", error);
        }
      }
    };

    fetchUserPhone();
  }, [isLoggedIn]);

  const handleSelectPlan = async (plan: SubscriptionPlan) => {
    console.log('🔴 UPGRADE NOW CLICKED! Plan:', plan.id);
    console.log('🔴 User logged in?', isLoggedIn);

    if (!isLoggedIn) {
      // User not logged in, store the plan and open auth
      console.log('🔴 User not logged in, opening auth...');
      setSelectedPlan(plan.id);
      if (onOpenAuth) onOpenAuth();
      return;
    }

    // User is logged in, proceed with payment
    console.log('🔴 Setting loading state...');
    setLoading(plan.id);

    try {
      // Get user details from Firebase auth if available
      const user = auth.currentUser;
      const userDetails = {
        name: user?.displayName || undefined,
        email: user?.email || undefined,
        phone: userPhone || user?.phoneNumber || undefined, // Prioritize Firestore phone
      };

      // Initiate Razorpay payment
      await razorpayService.initiatePayment(plan, userDetails, (successfulPlan) => {
        onSelect(successfulPlan);
      });
    } catch (error) {
      console.error('Payment error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  // Trigger payment flow after successful login
  useEffect(() => {
    if (isLoggedIn && selectedPlan) {
      const plan = plansToDisplay.find(p => p.id === selectedPlan);
      if (plan) {
        // Delay slightly to ensure state is updated
        const timer = setTimeout(async () => {
          setLoading(selectedPlan);
          try {
            const user = auth.currentUser;
            // Re-fetch phone number if not yet available (edge case where login happens quickly)
            let phoneToUse = userPhone;
            if (!phoneToUse && user) {
              try {
                const userDoc = await db.collection('users').doc(user.uid).get();
                if (userDoc.exists) {
                  phoneToUse = userDoc.data()?.phoneNumber;
                }
              } catch (e) { console.error("Quick fetch error", e); }
            }

            const userDetails = {
              name: user?.displayName || undefined,
              email: user?.email || undefined,
              phone: phoneToUse || user?.phoneNumber || undefined,
            };
            await razorpayService.initiatePayment(plan, userDetails, (successfulPlan) => {
              onSelect(successfulPlan);
            });
          } catch (error) {
            console.error('Payment error:', error);
            alert('Something went wrong. Please try again.');
          } finally {
            setLoading(null);
            setSelectedPlan(null);
          }
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, [isLoggedIn, selectedPlan, userPhone]);

  const [selectedUSPlan, setSelectedUSPlan] = useState<string>('us-ultra-unlimited-annual');

  const handleUSSelect = (planId: string) => {
    // If 'trial', activate free trial
    if (planId === 'trial') {
      handleSelectPlan(US_FREE_TRIAL);
      return;
    }
    // If specific plan, pay now
    const plan = US_PLANS.find(p => p.id === planId);
    if (plan) handleSelectPlan(plan);
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-[#F8F9FC] dark:bg-slate-950 overflow-y-auto py-8 md:py-16 px-4 animate-fade-in font-sans">
      {onClose && cancellable && (
        <button
          onClick={onClose}
          className="fixed top-6 right-6 p-3 bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-2xl shadow-lg hover:shadow-xl text-gray-400 hover:text-gray-900 transition-all z-[1001]"
        >
          <X size={24} />
        </button>
      )}

      {/* Country Toggle - Hidden as only US is active */}
      <div className="hidden flex justify-center mb-10 sticky top-0 z-[900]">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-1 rounded-xl flex items-center shadow-sm border border-gray-200 dark:border-white/10">
          <button
            onClick={() => setCountry('IN')}
            className={`hidden px-6 py-2 rounded-lg text-sm font-bold transition-all ${country === 'IN' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'}`}
          >
            🇮🇳 India
          </button>
          <button
            onClick={() => setCountry('US')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${country === 'US' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'}`}
          >
            🇺🇸 USA
          </button>
        </div>
      </div>

      {
        country === 'US' ? (
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-start mt-8">
            {/* Left Side: Timeline */}
            <div className="w-full md:w-1/3 space-y-8 animate-fade-in-left">
              <div>
                {(() => {
                  let details = {
                    step2Title: "Day 3: Full membership",
                    step2Desc: "Your account is active. Cancel anytime before to avoid charges.",
                    step3Title: "Day 5: Annual members perks",
                    step3Desc: "Join the elite community of StudyClub24 achievers."
                  };

                  if (selectedUSPlan === 'us-ultra-unlimited-monthly') {
                    details = {
                      step2Title: "Day 3: Monthly membership",
                      step2Desc: "First monthly charge of $10.99. Cancel anytime.",
                      step3Title: "Month 1: Stay flexible",
                      step3Desc: "No long-term commitment. Pause or cancel whenever you want."
                    };
                  } else if (selectedUSPlan === 'us-instant-help-annual') {
                    details = {
                      step2Title: "Day 3: Basic membership",
                      step2Desc: "Annual charge of $36.99. Perfect for occasional help.",
                      step3Title: "Day 5: Essentials unlocked",
                      step3Desc: "Get access to essential study tools for a full year."
                    };
                  } else {
                    // Annual Ultra
                    details = {
                      step2Title: "Day 3: Full membership",
                      step2Desc: "Yearly charge of $69.99. Save 47% vs monthly.",
                      step3Title: "Day 5: Annual VIP Perks",
                      step3Desc: "Join the elite community & get exclusive StudyClub24 swag."
                    };
                  }

                  return (
                    <>
                      <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2 leading-tight">
                        One platform. <br /> Used by <span className="text-indigo-600">6.5M+ learners.</span>
                      </h1>
                      <div className="inline-block bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 font-bold px-3 py-1 rounded-full text-xs mt-2">
                        This offer expires in 09:37
                      </div>

                      <div className="relative pl-8 border-l-2 border-indigo-100 dark:border-indigo-900/50 space-y-12 mt-8">
                        {/* Step 1 */}
                        <div className="relative">
                          <div className="absolute -left-[39px] top-0 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-lg z-10">
                            <Lock size={14} strokeWidth={3} />
                          </div>
                          <div>
                            <h3 className="text-lg font-black text-gray-900 dark:text-white">Today: Instant access</h3>
                            <p className="text-sm text-gray-500 font-medium">With free 3-day trial</p>
                          </div>
                        </div>

                        {/* Step 2 */}
                        <div className="relative">
                          <div className="absolute -left-[39px] top-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 z-10 border-4 border-white dark:border-slate-950">
                            <Star size={14} strokeWidth={3} />
                          </div>
                          <div>
                            <h3 className="text-lg font-black text-gray-700 dark:text-gray-300">{details.step2Title}</h3>
                            <p className="text-sm text-gray-500 font-medium leading-relaxed">{details.step2Desc}</p>
                          </div>
                        </div>

                        {/* Step 3 */}
                        <div className="relative">
                          <div className="absolute -left-[39px] top-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 z-10 border-4 border-white dark:border-slate-950">
                            <Type size={14} strokeWidth={3} />
                          </div>
                          <div>
                            <h3 className="text-lg font-black text-gray-700 dark:text-gray-300">{details.step3Title}</h3>
                            <p className="text-sm text-gray-500 font-medium">{details.step3Desc}</p>
                          </div>
                        </div>
                      </div>

                    </>
                  );
                })()}
              </div>
            </div>

            {/* Right Side: Cards */}
            <div className="w-full md:w-2/3 animate-fade-in-up md:pl-12">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 items-end">
                {/* Monthly */}
                <div
                  onClick={() => setSelectedUSPlan('us-ultra-unlimited-monthly')}
                  className={`cursor-pointer rounded-2xl border-2 p-6 transition-all h-fit ${selectedUSPlan === 'us-ultra-unlimited-monthly' ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/10 ring-2 ring-indigo-600 ring-offset-2 dark:ring-offset-slate-950' : 'border-gray-200 dark:border-white/10 hover:border-indigo-300'}`}
                >
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Monthly Plan</h4>
                  <h3 className="text-sm font-black text-indigo-600 dark:text-indigo-400 mb-2">Student Ultra Unlimited</h3>
                  <div className="text-2xl font-black text-gray-900 dark:text-white">$10.99<span className="text-sm font-medium text-gray-400">/mo</span></div>
                  <p className="text-xs text-gray-400 mt-2 font-medium">Billed Monthly</p>
                </div>

                {/* Annual Pro */}
                <div
                  onClick={() => setSelectedUSPlan('us-ultra-unlimited-annual')}
                  className={`relative cursor-pointer rounded-2xl border-2 p-6 transition-all transform hover:-translate-y-1 ${selectedUSPlan === 'us-ultra-unlimited-annual' ? 'border-indigo-600 bg-indigo-600 text-white shadow-xl shadow-indigo-200 dark:shadow-none scale-105 z-10' : 'border-gray-200 dark:border-white/10'}`}
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm whitespace-nowrap">
                    Best Value
                  </div>
                  <h4 className={`text-xs font-bold uppercase tracking-wider mb-1 ${selectedUSPlan === 'us-ultra-unlimited-annual' ? 'text-indigo-200' : 'text-gray-500'}`}>Annual Plan</h4>
                  <h3 className={`text-sm font-black mb-2 ${selectedUSPlan === 'us-ultra-unlimited-annual' ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'}`}>Student Ultra Unlimited</h3>
                  <div className={`text-3xl font-black ${selectedUSPlan === 'us-ultra-unlimited-annual' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>$5.83<span className={`text-sm font-medium ${selectedUSPlan === 'us-ultra-unlimited-annual' ? 'text-indigo-200' : 'text-gray-400'}`}>/mo</span></div>
                  <p className={`text-xs mt-2 font-medium ${selectedUSPlan === 'us-ultra-unlimited-annual' ? 'text-indigo-100' : 'text-gray-400'}`}>$69.99 billed upfront</p>
                </div>

                {/* Annual Basic */}
                <div
                  onClick={() => setSelectedUSPlan('us-instant-help-annual')}
                  className={`cursor-pointer rounded-2xl border-2 p-6 transition-all h-fit ${selectedUSPlan === 'us-instant-help-annual' ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600 ring-offset-2 dark:ring-offset-slate-950' : 'border-gray-200 dark:border-white/10 hover:border-indigo-300'}`}
                >
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Annual Plan</h4>
                  <h3 className="text-sm font-black text-indigo-600 dark:text-indigo-400 mb-2">Student Instant Help</h3>
                  <div className="text-2xl font-black text-gray-900 dark:text-white">$3.08<span className="text-sm font-medium text-gray-400">/mo</span></div>
                  <p className="text-xs text-gray-400 mt-2 font-medium">$36.99 billed upfront</p>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => handleUSSelect('trial')}
                  className="w-full py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black text-lg uppercase tracking-widest shadow-xl hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  Start 3-Day Free Trial <ArrowRight size={20} />
                </button>

                <div className="text-center">
                  <button
                    onClick={() => handleUSSelect(selectedUSPlan)}
                    className="text-sm font-bold text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Or, skip trial & pay ${US_PLANS.find(p => p.id === selectedUSPlan)?.price} now
                  </button>
                </div>

                <p className="text-xs text-gray-400 text-center font-medium max-w-lg mx-auto leading-relaxed">
                  Free access for 3 days. If you continue, you'll be charged designated amount for the {US_PLANS.find(p => p.id === selectedUSPlan)?.period === 'Month' ? 'Monthly' : 'Yearly'} plan. Cancel anytime before the trial ends.
                </p>

                {/* Dynamic Feature List - Moved to Right Side */}
                <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/5 animate-fade-in-up text-left">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-6">
                    Included in {US_PLANS.find(p => p.id === selectedUSPlan)?.name}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {US_PLANS.find(p => p.id === selectedUSPlan)?.features.map((feature, idx) => (
                      <div key={idx} className="flex gap-3 items-start">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center mt-0.5">
                          <Check size={12} className="text-green-600 dark:text-green-400" strokeWidth={3} />
                        </div>
                        <span className="text-sm font-medium text-gray-600 dark:text-slate-300 leading-tight">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div >
        ) : (
          /* IN Views - Keep existing */
          <div className="max-w-7xl mx-auto relative">
            <div className="text-center mb-16 space-y-4">
              <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tight">
                Elevate Your <span className="text-indigo-600 dark:text-indigo-400">Intelligence</span>
              </h1>
              <p className="text-gray-500 dark:text-slate-400 font-medium text-lg max-w-2xl mx-auto">
                Choose the protocol that matches your academic ambition. Unlock the full power of StudyClub24 today.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-6">
              {plansToDisplay.map((plan, idx) => (
                <div
                  key={plan.id}
                  className={`relative flex flex-col bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border-2 transition-all hover:scale-[1.02] group w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(25%-1.5rem)] min-w-[280px] ${plan.isPopular ? 'border-indigo-600 shadow-2xl shadow-indigo-100 dark:shadow-none ring-4 ring-indigo-50 dark:ring-indigo-900/10' : 'border-gray-50 dark:border-white/5 shadow-xl shadow-gray-100 dark:shadow-none hover:border-indigo-200'}`}
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                      Best Value
                    </div>
                  )}

                  <div className="mb-6">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center text-white mb-6 shadow-lg group-hover:rotate-6 transition-transform`}>

                      {plan.id === 'instant-help' && <Shield size={24} />}
                      {plan.id === 'focused-prep' && <Trophy size={24} />}
                      {plan.id === 'study-pro' && <Crown size={24} />}
                    </div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                    <p className="text-xs text-gray-400 dark:text-slate-500 font-medium leading-relaxed min-h-[3rem]">
                      {plan.description}
                    </p>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-3xl font-black text-gray-900 dark:text-white">{plan.price}</span>
                      <span className="text-gray-400 font-bold text-sm">/{plan.period}</span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4 mb-8">
                    {plan.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex gap-3">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                          <Check size={12} className="text-indigo-600 dark:text-indigo-400" strokeWidth={3} />
                        </div>
                        <span className="text-xs font-bold text-gray-600 dark:text-slate-300 leading-tight">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleSelectPlan(plan)}
                    disabled={loading === plan.id || plan.id === currentPlanId}
                    className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 group/btn active:scale-95 ${plan.isPopular
                      ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 hover:-translate-y-1'
                      : 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-700 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-200 hover:-translate-y-1'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {loading === plan.id ? (
                      <>
                        <Loader size={14} className="animate-spin" />
                        Processing...
                      </>
                    ) : plan.id === currentPlanId ? (
                      <>
                        Current Plan
                        <Check size={14} className="group-hover/btn:scale-110 transition-transform" />
                      </>
                    ) : (
                      <>
                        Upgrade Now
                        <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              ))}
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
              <p className="text-[10px] text-gray-400 font-medium">
                Pricing shown is in INR. Taxes may apply. By selecting a plan, you agree to our Terms of Protocol and Privacy Policy.
              </p>
            </div>
          </div>
        )
      }

      {/* Feature Comparison Table (Only show for IN or if user scrolls down in US view?) - Let's keep it for IN, hide for US as US has simple cards */}
      {
        country === 'IN' && (
          <div className="mt-20 mb-16">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white text-center mb-12">
              Detailed Feature Comparison
            </h2>

            <div className="overflow-x-auto rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-white/10">
                    <th className="px-6 py-6 text-left text-sm font-black text-gray-900 dark:text-white bg-gray-50 dark:bg-slate-800/50 min-w-[250px]">
                      Feature / Plan
                    </th>
                    {PLANS.map((plan) => (
                      <th key={plan.id} className="px-6 py-6 text-center text-xs font-black text-gray-900 dark:text-white bg-gray-50 dark:bg-slate-800/50 min-w-[150px]">
                        <div className="text-sm">{plan.name}</div>
                        <div className="text-lg mt-2">{plan.price}<span className="text-xs">/{plan.period}</span></div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ALL_FEATURES.map((feature, idx) => (
                    <tr key={idx} className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-gray-700 dark:text-gray-300">
                        {feature}
                      </td>
                      {PLANS.map((plan) => (
                        <td key={plan.id} className="px-6 py-4 text-center">
                          {PLAN_FEATURES_MAP[plan.id][feature] ? (
                            <div className="flex justify-center">
                              <div className="w-6 h-6 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                                <Check size={16} className="text-green-600 dark:text-green-400" strokeWidth={3} />
                              </div>
                            </div>
                          ) : (
                            <div className="flex justify-center">
                              <div className="w-6 h-6 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                                <X size={16} className="text-red-600 dark:text-red-400" strokeWidth={3} />
                              </div>
                            </div>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {/* Upgrade Now Buttons Row */}
                  <tr className="bg-gray-50 dark:bg-slate-800/50">
                    <td className="px-6 py-6 text-sm font-black text-gray-900 dark:text-white">
                      Choose Plan
                    </td>
                    {PLANS.map((plan) => (
                      <td key={plan.id} className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleSelectPlan(plan)}
                          disabled={loading === plan.id}
                          className={`w-full px-4 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 group/btn active:scale-95 ${plan.isPopular
                            ? 'bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-300 hover:-translate-y-1'
                            : 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-700 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-200 hover:-translate-y-1'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {loading === plan.id ? (
                            <>
                              <Loader size={12} className="animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              Upgrade Now
                              <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                            </>
                          )}
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default SubscriptionScreen;
