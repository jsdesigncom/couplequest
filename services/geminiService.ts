// services/geminiService.ts
// Secure version - Calls Vercel backend, NOT Gemini directly

import { DateIdea, UserProfile, LocationCoords, DistancePreference } from '../types';

// Backend API endpoint
const API_ENDPOINT = process.env.API_ENDPOINT || 'https://couplequest.vercel.app/api/generate-date-idea';

export const generateDateIdea = async (
  profile: UserProfile,
  location: LocationCoords,
  manualLocation: string,
  history: DateIdea[],
  distancePreference: DistancePreference // Added distancePreference
): Promise<DateIdea | null> => {
  try {
    const recentlySuggestedTitles = history.slice(0, 20).map(idea => idea.title).join(', ');

    // Call our secure Vercel backend (NOT Gemini directly)
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      mode: 'cors',
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        profile,
        location,
        manualLocation,
        recentTitles: recentlySuggestedTitles,
        distancePreference // Added distancePreference to payload
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Backend API error:', errorData);
      throw new Error(errorData.error || 'Failed to generate date idea');
    }

    const dateIdea = await response.json();
    return dateIdea;

  } catch (error) {
    console.error("Error generating date idea:", error);
    return null;
  }
};