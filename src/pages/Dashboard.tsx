import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getGeminiRouteAnalysis } from '../services/gemini';
import type { RouteAnalysisResult } from '../services/gemini';
import { getDirectionsRoute } from '../services/directions';
import type { RouteResult } from '../services/directions';
import InteractiveMapPreview from '../components/DashboardPreview/InteractiveMapPreview';
import {
  FiMapPin, FiArrowRight, FiTruck, FiThermometer, FiAlertTriangle,
  FiClock, FiCheckCircle, FiLogOut, FiLayers, FiNavigation,
  FiActivity, FiCloud, FiShield, FiZap
} from 'react-icons/fi';

const CARGO_TYPES = [
  { value: 'vaccine',   label: 'Vaccines',       tempMin: 2,   tempMax: 8,   icon: '💉' },
  { value: 'medicine',  label: 'Medicine',        tempMin: 2,   tempMax: 8,   icon: '💊' },
  { value: 'dairy',     label: 'Dairy Products',  tempMin: 1,   tempMax: 4,   icon: '🥛' },
  { value: 'seafood',   label: 'Seafood',          tempMin: -2,  tempMax: 2,   icon: '🐟' },
  { value: 'frozen',    label: 'Frozen Food',     tempMin: -20, tempMax: -15, icon: '🧊' },
  { value: 'fruits',    label: 'Fresh Fruits',    tempMin: 2,   tempMax: 10,  icon: '🍎' },
];

const INDIAN_CITIES = [
  "Agra", "Ahmedabad", "Amritsar", "Aurangabad", "Bangalore", "Bengaluru", 
  "Bhopal", "Bhubaneswar", "Chandigarh", "Chennai", "Coimbatore", "Dehradun", 
  "Delhi", "Goa", "Hyderabad", "Indore", "Jaipur", "Kochi", "Kolkata", 
  "Lucknow", "Madurai", "Mumbai", "Nagpur", "Nashik", "New Delhi", "Patna", 
  "Pune", "Ranchi", "Surat", "Thiruvananthapuram", "Varanasi", "Visakhapatnam"
];

const Dashboard: React.FC = () => {
  const { user, logOut } = useAuth();

  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [cargoType, setCargoType] = useState('vaccine');

  const [loading, setLoading] = useState(false);
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<RouteAnalysisResult | null>(null);

  const selectedCargo = CARGO_TYPES.find(c => c.value === cargoType) || CARGO_TYPES[0];

  const handleAnalyze = async () => {
    if (!origin.trim() || !destination.trim()) return;
    setLoading(true);
    setRouteResult(null);
    setAiAnalysis(null);
    try {
      const route = await getDirectionsRoute(origin.trim(), destination.trim());
      setRouteResult(route);
      const analysis = await getGeminiRouteAnalysis(
        origin.trim(), destination.trim(),
        route.distance, route.duration, cargoType
      );
      setAiAnalysis(analysis);
    } catch (err) {
      console.error('Route analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const riskColor = (level?: string) => {
    if (level === 'Critical') return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' };
    if (level === 'High')     return { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' };
    if (level === 'Medium')   return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' };
    return { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' };
  };

  const userName = user?.name?.split(' ')[0] || 'Operator';

  return (
    <div className="min-h-screen bg-[#F4F6FA] font-sans flex flex-col">

      {/* ── TOP HEADER ── */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-primary-brand text-white rounded-lg">
            <FiLayers className="w-5 h-5" />
          </div>
          <span className="font-bold text-[15px] tracking-tight text-slate-900">
            Cold Chain<span className="text-primary-brand">Wise</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[12px] text-slate-500 hidden sm:block">
            Welcome, <span className="font-semibold text-slate-700">{userName}</span>
          </span>
          <button
            onClick={() => logOut()}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 hover:text-red-500 transition-colors"
          >
            <FiLogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">

        {/* ── HERO INPUT CARD ── */}
        <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden relative">
          
          {/* Background Image on right */}
          <div className="absolute inset-0 lg:left-1/3 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent z-10 hidden lg:block" />
            <div className="absolute inset-0 bg-white/90 lg:hidden z-10" />
            <img src="/hero_truck.png" alt="Truck" className="w-full h-full object-cover object-center opacity-90" />
          </div>

          <div className="relative z-10 p-6 md:p-10">
            <div className="mb-8">
              <h1 className="text-[32px] md:text-[38px] font-black text-slate-900 tracking-tight">
                Route <span className="text-primary-brand">Analysis</span>
              </h1>
              <p className="text-[14px] text-slate-500 mt-1">
                Enter your origin and destination to get a complete cold-chain route report.
              </p>
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-5 w-full">
              
              {/* Origin */}
              <div className="flex-1 w-full flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <FiMapPin className="text-primary-brand" /> From (Location A)
                </label>
                <input
                  type="text"
                  list="indian-cities"
                  value={origin}
                  onChange={e => setOrigin(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
                  placeholder="e.g. Mumbai"
                  className="w-full text-[14px] font-medium bg-white border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary-brand/30 focus:border-primary-brand transition-all shadow-sm"
                />
              </div>

              {/* Arrow */}
              <div className="hidden lg:flex items-center justify-center pt-5">
                <div className="w-9 h-9 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
                  <FiArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
              {/* Mobile Arrow */}
              <div className="flex lg:hidden items-center justify-center w-full py-1">
                 <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
                  <FiArrowRight className="w-4 h-4 text-slate-400 rotate-90" />
                </div>
              </div>

              {/* Destination */}
              <div className="flex-1 w-full flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <FiMapPin className="text-emerald-500" /> To (Location B)
                </label>
                <input
                  type="text"
                  list="indian-cities"
                  value={destination}
                  onChange={e => setDestination(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
                  placeholder="e.g. Pune"
                  className="w-full text-[14px] font-medium bg-white border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary-brand/30 focus:border-primary-brand transition-all shadow-sm"
                />
              </div>

              {/* Analyze Button */}
              <div className="w-full lg:w-auto pt-2 lg:pt-5">
                <button
                  onClick={handleAnalyze}
                  disabled={loading || !origin.trim() || !destination.trim()}
                  className="w-full lg:w-32 bg-primary-brand hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white text-[14px] font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  {loading
                    ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <><FiZap className="w-4 h-4" /> Analyze</>
                  }
                </button>
              </div>
            </div>

            {/* Cargo type selector */}
            <div className="mt-10">
              <datalist id="indian-cities">
                {INDIAN_CITIES.map(city => (
                  <option key={city} value={city} />
                ))}
              </datalist>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">Cargo Type</p>
              <div className="flex flex-wrap gap-3">
                {CARGO_TYPES.map(c => (
                  <button
                    key={c.value}
                    onClick={() => setCargoType(c.value)}
                    className={`flex items-center gap-2 text-[12px] font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm border ${
                      cargoType === c.value
                        ? 'bg-orange-50 text-primary-brand border-primary-brand/30'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-[14px]">{c.icon}</span> 
                    {c.label}
                    <span className={`text-[10px] font-medium ml-1 ${cargoType === c.value ? 'text-primary-brand/70' : 'text-slate-400'}`}>
                      ({c.tempMin}° to {c.tempMax}°C)
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── LOADING STATE ── */}
        {loading && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-3 border-primary-brand/30 border-t-primary-brand rounded-full animate-spin" />
            <p className="text-[14px] font-semibold text-slate-700">Fetching route data & running AI analysis…</p>
            <p className="text-[12px] text-slate-400">Calculating distance, duration, temperature risks, and compliance notes</p>
          </div>
        )}

        {/* ── RESULTS ── */}
        {routeResult && !loading && (
          <>
            {/* Route Summary Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: FiNavigation, label: 'Distance', value: routeResult.distance, color: 'blue' },
                { icon: FiClock, label: 'Est. Duration', value: routeResult.duration, color: 'violet' },
                { icon: FiThermometer, label: 'Safe Temp Range', value: `${selectedCargo.tempMin}° – ${selectedCargo.tempMax}°C`, color: 'sky' },
                { icon: FiActivity, label: 'Spoilage Risk', value: aiAnalysis ? `${aiAnalysis.spoilageProbability}%` : '—', color: aiAnalysis && aiAnalysis.spoilageProbability > 20 ? 'red' : 'emerald' },
              ].map(m => (
                <div key={m.label} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3 shadow-sm">
                  <div className={`p-2.5 bg-${m.color}-50 text-${m.color}-600 rounded-lg flex-shrink-0`}>
                    <m.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{m.label}</p>
                    <p className="text-[15px] font-bold text-slate-900 mt-0.5">{m.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Map + Route Steps */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Map */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-[13px] font-bold text-slate-800">
                      {routeResult.startAddress} → {routeResult.endAddress}
                    </h2>
                    {routeResult.isFallback && (
                      <p className="text-[10px] text-amber-600 mt-0.5">⚠ Estimated route (Maps billing not enabled)</p>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    {selectedCargo.icon} {selectedCargo.label}
                  </span>
                </div>
                <div className="h-[320px]">
                  <InteractiveMapPreview
                    originName={origin}
                    destinationName={destination}
                    cargoName={selectedCargo.label}
                    shipmentId="ROUTE-ANALYSIS"
                    routeCode={`${origin} → ${destination}`}
                  />
                </div>
              </div>

              {/* Route Steps */}
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
                <h3 className="text-[13px] font-bold text-slate-800 flex items-center gap-2">
                  <FiNavigation className="text-primary-brand w-4 h-4" /> Route Breakdown
                </h3>
                <div className="flex flex-col gap-3 overflow-y-auto max-h-[280px]">
                  {routeResult.steps.map((step, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <div className="w-6 h-6 rounded-full bg-primary-brand/10 text-primary-brand text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-[12px] text-slate-700 leading-snug">{step.instruction}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{step.distance} · {step.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Optimal Departure */}
                {aiAnalysis && (
                  <div className="mt-auto border-t border-slate-100 pt-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Optimal Departure</p>
                    <p className="text-[12px] font-semibold text-slate-700">{aiAnalysis.optimalDepartureTime}</p>
                  </div>
                )}
              </div>
            </div>

            {/* AI Analysis Section */}
            {aiAnalysis && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-[16px] font-bold text-slate-900 flex items-center gap-2">
                    <FiShield className="text-primary-brand w-5 h-5" /> AI Cold-Chain Risk Report
                  </h2>
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${riskColor(aiAnalysis.routeRiskLevel).bg} ${riskColor(aiAnalysis.routeRiskLevel).text} ${riskColor(aiAnalysis.routeRiskLevel).border}`}>
                    <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${riskColor(aiAnalysis.routeRiskLevel).dot}`} />
                    {aiAnalysis.routeRiskLevel} Risk
                  </span>
                </div>

                {/* Summary */}
                <p className="text-[13px] text-slate-600 leading-relaxed bg-slate-50 rounded-xl p-4 border border-slate-100">
                  {aiAnalysis.summary}
                </p>

                {/* Stats row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Spoilage Probability</p>
                    <p className={`text-2xl font-bold mt-1 ${aiAnalysis.spoilageProbability > 20 ? 'text-red-600' : 'text-emerald-600'}`}>{aiAnalysis.spoilageProbability}%</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Optimal Departure</p>
                    <p className="text-[13px] font-bold text-slate-800 mt-1">{aiAnalysis.optimalDepartureTime}</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Estimated Cost</p>
                    <p className="text-[13px] font-bold text-slate-800 mt-1">{aiAnalysis.estimatedCost}</p>
                  </div>
                </div>

                {/* 3-col grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                  {/* Temperature Risks */}
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                      <FiThermometer className="text-red-500 w-3.5 h-3.5" /> Temperature Risks
                    </h4>
                    <ul className="flex flex-col gap-2.5">
                      {aiAnalysis.temperatureRisks.map((r, i) => (
                        <li key={i} className="flex gap-2 text-[12px] text-slate-600">
                          <FiAlertTriangle className="text-amber-500 w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Compliance Notes */}
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                      <FiCheckCircle className="text-emerald-500 w-3.5 h-3.5" /> Compliance Notes
                    </h4>
                    <ul className="flex flex-col gap-2.5">
                      {aiAnalysis.complianceNotes.map((n, i) => (
                        <li key={i} className="flex gap-2 text-[12px] text-slate-600">
                          <FiCheckCircle className="text-emerald-500 w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                          {n}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommended Stops */}
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                      <FiTruck className="text-primary-brand w-3.5 h-3.5" /> Recommended Stops
                    </h4>
                    <ul className="flex flex-col gap-2.5">
                      {aiAnalysis.recommendedStops.map((s, i) => (
                        <li key={i} className="flex gap-2 text-[12px] text-slate-600">
                          <span className="text-primary-brand font-bold flex-shrink-0">{i + 1}.</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Weather Corridor */}
                <div className="border-t border-slate-100 pt-5">
                  <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                    <FiCloud className="text-sky-500 w-3.5 h-3.5" /> Weather Corridor Analysis
                  </h4>
                  <p className="text-[12px] text-slate-600 leading-relaxed">{aiAnalysis.weatherCorridorAnalysis}</p>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── EMPTY STATE ── */}
        {!routeResult && !loading && (
          <div className="bg-white rounded-[24px] border border-slate-200 border-dashed p-12 md:p-16 flex flex-col items-center text-center gap-4 shadow-sm mt-2">
            <div className="w-16 h-16 bg-[#F4F6FA] rounded-full flex items-center justify-center mb-2 shadow-sm">
              <FiNavigation className="w-7 h-7 text-indigo-500 transform rotate-45 -ml-1 mt-1" />
            </div>
            <h3 className="text-[20px] font-black text-slate-900">Enter a route to get started</h3>
            <p className="text-[14px] text-slate-500 max-w-md leading-relaxed">
              Type any two Indian cities above (e.g. Mumbai → Pune) and select your cargo type to get a full cold-chain route analysis powered by AI.
            </p>
          </div>
        )}

      </main>
    </div>
  );
};

export default Dashboard;
