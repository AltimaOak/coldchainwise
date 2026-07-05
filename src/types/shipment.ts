export type ShipmentType = 'medicine' | 'vaccine' | 'dairy' | 'seafood' | 'frozen';
export type ShipmentStatus = 'in-transit' | 'delivered' | 'alert' | 'delayed';

export interface Shipment {
  id: string;
  name: string;
  type: ShipmentType;
  status: ShipmentStatus;
  origin: string;
  destination: string;
  tempMin: number;
  tempMax: number;
  currentTemp: number;
  currentHumidity: number;
  batteryLevel: number;
  vehicleId: string;
  eta: string;
  riskScore: number; // 0 to 100
  lastUpdated: number;
}

export type AlertType = 'temp-high' | 'temp-low' | 'route-delay' | 'power-low';
export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface Alert {
  id: string;
  shipmentId: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  timestamp: number;
  resolved: boolean;
}
