// Emoji mapping for the 20 most popular Strava activity types
const ACTIVITY_EMOJIS: Record<string, string> = {
  'Run': '🏃‍➡️',
  'Ride': '🚴',
  'Walk': '🚶',
  'Hike': '🥾',
  'Weight Training': '🏋️',
  'Swim': '🏊',
  'Yoga': '🧘',
  'Workout': '💪',
  'Virtual Ride': '🚴‍♂️',
  'Virtual Run': '🏃',
  'Trail Run': '🏃‍♀️',
  'Alpine Ski': '⛷️',
  'Snowboard': '🏂',
  'Golf': '⛳',
  'Tennis': '🎾',
  'Soccer': '⚽',
  'Basketball': '🏀',
  'Kayaking': '🛶',
  'Rock Climbing': '🧗',
  'Elliptical': '🔄'
}

/**
 * Gets the emoji for a given activity type
 * @param activityType - The activity type (formatted or raw)
 * @returns Emoji string or empty string if no match
 */
export const getActivityEmoji = (activityType: string): string => {
  return ACTIVITY_EMOJIS[activityType] || ''
}