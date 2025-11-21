import { DateIdea, UserProfile, LocationCoords } from '../types';

const API_ENDPOINT = process.env.API_ENDPOINT || 'http://localhost:3001/api/generate-date-idea';

export const generateDateIdea = async (
  profile: UserProfile,
  location: LocationCoords,
  manualLocation: string,
  history: DateIdea[]
): Promise<DateIdea | null> => {
  try {
    const recentlySuggestedTitles = history.slice(0, 20).map(idea => idea.title).join(', ');

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
        recentTitles: recentlySuggestedTitles
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