import React, { useState } from 'react';
import { X, Phone, Navigation, Share2, ShieldCheck, HeartPulse, Wind, CheckCircle2 } from 'lucide-react';
import { Hospital } from '../types';
import { NativeService } from '../services/native';

interface BedDetailModalProps {
  hospital: Hospital | null;
  onClose: () => void;
  onReserveBed: (hospitalId: string, bedType: 'icu' | 'ventilator' | 'oxygen' | 'general') => Promise<boolean>;
}

export const BedDetailModal: React.FC<BedDetailModalProps> = ({
  hospital,
  onClose,
  onReserveBed,
}) => {
  const [selectedBedType, setSelectedBedType] = useState<'icu' | 'ventilator' | 'oxygen' | 'general'>('icu');
  const [reserving, setReserving] = useState(false);
  const [reservedSuccess, setReservedSuccess] = useState(false);

  if (!hospital) return null;

  const handleShare = async () => {
    NativeService.hapticTap();
    await NativeService.shareContent({
      title: `${hospital.name} — Bed Availability Telemetry`,
      text: `Urgent Care Telemetry:\n${hospital.name} (${hospital.zone} Zone)\nICU Beds: ${hospital.icuAvailable}/${hospital.icuTotal} Free\nVentilators: ${hospital.ventilatorAvailable}/${hospital.ventilatorTotal} Free\nEmergency Phone: ${hospital.emergencyDeskPhone}\nAddress: ${hospital.address}`,
      dialogTitle: 'Share Hospital Telemetry',
    });
  };

  const handleReserve = async () => {
    setReserving(true);
    NativeService.hapticTap();
    const success = await onReserveBed(hospital.id, selectedBedType);
    setReserving(false);
    if (success) {
      NativeService.hapticSuccess();
      setReservedSuccess(true);
      setTimeout(() => {
        setReservedSuccess(false);
        onClose();
      }, 1800);
    } else {
      NativeService.hapticError();
      alert('Selected bed type is currently at 100% full capacity.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-white dark:bg-[#111728] rounded-t-2xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400">
                {hospital.type}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {hospital.zone} Zone • {hospital.distanceKm} km away
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
              {hospital.name}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{hospital.address}</p>
          </div>
          <button
            onClick={() => {
              NativeService.hapticTap();
              onClose();
            }}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Real-time Bed Status Matrix */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Live Bed Availability Status
            </h3>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {/* ICU Beds */}
              <div
                onClick={() => setSelectedBedType('icu')}
                className={`cursor-pointer p-3 rounded-xl border transition-all ${
                  selectedBedType === 'icu'
                    ? 'border-rose-500 bg-rose-500/5 ring-1 ring-rose-500'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-rose-500 font-semibold mb-1">
                  <span className="flex items-center gap-1">
                    <HeartPulse className="w-3.5 h-3.5" /> ICU Beds
                  </span>
                  <span className="text-[10px] font-mono">{hospital.icuAvailable}/{hospital.icuTotal} Free</span>
                </div>
                <div className="text-xl font-black text-slate-900 dark:text-white">
                  {hospital.icuAvailable} <span className="text-xs font-normal text-slate-400">Available</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full"
                    style={{ width: `${(hospital.icuAvailable / hospital.icuTotal) * 100}%` }}
                  />
                </div>
              </div>

              {/* Ventilator Beds */}
              <div
                onClick={() => setSelectedBedType('ventilator')}
                className={`cursor-pointer p-3 rounded-xl border transition-all ${
                  selectedBedType === 'ventilator'
                    ? 'border-cyan-500 bg-cyan-500/5 ring-1 ring-cyan-500'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-cyan-500 font-semibold mb-1">
                  <span className="flex items-center gap-1">
                    <Wind className="w-3.5 h-3.5" /> Ventilators
                  </span>
                  <span className="text-[10px] font-mono">{hospital.ventilatorAvailable}/{hospital.ventilatorTotal} Free</span>
                </div>
                <div className="text-xl font-black text-slate-900 dark:text-white">
                  {hospital.ventilatorAvailable} <span className="text-xs font-normal text-slate-400">Available</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-cyan-500 h-full rounded-full"
                    style={{ width: `${(hospital.ventilatorAvailable / hospital.ventilatorTotal) * 100}%` }}
                  />
                </div>
              </div>

              {/* Oxygen Beds */}
              <div
                onClick={() => setSelectedBedType('oxygen')}
                className={`cursor-pointer p-3 rounded-xl border transition-all ${
                  selectedBedType === 'oxygen'
                    ? 'border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-emerald-500 font-semibold mb-1">
                  <span>Oxygen Wards</span>
                  <span className="text-[10px] font-mono">Live</span>
                </div>
                <div className="text-xl font-black text-slate-900 dark:text-white">
                  {hospital.oxygenAvailable} <span className="text-xs font-normal text-slate-400">Available</span>
                </div>
              </div>

              {/* Total General Beds */}
              <div
                onClick={() => setSelectedBedType('general')}
                className={`cursor-pointer p-3 rounded-xl border transition-all ${
                  selectedBedType === 'general'
                    ? 'border-indigo-500 bg-indigo-500/5 ring-1 ring-indigo-500'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-indigo-500 font-semibold mb-1">
                  <span>General Beds</span>
                  <span className="text-[10px] font-mono">{hospital.availableBeds}/{hospital.totalBeds}</span>
                </div>
                <div className="text-xl font-black text-slate-900 dark:text-white">
                  {hospital.availableBeds} <span className="text-xs font-normal text-slate-400">Available</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Contact & Verified Info */}
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 border border-slate-200/80 dark:border-slate-800 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Emergency Desk Direct:</span>
              <a
                href={`tel:${hospital.emergencyDeskPhone}`}
                className="font-mono font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1 hover:underline"
              >
                <Phone className="w-3 h-3" /> {hospital.emergencyDeskPhone}
              </a>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Verified Timestamp:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> {hospital.verifiedAt}
              </span>
            </div>
          </div>

          {/* Reservation Success Banner */}
          {reservedSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-semibold animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>Emergency {selectedBedType.toUpperCase()} Bed Reserved! Patient token generated.</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-[#0c111e] border-t border-slate-200 dark:border-slate-800/80 flex items-center gap-2">
          {/* Call button */}
          <a
            href={`tel:${hospital.emergencyDeskPhone}`}
            onClick={() => NativeService.hapticTap()}
            className="flex-1 py-2.5 px-3 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-rose-500" />
            <span>Call Desk</span>
          </a>

          {/* Share button */}
          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Share hospital telemetry"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Reserve Bed Action */}
          <button
            onClick={handleReserve}
            disabled={reserving || reservedSuccess}
            className="flex-[2] py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/30 flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>{reserving ? 'Allocating...' : `Hold ${selectedBedType.toUpperCase()} Bed`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
