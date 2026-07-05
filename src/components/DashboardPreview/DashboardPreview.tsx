import React from 'react';
import InteractiveMapPreview from './InteractiveMapPreview';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Legend 
} from 'recharts';
import { 
  FiAlertTriangle, 
  FiTrendingUp, 
  FiMapPin, 
  FiCpu, 
  FiCompass, 
  FiList 
} from 'react-icons/fi';

const MOCK_CHART_DATA = [
  { time: '08:00', 'Vaccine Lot B2': 4.1, 'Insulin 88A': 7.2, thresholdMax: 8.0, thresholdMin: 2.0 },
  { time: '09:00', 'Vaccine Lot B2': 4.3, 'Insulin 88A': 7.6, thresholdMax: 8.0, thresholdMin: 2.0 },
  { time: '10:00', 'Vaccine Lot B2': 4.2, 'Insulin 88A': 8.1, thresholdMax: 8.0, thresholdMin: 2.0 },
  { time: '11:00', 'Vaccine Lot B2': 4.5, 'Insulin 88A': 9.2, thresholdMax: 8.0, thresholdMin: 2.0 },
  { time: '12:00', 'Vaccine Lot B2': 4.2, 'Insulin 88A': 9.1, thresholdMax: 8.0, thresholdMin: 2.0 },
  { time: '13:00', 'Vaccine Lot B2': 4.0, 'Insulin 88A': 8.8, thresholdMax: 8.0, thresholdMin: 2.0 },
];

const DashboardPreview: React.FC = () => {

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 md:p-6 shadow-2xl text-slate-100 max-w-7xl mx-auto">
      
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-4 mb-5 gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-bold text-primary-brand uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-brand animate-pulse" />
            Control Center Demo
          </span>
          <h2 className="text-base font-bold text-white tracking-tight">Active Shipment Console</h2>
        </div>
        <div className="flex gap-2">
          <span className="text-[10px] bg-slate-800 border border-slate-700 py-1 px-3 rounded font-semibold text-slate-400">
            System Live: ISO-27001
          </span>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Side: Telemetries & Charts */}
        <div className="col-span-1 lg:col-span-8 flex flex-col gap-5">
          {/* Map Preview Wrapper */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <FiMapPin className="text-primary-brand" /> Live Fleet Geo-Spatial View
            </span>
            <InteractiveMapPreview />
          </div>

          {/* Temperature Sensor Chart */}
          <div className="bg-slate-950/50 border border-slate-800/80 p-4 rounded-card">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <FiTrendingUp className="text-emerald-500" /> Sensor Temperature Log (°C)
              </span>
              <span className="text-[9px] text-slate-500 font-mono">Real-time update intervals</span>
            </div>
            
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOCK_CHART_DATA} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#475569" fontSize={9} className="font-mono" />
                  <YAxis stroke="#475569" fontSize={9} className="font-mono" domain={[-5, 12]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '6px', fontSize: '11px', color: '#f8fafc' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                  <Line type="monotone" dataKey="Vaccine Lot B2" stroke="#2563EB" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="Insulin 88A" stroke="#EF4444" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="linear" dataKey="thresholdMax" stroke="#94A3B8" strokeWidth={1} strokeDasharray="5 5" name="Max Safe Limit" dot={false} />
                  <Line type="linear" dataKey="thresholdMin" stroke="#94A3B8" strokeWidth={1} strokeDasharray="5 5" name="Min Safe Limit" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Side: Alert Feed & AI Optimizer */}
        <div className="col-span-1 lg:col-span-4 flex flex-col gap-5">
          
          {/* AI Optimizer Panel */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-card p-4 flex flex-col gap-3.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-[10px] text-primary-brand font-bold uppercase tracking-wider flex items-center gap-1.5">
                <FiCpu className="text-primary-brand animate-pulse" /> Gemini AI Recommendations
              </span>
              <span className="text-[9px] bg-slate-900 text-primary-brand font-bold px-1.5 py-0.5 rounded font-mono">Agent Active</span>
            </div>

            <div className="flex flex-col gap-2">
              <div className="p-3 bg-red-950/20 border border-red-900/30 rounded-md">
                <div className="flex items-center gap-1.5 text-[10px] text-red-400 font-bold mb-1">
                  <FiAlertTriangle /> HIGH RISK: INSULIN BATCH 88A
                </div>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  Gemini identifies cold-room door seal failure on Sprinter 08. Internal temp peaked at 9.2°C (limit 8°C).
                </p>
                <div className="mt-2.5 flex flex-col gap-1 text-[10px] text-slate-400">
                  <span className="font-semibold text-white">Suggested Mitigations:</span>
                  <span>1. Command reefer compressor manual override to high power.</span>
                  <span>2. Reroute via Hwy 14 Bypass to avoid traffic (saves 14m).</span>
                </div>
              </div>
            </div>
          </div>

          {/* Active Alerts Panel */}
          <div className="bg-slate-950/40 border border-slate-800 rounded-card p-4 flex flex-col gap-3">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <FiList className="text-slate-400" /> Current Alert Feed
            </span>

            <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
              <div className="p-2.5 bg-red-950/30 border border-red-900/35 rounded-md flex justify-between items-start gap-2">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold text-red-400 uppercase tracking-wide">Temp Breach</span>
                  <span className="text-[10px] text-slate-300">SH-2026-002: Reading 9.1°C</span>
                </div>
                <span className="text-[9px] bg-red-950 text-red-400 font-bold px-1.5 py-0.5 rounded">Critical</span>
              </div>

              <div className="p-2.5 bg-slate-900/60 border border-slate-800 rounded-md flex justify-between items-start gap-2">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wide">Battery Alert</span>
                  <span className="text-[10px] text-slate-300">SH-2026-001: Sensor low (12%)</span>
                </div>
                <span className="text-[9px] bg-amber-950/45 text-amber-400 font-bold px-1.5 py-0.5 rounded">Warning</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Row: Shipment Ledger Table */}
      <div className="mt-5 border-t border-slate-800 pt-5">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5 mb-3">
          <FiCompass className="text-blue-500" /> Active Shipment Ledger
        </span>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="pb-2.5 font-bold">Shipment ID</th>
                <th className="pb-2.5 font-bold">Cargo Detail</th>
                <th className="pb-2.5 font-bold">Type</th>
                <th className="pb-2.5 font-bold text-center">Temp Range</th>
                <th className="pb-2.5 font-bold text-center">Current Temp</th>
                <th className="pb-2.5 font-bold text-center">Risk Index</th>
                <th className="pb-2.5 font-bold text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-800/50 hover:bg-slate-800/30">
                <td className="py-3 font-mono font-bold text-slate-300">SH-2026-001</td>
                <td className="py-3 font-semibold text-white">BioMed Vaccine Lot B2</td>
                <td className="py-3 text-slate-400">Vaccine</td>
                <td className="py-3 text-center text-slate-400 font-mono">2.0°C / 8.0°C</td>
                <td className="py-3 text-center font-bold text-emerald-400 font-mono">4.2°C</td>
                <td className="py-3 text-center font-mono">8%</td>
                <td className="py-3 text-right">
                  <span className="bg-emerald-950/40 text-emerald-400 text-[10px] font-bold py-1 px-2.5 rounded border border-emerald-900/30">
                    Safe
                  </span>
                </td>
              </tr>
              <tr className="border-b border-slate-800/50 hover:bg-slate-800/30">
                <td className="py-3 font-mono font-bold text-slate-300">SH-2026-002</td>
                <td className="py-3 font-semibold text-white">Insulin Batch 88A</td>
                <td className="py-3 text-slate-400">Medicine</td>
                <td className="py-3 text-center text-slate-400 font-mono">2.0°C / 8.0°C</td>
                <td className="py-3 text-center font-bold text-red-400 font-mono">9.1°C</td>
                <td className="py-3 text-center font-mono">85%</td>
                <td className="py-3 text-right">
                  <span className="bg-red-950/40 text-red-400 text-[10px] font-bold py-1 px-2.5 rounded border border-red-900/30 animate-pulse">
                    Thermal Breach
                  </span>
                </td>
              </tr>
              <tr className="border-b border-slate-800/50 hover:bg-slate-800/30">
                <td className="py-3 font-mono font-bold text-slate-300">SH-2026-003</td>
                <td className="py-3 font-semibold text-white">Premium Atlantic Salmon</td>
                <td className="py-3 text-slate-400">Seafood</td>
                <td className="py-3 text-center text-slate-400 font-mono">-2.0°C / 2.0°C</td>
                <td className="py-3 text-center font-bold text-emerald-400 font-mono">-0.5°C</td>
                <td className="py-3 text-center font-mono">12%</td>
                <td className="py-3 text-right">
                  <span className="bg-emerald-950/40 text-emerald-400 text-[10px] font-bold py-1 px-2.5 rounded border border-emerald-900/30">
                    Safe
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default DashboardPreview;
