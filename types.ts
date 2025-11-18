
export interface DateIdea {
  id: string;
  title: string;
  description: string;
  budget: 'Free' | '$' | '$$' | '$$$';
  time_required: string;
  couple_benefit: string;
  category: string;
  is_local: boolean;
  location_details: string;
}

export interface UserProfile {
  interests: string;
  preferred_budget: string[];
  availability: string[];
}

export type LocationCoords = {
  latitude: number;
  longitude: number;
} | null;

export type DistancePreference = 'local' | 'day_trip' | 'any';

// FIX: Added missing Ad interface for use in adService.ts
export interface Ad {
  id: string;
  advertiser: string;
  headline: string;
  description: string;
  imageUrl: string;
  callToAction: string;
  url: string;
  locations?: string[];
}
