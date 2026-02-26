import React, { useState } from 'react';
import { Check, Star, Zap, Gem, Crown, ShieldCheck, Flame } from 'lucide-react';

const PricingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'subscriptions' | 'coins'>('subscriptions');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-transparent pb-20">
      {/* Header */}
      <div className="text-center pt-10 pb-12 px-4">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100 mb-4 tracking-tight">
          Invest in Your Future Score
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Choose a plan that fits your study schedule or top-up coins for AI evaluations.
        </p>
        
        {/* Toggle */}
        <div className="mt-8 inline-flex bg-white dark:bg-slate-800 p-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700/50">
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
              activeTab === 'subscriptions'
                ? 'bg-slate-900 dark:bg-slate-700 text-white shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Subscriptions
          </button>
          <button
            onClick={() => setActiveTab('coins')}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
              activeTab === 'coins'
                ? 'bg-yellow-400 text-yellow-900 shadow-md'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Coin Shop
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {activeTab === 'subscriptions' ? (
          /* Section A: Subscriptions */
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Weekly Plan */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow relative">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">Basic Weekly</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-slate-100">7,900</span>
                  <span className="ml-1 text-xl font-medium text-slate-500 dark:text-slate-400">UZS / week</span>
                </div>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Perfect for short-term practice before the test.</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-emerald-500 mr-3 shrink-0" />
                  <span className="text-slate-600 dark:text-slate-300">7 Days Unlimited Reading/Listening</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-emerald-500 mr-3 shrink-0" />
                  <span className="text-slate-600 dark:text-slate-300">30 Coins for AI Evaluation</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-emerald-500 mr-3 shrink-0" />
                  <span className="text-slate-600 dark:text-slate-300">Gamification & Daily Streaks</span>
                </li>
              </ul>
              <button className="w-full py-3 px-4 bg-white dark:bg-slate-700 border-2 border-slate-900 dark:border-slate-600 text-slate-900 dark:text-slate-100 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
                Choose Weekly
              </button>
            </div>

            {/* Monthly Plan - Most Popular */}
            <div className="relative group">
              <div className="absolute -inset-[2px] bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl blur-[2px] opacity-100 group-hover:opacity-100 transition duration-200"></div>
              <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow h-full flex flex-col">
              <div className="absolute top-0 right-0 left-0 -mt-4 flex justify-center">
                <span className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm flex items-center gap-1">
                  <Crown className="w-3 h-3" /> Most Popular
                </span>
              </div>
              
              <div className="mb-6 mt-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                  Basic Monthly <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                </h3>
                
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">24,900</span>
                  <span className="ml-1 text-xl font-medium text-slate-500">UZS / month</span>
                </div>
                <p className="mt-2 text-sm text-slate-500">Best value for serious preparation.</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <div className="bg-emerald-100 dark:bg-emerald-900/30 rounded-full p-1 mr-3 shrink-0">
                    <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">30 Days Unlimited Access</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-emerald-100 dark:bg-emerald-900/30 rounded-full p-1 mr-3 shrink-0">
                    <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Weak Area Focus Analysis</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-emerald-100 dark:bg-emerald-900/30 rounded-full p-1 mr-3 shrink-0">
                    <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">100 Coins for AI Evaluation</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-emerald-100 dark:bg-emerald-900/30 rounded-full p-1 mr-3 shrink-0">
                    <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Priority Support</span>
                </li>
              </ul>
              <button className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg hover:opacity-90 transition-all transform hover:-translate-y-0.5">
                Get Monthly Access
              </button>
              </div>
            </div>
          </div>
        ) : (
          /* Section B: Coin Shop */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Starter Pack */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-lg text-xs font-bold uppercase">Starter</div>
              </div>
              <div className="flex justify-center my-6 group-hover:scale-110 transition-transform duration-300">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-400 blur-xl opacity-20 rounded-full"></div>
                  <img src="/coin.png" alt="50 Coins" className="w-24 h-24 relative z-10 object-contain drop-shadow-sm" onError={(e) => (e.currentTarget.style.display = 'none')} />
                </div>
              </div>
              <div className="text-center mb-6">
                <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">50 Coins</div>
                <div className="text-slate-500 dark:text-slate-400 mt-1">~5 Writing Evaluations</div>
              </div>
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-700/30 p-4 rounded-xl">
                <div className="text-lg font-bold text-slate-900 dark:text-slate-100">9,900 UZS</div>
                <button className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-600 hover:border-slate-300 transition-colors">
                  Buy Now
                </button>
              </div>
            </div>

            {/* Intensive Pack - Best Value */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border-2 border-yellow-400 shadow-lg hover:shadow-xl transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-xl shadow-sm z-20 flex items-center gap-1">
                <Flame className="w-3 h-3" /> BEST VALUE
              </div>
              
              <div className="flex justify-between items-start mb-4">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 px-3 py-1 rounded-lg text-xs font-bold uppercase">Intensive</div>
              </div>
              
              <div className="flex justify-center my-6 group-hover:scale-110 transition-transform duration-300">
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow-400 blur-2xl opacity-30 rounded-full animate-pulse"></div>
                  <img src="/coin.png" alt="150 Coins" className="w-32 h-32 relative z-10 object-contain drop-shadow-lg" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  <div className="absolute -bottom-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-white transform rotate-12 shadow-sm">
                    +50 BONUS
                  </div>
                </div>
              </div>
              
              <div className="text-center mb-6">
                <div className="text-4xl font-extrabold text-slate-900 dark:text-slate-100">150 Coins</div>
                <div className="text-slate-500 dark:text-slate-400 mt-1">~15 Writing Evaluations</div>
              </div>
              
              <div className="flex items-center justify-between bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-100 dark:border-yellow-900/30">
                <div className="text-xl font-extrabold text-slate-900 dark:text-slate-100">19,900 UZS</div>
                <button className="bg-yellow-400 text-yellow-900 px-6 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-yellow-300 transition-colors transform active:scale-95">
                  Buy Now
                </button>
              </div>
            </div>

            {/* Ultimate Pack */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all group opacity-75 hover:opacity-100">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-lg text-xs font-bold uppercase">Ultimate</div>
              </div>
              <div className="flex justify-center my-6 group-hover:scale-110 transition-transform duration-300">
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-400 blur-xl opacity-20 rounded-full"></div>
                  <img src="/coin.png" alt="300 Coins" className="w-24 h-24 relative z-10 object-contain drop-shadow-sm grayscale group-hover:grayscale-0 transition-all" onError={(e) => (e.currentTarget.style.display = 'none')} />
                </div>
              </div>
              <div className="text-center mb-6">
                <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">300 Coins</div>
                <div className="text-slate-500 dark:text-slate-400 mt-1">For Heavy Users</div>
              </div>
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-700/30 p-4 rounded-xl">
                <div className="text-lg font-bold text-slate-900 dark:text-slate-100">34,900 UZS</div>
                <button className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-600 hover:border-slate-300 transition-colors">
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Trust Badges */}
      <div className="mt-20 border-t border-slate-200 dark:border-slate-700/50 pt-12">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col items-center">
            <ShieldCheck className="w-8 h-8 text-slate-400 dark:text-slate-500 mb-3" />
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Secure Payment</span>
          </div>
          <div className="flex flex-col items-center">
            <Zap className="w-8 h-8 text-slate-400 dark:text-slate-500 mb-3" />
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Instant Activation</span>
          </div>
          <div className="flex flex-col items-center">
            <Gem className="w-8 h-8 text-slate-400 dark:text-slate-500 mb-3" />
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Official AI Model</span>
          </div>
          <div className="flex flex-col items-center">
            <Crown className="w-8 h-8 text-slate-400 dark:text-slate-500 mb-3" />
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Premium Support</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
