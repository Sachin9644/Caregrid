import {
  Hospital,
  BloodStockItem,
  HospitalBloodRecord,
  UrgentBloodAlert,
  AmbulanceUnit,
  SummaryKPIs,
  TrendPoint,
  RegionZone,
  BloodGroup,
} from '../types';
import { NativeService } from './native';

const STORAGE_KEYS = {
  HOSPITALS: 'caregrid_hospitals_data',
  BLOOD_STOCKS: 'caregrid_blood_data',
  URGENT_ALERTS: 'caregrid_urgent_alerts',
  AMBULANCES: 'caregrid_ambulances',
  LAST_SYNC: 'caregrid_last_telemetry_sync',
};

// Initial verified network hospitals database
const INITIAL_HOSPITALS: Hospital[] = [
  {
    id: 'hosp-001',
    name: 'Apollo Super Specialty Hospital',
    zone: 'Central',
    type: 'Private Super-Specialty',
    address: 'Greams Lane, Central Corridor',
    distanceKm: 1.8,
    contactNumber: '+91 44 2829 0200',
    emergencyDeskPhone: '+91 44 2829 3333',
    emergencyAvailable: true,
    totalBeds: 540,
    availableBeds: 62,
    icuTotal: 80,
    icuAvailable: 14,
    ventilatorTotal: 45,
    ventilatorAvailable: 9,
    oxygenAvailable: 38,
    verifiedAt: '2 mins ago',
    rating: 4.8,
  },
  {
    id: 'hosp-002',
    name: 'Government Rajiv Gandhi General Hospital',
    zone: 'Central',
    type: 'Government',
    address: 'EVR Periyar Salai, Park Town',
    distanceKm: 3.2,
    contactNumber: '+91 44 2530 5000',
    emergencyDeskPhone: '108 / +91 44 2530 5111',
    emergencyAvailable: true,
    totalBeds: 1200,
    availableBeds: 184,
    icuTotal: 150,
    icuAvailable: 26,
    ventilatorTotal: 90,
    ventilatorAvailable: 18,
    oxygenAvailable: 140,
    verifiedAt: 'Just now',
    rating: 4.5,
  },
  {
    id: 'hosp-003',
    name: 'Fortis Malar Hospital',
    zone: 'South',
    type: 'Private Super-Specialty',
    address: 'Gandhi Nagar, Adyar',
    distanceKm: 5.4,
    contactNumber: '+91 44 4289 2222',
    emergencyDeskPhone: '+91 44 4289 2100',
    emergencyAvailable: true,
    totalBeds: 280,
    availableBeds: 31,
    icuTotal: 40,
    icuAvailable: 6,
    ventilatorTotal: 25,
    ventilatorAvailable: 4,
    oxygenAvailable: 21,
    verifiedAt: '5 mins ago',
    rating: 4.7,
  },
  {
    id: 'hosp-004',
    name: 'MIOT International Trauma & Emergency',
    zone: 'South',
    type: 'Private Super-Specialty',
    address: 'Manapakkam, Mount Poonamallee Rd',
    distanceKm: 7.9,
    contactNumber: '+91 44 4200 2288',
    emergencyDeskPhone: '+91 44 4200 2200',
    emergencyAvailable: true,
    totalBeds: 450,
    availableBeds: 48,
    icuTotal: 65,
    icuAvailable: 11,
    ventilatorTotal: 35,
    ventilatorAvailable: 8,
    oxygenAvailable: 29,
    verifiedAt: '8 mins ago',
    rating: 4.9,
  },
  {
    id: 'hosp-005',
    name: 'Stanley Medical College & Trauma Care',
    zone: 'North',
    type: 'Government',
    address: 'Old Jail Rd, Royapuram',
    distanceKm: 4.6,
    contactNumber: '+91 44 2528 1351',
    emergencyDeskPhone: '+91 44 2528 1108',
    emergencyAvailable: true,
    totalBeds: 950,
    availableBeds: 112,
    icuTotal: 110,
    icuAvailable: 19,
    ventilatorTotal: 60,
    ventilatorAvailable: 12,
    oxygenAvailable: 81,
    verifiedAt: '12 mins ago',
    rating: 4.4,
  },
  {
    id: 'hosp-006',
    name: 'Sundaram Medical Foundation (SMF)',
    zone: 'West',
    type: 'Trust Hospital',
    address: 'Shanthi Colony, Anna Nagar',
    distanceKm: 6.1,
    contactNumber: '+91 44 2626 8844',
    emergencyDeskPhone: '+91 44 2626 8800',
    emergencyAvailable: true,
    totalBeds: 220,
    availableBeds: 24,
    icuTotal: 30,
    icuAvailable: 4,
    ventilatorTotal: 18,
    ventilatorAvailable: 3,
    oxygenAvailable: 17,
    verifiedAt: '15 mins ago',
    rating: 4.6,
  },
  {
    id: 'hosp-007',
    name: 'Dr. Kamakshi Memorial Hospital',
    zone: 'South',
    type: 'Private Super-Specialty',
    address: 'Pallikaranai, Radial Road',
    distanceKm: 11.2,
    contactNumber: '+91 44 6630 0300',
    emergencyDeskPhone: '+91 44 6630 0108',
    emergencyAvailable: true,
    totalBeds: 300,
    availableBeds: 42,
    icuTotal: 45,
    icuAvailable: 8,
    ventilatorTotal: 22,
    ventilatorAvailable: 5,
    oxygenAvailable: 29,
    verifiedAt: '18 mins ago',
    rating: 4.5,
  },
  {
    id: 'hosp-008',
    name: 'Kilpauk Medical College Hospital',
    zone: 'West',
    type: 'Government',
    address: 'EVR Periyar Salai, Kilpauk',
    distanceKm: 3.8,
    contactNumber: '+91 44 2836 4951',
    emergencyDeskPhone: '+91 44 2836 4108',
    emergencyAvailable: true,
    totalBeds: 700,
    availableBeds: 89,
    icuTotal: 85,
    icuAvailable: 15,
    ventilatorTotal: 40,
    ventilatorAvailable: 7,
    oxygenAvailable: 67,
    verifiedAt: '4 mins ago',
    rating: 4.3,
  },
];

// Initial Regional Blood Stock Matrix
const INITIAL_BLOOD_RECORDS: HospitalBloodRecord[] = [
  {
    hospitalId: 'hosp-001',
    hospitalName: 'Apollo Super Specialty Hospital',
    zone: 'Central',
    phone: '+91 44 2829 0200',
    stocks: { 'A+': 34, 'A-': 9, 'B+': 41, 'B-': 6, 'AB+': 18, 'AB-': 4, 'O+': 52, 'O-': 7 },
    lastUpdated: '10 mins ago',
  },
  {
    hospitalId: 'hosp-002',
    hospitalName: 'Rajiv Gandhi General Red Cross Bank',
    zone: 'Central',
    phone: '+91 44 2530 5000',
    stocks: { 'A+': 88, 'A-': 19, 'B+': 95, 'B-': 14, 'AB+': 42, 'AB-': 8, 'O+': 120, 'O-': 16 },
    lastUpdated: 'Just now',
  },
  {
    hospitalId: 'hosp-003',
    hospitalName: 'Fortis Malar Blood Centre',
    zone: 'South',
    phone: '+91 44 4289 2222',
    stocks: { 'A+': 22, 'A-': 5, 'B+': 28, 'B-': 4, 'AB+': 11, 'AB-': 2, 'O+': 36, 'O-': 3 },
    lastUpdated: '25 mins ago',
  },
  {
    hospitalId: 'hosp-004',
    hospitalName: 'MIOT Blood Transfusion Wing',
    zone: 'South',
    phone: '+91 44 4200 2288',
    stocks: { 'A+': 38, 'A-': 8, 'B+': 44, 'B-': 7, 'AB+': 19, 'AB-': 5, 'O+': 61, 'O-': 9 },
    lastUpdated: '15 mins ago',
  },
  {
    hospitalId: 'hosp-005',
    hospitalName: 'Stanley Government Blood Bank',
    zone: 'North',
    phone: '+91 44 2528 1351',
    stocks: { 'A+': 64, 'A-': 12, 'B+': 71, 'B-': 9, 'AB+': 28, 'AB-': 4, 'O+': 89, 'O-': 11 },
    lastUpdated: '30 mins ago',
  },
];

// Initial Urgent Blood Requests
const INITIAL_URGENT_ALERTS: UrgentBloodAlert[] = [
  {
    id: 'req-101',
    patientName: 'K. Ramanathan (Cardiac Emergency)',
    hospitalName: 'Apollo Super Specialty Hospital',
    bloodGroup: 'O-',
    unitsNeeded: 3,
    urgency: 'CRITICAL (Next 2 Hours)',
    contactPerson: 'Dr. S. Sundaram / Blood Coordinator',
    contactPhone: '+91 98401 22345',
    postedAgo: '12 mins ago',
    status: 'Seeking Donors',
  },
  {
    id: 'req-102',
    patientName: 'Ananya Sharma (Trauma Surgery)',
    hospitalName: 'MIOT International Trauma',
    bloodGroup: 'AB-',
    unitsNeeded: 2,
    urgency: 'CRITICAL (Next 2 Hours)',
    contactPerson: 'Emergency Desk / Staff Nurse Priya',
    contactPhone: '+91 98840 55678',
    postedAgo: '28 mins ago',
    status: 'Seeking Donors',
  },
  {
    id: 'req-103',
    patientName: 'Master R. Karthik (Thalassemia)',
    hospitalName: 'Rajiv Gandhi General Hospital',
    bloodGroup: 'B-',
    unitsNeeded: 2,
    urgency: 'URGENT (Today)',
    contactPerson: 'Pediatric Hematology Dept',
    contactPhone: '+91 94440 99123',
    postedAgo: '1 hour ago',
    status: 'Seeking Donors',
  },
];

// Initial Emergency Ambulances Telemetry
const INITIAL_AMBULANCES: AmbulanceUnit[] = [
  {
    id: 'amb-01',
    callSign: 'TN-01-AMB-8812',
    type: 'Advanced Life Support (ALS)',
    currentZone: 'Central',
    driverName: 'Murugan V.',
    phone: '+91 97890 11223',
    status: 'Available',
    etaMinutes: 6,
    assignedHospital: 'Apollo Super Specialty Hospital',
  },
  {
    id: 'amb-02',
    callSign: 'TN-07-AMB-4321',
    type: 'Advanced Life Support (ALS)',
    currentZone: 'South',
    driverName: 'Dinesh Kumar',
    phone: '+91 98410 77665',
    status: 'Available',
    etaMinutes: 8,
    assignedHospital: 'Fortis Malar Hospital',
  },
  {
    id: 'amb-03',
    callSign: 'TN-04-AMB-1081',
    type: 'Basic Life Support (BLS)',
    currentZone: 'North',
    driverName: 'Senthil Nathan',
    phone: '+91 94450 33445',
    status: 'En Route to Hospital',
    etaMinutes: 12,
    assignedHospital: 'Stanley Medical College',
  },
  {
    id: 'amb-04',
    callSign: 'TN-02-AMB-5590',
    type: 'Neonatal ICU',
    currentZone: 'West',
    driverName: 'K. Rajendran',
    phone: '+91 98408 66778',
    status: 'Available',
    etaMinutes: 9,
    assignedHospital: 'Kilpauk Medical College',
  },
];

export class CareGridRepository {
  private static hospitals: Hospital[] = [];
  private static bloodRecords: HospitalBloodRecord[] = [];
  private static urgentAlerts: UrgentBloodAlert[] = [];
  private static ambulances: AmbulanceUnit[] = [];

  static async init(): Promise<void> {
    this.hospitals = await NativeService.getStorage<Hospital[]>(STORAGE_KEYS.HOSPITALS, INITIAL_HOSPITALS);
    this.bloodRecords = await NativeService.getStorage<HospitalBloodRecord[]>(STORAGE_KEYS.BLOOD_STOCKS, INITIAL_BLOOD_RECORDS);
    this.urgentAlerts = await NativeService.getStorage<UrgentBloodAlert[]>(STORAGE_KEYS.URGENT_ALERTS, INITIAL_URGENT_ALERTS);
    this.ambulances = await NativeService.getStorage<AmbulanceUnit[]>(STORAGE_KEYS.AMBULANCES, INITIAL_AMBULANCES);
  }

  static async getSummaryKPIs(zone: RegionZone = 'All'): Promise<SummaryKPIs> {
    const list = this.getHospitals(zone);
    const totalAvail = list.reduce((acc, h) => acc + h.availableBeds, 0);
    const totalIcu = list.reduce((acc, h) => acc + h.icuAvailable, 0);
    const totalVent = list.reduce((acc, h) => acc + h.ventilatorAvailable, 0);
    const totalOxy = list.reduce((acc, h) => acc + h.oxygenAvailable, 0);

    const bloodRecords = zone === 'All' ? this.bloodRecords : this.bloodRecords.filter((b) => b.zone === zone);
    let totalBlood = 0;
    bloodRecords.forEach((rec) => {
      Object.values(rec.stocks).forEach((qty) => (totalBlood += qty));
    });

    const activeReqs = this.urgentAlerts.filter((a) => a.status === 'Seeking Donors').length;
    const availAmbs = this.ambulances.filter((a) => a.status === 'Available');
    const avgEta = availAmbs.length > 0
      ? Math.round(availAmbs.reduce((acc, a) => acc + a.etaMinutes, 0) / availAmbs.length)
      : 8;

    return {
      totalAvailableBeds: totalAvail,
      totalIcuAvailable: totalIcu,
      ventilatorAvailable: totalVent,
      oxygenBedsAvailable: totalOxy,
      totalBloodUnits: totalBlood,
      networkHospitals: list.length,
      activeEmergencyRequests: activeReqs,
      avgAmbulanceEtaMinutes: avgEta,
    };
  }

  static getHospitals(zone: RegionZone = 'All'): Hospital[] {
    if (zone === 'All') return [...this.hospitals];
    return this.hospitals.filter((h) => h.zone === zone);
  }

  static getHospitalById(id: string): Hospital | undefined {
    return this.hospitals.find((h) => h.id === id);
  }

  static getBloodInventory(zone: RegionZone = 'All'): BloodStockItem[] {
    const records = zone === 'All' ? this.bloodRecords : this.bloodRecords.filter((b) => b.zone === zone);
    const bloodTotals: Record<BloodGroup, number> = {
      'A+': 0, 'A-': 0, 'B+': 0, 'B-': 0, 'AB+': 0, 'AB-': 0, 'O+': 0, 'O-': 0,
    };

    records.forEach((rec) => {
      (Object.keys(rec.stocks) as BloodGroup[]).forEach((grp) => {
        bloodTotals[grp] += rec.stocks[grp] || 0;
      });
    });

    const compatibilityMap: Record<BloodGroup, BloodGroup[]> = {
      'O-': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // Universal donor
      'O+': ['A+', 'B+', 'AB+', 'O+'],
      'A-': ['A+', 'A-', 'AB+', 'AB-'],
      'A+': ['A+', 'AB+'],
      'B-': ['B+', 'B-', 'AB+', 'AB-'],
      'B+': ['B+', 'AB+'],
      'AB-': ['AB+', 'AB-'],
      'AB+': ['AB+'], // Universal recipient for receiving, gives only to AB+
    };

    return (Object.keys(bloodTotals) as BloodGroup[]).map((group) => {
      const units = bloodTotals[group];
      const isRhNegative = group.includes('-');
      let status: 'Critical' | 'Low' | 'Moderate' | 'Sufficient' = 'Sufficient';
      if (units < 15) status = 'Critical';
      else if (units < 35) status = 'Low';
      else if (units < 70) status = 'Moderate';

      return {
        bloodGroup: group,
        unitsAvailable: units,
        rhFactor: isRhNegative ? 'Negative' : 'Positive',
        status,
        compatibleRecipients: compatibilityMap[group],
      };
    });
  }

  static getHospitalBloodRecords(zone: RegionZone = 'All'): HospitalBloodRecord[] {
    if (zone === 'All') return [...this.bloodRecords];
    return this.bloodRecords.filter((r) => r.zone === zone);
  }

  static getUrgentAlerts(): UrgentBloodAlert[] {
    return [...this.urgentAlerts];
  }

  static async submitBloodRequest(newAlert: Omit<UrgentBloodAlert, 'id' | 'postedAgo' | 'status'>): Promise<UrgentBloodAlert> {
    const alert: UrgentBloodAlert = {
      ...newAlert,
      id: `req-${Date.now().toString().slice(-4)}`,
      postedAgo: 'Just now',
      status: 'Seeking Donors',
    };
    this.urgentAlerts = [alert, ...this.urgentAlerts];
    await NativeService.setStorage(STORAGE_KEYS.URGENT_ALERTS, this.urgentAlerts);
    return alert;
  }

  static getAmbulances(zone: RegionZone = 'All'): AmbulanceUnit[] {
    if (zone === 'All') return [...this.ambulances];
    return this.ambulances.filter((a) => a.currentZone === zone);
  }

  static async reserveBed(hospitalId: string, bedType: 'icu' | 'ventilator' | 'oxygen' | 'general'): Promise<boolean> {
    const hospIndex = this.hospitals.findIndex((h) => h.id === hospitalId);
    if (hospIndex === -1) return false;

    const hosp = { ...this.hospitals[hospIndex] };
    if (bedType === 'icu' && hosp.icuAvailable > 0) {
      hosp.icuAvailable -= 1;
      hosp.availableBeds -= 1;
    } else if (bedType === 'ventilator' && hosp.ventilatorAvailable > 0) {
      hosp.ventilatorAvailable -= 1;
      hosp.availableBeds -= 1;
    } else if (bedType === 'oxygen' && hosp.oxygenAvailable > 0) {
      hosp.oxygenAvailable -= 1;
      hosp.availableBeds -= 1;
    } else if (hosp.availableBeds > 0) {
      hosp.availableBeds -= 1;
    } else {
      return false;
    }

    hosp.verifiedAt = 'Just updated';
    this.hospitals[hospIndex] = hosp;
    await NativeService.setStorage(STORAGE_KEYS.HOSPITALS, this.hospitals);
    return true;
  }

  static getHourlyOccupancyTrends(): TrendPoint[] {
    return [
      { timeLabel: '00:00', icuOccupancyPct: 76, generalBedOccupancyPct: 82, emergencyInflow: 14 },
      { timeLabel: '04:00', icuOccupancyPct: 79, generalBedOccupancyPct: 84, emergencyInflow: 9 },
      { timeLabel: '08:00', icuOccupancyPct: 84, generalBedOccupancyPct: 87, emergencyInflow: 28 },
      { timeLabel: '12:00', icuOccupancyPct: 89, generalBedOccupancyPct: 91, emergencyInflow: 36 },
      { timeLabel: '16:00', icuOccupancyPct: 86, generalBedOccupancyPct: 89, emergencyInflow: 31 },
      { timeLabel: '20:00', icuOccupancyPct: 81, generalBedOccupancyPct: 85, emergencyInflow: 24 },
      { timeLabel: 'Now', icuOccupancyPct: 83, generalBedOccupancyPct: 86, emergencyInflow: 19 },
    ];
  }
}
