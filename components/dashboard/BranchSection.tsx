
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Branch } from '@/types';
import { BranchCard } from './BranchCard';
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
      {/* Mobile Selector Tabs */}
      <div className="mb-4 md:hidden">
        <div className="flex items-center gap-1.5 overflow-x-auto rounded-xl bg-gray-200/60 p-1 scrollbar-none">
          {branches.map((b) => {
            const isActive = b.id === activeBranchId;

            return (
              <button
                key={`tab-${b.id}`}
                type="button"
                onClick={() => setActiveBranchId(b.id)}
                className={`flex min-w-[100px] flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Building2
                  className={`h-3.5 w-3.5 ${
                    isActive ? 'text-[#D1005D]' : 'text-gray-400'
                  }`}
                />
                <span className="truncate">{b.shortName}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile Animated Card View */}
        <AnimatePresence mode="wait">
          {activeBranch && (
            <motion.div
              key={activeBranch.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <BranchCard
                branch={activeBranch}
                isSelected={true}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop / Tablet Grid */}
      <div className="hidden items-stretch gap-5 md:grid md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {branches.map((branch) => (
          <BranchCard
            key={branch.id}
            branch={branch}
            isSelected={branch.id === activeBranchId}
            onSelect={() => setActiveBranchId(branch.id)}
          />
        ))}
      </div>
    </section>
  );
}
