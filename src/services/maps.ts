import { importLibrary, setOptions } from '@googlemaps/js-api-loader';

const mapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
export const isMapsConfigured = 
  !!mapsApiKey && 
  mapsApiKey !== 'undefined' && 
  mapsApiKey !== '';

if (isMapsConfigured) {
  setOptions({
    key: mapsApiKey,
    version: 'weekly'
  } as any);
}

export const loadGoogleMaps = (): Promise<any> => {
  if (!isMapsConfigured) {
    return Promise.reject(new Error('Google Maps API key is not configured.'));
  }
  // Load core 'maps' and 'marker' libraries using the new functional API
  return Promise.all([
    importLibrary('maps'),
    importLibrary('marker')
  ]);
};


