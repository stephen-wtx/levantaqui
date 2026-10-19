import { Branch, DashboardMetrics } from '@/types';

export const MOCK_BRANCHES: Branch[] = [
  {
    id: 'branch-alto-gingone',
    name: 'Alto-Gingone',
    shortName: 'Alto-Gingone',
    referenceLocation: 'Av. 1º de Maio, próx. ao Mercado Central',
    city: 'Pemba',
    status: 'OPEN',
    depositService: {
      status: 'AVAILABLE',
      hours: {
        operatingHours: '08:00 — 15:30',
        scheduleDetails: 'Segunda a Sexta-feira',
        notes: 'Depósitos em numerário e cheque ao balcão',
      },
    },
    customerService: {
      status: 'AVAILABLE',
      hours: {
        operatingHours: '08:00 — 15:30',
        scheduleDetails: 'Segunda a Sexta-feira',
        notes: 'Abertura de contas, cartões e operações de caixa',
      },
    },
    atms: [
      {
        id: 'atm-ag-01',
        code: 'ATM-AG-01',
        label: 'Caixa 01',
        locationDetails: 'Fachada principal da agência',
        status: 'AVAILABLE',
        dispensesCash: true,
        acceptsDeposit: false,
        notes: 'A pagar notas de 200, 500 e 1000 MT',
        lastChecked: 'Hoje às 10:38',
      },
      {
        id: 'atm-ag-02',
        code: 'ATM-AG-02',
        label: 'Caixa 02',
        locationDetails: 'Fachada principal da agência',
        status: 'AVAILABLE',
        dispensesCash: true,
        acceptsDeposit: false,
        notes: 'A pagar notas de 500 e 1000 MT',
        lastChecked: 'Hoje às 10:40',
      },
      {
        id: 'atm-ag-03',
        code: 'ATM-AG-03',
        label: 'Caixa 03',
        locationDetails: 'Área interior de autoatendimento',
        status: 'AVAILABLE',
        dispensesCash: true,
        acceptsDeposit: true,
        notes: 'A pagar • Depósitos automáticos activos',
        lastChecked: 'Hoje às 10:35',
      },
      {
        id: 'atm-ag-04',
        code: 'ATM-AG-04',
        label: 'Caixa 04',
        locationDetails: 'Área interior de autoatendimento',
        status: 'MAINTENANCE',
        dispensesCash: false,
        acceptsDeposit: false,
        notes: 'Em manutenção preventiva de hardware',
        lastChecked: 'Hoje às 09:15',
      },
    ],
    lastUpdated: 'Hoje às 10:42',
  },
  {
    id: 'branch-cariaco',
    name: 'Cariaco',
    shortName: 'Cariaco',
    referenceLocation: 'Estrada Nacional nº 1, Rotunda do Cariaco',
    city: 'Pemba',
    status: 'PARTIAL',
    depositService: {
      status: 'UNAVAILABLE',
      hours: {
        operatingHours: '08:00 — 15:00',
        scheduleDetails: 'Segunda a Sexta-feira',
        notes: 'Cofre em consolidação técnica • Balcão sem depósitos',
      },
      notes: 'Encaminhamento para balcões Alto-Gingone ou Centro',
    },
    customerService: {
      status: 'AVAILABLE',
      hours: {
        operatingHours: '08:00 — 15:30',
        scheduleDetails: 'Segunda a Sexta-feira',
        notes: 'Gestão de contas, consultas e esclarecimentos',
      },
    },
    atms: [
      {
        id: 'atm-car-01',
        code: 'ATM-CR-01',
        label: 'Caixa 01 (Exterior)',
        locationDetails: 'Entrada da agência',
        status: 'AVAILABLE',
        dispensesCash: true,
        acceptsDeposit: false,
        notes: 'A pagar notas de 500 e 1000 MT',
        lastChecked: 'Hoje às 10:41',
      },
      {
        id: 'atm-car-02',
        code: 'ATM-CR-02',
        label: 'Caixa 02',
        locationDetails: 'Entrada da agência',
        status: 'UNAVAILABLE',
        dispensesCash: false,
        acceptsDeposit: false,
        notes: 'Temporariamente fora de serviço • Sem comunicação',
        lastChecked: 'Hoje às 08:30',
      },
    ],
    lastUpdated: 'Hoje às 10:41',
  },
  {
    id: 'branch-centro-cidade',
    name: 'Centro da Cidade',
    shortName: 'Centro',
    referenceLocation: 'Av. Eduardo Mondlane, Edifício Comercial',
    city: 'Pemba',
    status: 'OPEN',
    depositService: {
      status: 'AVAILABLE',
      hours: {
        operatingHours: '08:00 — 15:30',
        scheduleDetails: 'Segunda a Sexta-feira',
        notes: 'Depósitos rápidos e atendimento a empresas',
      },
    },
    customerService: {
      status: 'AVAILABLE',
      hours: {
        operatingHours: '08:00 — 16:00',
        scheduleDetails: 'Segunda a Sexta-feira (horário alargado)',
        notes: 'Atendimento geral, empresas e balcão prioritário',
      },
    },
    atms: [
      {
        id: 'atm-cc-01',
        code: 'ATM-CC-01',
        label: 'Caixa 01',
        locationDetails: 'Hall de entrada da agência',
        status: 'AVAILABLE',
        dispensesCash: true,
        acceptsDeposit: true,
        notes: 'A pagar notas de 200, 500 e 1000 MT',
        lastChecked: 'Hoje às 10:42',
      },
      {
        id: 'atm-cc-02',
        code: 'ATM-CC-02',
        label: 'Caixa 02',
        locationDetails: 'Hall de entrada da agência',
        status: 'AVAILABLE',
        dispensesCash: true,
        acceptsDeposit: false,
        notes: 'A pagar notas de 500 e 1000 MT',
        lastChecked: 'Hoje às 10:42',
      },
      {
        id: 'atm-cc-03',
        code: 'ATM-CC-03',
        label: 'Caixa 03',
        locationDetails: 'Fachada virada para a Av. Principal',
        status: 'AVAILABLE',
        dispensesCash: true,
        acceptsDeposit: false,
        notes: 'A pagar notas de 200, 500 e 1000 MT',
        lastChecked: 'Hoje às 10:39',
      },
      {
        id: 'atm-cc-04',
        code: 'ATM-CC-04',
        label: 'Caixa 04',
        locationDetails: 'Fachada virada para a Av. Principal',
        status: 'AVAILABLE',
        dispensesCash: true,
        acceptsDeposit: false,
        notes: 'A pagar notas de 500 e 1000 MT',
        lastChecked: 'Hoje às 10:36',
      },
      {
        id: 'atm-cc-05',
        code: 'ATM-CC-05',
        label: 'Caixa 05',
        locationDetails: 'Lateral do edifício comercial',
        status: 'UNAVAILABLE',
        dispensesCash: false,
        acceptsDeposit: false,
        notes: 'Sem notas disponíveis • Aguarda abastecimento',
        lastChecked: 'Hoje às 09:40',
      },
    ],
    lastUpdated: 'Hoje às 10:42',
  },
];

export function getBranchAtmStats(branch: Branch) {
  const total = branch.atms.length;
  const available = branch.atms.filter((atm) => atm.status === 'AVAILABLE').length;
  const unavailable = branch.atms.filter((atm) => atm.status === 'UNAVAILABLE').length;
  const maintenance = branch.atms.filter((atm) => atm.status === 'MAINTENANCE').length;

  return {
    total,
    available,
    unavailable,
    maintenance,
  };
}

export function calculateDashboardMetrics(branches: Branch[]): DashboardMetrics {
  const totalBranches = branches.length;
  const openBranches = branches.filter((b) => b.status === 'OPEN' || b.status === 'PARTIAL').length;

  let totalATMs = 0;
  let availableATMs = 0;
  let unavailableATMs = 0;
  let maintenanceATMs = 0;

  let branchesWithDepositAvailable = 0;
  let branchesWithCustomerServiceAvailable = 0;

  for (const branch of branches) {
    totalATMs += branch.atms.length;
    for (const atm of branch.atms) {
      if (atm.status === 'AVAILABLE') availableATMs++;
      else if (atm.status === 'UNAVAILABLE') unavailableATMs++;
      else if (atm.status === 'MAINTENANCE') maintenanceATMs++;
    }

    if (branch.depositService.status === 'AVAILABLE') {
      branchesWithDepositAvailable++;
    }

    if (branch.customerService.status === 'AVAILABLE') {
      branchesWithCustomerServiceAvailable++;
    }
  }

  return {
    totalBranches,
    openBranches,
    totalATMs,
    availableATMs,
    unavailableATMs,
    maintenanceATMs,
    branchesWithDepositAvailable,
    branchesWithCustomerServiceAvailable,
    lastGlobalUpdate: 'hoje às 10:42',
  };
}
