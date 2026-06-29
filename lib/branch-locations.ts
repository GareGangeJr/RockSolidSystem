export type BranchLocation = {
  name: string
  lat: number
  lng: number
  radiusMeters: number
}

export const BRANCH_LOCATIONS: BranchLocation[] = [
  { name: "Iloilo Branch", lat: 10.7019, lng: 122.5622, radiusMeters: 500 },
]

function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180
}

function getDistanceMeters(lat1: number, lng1: number, lat2: number, lng2: number) {
  const earthRadius = 6371000
  const dLat = toRadians(lat2 - lat1)
  const dLng = toRadians(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2
  return Math.round(earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))
}

export function findNearestBranch(latitude: number, longitude: number) {
  let nearest = BRANCH_LOCATIONS[0]
  let nearestDistance = getDistanceMeters(latitude, longitude, nearest.lat, nearest.lng)

  for (const branch of BRANCH_LOCATIONS.slice(1)) {
    const distance = getDistanceMeters(latitude, longitude, branch.lat, branch.lng)
    if (distance < nearestDistance) {
      nearest = branch
      nearestDistance = distance
    }
  }

  return { ...nearest, distanceMeters: nearestDistance }
}
