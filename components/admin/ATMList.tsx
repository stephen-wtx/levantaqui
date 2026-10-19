'use client';

import React from 'react';
import { CreditCard } from 'lucide-react';
import { AdminATM, ATMAdminStatus } from '@/types/admin';
import { ATMControl } from './ATMControl';

interface ATMListProps {
  atms: AdminATM[];
  onStatusChange: (atmId: string, newStatus: ATMAdminStatus) => void;
}

export function ATMList({ atms, onStatusChange }: ATMListProps) {
  const availableCount = atms.filter((a) => a.status === 'AVAILABLE').length;

  return (
    <section aria-labelledby="atms-section-heading" className="w-full">
      {/* Cabeçalho da Secção com Sumário Directo */}
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FDF2F7] text-[#D1005D]">
            <CreditCard className="h-4 w-4" />
          </div>
          <h2
            id="atms-section-heading"
            className="text-base font-semibold text-gray-900 tracking-tight"
          >
            Caixas Automáticos (ATMs)
          </h2>
        </div>

        <span className="text-xs text-gray-500 font-medium">
          {availableCount} de {atms.length} {atms.length === 1 ? 'caixa disponível' : 'caixas disponíveis'}
        </span>
      </div>

      {/* Grid de ATMs Responsivo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {atms.map((atm) => (
          <ATMControl
            key={atm.id}
            atm={atm}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>
    </section>
  );
}
