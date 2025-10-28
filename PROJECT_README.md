# Vehicle Movement Tracker

A React TypeScript application that simulates a vehicle's journey along a predefined route using interactive maps.

## 🚗 Features

- **Interactive Map**: Built with React-Leaflet and OpenStreetMap
- **Route Visualization**: 
  - Gray dashed line showing the complete planned route
  - Red solid line showing the traveled path
- **Vehicle Simulation**: 
  - Animated vehicle marker (🚗 emoji) moving along the route
  - Real-time position updates every 2 seconds
- **Control Panel**:
  - Play/Pause simulation controls
  - Reset functionality to restart from beginning
  - Progress bar showing completion status
- **Live Metadata Display**:
  - Current GPS coordinates with 6-decimal precision
  - Timestamp of current position
  - Calculated speed in km/h using Haversine formula
  - Total route distance calculation

## 🛠️ Technologies Used

| Category | Technology | Purpose |
|----------|------------|---------|
| **Frontend Framework** | React 18 + TypeScript | Component-based UI with type safety |
| **Build Tool** | Vite | Fast development and optimized builds |
| **Mapping** | React-Leaflet + Leaflet | Interactive map components |
| **Styling** | Tailwind CSS | Utility-first responsive design |
| **Data Format** | JSON | Route data storage |

## 📁 Project Structure

```
vehicle-tracker-app/
├── public/
│   └── dummy-route.json          # GPS route data (20 points around Hyderabad)
├── src/
│   ├── VehicleMap.tsx            # Main map component with simulation logic
│   ├── utils.ts                  # Distance calculation utilities
│   ├── App.tsx                   # Root application component
│   ├── index.css                 # Tailwind CSS imports + Leaflet styles
│   └── main.tsx                  # Application entry point
├── tailwind.config.js            # Tailwind CSS configuration
├── postcss.config.js             # PostCSS configuration
└── package.json                  # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone or navigate to the project directory**
2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 🎮 How to Use

1. **Map Display**: The application loads with a map centered on Hyderabad showing the complete route in gray
2. **Start Simulation**: Click the "▶️ Play" button to begin the vehicle movement
3. **Monitor Progress**: Watch the control panel for:
   - Real-time coordinates
   - Current timestamp
   - Speed calculations
   - Route completion percentage
4. **Control Simulation**: 
   - Use "⏸️ Pause" to stop the movement
   - Use "🔄 Reset" to return to the starting position
5. **Visual Indicators**:
   - Green dot: Simulation is running
   - Red dot: Simulation is paused
   - Checkmark: Route completed

## 📊 Route Data

The dummy route consists of 20 GPS points around Hyderabad, India:
- **Starting Point**: 17.385044°N, 78.486671°E
- **Ending Point**: 17.388350°N, 78.491050°E
- **Duration**: ~3 minutes 10 seconds (10-second intervals)
- **Distance**: Calculated using Haversine formula

## 🧮 Speed Calculation

The application calculates vehicle speed using:
- **Distance**: Haversine formula for accurate GPS distance
- **Time**: Delta between consecutive timestamps
- **Formula**: Speed (km/h) = Distance (km) / Time (hours)

## 🎨 UI Components

### Map Features
- **OpenStreetMap Tiles**: Free, community-driven map data
- **Polylines**: 
  - Planned route: Gray, dashed, 50% opacity
  - Traveled route: Red, solid, 80% opacity
- **Vehicle Marker**: Custom emoji icon with centered positioning

### Control Panel
- **Responsive Design**: Adapts to different screen sizes
- **Real-time Updates**: Live data refresh during simulation
- **Visual Feedback**: Color-coded status indicators
- **Progress Tracking**: Completion bar and step counter

## 🔧 Customization

### Changing the Route
Edit `public/dummy-route.json` with your GPS coordinates:
```json
[
  {
    "latitude": 17.385044,
    "longitude": 78.486671,
    "timestamp": "2024-07-20T10:00:00Z"
  }
]
```

### Adjusting Simulation Speed
Modify the interval in `VehicleMap.tsx`:
```typescript
}, 2000); // Change from 2000ms (2 seconds) to desired interval
```

### Styling Updates
- **Map Appearance**: Modify polyline colors and styles in the `pathOptions`
- **UI Design**: Update Tailwind classes in the control panel
- **Vehicle Icon**: Change the emoji or create custom SVG icons

## 🎯 Assignment Requirements Met

✅ **Display Interactive Map**: React-Leaflet with OpenStreetMap tiles  
✅ **Show Route Path**: Complete route displayed as polyline  
✅ **Simulate Movement**: Vehicle marker moves along route points  
✅ **Provide Controls**: Play, pause, and reset functionality  
✅ **Display Metadata**: Coordinates, time, speed, and progress  
✅ **Responsive Design**: Tailwind CSS for mobile compatibility  
✅ **TypeScript Support**: Full type safety and IntelliSense  

## 🔍 Technical Implementation Details

- **State Management**: React hooks (`useState`, `useEffect`, `useRef`)
- **Interval Handling**: Proper cleanup to prevent memory leaks
- **Error Handling**: Loading states and error messages for data fetching
- **TypeScript Interfaces**: Type-safe data structures
- **Performance**: Efficient re-rendering with dependency arrays
- **Accessibility**: WCAG-compliant color contrasts and keyboard navigation

---

*Built with ❤️ using React, TypeScript, Vite, React-Leaflet, and Tailwind CSS*