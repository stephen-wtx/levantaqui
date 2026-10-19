export type ATMAdminStatus = 'AVAILABLE' | 'UNAVAILABLE' | 'MAINTENANCE';

export type ServiceAdminStatus = 'OPEN' | 'CLOSED';

export type OperatingDay =
  | 'Segunda'
  | 'Terça'
  | 'Quarta'
  | 'Quinta'
  | 'Sexta'
  | 'Sábado';

export const ALL_OPERATING_DAYS: OperatingDay[] = [
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
];

export interface AdminATM {
  id: string;
  code: string;
  label: string;
  locationDetails?: string;
  status: ATMAdminStatus;
}

export interface AdminServiceConfig {
  status: ServiceAdminStatus;
  days: OperatingDay[];
  openingTime: string;
  closingTime: string;
}

export interface BranchAdminState {
  branchId: string;
  branchName: string;
  referenceLocation: string;
  atms: AdminATM[];
  depositService: AdminServiceConfig;
  customerService: AdminServiceConfig;
  lastUpdated?: string;
}

export interface FeedbackNotification {
  id: string;
  type: 'success' | 'error';
  message: string;
}
