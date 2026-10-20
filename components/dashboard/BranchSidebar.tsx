'use client';

import React from 'react';
import { Building2 } from 'lucide-react';
import { Branch } from '@/types';

interface BranchSidebarProps {
  branches: Branch[];
  activeBranchId: string;
  onSelectBranch: (id: string) => void;
}

export function BranchSidebar({
  branches,
  activeBranchId,
  onSelectBranch,
}: BranchSidebarProps) {
  return (
    <aside
      aria-label="Selecção de Balcões"
      className="w-full rounded-2xl border border-gray-200/80 bg-white p-3.5 shadow-[0_2px_8px_rgba(15,23,42,0.04),0_1px_2px_rgba(15,23,42,0.03)]"
    >
      <div className="px-3 pt-2 pb-2.5">
        <h2 className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
          Balcões
        </h2>
      </div>

      <nav className="space-y-1.5" aria-label="Lista de Balcões">
        {branches.map((branch) => {
          const isActive = branch.id === activeBranchId;
          const isAvailable = branch.status === 'OPEN';

          return (
            <button
              key={branch.id}
              type="button"
              onClick={() => onSelectBranch(branch.id)}
              className={`group relative flex w-full cursor-pointer items-center justify-between rounded-xl p-3 text-left transition-all duration-150 ${
                isActive
                  ? 'bg-[#FDF7FA] text-gray-900 shadow-xs'
                  : 'text-gray-700 hover:bg-gray-50/80 hover:text-gray-900'
              }`}
            >
              {/* Indicador lateral no estado activo */}
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r-full bg-[#D1005D]"
                />
              )}

              <div className="flex min-w-0 items-center gap-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[#F5E6ED] text-[#D1005D]'
                      : 'bg-gray-100/80 text-gray-400 group-hover:text-gray-600'
                  }`}
                >
                  <Building2 className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <span
                    className={`block truncate text-sm ${
                      isActive ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'
                    }`}
                  >
                    {branch.name}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
