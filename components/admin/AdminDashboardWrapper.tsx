'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { AdminDashboardContent } from './AdminDashboardContent';

export function AdminDashboardWrapper() {
  const searchParams = useSearchParams();
  const branchName = searchParams.get('branch') || 'Alto-Gingone';

  return <AdminDashboardContent initialBranchName={branchName} />;
}
