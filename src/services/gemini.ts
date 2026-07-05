import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Shipment, Alert } from '../types/shipment';
import type { Vehicle } from '../types/vehicle';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const isGeminiConfigured = !!apiKey && apiKey !== 'undefined' && apiKey !== '';

let genAI: any = null;
if (isGeminiConfigured) {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    console.log("Gemini API initialized successfully.");
  } catch (err) {
    console.error("Failed to initialize Gemini API SDK:", err);
  }
}

export interface RiskAnalysisResult {
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  spoilageProbability: number; // 0 to 100
  analysis: string;
  mitigationPlan: string[];
  safeWindowHours: number;
}

export const getGeminiShipmentAnalysis = async (
  shipment: Shipment,
  alerts: Alert[],
  vehicle?: Vehicle
): Promise<RiskAnalysisResult> => {
  if (isGeminiConfigured && genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      
      const activeAlertsText = alerts
        .filter(a => !a.resolved && a.shipmentId === shipment.id)
        .map(a => `- [${a.severity.toUpperCase()}] ${a.message}`)
        .join('\n') || 'None';

      const prompt = `
You are an expert enterprise cold-chain logistics auditor. Analyze the following telemetry and route details for a temperature-sensitive shipment and generate a structured risk assessment report.

SHIPMENT & ROUTE PARAMETERS:
- ID: ${shipment.id}
- Route: From ${shipment.origin || 'Mumbai'} to ${shipment.destination || 'Pune'}
- Cargo Type: ${shipment.type} (${shipment.name})
- Ideal Temperature Range: ${shipment.tempMin}°C to ${shipment.tempMax}°C
- Current Telemetry: Temperature = ${shipment.currentTemp}°C, Humidity = ${shipment.currentHumidity}%, Battery Level = ${shipment.batteryLevel}%
- Vehicle: ${vehicle ? `${vehicle.name} (Speed: ${vehicle.speed} mph, Reefer Temp: ${vehicle.temp}°C)` : 'Unknown'}
- Unresolved Alerts:
${activeAlertsText}

Return your analysis ONLY in the following valid JSON format without markdown code blocks. Ensure you strictly match this structure:
{
  "riskLevel": "Low" | "Medium" | "High" | "Critical",
  "spoilageProbability": 0, // Integer 0-100
  "analysis": "Short 2-3 sentence technical summary of the primary threat vector and cause.",
  "mitigationPlan": ["Mitigation Step 1", "Mitigation Step 2", "Mitigation Step 3"], // 3-4 specific operational recommendations
  "safeWindowHours": 0.5 // Estimated hours before product degradation begins. Use decimals if needed.
}
`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      // Clean possible markdown wrappers if Gemini returned them
      const cleanText = text.replace(/```json/gi, '').replace(/```/gi, '').trim();
      const parsed = JSON.parse(cleanText);
      
      return {
        riskLevel: parsed.riskLevel || 'Low',
        spoilageProbability: parsed.spoilageProbability ?? 10,
        analysis: parsed.analysis || 'Analysis successfully generated.',
        mitigationPlan: parsed.mitigationPlan || ['No immediate mitigation needed.'],
        safeWindowHours: parsed.safeWindowHours ?? 24
      };
    } catch (err) {
      console.error("Gemini live execution failed. Running mock fallback.", err);
      // Fall through to mock
    }
  }

  // Robust Simulation Mode: Deterministic based on telemetry
  await new Promise((resolve) => setTimeout(resolve, 1200)); // Simulate AI computation latency
  
  const activeAlerts = alerts.filter(a => !a.resolved && a.shipmentId === shipment.id);
  const tempDeviation = Math.max(
    0, 
    shipment.currentTemp - shipment.tempMax, 
    shipment.tempMin - shipment.currentTemp
  );
  
  let riskLevel: 'Low' | 'Medium' | 'High' | 'Critical' = 'Low';
  let spoilageProbability = 0;
  let analysis = '';
  let mitigationPlan: string[] = [];
  let safeWindowHours = 24;

  if (activeAlerts.length > 0 || tempDeviation > 0) {
    if (tempDeviation > 3) {
      riskLevel = 'Critical';
      spoilageProbability = Math.min(98, Math.floor(40 + tempDeviation * 12));
      safeWindowHours = Math.round((4 / tempDeviation) * 10) / 10;
    } else if (tempDeviation > 0.5 || activeAlerts.some(a => a.severity === 'critical')) {
      riskLevel = 'High';
      spoilageProbability = Math.min(80, Math.floor(20 + tempDeviation * 15));
      safeWindowHours = Math.round((8 / tempDeviation) * 10) / 10;
    } else {
      riskLevel = 'Medium';
      spoilageProbability = Math.floor(10 + tempDeviation * 8);
      safeWindowHours = 12;
    }
  } else {
    // Normal state
    riskLevel = 'Low';
    spoilageProbability = Math.max(1, Math.floor(shipment.riskScore / 2));
    safeWindowHours = 48;
  }

  // Type-specific analysis
  if (shipment.type === 'vaccine') {
    if (riskLevel === 'Critical' || riskLevel === 'High') {
      analysis = `Critical thermal breach detected for vaccine shipment ${shipment.id} en route from ${shipment.origin || 'Mumbai'} to ${shipment.destination || 'Pune'}. The cargo is currently at ${shipment.currentTemp}°C, exceeding the narrow required margin of ${shipment.tempMin}-${shipment.tempMax}°C. Protein degradation accelerates rapidly above 8°C.`;
      mitigationPlan = [
        'Alert driver immediately to check compressor power breakers.',
        'Manually override reefer temperature setpoint to 2.0°C.',
        'Reroute vehicle to nearest cold-chain certified storage hub.',
        'Activate backup nitrogen dry-ice packs if temperature does not stabilize within 30 minutes.'
      ];
    } else {
      analysis = `Vaccine cargo ${shipment.id} is stable inside the safe thermal envelope (${shipment.currentTemp}°C) en route from ${shipment.origin || 'Mumbai'} to ${shipment.destination || 'Pune'}. IoT sensor battery is sufficient, and GPS tracking shows on-schedule telemetry.`;
      mitigationPlan = [
        'Maintain current thermostat configuration.',
        'Perform routine sensor battery status check at next hub check-in.'
      ];
    }
  } else if (shipment.type === 'seafood' || shipment.type === 'frozen') {
    if (riskLevel === 'Critical' || riskLevel === 'High') {
      analysis = `Defrost danger detected en route from ${shipment.origin || 'Mumbai'} to ${shipment.destination || 'Pune'}. Seafood cargo must maintain strict sub-zero temperatures. Current reading is ${shipment.currentTemp}°C (Limit: ${shipment.tempMax}°C). Heat ingress threatens thawing.`;
      mitigationPlan = [
        'Instruct operator to trigger secondary defrost cycle bypass.',
        `Check door seals on ${vehicle?.name || "carrier"} for air leakage.`,
        'Expedite transit: route optimizer suggests bypassing high-traffic corridors.',
        'Prepare emergency staging freezer at destination.'
      ];
    } else {
      analysis = `Sub-zero frozen food shipment is secure at ${shipment.currentTemp}°C en route from ${shipment.origin || 'Mumbai'} to ${shipment.destination || 'Pune'}. Temperature fluctuations are within standard operational limits.`;
      mitigationPlan = [
        'Monitor temperature hourly for defrost cycle fluctuations.',
        'Confirm arrival port freezer bay availability.'
      ];
    }
  } else {
    // Dairy or general medicines
    if (riskLevel === 'Critical' || riskLevel === 'High') {
      analysis = `Temperature breach on shipment ${shipment.id} en route from ${shipment.origin || 'Mumbai'} to ${shipment.destination || 'Pune'} is affecting cargo stability. Spoilage risk has climbed to ${spoilageProbability}% due to sustained temperature readings of ${shipment.currentTemp}°C.`;
      mitigationPlan = [
        'Contact dispatcher to double check driver log and compressor state.',
        'Adjust setpoint down by 1.5°C to compensate for cargo warmth.',
        'Initiate prioritised delivery sequence at destination hub.'
      ];
    } else {
      analysis = `SaaS telemetry reports normal operation for shipment ${shipment.id} en route from ${shipment.origin || 'Mumbai'} to ${shipment.destination || 'Pune'}. Temperature remains stable at ${shipment.currentTemp}°C.`;
      mitigationPlan = [
        'Maintain default routing parameters.',
        'No corrective actions required.'
      ];
    }
  }

  return {
    riskLevel,
    spoilageProbability,
    analysis,
    mitigationPlan,
    safeWindowHours
  };
};

// ============================================================
// Route Analysis (A → B) — Used on the Reports/Route Analysis page
// ============================================================

export interface RouteAnalysisResult {
  routeRiskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  summary: string;
  temperatureRisks: string[];
  weatherCorridorAnalysis: string;
  optimalDepartureTime: string;
  spoilageProbability: number;
  complianceNotes: string[];
  estimatedCost: string;
  recommendedStops: string[];
}

export const getGeminiRouteAnalysis = async (
  origin: string,
  destination: string,
  distance: string,
  duration: string,
  cargoType: string
): Promise<RouteAnalysisResult> => {
  if (isGeminiConfigured && genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const prompt = `
You are an expert cold-chain logistics route analyst for Indian transportation corridors. Analyze the following route for a temperature-sensitive shipment and generate a comprehensive risk & compliance report.

ROUTE DETAILS:
- Origin: ${origin}
- Destination: ${destination}
- Distance: ${distance}
- Estimated Duration: ${duration}
- Cargo Type: ${cargoType}
- Country: India
- Current Season: ${new Date().toLocaleString('en-IN', { month: 'long' })} (consider Indian weather patterns)

Return your analysis ONLY in the following valid JSON format without markdown code blocks:
{
  "routeRiskLevel": "Low" | "Medium" | "High" | "Critical",
  "summary": "2-3 sentence overview of the route analysis covering key risks and recommendations.",
  "temperatureRisks": ["Risk 1", "Risk 2", "Risk 3"],
  "weatherCorridorAnalysis": "A paragraph about weather conditions along this route corridor in India during the current season.",
  "optimalDepartureTime": "Recommended departure time window (e.g., '4:00 AM - 6:00 AM') with reason.",
  "spoilageProbability": 0,
  "complianceNotes": ["Compliance note 1", "Compliance note 2"],
  "estimatedCost": "Estimated fuel + reefer operational cost in INR for this route",
  "recommendedStops": ["Stop 1 with reason", "Stop 2 with reason"]
}
`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const cleanText = text.replace(/```json/gi, '').replace(/```/gi, '').trim();
      const parsed = JSON.parse(cleanText);

      return {
        routeRiskLevel: parsed.routeRiskLevel || 'Low',
        summary: parsed.summary || 'Route analysis completed.',
        temperatureRisks: parsed.temperatureRisks || [],
        weatherCorridorAnalysis: parsed.weatherCorridorAnalysis || 'Weather data unavailable.',
        optimalDepartureTime: parsed.optimalDepartureTime || 'Early morning (4-6 AM)',
        spoilageProbability: parsed.spoilageProbability ?? 5,
        complianceNotes: parsed.complianceNotes || [],
        estimatedCost: parsed.estimatedCost || 'Not estimated',
        recommendedStops: parsed.recommendedStops || [],
      };
    } catch (err) {
      console.error('Gemini route analysis failed, using fallback:', err);
    }
  }

  // Fallback simulation
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return {
    routeRiskLevel: cargoType === 'vaccine' || cargoType === 'medicine' ? 'Medium' : 'Low',
    summary: `Route from ${origin} to ${destination} (${distance}, ~${duration}) has been analyzed for ${cargoType} cargo. The corridor passes through standard Indian highway infrastructure with moderate ambient temperature exposure.`,
    temperatureRisks: [
      `Ambient temperature along this ${distance} corridor may exceed 35°C during midday in summer months.`,
      `Extended transit duration of ${duration} increases thermal exposure risk for ${cargoType} cargo.`,
      'Highway construction zones may cause idle periods with reduced reefer efficiency.',
    ],
    weatherCorridorAnalysis: `The ${origin} to ${destination} corridor in ${new Date().toLocaleString('en-IN', { month: 'long' })} typically experiences temperatures between 28-38°C. Monsoon conditions may cause delays and increased humidity exposure. Night-time transit is recommended for temperature-sensitive cargo.`,
    optimalDepartureTime: '4:00 AM - 6:00 AM (minimizes peak heat exposure)',
    spoilageProbability: cargoType === 'vaccine' ? 12 : cargoType === 'seafood' ? 18 : 8,
    complianceNotes: [
      'Ensure GDP-compliant temperature logging is active for the full route duration.',
      'Pre-cool reefer unit to target temperature 2 hours before loading.',
      'Verify driver has completed cold-chain handling certification.',
    ],
    estimatedCost: `₹${Math.round(parseInt(distance) * 45 + 2000).toLocaleString('en-IN')} (estimated)`,
    recommendedStops: [
      'Midpoint fuel station — check reefer fuel and temperature readings.',
      'Destination approach — pre-notify receiving dock for immediate cold-room transfer.',
    ],
  };
};
