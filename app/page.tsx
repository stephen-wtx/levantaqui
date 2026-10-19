'use client';

import React from 'react';
import { Header } from '@/components/dashboard/Header';
import { BranchSection } from '@/components/dashboard/BranchSection';
import { LastUpdate } from '@/components/dashboard/LastUpdate';
import { MOCK_BRANCHES } from '@/data/mock-data';

export default function HomePage() {
  const branches = MOCK_BRANCHES;
  const lastGlobalUpdate = 'hoje às 10:42';

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F9] text-gray-900">
      {/* 1. Header (Logo + contexto mínimo) */}
      <Header lastUpdated={lastGlobalUpdate} />

      {/* 2. Conteúdo Principal: Balcões como unidade central */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <BranchSection branches={branches} />
      </main>

      {/* 3. Rodapé discreto */}
      <LastUpdate lastUpdated={lastGlobalUpdate} />
    </div>
  );
}
