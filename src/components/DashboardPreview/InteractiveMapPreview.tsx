import React, { useEffect, useRef, useState } from 'react';
import { loadGoogleMaps, isMapsConfigured } from '../../services/maps';
import { FiClock, FiActivity, FiAlertTriangle, FiThermometer, FiTruck } from 'react-icons/fi';

interface InteractiveMapPreviewProps {
  originName?: string;
  destinationName?: string;
  cargoName?: string;
  shipmentId?: string;
  routeCode?: string;
}

const INDIAN_COORDINATES: Record<string, { lat: number; lng: number }> = {
  mumbai: { lat: 19.076, lng: 72.878 },
  pune: { lat: 18.52, lng: 73.857 },
  delhi: { lat: 28.614, lng: 77.209 },
  'new delhi': { lat: 28.614, lng: 77.209 },
  bangalore: { lat: 12.972, lng: 77.595 },
  bengaluru: { lat: 12.972, lng: 77.595 },
  chennai: { lat: 13.083, lng: 80.271 },
  hyderabad: { lat: 17.385, lng: 78.487 },
  kolkata: { lat: 22.573, lng: 88.364 },
  ahmedabad: { lat: 23.023, lng: 72.571 },
  jaipur: { lat: 26.912, lng: 75.787 },
  surat: { lat: 21.17, lng: 72.831 },
  lucknow: { lat: 26.847, lng: 80.947 },
  nagpur: { lat: 21.145, lng: 79.088 },
  bhopal: { lat: 23.259, lng: 77.413 },
  indore: { lat: 22.719, lng: 75.857 },
  patna: { lat: 25.594, lng: 85.137 },
  varanasi: { lat: 25.317, lng: 82.974 },
  agra: { lat: 27.177, lng: 78.008 },
  nashik: { lat: 19.998, lng: 73.791 },
  aurangabad: { lat: 19.877, lng: 75.343 },
  goa: { lat: 15.299, lng: 74.124 },
  kochi: { lat: 9.931, lng: 76.267 },
  thiruvananthapuram: { lat: 8.524, lng: 76.936 },
  coimbatore: { lat: 11.017, lng: 76.956 },
  madurai: { lat: 9.925, lng: 78.119 },
  visakhapatnam: { lat: 17.687, lng: 83.218 },
  amritsar: { lat: 31.634, lng: 74.873 },
  chandigarh: { lat: 30.733, lng: 76.779 },
  dehradun: { lat: 30.316, lng: 78.032 },
  ranchi: { lat: 23.344, lng: 85.309 },
  bhubaneswar: { lat: 20.297, lng: 85.818 },
};

const getCoordinates = (name: string, defaultCoords: { lat: number; lng: number }) => {
  const clean = name.toLowerCase().trim();
  for (const [city, coords] of Object.entries(INDIAN_COORDINATES)) {
    if (clean.includes(city)) return coords;
  }
  return defaultCoords;
};

const InteractiveMapPreview: React.FC<InteractiveMapPreviewProps> = ({
  originName = 'Mumbai Pharma Warehouse',
  destinationName = 'Pune Healthcare Institute',
  cargoName = 'BioMed Vaccine Lot B2',
  shipmentId = 'SH-2026-001',
  routeCode = 'BOM ➔ PNQ'
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [useFallback, setUseFallback] = useState(!isMapsConfigured);
  const [truckPos, setTruckPos] = useState({ x: 120, y: 150 });
  const [truckTemp, setTruckTemp] = useState(4.2);
  const [truckRisk, setTruckRisk] = useState(8);

  // Fallback animation for the moving truck
  useEffect(() => {
    if (!useFallback) return;

    let angle = 0;
    const startPoint = { x: 100, y: 180 };
    const endPoint = { x: 380, y: 80 };
    
    const interval = setInterval(() => {
      angle += 0.015;
      if (angle > 1) angle = 0;

      // Calculate position along a bezier curve route
      const x = (1 - angle) * startPoint.x + angle * endPoint.x;
      const y = (1 - angle) * startPoint.y + angle * endPoint.y - Math.sin(angle * Math.PI) * 40;

      setTruckPos({ x, y });

      // Simulated temperature fluctuations
      const tempDrift = Math.sin(angle * Math.PI * 4) * 0.4 + 4.2;
      setTruckTemp(Number(tempDrift.toFixed(1)));

      // High temperature warning at midpoint
      if (tempDrift > 4.5) {
        setTruckRisk(14);
      } else {
        setTruckRisk(8);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [useFallback]);

  // Google Maps Initialization
  useEffect(() => {
    if (useFallback || !mapRef.current) return;

    loadGoogleMaps()
      .then(() => {
        if (!mapRef.current) return;
        const google = (window as any).google;
        
        const originCoords = getCoordinates(originName, { lat: 19.0760, lng: 72.8777 });
        const destCoords = getCoordinates(destinationName, { lat: 18.5204, lng: 73.8567 });

        const map = new google.maps.Map(mapRef.current, {
          center: originCoords,
          zoom: 9,
          disableDefaultUI: true,
          styles: [
            { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
            { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
            { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
            { featureType: 'administrative.land_parcel', elementType: 'labels.text.fill', stylers: [{ color: '#bdbdbd' }] },
            { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#eeeeee' }] },
            { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
            { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
            { featureType: 'road.arterial', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
            { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#dadada' }] },
            { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
            { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9c9c9' }] },
            { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] }
          ]
        });

        // Add markers and routing if Google Maps initializes
        new google.maps.Marker({
          position: originCoords,
          map,
          title: `${originName} (Origin)`
        });

        new google.maps.Marker({
          position: destCoords,
          map,
          title: `${destinationName} (Destination)`
        });

        const routeCoordinates = [originCoords, destCoords];
        const routePath = new google.maps.Polyline({
          path: routeCoordinates,
          geodesic: true,
          strokeColor: '#2563EB',
          strokeOpacity: 1.0,
          strokeWeight: 4
        });

        routePath.setMap(map);
      })
      .catch((err) => {
        console.warn("Maps JS load failed, defaulting to SVG Fallback Map.", err);
        setUseFallback(true);
      });
  }, [useFallback, originName, destinationName]);

  return (
    <div className="relative w-full h-[320px] md:h-[380px] bg-slate-900 rounded-card border border-slate-800 overflow-hidden shadow-2xl">
      
      {/* Map Rendering Container */}
      <div ref={mapRef} className="absolute inset-0 w-full h-full" style={{ display: useFallback ? 'none' : 'block' }} />

      {/* Polish Fallback Vector Map */}
      {useFallback && (
        <div className="absolute inset-0 w-full h-full bg-[#0F172A] opacity-90 select-none flex items-center justify-center">
          {/* Simulated grid lines */}
          <div 
            className="absolute inset-0 opacity-10" 
            style={{ 
              backgroundImage: 'radial-gradient(circle, #334155 1px, transparent 1px)', 
              backgroundSize: '16px 16px' 
            }} 
          />

          {/* Core SVG Route */}
          <svg className="w-full h-full absolute inset-0">
            {/* Origin indicator */}
            <circle cx="100" cy="180" r="6" fill="#3B82F6" className="animate-ping" />
            <circle cx="100" cy="180" r="4" fill="#2563EB" />
            <text x="85" y="200" fill="#94A3B8" fontSize="10" className="font-semibold">{originName}</text>

            {/* Destination indicator */}
            <circle cx="380" cy="80" r="6" fill="#10B981" className="animate-ping" />
            <circle cx="380" cy="80" r="4" fill="#059669" />
            <text x="340" y="60" fill="#94A3B8" fontSize="10" className="font-semibold">{destinationName}</text>

            {/* Route Polyline (Bezier) */}
            <path 
              d="M 100 180 Q 240 70 380 80" 
              fill="none" 
              stroke="#1E293B" 
              strokeWidth="5" 
              strokeLinecap="round" 
              className="route-underlay"
            />
            <path 
              d="M 100 180 Q 240 70 380 80" 
              fill="none" 
              stroke="#EA580C" 
              strokeWidth="3" 
              strokeDasharray="8 4" 
              strokeLinecap="round" 
              className="route-line-primary"
            />

            {/* Moving Truck Marker */}
            <g transform={`translate(${truckPos.x - 14}, ${truckPos.y - 14})`}>
              <circle cx="14" cy="14" r="14" fill="#EA580C" className="opacity-20 animate-pulse" />
              <circle cx="14" cy="14" r="10" fill="#EA580C" />
              <g transform="translate(6, 6) scale(0.65)" fill="white">
                <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-5H17V9h2.5l2.25 3h-2.25zM18 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
              </g>
            </g>
          </svg>
        </div>
      )}

      {/* Floating Shipment Telemetry Overlay Card (White with Orange highlight border) */}
      <div className="absolute top-4 left-4 bg-white/98 border border-[#E7E5E4] border-l-4 border-l-[#EA580C] rounded-lg p-4 w-[240px] text-slate-800 flex flex-col gap-3.5 shadow-xl select-none z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#EA580C] animate-pulse" />
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Active Telemetry</span>
          </div>
          <span className="text-[9px] bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-600 font-mono">{shipmentId}</span>
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-slate-900 font-bold">{cargoName}</span>
          <span className="text-[10px] text-slate-500 font-semibold">Route: {routeCode}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
          {/* Temperature Indicator */}
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1 text-[10px] text-slate-500">
              <FiThermometer className="text-[#EA580C] w-3 h-3" />
              <span>Temp</span>
            </div>
            <span className="text-sm font-extrabold tracking-tight text-slate-900">{truckTemp.toFixed(1)}°C</span>
          </div>

          {/* Risk Level / Score */}
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1 text-[10px] text-slate-500">
              <FiActivity className="text-emerald-600 w-3 h-3" />
              <span>Risk Score</span>
            </div>
            <span className="text-sm font-extrabold tracking-tight text-emerald-600">{truckRisk}%</span>
          </div>
        </div>

        <div className="flex justify-between items-center text-[10px] border-t border-slate-100 pt-3 text-slate-500">
          <div className="flex items-center gap-1">
            <FiClock className="w-3.5 h-3.5 text-slate-400" />
            <span>ETA: 14:30 UTC</span>
          </div>
          <div className="flex items-center gap-1 bg-orange-50 px-1.5 py-0.5 rounded text-[#EA580C] font-bold">
            <FiTruck className="w-3 h-3" />
            <span>55 mph</span>
          </div>
        </div>
      </div>

      {/* Live Warning Notice if Temp Drift High */}
      {truckTemp > 4.4 && (
        <div className="absolute bottom-4 right-4 bg-amber-500/90 backdrop-blur-sm text-slate-950 font-bold text-[10px] px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-lg animate-bounce z-10">
          <FiAlertTriangle className="w-4 h-4" />
          <span>TEMP FLUCTUATION DETECTED</span>
        </div>
      )}
    </div>
  );
};

export default InteractiveMapPreview;
