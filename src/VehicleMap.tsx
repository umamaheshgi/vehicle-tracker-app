import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix for default markers in react-leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Center point between Koti and KPHB
const INITIAL_CENTER: [number, number] = [17.3950, 78.5000];

// Vehicle icon using emoji
const vehicleIcon = L.divIcon({
  className: 'vehicle-icon',
  html: '<div style="font-size: 32px; text-align: center; filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.5));">🚗</div>',
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

// Start marker icon
const startIcon = L.divIcon({
  className: 'start-icon',
  html: '<div style="font-size: 28px;">📍</div>',
  iconSize: [35, 35],
  iconAnchor: [17, 35]
});

// End marker icon
const endIcon = L.divIcon({
  className: 'end-icon',
  html: '<div style="font-size: 28px;">🎯</div>',
  iconSize: [35, 35],
  iconAnchor: [17, 35]
});

interface RoutePoint {
  lat: number;
  lng: number;
  timestamp: string;
}

const VehicleMap: React.FC = () => {
  const [routeData, setRouteData] = useState<RoutePoint[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<number | null>(null);

  // Fetch real route from OSRM on component mount
  useEffect(() => {
    const fetchRoute = async () => {
      try {
        // OSRM API - real road routing
        const response = await fetch(
          'https://router.project-osrm.org/route/v1/driving/78.4866,17.3850;78.5260,17.4170?geometries=geojson&overview=full'
        );
        
        if (!response.ok) throw new Error('Failed to fetch route');
        
        const data = await response.json();
        
        if (data.code === 'Ok' && data.routes && data.routes[0]) {
          const route = data.routes[0];
          const coordinates = route.geometry.coordinates;
          const duration = route.duration;

          // Convert coordinates to RoutePoint array
          const points: RoutePoint[] = coordinates.map((coord: number[], index: number) => {
            const timeProgress = index / (coordinates.length - 1);
            const pointTime = duration * timeProgress;
            const timestamp = new Date(new Date('2024-07-20T10:00:00Z').getTime() + pointTime * 1000);

            return {
              lat: coord[1],
              lng: coord[0],
              timestamp: timestamp.toISOString()
            };
          });

          setRouteData(points);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.log('OSRM fetch failed, using fallback route');
      }

      // Fallback route if OSRM fails
      const fallbackRoute: RoutePoint[] = [
        { lat: 17.3850, lng: 78.4866, timestamp: '2024-07-20T10:00:00Z' },
        { lat: 17.3855, lng: 78.4875, timestamp: '2024-07-20T10:00:15Z' },
        { lat: 17.3862, lng: 78.4885, timestamp: '2024-07-20T10:00:30Z' },
        { lat: 17.3870, lng: 78.4895, timestamp: '2024-07-20T10:00:45Z' },
        { lat: 17.3880, lng: 78.4905, timestamp: '2024-07-20T10:01:00Z' },
        { lat: 17.3890, lng: 78.4920, timestamp: '2024-07-20T10:01:15Z' },
        { lat: 17.3900, lng: 78.4930, timestamp: '2024-07-20T10:01:30Z' },
        { lat: 17.3912, lng: 78.4940, timestamp: '2024-07-20T10:01:45Z' },
        { lat: 17.3925, lng: 78.4945, timestamp: '2024-07-20T10:02:00Z' },
        { lat: 17.3938, lng: 78.4950, timestamp: '2024-07-20T10:02:15Z' },
        { lat: 17.3950, lng: 78.4960, timestamp: '2024-07-20T10:02:30Z' },
        { lat: 17.3962, lng: 78.4975, timestamp: '2024-07-20T10:02:45Z' },
        { lat: 17.3975, lng: 78.4990, timestamp: '2024-07-20T10:03:00Z' },
        { lat: 17.3988, lng: 78.5005, timestamp: '2024-07-20T10:03:15Z' },
        { lat: 17.4000, lng: 78.5020, timestamp: '2024-07-20T10:03:30Z' },
        { lat: 17.4012, lng: 78.5040, timestamp: '2024-07-20T10:03:45Z' },
        { lat: 17.4025, lng: 78.5060, timestamp: '2024-07-20T10:04:00Z' },
        { lat: 17.4038, lng: 78.5080, timestamp: '2024-07-20T10:04:15Z' },
        { lat: 17.4050, lng: 78.5100, timestamp: '2024-07-20T10:04:30Z' },
        { lat: 17.4062, lng: 78.5120, timestamp: '2024-07-20T10:04:45Z' },
        { lat: 17.4075, lng: 78.5140, timestamp: '2024-07-20T10:05:00Z' },
        { lat: 17.4088, lng: 78.5160, timestamp: '2024-07-20T10:05:15Z' },
        { lat: 17.4100, lng: 78.5180, timestamp: '2024-07-20T10:05:30Z' },
        { lat: 17.4112, lng: 78.5195, timestamp: '2024-07-20T10:05:45Z' },
        { lat: 17.4125, lng: 78.5210, timestamp: '2024-07-20T10:06:00Z' },
        { lat: 17.4138, lng: 78.5225, timestamp: '2024-07-20T10:06:15Z' },
        { lat: 17.4150, lng: 78.5240, timestamp: '2024-07-20T10:06:30Z' },
        { lat: 17.4160, lng: 78.5250, timestamp: '2024-07-20T10:06:45Z' },
        { lat: 17.4170, lng: 78.5260, timestamp: '2024-07-20T10:07:00Z' }
      ];

      setRouteData(fallbackRoute);
      setLoading(false);
    };

    fetchRoute();
  }, []);

  // Simulation effect
  useEffect(() => {
    if (isPlaying && routeData.length > 0 && currentIndex < routeData.length - 1) {
      intervalRef.current = window.setInterval(() => {
        setCurrentIndex(prevIndex => {
          if (prevIndex >= routeData.length - 1) {
            setIsPlaying(false);
            return prevIndex;
          }
          return prevIndex + 1;
        });
      }, 300);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, currentIndex, routeData.length]);

  const currentPosition = routeData[currentIndex] || { lat: 17.3850, lng: 78.4866, timestamp: '2024-07-20T10:00:00Z' };

  // Control handlers
  const togglePlay = () => {
    if (currentIndex >= routeData.length - 1) {
      setCurrentIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const resetSimulation = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
  };

  // Calculate distance between two points
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Calculate total distance
  const getTotalDistance = () => {
    let total = 0;
    for (let i = 0; i < currentIndex; i++) {
      total += calculateDistance(
        routeData[i].lat,
        routeData[i].lng,
        routeData[i + 1].lat,
        routeData[i + 1].lng
      );
    }
    return total;
  };

  // Calculate speed
  const getSpeed = () => {
    if (currentIndex === 0) return '0.00';
    const prev = routeData[currentIndex - 1];
    const curr = routeData[currentIndex];
    const distance = calculateDistance(prev.lat, prev.lng, curr.lat, curr.lng);
    const timeInterval = 0.3 / 3600;
    return (distance / timeInterval).toFixed(2);
  };

  // Extract coordinates for polylines
  const fullRouteCoords: [number, number][] = routeData.map(p => [p.lat, p.lng]);
  const traveledRouteCoords: [number, number][] = routeData.slice(0, currentIndex + 1).map(p => [p.lat, p.lng]);

  const progress = routeData.length > 0 ? ((currentIndex + 1) / routeData.length) * 100 : 0;
  const currentTime = new Date(currentPosition.timestamp).toLocaleTimeString();
  const totalDistance = getTotalDistance();
  const currentSpeed = getSpeed();

  if (loading) {
    return (
      <div className="h-screen w-screen overflow-hidden fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-blue-300 mx-auto mb-6"></div>
          <p className="text-xl text-white font-semibold">Loading Route...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden fixed inset-0 flex bg-gray-100">
      {/* Left Sidebar Panel */}
      <div className="w-96 bg-white shadow-lg flex flex-col h-screen border-r border-gray-200 z-10">
        {/* Header */}
        <div className="bg-white px-6 py-5 shadow-sm border-b border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-2xl">🚗</div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Vehicle Tracker</h1>
              <p className="text-xs text-gray-500">Real-time Tracking</p>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          
          {/* Route Information */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="text-sm font-bold text-gray-800 mb-3">Route Details</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">📍</span>
                <div>
                  <p className="text-xs text-gray-500">From</p>
                  <p className="text-sm font-semibold text-gray-800">Koti</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">🎯</span>
                <div>
                  <p className="text-xs text-gray-500">To</p>
                  <p className="text-sm font-semibold text-gray-800">KPHB Colony</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className={`rounded-lg p-4 border ${
            isPlaying 
              ? 'bg-green-50 border-green-200' 
              : 'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center justify-center w-3 h-3 rounded-full ${
                isPlaying ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
              }`}></span>
              <span className={`text-sm font-semibold ${
                isPlaying 
                  ? 'text-green-800' 
                  : 'text-yellow-800'
              }`}>
                {isPlaying ? '🔴 Live Tracking' : '⏸️ Paused'}
              </span>
            </div>
          </div>

          {/* Progress Section */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-gray-800">Progress</h3>
              <span className="text-sm font-bold text-blue-600">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">{currentIndex + 1} of {routeData.length} waypoints</p>
          </div>

          {/* Location Details */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-sm font-bold text-gray-800 mb-3">Current Location</h3>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-500 font-semibold">LATITUDE</p>
                <p className="text-sm font-mono text-gray-800 font-semibold">
                  {currentPosition.lat.toFixed(6)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold">LONGITUDE</p>
                <p className="text-sm font-mono text-gray-800 font-semibold">
                  {currentPosition.lng.toFixed(6)}
                </p>
              </div>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Time */}
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <p className="text-xs text-gray-600 font-semibold mb-2">TIME</p>
              <p className="text-sm font-bold text-purple-700">{currentTime}</p>
            </div>
            
            {/* Speed */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="text-xs text-gray-600 font-semibold mb-2">SPEED</p>
              <p className="text-sm font-bold text-green-700">{currentSpeed}<span className="text-xs"> km/h</span></p>
            </div>
          </div>

          {/* Distance */}
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <p className="text-xs text-gray-600 font-semibold mb-2">TOTAL DISTANCE</p>
            <p className="text-2xl font-bold text-orange-700">{totalDistance.toFixed(2)}<span className="text-sm"> km</span></p>
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-white border-t border-gray-200 px-6 py-4 space-y-3">
          <button
            onClick={togglePlay}
            className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-all duration-200 ${
              isPlaying 
                ? 'bg-red-500 hover:bg-red-600 shadow-md' 
                : 'bg-green-500 hover:bg-green-600 shadow-md'
            }`}
          >
            {isPlaying ? '⏸️ PAUSE' : '▶️ PLAY'}
          </button>
          
          <button
            onClick={resetSimulation}
            className="w-full py-3 px-4 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg transition-all duration-200 shadow-md"
          >
            🔄 RESET
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <MapContainer
          center={INITIAL_CENTER}
          zoom={14}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Full route path */}
          <Polyline
            pathOptions={{ color: '#cbd5e1', weight: 4, opacity: 0.5, dashArray: '8, 8' }}
            positions={fullRouteCoords}
          />
          
          {/* Traveled route */}
          {traveledRouteCoords.length > 1 && (
            <Polyline
              pathOptions={{ color: '#dc2626', weight: 6, opacity: 0.9 }}
              positions={traveledRouteCoords}
            />
          )}

          {/* Start marker */}
          <Marker position={[routeData[0].lat, routeData[0].lng]} icon={startIcon}>
            <Popup>📍 Start: Koti</Popup>
          </Marker>

          {/* End marker */}
          <Marker position={[routeData[routeData.length - 1].lat, routeData[routeData.length - 1].lng]} icon={endIcon}>
            <Popup>🎯 Destination: KPHB Colony</Popup>
          </Marker>
          
          {/* Vehicle marker */}
          <Marker position={[currentPosition.lat, currentPosition.lng]} icon={vehicleIcon}>
            <Popup>🚗 Vehicle</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default VehicleMap;