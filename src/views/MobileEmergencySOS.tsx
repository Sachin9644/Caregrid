import React, { useState } from 'react';
import { Siren, PhoneCall, ShieldAlert, Navigation, Clock, CheckCircle2, HeartHandshake, Phone } from 'lucide-react';
import { AmbulanceUnit, RegionZone } from '../types';
import { NativeService } from '../services/native';

interface MobileEmergencySOSProps {
  ambulances: AmbulanceUnit[];
  activeZone: RegionZone;
}

export const MobileEmergencySOS: React.FC<MobileEmergencySOSProps> = ({
  ambulances,
  activeZone,
}) => {
  const [sosTriggered, setSosTriggered] = useState(false);
  const [dispatching, setDispatching] = useState(false);

  const handleTriggerSOS = async () => {
    NativeService.hapticWarning();
    setDispatching(true);
    setTimeout(() => {
      setDispatching(false);
      setSosTriggered(true);
      NativeService.hapticSuccess();
    }, 1500);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Big One-Touch SOS Emergency Button */}
      <div className="rounded-3xl bg-gradient-to-b from-rose-900 via-rose-950 to-[#0d1220] p-6 text-center border border-rose-500/40 shadow-2xl shadow-rose-900/50 relative overflow-hidden">
        {/* Pulsing ring animation */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-56 h-56 rounded-full bg-rose-500/10 animate-ping" />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Siren className="w-4 h-4 animate-bounce" />
            <span>Critical Emergency Dispatch</span>
          </span>

          <h2 className="text-xl sm:text-2xl font-black text-white mb-2">
            One-Touch Emergency SOS
          </h2>
          <p className="text-xs text-rose-200/80 max-w-sm mb-6">
            Instantly alerts the nearest ALS/BLS ambulance crew and transmits your GPS coordinates to the city triage desk.
          </p>

          {/* Huge SOS Trigger */}
          <button
            onClick={handleTriggerSOS}
            disabled={dispatching || sosTriggered}
            className={`w-36 h-36 rounded-full border-4 flex flex-col items-center justify-center font-black transition-all active:scale-95 shadow-2xl ${
              sosTriggered
                ? 'bg-emerald-600 border-emerald-400 text-white shadow-emerald-500/50'
                : 'bg-gradient-to-tr from-rose-600 to-red-500 border-rose-300 text-white hover:from-rose-500 hover:to-red-400 shadow-rose-600/60 ring-8 ring-rose-500/20'
            }`}
          >
            {sosTriggered ? (
              <>
                <CheckCircle2 className="w-12 h-12 mb-1 animate-pulse" />
                <span className="text-xs font-bold uppercase">SOS SENT</span>
              </>
            ) : dispatching ? (
              <>
                <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin mb-2" />
                <span className="text-xs uppercase">Locating...</span>
              </>
            ) : (
              <>
                <PhoneCall className="w-10 h-10 mb-1" />
                <span className="text-2xl tracking-tighter">SOS</span>
                <span className="text-[10px] font-semibold tracking-wider">TAP TO ALERT</span>
              </>
            )}
          </button>

          {sosTriggered && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-semibold animate-fadeIn max-w-sm">
              Ambulance Unit TN-01-AMB-8812 dispatched! ETA 6 mins. Paramedic Murugan V. (+91 97890 11223) is contacting you.
            </div>
          )}
        </div>
      </div>

      {/* Emergency Helplines Direct Dial Grid */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 px-1">
          Direct Emergency Helplines
        </h3>
        <div className="grid grid-cols-3 gap-2">
          <a
            href="tel:108"
            onClick={() => NativeService.hapticTap()}
            className="p-3 rounded-xl bg-white dark:bg-[#111728] border border-slate-200 dark:border-slate-800 text-center hover:border-rose-500 transition-all shadow-sm"
          >
            <div className="text-lg font-black text-rose-600 dark:text-rose-400">108</div>
            <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Ambulance</div>
            <div className="text-[10px] text-slate-400">24/7 Central</div>
          </a>

          <a
            href="tel:102"
            onClick={() => NativeService.hapticTap()}
            className="p-3 rounded-xl bg-white dark:bg-[#111728] border border-slate-200 dark:border-slate-800 text-center hover:border-cyan-500 transition-all shadow-sm"
          >
            <div className="text-lg font-black text-cyan-600 dark:text-cyan-400">102</div>
            <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Maternity</div>
            <div className="text-[10px] text-slate-400">Mother & Child</div>
          </a>

          <a
            href="tel:104"
            onClick={() => NativeService.hapticTap()}
            className="p-3 rounded-xl bg-white dark:bg-[#111728] border border-slate-200 dark:border-slate-800 text-center hover:border-emerald-500 transition-all shadow-sm"
          >
            <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">104</div>
            <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Helpline</div>
            <div className="text-[10px] text-slate-400">Medical Advice</div>
          </a>
        </div>
      </div>

      {/* Real-time Fleet Telemetry */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Active Ambulance Fleet Telemetry ({ambulances.length})
          </h3>
          <span className="text-[11px] text-slate-400">Zone: {activeZone}</span>
        </div>

        <div className="space-y-2.5">
          {ambulances.map((unit) => (
            <div
              key={unit.id}
              className="p-3.5 rounded-xl bg-white dark:bg-[#111728] border border-slate-200/90 dark:border-slate-800 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                      {unit.callSign}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.2 rounded font-semibold ${
                        unit.status === 'Available'
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                          : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {unit.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {unit.type} • Current Zone: <strong>{unit.currentZone}</strong>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Driver: {unit.driverName} • Base: {unit.assignedHospital}
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-1 text-sm font-black text-rose-600 dark:text-rose-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{unit.etaMinutes} min ETA</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <a
                  href={`tel:${unit.phone}`}
                  onClick={() => NativeService.hapticTap()}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-rose-500" />
                  <span>Call Crew ({unit.phone})</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency First Aid Guidelines */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#111728] p-4 text-xs">
        <h3 className="font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-amber-500" />
          <span>Emergency First Aid Protocol (Golden Hour)</span>
        </h3>
        <ul className="space-y-1.5 text-slate-500 dark:text-slate-400">
          <li>• <strong>Suspected Cardiac Arrest:</strong> Keep patient seated or supine, loosen tight clothing, begin CPR if unresponsive.</li>
          <li>• <strong>Severe Trauma / Bleeding:</strong> Apply firm, direct pressure on the wound with clean cloth. Elevate injured limb.</li>
          <li>• <strong>Stroke Symptoms (F.A.S.T):</strong> Face drooping, Arm weakness, Speech difficulty, Time to call 108 immediately.</li>
        </ul>
      </div>
    </div>
  );
};
