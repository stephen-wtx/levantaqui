import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';

export const metadata: Metadata = {
  title: 'Administração | LEVANTAQUI',
  description:
    'Acesso restrito para gestão operacional e actualização de disponibilidade dos balcões e ATMs LEVANTAQUI.',
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#F9F9F9] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Topo / Navegação discreta */}
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-200/50 hover:text-gray-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Portal público</span>
        </Link>
      </header>

      {/* Conteúdo Principal / Card de Login */}
      <main className="my-auto flex w-full flex-col items-center justify-center py-6">
        <div className="w-full max-w-[420px]">
          {/* Card Central */}
          <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.03)] sm:p-8">
            {/* Header do Card com Logo */}
            <div className="mb-6 flex flex-col items-center text-center sm:mb-7">
              <div className="relative mb-3 h-12 w-48 sm:h-14 sm:w-56">
                <Image
                  src="/imgs/logo.png"
                  alt="LEVANTAQUI"
                  fill
                  priority
                  sizes="(max-width: 640px) 192px, 224px"
                  className="object-contain object-center"
                />
              </div>

              <h1 className="text-base font-semibold tracking-tight text-gray-900 sm:text-lg">
                Administração
              </h1>
              <p className="mt-1 text-xs text-gray-500">
                Acesso restrito para gestão de balcões e ATMs
              </p>
            </div>

            {/* Formulário */}
            <AdminLoginForm />
          </div>
        </div>
      </main>

      {/* Rodapé Institucional Mínimo */}
      <footer className="mx-auto w-full max-w-7xl pt-4 text-center">
        <p className="text-[11px] text-gray-400">
          LEVANTAQUI • Gestão de Balcões e Disponibilidade • Pemba
        </p>
      </footer>
    </div>
  );
}
