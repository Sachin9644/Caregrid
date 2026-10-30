import React from 'react';
import { Siren, PhoneCall, HeartPulse, ChevronRight, Share2, MapPin, Sparkles } from 'lucide-react';
import { Hospital, SummaryKPIs, BloodStockItem, UrgentBloodAlert, TrendPoint } from '../types';
import { KPICards } from '../components/KPICards';
import { NativeService } from '../services/native';

interface MobileOverviewProps {
  kpis: SummaryKPIs;
  hospitals: Hospital[];
  bloodStocks: BloodStockItem[];
  urgentAlerts: UrgentBloodAlert[];
  occupancyTrends: TrendPoint[];
  onSelectHospital: (hospital: Hospital) => void;
  onNavigateTab: (tab: string) => void;
  onOpenBloodModal: () => void;
}

export const MobileOverview: React.FC<MobileOverviewProps> = ({
  kpis,
  hospitals,
  bloodStocks,
  urgentAlerts,
  occupancyTrends,
  onSelectHospital,
  onNavigateTab,
  onOpenBloodModal,
}) => {
  const topAvailableHospitals = [...hospitals]
    .sort((a, b) => b.icuAvailable - a.icuAvailable)
    .slice(0, 3);

  const handleShareAlert = async (alert: UrgentBloodAlert) => {
    NativeService.hapticTap();
    await NativeService.shareContent({
      title: `🚨 Urgent Blood Alert: ${alert.bloodGroup} needed at ${alert.hospitalName}`,
      text: `Patient: ${alert.patientName}\nRequired Group: ${alert.bloodGroup} (${alert.unitsNeeded} Units)\nHospital: ${alert.hospitalName}\nUrgency: ${alert.urgency}\nContact: ${alert.contactPerson} (${alert.contactPhone})`,
    });
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Emergency Immediate Action Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 p-4 sm:p-5 text-white shadow-lg shadow-rose-600/25">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/20 text-[11px] font-bold tracking-wide backdrop-blur-md">
              <Siren className="w-3.5 h-3.5 animate-bounce" />
              <span>24/7 CRITICAL RESPONSE READY</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black tracking-tight leading-tight">
              Emergency Bed & Blood Telemetry
            </h2>
            <p className="text-xs text-rose-100 max-w-md">
              Real-time synchronization across government and super-specialty hospitals for instant triage.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="tel:108"
              onClick={() => NativeService.hapticWarning()}
              className="px-4 py-2 rounded-xl bg-white text-rose-700 font-extrabold text-xs shadow-md hover:bg-rose-50 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <PhoneCall className="w-4 h-4 fill-rose-600" />
              <span>Dial 108</span>
            </a>
            <button
              onClick={() => {
                NativeService.hapticTap();
                onNavigateTab('sos');
              }}
              className="px-3.5 py-2 rounded-xl bg-rose-800/80 hover:bg-rose-900 text-white font-bold text-xs border border-white/20 active:scale-95 transition-all"
            >
              Track Ambulances
            </button>
          </div>
        </div>
      </div>

      {/* 6 Critical Telemetry Metric Cards */}
      <KPICards kpis={kpis} onSelectMetric={(m) => {
        if (m === 'beds' || m === 'icu' || m === 'ventilator') onNavigateTab('beds');
        else if (m === 'blood') onNavigateTab('blood');
        else if (m === 'ambulance') onNavigateTab('sos');
        else if (m === 'hospitals') onNavigateTab('beds');
      }} />

      {/* Urgent Blood Requests Ticker */}
      {urgentAlerts.length > 0 && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 dark:bg-rose-950/20 p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>URGENT BLOOD NEEDS ({urgentAlerts.length})</span>
            </div>
            <button
              onClick={() => {
                NativeService.hapticTap();
                onOpenBloodModal();
              }}
              className="text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-0.5"
            >
              + Post Appeal
            </button>
          </div>

          <div className="space-y-2">
            {urgentAlerts.slice(0, 2).map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-white dark:bg-[#131a2e] border border-slate-200/80 dark:border-slate-800"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded text-[11px] font-black bg-rose-500 text-white font-mono">
                      {alert.bloodGroup}
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                      {alert.patientName}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                    {alert.hospitalName} • Need: {alert.unitsNeeded} Units • <span className="text-amber-500 font-semibold">{alert.urgency}</span>
                  </p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <a
                    href={`tel:${alert.contactPhone}`}
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700 active:scale-95"
                  >
                    Call
                  </a>
                  <button
                    onClick={() => handleShareAlert(alert)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white border border-slate-200 dark:border-slate-700"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hourly ICU Capacity Spline Chart (Custom Responsive SVG) */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#111728] p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Citywide ICU Bed Occupancy Trend
            </h3>
            <p className="text-[11px] text-slate-400">Hourly utilization telemetry (Last 24 Hours)</p>
          </div>
          <span className="text-xs font-mono font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded">
            83% Avg Load
          </span>
        </div>

        {/* SVG Spline Visualization */}
        <div className="h-36 w-full flex items-end pt-4 pb-2">
          <div className="w-full h-full flex items-end justify-between gap-1 sm:gap-2 px-1">
            {occupancyTrends.map((point, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-900 text-white text-[9px] px-1.5 py-0.5 rounded pointer-events-none whitespace-nowrap z-20">
                  ICU: {point.icuOccupancyPct}%
                </div>
                {/* Visual Bar / Spline Peak */}
                <div className="w-full max-w-[24px] bg-slate-100 dark:bg-slate-800 rounded-t-md h-24 flex items-end overflow-hidden">
                  <div
                    className="w-full bg-gradient-to-t from-rose-600 to-red-400 rounded-t-md transition-all duration-500"
                    style={{ height: `${point.icuOccupancyPct}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-slate-400">{point.timeLabel}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Regional Blood Stock Pills */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#111728] p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Blood Bank Stock Status
            </h3>
            <p className="text-[11px] text-slate-400">Total units available across blood banks</p>
          </div>
          <button
            onClick={() => onNavigateTab('blood')}
            className="text-xs font-bold text-rose-500 hover:underline flex items-center gap-0.5"
          >
            View Matrix <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {bloodStocks.map((item) => (
            <div
              key={item.bloodGroup}
              onClick={() => onNavigateTab('blood')}
              className="cursor-pointer p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center hover:border-rose-500/50 transition-all"
            >
              <span className="text-xs font-black font-mono text-rose-600 dark:text-rose-400">
                {item.bloodGroup}
              </span>
              <div className="text-base font-extrabold text-slate-900 dark:text-white my-0.5">
                {item.unitsAvailable}
              </div>
              <span
                className={`inline-block text-[9px] px-1 py-0.2 rounded font-semibold ${
                  item.status === 'Critical'
                    ? 'bg-red-500/20 text-red-600 dark:text-red-400'
                    : item.status === 'Low'
                    ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                    : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Hospitals with Verified ICU Beds */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#111728] p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Verified Hospitals with ICU Availability
            </h3>
            <p className="text-[11px] text-slate-400">Real-time bed counts ready for emergency triage</p>
          </div>
          <button
            onClick={() => onNavigateTab('beds')}
            className="text-xs font-bold text-rose-500 hover:underline flex items-center gap-0.5"
          >
            All Hospitals <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {topAvailableHospitals.map((hosp) => (
            <div
              key={hosp.id}
              onClick={() => onSelectHospital(hosp)}
              className="cursor-pointer p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 hover:border-rose-500/50 transition-all flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {hosp.name}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {hosp.zone}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  <span className="flex items-center gap-0.5">
                    <MapPin className="w-3 h-3 text-rose-500" /> {hosp.distanceKm} km
                  </span>
                  <span>•</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    {hosp.availableBeds} Total Free
                  </span>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <div className="text-sm font-black text-rose-600 dark:text-rose-400">
                  {hosp.icuAvailable} <span className="text-[10px] font-medium text-slate-400">ICU</span>
                </div>
                <div className="text-[10px] text-cyan-600 dark:text-cyan-400 font-medium">
                  {hosp.ventilatorAvailable} Vent
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
