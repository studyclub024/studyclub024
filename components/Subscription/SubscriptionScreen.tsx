
import React, { useState, useEffect } from 'react';
import { SubscriptionPlan } from '../../types';
import { Check, Zap, Star, Shield, Trophy, Crown, ArrowRight, X, Loader } from 'lucide-react';
import razorpayService from '../../services/razorpayService';
import { auth } from '../../firebaseConfig';

// All features comparison list
const ALL_FEATURES = [
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
const PLAN_FEATURES_MAP: Record<string, Record<string, boolean>> = {
  'crash-course': {
    'Course & Question Paper': true,
    'Notes Upload': false,
    'Unlimited Flashcards': false,
    'Unlimited Summaries': false,
    'Unlimited Test': false,
    'Study Plan': false,
    'Save Flashcards': false,
    'Share Flashcards': false,
    'Language Learning': false,
    'Theme For Fun Learning': false,
    'Voice input': false,
    'Chat': false,
  },
  'instant-help': {
    'Course & Question Paper': false,
    'Notes Upload': true,
    'Unlimited Flashcards': true,
    'Unlimited Summaries': true,
    'Unlimited Test': true,
    'Study Plan': true,
    'Save Flashcards': false,
    'Share Flashcards': false,
    'Language Learning': false,
    'Theme For Fun Learning': false,
    'Voice input': false,
    'Chat': false,
  },
  'focused-prep': {
    'Course & Question Paper': true,
    'Notes Upload': true,
    'Unlimited Flashcards': true,
    'Unlimited Summaries': true,
    'Unlimited Test': true,
    'Study Plan': true,
    'Save Flashcards': false,
    'Share Flashcards': false,
    'Language Learning': true,
    'Theme For Fun Learning': true,
    'Voice input': false,
    'Chat': false,
  },
  'study-pro': {
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
    'Voice input': true,
    'Chat': true,
  },
};

export const PLANS: SubscriptionPlan[] = [
  {
    id: 'crash-course',
    name: 'Crash Course Plan',
    price: '₹0.99',
    period: 'day Billed Monthly',
    description: 'Less Than a Chocolate',
    features: ['Course & Question Paper'],
    gradient: 'from-blue-400 to-indigo-500'
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
    features: ['Course & Question Paper', '10 Notes Upload/day', 'Unlimited Flashcards', 'Unlimited Summaries', 'Unlimited Test', 'Study Plan', 'Language Learning', 'Theme For Fun Learning'],
    gradient: 'from-fuchsia-500 to-rose-500'
  },
  {
    id: 'study-pro',
    name: 'Study Pro ⭐',
    price: '₹599',
    period: 'Month Billed Monthly',
    description: 'Less than a Cafe outing',
    features: ['Course & Question Paper', 'Unlimited Notes Upload', 'Unlimited Flashcards', 'Unlimited Summaries', 'Unlimited Test', 'Study Plan', 'Save Flashcards', 'Share Flashcards', 'Language Learning', 'Theme For Fun Learning', 'Podcast', 'Chat'],
    gradient: 'from-amber-400 to-yellow-600'
  }
];

interface Props {
  onSelect: (plan: SubscriptionPlan) => void;
  onClose?: () => void;
  isLoggedIn?: boolean;
  onOpenAuth?: () => void;
}

const SubscriptionScreen: React.FC<Props> = ({ onSelect, onClose, isLoggedIn = false, onOpenAuth }) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // Calculate monthly price
  const getMonthlyPrice = (plan: SubscriptionPlan): string => {
    const price = parseFloat(plan.price.replace('₹', '').replace(',', ''));
    if (plan.period.toLowerCase().includes('day')) {
      const monthlyAmount = price * 30;
      return `₹${monthlyAmount.toFixed(0)}`;
    }
    return plan.price;
  };

  // Calculate total price with GST
  const getTotalWithGST = (plan: SubscriptionPlan): string => {
    const price = parseFloat(plan.price.replace('₹', '').replace(',', ''));
    let monthlyAmount = price;
    if (plan.period.toLowerCase().includes('day')) {
      monthlyAmount = price * 30;
    }
    const totalWithGST = monthlyAmount * 1.18;
    return `₹${Math.round(totalWithGST)}`;
  };

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
        phone: user?.phoneNumber || undefined,
      };

      // Initiate Razorpay payment
      await razorpayService.initiatePayment(plan, userDetails);

      // Call the onSelect callback
      onSelect(plan);
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
      const plan = PLANS.find(p => p.id === selectedPlan);
      if (plan) {
        // Delay slightly to ensure state is updated
        const timer = setTimeout(async () => {
          setLoading(selectedPlan);
          try {
            const user = auth.currentUser;
            const userDetails = {
              name: user?.displayName || undefined,
              email: user?.email || undefined,
              phone: user?.phoneNumber || undefined,
            };
            await razorpayService.initiatePayment(plan, userDetails);
            onSelect(plan);
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
  }, [isLoggedIn, selectedPlan]);

  return (
    <div className="fixed inset-0 z-[1000] bg-[#F8F9FC] dark:bg-slate-950 overflow-y-auto py-16 px-4 animate-fade-in">
      {onClose && (
        <button
          onClick={onClose}
          className="fixed top-6 right-6 p-3 bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-2xl shadow-lg hover:shadow-xl text-gray-400 hover:text-gray-900 transition-all z-[1001]"
        >
          <X size={24} />
        </button>
      )}
      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tight">
            Elevate Your <span className="text-indigo-600 dark:text-indigo-400">Intelligence</span>
          </h1>
          <p className="text-gray-500 dark:text-slate-400 font-medium text-lg max-w-2xl mx-auto">
            Choose the protocol that matches your academic ambition. Unlock the full power of StudyClub24 today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PLANS.map((plan, idx) => (
            <div
              key={plan.id}
              className={`relative flex flex-col bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border-2 transition-all hover:scale-[1.02] group ${plan.isPopular ? 'border-indigo-600 shadow-2xl shadow-indigo-100 dark:shadow-none ring-4 ring-indigo-50 dark:ring-indigo-900/10' : 'border-gray-50 dark:border-white/5 shadow-xl shadow-gray-100 dark:shadow-none hover:border-indigo-200'}`}
              style={{ animationDelay: `${idx * 100}ms` }}
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
                {plan.period.toLowerCase().includes('day') && (
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-gray-600 dark:text-slate-400">
                   
                    </div>
                    <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                 
                    </div>
                  </div>
                )}
                {plan.period.toLowerCase().includes('month') && (
                  <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-1">

                  </div>
                )}
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
                disabled={loading === plan.id}
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

        {/* Feature Comparison Table */}
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
    </div>
  );
};

export default SubscriptionScreen;
