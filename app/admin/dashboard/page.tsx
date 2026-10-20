import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/app/lib/auth';
import { AdminDashboardWrapper } from '@/components/admin/AdminDashboardWrapper';

export const metadata: Metadata = {
  title: 'Painel de Gestão | LEVANTAQUI Admin',
  description:
    'Controlo operacional e actualização em tempo real de ATMs, depósitos e atendimento ao balcão.',
};

async function AuthenticatedDashboard() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/admin/login');
  }

  return <AdminDashboardWrapper authenticatedUser={user} />;
}

export default function AdminDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F9F9F9]">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-[#D1005D]" />
        </div>
      }
    >
      <AuthenticatedDashboard />
    </Suspense>
  );
}
