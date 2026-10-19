'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LogOut, Building2 } from 'lucide-react';

interface AdminHeaderProps {
  branchName: string;
}

export function AdminHeader({ branchName }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5">
        {/* Logo & Identificação do Balcão */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/admin/login"
            className="relative flex items-center h-10 sm:h-12 w-36 sm:w-44 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D1005D]/20 rounded-lg"
          >
            <Image
              src="/imgs/logo.png"
              alt="LEVANTAQUI"
              fill
              priority
              sizes="(max-width: 640px) 144px, 176px"
              className="object-contain object-left"
            />
          </Link>

          <div className="h-5 w-px bg-gray-200/80 hidden sm:block" />

          {/* Nome do Balcão Actual */}
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-[#D1005D] shrink-0" />
            <div className="min-w-0">
              <span className="block text-xs font-semibold text-gray-900 truncate">
                Balcão {branchName}
              </span>
            </div>
          </div>
        </div>

        {/* Acção de Sair */}
        <div>
          <Link
            href="/admin/login"
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-gray-200/90 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition-all hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D1005D]/20 active:bg-gray-100"
          >
            <LogOut className="h-3.5 w-3.5 text-gray-400" />
            <span className="hidden xs:inline">Sair</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
