'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/dashboard/Header';
import { BranchSection } from '@/components/dashboard/BranchSection';
import { LastUpdate } from '@/components/dashboard/LastUpdate';
import { IntroScreen } from '@/components/intro/IntroScreen';
import { MOCK_BRANCHES } from '@/data/mock-data';
import type { Branch } from '@/types';

export default function HomePage() {
  const [branches, setBranches] = useState<Branch[]>(MOCK_BRANCHES);
  const [lastGlobalUpdate, setLastGlobalUpdate] = useState<string>('hoje às 10:42');
  const [showIntro, setShowIntro] = useState<boolean>(false);

  useEffect(() => {
    // Apresentar a intro animada apenas na primeira visita da sessão
    try {
      const alreadyViewed = sessionStorage.getItem('levantaqui_intro_viewed');
      if (!alreadyViewed) {
        setShowIntro(true);
      }
    } catch {
      // Fallback gracioso se sessionStorage não estiver acessível
    }

    fetch('/api/filiais')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.filiais && Array.isArray(data.filiais)) {
          setBranches(data.filiais);
          if (data.lastGlobalUpdate) {
            setLastGlobalUpdate(data.lastGlobalUpdate);
          }
        }
      })
      .catch((err) => {
        console.error('Erro ao obter dados de balcões:', err);
      });
  }, []);

  const handleIntroComplete = () => {
    try {
      sessionStorage.setItem('levantaqui_intro_viewed', 'true');
    } catch {
      // Ignorar exceções de storage restrito
    }
    setShowIntro(false);
  };

  return (
    <>
      {showIntro && <IntroScreen onComplete={handleIntroComplete} />}
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
    </>
  );
}
