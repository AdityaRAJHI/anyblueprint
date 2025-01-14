import { GoogleGenerativeAI } from '@google/generative-ai'

if (!process.env.GOOGLE_AI_API_KEY) {
  throw new Error('Missing GOOGLE_AI_API_KEY environment variable')
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY)

export async function POST(req: Request) {
  try {
    const { componentName, description, requirements, type, priority } = await req.json()
    if (!componentName || !description || !requirements || !type || !priority) {
      return Response.json({ error: 'Invalid input: Missing required fields' }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `
      Provide a detailed breakdown for the ${componentName} (${type}) component with ${priority.toUpperCase()} priority.
      
      Component Description: ${description}
      Requirements: ${requirements.join(', ')}

      Format your response as a valid JSON object with this structure:
      {
        "name": "${componentName}",
        "description": "A more detailed description of the component",
        "subComponents": [
          {
            "name": "Sub-component name",
            "description": "Brief description of the sub-component",
            "requirements": ["List of key requirements for the sub-component"]
          }
        ],
        "implementationSteps": [
          {
            "step": "Step title",
            "description": "Detailed step description",
            "codeExample": "Code example if applicable",
            "notes": ["Important implementation notes"]
          }
        ],
        "technicalConsiderations": [
          {
            "aspect": "Technical aspect title",
            "details": "Detailed explanation",
            "mitigation": "How to address this consideration"
          }
        ],
        "requiredTechnologies": [
          {
            "name": "Technology name",
            "purpose": "Why this technology is needed",
            "alternatives": ["Alternative options"]
          }
        ],
        "suggestedLibraries": [
          {
            "name": "Library name",
            "purpose": "What this library helps with",
            "installation": "npm install example"
          }
        ],
        "thirdPartyServices": [
          {
            "name": "Service name",
            "purpose": "What this service provides",
            "integration": "How to integrate this service"
          }
        ]
      }

      Rules:
      1. Response must be ONLY the JSON object, no other text
      2. Ensure all code examples are properly escaped
      3. Focus on practical, actionable steps
      4. Include specific Next.js and React implementation details
      5. Provide real library names and versions
      6. Include error handling considerations
      7. Consider both development and production environments
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    try {
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in response')
      }
      
      const jsonStr = jsonMatch[0]
      const jsonResponse = JSON.parse(jsonStr)

      // Validate the response structure
      if (!jsonResponse.name || !jsonResponse.description || !Array.isArray(jsonResponse.implementationSteps)) {
        throw new Error('Invalid response structure')
      }

      return Response.json(jsonResponse)
    } catch (parseError) {
      console.error('Parse error:', parseError)
      console.error('Raw response:', text)
      return Response.json(
        { error: 'Failed to parse the AI response. Please try again.' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('API Error:', error)
    return Response.json(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
