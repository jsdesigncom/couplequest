import React, { useState } from 'react';
import { UserProfile } from '../types';
import { LogoIcon } from './icons';

interface WelcomeScreenProps {
  onProfileSave: (profile: UserProfile) => void;
}

const budgetOptions = ['Free', '$', '$$', '$$$'];
const availabilityOptions = ['Weekdays', 'Weekends', 'Anytime'];

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onProfileSave }) => {
  const [interests, setInterests] = useState('');
  const [preferred_budget, setPreferredBudget] = useState<string[]>(['$', '$$']);
  const [availability, setAvailability] = useState<string[]>(['Anytime']);

  const handleBudgetToggle = (budget: string) => {
    setPreferredBudget(prev =>
      prev.includes(budget) ? prev.filter(b => b !== budget) : [...prev, budget]
    );
  };

  const handleAvailabilityToggle = (avail: string) => {
    setAvailability(prev =>
      prev.includes(avail) ? prev.filter(a => a !== avail) : [...prev, avail]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onProfileSave({ interests, preferred_budget, availability });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#1A1A2E] to-[#10101A]">
      <div className="w-full max-w-md bg-[#1A1A2E]/60 backdrop-blur-sm border border-slate-800 rounded-2xl shadow-lg p-8 text-white animate-fade-in-up">
        
        <div className="flex flex-col items-center text-center mb-8">
            <LogoIcon className="w-20 h-20" />
            <h1 className="text-4xl font-bold text-white mt-4">CoupleQuest</h1>
            <p className="text-slate-400">The Infinite Date Generator</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="interests" className="block text-sm font-medium text-slate-300 mb-2">What are your shared interests?</label>
            <input
              type="text"
              id="interests"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="e.g., hiking, board games, trying new food"
              className="w-full bg-slate-800 border border-slate-700 rounded-md p-3 focus:ring-2 focus:ring-[#D6A24D] focus:outline-none transition"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Preferred Budget</label>
            <div className="flex space-x-2">
              {budgetOptions.map(opt => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => handleBudgetToggle(opt)}
                  className={`flex-1 py-2 rounded-md font-semibold transition ${preferred_budget.includes(opt) ? 'bg-[#D6A24D] text-black' : 'bg-slate-800 text-slate-300'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">When are you usually free?</label>
            <div className="flex space-x-2">
               {availabilityOptions.map(opt => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => handleAvailabilityToggle(opt)}
                  className={`flex-1 py-2 rounded-md font-semibold transition ${availability.includes(opt) ? 'bg-[#D6A24D] text-black' : 'bg-slate-800 text-slate-300'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          
          <button type="submit" className="w-full bg-[#D6A24D] hover:bg-yellow-600 text-black font-bold py-3 px-4 rounded-lg transition duration-300 transform hover:scale-105">
            Start Our Quest
          </button>
        </form>
      </div>
    </div>
  );
};

export default WelcomeScreen;