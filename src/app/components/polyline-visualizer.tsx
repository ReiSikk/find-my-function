"use client"

import { motion } from "framer-motion"
import dynamic from 'next/dynamic'

interface PolylineVisualizerProps {
  polyline: string
}

const MapComponent = dynamic(
  () => import('./activity-map'),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full min-h-[250px] rounded-lg bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">Loading map...</div>
      </div>
    )
  }
)

export function PolylineVisualizer({ polyline }: PolylineVisualizerProps) {
  if (!polyline) return null

  return (
    <motion.div
      className="h-full w-full min-h-[250px] rounded-lg overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <MapComponent polyline={polyline} />
    </motion.div>
  )
}