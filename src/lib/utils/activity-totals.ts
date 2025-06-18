import { Activity } from '@/lib/types'
import { startOfWeek, endOfWeek, isWithinInterval, parseISO } from 'date-fns'

export interface WeeklyTotals {
  running: {
    totalTime: number // in minutes
    totalDistance: number // in kilometers
    sessionCount: number
  }
  cycling: {
    totalTime: number // in minutes
    totalDistance: number // in kilometers
    sessionCount: number
  }
  weightTraining: {
    totalTime: number // in minutes
    sessionCount: number
  }
  overall: {
    totalTime: number // total time across all activities
    totalSessions: number
  }
}

export function calculateWeeklyTotals(
  activities: Activity[], 
  targetDate: Date = new Date()
): WeeklyTotals {
  const weekStart = startOfWeek(targetDate, { weekStartsOn: 1 }) // Monday start
  const weekEnd = endOfWeek(targetDate, { weekStartsOn: 1 })
  
  const weeklyTotals: WeeklyTotals = {
    running: { totalTime: 0, totalDistance: 0, sessionCount: 0 },
    cycling: { totalTime: 0, totalDistance: 0, sessionCount: 0 },
    weightTraining: { totalTime: 0, sessionCount: 0 },
    overall: { totalTime: 0, totalSessions: 0 }
  }

  // Filter activities for current week and calculate totals
  activities
    .filter(activity => {
      const activityDate = parseISO(activity.start_date)
      return isWithinInterval(activityDate, { start: weekStart, end: weekEnd })
    })
    .forEach(activity => {
      const timeInMinutes = Math.round(activity.moving_time / 60)
      const distanceInKm = activity.distance ? activity.distance / 1000 : 0

      switch (activity.sport_type?.toLowerCase()) {
        case 'run':
        case 'running':
        case 'trailrun':
          weeklyTotals.running.totalTime += timeInMinutes
          weeklyTotals.running.totalDistance += distanceInKm
          weeklyTotals.running.sessionCount += 1
          weeklyTotals.overall.totalTime += timeInMinutes
          weeklyTotals.overall.totalSessions += 1
          break
          
        case 'ride':
        case 'cycling':
        case 'virtualride':
          weeklyTotals.cycling.totalTime += timeInMinutes
          weeklyTotals.cycling.totalDistance += distanceInKm
          weeklyTotals.cycling.sessionCount += 1
          weeklyTotals.overall.totalTime += timeInMinutes
          weeklyTotals.overall.totalSessions += 1
          break
          
        case 'weighttraining':
        case 'workout':
        case 'crosstraining':
          weeklyTotals.weightTraining.totalTime += timeInMinutes
          weeklyTotals.weightTraining.sessionCount += 1
          weeklyTotals.overall.totalTime += timeInMinutes
          weeklyTotals.overall.totalSessions += 1
          break
      }
    })

  return weeklyTotals
}

export function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  if (hours > 0) {
    return `${hours}h ${mins}m`
  }
  return `${mins} minutes`
}

export function formatDistance(kilometers: number): string {
  return `${kilometers.toFixed(2)} km`
}