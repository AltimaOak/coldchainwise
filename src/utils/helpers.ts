import type { ShipmentStatus, AlertSeverity } from '../types/shipment';

// Format temperature value in Celsius
export const formatTemp = (temp: number | undefined): string => {
  if (temp === undefined) return '--';
  return `${temp.toFixed(1)}°C`;
};

// Format humidity value
export const formatHumidity = (humidity: number | undefined): string => {
  if (humidity === undefined) return '--';
  return `${humidity}% RH`;
};

// Format date into readable string
export const formatDate = (timestamp: number | string | undefined): string => {
  if (!timestamp) return '--';
  if (typeof timestamp === 'string') return timestamp;
  return new Date(timestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

// Returns style classes based on shipment status
export const getShipmentStatusStyle = (status: ShipmentStatus) => {
  switch (status) {
    case 'delivered':
      return {
        bg: 'bg-green-50 text-green-700 border-green-200',
        text: 'text-green-600',
        dot: 'bg-green-500',
        label: 'Delivered'
      };
    case 'in-transit':
      return {
        bg: 'bg-blue-50 text-blue-700 border-blue-200',
        text: 'text-blue-600',
        dot: 'bg-blue-500',
        label: 'In Transit'
      };
    case 'alert':
      return {
        bg: 'bg-red-50 text-red-700 border-red-200 animate-pulse',
        text: 'text-red-600',
        dot: 'bg-red-500',
        label: 'Thermal Alert'
      };
    case 'delayed':
      return {
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        text: 'text-amber-600',
        dot: 'bg-amber-500',
        label: 'Delayed'
      };
    default:
      return {
        bg: 'bg-slate-50 text-slate-700 border-slate-200',
        text: 'text-slate-600',
        dot: 'bg-slate-500',
        label: 'Unknown'
      };
  }
};

// Returns style classes based on alert severity
export const getAlertSeverityStyle = (severity: AlertSeverity) => {
  switch (severity) {
    case 'critical':
      return 'bg-red-100 text-red-800 border-red-300';
    case 'warning':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'info':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-300';
  }
};

// Returns risk badge class based on risk score (0-100)
export const getRiskScoreStyle = (score: number) => {
  if (score >= 80) {
    return {
      bg: 'bg-red-100 text-red-800',
      label: 'Critical Risk',
      border: 'border-red-200'
    };
  } else if (score >= 40) {
    return {
      bg: 'bg-amber-100 text-amber-800',
      label: 'Moderate Risk',
      border: 'border-amber-200'
    };
  } else {
    return {
      bg: 'bg-green-100 text-green-800',
      label: 'Low Risk',
      border: 'border-green-200'
    };
  }
};
