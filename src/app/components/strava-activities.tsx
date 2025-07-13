"use client"
import React, { useState, useEffect, useCallback } from 'react'
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
import { WeeklySummary } from './weekly-summary'
import { LucideArrowRight } from 'lucide-react'


export default function StravaActivities() {
     const { user, isLoaded } = useUser();
     const [activities, setActivities] = useState<Activity[]>([]);
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState<string | null>(null);
     const [accordionValue, setAccordionValue] = useState<string>("activities");


     // Fetch Strava Data from API
     const getActivities = useCallback(async () => {
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
     }, [user])

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
    }, [isLoaded, user, getActivities]);

    if (!isLoaded) {
        return <div>Loading user...</div>;
    }

    if (!user) {
        return <div>Please sign in to view activities</div>;
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
        <div className="flex flex-col items-center min-h-[200px] gap-2 items-center justify-center border border-(--color-primary) rounded-none p-6">
          <div className="text-center">
            <p>Log in with Strava to see your activities and get nutritional recommendations.</p>
          </div>
          <button 
          onClick={getActivities} 
          type='button' 
          aria-label='Retry Strava connection'
          className='btn-main mt-4 min-w-[150px]'
          >
            Retry
            <LucideArrowRight className="w-4 h-4" />
          </button>
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
    <div className='stravaActivities mb-2'>
      {activities.length > 0 && <WeeklySummary activities={activities} />}
      <Accordion 
        type="single" 
        collapsible 
        value={accordionValue}
        onValueChange={setAccordionValue}
      >
        <AccordionItem value="activities" className='stravaActivities__accordion'>
          <AccordionTrigger className="text-left px-4 cursor-pointer border border-(--color-primary) data-[state=closed]:bg-(--color-primary) data-[state=closed]:text-(--color-bg) [&[data-state=closed]>span]:text-(--color-primary) items-center">
            <div className="h6 tracking-medium uppercase">
              {accordionValue === "" ? 'View activities' : 'Collapse activities'} ({activities.length})
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

