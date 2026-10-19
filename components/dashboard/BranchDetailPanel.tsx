'use client';

import React from 'react';
import {
  Building2,
  CreditCard,
  Banknote,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Wrench,
  MapPin,
} from 'lucide-react';
import { Branch } from '@/types';
import { getBranchAtmStats } from '@/data/mock-data';

interface BranchDetailPanelProps {
  branch: Branch;
}

export function BranchDetailPanel({ branch }: BranchDetailPanelProps) {
  const stats = getBranchAtmStats(branch);

  const isDepositAvailable =
    branch.depositService.status === 'AVAILABLE';

  const isCustomerServiceAvailable =
    branch.customerService.status === 'AVAILABLE';

  return (
    <article className="flex flex-col justify-between rounded-2xl border border-gray-200/80 bg-white p-6 shadow-[0_2px_8px_rgba(15,23,42,0.04),0_1px_2px_rgba(15,23,42,0.03)]">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-gray-100/80 pb-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FDF7FA] text-[#D1005D]">
              <Building2 className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h2 className="text-lg font-semibold tracking-tight text-gray-900 sm:text-xl">
                {branch.name}
              </h2>

              <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                <span className="truncate">
                  {branch.referenceLocation}
                </span>
              </p>
            </div>
          </div>

          <span
            className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-medium border ${
              branch.status === 'OPEN'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                : 'bg-amber-50 text-amber-700 border-amber-200/60'
            }`}
          >
            {branch.status === 'OPEN' ? 'Disponível' : 'Parcial'}
          </span>
        </div>

        {/* Informações detalhadas: ATMs e Serviços */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-5">
          {/* Coluna 1: ATMs */}
          <div className="flex flex-col">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                <CreditCard className="h-4 w-4 text-[#D1005D]" />
                <span>{stats.total} ATMs</span>
              </div>

              <span className="rounded-md bg-emerald-50/80 px-2 py-1 text-[11px] font-medium text-emerald-700">
                {stats.available} a pagar
              </span>
            </div>

            {/* Lista individual de ATMs */}
            <div className="space-y-1">
              {branch.atms.map((atm) => {
                const isAvailable = atm.status === 'AVAILABLE';
                const isMaintenance = atm.status === 'MAINTENANCE';

                return (
                  <div
                    key={atm.id}
                    className="flex items-center justify-between gap-3 rounded-lg px-2.5 py-2 transition-colors hover:bg-gray-50/80"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="shrink-0 font-mono text-[11px] font-medium text-gray-400">
                        {atm.code}
                      </span>

                      <span className="truncate text-xs font-medium text-gray-700">
                        {atm.label}
                      </span>
                    </div>

                    {isAvailable && (
                      <span className="inline-flex shrink-0 items-center gap-1.5 text-[11px] font-medium text-emerald-700">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        Disponível
                      </span>
                    )}

                    {atm.status === 'UNAVAILABLE' && (
                      <span className="inline-flex shrink-0 items-center gap-1.5 text-[11px] font-medium text-rose-700">
                        <XCircle className="h-3.5 w-3.5 text-rose-500" />
                        Indisponível
                      </span>
                    )}

                    {isMaintenance && (
                      <span className="inline-flex shrink-0 items-center gap-1.5 text-[11px] font-medium text-amber-700">
                        <Wrench className="h-3.5 w-3.5 text-amber-600" />
                        Em manutenção
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Coluna 2: Serviços */}
          <div className="space-y-3">
            {/* Depósito */}
            <div className="flex items-center justify-between gap-3 rounded-xl bg-gray-50/70 p-3.5">
              <div className="flex min-w-0 items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FDF2F7] text-[#D1005D]">
                  <Banknote className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <span className="block text-xs font-semibold text-gray-800">
                    Depósito
                  </span>

                  <span className="mt-1 flex items-center gap-1 text-[11px] text-gray-500">
                    <Clock className="h-3 w-3 shrink-0 text-gray-400" />
                    {branch.depositService.hours.operatingHours}
                  </span>
                </div>
              </div>

              <span
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium ${
                  isDepositAvailable
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-rose-50 text-rose-700'
                }`}
              >
                {isDepositAvailable ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : (
                  <XCircle className="h-3 w-3" />
                )}

                {isDepositAvailable ? 'Disponível' : 'Indisponível'}
              </span>
            </div>

            {/* Atendimento presencial */}
            <div className="flex items-center justify-between gap-3 rounded-xl bg-gray-50/70 p-3.5">
              <div className="flex min-w-0 items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100/80 text-gray-600">
                  <Users className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <span className="block text-xs font-semibold text-gray-800">
                    Atendimento
                  </span>

                  <span className="mt-1 flex items-center gap-1 text-[11px] text-gray-500">
                    <Clock className="h-3 w-3 shrink-0 text-gray-400" />
                    {branch.customerService.hours.operatingHours}
                  </span>
                </div>
              </div>

              <span
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium ${
                  isCustomerServiceAvailable
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-rose-50 text-rose-700'
                }`}
              >
                {isCustomerServiceAvailable ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : (
                  <XCircle className="h-3 w-3" />
                )}

                {isCustomerServiceAvailable
                  ? 'Disponível'
                  : 'Indisponível'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actualização */}
      <div className="flex items-center justify-between border-t border-gray-100/80 pt-3 text-[11px] text-gray-400">
        <span>Actualização</span>

        <span className="font-medium text-gray-500">
          {branch.lastUpdated}
        </span>
      </div>
    </article>
  );
}
