"use client"

import { useRef, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Activity, DetailedActivity } from "@/lib/types"
import { PolylineVisualizer } from "./polyline-visualizer"
import { X, Clock, MapPin, Zap, Award, Flame, Loader2, Brain } from "lucide-react"
import { parseISO } from "date-fns"
import { Spinner } from "@/components/ui/spinner"
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'



interface ActivityModalProps {
  activity: Activity
  isOpen: boolean
  onClose: () => void
}

export function ActivityModal({ activity, isOpen, onClose }: ActivityModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  // Check for Polyline map
  const hasMap = activity.map.summary_polyline !== "";
  const includePaceAndSpeed = activity.moving_time > 0 && activity.distance > 0;
  const [detailedActivity, setDetailedActivity] = useState<DetailedActivity | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)


  // AI analysis for activity
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisError, setAnalysisError] = useState<string | null>(null)


  // Fetch detailed activity data when modal opens
  useEffect(() => {
    
    const fetchActivityDetails = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/strava/activities/${activity.id}`)

        if (!response.ok) {
          throw new Error("Failed to fetch activity details")
        }

        const details = await response.json()
        setDetailedActivity(details)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }
    
    if (isOpen && !detailedActivity) {
      fetchActivityDetails()
    }
  }, [isOpen, activity.id, detailedActivity])

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  // Format date
  const date = parseISO(activity.start_date)
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)

  // Format distance in km
  const distance = (activity.distance / 1000).toFixed(2)

  // Format duration
  const hours = Math.floor(activity.moving_time / 3600)
  const minutes = Math.floor((activity.moving_time % 3600) / 60)
  const seconds = activity.moving_time % 60
  const duration = `${hours ? `${hours}h ` : ""}${minutes}m ${seconds}s`

  // Format pace (min/km)
  const paceSeconds = activity.moving_time / (activity.distance / 1000)
  const paceMinutes = Math.floor(paceSeconds / 60)
  const paceRemainingSeconds = Math.floor(paceSeconds % 60)
  const pace = `${paceMinutes}:${paceRemainingSeconds.toString().padStart(2, "0")}/km`

  // Format speed in km/h
  const speedKmh = (activity.average_speed * 3.6).toFixed(1)



  const analyzeWorkout = async () => {
    if (isAnalyzing) return
    
    setIsAnalyzing(true)
    setAnalysisError(null)
    
    try {
      const response = await fetch('/api/ai/analyze-workout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activity: detailedActivity || activity
        })
      })

      if (!response.ok) {
        throw new Error('Failed to analyze workout')
      }

      const data = await response.json()
      setAiAnalysis(data.analysis)
      
    } catch (error) {
      console.error('Analysis error:', error)
      setAnalysisError('Failed to analyze workout. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
}

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <motion.div
            ref={modalRef}
            className="relative max-h-[90vh] w-full max-w-2xl overflow-auto rounded-xl border border-(--color-primary) bg-(--color-bg) p-6 shadow-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <button
              onClick={onClose}
              type="button"
              className="absolute cursor-pointer right-4 top-4 rounded-full p-1 border border-(--color-primary) transition-colors bg-(--color-primary) text-(--color-bg) hover:bg-(--color-bg) hover:opacity-80 transition-opacity"
            >
              <X className="h-5 w-5" />
            </button>

            {error && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                <div className="max-w-md w-full bg-white rounded-lg p-6 shadow-lg text-center">
                  <h2 className="text-xl font-semibold text-red-600">Error</h2>
                  <p className="mt-2 text-gray-700">{error}</p>
                  <button
                    type="button"
                    aria-label="Close modal"
                    onClick={onClose}
                    className="mt-4 px-4 py-2 bg-(--color-primary) text-(--color-bg) rounded hover:bg-(--color-bg) hover:text-(--color-primary) cursor-pointer transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[--color-primary]">{activity.name}</h2>
              <div className="mt-1 flex items-center gap-2">
                <span className="rounded-full bg-(--color-btn) bg-opacity-10 px-3 py-1 text-xs font-medium text-(--color-text)">
                  {activity.sport_type}
                </span>
                {activity.achievement_count > 0 && (
                  <span className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                    <Award className="h-3 w-3" />
                    {activity.achievement_count} achievements
                  </span>
                )}
              </div>
            </div>

           {hasMap &&
            <div className="mb-6 h-48 w-full overflow-hidden rounded-lg bg-gray-100">
              <PolylineVisualizer polyline={activity.map.summary_polyline} />
            </div>
           }

            <div className="mb-6 grid grid-cols-2 gap-2 md:gap-4 md:grid-cols-4">
              <div className="rounded-lg bg-gray-50 p-3">
                <div className="mb-1 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[--color-primary]" />
                  <span className="text-xs text-gray-500">Distance</span>
                </div>
                <p className="text-lg font-semibold">{distance} km</p>
              </div>

              <div className="rounded-lg bg-gray-50 p-3">
                <div className="mb-1 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[--color-primary]" />
                  <span className="text-xs text-gray-500">Duration</span>
                </div>
                <p className="text-lg font-semibold">{duration}</p>
              </div>

            {includePaceAndSpeed && (
              <>
                <div className="rounded-lg bg-gray-50 p-3">
                  <div className="mb-1 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-[--color-primary]" />
                    <span className="text-xs text-gray-500">Pace</span>
                  </div>
                  <p className="text-lg font-semibold">{pace}</p>
                </div>

                <div className="rounded-lg bg-gray-50 p-3">
                  <div className="mb-1 flex items-center gap-2">
                    <Flame className="h-4 w-4 text-[--color-primary]" />
                    <span className="text-xs text-gray-500">Speed</span>
                  </div>
                  <p className="text-lg font-semibold">{speedKmh} km/h</p>
                </div>
                </>
            )
            }
            </div>

             {/* AI Analysis Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Nutrition Analysis
                </h3>
                
                {!aiAnalysis && (
                  <button
                    onClick={analyzeWorkout}
                    disabled={isAnalyzing}
                    className="flex items-center gap-2 px-4 py-2 bg-(--color-btn) text-(--color-primary) rounded-lg hover:opacity-80 disabled:opacity-50 disabled:cursor-wait transition-opacity cursor-pointer"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4" />
                        Analyze Workout
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Analysis Results */}
              {aiAnalysis && (
                <div className="bg-gray-50 rounded-lg p-4 shadow-md">
                  <Markdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h3: ({children}) => <h3 className="text-lg font-semibold mt-4 mb-2 text-(--color-primary)">{children}</h3>,
                      ul: ({children}) => <ul className="list-disc list-inside space-y-1 mb-6">{children}</ul>,
                      li: ({children}) => <li className="mb-3">{children}</li>,
                      p: ({children}) => <p className="mb-2">{children}</p>
                    }}
                    >
                      {aiAnalysis}
                   </Markdown>
                  
                  <button
                    onClick={() => setAiAnalysis(null)}
                    className="btn-main btn-main--alt mt-4 text-sm hover:opacity-80 transition-opacity"
                  >
                    Generate new analysis
                  </button>
                </div>
              )}

              {/* Analysis Error */}
              {analysisError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex flex-col items-center">
                  <p className="text-red-700 text-sm text-center mb-1">{analysisError}</p>
                  <button
                    onClick={analyzeWorkout}
                    className="mt-2 btn-main hover:opacity-80"
                  >
                    Try again
                  </button>
                </div>
              )}
            </div>

            <div className="mb-6">
              <h3 className="mb-3 text-lg font-semibold border-b border-(--color-primary)">Details</h3>
                 {loading ? (
              <div className="flex items-center justify-center p-8">
                 <Spinner />
                <span className="ml-2">Loading activity details...</span>
              </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Date</span>
                  <span className="text-sm font-medium">{formattedDate}</span>
                </div>

                {activity.has_heartrate && activity.average_heartrate && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Avg Heart Rate</span>
                      <span className="text-sm font-medium">{Math.round(activity.average_heartrate)} bpm</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Max Heart Rate</span>
                      <span className="text-sm font-medium">{activity.max_heartrate} bpm</span>
                    </div>
                  </>
                )}

                {activity.total_elevation_gain > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Elevation Gain</span>
                    <span className="text-sm font-medium">{activity.total_elevation_gain}m</span>
                  </div>
                )}

                {activity.average_cadence && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Cadence</span>
                    <span className="text-sm font-medium">{Math.round(activity.average_cadence)} spm</span>
                  </div>
                )}

                {activity.average_watts && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Power </span>
                    <span className="text-sm font-medium">{Math.round(activity.average_watts)} watts</span>
                  </div>
                )}

                
                {detailedActivity && detailedActivity.calories && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Calories burned</span>
                    <span className="text-sm font-medium">{Math.round(detailedActivity.calories)} kcal</span>
                  </div>
                )}

                {/* //TODO: Uncomment for Strava Kudos count */}
                {/* <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Kudos</span>
                  <span className="text-sm font-medium">{activity.kudos_count}</span>
                </div> */}
              </div>
            )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
