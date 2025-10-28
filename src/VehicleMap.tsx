import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import L from 'leaflet';
import { type RoutePoint, calculateSpeedKmH, calculateTotalDistance } from './utils';

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

const INITIAL_CENTER: [number, number] = [17.385044, 78.486671];

// Vehicle icon using emoji
const vehicleIcon = L.divIcon({
  className: 'vehicle-icon',
  html: '<div style="font-size: 24px; text-align: center;">🚗</div>',
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

interface VehicleMapProps {}

const VehicleMap: React.FC<VehicleMapProps> = () => {
  const [routeData, setRouteData] = useState<RoutePoint[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);

  // Fetch route data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Use import.meta.env.BASE_URL for correct path in both dev and production
        const baseUrl = import.meta.env.BASE_URL || '/';
        const response = await fetch(`${baseUrl}dummy-route.json`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Transform data into required format
        const transformedData: RoutePoint[] = data.map((p: any) => ({
          lat: p.latitude,
          lng: p.longitude,
          timestamp: p.timestamp
        }));

        setRouteData(transformedData);
        setError(null);
      } catch (error) {
        console.error("Error loading route data:", error);
        // Try fallback path if the first attempt fails
        try {
          const fallbackResponse = await fetch('./dummy-route.json');
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            const transformedData: RoutePoint[] = fallbackData.map((p: any) => ({
              lat: p.latitude,
              lng: p.longitude,
              timestamp: p.timestamp
            }));
            setRouteData(transformedData);
            setError(null);
            return;
          }
        } catch (fallbackError) {
          console.error("Fallback also failed:", fallbackError);
        }
        setError("Failed to load route data. The application will use sample data instead.");
        
        // Use embedded sample data as last resort
        const sampleData: RoutePoint[] = [
          { lat: 17.385044, lng: 78.486671, timestamp: "2024-07-20T10:00:00Z" },
          { lat: 17.385200, lng: 78.486800, timestamp: "2024-07-20T10:00:10Z" },
          { lat: 17.385450, lng: 78.487100, timestamp: "2024-07-20T10:00:20Z" },
          { lat: 17.385680, lng: 78.487350, timestamp: "2024-07-20T10:00:30Z" },
          { lat: 17.385850, lng: 78.487580, timestamp: "2024-07-20T10:00:40Z" },
          { lat: 17.386020, lng: 78.487800, timestamp: "2024-07-20T10:00:50Z" },
          { lat: 17.386180, lng: 78.488050, timestamp: "2024-07-20T10:01:00Z" },
          { lat: 17.386350, lng: 78.488250, timestamp: "2024-07-20T10:01:10Z" },
          { lat: 17.386520, lng: 78.488480, timestamp: "2024-07-20T10:01:20Z" },
          { lat: 17.386680, lng: 78.488720, timestamp: "2024-07-20T10:01:30Z" }
        ];
        setRouteData(sampleData);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Simulation effect
  useEffect(() => {
    if (isPlaying && routeData.length > 0 && currentIndex < routeData.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prevIndex => {
          if (prevIndex >= routeData.length - 1) {
            setIsPlaying(false);
            return prevIndex;
          }
          return prevIndex + 1;
        });
      }, 2000); // Update every 2 seconds
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, currentIndex, routeData]);

  const currentPosition = routeData[currentIndex] || routeData[0];

  // Control handlers
  const togglePlay = () => {
    if (currentIndex >= routeData.length - 1) {
      // If at the end, reset and start from beginning
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

  // Extract coordinates for polylines
  const fullRouteCoords: [number, number][] = routeData.map(p => [p.lat, p.lng]);
  const traveledRouteCoords: [number, number][] = routeData.slice(0, currentIndex + 1).map(p => [p.lat, p.lng]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading route data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-100">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full relative">
      <MapContainer
        center={INITIAL_CENTER}
        zoom={15}
        scrollWheelZoom={true}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Full route path (planned route) */}
        {routeData.length > 0 && (
          <Polyline
            pathOptions={{ color: 'gray', weight: 3, opacity: 0.5, dashArray: '10, 10' }}
            positions={fullRouteCoords}
          />
        )}
        
        {/* Traveled route (completed path) */}
        {traveledRouteCoords.length > 1 && (
          <Polyline
            pathOptions={{ color: '#ef4444', weight: 5, opacity: 0.8 }}
            positions={traveledRouteCoords}
          />
        )}
        
        {/* Vehicle marker */}
        {currentPosition && (
          <Marker
            position={[currentPosition.lat, currentPosition.lng]}
            icon={vehicleIcon}
          />
        )}
      </MapContainer>

      {/* Control Panel */}
      <div className="absolute top-4 right-4 z-[1000] p-4 bg-white shadow-xl rounded-lg w-full max-w-xs md:max-w-sm">
        <h2 className="text-lg font-bold mb-3 text-gray-800">Vehicle Tracker</h2>
        
        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{currentIndex + 1} / {routeData.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / routeData.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Current status */}
        {currentPosition && (
          <div className="space-y-1 text-sm mb-4">
            <p className="text-gray-700">
              <span className="font-medium">Coordinates:</span>
              <br />
              <span className="font-mono text-blue-600 text-xs">
                {currentPosition.lat.toFixed(6)}, {currentPosition.lng.toFixed(6)}
              </span>
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Time:</span> {' '}
              <span className="text-gray-600">
                {currentPosition.timestamp ? new Date(currentPosition.timestamp).toLocaleTimeString() : 'N/A'}
              </span>
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Speed:</span> {' '}
              <span className="text-green-600 font-medium">
                {calculateSpeedKmH(currentIndex, routeData)} km/h
              </span>
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Total Distance:</span> {' '}
              <span className="text-purple-600 font-medium">
                {calculateTotalDistance(routeData)} km
              </span>
            </p>
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-2">
          <button
            onClick={togglePlay}
            disabled={routeData.length === 0}
            className={`flex-1 px-4 py-2 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed ${
              isPlaying 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isPlaying ? '⏸️ Pause' : '▶️ Play'}
          </button>
          <button
            onClick={resetSimulation}
            disabled={routeData.length === 0}
            className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🔄 Reset
          </button>
        </div>

        {/* Status indicator */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className="text-xs text-gray-600">
              {isPlaying ? 'Simulation Running' : 'Simulation Paused'}
            </span>
          </div>
          {currentIndex >= routeData.length - 1 && !isPlaying && (
            <p className="text-xs text-blue-600 mt-1">✅ Route completed!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleMap;