"use client"

import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface MapComponentProps {
  polyline: string
}

// Keep your existing decodePolyline function
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

function calculateBounds(points: [number, number][]) {
  if (points.length === 0) {
    return { minLat: 0, maxLat: 0, minLng: 0, maxLng: 0, center: [0, 0] as [number, number] }
  }

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

  return {
    minLat,
    maxLat,
    minLng,
    maxLng,
    center: [(minLat + maxLat) / 2, (minLng + maxLng) / 2] as [number, number]
  }
}

const startIcon = L.divIcon({
  html: '<div style="width: 10px; height: 10px; background: #10b981; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
  className: 'custom-div-icon',
  iconSize: [10, 10],
  iconAnchor: [5, 5]
})

const endIcon = L.divIcon({
  html: '<div style="width: 10px; height: 10px; background: #ef4444; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
  className: 'custom-div-icon',
  iconSize: [10, 10],
  iconAnchor: [5, 5]
})

export default function MapComponent({ polyline }: MapComponentProps) {
  const points = decodePolyline(polyline)
  if (points.length === 0) return null

  const bounds = calculateBounds(points)
  const startPoint = points[0]
  const endPoint = points[points.length - 1]

  return (
    <MapContainer
      center={bounds.center}
      zoom={10}
      style={{ height: '100%', width: '100%' }}
      bounds={[[bounds.minLat, bounds.minLng], [bounds.maxLat, bounds.maxLng]]}
      boundsOptions={{ padding: [20, 20] }}
      scrollWheelZoom={false}
      dragging={true}
      zoomControl={false}
      doubleClickZoom={false}
      touchZoom={true}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      
      <Polyline
        positions={points}
        color="var(--color-primary)"
        weight={3}
        opacity={0.8}
      />
      
      <Marker position={startPoint} icon={startIcon} />
      <Marker position={endPoint} icon={endIcon} />
    </MapContainer>
  )
}