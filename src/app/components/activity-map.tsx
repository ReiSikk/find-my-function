"use client"

import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet'
import L from 'leaflet'

interface MapComponentProps {
  polyline: string
}

// Decode a Google Maps encoded polyline string into an array of [lat, lng] points
// Reference: https://developers.google.com/maps/documentation/utilities/polylinealgorithm
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

// Calculate the bounds of the polyline points
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

// Define custom icons for start and end points
const startIcon = L.divIcon({
  html: '<div style="width: 12px; height: 12px; background: #10b981; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
  className: 'custom-div-icon',
  iconSize: [12, 12],
  iconAnchor: [5, 5]
})

const endIcon = L.divIcon({
  html: '<div style="width: 12px; height: 12px; background: #ef4444; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
  className: 'custom-div-icon',
  iconSize: [12, 12],
  iconAnchor: [5, 5]
})


// Main Map component
export default function MapComponent({ polyline }: MapComponentProps) {
  const points = decodePolyline(polyline)

  if (points.length === 0) return <div>No route data available</div>

  const bounds = calculateBounds(points)
  const startPoint = points[0]
  const endPoint = points[points.length - 1]

  return (
    <div style={{ height: '100%', width: '100%', minHeight: '250px' }}>
      <MapContainer
        center={bounds.center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        bounds={[[bounds.minLat, bounds.minLng], [bounds.maxLat, bounds.maxLng]]}
        boundsOptions={{ padding: [20, 20] }}
        scrollWheelZoom={true}
        dragging={true}
        zoomControl={true}
        doubleClickZoom={true}
        touchZoom={true}
      >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
        <Polyline
          positions={points}
          color="#e9847c"
          weight={3}
          opacity={0.8}
        />
        <Marker position={startPoint} icon={startIcon} />
        <Marker position={endPoint} icon={endIcon} />
      </MapContainer>
    </div>
  )
}