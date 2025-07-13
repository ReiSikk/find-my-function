import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

const SYSTEM_PROMPT = process.env.AI_STRAVA_SUMMARY_PROMPT

export async function POST(req: NextRequest) {
    try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { activity } = await req.json()

    if (!activity) {
      return NextResponse.json({ error: 'Activity data required' }, { status: 400 })
    }

       // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || '',
        'X-Title': 'Fuel Your Tempo - Workout Analysis'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat-v3-0324:free',
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: `Analyze this workout activity and provide insights: ${JSON.stringify(activity)}`
          }
        ],
        max_tokens: 800,
        temperature: 0.7,
        stream: false
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('OpenRouter API Error:', errorData)
      throw new Error(`OpenRouter API error: ${response.status}`)
    }

    const data = await response.json()
    const analysis = data.choices[0]?.message?.content

    if (!analysis) {
      throw new Error('No analysis generated')
    }

    return NextResponse.json({ 
      analysis,
      activity: {
        name: activity.name,
        sport_type: activity.sport_type,
        duration: Math.round(activity.moving_time / 60),
        distance: activity.distance ? Math.round(activity.distance / 1000) : null
      }
    })

  } catch (error) {
    console.error('Workout analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze workout' },
      { status: 500 }
    )
  }
}