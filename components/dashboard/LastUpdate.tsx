'use client';

import React from 'react';

interface LastUpdateProps {
  lastUpdated: string;
}

export function LastUpdate({ lastUpdated }: LastUpdateProps) {
  return (
    <footer className="w-full mt-auto py-8 text-center text-xs text-gray-400 border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span className="font-semibold text-gray-500">LEVANTAQUI</span>
        <span>Última actualização da rede: {lastUpdated}</span>
      </div>
    </footer>
  );
}
