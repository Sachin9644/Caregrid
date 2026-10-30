import React, { useState } from 'react';
import { BarChart3, TrendingUp, Download, Share2, ShieldCheck, Activity } from 'lucide-react';
import { TrendPoint, Hospital, BloodStockItem, RegionZone } from '../types';
import { NativeService } from '../services/native';

interface MobileAnalyticsProps {
  occupancyTrends: TrendPoint[];
  hospitals: Hospital[];
  bloodStocks: BloodStockItem[];
  activeZone: RegionZone;
}

export const MobileAnalytics: React.FC<MobileAnalyticsProps> = ({
  occupancyTrends,
  hospitals,
  bloodStocks,
  activeZone,
}) => {
  const [selectedMetric, setSelectedMetric] = useState<'icu' | 'general' | 'inflow'>('icu');

  const handleExportTelemetry = async () => {
    NativeService.hapticTap();
    const csvContent = [
      'Hospital Name,Zone,Type,Total Beds,Available Beds,ICU Total,ICU Available,Ventilators Available,Oxygen Available',
      ...hospitals.map(
        (h) =>
          `"${h.name}","${h.zone}","${h.type}",${h.totalBeds},${h.availableBeds},${h.icuTotal},${h.icuAvailable},${h.ventilatorAvailable},${h.oxygenAvailable}`
      ),
    ].join('\n');

    await NativeService.shareContent({
      title: 'CareGrid Telemetry Export',
      text: `Hospital Bed & Blood Bank Telemetry Report (${activeZone} Zone):\n\n${csvContent.slice(0, 500)}...\n\n(Total ${hospitals.length} hospitals included)`,
      dialogTitle: 'Export Telemetry Data',
    });
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Top Banner */}
      <div className="rounded-2xl bg-white dark:bg-[#111728] border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-500 mb-0.5">
            <Activity className="w-4 h-4" />
            <span>PREDICTIVE HEALTHCARE TELEMETRY</span>
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Resource Analytics & Trajectory
          </h2>
          <p className="text-xs text-slate-400">Demand velocity, bed occupancy curves, and blood supply ratios</p>
        </div>

        <button
          onClick={handleExportTelemetry}
          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors flex-shrink-0"
        >
          <Share2 className="w-3.5 h-3.5 text-rose-500" />
          <span className="hidden sm:inline">Export Report</span>
        </button>
      </div>

      {/* Metric Selector Tabs */}
      <div className="flex items-center gap-2">
        {[
          { id: 'icu', label: 'ICU Occupancy %' },
          { id: 'general', label: 'General Ward %' },
          { id: 'inflow', label: 'Emergency Inflow' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              NativeService.hapticTap();
              setSelectedMetric(tab.id as any);
            }}
            className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all ${
              selectedMetric === tab.id
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'bg-white dark:bg-[#111728] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Trajectory Chart */}
      <div className="rounded-2xl bg-white dark:bg-[#111728] border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-rose-500" />
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
              {selectedMetric === 'icu'
                ? 'ICU Bed Pressure Trajectory'
                : selectedMetric === 'general'
                ? 'General Ward Occupancy Trajectory'
                : 'Emergency Inflow Velocity (Patients / Hour)'}
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">24H Window</span>
        </div>

        {/* Responsive Visualization Bar/Chart */}
        <div className="h-44 w-full flex items-end justify-between gap-2 px-2 pt-6 pb-2">
          {occupancyTrends.map((pt, i) => {
            const val =
              selectedMetric === 'icu'
                ? pt.icuOccupancyPct
                : selectedMetric === 'general'
                ? pt.generalBedOccupancyPct
                : (pt.emergencyInflow / 40) * 100;

            const displayLabel =
              selectedMetric === 'inflow' ? `${pt.emergencyInflow}/h` : `${val}%`;

            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <span className="text-[10px] font-mono text-slate-500 group-hover:text-rose-500 font-bold transition-colors">
                  {displayLabel}
                </span>
                <div className="w-full max-w-[28px] bg-slate-100 dark:bg-slate-800/80 rounded-t-lg h-32 flex items-end overflow-hidden">
                  <div
                    className={`w-full rounded-t-lg transition-all duration-500 ${
                      selectedMetric === 'icu'
                        ? 'bg-gradient-to-t from-rose-600 to-red-400'
                        : selectedMetric === 'general'
                        ? 'bg-gradient-to-t from-indigo-600 to-blue-400'
                        : 'bg-gradient-to-t from-amber-600 to-yellow-400'
                    }`}
                    style={{ height: `${val}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-slate-400">{pt.timeLabel}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Regional Zone Capacity Comparison */}
      <div className="rounded-2xl bg-white dark:bg-[#111728] border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide mb-3">
          District-wise Bed Utilization Breakdown
        </h3>

        <div className="space-y-3">
          {['Central', 'South', 'North', 'West'].map((zoneName) => {
            const zoneHosps = hospitals.filter((h) => h.zone === zoneName);
            const total = zoneHosps.reduce((acc, h) => acc + h.totalBeds, 0);
            const free = zoneHosps.reduce((acc, h) => acc + h.availableBeds, 0);
            const occupied = total - free;
            const pct = total > 0 ? Math.round((occupied / total) * 100) : 0;

            return (
              <div key={zoneName} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {zoneName} Zone ({zoneHosps.length} Hospitals)
                  </span>
                  <span className="font-mono text-slate-500 text-[11px]">
                    {free} Free / {total} Total ({pct}% Full)
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      pct > 85 ? 'bg-rose-500' : pct > 70 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
