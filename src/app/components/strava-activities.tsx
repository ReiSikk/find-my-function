"use client"
import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { ActivityCard } from './activity-card'
import { Activity } from '@/lib/types'
import { Spinner } from '@/components/ui/spinner'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


export default function StravaActivities() {
     const { user, isLoaded } = useUser();
     const [activities, setActivities] = useState([]);
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState<string | null>(null);
     const [accordionValue, setAccordionValue] = useState<string>("activities");


     // Fetch Strava Data from API
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
            
            setActivities(stravaActivities);

        } catch (err) {
        console.error('Error fetching activities:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        } finally {
        setLoading(false);
        }
    }

    // Handle Strava Activity Type formatting
    const formatActivityType = (activityType: string): string => {
      if (!activityType) {
        return 'Unknown Activity'
      }

      // Add space before capital letters and capitalize first letter
      return activityType
        .replace(/([A-Z])/g, ' $1') // Add space before capital letters
        .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
        .trim()
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
          <div className="flex min-h-[200px] gap-2 items-center justify-center">
              <Spinner />
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
    <div className='stravaActivities'>
      <div className="flex items-center md:justify-between flex-wrap gap-4 w-full mb-8">
        <h3 className="h4">Your recent Strava activities</h3>
        <button 
          type='button' 
          className="btn-main btn-main--alt" 
          onClick={getActivities}
          >
            Refresh Activities
        </button>
      </div>
      <Accordion 
        type="single" 
        collapsible 
        value={accordionValue}
        onValueChange={setAccordionValue}
      >
        <AccordionItem value="activities">
          <AccordionTrigger className="text-left px-4 cursor-pointer border border-(--color-primary) data-[state=closed]:bg-(--color-primary) data-[state=closed]:text-(--color-bg) [&[data-state=closed]>span]:text-(--color-primary) items-center">
            <div className="h6 tracking-medium uppercase">
              {accordionValue === "" ? 'View Strava activities' : 'Collapse Strava activities'} ({activities.length})
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4'>
              {activities.map((activity: Activity, index) => (
                <ActivityCard 
                key={index} 
                activity={{
                  ...activity,
                  sport_type: formatActivityType(activity.sport_type)
                }}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

