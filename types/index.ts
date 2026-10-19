export type ATMStatus = 'AVAILABLE' | 'UNAVAILABLE' | 'MAINTENANCE';

export type ServiceAvailability = 'AVAILABLE' | 'UNAVAILABLE';

export type BranchStatus = 'OPEN' | 'PARTIAL' | 'CLOSED';

export interface ATM {
  id: string;
  code: string;
  label: string;
  locationDetails: string;
  status: ATMStatus;
  dispensesCash: boolean; // "A pagar" context
  acceptsDeposit: boolean;
  notes?: string;
  lastChecked: string;
}

export interface ServiceHours {
  operatingHours: string;
  scheduleDetails: string;
  notes?: string;
}

export interface BranchService {
  status: ServiceAvailability;
  hours: ServiceHours;
  notes?: string;
}

export interface Branch {
  id: string;
  name: string;
  shortName: string;
  referenceLocation: string;
  city: string;
  status: BranchStatus;
  depositService: BranchService;
  customerService: BranchService;
  atms: ATM[];
  lastUpdated: string;
}

export interface DashboardMetrics {
  totalBranches: number;
  openBranches: number;
  totalATMs: number;
  availableATMs: number;
  unavailableATMs: number;
  maintenanceATMs: number;
  branchesWithDepositAvailable: number;
  branchesWithCustomerServiceAvailable: number;
  lastGlobalUpdate: string;
}

export type FilterCategory = 'ALL' | 'DEPOSIT_AVAILABLE' | 'SERVICE_AVAILABLE' | 'ATMS_AVAILABLE';
