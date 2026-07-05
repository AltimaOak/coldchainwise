import { ref, onValue, set, update } from 'firebase/database';
import { database, isFirebaseConfigured } from './firebase';
import type { Shipment, Alert, ShipmentStatus } from '../types/shipment';
import type { Vehicle } from '../types/vehicle';

// No more hardcoded mock data — database starts empty.
// Users add shipments/vehicles through the UI.

export const INITIAL_VEHICLES: Vehicle[] = [];
export const INITIAL_SHIPMENTS: Shipment[] = [];
export const INITIAL_ALERTS: Alert[] = [];

// ---- Create Functions ----

export const addShipment = async (shipment: Shipment): Promise<void> => {
  if (isFirebaseConfigured && database) {
    try {
      const dbRef = ref(database, `shipments/${shipment.id}`);
      await set(dbRef, shipment);
      return;
    } catch (writeErr) {
      console.warn("Firebase shipment write failed. Saving to local cache.", writeErr);
    }
  }
  const db = getLocalDb();
  db.shipments.push(shipment);
  saveLocalDb(db);
};

export const addVehicle = async (vehicle: Vehicle): Promise<void> => {
  if (isFirebaseConfigured && database) {
    try {
      const dbRef = ref(database, `vehicles/${vehicle.id}`);
      await set(dbRef, vehicle);
      return;
    } catch (writeErr) {
      console.warn("Firebase vehicle write failed. Saving to local cache.", writeErr);
    }
  }
  const db = getLocalDb();
  db.vehicles.push(vehicle);
  saveLocalDb(db);
};

export const deleteShipment = async (shipmentId: string): Promise<void> => {
  if (isFirebaseConfigured && database) {
    try {
      const dbRef = ref(database, `shipments/${shipmentId}`);
      await set(dbRef, null);
      return;
    } catch (writeErr) {
      console.warn("Firebase shipment delete failed.", writeErr);
    }
  }
  const db = getLocalDb();
  db.shipments = db.shipments.filter((s: Shipment) => s.id !== shipmentId);
  saveLocalDb(db);
};

// Memory/Local Storage Simulation Cache
const LOCAL_STORAGE_DB_KEY = 'coldchain_simulation_db';

const getLocalDb = () => {
  const data = localStorage.getItem(LOCAL_STORAGE_DB_KEY);
  if (data) {
    return JSON.parse(data);
  }
  
  // Set default initial data
  const initialDb = {
    shipments: INITIAL_SHIPMENTS,
    vehicles: INITIAL_VEHICLES,
    alerts: INITIAL_ALERTS
  };
  localStorage.setItem(LOCAL_STORAGE_DB_KEY, JSON.stringify(initialDb));
  return initialDb;
};

const saveLocalDb = (db: any) => {
  localStorage.setItem(LOCAL_STORAGE_DB_KEY, JSON.stringify(db));
  // Dispatch a custom event to notify active listeners in the same window
  window.dispatchEvent(new Event('simulation-db-update'));
};

// ----------------------------------------------------
// Database Operations
// ----------------------------------------------------

export const subscribeToShipments = (onChanged: (shipments: Shipment[]) => void): (() => void) => {
  if (isFirebaseConfigured && database) {
    const dbRef = ref(database, 'shipments');
    return onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        onChanged(Object.values(data));
      } else {
        // Seed database if empty
        const initialMap = INITIAL_SHIPMENTS.reduce((acc, s) => ({ ...acc, [s.id]: s }), {});
        set(dbRef, initialMap).catch(() => {});
        onChanged(INITIAL_SHIPMENTS);
      }
    }, (error) => {
      console.warn("Firebase shipments subscription read failed (permission denied). Falling back to local storage cache.", error);
      onChanged(getLocalDb().shipments);
    });
  } else {
    const handleUpdate = () => {
      onChanged(getLocalDb().shipments);
    };
    handleUpdate(); // Initial call
    window.addEventListener('simulation-db-update', handleUpdate);
    return () => window.removeEventListener('simulation-db-update', handleUpdate);
  }
};

export const subscribeToVehicles = (onChanged: (vehicles: Vehicle[]) => void): (() => void) => {
  if (isFirebaseConfigured && database) {
    const dbRef = ref(database, 'vehicles');
    return onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        onChanged(Object.values(data));
      } else {
        // Seed database if empty
        const initialMap = INITIAL_VEHICLES.reduce((acc, v) => ({ ...acc, [v.id]: v }), {});
        set(dbRef, initialMap).catch(() => {});
        onChanged(INITIAL_VEHICLES);
      }
    }, (error) => {
      console.warn("Firebase vehicles subscription read failed (permission denied). Falling back to local storage cache.", error);
      onChanged(getLocalDb().vehicles);
    });
  } else {
    const handleUpdate = () => {
      onChanged(getLocalDb().vehicles);
    };
    handleUpdate();
    window.addEventListener('simulation-db-update', handleUpdate);
    return () => window.removeEventListener('simulation-db-update', handleUpdate);
  }
};

export const subscribeToAlerts = (onChanged: (alerts: Alert[]) => void): (() => void) => {
  if (isFirebaseConfigured && database) {
    const dbRef = ref(database, 'alerts');
    return onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        // Firebase list values
        const alertList = Object.values(data) as Alert[];
        onChanged(alertList.sort((a, b) => b.timestamp - a.timestamp));
      } else {
        // Seed database if empty
        const initialMap = INITIAL_ALERTS.reduce((acc, a) => ({ ...acc, [a.id]: a }), {});
        set(dbRef, initialMap).catch(() => {});
        onChanged(INITIAL_ALERTS);
      }
    }, (error) => {
      console.warn("Firebase alerts subscription read failed (permission denied). Falling back to local storage cache.", error);
      const sortedAlerts = [...getLocalDb().alerts].sort((a, b) => b.timestamp - a.timestamp);
      onChanged(sortedAlerts);
    });
  } else {
    const handleUpdate = () => {
      const sortedAlerts = [...getLocalDb().alerts].sort((a, b) => b.timestamp - a.timestamp);
      onChanged(sortedAlerts);
    };
    handleUpdate();
    window.addEventListener('simulation-db-update', handleUpdate);
    return () => window.removeEventListener('simulation-db-update', handleUpdate);
  }
};

export const updateShipmentTelemetry = async (
  shipmentId: string,
  updates: Partial<Shipment>
): Promise<void> => {
  if (isFirebaseConfigured && database) {
    try {
      const dbRef = ref(database, `shipments/${shipmentId}`);
      await update(dbRef, { ...updates, lastUpdated: Date.now() });
      return;
    } catch (writeErr) {
      console.warn("Firebase shipment update failed (permission denied). Updating local cache fallback instead.", writeErr);
    }
  }
  
  const db = getLocalDb();
  db.shipments = db.shipments.map((s: Shipment) => 
    s.id === shipmentId 
      ? { ...s, ...updates, lastUpdated: Date.now() } 
      : s
  );
  saveLocalDb(db);
};

export const updateVehicleTelemetry = async (
  vehicleId: string,
  updates: Partial<Vehicle>
): Promise<void> => {
  if (isFirebaseConfigured && database) {
    try {
      const dbRef = ref(database, `vehicles/${vehicleId}`);
      await update(dbRef, updates);
      return;
    } catch (writeErr) {
      console.warn("Firebase vehicle update failed (permission denied). Updating local cache fallback instead.", writeErr);
    }
  }
  
  const db = getLocalDb();
  db.vehicles = db.vehicles.map((v: Vehicle) => 
    v.id === vehicleId ? { ...v, ...updates } : v
  );
  saveLocalDb(db);
};

export const triggerAlert = async (alert: Omit<Alert, 'id' | 'timestamp' | 'resolved'>): Promise<void> => {
  const alertId = 'ALT-' + Math.floor(100 + Math.random() * 900);
  const newAlert: Alert = {
    ...alert,
    id: alertId,
    timestamp: Date.now(),
    resolved: false
  };

  if (isFirebaseConfigured && database) {
    try {
      const dbRef = ref(database, `alerts/${alertId}`);
      await set(dbRef, newAlert);
      return;
    } catch (writeErr) {
      console.warn("Firebase alert trigger failed (permission denied). Injecting into local cache fallback instead.", writeErr);
    }
  }
  
  const db = getLocalDb();
  db.alerts.unshift(newAlert);
  saveLocalDb(db);
};

export const resolveAlert = async (alertId: string): Promise<void> => {
  if (isFirebaseConfigured && database) {
    try {
      const dbRef = ref(database, `alerts/${alertId}`);
      await update(dbRef, { resolved: true });
      return;
    } catch (writeErr) {
      console.warn("Firebase alert resolve failed (permission denied). Saving in local cache fallback instead.", writeErr);
    }
  }
  
  const db = getLocalDb();
  db.alerts = db.alerts.map((a: Alert) => 
    a.id === alertId ? { ...a, resolved: true } : a
  );
  saveLocalDb(db);
};

// Simulated real-time sensor updates
export const startTelemetrySimulation = (onTick: () => void): (() => void) => {
  let intervalId: any = null;
  
  const tick = async () => {
    // Randomly update coordinates slightly, speed, and temperature of active vehicles
    const db = getLocalDb();
    let updated = false;

    db.vehicles = db.vehicles.map((v: Vehicle) => {
      if (v.status !== 'active') return v;
      updated = true;
      
      // Slight movement
      const latDelta = (Math.random() - 0.5) * 0.003;
      const lngDelta = (Math.random() - 0.5) * 0.003;
      // Slight temperature drift (+/- 0.1 degree)
      const tempDrift = (Math.random() - 0.5) * 0.2;
      const newTemp = Math.round((v.temp + tempDrift) * 10) / 10;
      // Slight speed adjustment
      const newSpeed = Math.max(30, Math.min(75, v.speed + Math.floor((Math.random() - 0.5) * 8)));

      return {
        ...v,
        latitude: v.latitude + latDelta,
        longitude: v.longitude + lngDelta,
        temp: newTemp,
        speed: newSpeed
      };
    });

    // Mirror to shipments
    db.shipments = db.shipments.map((s: Shipment) => {
      const matchVehicle = db.vehicles.find((v: Vehicle) => v.id === s.vehicleId);
      if (matchVehicle && s.status === 'in-transit') {
        // Sync shipment temperature with truck temperature
        const isOutOfRange = matchVehicle.temp < s.tempMin || matchVehicle.temp > s.tempMax;
        
        let newStatus: ShipmentStatus = s.status;
        let newRiskScore = s.riskScore;

        if (isOutOfRange) {
          newStatus = 'alert';
          newRiskScore = Math.min(100, s.riskScore + 5);
        } else {
          newRiskScore = Math.max(0, s.riskScore - 2);
          if (newRiskScore < 20 && (s.status as ShipmentStatus) === 'alert') {
            newStatus = 'in-transit';
          }
        }

        return {
          ...s,
          currentTemp: matchVehicle.temp,
          status: newStatus,
          riskScore: newRiskScore,
          lastUpdated: Date.now()
        };
      }
      return s;
    });

    if (updated) {
      saveLocalDb(db);
      onTick();
    }
  };

  intervalId = setInterval(tick, 4000);
  return () => clearInterval(intervalId);
};
