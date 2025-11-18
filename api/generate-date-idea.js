// api/generate-date-idea.js
// Vercel Serverless Function with Fixed CORS

export default async function handler(req, res) {
  // Set CORS headers for ALL responses
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', 'https://couplequestlive.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
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
    
    // Get API key from environment variable
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
      locationPromptPart = 'Since their location is unavailable, please prioritize universal activities that can be done anywhere.';
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
              title: { type: 'string' },
              description: { type: 'string' },
              budget: { type: 'string' },
              time_required: { type: 'string' },
              couple_benefit: { type: 'string' },
              category: { type: 'string' },
              is_local: { type: 'boolean' },
              location_details: { type: 'string' }
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
      console.error('Unexpected API response:', data);
      return res.status(500).json({ 
        error: 'Unexpected response from AI service' 
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error'
    });
  }
}
