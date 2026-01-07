
import React from 'react';
import { SubscriptionPlan } from '../../types';
import { Check, Zap, Star, Shield, Trophy, Crown, ArrowRight, X } from 'lucide-react';

export const PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free Plan',
    price: '₹0',
    period: 'Forever',
    description: 'Perfect for first-time users to trial the engine.',
    features: ['1 Input Total', 'Generate Results Once per Format', 'Basic AI Models', 'Ad-Supported'],
    gradient: 'from-slate-400 to-slate-500'
  },
  {
    id: 'weekly',
    name: 'Weekly Plan',
    price: '₹45',
    period: 'Week',
    description: 'Light daily usage, completely ad-free.',
    features: ['5 Inputs Per Day', 'Generate Results Multiple Times', 'No Ads', 'Instant Processing'],
    gradient: 'from-blue-400 to-indigo-500'
  },
  {
    id: 'monthly',
    name: 'Monthly Plan',
    price: '₹99',
    period: 'Month',
    description: 'Best value for regular students and learners.',
    isPopular: true,
    features: ['10 Inputs Per Day', 'Flashcard Themes Enabled', 'Save Results Locally', 'English Learning Tab', 'Leaderboard Sharing', 'Text-to-Speech (TTS)'],
    gradient: 'from-violet-500 to-fuchsia-500'
  },
  {
    id: 'monthly-pro',
    name: 'Monthly Pro',
    price: '₹150',
    period: 'Month',
    description: 'Unlimited power for high-stakes exam prep.',
    features: ['Unlimited Inputs', 'All Themes Unlocked', 'Advanced Analysis', 'Everything in Monthly'],
    gradient: 'from-fuchsia-500 to-rose-500'
  },
  {
    id: 'yearly',
    name: 'Yearly Plan',
    price: '₹360',
    period: 'Year',
    description: 'Affordable long-term plan for consistent success.',
    features: ['10 Inputs Per Day', 'All Themes Unlocked', 'Full Academic Access', 'Everything in Monthly'],
    gradient: 'from-rose-500 to-orange-500'
  },
  {
    id: 'yearly-pro',
    name: 'Yearly Pro',
    price: '₹999',
    period: 'Year',
    description: 'The ultimate academic benchmark. King of prep.',
    features: ['Unlimited Inputs', 'All Themes Unlocked', 'Priority Access', 'Everything in Monthly Pro'],
    gradient: 'from-amber-400 to-yellow-600'
  }
];

interface Props {
  onSelect: (plan: SubscriptionPlan) => void;
  onClose?: () => void;
}

const SubscriptionScreen: React.FC<Props> = ({ onSelect, onClose }) => {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  {plan.id === 'free' && <Zap size={24} />}
                  {plan.id === 'weekly' && <Star size={24} />}
                  {plan.id === 'monthly' && <Shield size={24} />}
                  {plan.id === 'monthly-pro' && <Trophy size={24} />}
                  {plan.id === 'yearly' && <Star size={24} />}
                  {plan.id === 'yearly-pro' && <Crown size={24} />}
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                <p className="text-xs text-gray-400 dark:text-slate-500 font-medium leading-relaxed min-h-[3rem]">
                  {plan.description}
                </p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
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
                onClick={() => onSelect(plan)}
                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 group/btn ${
                  plan.isPopular 
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 hover:bg-indigo-700' 
                    : 'bg-gray-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white'
                }`}
              >
                Upgrade Now <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
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
    </div>
  );
};

export default SubscriptionScreen;
