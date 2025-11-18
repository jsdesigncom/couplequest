import React from 'react';
import { DateIdea } from '../types';
import { HeartIcon, MapPinIcon, DollarIcon, ClockIcon } from './icons';

interface ActivityCardProps {
  idea: DateIdea;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ idea }) => {

  const getDirectionsUrl = (details: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(details)}`;
  };

  return (
    <div className="bg-[#1A1A2E]/60 backdrop-blur-sm border border-slate-800 rounded-2xl shadow-lg w-full max-w-md mx-auto overflow-hidden animate-fade-in-up">
      <img src={`https://picsum.photos/seed/${idea.id}/600/300`} alt={idea.title} className="w-full h-48 object-cover" />
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">{idea.title}</h2>
          <span className="px-3 py-1 text-sm font-semibold rounded-full bg-[#D6A24D]/10 text-[#D6A24D]">
            {idea.category}
          </span>
        </div>
        
        <p className="text-slate-300 mb-4">{idea.description}</p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6 text-slate-300">
            <div className="flex items-center space-x-2">
                <DollarIcon className="text-[#D6A24D]"/> <span>{idea.budget}</span>
            </div>
            <div className="flex items-center space-x-2">
                <ClockIcon className="text-[#D6A24D]"/> <span>{idea.time_required}</span>
            </div>
             {idea.is_local && idea.location_details && (
              <div className="flex items-center space-x-2 col-span-2 sm:col-span-1">
                <MapPinIcon className="text-[#D6A24D]"/> <span>Local</span>
              </div>
            )}
        </div>

        <div className="bg-black/20 p-4 rounded-lg mb-6">
          <h3 className="flex items-center text-md font-semibold text-[#D6A24D] mb-2">
            <HeartIcon className="w-5 h-5 mr-2" />
            Why you'll love it
          </h3>
          <p className="text-slate-300 text-sm">{idea.couple_benefit}</p>
        </div>
        
        {idea.is_local && idea.location_details && (
          <a
              href={getDirectionsUrl(idea.location_details)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full block text-center bg-[#D6A24D] hover:bg-yellow-600 text-black font-bold py-3 px-4 rounded-lg transition duration-300"
          >
              Get Directions
          </a>
        )}
      </div>
    </div>
  );
};

export default ActivityCard;