import React, { useState } from 'react';
import { X, Droplet, Send, Share2 } from 'lucide-react';
import { BloodGroup, UrgentBloodAlert } from '../types';
import { NativeService } from '../services/native';

interface BloodRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<UrgentBloodAlert, 'id' | 'postedAgo' | 'status'>) => Promise<UrgentBloodAlert>;
}

const BLOOD_GROUPS: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

export const BloodRequestModal: React.FC<BloodRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [patientName, setPatientName] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O-');
  const [unitsNeeded, setUnitsNeeded] = useState(2);
  const [urgency, setUrgency] = useState<UrgentBloodAlert['urgency']>('CRITICAL (Next 2 Hours)');
  const [contactPerson, setContactPerson] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !hospitalName || !contactPhone) {
      alert('Please fill out all required fields.');
      return;
    }

    setSubmitting(true);
    NativeService.hapticTap();

    try {
      const created = await onSubmit({
        patientName,
        hospitalName,
        bloodGroup,
        unitsNeeded,
        urgency,
        contactPerson: contactPerson || 'Attendant',
        contactPhone,
      });

      NativeService.hapticSuccess();

      // Offer instant broadcast via Native Share Sheet
      await NativeService.shareContent({
        title: `🚨 URGENT BLOOD NEED: ${bloodGroup} (${unitsNeeded} Units)`,
        text: `Urgent Blood Appeal via CareGrid Mobile:\nPatient: ${patientName}\nRequired Group: ${bloodGroup} (${unitsNeeded} Units)\nHospital: ${hospitalName}\nUrgency: ${urgency}\nContact Person: ${contactPerson || 'Attendant'} (${contactPhone})\nPlease forward to eligible donors immediately.`,
        dialogTitle: 'Broadcast Blood Appeal',
      });

      onClose();
    } catch {
      NativeService.hapticError();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-white dark:bg-[#111728] rounded-t-2xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <Droplet className="w-5 h-5 fill-rose-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Raise Urgent Blood Appeal</h2>
              <p className="text-xs text-slate-400">Broadcasts to verified regional donor network</p>
            </div>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-3.5">
          {/* Patient Details */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Patient Name & Diagnosis *
            </label>
            <input
              type="text"
              required
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="e.g. Rajesh Kumar (Emergency Surgery)"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Hospital */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Admitted Hospital Name *
            </label>
            <input
              type="text"
              required
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              placeholder="e.g. Apollo Hospital Greams Road"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Blood Group Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Select Required Blood Group *
            </label>
            <div className="grid grid-cols-4 gap-2">
              {BLOOD_GROUPS.map((grp) => (
                <button
                  type="button"
                  key={grp}
                  onClick={() => {
                    NativeService.hapticTap();
                    setBloodGroup(grp);
                  }}
                  className={`py-2 px-2 text-xs font-bold rounded-lg border transition-all ${
                    bloodGroup === grp
                      ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/20'
                      : 'bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-400'
                  }`}
                >
                  {grp}
                </button>
              ))}
            </div>
          </div>

          {/* Units & Urgency */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Units Needed
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={unitsNeeded}
                onChange={(e) => setUnitsNeeded(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Urgency Tier
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="CRITICAL (Next 2 Hours)">Critical (Next 2h)</option>
                <option value="URGENT (Today)">Urgent (Today)</option>
                <option value="SCHEDULED SURGERY">Scheduled Surgery</option>
              </select>
            </div>
          </div>

          {/* Contact Person & Phone */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Contact Person
              </label>
              <input
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="Attendant name"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Emergency Phone *
              </label>
              <input
                type="tel"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+91 98401 xxxxx"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-700 hover:to-red-600 text-white font-bold text-xs shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Broadcasting...' : 'Publish Appeal & Open Share Sheet'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
