import React, { useState } from 'react';
import { LogoIcon } from './icons';

interface AuthScreenProps {
  onLogin: (email: string) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    onLogin(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#1A1A2E] to-[#10101A]">
      <div className="w-full max-w-md bg-[#1A1A2E]/60 backdrop-blur-sm border border-slate-800 rounded-2xl shadow-lg p-8 text-white animate-fade-in-up">
        
        <div className="flex flex-col items-center text-center mb-8">
            <LogoIcon className="w-20 h-20" />
            <h1 className="text-4xl font-bold text-white mt-4">Welcome to CoupleQuest</h1>
            <p className="text-slate-400">Sign in to save your profile and date ideas.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="sr-only">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full bg-slate-800 border border-slate-700 rounded-md p-3 focus:ring-2 focus:ring-[#D6A24D] focus:outline-none transition"
              aria-describedby="email-error"
            />
            {error && <p id="email-error" className="text-red-400 text-sm mt-2">{error}</p>}
          </div>
          
          <button type="submit" className="w-full bg-[#D6A24D] hover:bg-yellow-600 text-black font-bold py-3 px-4 rounded-lg transition duration-300 transform hover:scale-105">
            Continue with Email
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthScreen;
