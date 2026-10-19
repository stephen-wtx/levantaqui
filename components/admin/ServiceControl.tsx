'use client';

import React, { useState } from 'react';
import { Clock, Check } from 'lucide-react';
import {
  AdminServiceConfig,
  OperatingDay,
  ALL_OPERATING_DAYS,
  ServiceAdminStatus,
} from '@/types/admin';

interface ServiceControlProps {
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  config: AdminServiceConfig;
  onStatusChange: (newStatus: ServiceAdminStatus) => void;
  onConfigSave: (updatedConfig: AdminServiceConfig) => void;
}

export function ServiceControl({
  title,
  subtitle,
  icon: Icon,
  config,
  onStatusChange,
  onConfigSave,
}: ServiceControlProps) {
  const [selectedDays, setSelectedDays] = useState<OperatingDay[]>(config.days);
  const [openingTime, setOpeningTime] = useState<string>(config.openingTime);
  const [closingTime, setClosingTime] = useState<string>(config.closingTime);

  const toggleDay = (day: OperatingDay) => {
    let newDays: OperatingDay[];
    if (selectedDays.includes(day)) {
      // Impede remover todos os dias
      if (selectedDays.length === 1) return;
      newDays = selectedDays.filter((d) => d !== day);
    } else {
      newDays = [...selectedDays, day];
    }
    setSelectedDays(newDays);
    onConfigSave({
      ...config,
      days: newDays,
      openingTime,
      closingTime,
    });
  };

  const handleHoursSave = () => {
    onConfigSave({
      ...config,
      days: selectedDays,
      openingTime,
      closingTime,
    });
  };

  const isOpen = config.status === 'OPEN';

  return (
    <article className="flex flex-col justify-between rounded-2xl border border-gray-200/80 bg-white p-5 sm:p-6 shadow-[0_2px_8px_rgba(15,23,42,0.03)] transition-all hover:border-gray-300/80">
      <div>
        {/* Cabeçalho do Serviço */}
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FDF2F7] text-[#D1005D]">
              <Icon className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h3 className="text-base font-semibold text-gray-900 tracking-tight">
                {title}
              </h3>
              <p className="text-xs text-gray-500 truncate">
                {subtitle}
              </p>
            </div>
          </div>

          {/* Estado Actual */}
          <span
            className={`inline-flex shrink-0 items-center rounded-lg border px-2.5 py-1 text-xs font-semibold ${
              isOpen
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-rose-50 text-rose-800 border-rose-300'
            }`}
          >
            {isOpen ? 'Aberto' : 'Fechado'}
          </span>
        </div>

        {/* 1. Controlo de Estado Aberto / Fechado */}
        <div className="pt-4">
          <label className="block text-xs font-semibold text-gray-700 mb-2">
            Estado do serviço
          </label>

          <div
            role="group"
            aria-label={`Estado de ${title}`}
            className="grid grid-cols-2 gap-1.5 rounded-xl bg-gray-100/70 p-1 border border-gray-200/60"
          >
            <button
              type="button"
              onClick={() => onStatusChange('OPEN')}
              aria-pressed={isOpen}
              className={`flex min-h-[38px] cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-150 ${
                isOpen
                  ? 'bg-white text-emerald-800 shadow-xs border border-gray-200/80'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50 border border-transparent'
              }`}
            >
              <span>Aberto</span>
            </button>

            <button
              type="button"
              onClick={() => onStatusChange('CLOSED')}
              aria-pressed={!isOpen}
              className={`flex min-h-[38px] cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-150 ${
                !isOpen
                  ? 'bg-white text-rose-800 shadow-xs border border-gray-200/80'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50 border border-transparent'
              }`}
            >
              <span>Fechado</span>
            </button>
          </div>
        </div>

        {/* 2. Dias de Funcionamento (Segunda a Sábado - sem Domingo) */}
        <div className="pt-5">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-gray-700">
              Dias de funcionamento
            </label>
            <span className="text-[11px] text-gray-400">Segunda a Sábado</span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
            {ALL_OPERATING_DAYS.map((day) => {
              const isSelected = selectedDays.includes(day);

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  aria-pressed={isSelected}
                  className={`flex min-h-[38px] cursor-pointer items-center justify-center rounded-xl border px-2 py-1.5 text-xs transition-all duration-150 ${
                    isSelected
                      ? 'border-[#FCE7F3] bg-[#FDF2F7] font-semibold text-[#D1005D]'
                      : 'border-gray-200/80 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-900'
                  }`}
                >
                  <span className="truncate">{day}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Horário: Abertura e Fecho */}
        <div className="pt-5">
          <div className="flex items-center gap-1.5 mb-2">
            <Clock className="h-3.5 w-3.5 text-gray-400" />
            <label className="block text-xs font-semibold text-gray-700">
              Horário de funcionamento
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="block text-[11px] text-gray-500 mb-1">
                Abertura
              </span>
              <input
                type="time"
                value={openingTime}
                onChange={(e) => {
                  setOpeningTime(e.target.value);
                  onConfigSave({
                    ...config,
                    days: selectedDays,
                    openingTime: e.target.value,
                    closingTime,
                  });
                }}
                className="h-10 w-full rounded-xl border border-gray-200/90 bg-white px-3 text-xs font-medium text-gray-900 transition-colors hover:border-gray-300/90 focus:border-[#D1005D] focus:ring-2 focus:ring-[#D1005D]/15 focus:outline-none"
              />
            </div>

            <div>
              <span className="block text-[11px] text-gray-500 mb-1">
                Fecho
              </span>
              <input
                type="time"
                value={closingTime}
                onChange={(e) => {
                  setClosingTime(e.target.value);
                  onConfigSave({
                    ...config,
                    days: selectedDays,
                    openingTime,
                    closingTime: e.target.value,
                  });
                }}
                className="h-10 w-full rounded-xl border border-gray-200/90 bg-white px-3 text-xs font-medium text-gray-900 transition-colors hover:border-gray-300/90 focus:border-[#D1005D] focus:ring-2 focus:ring-[#D1005D]/15 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Botão de Guardar Alterações com Confirmação */}
      <div className="pt-5 mt-5 border-t border-gray-100 flex items-center justify-between">
        <span className="text-[11px] text-gray-400">
          {selectedDays.length} {selectedDays.length === 1 ? 'dia activo' : 'dias activos'} • {openingTime} — {closingTime}
        </span>

        <button
          type="button"
          onClick={handleHoursSave}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-gray-900 px-3.5 py-1.5 text-xs font-semibold text-white transition-all hover:bg-gray-800 active:bg-black active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20 shadow-xs"
        >
          <Check className="h-3.5 w-3.5" />
          <span>Guardar horário</span>
        </button>
      </div>
    </article>
  );
}
