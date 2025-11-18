import { Ad } from '../types';

// A mock database of available advertisements
const mockAds: Ad[] = [
  {
    id: 'ad-101',
    advertiser: 'Gourmet Burger Bar',
    headline: 'Half-Price Burgers on Tuesdays!',
    description: 'The juiciest, most flavorful burgers in town. Perfect for a casual date night.',
    imageUrl: 'https://picsum.photos/seed/burgers/200/200',
    callToAction: 'View Menu',
    url: '#',
    locations: ['San Francisco', 'san francisco ca', '94105'],
  },
  {
    id: 'ad-102',
    advertiser: 'City Kayak Rentals',
    headline: 'Explore the Bay by Kayak',
    description: 'A romantic and adventurous way to see the city skyline from the water.',
    imageUrl: 'https://picsum.photos/seed/kayak/200/200',
    callToAction: 'Book Now',
    url: '#',
    locations: ['San Francisco', 'san francisco ca'],
  },
  {
    id: 'ad-201',
    advertiser: 'Starlight Drive-In',
    headline: 'Movie Night Under the Stars',
    description: 'Cuddle up and enjoy a classic film from the comfort of your car.',
    imageUrl: 'https://picsum.photos/seed/drivein/200/200',
    callToAction: 'See Showtimes',
    url: '#',
    locations: ['Austin'],
  },
  {
    id: 'ad-901',
    advertiser: 'CrateJoy',
    headline: 'The Perfect Date Night, Delivered.',
    description: 'Get a curated box of activities, snacks, and everything you need for a fun night in.',
    imageUrl: 'https://picsum.photos/seed/datebox/200/200',
    callToAction: 'Learn More',
    url: '#',
    // No location means this is a generic, worldwide ad
  },
  {
    id: 'ad-902',
    advertiser: 'MasterClass',
    headline: 'Learn a New Skill Together',
    description: 'Take a cooking, painting, or mixology class online from the world\'s best.',
    imageUrl: 'https://picsum.photos/seed/class/200/200',
    callToAction: 'Explore Classes',
    url: '#',
  },
];

/**
 * Simulates fetching an advertisement from an ad network.
 * It tries to find an ad targeted to the user's location,
 * otherwise falls back to a generic ad.
 * @param location A string representing the user's location (e.g., "San Francisco, CA")
 * @returns A promise that resolves to an Ad object or null.
 */
export const getAdForLocation = async (location: string): Promise<Ad | null> => {
  console.log(`Fetching ad for location: ${location}`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const lowerCaseLocation = location.toLowerCase();
  
  // Find ads specifically targeted to the user's location
  const targetedAds = mockAds.filter(ad => 
    ad.locations?.some(loc => lowerCaseLocation.includes(loc.toLowerCase()))
  );

  if (targetedAds.length > 0) {
    // Return a random targeted ad
    const randomIndex = Math.floor(Math.random() * targetedAds.length);
    return targetedAds[randomIndex];
  }

  // If no targeted ads, find generic ads (those without a 'locations' property)
  const genericAds = mockAds.filter(ad => !ad.locations);
  
  if (genericAds.length > 0) {
    // Return a random generic ad
    const randomIndex = Math.floor(Math.random() * genericAds.length);
    return genericAds[randomIndex];
  }

  // Return null if no ads are available
  return null;
};
