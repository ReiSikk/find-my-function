"use client"

import { useState } from "react"
import { parseISO } from "date-fns"
import type { Activity } from "../../lib/types"
import { ActivityModal } from "./activity-modal"
import { Calendar, Clock, ArrowUp, Zap, Heart, MapPin, ChevronRight } from "lucide-react"
import { getActivityEmoji } from "@/lib/utils/emoji-mapper"

interface ActivityCardProps {
  activity: Activity
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  console.log(activity);

  // Format date
  const date = parseISO(activity.start_date)
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)

  // Format distance in km
  const distance = parseFloat((activity.distance / 1000).toFixed(2))

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

  return (
    <>
      <div
        className="group flex flex-col relative overflow-hidden rounded-lg border border-[--color-primary] bg-[color--bg] pt-[70px] p-5 shadow-sm transition-all hover:shadow-md cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="absolute flex items-center justify-center right-0 top-0 h-[50px] w-full bg-(--color-primary)" >
          <span className="rounded-full bg-(--color-btn) bg-opacity-10 px-3 py-1 text-small font-medium text-(--color-primary)">
            {activity.sport_type}
            <span className="ml-2">
                {getActivityEmoji(activity.sport_type)}
            </span>
          </span>
        </div>

        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{activity.name}</h3>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-[--color-primary]" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-[--color-primary]" />
            <span>{duration}</span>
          </div>
           {distance !== 0  &&
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-[--color-primary]" />
            <span>{distance} km</span>
          </div>
          }
           {(activity.sport_type === "Run" || activity.sport_type === "TrailRun") &&
            <div className="flex items-center gap-2 text-sm">
              <Zap className="h-4 w-4 text-[--color-primary]" />
              <span>{pace}</span>
            </div>
           }
        </div>

        {activity.has_heartrate && activity.average_heartrate && (
          <div className="mb-3 flex items-center gap-2">
            <Heart className="h-4 w-4 text-red-500" />
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-red-500 transition-all"
                style={{ width: `${(activity.average_heartrate / 200) * 100}%` }}
              />
            </div>
            <span className="text-xs font-medium">{Math.round(activity.average_heartrate)} bpm</span>
          </div>
        )}

        {activity.total_elevation_gain > 0 && (
          <div className="mb-4 flex items-center gap-1 text-xs">
            <ArrowUp className="h-3 w-3" />
            <span>{activity.total_elevation_gain}m</span>
          </div>
        )}

        <div className="mt-auto flex items-center justify-center ml-auto w-fit md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
           View details
          <ChevronRight className="h-5 w-5 text-[--color-primary] opacity-50" />
        </div>
      </div>

      <ActivityModal activity={activity} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
