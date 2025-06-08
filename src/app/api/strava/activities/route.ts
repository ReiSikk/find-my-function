import { NextResponse } from 'next/server';
import { auth, clerkClient, currentUser } from '@clerk/nextjs/server';

export async function GET() {
  try {
    console.log('Starting Strava API route...');
    
    const { userId } = await auth();
    console.log("userId", userId);
    
    const user = await currentUser();
    console.log("user:", user?.id);

    if (!userId) {
      console.log('No user ID found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
    console.log("token", token);

    // Fetch activities from Strava API
    const stravaResponse = await fetch('https://www.strava.com/api/v3/athlete/activities', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log("stravaResponse", stravaResponse);

    if (!stravaResponse.ok) {
      return NextResponse.json(
        { error: `Strava API error: ${stravaResponse.status}` }, 
        { status: stravaResponse.status }
      );
    }

    const activities = await stravaResponse.json();
    return NextResponse.json(activities);

  } catch (error) {
    console.error('Error fetching Strava activities:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}