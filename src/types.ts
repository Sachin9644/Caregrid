export type RegionZone = 'All' | 'Central' | 'North' | 'South' | 'East' | 'West';

export type BedTypeFilter = 'all' | 'icu' | 'ventilator' | 'oxygen' | 'general';

export interface Hospital {
  id: string;
  name: string;
  zone: 'Central' | 'North' | 'South' | 'East' | 'West';
  type: 'Government' | 'Private Super-Specialty' | 'Trust Hospital';
  address: string;
  distanceKm: number;
  contactNumber: string;
  emergencyDeskPhone: string;
  emergencyAvailable: boolean;
  totalBeds: number;
  availableBeds: number;
  icuTotal: number;
  icuAvailable: number;
  ventilatorTotal: number;
  ventilatorAvailable: number;
  oxygenAvailable: number;
  verifiedAt: string;
  rating: number;
}

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface BloodStockItem {
  bloodGroup: BloodGroup;
  unitsAvailable: number;
  rhFactor: 'Positive' | 'Negative';
  status: 'Critical' | 'Low' | 'Moderate' | 'Sufficient';
  compatibleRecipients: BloodGroup[];
}

export interface HospitalBloodRecord {
  hospitalId: string;
  hospitalName: string;
  zone: string;
  phone: string;
  stocks: Record<BloodGroup, number>;
  lastUpdated: string;
}

export interface UrgentBloodAlert {
  id: string;
  patientName: string;
  hospitalName: string;
  bloodGroup: BloodGroup;
  unitsNeeded: number;
  urgency: 'CRITICAL (Next 2 Hours)' | 'URGENT (Today)' | 'SCHEDULED SURGERY';
  contactPerson: string;
  contactPhone: string;
  postedAgo: string;
  status: 'Seeking Donors' | 'Fulfilled' | 'In Transit';
}

export interface AmbulanceUnit {
  id: string;
  callSign: string;
  type: 'Advanced Life Support (ALS)' | 'Basic Life Support (BLS)' | 'Neonatal ICU';
  currentZone: string;
  driverName: string;
  phone: string;
  status: 'Available' | 'Dispatched' | 'En Route to Hospital';
  etaMinutes: number;
  assignedHospital?: string;
}

export interface SummaryKPIs {
  totalAvailableBeds: number;
  totalIcuAvailable: number;
  ventilatorAvailable: number;
  oxygenBedsAvailable: number;
  totalBloodUnits: number;
  networkHospitals: number;
  activeEmergencyRequests: number;
  avgAmbulanceEtaMinutes: number;
}

export interface TrendPoint {
  timeLabel: string;
  icuOccupancyPct: number;
  generalBedOccupancyPct: number;
  emergencyInflow: number;
}
