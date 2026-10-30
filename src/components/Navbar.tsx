import React from 'react';
import { Activity, PhoneCall, Sun, Moon, MapPin, RefreshCw } from 'lucide-react';
import { RegionZone } from '../types';
import { NativeService } from '../services/native';

interface NavbarProps {
  activeZone: RegionZone;
  setActiveZone: (zone: RegionZone) => void;
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
  onQuickSOS: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const ZONES: { id: RegionZone; label: string }[] = [
  { id: 'All', label: 'All Districts' },
  { id: 'Central', label: 'Central Metro' },
  { id: 'North', label: 'North Zone' },
  { id: 'South', label: 'South Zone' },
  { id: 'West', label: 'West Zone' },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeZone,
  setActiveZone,
  isDark,
  setIsDark,
  onQuickSOS,
  onRefresh,
  isRefreshing,
}) => {
  const toggleTheme = () => {
    NativeService.hapticTap();
    setIsDark(!isDark);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#0b101d]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 transition-colors">
      {/* Top Banner Row */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-3 max-w-7xl mx-auto">
        {/* Brand Identity */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-600 to-red-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20 flex-shrink-0">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div className="truncate">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white">
                CareGrid <span className="text-rose-500 text-xs px-1.5 py-0.5 rounded bg-rose-500/10 font-mono font-medium">MOBILE</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
              <span>Live Hospital Grid Online</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Refresh Button */}
          <button
            onClick={() => {
              NativeService.hapticTap();
              onRefresh();
            }}
            disabled={isRefreshing}
            aria-label="Refresh telemetry"
            className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-rose-500' : ''}`} />
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {/* Emergency SOS Pill Button */}
          <button
            onClick={() => {
              NativeService.hapticWarning();
              onQuickSOS();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-rose-600/30 transition-all"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">EMERGENCY</span> <span>108</span>
          </button>
        </div>
      </div>

      {/* Scope Ribbon - Regional Zone Selector */}
      <div className="px-4 py-2 bg-slate-50/80 dark:bg-[#070b14]/80 border-t border-slate-200/70 dark:border-slate-800/60 overflow-x-auto no-scrollbar flex items-center gap-1.5">
        <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 mr-1 flex-shrink-0">
          <MapPin className="w-3 h-3 text-rose-500" />
          <span>SCOPE:</span>
        </div>
        {ZONES.map((zone) => {
          const isActive = activeZone === zone.id;
          return (
            <button
              key={zone.id}
              onClick={() => {
                NativeService.hapticTap();
                setActiveZone(zone.id);
              }}
              className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {zone.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
