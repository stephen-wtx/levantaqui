'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Banknote,
  Users,
  MapPin,
  Clock,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import {
  BranchAdminState,
  ATMAdminStatus,
  ServiceAdminStatus,
  AdminServiceConfig,
  FeedbackNotification,
  OperatingDay,
} from '@/types/admin';
import { INITIAL_ADMIN_BRANCHES } from '@/data/mock-admin-data';
import { AdminHeader } from './AdminHeader';
import { ATMList } from './ATMList';
import { ServiceControl } from './ServiceControl';
import { FeedbackMessage } from './FeedbackMessage';
import type { SafeUser } from '@/app/lib/auth';

interface AdminDashboardContentProps {
  initialBranchName?: string;
  authenticatedUser?: SafeUser;
}

const ATM_STATUS_LABELS: Record<ATMAdminStatus, string> = {
  AVAILABLE: 'Disponível',
  UNAVAILABLE: 'Indisponível',
  MAINTENANCE: 'Em manutenção',
};

const DIA_SEMANA_MAP: Record<
  OperatingDay,
  'SEGUNDA' | 'TERCA' | 'QUARTA' | 'QUINTA' | 'SEXTA' | 'SABADO'
> = {
  Segunda: 'SEGUNDA',
  Terça: 'TERCA',
  Quarta: 'QUARTA',
  Quinta: 'QUINTA',
  Sexta: 'SEXTA',
  Sábado: 'SABADO',
};

const DIA_SEMANA_REVERSE: Record<string, OperatingDay> = {
  SEGUNDA: 'Segunda',
  TERCA: 'Terça',
  QUARTA: 'Quarta',
  QUINTA: 'Quinta',
  SEXTA: 'Sexta',
  SABADO: 'Sábado',
};

export function AdminDashboardContent({
  initialBranchName = 'Alto-Gingone',
  authenticatedUser,
}: AdminDashboardContentProps) {
  const [currentUser, setCurrentUser] = useState<SafeUser | null>(
    authenticatedUser || null
  );

  // Consulta /api/auth/me para sincronizar dados do utilizador e da filial autenticada
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  // Determina o balcão efectivo com base na autenticação do backend
  const activeBranchName = currentUser?.filial.nome || initialBranchName;
  const validBranchName = INITIAL_ADMIN_BRANCHES[activeBranchName]
    ? activeBranchName
    : 'Alto-Gingone';

  const [branchState, setBranchState] = useState<BranchAdminState>(() => {
    return JSON.parse(JSON.stringify(INITIAL_ADMIN_BRANCHES[validBranchName]));
  });

  const [notification, setNotification] = useState<FeedbackNotification | null>(
    null
  );
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sincroniza dados reais da base de dados para o balcão autenticado
  useEffect(() => {
    const targetBranch = currentUser?.filial.nome || validBranchName;
    if (!targetBranch) return;

    fetch(`/api/filiais/${encodeURIComponent(targetBranch)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.filial) {
          const f = data.filial;
          const depDb = f.servicos?.find((s: any) => s.tipo === 'DEPOSITOS');
          const custDb = f.servicos?.find((s: any) => s.tipo === 'ATENDIMENTO');

          const now = new Date();
          const lastUpdatedStr = `Hoje às ${String(now.getHours()).padStart(2, '0')}:${String(
            now.getMinutes()
          ).padStart(2, '0')}`;

          setBranchState({
            branchId: f.id,
            branchName: f.nome,
            referenceLocation: f.referenceLocation,
            atms: f.atms.map((a: any) => ({
              id: a.id,
              code: a.code,
              label: a.label,
              locationDetails: a.locationDetails || undefined,
              status:
                a.estado === 'DISPONIVEL'
                  ? 'AVAILABLE'
                  : a.estado === 'INDISPONIVEL'
                  ? 'UNAVAILABLE'
                  : 'MAINTENANCE',
            })),
            depositService: {
              id: depDb?.id,
              status: depDb?.estado === 'ABERTO' ? 'OPEN' : 'CLOSED',
              days:
                depDb?.horarios
                  ?.map((h: any) => DIA_SEMANA_REVERSE[h.diaSemana])
                  .filter(Boolean) || [
                  'Segunda',
                  'Terça',
                  'Quarta',
                  'Quinta',
                  'Sexta',
                ],
              openingTime: depDb?.horarios?.[0]?.horaAbertura || '08:00',
              closingTime: depDb?.horarios?.[0]?.horaFecho || '15:30',
            },
            customerService: {
              id: custDb?.id,
              status: custDb?.estado === 'ABERTO' ? 'OPEN' : 'CLOSED',
              days:
                custDb?.horarios
                  ?.map((h: any) => DIA_SEMANA_REVERSE[h.diaSemana])
                  .filter(Boolean) || [
                  'Segunda',
                  'Terça',
                  'Quarta',
                  'Quinta',
                  'Sexta',
                ],
              openingTime: custDb?.horarios?.[0]?.horaAbertura || '08:00',
              closingTime: custDb?.horarios?.[0]?.horaFecho || '15:30',
            },
            lastUpdated: lastUpdatedStr,
          });
        }
      })
      .catch((err) => {
        console.error('Erro ao sincronizar filial com PostgreSQL:', err);
      });
  }, [currentUser, validBranchName]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setNotification({
      id: Date.now().toString(),
      type,
      message,
    });
    timerRef.current = setTimeout(() => {
      setNotification(null);
    }, 2800);
  };

  // 1. Alteração de Estado do ATM ligada à BD (PATCH /api/admin/atms/[id])
  const handleATMStatusChange = async (atmId: string, newStatus: ATMAdminStatus) => {
    const targetAtm = branchState.atms.find((a) => a.id === atmId);
    if (!targetAtm) return;

    const previousStatus = targetAtm.status;
    if (previousStatus === newStatus) return;

    // Actualização optimista na UI
    setBranchState((prev) => ({
      ...prev,
      atms: prev.atms.map((atm) =>
        atm.id === atmId ? { ...atm, status: newStatus } : atm
      ),
    }));

    const prismaEstado =
      newStatus === 'AVAILABLE'
        ? 'DISPONIVEL'
        : newStatus === 'UNAVAILABLE'
        ? 'INDISPONIVEL'
        : 'MANUTENCAO';

    try {
      const res = await fetch(`/api/admin/atms/${atmId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: prismaEstado }),
      });

      if (!res.ok) {
        setBranchState((prev) => ({
          ...prev,
          atms: prev.atms.map((atm) =>
            atm.id === atmId ? { ...atm, status: previousStatus } : atm
          ),
        }));
        const err = await res.json().catch(() => ({}));
        showNotification('error', err.error || 'Não foi possível actualizar o ATM.');
        return;
      }

      const now = new Date();
      const currentTimestampStr = `Hoje às ${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes()
      ).padStart(2, '0')}`;

      setBranchState((prev) => ({
        ...prev,
        lastUpdated: currentTimestampStr,
      }));

      showNotification(
        'success',
        `Estado do ${targetAtm.label} alterado para ${ATM_STATUS_LABELS[newStatus]}`
      );
    } catch {
      setBranchState((prev) => ({
        ...prev,
        atms: prev.atms.map((atm) =>
          atm.id === atmId ? { ...atm, status: previousStatus } : atm
        ),
      }));
      showNotification('error', 'Erro ao comunicar com o servidor.');
    }
  };

  // 2. Alteração de Estado de Depósitos (PATCH /api/admin/servicos/[id])
  const handleDepositStatusChange = async (newStatus: ServiceAdminStatus) => {
    const serviceId = branchState.depositService.id;
    const previousStatus = branchState.depositService.status;
    if (previousStatus === newStatus) return;

    setBranchState((prev) => ({
      ...prev,
      depositService: {
        ...prev.depositService,
        status: newStatus,
      },
    }));

    if (!serviceId) {
      showNotification(
        'success',
        `Serviço de depósitos alterado para ${
          newStatus === 'OPEN' ? 'Aberto' : 'Fechado'
        }`
      );
      return;
    }

    try {
      const res = await fetch(`/api/admin/servicos/${serviceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estado: newStatus === 'OPEN' ? 'ABERTO' : 'FECHADO',
        }),
      });

      if (!res.ok) {
        setBranchState((prev) => ({
          ...prev,
          depositService: {
            ...prev.depositService,
            status: previousStatus,
          },
        }));
        const err = await res.json().catch(() => ({}));
        showNotification('error', err.error || 'Não foi possível actualizar o serviço.');
        return;
      }

        const now = new Date();
        const currentTimestampStr = `Hoje às ${String(now.getHours()).padStart(2, '0')}:${String(
          now.getMinutes()
        ).padStart(2, '0')}`;
        setBranchState((prev) => ({
          ...prev,
          lastUpdated: currentTimestampStr,
        }));

        showNotification(
          'success',
          `Serviço de depósitos alterado para ${
            newStatus === 'OPEN' ? 'Aberto' : 'Fechado'
          }`
        );
      } catch {
        setBranchState((prev) => ({
          ...prev,
          depositService: {
            ...prev.depositService,
            status: previousStatus,
          },
        }));
        showNotification('error', 'Erro ao comunicar com o servidor.');
      }
    };

    // 3. Salvar Configuração e Horários de Depósitos (PATCH /api/admin/servicos/[id]/horarios)
    const handleDepositConfigSave = async (updatedConfig: AdminServiceConfig) => {
      const serviceId = branchState.depositService.id;
      const previousConfig = branchState.depositService;

      setBranchState((prev) => ({
        ...prev,
        depositService: updatedConfig,
      }));

      if (!serviceId) {
        showNotification('success', 'Horário e dias de depósitos actualizados');
        return;
      }

      const payload = {
        horarios: updatedConfig.days.map((day) => ({
          diaSemana: DIA_SEMANA_MAP[day],
          horaAbertura: updatedConfig.openingTime,
          horaFecho: updatedConfig.closingTime,
        })),
      };

      try {
        const res = await fetch(`/api/admin/servicos/${serviceId}/horarios`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          setBranchState((prev) => ({
            ...prev,
            depositService: previousConfig,
          }));
          const err = await res.json().catch(() => ({}));
          showNotification('error', err.error || 'Não foi possível actualizar horários.');
          return;
        }

        const now = new Date();
        const currentTimestampStr = `Hoje às ${String(now.getHours()).padStart(2, '0')}:${String(
          now.getMinutes()
        ).padStart(2, '0')}`;
        setBranchState((prev) => ({
          ...prev,
          lastUpdated: currentTimestampStr,
        }));

        showNotification('success', 'Horário e dias de depósitos actualizados');
      } catch {
        setBranchState((prev) => ({
          ...prev,
          depositService: previousConfig,
        }));
        showNotification('error', 'Erro ao comunicar com o servidor.');
      }
    };

    // 4. Alteração de Estado de Atendimento (PATCH /api/admin/servicos/[id])
    const handleCustomerStatusChange = async (newStatus: ServiceAdminStatus) => {
      const serviceId = branchState.customerService.id;
      const previousStatus = branchState.customerService.status;
      if (previousStatus === newStatus) return;

      setBranchState((prev) => ({
        ...prev,
        customerService: {
          ...prev.customerService,
          status: newStatus,
        },
      }));

      if (!serviceId) {
        showNotification(
          'success',
          `Atendimento presencial alterado para ${
            newStatus === 'OPEN' ? 'Aberto' : 'Fechado'
          }`
        );
        return;
      }

      try {
        const res = await fetch(`/api/admin/servicos/${serviceId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            estado: newStatus === 'OPEN' ? 'ABERTO' : 'FECHADO',
          }),
        });

        if (!res.ok) {
          setBranchState((prev) => ({
            ...prev,
            customerService: {
              ...prev.customerService,
              status: previousStatus,
            },
          }));
          const err = await res.json().catch(() => ({}));
          showNotification('error', err.error || 'Não foi possível actualizar o serviço.');
          return;
        }

        const now = new Date();
        const currentTimestampStr = `Hoje às ${String(now.getHours()).padStart(2, '0')}:${String(
          now.getMinutes()
        ).padStart(2, '0')}`;
        setBranchState((prev) => ({
          ...prev,
          lastUpdated: currentTimestampStr,
        }));

        showNotification(
          'success',
          `Atendimento presencial alterado para ${
            newStatus === 'OPEN' ? 'Aberto' : 'Fechado'
          }`
        );
      } catch {
        setBranchState((prev) => ({
          ...prev,
          customerService: {
            ...prev.customerService,
            status: previousStatus,
          },
        }));
        showNotification('error', 'Erro ao comunicar com o servidor.');
      }
    };

    // 5. Salvar Configuração e Horários de Atendimento (PATCH /api/admin/servicos/[id]/horarios)
    const handleCustomerConfigSave = async (updatedConfig: AdminServiceConfig) => {
      const serviceId = branchState.customerService.id;
      const previousConfig = branchState.customerService;

      setBranchState((prev) => ({
        ...prev,
        customerService: updatedConfig,
      }));

      if (!serviceId) {
        showNotification('success', 'Horário e dias de atendimento actualizados');
        return;
      }

      const payload = {
        horarios: updatedConfig.days.map((day) => ({
          diaSemana: DIA_SEMANA_MAP[day],
          horaAbertura: updatedConfig.openingTime,
          horaFecho: updatedConfig.closingTime,
        })),
      };

      try {
        const res = await fetch(`/api/admin/servicos/${serviceId}/horarios`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          setBranchState((prev) => ({
            ...prev,
            customerService: previousConfig,
          }));
          const err = await res.json().catch(() => ({}));
          showNotification('error', err.error || 'Não foi possível actualizar horários.');
          return;
        }

        const now = new Date();
        const currentTimestampStr = `Hoje às ${String(now.getHours()).padStart(2, '0')}:${String(
          now.getMinutes()
        ).padStart(2, '0')}`;
        setBranchState((prev) => ({
          ...prev,
          lastUpdated: currentTimestampStr,
        }));

        showNotification('success', 'Horário e dias de atendimento actualizados');
      } catch {
        setBranchState((prev) => ({
          ...prev,
          customerService: previousConfig,
        }));
        showNotification('error', 'Erro ao comunicar com o servidor.');
      }
    };

  // Simulação de Erro para demonstração visual das regras
  const handleSimulateError = () => {
    showNotification('error', 'Não foi possível actualizar o estado do serviço.');
  };

  const totalAtms = branchState.atms.length;
  const availableAtms = branchState.atms.filter(
    (a) => a.status === 'AVAILABLE'
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F9] text-gray-900">
      {/* Header Institucional */}
      <AdminHeader branchName={branchState.branchName} />

      {/* Conteúdo Principal */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Banner Informativo do Balcão */}
        <section
          aria-label="Informações do Balcão Seleccionado"
          className="rounded-2xl border border-gray-200/80 bg-white p-5 sm:p-6 shadow-[0_2px_8px_rgba(15,23,42,0.03)]"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
                  {branchState.branchName}
                </h1>
              </div>

              <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-[#D1005D]" />
                <span>{branchState.referenceLocation}</span>
                <span className="text-gray-300">•</span>
                <span>Pemba, Moçambique</span>
              </p>
            </div>

            {/* Sumário Rápido das Operações */}
            <div className="flex flex-wrap items-center gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
              <div className="rounded-xl border border-gray-200/80 bg-gray-50/70 px-3 py-2 text-xs">
                <span className="block text-[11px] text-gray-500 font-medium">
                  ATMs a pagar
                </span>
                <span className="font-semibold text-gray-900">
                  {availableAtms} de {totalAtms} disponíveis
                </span>
              </div>

              <div className="rounded-xl border border-gray-200/80 bg-gray-50/70 px-3 py-2 text-xs">
                <span className="block text-[11px] text-gray-500 font-medium">
                  Depósitos
                </span>
                <span
                  className={`font-semibold ${
                    branchState.depositService.status === 'OPEN'
                      ? 'text-emerald-700'
                      : 'text-rose-700'
                  }`}
                >
                  {branchState.depositService.status === 'OPEN'
                    ? 'Aberto'
                    : 'Fechado'}
                </span>
              </div>

              <div className="rounded-xl border border-gray-200/80 bg-gray-50/70 px-3 py-2 text-xs">
                <span className="block text-[11px] text-gray-500 font-medium">
                  Atendimento
                </span>
                <span
                  className={`font-semibold ${
                    branchState.customerService.status === 'OPEN'
                      ? 'text-emerald-700'
                      : 'text-rose-700'
                  }`}
                >
                  {branchState.customerService.status === 'OPEN'
                    ? 'Aberto'
                    : 'Fechado'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 1. Secção Principal: Caixas Automáticos (ATMs) */}
        <ATMList
          atms={branchState.atms}
          onStatusChange={handleATMStatusChange}
        />

        {/* 2. Secções Secundárias: Serviços (Depósitos e Atendimento) */}
        <section aria-labelledby="services-heading" className="w-full">
          <div className="mb-4">
            <h2
              id="services-heading"
              className="text-base font-semibold text-gray-900 tracking-tight"
            >
              Serviços e Horários
            </h2>
            <p className="text-xs text-gray-500">
              Configuração independente do estado, dias e horários de funcionamento do balcão
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Depósitos */}
            <ServiceControl
              title="Depósitos"
              subtitle="Depósitos em numerário e cheque ao balcão"
              icon={Banknote}
              config={branchState.depositService}
              onStatusChange={handleDepositStatusChange}
              onConfigSave={handleDepositConfigSave}
            />

            {/* Atendimento Presencial */}
            <ServiceControl
              title="Atendimento Presencial"
              subtitle="Abertura de contas, cartões e operações de caixa"
              icon={Users}
              config={branchState.customerService}
              onStatusChange={handleCustomerStatusChange}
              onConfigSave={handleCustomerConfigSave}
            />
          </div>
        </section>

        {/* Teste discreto de feedback de erro */}
        <div className="pt-2 text-right">
          <button
            type="button"
            onClick={handleSimulateError}
            className="text-[11px] text-gray-400 hover:text-gray-600 underline cursor-pointer"
          >
            Simular feedback de erro
          </button>
        </div>
      </main>

      {/* Rodapé Mínimo */}
      <footer className="border-t border-gray-200/80 bg-white py-4 mt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-[11px] text-gray-400">
          LEVANTAQUI • Sistema de Gestão Operacional de Balcões e ATMs • Pemba
        </div>
      </footer>

      {/* Mensagem Toast de Feedback (Sucesso / Erro) */}
      <FeedbackMessage
        notification={notification}
        onDismiss={() => setNotification(null)}
      />
    </div>
  );
}
