'use client';

import React from 'react';
import Image from 'next/image';
import { MapPin } from 'lucide-react';

interface HeaderProps {
  lastUpdated: string;
}

export function Header({ lastUpdated }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5">
        {/* Logo */}
        <div className="relative flex items-center h-12 sm:h-16 md:h-18 w-48 sm:w-64 md:w-72">
          <Image
            src="/imgs/logo.png"
            alt="LEVANTAQUI"
            fill
            priority
            sizes="(max-width: 640px) 192px, (max-width: 768px) 256px, 288px"
            className="object-contain object-left"
          />
        </div>

        {/* Minimal Context */}
        <div className="flex items-center gap-2.5 sm:gap-3 text-xs">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 border border-gray-200/70 px-2.5 sm:px-3 py-1 font-medium text-gray-700">
            <MapPin className="h-3.5 w-3.5 text-[#D1005D]" />
            <span>Pemba</span>
          </div>
        </div>
      </div>
    </header>
  );
}
