// Utility functions for route calculations

export interface RoutePoint {
  lat: number;
  lng: number;
  timestamp: string;
}

// Function to calculate simple distance using Haversine formula approximation
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  return distance;
}

export function calculateSpeedKmH(currentIndex: number, routeData: RoutePoint[]): string {
  if (currentIndex === 0 || routeData.length <= 1) return '0.00';

  const currPoint = routeData[currentIndex];
  const prevPoint = routeData[currentIndex - 1];

  if (!prevPoint || !currPoint) return '0.00';

  const distanceKm = calculateDistanceKm(
    prevPoint.lat, prevPoint.lng,
    currPoint.lat, currPoint.lng
  );

  const timeDeltaMs = new Date(currPoint.timestamp).getTime() - new Date(prevPoint.timestamp).getTime();
  const timeDeltaHours = timeDeltaMs / (1000 * 60 * 60); // Convert ms to hours

  if (timeDeltaHours <= 0) return 'N/A';

  const speed = distanceKm / timeDeltaHours; // Speed in km/h
  return speed.toFixed(2);
}

export function calculateTotalDistance(routeData: RoutePoint[]): string {
  if (routeData.length <= 1) return '0.00';
  
  let totalDistance = 0;
  for (let i = 1; i < routeData.length; i++) {
    const prev = routeData[i - 1];
    const curr = routeData[i];
    totalDistance += calculateDistanceKm(prev.lat, prev.lng, curr.lat, curr.lng);
  }
  
  return totalDistance.toFixed(2);
}