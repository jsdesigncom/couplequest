import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DateIdea, UserProfile, LocationCoords, DistancePreference } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import { generateDateIdea } from './services/geminiService';
import WelcomeScreen from './components/WelcomeScreen';
import AuthScreen from './components/AuthScreen';
import ActivityCard from './components/ActivityCard';
import LoadingSpinner from './components/LoadingSpinner';
import HistoryPanel from './components/HistoryPanel';
import GuidePanel from './components/GuidePanel';
import AdBanner from './components/AdBanner';
import { RefreshIcon, HistoryIcon, HeartIcon, QuestionMarkIcon, HomeIcon } from './components/icons';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useLocalStorage<string | null>('currentUser', null);

  // Dynamically generate keys based on the logged-in user
  const profileKey = currentUser ? `couple-profile-${currentUser}` : null;
  const historyKey = currentUser ? `date-history-${currentUser}` : null;
  const favoritesKey = currentUser ? `date-favorites-${currentUser}` : null;

  const [profile, setProfile] = useLocalStorage<UserProfile | null>(profileKey, null);
  const [history, setHistory] = useLocalStorage<DateIdea[]>(historyKey, []);
  const [favorites, setFavorites] = useLocalStorage<DateIdea[]>(favoritesKey, []);
  
  const [currentIdea, setCurrentIdea] = useState<DateIdea | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<LocationCoords>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [manualLocationInput, setManualLocationInput] = useState('');
  const [manualLocationQuery, setManualLocationQuery] = useState('');
  const [distancePreference, setDistancePreference] = useState<DistancePreference>('any');
  const justSavedProfile = useRef(false);
  
  // Set initial idea from history when data loads for a user
  useEffect(() => {
    // Do not interfere while a new idea is being generated or right after a profile save.
    if (isLoading || justSavedProfile.current) {
      return;
    }

    if (history.length > 0 && !currentIdea) {
      setCurrentIdea(history[0]);
    } else if (history.length === 0) {
      setCurrentIdea(null);
    }
  }, [history, currentIdea, isLoading, justSavedProfile]);


  const requestLocation = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setError(null);
        setManualLocationQuery(''); // Prioritize fresh GPS data
      },
      (err) => {
        console.warn(`ERROR(${err.code}): ${err.message}`);
        setError("Location access denied. Enter your city for local ideas.");
      }
    );
  }, []);

  useEffect(() => {
    if (profile) {
      requestLocation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);
  
  const handleGenerateIdea = useCallback(async () => {
    if (!profile || isLoading) return;

    setIsLoading(true);
    justSavedProfile.current = false; // Reset the flag here, ensuring it's false when generation starts
    setError(null);
    setCurrentIdea(null); // Clear current idea explicitly before fetching new one

    const newIdea = await generateDateIdea(profile, location, manualLocationQuery, history, distancePreference);

    if (newIdea) {
      setCurrentIdea(newIdea);
      setHistory(prevHistory => [newIdea, ...prevHistory]);
    } else {
      setError("Oops! Couldn't generate an idea. Please try again.");
      // Only restore history[0] if the *new* generation failed.
      if (history.length > 0) {
        setCurrentIdea(history[0]);
      }
    }
    setIsLoading(false);
  }, [profile, isLoading, location, manualLocationQuery, history, setHistory, distancePreference]);
  
  // Effect to automatically generate an idea when a new profile is saved.
  useEffect(() => {
    if (justSavedProfile.current && profile) {
      // The flag is now reset inside handleGenerateIdea
      handleGenerateIdea();
    }
  }, [profile, handleGenerateIdea]);

  const handleProfileSave = (newProfile: UserProfile) => {
    setProfile(newProfile); // Set the profile first
    justSavedProfile.current = true; // Then set the flag
    setCurrentIdea(null); // Explicitly clear the current idea
    requestLocation();
  };

  const handleLogout = () => {
    setCurrentUser(null);
    // Reset all state when logging out
    setProfile(null);
    setHistory([]);
    setFavorites([]);
    setCurrentIdea(null);
    setError(null);
    setLocation(null);
    setManualLocationQuery('');
  };

  const handleResetProfile = () => {
    setProfile(null);
    setCurrentIdea(null);
    setError(null);
  };
  
  const handleManualLocationSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualLocationInput.trim()) {
      setManualLocationQuery(manualLocationInput.trim());
      setError(null); // Hide the input form
      setManualLocationInput(''); // Clear the input field
    }
  };

  const handleFavoriteToggle = (ideaId: string) => {
    const isFavorited = favorites.some(fav => fav.id === ideaId);
    if (isFavorited) {
      setFavorites(favorites.filter(fav => fav.id !== ideaId));
    } else {
      const ideaToFavorite = history.find(idea => idea.id === ideaId) || currentIdea;
      if (ideaToFavorite && ideaToFavorite.id === ideaId) {
        setFavorites([ideaToFavorite, ...favorites]);
      }
    }
  };
  
  const isCurrentIdeaFavorited = currentIdea ? favorites.some(fav => fav.id === currentIdea.id) : false;

  if (!currentUser) {
    return <AuthScreen onLogin={setCurrentUser} />;
  }

  if (!profile) {
    return <WelcomeScreen onProfileSave={handleProfileSave} />;
  }
  
  const renderMainContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }
    if (error && !error.startsWith("Location access")) {
      return <p className="text-red-400 text-center">{error}</p>;
    }
    if (currentIdea) {
      return (
        <div className="animate-fade-in-up w-full max-w-md">
          <ActivityCard idea={currentIdea} />
          <AdBanner />
        </div>
      );
    }
    return (
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-slate-200">Ready for an adventure?</h2>
        <p className="text-slate-400 mt-2">Click "Surprise Us" to get your first date idea!</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#1A1A2E] to-[#10101A] text-white p-4 flex flex-col items-center justify-between font-sans relative overflow-x-hidden">
      <header className="w-full max-w-md grid grid-cols-3 items-center z-10">
        <div className="flex justify-start">
            <button onClick={handleResetProfile} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition" aria-label="Reset Profile">
                <HomeIcon />
            </button>
        </div>
        <h1 className="text-2xl font-bold text-white text-center">CoupleQuest</h1>
        <div className="flex justify-end space-x-2">
            <button onClick={() => setIsGuideOpen(true)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition" aria-label="How to use">
                <QuestionMarkIcon />
            </button>
            <button onClick={() => setIsHistoryOpen(true)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition" aria-label="View History">
                <HistoryIcon />
            </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center w-full py-8">
        {error && error.startsWith("Location access") && (
          <div className="bg-red-900/30 border border-red-600/50 rounded-2xl p-4 text-center w-full max-w-md mb-6 shadow-lg animate-fade-in">
            <p className="text-red-300 font-medium mb-3">{error}</p>
            <form onSubmit={handleManualLocationSave} className="flex gap-2">
              <input 
                type="text" 
                value={manualLocationInput}
                onChange={(e) => setManualLocationInput(e.target.value)}
                placeholder="e.g., San Francisco, CA or 94105"
                aria-label="Enter your location manually"
                className="flex-grow bg-slate-800 border border-slate-700 rounded-md p-2 text-white focus:ring-2 focus:ring-[#D6A24D] focus:outline-none transition placeholder-slate-500"
              />
              <button 
                type="submit" 
                className="bg-[#D6A24D] hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-lg transition duration-300 transform hover:scale-105"
              >
                Save
              </button>
            </form>
          </div>
        )}

        <div className="w-full max-w-md mb-6 animate-fade-in">
            <div className="flex bg-slate-800/50 p-1 rounded-full backdrop-blur-sm">
                <button
                    onClick={() => setDistancePreference('local')}
                    className={`flex-1 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${distancePreference === 'local' ? 'bg-[#D6A24D] text-black shadow-md' : 'text-slate-300'}`}
                >
                    Local
                </button>
                <button
                    onClick={() => setDistancePreference('day_trip')}
                    className={`flex-1 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${distancePreference === 'day_trip' ? 'bg-[#D6A24D] text-black shadow-md' : 'text-slate-300'}`}
                >
                    Day Trip
                </button>
                <button
                    onClick={() => setDistancePreference('any')}
                    className={`flex-1 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${distancePreference === 'any' ? 'bg-[#D6A24D] text-black shadow-md' : 'text-slate-300'}`}
                >
                    Surprise Me
                </button>
            </div>
        </div>
        
        {renderMainContent()}

      </main>

      <footer className="w-full max-w-md flex items-center justify-center space-x-4 sticky bottom-4 z-10">
        <button 
          onClick={() => currentIdea && handleFavoriteToggle(currentIdea.id)}
          disabled={!currentIdea || isLoading}
          aria-label={isCurrentIdeaFavorited ? "Remove from favorites" : "Save to favorites"}
          className={`p-4 rounded-full transition-transform transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${isCurrentIdeaFavorited ? 'bg-[#D6A24D] text-black' : 'bg-white/10 hover:bg-white/20'}`}
        >
          <HeartIcon className="w-7 h-7" />
        </button>
        <button 
          onClick={handleGenerateIdea}
          disabled={isLoading}
          className="flex-grow bg-[#D6A24D] hover:bg-yellow-600 text-black font-bold py-4 px-8 rounded-full text-lg shadow-lg transition-transform transform hover:scale-105 disabled:bg-yellow-800 disabled:cursor-wait flex items-center justify-center gap-2"
        >
          <RefreshIcon className="w-6 h-6" />
          <span>{isLoading ? 'Thinking...' : 'Surprise Us'}</span>
        </button>
      </footer>

      <HistoryPanel 
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        favorites={favorites}
        onFavoriteToggle={handleFavoriteToggle}
        onIdeaSelect={setCurrentIdea}
        onLogout={handleLogout}
      />
      
      <GuidePanel 
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

    </div>
  );
};

export default App;