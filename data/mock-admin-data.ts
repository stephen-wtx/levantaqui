import { BranchAdminState } from '@/types/admin';

export const INITIAL_ADMIN_BRANCHES: Record<string, BranchAdminState> = {
  'Alto-Gingone': {
    branchId: 'branch-alto-gingone',
    branchName: 'Alto-Gingone',
    referenceLocation: 'Av. 1º de Maio, próx. ao Mercado Central',
    atms: [
      {
        id: 'atm-ag-01',
        code: 'ATM-AG-01',
        label: 'Caixa 01',
        locationDetails: 'Fachada principal da agência',
        status: 'AVAILABLE',
      },
      {
        id: 'atm-ag-02',
        code: 'ATM-AG-02',
        label: 'Caixa 02',
        locationDetails: 'Fachada principal da agência',
        status: 'AVAILABLE',
      },
      {
        id: 'atm-ag-03',
        code: 'ATM-AG-03',
        label: 'Caixa 03',
        locationDetails: 'Área interior de autoatendimento',
        status: 'AVAILABLE',
      },
      {
        id: 'atm-ag-04',
        code: 'ATM-AG-04',
        label: 'Caixa 04',
        locationDetails: 'Área interior de autoatendimento',
        status: 'MAINTENANCE',
      },
    ],
    depositService: {
      status: 'OPEN',
      days: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
      openingTime: '08:00',
      closingTime: '15:30',
    },
    customerService: {
      status: 'OPEN',
      days: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
      openingTime: '08:00',
      closingTime: '15:30',
    },
    lastUpdated: 'Hoje às 10:42',
  },

  Cariacó: {
    branchId: 'branch-cariaco',
    branchName: 'Cariacó',
    referenceLocation: 'Estrada Nacional nº 1, Rotunda do Cariacó',
    atms: [
      {
        id: 'atm-car-01',
        code: 'ATM-CR-01',
        label: 'Caixa 01 (Exterior)',
        locationDetails: 'Entrada da agência',
        status: 'AVAILABLE',
      },
      {
        id: 'atm-car-02',
        code: 'ATM-CR-02',
        label: 'Caixa 02',
        locationDetails: 'Entrada da agência',
        status: 'UNAVAILABLE',
      },
    ],
    depositService: {
      status: 'CLOSED',
      days: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
      openingTime: '08:00',
      closingTime: '15:00',
    },
    customerService: {
      status: 'OPEN',
      days: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
      openingTime: '08:00',
      closingTime: '15:30',
    },
    lastUpdated: 'Hoje às 10:41',
  },

  'Centro da Cidade': {
    branchId: 'branch-centro-cidade',
    branchName: 'Centro da Cidade',
    referenceLocation: 'Av. Eduardo Mondlane, Edifício Comercial',
    atms: [
      {
        id: 'atm-cc-01',
        code: 'ATM-CC-01',
        label: 'Caixa 01',
        locationDetails: 'Hall de entrada da agência',
        status: 'AVAILABLE',
      },
      {
        id: 'atm-cc-02',
        code: 'ATM-CC-02',
        label: 'Caixa 02',
        locationDetails: 'Hall de entrada da agência',
        status: 'AVAILABLE',
      },
      {
        id: 'atm-cc-03',
        code: 'ATM-CC-03',
        label: 'Caixa 03',
        locationDetails: 'Fachada virada para a Av. Principal',
        status: 'AVAILABLE',
      },
      {
        id: 'atm-cc-04',
        code: 'ATM-CC-04',
        label: 'Caixa 04',
        locationDetails: 'Fachada virada para a Av. Principal',
        status: 'AVAILABLE',
      },
      {
        id: 'atm-cc-05',
        code: 'ATM-CC-05',
        label: 'Caixa 05',
        locationDetails: 'Lateral do edifício comercial',
        status: 'UNAVAILABLE',
      },
    ],
    depositService: {
      status: 'OPEN',
      days: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
      openingTime: '08:00',
      closingTime: '15:30',
    },
    customerService: {
      status: 'OPEN',
      days: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
      openingTime: '08:00',
      closingTime: '16:00',
    },
    lastUpdated: 'Hoje às 10:42',
  },
};

// Alias de retrocompatibilidade
INITIAL_ADMIN_BRANCHES['Cariaco'] = INITIAL_ADMIN_BRANCHES['Cariacó'];
