// api/generate-date-idea.js
// Updated to use Gemini 2.5 Flash (latest stable model with thinking capabilities)

// Helper function to set CORS headers
const setCorsHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://couplequestlive.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400'); // Cache preflight for 24 hours
};

export default async function handler(req, res) {
  // Set CORS headers FIRST, before anything else
  setCorsHeaders(res);
  
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
    
    // Validate
    if (!profile?.interests) {
      return res.status(400).json({ error: 'Invalid request' });
    }
    
    // Get API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Server configuration error' });
    }
    
    // Build prompt
    let locationPrompt = '';
    if (location?.latitude && location.longitude) {
      locationPrompt = `Location: ${location.latitude}, ${location.longitude}`;
    } else if (manualLocation) {
      locationPrompt = `Location: ${manualLocation}`;
    }
    
    const prompt = `Generate a date idea for a couple.

Profile:
- Interests: ${profile.interests}
- Budget: ${profile.preferred_budget.join(', ')}
- Availability: ${profile.availability.join(', ')}
${locationPrompt}

Avoid: ${recentTitles || 'none'}

Return JSON with: title, description, budget, time_required, couple_benefit, category, is_local, location_details`;
    
    // Call Gemini 2.5 Flash with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000); // 25 second timeout
    
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
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
        }),
        signal: controller.signal
      }
    );
    
    clearTimeout(timeout);
    
    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.status}`);
    }
    
    const data = await geminiResponse.json();
    
    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      const idea = JSON.parse(data.candidates[0].content.parts[0].text.trim());
      return res.status(200).json({
        ...idea,
        id: new Date().toISOString()
      });
    }
    
    throw new Error('Invalid API response');
    
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ 
      error: 'Failed to generate date idea',
      details: error.message 
    });
  }
}