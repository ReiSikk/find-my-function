"use client"

import React from 'react'
import { Activity } from '@/lib/types'
import { calculateWeeklyTotals, formatTime, formatDistance } from '@/lib/utils/activity-totals'
import { Calendar, Clock, MapPin, Dumbbell, Bike, Footprints, Zap } from 'lucide-react'

interface WeeklySummaryProps {
  activities: Activity[]
}

export function WeeklySummary({ activities }: WeeklySummaryProps) {
  const weeklyTotals = calculateWeeklyTotals(activities)

  const summaryCards = [
    {
      title: 'Running',
      icon: <Footprints className="h-5 w-5" />,
      data: weeklyTotals.running,
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Cycling',
      icon: <Bike className="h-5 w-5" />,
      data: weeklyTotals.cycling,
      color: 'bg-green-50 border-green-200',
      iconColor: 'text-green-600'
    },
    {
      title: 'Weight Training',
      icon: <Dumbbell className="h-5 w-5" />,
      data: weeklyTotals.weightTraining,
      color: 'bg-purple-50 border-purple-200',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Week in Total',
      icon: <Zap className="h-5 w-5" />,
      data: weeklyTotals.overall,
      color: 'bg-rose-50 border-rose-200',
      iconColor: 'text-purple-600'
    }
  ]

  return (
    <div className="mb-12">
      <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Calendar className="h-5 w-5" />
        Your weekly summary
      </h4>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {summaryCards.map((card) => (
          <div 
            key={card.title}
            className={`p-4 rounded-lg border shadow-md min-w-[250px] ${card.color}`}
          >
            <div className="flex items-start justify-between gap-2 mb-4">
                <div className='flex nowrap items-start gap-2'>
                    <div className={`${card.iconColor} mt-2`}>
                        {card.icon}
                    </div>
                    <h5 className="font-medium h4-grotesk">{card.title}</h5>
                </div>
                {('sessionCount' in card.data ? card.data.sessionCount : card.data.totalSessions) > 0 && (
                <div className="text-xs px-2 py-1 flex gap-1 border border-(--color-primary) bg-(--color-primary) text-(--color-bg) rounded-md">
                  <span>
                    {('sessionCount' in card.data ? card.data.sessionCount : card.data.totalSessions)}
                   </span> 
                   <span>
                     session{('sessionCount' in card.data ? card.data.sessionCount : card.data.totalSessions) !== 1 ? 's' : ''}
                   </span>
                </div>
              )}
            </div>
            
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 opacity-60" />
                <span className="h5 h5-grotesk">{formatTime(card.data.totalTime)}</span>
              </div>
              
              {'totalDistance' in card.data && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 opacity-60" />
                  <span className="h5 h5-grotesk">{formatDistance(card.data.totalDistance as number)}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}