'use client';

import React from 'react';
import { motion } from 'motion/react';
import { CircleCheck, CircleX, Wrench, CreditCard } from 'lucide-react';
import { AdminATM, ATMAdminStatus } from '@/types/admin';

interface ATMControlProps {
  atm: AdminATM;
  onStatusChange: (atmId: string, newStatus: ATMAdminStatus) => void;
}

const STATUS_CONFIG: Record<
  ATMAdminStatus,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    activeClasses: string;
    iconClasses: string;
  }
> = {
  AVAILABLE: {
    label: 'Disponível',
    icon: CircleCheck,
    activeClasses:
      'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs font-semibold',
    iconClasses: 'text-emerald-600',
  },
  UNAVAILABLE: {
    label: 'Indisponível',
    icon: CircleX,
    activeClasses:
      'bg-rose-50 text-rose-800 border-rose-300 shadow-xs font-semibold',
    iconClasses: 'text-rose-600',
  },
  MAINTENANCE: {
    label: 'Em manutenção',
    icon: Wrench,
    activeClasses:
      'bg-amber-50 text-amber-800 border-amber-300 shadow-xs font-semibold',
    iconClasses: 'text-amber-600',
  },
};

export function ATMControl({ atm, onStatusChange }: ATMControlProps) {
  const currentConfig = STATUS_CONFIG[atm.status];

  return (
    <motion.article
      layout
      className="flex flex-col justify-between rounded-2xl border border-gray-200/80 bg-white p-4.5 sm:p-5 shadow-[0_2px_8px_rgba(15,23,42,0.03)] transition-all hover:border-gray-300/80"
    >
      {/* Topo do Card de ATM: Identificação */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FDF7FA] text-[#D1005D]">
            <CreditCard className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 truncate">
              {atm.label}
            </h3>
            <span className="block font-mono text-[11px] text-gray-400">
              {atm.code}
            </span>
          </div>
        </div>

        {/* Estado actual textual */}
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${currentConfig.activeClasses}`}
        >
          <currentConfig.icon className={`h-3.5 w-3.5 ${currentConfig.iconClasses}`} />
          <span>{currentConfig.label}</span>
        </span>
      </div>

      {/* Controlos de Mudança de Estado: Segmented Selector */}
      <div className="pt-3.5">
        <span className="block text-[11px] font-medium text-gray-500 mb-2">
          Alterar estado do caixa:
        </span>

        <div
          role="group"
          aria-label={`Estado de ${atm.label}`}
          className="grid grid-cols-3 gap-1.5 rounded-xl bg-gray-100/70 p-1 border border-gray-200/60"
        >
          {(['AVAILABLE', 'UNAVAILABLE', 'MAINTENANCE'] as ATMAdminStatus[]).map(
            (statusKey) => {
              const isSelected = atm.status === statusKey;
              const optionConfig = STATUS_CONFIG[statusKey];
              const OptionIcon = optionConfig.icon;

              return (
                <button
                  key={statusKey}
                  type="button"
                  onClick={() => onStatusChange(atm.id, statusKey)}
                  aria-pressed={isSelected}
                  className={`group relative flex min-h-[38px] cursor-pointer items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs transition-all duration-150 outline-none ${
                    isSelected
                      ? 'bg-white text-gray-900 font-semibold shadow-xs border border-gray-200/80'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50 border border-transparent'
                  }`}
                >
                  <OptionIcon
                    className={`h-3.5 w-3.5 shrink-0 transition-colors ${
                      isSelected ? optionConfig.iconClasses : 'text-gray-400 group-hover:text-gray-600'
                    }`}
                  />
                  <span className="truncate">{optionConfig.label}</span>
                </button>
              );
            }
          )}
        </div>
      </div>
    </motion.article>
  );
}
