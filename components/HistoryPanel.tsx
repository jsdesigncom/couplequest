import React from 'react';
import { DateIdea } from '../types';
import { CloseIcon, HeartIcon, LogoutIcon } from './icons';

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  history: DateIdea[];
  favorites: DateIdea[];
  onFavoriteToggle: (ideaId: string) => void;
  onIdeaSelect: (idea: DateIdea) => void;
  onLogout: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ isOpen, onClose, history, favorites, onFavoriteToggle, onIdeaSelect, onLogout }) => {
  const [activeTab, setActiveTab] = React.useState<'history' | 'favorites'>('history');
  
  const favoriteIds = new Set(favorites.map(f => f.id));

  const renderIdeaItem = (idea: DateIdea) => (
    <div key={idea.id} className="bg-slate-800/50 p-3 rounded-lg flex justify-between items-center mb-2 animate-fade-in-up">
      <button onClick={() => { onIdeaSelect(idea); onClose(); }} className="text-left flex-1 group">
        <p className="text-white font-semibold group-hover:text-[#D6A24D] transition-colors">{idea.title}</p>
        <p className="text-slate-400 text-sm">{idea.category}</p>
      </button>
      <button onClick={() => onFavoriteToggle(idea.id)} className="p-2">
        <HeartIcon className={`w-6 h-6 transition-colors ${favoriteIds.has(idea.id) ? 'text-[#D6A24D]' : 'text-slate-600 hover:text-[#D6A24D]'}`} />
      </button>
    </div>
  );

  return (
    <div className={`fixed inset-0 z-50 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-[#10101A] shadow-2xl flex flex-col custom-scrollbar">
        <div className="flex justify-between items-center p-4 border-b border-slate-800 sticky top-0 bg-[#10101A] z-10">
          <h2 className="text-xl font-bold text-white">Your Adventures</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white">
            <CloseIcon />
          </button>
        </div>
        
        <div className="p-4 border-b border-slate-800 sticky top-[69px] bg-[#10101A] z-10">
          <div className="flex space-x-2">
            <button onClick={() => setActiveTab('history')} className={`flex-1 py-2 rounded-md font-semibold transition ${activeTab === 'history' ? 'bg-[#D6A24D] text-black' : 'bg-slate-800 text-slate-300'}`}>History</button>
            <button onClick={() => setActiveTab('favorites')} className={`flex-1 py-2 rounded-md font-semibold transition ${activeTab === 'favorites' ? 'bg-[#D6A24D] text-black' : 'bg-slate-800 text-slate-300'}`}>Favorites</button>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          {activeTab === 'history' && (
            <>
              {history.length > 0 ? history.map(renderIdeaItem) : <p className="text-slate-400 text-center mt-8">No date ideas generated yet.</p>}
            </>
          )}
          {activeTab === 'favorites' && (
             <>
                {favorites.length > 0 ? favorites.map(renderIdeaItem) : <p className="text-slate-400 text-center mt-8">You haven't saved any favorites.</p>}
            </>
          )}
        </div>

        <div className="p-4 mt-auto border-t border-slate-800">
            <button 
                onClick={onLogout} 
                className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-white font-semibold p-3 rounded-lg hover:bg-slate-800/50 transition-colors"
                aria-label="Logout"
            >
                <LogoutIcon />
                <span>Logout</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryPanel;
