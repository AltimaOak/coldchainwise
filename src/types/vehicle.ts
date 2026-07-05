export type VehicleStatus = 'active' | 'maintenance' | 'idle';

export interface Vehicle {
  id: string;
  name: string;
  driverName: string;
  status: VehicleStatus;
  latitude: number;
  longitude: number;
  speed: number; // in mph
  temp: number; // current reefer temp in Celsius
}
