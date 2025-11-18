// api/generate-date-idea.js
// Vercel Serverless Function for CoupleQuest Backend

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://couplequestlive.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { profile, location, manualLocation, recentTitles } = req.body;
    
    // Validate request
    if (!profile || !profile.interests) {
      return res.status(400).json({ 
        error: 'Invalid request: profile with interests is required' 
      });
    }
    
    // Get API key from environment variable (set in Vercel dashboard)
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error('GEMINI_API_KEY not configured');
      return res.status(500).json({ error: 'Server configuration error' });
    }
    
    // Build location prompt
    let locationPromptPart = '';
    if (location?.latitude && location.longitude) {
      locationPromptPart = `Their current location is approximately latitude ${location.latitude} and longitude ${location.longitude}. If you suggest a local activity (like a specific restaurant, park, or venue), make it near this location.`;
    } else if (manualLocation) {
      locationPromptPart = `Their current location is near ${manualLocation}. If you suggest a local activity (like a specific restaurant, park, or venue), make it in or very close to this area.`;
    } else {
      locationPromptPart = 'Since their location is unavailable, please prioritize universal activities that can be done anywhere. If you must suggest a local type of activity, do not name a specific business or address.';
    }
    
    // Build the prompt
    const prompt = `
A couple is looking for a date idea. Please generate a creative and engaging suggestion.

Their Profile:
- Interests: ${profile.interests}
- Preferred Budgets: ${profile.preferred_budget.join(', ')}
- Availability: ${profile.availability.join(', ')}

Location context: ${locationPromptPart}

To ensure variety, please AVOID suggesting ideas similar to these recent ones: ${recentTitles || 'None yet'}.

Generate one new, unique date idea that fits their profile and location.
`;
    
    // Call Gemini API
    const geminiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
    
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 1.0,
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'object',
            properties: {
              title: { 
                type: 'string', 
                description: 'A short, catchy title for the date idea (max 5 words).' 
              },
              description: { 
                type: 'string', 
                description: 'A one or two sentence description of the activity.' 
              },
              budget: { 
                type: 'string', 
                description: "A budget rating: 'Free', '$' (Inexpensive), '$$' (Moderate), or '$$$' (Expensive)." 
              },
              time_required: { 
                type: 'string', 
                description: "Estimated time for the date, e.g., '1-2 hours'." 
              },
              couple_benefit: { 
                type: 'string', 
                description: "A short explanation of why this activity is good for a couple's relationship." 
              },
              category: { 
                type: 'string', 
                description: "A single category for the activity from this list: 'Outdoor', 'Dining', 'At-Home', 'Creative', 'Romantic', 'Adventure', 'Wellness', 'Entertainment'." 
              },
              is_local: { 
                type: 'boolean', 
                description: 'True if this is a location-specific activity (like a specific restaurant or park), false otherwise.' 
              },
              location_details: { 
                type: 'string', 
                description: 'If local, the name of a specific place or address. Otherwise, an empty string.' 
              }
            },
            required: ['title', 'description', 'budget', 'time_required', 'couple_benefit', 'category', 'is_local', 'location_details']
          }
        }
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      return res.status(response.status).json({ 
        error: 'Failed to generate date idea' 
      });
    }
    
    const data = await response.json();
    
    // Extract the generated content
    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      const ideaText = data.candidates[0].content.parts[0].text.trim();
      const idea = JSON.parse(ideaText);
      
      // Add ID and return
      const dateIdea = {
        ...idea,
        id: new Date().toISOString()
      };
      
      return res.status(200).json(dateIdea);
    } else {
      console.error('Unexpected API response structure:', data);
      return res.status(500).json({ 
        error: 'Unexpected response from AI service' 
      });
    }
    
  } catch (error) {
    console.error('Error generating date idea:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
