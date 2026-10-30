import React, { useState, useMemo } from 'react';
import { Search, Filter, Phone, MapPin, HeartPulse, Wind, ShieldCheck, ChevronRight } from 'lucide-react';
import { Hospital, BedTypeFilter, RegionZone } from '../types';
import { NativeService } from '../services/native';

interface MobileHospitalBedsProps {
  hospitals: Hospital[];
  onSelectHospital: (hospital: Hospital) => void;
  activeZone: RegionZone;
}

export const MobileHospitalBeds: React.FC<MobileHospitalBedsProps> = ({
  hospitals,
  onSelectHospital,
  activeZone,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [bedTypeFilter, setBedTypeFilter] = useState<BedTypeFilter>('all');
  const [facilityType, setFacilityType] = useState<string>('all');

  const filteredHospitals = useMemo(() => {
    return hospitals.filter((hosp) => {
      // Zone filter
      if (activeZone !== 'All' && hosp.zone !== activeZone) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = hosp.name.toLowerCase().includes(q);
        const matchesAddress = hosp.address.toLowerCase().includes(q);
        if (!matchesName && !matchesAddress) return false;
      }

      // Facility Type
      if (facilityType !== 'all') {
        if (facilityType === 'gov' && hosp.type !== 'Government') return false;
        if (facilityType === 'private' && hosp.type !== 'Private Super-Specialty') return false;
        if (facilityType === 'trust' && hosp.type !== 'Trust Hospital') return false;
      }

      // Bed Type filter
      if (bedTypeFilter === 'icu' && hosp.icuAvailable === 0) return false;
      if (bedTypeFilter === 'ventilator' && hosp.ventilatorAvailable === 0) return false;
      if (bedTypeFilter === 'oxygen' && hosp.oxygenAvailable === 0) return false;

      return true;
    });
  }, [hospitals, activeZone, searchQuery, bedTypeFilter, facilityType]);

  return (
    <div className="space-y-3.5 pb-20">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by hospital name or locality..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111728] text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-sm"
        />
      </div>

      {/* Filter Tabs */}
      <div className="space-y-2">
        {/* Bed Type Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'all', label: 'All Beds' },
            { id: 'icu', label: 'ICU Free Only' },
            { id: 'ventilator', label: 'Ventilator Free' },
            { id: 'oxygen', label: 'Oxygen Wards' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                NativeService.hapticTap();
                setBedTypeFilter(item.id as BedTypeFilter);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                bedTypeFilter === item.id
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-white dark:bg-[#111728] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Facility Classification */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
          <span className="text-slate-400 flex items-center gap-1 font-semibold">
            <Filter className="w-3 h-3" /> TYPE:
          </span>
          {[
            { id: 'all', label: 'All Hospitals' },
            { id: 'gov', label: 'Government' },
            { id: 'private', label: 'Private Super-Specialty' },
            { id: 'trust', label: 'Trust Hospitals' },
          ].map((fac) => (
            <button
              key={fac.id}
              onClick={() => {
                NativeService.hapticTap();
                setFacilityType(fac.id);
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                facilityType === fac.id
                  ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {fac.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hospital List Header & Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1 pt-1">
        <span>Showing {filteredHospitals.length} Verified Hospitals</span>
        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" /> 100% Verified Telemetry
        </span>
      </div>

      {/* Hospital Cards */}
      <div className="space-y-3">
        {filteredHospitals.map((hosp) => (
          <div
            key={hosp.id}
            className="rounded-2xl bg-white dark:bg-[#111728] border border-slate-200/90 dark:border-slate-800/80 p-4 shadow-sm hover:shadow-md transition-all hover:border-rose-500/40"
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {hosp.type}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {hosp.zone} Zone • {hosp.distanceKm} km
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  {hosp.name}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{hosp.address}</span>
                </p>
              </div>

              {/* Status pill */}
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex-shrink-0">
                {hosp.verifiedAt}
              </span>
            </div>

            {/* Bed Matrix Grid */}
            <div className="grid grid-cols-4 gap-2 my-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 text-center">
              <div>
                <span className="text-[10px] font-bold text-rose-500 flex items-center justify-center gap-0.5">
                  <HeartPulse className="w-3 h-3" /> ICU
                </span>
                <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                  {hosp.icuAvailable} <span className="text-[9px] font-normal text-slate-400">/{hosp.icuTotal}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-cyan-500 flex items-center justify-center gap-0.5">
                  <Wind className="w-3 h-3" /> Vent
                </span>
                <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                  {hosp.ventilatorAvailable} <span className="text-[9px] font-normal text-slate-400">/{hosp.ventilatorTotal}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-emerald-500">Oxygen</span>
                <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                  {hosp.oxygenAvailable}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-indigo-500">Total Free</span>
                <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                  {hosp.availableBeds}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href={`tel:${hosp.emergencyDeskPhone}`}
                onClick={() => NativeService.hapticTap()}
                className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-rose-500" />
                <span>Call Desk</span>
              </a>

              <button
                onClick={() => {
                  NativeService.hapticTap();
                  onSelectHospital(hosp);
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm shadow-rose-600/20 flex items-center justify-center gap-1.5 transition-all active:scale-98"
              >
                <span>Inspect & Reserve Bed</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {filteredHospitals.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-xs">
            No hospitals match your filter criteria in this zone. Try switching to "All Districts" or clearing filters.
          </div>
        )}
      </div>
    </div>
  );
};
