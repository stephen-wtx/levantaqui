'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Building2, ChevronDown, Check } from 'lucide-react';

export const ADMIN_BRANCHES = [
  'Alto-Gingone',
  'Cariacó',
  'Centro da Cidade',
] as const;

export type AdminBranchName = (typeof ADMIN_BRANCHES)[number];

interface BranchSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  id?: string;
}

export function BranchSelector({
  value,
  onChange,
  disabled = false,
  id = 'branch-selector',
}: BranchSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (branch: string) => {
    onChange(branch);
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;

    if (event.key === 'Escape') {
      setIsOpen(false);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        const currentIndex = ADMIN_BRANCHES.indexOf(value as AdminBranchName);
        const nextIndex = (currentIndex + 1) % ADMIN_BRANCHES.length;
        onChange(ADMIN_BRANCHES[nextIndex]);
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        const currentIndex = ADMIN_BRANCHES.indexOf(value as AdminBranchName);
        const prevIndex =
          currentIndex <= 0 ? ADMIN_BRANCHES.length - 1 : currentIndex - 1;
        onChange(ADMIN_BRANCHES[prevIndex]);
      }
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsOpen((prev) => !prev);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Botão de disparo do Selector */}
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Seleccionar balcão"
        className={`group flex h-11 w-full cursor-pointer items-center justify-between rounded-xl border bg-white px-3.5 text-left text-sm transition-all duration-150 outline-none ${
          isOpen
            ? 'border-[#D1005D] ring-2 ring-[#D1005D]/15'
            : 'border-gray-200/90 hover:border-gray-300/90 focus:border-[#D1005D] focus:ring-2 focus:ring-[#D1005D]/15'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <Building2
            className={`h-4 w-4 shrink-0 transition-colors ${
              value ? 'text-[#D1005D]' : 'text-gray-400 group-hover:text-gray-500'
            }`}
          />
          <span
            className={`truncate block ${
              value ? 'font-medium text-gray-900' : 'text-gray-400'
            }`}
          >
            {value || 'Seleccione o balcão'}
          </span>
        </div>

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-gray-600' : 'group-hover:text-gray-500'
          }`}
        />
      </button>

      {/* Menu Dropdown com Motion */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.99 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            role="listbox"
            aria-label="Lista de balcões"
            className="absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-xl border border-gray-200/90 bg-white p-1.5 shadow-[0_4px_16px_rgba(15,23,42,0.08),0_1px_3px_rgba(15,23,42,0.04)]"
          >
            <div className="space-y-0.5">
              {ADMIN_BRANCHES.map((branch) => {
                const isSelected = value === branch;

                return (
                  <button
                    key={branch}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(branch)}
                    className={`flex min-h-[42px] w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors duration-100 ${
                      isSelected
                        ? 'bg-[#FDF7FA] font-medium text-[#D1005D]'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className="truncate">{branch}</span>
                    {isSelected && (
                      <Check className="h-4 w-4 shrink-0 text-[#D1005D]" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
