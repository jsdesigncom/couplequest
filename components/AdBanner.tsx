import React from 'react';

const AdBanner: React.FC = () => {
  return (
    <div className="w-full max-w-md mx-auto mt-6 bg-[#1A1A2E]/60 backdrop-blur-sm border border-slate-700 rounded-2xl p-4 text-center shadow-lg animate-fade-in-up">
      <h4 className="font-bold text-white">Promote your local business!</h4>
      <p className="text-sm text-slate-300 mt-1">Reach couples looking for their next adventure.</p>
      <div className="mt-3 text-sm">
        <span className="text-slate-300">Contact us: </span>
        <span className="font-semibold text-[#D6A24D]">earle@hdqtrz.com</span>
      </div>
    </div>
  );
};

export default AdBanner;
