import React from 'react';
import { CloseIcon } from './icons';

interface GuidePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const GuideSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
        <h3 className="text-xl font-bold text-[#D6A24D] mb-2">{title}</h3>
        <div className="space-y-2 text-slate-300">{children}</div>
    </div>
);

const GuidePanel: React.FC<GuidePanelProps> = ({ isOpen, onClose }) => {
  return (
    <div className={`fixed inset-0 z-50 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-[#10101A] shadow-2xl flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-slate-800 sticky top-0 bg-[#10101A] z-10">
          <h2 className="text-xl font-bold text-white">How to Use CoupleQuest</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white">
            <CloseIcon />
          </button>
        </div>
        
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
            <GuideSection title="What is CoupleQuest?">
                <p>CoupleQuest is your infinite date idea generator, personalized to your preferences and location to help you and your partner discover endless adventures together.</p>
            </GuideSection>

            <GuideSection title="Getting Started">
                <p><strong>1. Grant Location Permission:</strong> For the best local suggestions, allow CoupleQuest to access your location when prompted. You can also manually enter a city if you prefer.</p>
                <p><strong>2. Create Your Profile:</strong> Tell us about your shared interests, preferred budget, and availability. This helps us tailor the perfect date ideas for you.</p>
            </GuideSection>

            <GuideSection title="The Activity Card">
                <p>Once an idea is generated, you'll see a card with all the details:</p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                    <li><strong>Description, Time & Budget:</strong> Get a quick overview of the activity.</li>
                    <li><strong>Why You'll Love It:</strong> See a special tip on how the date can benefit your relationship.</li>
                    <li><strong>Directions:</strong> For local spots, a single tap gets you directions on Google Maps.</li>
                    <li><strong>Save & Shuffle:</strong> Use the Heart icon to save the idea to your favorites, or hit "Surprise Us" again for another suggestion.</li>
                </ul>
            </GuideSection>
            
            <GuideSection title="History & Favorites">
                <p>Tap the clock icon in the top-right to access your history.</p>
                 <ul className="list-disc list-inside space-y-1 pl-2">
                    <li><strong>Favorites:</strong> Here you can view all your saved ideas, perfect for when you're ready to revisit a great plan.</li>
                    <li><strong>History:</strong> The app keeps a log of your past suggestions so you never lose a great idea.</li>
                </ul>
            </GuideSection>

            <GuideSection title="Settings">
                <p>Need to make a change? Tap the home icon in the top-left to reset your profile.</p>
                 <ul className="list-disc list-inside space-y-1 pl-2">
                    <li><strong>Update Preferences:</strong> Change your interests, budget, or availability anytime.</li>
                    <li><strong>Change Location:</strong> Resetting also allows the app to re-fetch your current location or for you to enter a new manual one.</li>
                </ul>
            </GuideSection>

            <GuideSection title="Contact & Support">
                <p>Have a question, feedback, or a feature request? We'd love to hear from you!</p>
                <p>Email us at: <span className="font-semibold text-[#D6A24D]">earle@hdqtrz.com</span></p>
            </GuideSection>
        </div>
      </div>
    </div>
  );
};

export default GuidePanel;