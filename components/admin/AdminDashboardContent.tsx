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
} from '@/types/admin';
import { INITIAL_ADMIN_BRANCHES } from '@/data/mock-admin-data';
import { AdminHeader } from './AdminHeader';
import { ATMList } from './ATMList';
import { ServiceControl } from './ServiceControl';
import { FeedbackMessage } from './FeedbackMessage';

interface AdminDashboardContentProps {
  initialBranchName?: string;
}

const ATM_STATUS_LABELS: Record<ATMAdminStatus, string> = {
  AVAILABLE: 'Disponível',
  UNAVAILABLE: 'Indisponível',
  MAINTENANCE: 'Em manutenção',
};

export function AdminDashboardContent({
  initialBranchName = 'Alto-Gingone',
}: AdminDashboardContentProps) {
  // Selecciona o balcão inicial válido
  const validBranchName = INITIAL_ADMIN_BRANCHES[initialBranchName]
    ? initialBranchName
    : 'Alto-Gingone';

  const [branchState, setBranchState] = useState<BranchAdminState>(() => {
    return JSON.parse(JSON.stringify(INITIAL_ADMIN_BRANCHES[validBranchName]));
  });

  const [notification, setNotification] = useState<FeedbackNotification | null>(
    null
  );
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Se o prop initialBranchName mudar, recarrega o estado inicial daquele balcão
  useEffect(() => {
    if (INITIAL_ADMIN_BRANCHES[validBranchName]) {
      setBranchState(
        JSON.parse(JSON.stringify(INITIAL_ADMIN_BRANCHES[validBranchName]))
      );
    }
  }, [validBranchName]);

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

  // 1. Alteração de Estado do ATM
  const handleATMStatusChange = (atmId: string, newStatus: ATMAdminStatus) => {
    const targetAtm = branchState.atms.find((a) => a.id === atmId);
    if (!targetAtm) return;

    const previousStatus = targetAtm.status;
    if (previousStatus === newStatus) return;

    setBranchState((prev) => ({
      ...prev,
      atms: prev.atms.map((atm) =>
        atm.id === atmId ? { ...atm, status: newStatus } : atm
      ),
    }));

    showNotification(
      'success',
      `Estado do ${targetAtm.label} alterado para ${ATM_STATUS_LABELS[newStatus]}`
    );
  };

  // 2. Alteração de Estado de Depósitos
  const handleDepositStatusChange = (newStatus: ServiceAdminStatus) => {
    setBranchState((prev) => ({
      ...prev,
      depositService: {
        ...prev.depositService,
        status: newStatus,
      },
    }));

    showNotification(
      'success',
      `Serviço de depósitos alterado para ${
        newStatus === 'OPEN' ? 'Aberto' : 'Fechado'
      }`
    );
  };

  // 3. Salvar Configuração de Depósitos
  const handleDepositConfigSave = (updatedConfig: AdminServiceConfig) => {
    setBranchState((prev) => ({
      ...prev,
      depositService: updatedConfig,
    }));

    showNotification('success', 'Horário e dias de depósitos actualizados');
  };

  // 4. Alteração de Estado de Atendimento
  const handleCustomerStatusChange = (newStatus: ServiceAdminStatus) => {
    setBranchState((prev) => ({
      ...prev,
      customerService: {
        ...prev.customerService,
        status: newStatus,
      },
    }));

    showNotification(
      'success',
      `Atendimento presencial alterado para ${
        newStatus === 'OPEN' ? 'Aberto' : 'Fechado'
      }`
    );
  };

  // 5. Salvar Configuração de Atendimento
  const handleCustomerConfigSave = (updatedConfig: AdminServiceConfig) => {
    setBranchState((prev) => ({
      ...prev,
      customerService: updatedConfig,
    }));

    showNotification('success', 'Horário e dias de atendimento actualizados');
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
