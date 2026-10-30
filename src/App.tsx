import React, { useState, useEffect, useCallback } from 'react';
import { App as CapApp } from '@capacitor/app';
import {
  Hospital,
  SummaryKPIs,
  BloodStockItem,
  HospitalBloodRecord,
  UrgentBloodAlert,
  AmbulanceUnit,
  TrendPoint,
  RegionZone,
} from './types';
import { CareGridRepository } from './services/repository';
import { NativeService } from './services/native';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { OfflineBanner } from './components/OfflineBanner';
import { BedDetailModal } from './components/BedDetailModal';
import { BloodRequestModal } from './components/BloodRequestModal';
import { MobileOverview } from './views/MobileOverview';
import { MobileHospitalBeds } from './views/MobileHospitalBeds';
import { MobileBloodBank } from './views/MobileBloodBank';
import { MobileEmergencySOS } from './views/MobileEmergencySOS';
import { MobileAnalytics } from './views/MobileAnalytics';

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeZone, setActiveZone] = useState<RegionZone>('All');
  const [isDark, setIsDark] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Core Healthcare Telemetry
  const [kpis, setKpis] = useState<SummaryKPIs>({
    totalAvailableBeds: 580,
    totalIcuAvailable: 98,
    ventilatorAvailable: 58,
    oxygenBedsAvailable: 395,
    totalBloodUnits: 720,
    networkHospitals: 8,
    activeEmergencyRequests: 3,
    avgAmbulanceEtaMinutes: 8,
  });
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [bloodStocks, setBloodStocks] = useState<BloodStockItem[]>([]);
  const [hospitalBloodRecords, setHospitalBloodRecords] = useState<HospitalBloodRecord[]>([]);
  const [urgentAlerts, setUrgentAlerts] = useState<UrgentBloodAlert[]>([]);
  const [ambulances, setAmbulances] = useState<AmbulanceUnit[]>([]);
  const [occupancyTrends, setOccupancyTrends] = useState<TrendPoint[]>([]);

  // Modals
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [bloodModalOpen, setBloodModalOpen] = useState(false);

  // Sync dark theme with document root & Capacitor status bar
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    NativeService.setStatusBarStyle(isDark);
  }, [isDark]);

  // Initial Hardware & Repository Initialization
  useEffect(() => {
    CareGridRepository.init().then(() => {
      refreshData();
    });

    // Check Network
    NativeService.getNetworkStatus().then((status) => {
      setIsOnline(status.connected);
    });

    const netListener = NativeService.addNetworkListener((status) => {
      setIsOnline(status.connected);
    });

    // Android Hardware Back Button
    const backListener = CapApp.addListener('backButton', () => {
      if (selectedHospital) {
        setSelectedHospital(null);
      } else if (bloodModalOpen) {
        setBloodModalOpen(false);
      } else if (activeTab !== 'dashboard') {
        setActiveTab('dashboard');
      } else {
        CapApp.exitApp();
      }
    });

    return () => {
      Promise.resolve(netListener).then((l: any) => l?.remove?.());
      Promise.resolve(backListener).then((l: any) => l?.remove?.());
    };
  }, [selectedHospital, bloodModalOpen, activeTab]);

  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const summary = await CareGridRepository.getSummaryKPIs(activeZone);
      const hospList = CareGridRepository.getHospitals(activeZone);
      const bloodList = CareGridRepository.getBloodInventory(activeZone);
      const bloodRecs = CareGridRepository.getHospitalBloodRecords(activeZone);
      const alerts = CareGridRepository.getUrgentAlerts();
      const ambList = CareGridRepository.getAmbulances(activeZone);
      const trends = CareGridRepository.getHourlyOccupancyTrends();

      setKpis(summary);
      setHospitals(hospList);
      setBloodStocks(bloodList);
      setHospitalBloodRecords(bloodRecs);
      setUrgentAlerts(alerts);
      setAmbulances(ambList);
      setOccupancyTrends(trends);
    } finally {
      setIsRefreshing(false);
    }
  }, [activeZone]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleReserveBed = async (
    hospitalId: string,
    bedType: 'icu' | 'ventilator' | 'oxygen' | 'general'
  ) => {
    const success = await CareGridRepository.reserveBed(hospitalId, bedType);
    if (success) {
      await refreshData();
      // Update selected hospital state
      const updated = CareGridRepository.getHospitalById(hospitalId);
      if (updated) setSelectedHospital(updated);
    }
    return success;
  };

  const handleCreateBloodAppeal = async (
    data: Omit<UrgentBloodAlert, 'id' | 'postedAgo' | 'status'>
  ) => {
    const created = await CareGridRepository.submitBloodRequest(data);
    await refreshData();
    return created;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navbar with Zone Scope Ribbon */}
      <Navbar
        activeZone={activeZone}
        setActiveZone={setActiveZone}
        isDark={isDark}
        setIsDark={setIsDark}
        onQuickSOS={() => setActiveTab('sos')}
        onRefresh={refreshData}
        isRefreshing={isRefreshing}
      />

      {/* Offline Status Banner */}
      <OfflineBanner isOnline={isOnline} />

      {/* Main View Container */}
      <main className="flex-1 px-3 sm:px-6 py-4 max-w-5xl mx-auto w-full overflow-x-hidden">
        {activeTab === 'dashboard' && (
          <MobileOverview
            kpis={kpis}
            hospitals={hospitals}
            bloodStocks={bloodStocks}
            urgentAlerts={urgentAlerts}
            occupancyTrends={occupancyTrends}
            onSelectHospital={setSelectedHospital}
            onNavigateTab={setActiveTab}
            onOpenBloodModal={() => setBloodModalOpen(true)}
          />
        )}

        {activeTab === 'beds' && (
          <MobileHospitalBeds
            hospitals={hospitals}
            onSelectHospital={setSelectedHospital}
            activeZone={activeZone}
          />
        )}

        {activeTab === 'blood' && (
          <MobileBloodBank
            bloodStocks={bloodStocks}
            hospitalBloodRecords={hospitalBloodRecords}
            urgentAlerts={urgentAlerts}
            onOpenBloodModal={() => setBloodModalOpen(true)}
            activeZone={activeZone}
          />
        )}

        {activeTab === 'sos' && (
          <MobileEmergencySOS
            ambulances={ambulances}
            activeZone={activeZone}
          />
        )}

        {activeTab === 'analytics' && (
          <MobileAnalytics
            occupancyTrends={occupancyTrends}
            hospitals={hospitals}
            bloodStocks={bloodStocks}
            activeZone={activeZone}
          />
        )}
      </main>

      {/* Fixed Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        urgentAlertsCount={urgentAlerts.length}
      />

      {/* Hospital Bed Detail & Reservation Modal */}
      <BedDetailModal
        hospital={selectedHospital}
        onClose={() => setSelectedHospital(null)}
        onReserveBed={handleReserveBed}
      />

      {/* Urgent Blood Request / Appeal Modal */}
      <BloodRequestModal
        isOpen={bloodModalOpen}
        onClose={() => setBloodModalOpen(false)}
        onSubmit={handleCreateBloodAppeal}
      />
    </div>
  );
}

export default App;
