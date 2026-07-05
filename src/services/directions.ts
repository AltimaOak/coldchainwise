import { loadGoogleMaps, isMapsConfigured } from './maps';

export interface RouteResult {
  distance: string;
  distanceValue: number;
  duration: string;
  durationValue: number;
  startAddress: string;
  endAddress: string;
  steps: RouteStep[];
  overviewPath: Array<{ lat: number; lng: number }>;
  bounds: { north: number; south: number; east: number; west: number } | null;
  isFallback?: boolean;
}

export interface RouteStep {
  instruction: string;
  distance: string;
  duration: string;
}

// Known Indian city coordinates for smart distance estimation
const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
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

const getCityCoords = (name: string) => {
  const n = name.toLowerCase().trim();
  for (const [city, coords] of Object.entries(CITY_COORDS)) {
    if (n.includes(city)) return coords;
  }
  return null;
};

const haversineKm = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
};

export const getDirectionsRoute = async (
  origin: string,
  destination: string
): Promise<RouteResult> => {
  if (isMapsConfigured) {
    try {
      await loadGoogleMaps();
      const google = (window as any).google;

      const result = await new Promise<any>((resolve, reject) => {
        const svc = new google.maps.DirectionsService();
        svc.route(
          { origin, destination, travelMode: google.maps.TravelMode.DRIVING, region: 'in' },
          (res: any, status: string) => {
            if (status === 'OK' && res.routes.length > 0) resolve(res);
            else reject(new Error(status));
          }
        );
      });

      const route = result.routes[0];
      const leg = route.legs[0];
      return {
        distance: leg.distance?.text || 'Unknown',
        distanceValue: leg.distance?.value || 0,
        duration: leg.duration?.text || 'Unknown',
        durationValue: leg.duration?.value || 0,
        startAddress: leg.start_address || origin,
        endAddress: leg.end_address || destination,
        steps: leg.steps.map((s: any) => ({
          instruction: s.instructions?.replace(/<[^>]*>/g, '') || '',
          distance: s.distance?.text || '',
          duration: s.duration?.text || '',
        })),
        overviewPath: route.overview_path.map((p: any) => ({ lat: p.lat(), lng: p.lng() })),
        bounds: route.bounds ? {
          north: route.bounds.getNorthEast().lat(),
          south: route.bounds.getSouthWest().lat(),
          east: route.bounds.getNorthEast().lng(),
          west: route.bounds.getSouthWest().lng(),
        } : null,
        isFallback: false,
      };
    } catch {
      // Fall through to smart simulation below
    }
  }

  return smartSimulateRoute(origin, destination);
};

const smartSimulateRoute = (origin: string, destination: string): RouteResult => {
  const oCoords = getCityCoords(origin);
  const dCoords = getCityCoords(destination);

  let distKm: number;
  if (oCoords && dCoords) {
    // Use haversine * 1.3 road factor
    distKm = Math.round(haversineKm(oCoords, dCoords) * 1.3);
  } else {
    const seed = (origin.length + destination.length) * 13;
    distKm = 120 + (seed % 500);
  }

  const avgSpeedKph = 55; // Indian highway average
  const totalMins = Math.round((distKm / avgSpeedKph) * 60);
  const hours = Math.floor(totalMins / 60);
  const mins = totalMins % 60;

  const mid1 = Math.round(distKm * 0.35);
  const mid2 = Math.round(distKm * 0.35);
  const mid3 = distKm - mid1 - mid2;

  return {
    distance: `${distKm} km`,
    distanceValue: distKm * 1000,
    duration: hours > 0 ? `${hours} hr ${mins} min` : `${mins} min`,
    durationValue: totalMins * 60,
    startAddress: origin,
    endAddress: destination,
    steps: [
      { instruction: `Depart from ${origin} and take the National Highway`, distance: `${mid1} km`, duration: `${Math.round(mid1 / avgSpeedKph * 60)} min` },
      { instruction: `Continue on NH — highway stretch`, distance: `${mid2} km`, duration: `${Math.round(mid2 / avgSpeedKph * 60)} min` },
      { instruction: `Take state road exit towards ${destination}`, distance: `${mid3} km`, duration: `${Math.round(mid3 / avgSpeedKph * 60)} min` },
    ],
    overviewPath: [],
    bounds: null,
    isFallback: true,
  };
};
