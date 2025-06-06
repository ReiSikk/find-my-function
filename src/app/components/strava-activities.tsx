"use client"
import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { ActivityCard } from './activity-card'


export default function StravaActivities() {
     const { user, isLoaded } = useUser();
     const [activities, setActivities] = useState([]);
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState<string | null>(null);


     async function getActivities() {
        
        try {
            setLoading(true);
            setError(null);

            if (!user) {
                throw new Error('User not authenticated');
            }

            // Fetch activities from Strava API via defined API route
            const response = await fetch('/api/strava/activities', {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const stravaActivities = await response.json();
            console.log("Strava activities:", stravaActivities);
            
            setActivities(stravaActivities);

        } catch (err) {
        console.error('Error fetching activities:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        } finally {
        setLoading(false);
        }
    }

     useEffect(() => {
        if (isLoaded && user) {
        getActivities();
        }
    }, [isLoaded, user]);

    if (!isLoaded) {
        return <div>Loading user...</div>;
    }

    if (!user) {
        return <div>Please sign in to view Strava activities</div>;
    }

    if (loading) {
        return (
             <div className="flex min-h-[200px] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[--color-primary] border-t-transparent" />
                <div>Loading Strava activities...</div>
              </div>
        )
    }

    if (error) {
        return (
        <div>
            <p>Error: {error}</p>
            <button onClick={getActivities}>Retry</button>
        </div>
        );
    }

      if (activities.length === 0) {
            return (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
                <p className="text-gray-500">No activities found</p>
            </div>
            )
       }



  return (
    <div>
        <div className="flex items-center md:justify-between flex-wrap gap-4 mb-8">
        <h3 className="h4">Your recent Strava activities</h3>
        <button className="btn-main btn-main--alt" onClick={getActivities}>Refresh Activities</button>
        </div>
      {activities.length === 0 ? (
        <p>No activities found</p>
      ) : (
        <ul className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {activities.map((activity: any, index) => (
            <ActivityCard activity={activity} key={index} />
          ))}
        </ul>
      )}
    </div>
  )
}

