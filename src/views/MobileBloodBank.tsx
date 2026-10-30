import React, { useState } from 'react';
import { Droplet, PlusCircle, Share2, Phone, AlertCircle, Building2, ShieldCheck, Heart } from 'lucide-react';
import { BloodStockItem, HospitalBloodRecord, UrgentBloodAlert, RegionZone, BloodGroup } from '../types';
import { NativeService } from '../services/native';

interface MobileBloodBankProps {
  bloodStocks: BloodStockItem[];
  hospitalBloodRecords: HospitalBloodRecord[];
  urgentAlerts: UrgentBloodAlert[];
  onOpenBloodModal: () => void;
  activeZone: RegionZone;
}

export const MobileBloodBank: React.FC<MobileBloodBankProps> = ({
  bloodStocks,
  hospitalBloodRecords,
  urgentAlerts,
  onOpenBloodModal,
  activeZone,
}) => {
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup | 'ALL'>('ALL');

  const filteredHospitalRecords = selectedGroup === 'ALL'
    ? hospitalBloodRecords
    : hospitalBloodRecords.filter((h) => (h.stocks[selectedGroup] || 0) > 0);

  const handleShareAppeal = async (alert: UrgentBloodAlert) => {
    NativeService.hapticTap();
    await NativeService.shareContent({
      title: `🚨 EMERGENCY BLOOD APPEAL: ${alert.bloodGroup} needed urgently`,
      text: `Urgent Blood Need via CareGrid Mobile Network:\nPatient: ${alert.patientName}\nRequired Group: ${alert.bloodGroup} (${alert.unitsNeeded} Units)\nHospital: ${alert.hospitalName}\nUrgency: ${alert.urgency}\nContact Person: ${alert.contactPerson} (${alert.contactPhone})\nPlease donate or forward this alert to donor groups!`,
      dialogTitle: 'Share Blood Appeal',
    });
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Top Banner / Raise Appeal */}
      <div className="rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 p-4 text-white shadow-md shadow-red-600/20 flex items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1 text-[11px] font-bold bg-white/20 px-2 py-0.5 rounded-full mb-1">
            <Heart className="w-3 h-3 fill-white" />
            <span>COMMUNITY BLOOD NETWORK</span>
          </div>
          <h2 className="text-base font-bold">Regional Blood Stock Telemetry</h2>
          <p className="text-xs text-rose-100">Verified live inventory across regional licensed blood banks</p>
        </div>
        <button
          onClick={() => {
            NativeService.hapticTap();
            onOpenBloodModal();
          }}
          className="px-3.5 py-2 rounded-xl bg-white text-rose-600 hover:bg-rose-50 text-xs font-black shadow-md flex items-center gap-1.5 active:scale-95 transition-all flex-shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Raise Appeal</span>
        </button>
      </div>

      {/* Blood Group Matrix Cards */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Inventory by Blood Group
          </h3>
          <span className="text-[11px] text-slate-400">Tap to filter hospitals</span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {bloodStocks.map((item) => {
            const isSelected = selectedGroup === item.bloodGroup;
            return (
              <div
                key={item.bloodGroup}
                onClick={() => {
                  NativeService.hapticTap();
                  setSelectedGroup(isSelected ? 'ALL' : item.bloodGroup);
                }}
                className={`cursor-pointer p-3 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'border-rose-500 bg-rose-500/10 ring-2 ring-rose-500 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111728] hover:border-rose-500/40'
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  <Droplet className={`w-3.5 h-3.5 ${item.rhFactor === 'Negative' ? 'fill-rose-500 text-rose-500' : 'text-rose-500'}`} />
                  <span className="text-xs font-black font-mono text-slate-900 dark:text-white">
                    {item.bloodGroup}
                  </span>
                </div>
                <div className="text-lg font-black text-slate-900 dark:text-white my-0.5">
                  {item.unitsAvailable}
                </div>
                <span
                  className={`inline-block text-[9px] px-1.5 py-0.2 rounded font-bold ${
                    item.status === 'Critical'
                      ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                      : item.status === 'Low'
                      ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                      : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {item.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Urgent Blood Appeals Feed */}
      <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 dark:bg-rose-950/20 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-xs font-black text-rose-600 dark:text-rose-400">
            <AlertCircle className="w-4 h-4 text-rose-500" />
            <span>URGENT DONOR APPEALS ({urgentAlerts.length})</span>
          </div>
          <button
            onClick={onOpenBloodModal}
            className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline"
          >
            + Post Emergency Need
          </button>
        </div>

        <div className="space-y-2.5">
          {urgentAlerts.map((alert) => (
            <div
              key={alert.id}
              className="p-3.5 rounded-xl bg-white dark:bg-[#111728] border border-slate-200/90 dark:border-slate-800 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-xs font-black bg-rose-600 text-white font-mono shadow-sm">
                      {alert.bloodGroup}
                    </span>
                    <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                      {alert.urgency}
                    </span>
                    <span className="text-[10px] text-slate-400">{alert.postedAgo}</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {alert.patientName}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {alert.hospitalName} • Units Needed: <strong>{alert.unitsNeeded} Units</strong>
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Attendant: {alert.contactPerson}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800">
                <a
                  href={`tel:${alert.contactPhone}`}
                  onClick={() => NativeService.hapticTap()}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Attendant</span>
                </a>

                <button
                  onClick={() => handleShareAppeal(alert)}
                  className="py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Broadcast</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hospital Blood Banks List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Hospital Blood Bank Inventories {selectedGroup !== 'ALL' && `(Filtered by ${selectedGroup})`}
          </h3>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified
          </span>
        </div>

        <div className="space-y-2.5">
          {filteredHospitalRecords.map((rec) => (
            <div
              key={rec.hospitalId}
              className="p-3.5 rounded-xl bg-white dark:bg-[#111728] border border-slate-200/90 dark:border-slate-800 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-rose-500 flex-shrink-0" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {rec.hospitalName}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono flex-shrink-0">
                  {rec.lastUpdated}
                </span>
              </div>

              {/* Units Breakdown */}
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 my-2">
                {(Object.keys(rec.stocks) as BloodGroup[]).map((grp) => {
                  const qty = rec.stocks[grp];
                  const isHighlighted = selectedGroup === grp;
                  return (
                    <div
                      key={grp}
                      className={`p-1.5 rounded-lg text-center border text-[11px] ${
                        isHighlighted
                          ? 'border-rose-500 bg-rose-500/10 font-bold'
                          : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="font-mono text-[10px] text-slate-400">{grp}</div>
                      <div className={`font-black ${qty > 0 ? 'text-slate-900 dark:text-white' : 'text-slate-300 dark:text-slate-600'}`}>
                        {qty}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px]">
                <span className="text-slate-400 font-mono">{rec.zone} Zone</span>
                <a
                  href={`tel:${rec.phone}`}
                  className="font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" /> Call Blood Bank: {rec.phone}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
