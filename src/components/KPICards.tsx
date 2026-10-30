import React from 'react';
import { BedDouble, HeartPulse, Wind, Droplets, Building2, Clock } from 'lucide-react';
import { SummaryKPIs } from '../types';

interface KPICardsProps {
  kpis: SummaryKPIs;
  onSelectMetric?: (metric: string) => void;
}

export const KPICards: React.FC<KPICardsProps> = ({ kpis, onSelectMetric }) => {
  const cards = [
    {
      id: 'beds',
      title: 'AVAILABLE BEDS',
      value: kpis.totalAvailableBeds,
      subtext: 'Across all wards',
      icon: BedDouble,
      iconColor: 'text-emerald-500',
      bgGlow: 'from-emerald-500/10 to-teal-500/5',
      badgeText: 'Verified Live',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    },
    {
      id: 'icu',
      title: 'CRITICAL ICU BEDS',
      value: kpis.totalIcuAvailable,
      subtext: 'Equipped with monitors',
      icon: HeartPulse,
      iconColor: 'text-rose-500',
      bgGlow: 'from-rose-500/10 to-red-500/5',
      badgeText: 'High Demand',
      badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    },
    {
      id: 'ventilator',
      title: 'VENTILATORS READY',
      value: kpis.ventilatorAvailable,
      subtext: 'Invasive / Non-invasive',
      icon: Wind,
      iconColor: 'text-cyan-500',
      bgGlow: 'from-cyan-500/10 to-blue-500/5',
      badgeText: 'Critical Support',
      badgeColor: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
    },
    {
      id: 'blood',
      title: 'BLOOD UNITS READY',
      value: kpis.totalBloodUnits,
      subtext: 'Across regional banks',
      icon: Droplets,
      iconColor: 'text-amber-500',
      bgGlow: 'from-amber-500/10 to-orange-500/5',
      badgeText: `${kpis.activeEmergencyRequests} Urgent Needs`,
      badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    },
    {
      id: 'hospitals',
      title: 'NETWORK HOSPITALS',
      value: kpis.networkHospitals,
      subtext: 'Govt & Private centres',
      icon: Building2,
      iconColor: 'text-indigo-500',
      bgGlow: 'from-indigo-500/10 to-purple-500/5',
      badgeText: '100% Online',
      badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    },
    {
      id: 'ambulance',
      title: 'AVG AMBULANCE ETA',
      value: `${kpis.avgAmbulanceEtaMinutes} mins`,
      subtext: 'Nearest ALS / BLS units',
      icon: Clock,
      iconColor: 'text-purple-500',
      bgGlow: 'from-purple-500/10 to-pink-500/5',
      badgeText: 'Fleet Active',
      badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            onClick={() => onSelectMetric && onSelectMetric(card.id)}
            className="cursor-pointer group relative overflow-hidden rounded-xl bg-white dark:bg-[#111728] border border-slate-200/90 dark:border-slate-800/80 p-3 sm:p-4 shadow-sm hover:shadow-md transition-all hover:border-slate-300 dark:hover:border-slate-700 active:scale-[0.99]"
          >
            {/* Ambient Background Gradient */}
            <div
              className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${card.bgGlow} rounded-full blur-xl -mr-6 -mt-6 pointer-events-none`}
            />

            <div className="flex items-start justify-between gap-1 mb-2">
              <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                {card.title}
              </span>
              <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${card.iconColor} flex-shrink-0`} />
            </div>

            <div className="flex items-baseline gap-1.5 my-1">
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {card.value}
              </span>
            </div>

            <div className="flex items-center justify-between gap-1 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              <span className="truncate">{card.subtext}</span>
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold whitespace-nowrap ${card.badgeColor}`}>
                {card.badgeText}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
