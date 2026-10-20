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

interface BranchCardProps {
  branch: Branch;
  isSelected?: boolean;
  onSelect?: () => void;
}

export function BranchCard({
  branch,
  isSelected = false,
  onSelect,
}: BranchCardProps) {
  const stats = getBranchAtmStats(branch);

  const isDepositAvailable =
    branch.depositService.status === 'AVAILABLE';

  const isCustomerServiceAvailable =
    branch.customerService.status === 'AVAILABLE';

  return (
    <article
      onClick={onSelect}
      className={`group relative flex flex-col justify-between rounded-2xl border bg-white p-5 sm:p-6 transition-all duration-200 cursor-pointer ${
        isSelected
          ? 'border-[#D1005D]/35 shadow-[0_4px_16px_rgba(209,0,93,0.06),0_1px_3px_rgba(0,0,0,0.04)] ring-1 ring-[#D1005D]/20'
          : 'border-gray-200/80 shadow-[0_2px_8px_rgba(15,23,42,0.04),0_1px_2px_rgba(15,23,42,0.03)] hover:border-gray-300/90 hover:shadow-[0_6px_16px_rgba(15,23,42,0.06),0_2px_4px_rgba(15,23,42,0.03)]'
      }`}
    >
      <div>
        {/* Header do Balcão */}
        <div className="flex items-start gap-3 border-b border-gray-100/90 pb-4.5 sm:pb-5">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className={`flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
                isSelected
                  ? 'bg-[#FDF2F7] text-[#D1005D] border border-[#FCE7F3]'
                  : 'bg-[#FDF7FA] text-[#D1005D] border border-transparent group-hover:border-[#FCE7F3]/70'
              }`}
            >
              <Building2 className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-semibold tracking-tight text-gray-900 leading-snug">
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
        </div>

        {/* Resumo e Lista de ATMs */}
        <div className="border-b border-gray-100/90 py-4.5 sm:py-5">
          <div className="mb-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-800">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#FDF2F7] text-[#D1005D]">
                <CreditCard className="h-3.5 w-3.5" />
              </div>
              <span>{stats.total} ATMs</span>
            </div>

            <span
              className={`rounded-md px-2.5 py-1 text-[11px] font-medium border ${
                stats.available === 0
                  ? 'bg-[#FDF2F7] text-[#D1005D] border-[#D1005D]/30'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
              }`}
            >
              {stats.available} a pagar
            </span>
          </div>

          {/* ATMs Individuais */}
          <div className="space-y-1.5">
            {branch.atms.map((atm) => {
              const isAvailable = atm.status === 'AVAILABLE';
              const isMaintenance = atm.status === 'MAINTENANCE';

              return (
                <div
                  key={atm.id}
                  className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition-colors bg-gray-50/40 hover:bg-gray-50/90 border border-gray-100/60"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
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

        {/* Serviços: Depósito e Atendimento */}
        <div className="space-y-3 py-4.5 sm:py-5">
          {/* Depósito */}
          <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-100/90 bg-gray-50/60 p-3.5 transition-colors hover:bg-gray-50/90">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FDF2F7] text-[#D1005D]">
                <Banknote className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <span className="block text-xs font-semibold text-gray-800">
                  Depósito
                </span>

                <span className="mt-0.5 flex items-center gap-1.5 text-[11px] text-gray-500">
                  <Clock className="h-3 w-3 shrink-0 text-gray-400" />
                  {branch.depositService.hours.operatingHours}
                </span>
              </div>
            </div>

            <span
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium border ${
                isDepositAvailable
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                  : 'bg-rose-50 text-rose-700 border-rose-200/60'
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
          <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-100/90 bg-gray-50/60 p-3.5 transition-colors hover:bg-gray-50/90">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100/90 text-gray-600">
                <Users className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <span className="block text-xs font-semibold text-gray-800">
                  Atendimento
                </span>

                <span className="mt-0.5 flex items-center gap-1.5 text-[11px] text-gray-500">
                  <Clock className="h-3 w-3 shrink-0 text-gray-400" />
                  {branch.customerService.hours.operatingHours}
                </span>
              </div>
            </div>

            <span
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium border ${
                isCustomerServiceAvailable
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                  : 'bg-rose-50 text-rose-700 border-rose-200/60'
              }`}
            >
              {isCustomerServiceAvailable ? (
                <CheckCircle2 className="h-3 w-3" />
              ) : (
                <XCircle className="h-3 w-3" />
              )}
              {isCustomerServiceAvailable ? 'Disponível' : 'Indisponível'}
            </span>
          </div>
        </div>
      </div>

      {/* Actualização */}
      <div className="flex items-center justify-between border-t border-gray-100/90 pt-3.5 sm:pt-4 text-[11px] text-gray-400">
        <span>Actualização</span>

        <span className="font-medium text-gray-500">
          {branch.lastUpdated}
        </span>
      </div>
    </article>
  );
}
