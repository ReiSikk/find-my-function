"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface PolylineVisualizerProps {
  polyline: string
}

// Function to decode Google's encoded polyline format
function decodePolyline(encoded: string) {
  const points: [number, number][] = []
  let index = 0
  const len = encoded.length
  let lat = 0
  let lng = 0

  while (index < len) {
    let b
    let shift = 0
    let result = 0

    do {
      b = encoded.charCodeAt(index++) - 63
      result |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)

    const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1
    lat += dlat

    shift = 0
    result = 0

    do {
      b = encoded.charCodeAt(index++) - 63
      result |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)

    const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1
    lng += dlng

    points.push([lat * 1e-5, lng * 1e-5])
  }

  return points
}

export function PolylineVisualizer({ polyline }: PolylineVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!polyline || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Get the decoded points
    const points = decodePolyline(polyline)
    if (points.length === 0) return

    // Find the bounds of the points
    let minLat = points[0][0]
    let maxLat = points[0][0]
    let minLng = points[0][1]
    let maxLng = points[0][1]

    points.forEach(([lat, lng]) => {
      minLat = Math.min(minLat, lat)
      maxLat = Math.max(maxLat, lat)
      minLng = Math.min(minLng, lng)
      maxLng = Math.max(maxLng, lng)
    })

    // Calculate the scale to fit the canvas
    const padding = 20
    const width = canvas.width - padding * 2
    const height = canvas.height - padding * 2

    const latRange = maxLat - minLat
    const lngRange = maxLng - minLng

    const latScale = height / latRange
    const lngScale = width / lngRange

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw the path
    ctx.beginPath()
    ctx.lineWidth = 3
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--color-primary") || "#3b82f6"

    points.forEach(([lat, lng], i) => {
      const x = padding + (lng - minLng) * lngScale
      const y = canvas.height - padding - (lat - minLat) * latScale

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Draw start point
    const startX = padding + (points[0][1] - minLng) * lngScale
    const startY = canvas.height - padding - (points[0][0] - minLat) * latScale

    ctx.beginPath()
    ctx.arc(startX, startY, 5, 0, Math.PI * 2)
    ctx.fillStyle = "#10b981"
    ctx.fill()

    // Draw end point
    const endX = padding + (points[points.length - 1][1] - minLng) * lngScale
    const endY = canvas.height - padding - (points[points.length - 1][0] - minLat) * latScale

    ctx.beginPath()
    ctx.arc(endX, endY, 5, 0, Math.PI * 2)
    ctx.fillStyle = "#ef4444"
    ctx.fill()
  }, [polyline])

  return (
    <motion.canvas
      ref={canvasRef}
      width={800}
      height={400}
      className="h-full w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    />
  )
}
