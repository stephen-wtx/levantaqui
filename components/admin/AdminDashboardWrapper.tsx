'use client';

import React from 'react';
import type { SafeUser } from '@/app/lib/auth';
import { AdminDashboardContent } from './AdminDashboardContent';

interface AdminDashboardWrapperProps {
  authenticatedUser?: SafeUser;
}

export function AdminDashboardWrapper({
  authenticatedUser,
}: AdminDashboardWrapperProps) {
  // A filial é SEMPRE determinada pelo utilizador autenticado no backend
  const branchName = authenticatedUser?.filial.nome || 'Alto-Gingone';

  return (
    <AdminDashboardContent
      initialBranchName={branchName}
      authenticatedUser={authenticatedUser}
    />
  );
}
