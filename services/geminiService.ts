
import { GoogleGenAI, Type } from '@google/genai';
import { DateIdea, UserProfile, LocationCoords, DistancePreference } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const dateIdeaSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A short, catchy title for the date idea (max 5 words)." },
    description: { type: Type.STRING, description: "A one or two sentence description of the activity." },
    budget: { type: Type.STRING, description: "A budget rating: 'Free', '$' (Inexpensive), '$$' (Moderate), or '$$$' (Expensive)." },
    time_required: { type: Type.STRING, description: "Estimated time for the date, e.g., '1-2 hours'." },
    couple_benefit: { type: Type.STRING, description: "A short explanation of why this activity is good for a couple's relationship." },
    category: { type: Type.STRING, description: "A single category for the activity from this list: 'Outdoor', 'Dining', 'At-Home', 'Creative', 'Romantic', 'Adventure', 'Wellness', 'Entertainment'." },
    is_local: { type: Type.BOOLEAN, description: "True if this is a location-specific activity (like a specific restaurant or park), false otherwise." },
    location_details: { type: Type.STRING, description: "If local, the name of a specific place or address. Otherwise, an empty string." }
  },
  required: ["title", "description", "budget", "time_required", "couple_benefit", "category", "is_local", "location_details"]
};

export const generateDateIdea = async (
  profile: UserProfile,
  location: LocationCoords,
  manualLocation: string,
  history: DateIdea[],
  distancePreference: DistancePreference
): Promise<DateIdea | null> => {
  try {
    const recentlySuggestedTitles = history.slice(0, 20).map(idea => idea.title).join(', ');

    let locationPromptPart = '';
    if (location?.latitude && location.longitude) {
      locationPromptPart = `Their current location is approximately latitude ${location.latitude} and longitude ${location.longitude}. If you suggest a local activity (like a specific restaurant, park, or venue), make it near this location.`;
    } else if (manualLocation) {
      locationPromptPart = `Their current location is near ${manualLocation}. If you suggest a local activity (like a specific restaurant, park, or venue), make it in or very close to this area.`;
    } else {
        locationPromptPart = 'Since their location is unavailable, please prioritize universal activities that can be done anywhere. If you must suggest a local type of activity, do not name a specific business or address.'
    }
    
    let distancePromptPart = '';
    switch (distancePreference) {
      case 'local':
        distancePromptPart = 'The couple wants a date idea that is strictly local and very close to their specified location. Do not suggest anything that would require a long drive. The "is_local" flag in the response MUST be true.';
        break;
      case 'day_trip':
        distancePromptPart = 'The couple is looking for a fun day trip. Suggest an activity that is within a 2-3 hour drive from their location. This should feel like a mini-adventure away from their home area. The "is_local" flag in the response MUST be true for this kind of suggestion as well, since it refers to a specific destination.';
        break;
      case 'any':
      default:
        distancePromptPart = 'You have the freedom to suggest either a strictly local activity or a day trip that might be a few hours away. Surprise them!';
        break;
    }

    const prompt = `
      A couple is looking for a date idea. Please generate a creative and engaging suggestion.
      
      Their Profile:
      - Interests: ${profile.interests}
      - Preferred Budgets: ${profile.preferred_budget.join(', ')}
      - Availability: ${profile.availability.join(', ')}

      Location context: ${locationPromptPart}

      Date Distance Preference: ${distancePromptPart}

      To ensure variety, please AVOID suggesting ideas similar to these recent ones: ${recentlySuggestedTitles}.

      Generate one new, unique date idea that fits their profile, location, and distance preference.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: dateIdeaSchema,
        temperature: 1,
      },
    });

    const text = response.text.trim();

    if (!text) {
        console.error("Invalid response structure from API:", response);
        throw new Error("Received empty or invalid response from API.");
    }
    
    const newIdea = JSON.parse(text) as Omit<DateIdea, 'id'>;
    return { ...newIdea, id: new Date().toISOString() };

  } catch (error) {
    console.error("Error generating date idea:", error);
    return null;
  }
};
