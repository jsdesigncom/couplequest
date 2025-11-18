import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[#D6A24D]"></div>
      <p className="text-[#D6A24D] font-semibold">Finding your next adventure...</p>
    </div>
  );
};

export default LoadingSpinner;