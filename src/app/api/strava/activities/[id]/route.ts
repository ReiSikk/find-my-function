import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';

export async function GET(
    request: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  try {
    console.log('Starting Strava activity details API route...');
    
    const { userId } = await auth();
    
    if (!userId) {
      console.log('No user ID found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Activity ID is required' }, { status: 400 });
    }

    // Get OAuth access token using Clerk's method
    const client = await clerkClient();
    const { data } = await client.users.getUserOauthAccessToken(
      userId, 
      'custom_strava_provider'
    );

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'No Strava OAuth token found' }, { status: 404 });
    }

    const token = data[0].token;

    // Fetch detailed activity from Strava API
    const stravaResponse = await fetch(`https://www.strava.com/api/v3/activities/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!stravaResponse.ok) {
      return NextResponse.json(
        { error: `Strava API error: ${stravaResponse.status}` }, 
        { status: stravaResponse.status }
      );
    }

    const activityDetails = await stravaResponse.json();
    return NextResponse.json(activityDetails);

  } catch (error) {
    console.error('Error fetching Strava activity details:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
