import React from 'react';
import { Activity, BedDouble, Droplet, Siren, BarChart3 } from 'lucide-react';
import { NativeService } from '../services/native';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  urgentAlertsCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  urgentAlertsCount,
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Overview', icon: Activity },
    { id: 'beds', label: 'Beds', icon: BedDouble },
    { id: 'blood', label: 'Blood Bank', icon: Droplet, badge: urgentAlertsCount > 0 ? urgentAlertsCount : undefined },
    { id: 'sos', label: 'SOS / Fleet', icon: Siren, isEmergency: true },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0c101d]/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800/80 px-2 py-1 safe-area-pb">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                NativeService.hapticTap();
                setActiveTab(tab.id);
              }}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-150 ${
                tab.isEmergency
                  ? isActive
                    ? 'text-rose-500 font-bold scale-105'
                    : 'text-rose-600 dark:text-rose-400 font-semibold'
                  : isActive
                  ? 'text-rose-500 dark:text-rose-400 font-semibold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${tab.isEmergency && !isActive ? 'animate-bounce' : ''}`} />
                {tab.badge && (
                  <span className="absolute -top-1 -right-2 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight leading-none">{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 w-6 h-0.5 bg-rose-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
