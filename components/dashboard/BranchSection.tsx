'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Branch } from '@/types';
import { BranchCard } from './BranchCard';
import { BranchSidebar } from './BranchSidebar';
import { BranchDetailPanel } from './BranchDetailPanel';
import { Building2 } from 'lucide-react';

interface BranchSectionProps {
  branches: Branch[];
}

export function BranchSection({ branches }: BranchSectionProps) {
  const [activeBranchId, setActiveBranchId] = useState<string>(
    branches[0]?.id || ''
  );

  const activeBranch =
    branches.find((b) => b.id === activeBranchId) || branches[0];

  return (
    <section
      aria-label="Disponibilidade dos Balcões"
      className="w-full"
    >
      {/* ================================================== */}
      {/* 1. MOBILE (< 768px): Tabs Selector + Card Animado  */}
      {/* ================================================== */}
      <div className="md:hidden">
        {/* Selector Tabs com touch targets optimizados */}
        <div className="mb-5 flex items-center gap-1.5 rounded-2xl bg-gray-200/50 p-1.5 border border-gray-200/60 shadow-xs">
          {branches.map((b) => {
            const isActive = b.id === activeBranchId;

            return (
              <button
                key={`tab-${b.id}`}
                type="button"
                onClick={() => setActiveBranchId(b.id)}
                className={`relative flex min-h-[42px] flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl px-2.5 py-2 text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/40'
                }`}
              >
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[#FDF2F7] text-[#D1005D]'
                      : 'text-gray-400'
                  }`}
                >
                  <Building2 className="h-3.5 w-3.5" />
                </div>
                <span className="truncate">{b.shortName}</span>
              </button>
            );
          })}
        </div>

        {/* Card Animado do Balcão Seleccionado */}
        <AnimatePresence mode="wait">
          {activeBranch && (
            <motion.div
              key={activeBranch.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              <BranchCard
                branch={activeBranch}
                isSelected={true}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ================================================== */}
      {/* 2. TABLET (768px - 1279px): Grid Equilibrado       */}
      {/* ================================================== */}
      <div className="hidden md:grid xl:hidden md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7 items-stretch">
        {branches.map((branch, index) => (
          <div
            key={branch.id}
            className={`flex flex-col ${
              index === 2
                ? 'md:max-lg:col-span-2 md:max-lg:max-w-md md:max-lg:mx-auto md:max-lg:w-full'
                : ''
            }`}
          >
            <BranchCard
              branch={branch}
              isSelected={branch.id === activeBranchId}
              onSelect={() => setActiveBranchId(branch.id)}
            />
          </div>
        ))}
      </div>

      {/* ================================================== */}
      {/* 3. DESKTOP (1280px+): Sidebar + Painel de Detalhes */}
      {/* ================================================== */}
      <div className="hidden xl:grid xl:grid-cols-12 xl:gap-8 items-start">
        {/* Sidebar Lateral Esquerda */}
        <div className="xl:col-span-4 sticky top-24">
          <BranchSidebar
            branches={branches}
            activeBranchId={activeBranchId}
            onSelectBranch={setActiveBranchId}
          />
        </div>

        {/* Painel de Conteúdo à Direita com Transição Subtil */}
        <div className="xl:col-span-8 min-w-0">
          <AnimatePresence mode="wait">
            {activeBranch && (
              <motion.div
                key={activeBranch.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                <BranchDetailPanel branch={activeBranch} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
