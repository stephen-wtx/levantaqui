'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { BranchSelector } from './BranchSelector';

export function AdminLoginForm() {
  const router = useRouter();
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [branchError, setBranchError] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedBranch) {
      setBranchError(true);
      return;
    }

    setBranchError(false);
    setIsLoading(true);

    // Simulação visual de transição e navegação para o painel do balcão seleccionado
    setTimeout(() => {
      router.push(
        `/admin/dashboard?branch=${encodeURIComponent(selectedBranch)}`
      );
    }, 450);
  };

  const handleBranchSelect = (branch: string) => {
    setSelectedBranch(branch);
    if (branchError) setBranchError(false);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5 sm:space-y-6">
      {/* 1. Selecção do Balcão */}
      <div>
        <label
          htmlFor="admin-branch-select"
          className="mb-1.5 block text-xs font-semibold text-gray-700"
        >
          Balcão
        </label>
        <BranchSelector
          id="admin-branch-select"
          value={selectedBranch}
          onChange={handleBranchSelect}
          disabled={isLoading}
        />
        {branchError && (
          <p className="mt-1.5 text-xs text-rose-600">
            Por favor, seleccione um balcão para aceder ao painel.
          </p>
        )}
      </div>

      {/* 2. Nome de Utilizador */}
      <div>
        <label
          htmlFor="admin-username"
          className="mb-1.5 block text-xs font-semibold text-gray-700"
        >
          Nome de utilizador
        </label>
        <input
          id="admin-username"
          name="username"
          type="text"
          autoComplete="username"
          spellCheck={false}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Ex: gestor.balcao"
          disabled={isLoading}
          className="h-11 w-full rounded-xl border border-gray-200/90 bg-white px-3.5 text-sm text-gray-900 placeholder:text-gray-400 transition-all duration-150 outline-none hover:border-gray-300/90 focus:border-[#D1005D] focus:ring-2 focus:ring-[#D1005D]/15 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {/* 3. Senha com Eye / EyeOff */}
      <div>
        <label
          htmlFor="admin-password"
          className="mb-1.5 block text-xs font-semibold text-gray-700"
        >
          Senha
        </label>
        <div className="relative">
          <input
            id="admin-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={isLoading}
            className="h-11 w-full rounded-xl border border-gray-200/90 bg-white pl-3.5 pr-11 text-sm text-gray-900 placeholder:text-gray-400 transition-all duration-150 outline-none hover:border-gray-300/90 focus:border-[#D1005D] focus:ring-2 focus:ring-[#D1005D]/15 disabled:opacity-50 disabled:cursor-not-allowed [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
          />

          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={isLoading}
            aria-label={showPassword ? 'Ocultar senha' : 'Visualizar senha'}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-gray-400 transition-colors hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D1005D]/30 disabled:pointer-events-none"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* 4. Botão ENTRAR */}
      <div className="pt-1">
        <button
          type="submit"
          disabled={isLoading}
          className="flex h-11 w-full cursor-pointer items-center justify-center rounded-xl bg-[#D1005D] text-sm font-semibold text-white shadow-xs transition-all duration-150 outline-none hover:bg-[#B80052] active:bg-[#9E0046] active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-[#D1005D] focus-visible:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-white" />
          ) : (
            'ENTRAR'
          )}
        </button>
      </div>
    </form>
  );
}
