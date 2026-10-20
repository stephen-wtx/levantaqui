import { NextResponse, connection } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import type { Branch, ATM as PublicATM, BranchService } from '@/types';

function formatScheduleDetails(horarios: { diaSemana: string }[]): string {
  if (!horarios.length) return 'Sem horário definido';
  const dias = horarios.map((h) => h.diaSemana);
  if (
    dias.includes('SEGUNDA') &&
    dias.includes('TERCA') &&
    dias.includes('QUARTA') &&
    dias.includes('QUINTA') &&
    dias.includes('SEXTA') &&
    !dias.includes('SABADO')
  ) {
    return 'Segunda a Sexta-feira';
  }
  if (
    dias.includes('SEGUNDA') &&
    dias.includes('TERCA') &&
    dias.includes('QUARTA') &&
    dias.includes('QUINTA') &&
    dias.includes('SEXTA') &&
    dias.includes('SABADO')
  ) {
    return 'Segunda a Sábado';
  }
  return dias.join(', ');
}

function formatBranchLastUpdated(date: Date): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'hoje às 10:42';

  const now = new Date();
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();

  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  if (isToday) {
    return `hoje às ${hours}:${minutes}`;
  }

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${day}/${month} às ${hours}:${minutes}`;
}

export async function GET() {
  await connection();

  try {
    const filiaisDb = await prisma.filial.findMany({
      orderBy: { nome: 'asc' },
      select: {
        id: true,
        nome: true,
        codigo: true,
        referenceLocation: true,
        updatedAt: true,
        atms: {
          orderBy: { numero: 'asc' },
          select: {
            id: true,
            numero: true,
            code: true,
            label: true,
            locationDetails: true,
            estado: true,
            updatedAt: true,
          },
        },
        servicos: {
          select: {
            id: true,
            tipo: true,
            estado: true,
            updatedAt: true,
            horarios: {
              select: {
                id: true,
                diaSemana: true,
                horaAbertura: true,
                horaFecho: true,
                updatedAt: true,
              },
              orderBy: { diaSemana: 'asc' },
            },
          },
        },
      },
    });

    let globalMaxTimestamp = 0;

    // Mapeia para a estrutura pública esperada pelo frontend com actualização individual por filial
    const filiais: Branch[] = filiaisDb.map((filial) => {
      // Regra: lastUpdate(filial) = alteração mais recente entre os recursos daquela própria filial
      const filialDates: Date[] = [
        filial.updatedAt,
        ...filial.atms.map((a) => a.updatedAt),
        ...filial.servicos.map((s) => s.updatedAt),
        ...filial.servicos.flatMap((s) => s.horarios.map((h) => h.updatedAt)),
      ];
      const branchLatestTimestamp = Math.max(
        ...filialDates.map((d) => new Date(d).getTime())
      );
      if (branchLatestTimestamp > globalMaxTimestamp) {
        globalMaxTimestamp = branchLatestTimestamp;
      }

      const branchLastUpdated = formatBranchLastUpdated(
        new Date(branchLatestTimestamp)
      );

      const depositDb = filial.servicos.find((s) => s.tipo === 'DEPOSITOS');
      const customerDb = filial.servicos.find((s) => s.tipo === 'ATENDIMENTO');

      const depositOpen = depositDb?.estado === 'ABERTO';
      const customerOpen = customerDb?.estado === 'ABERTO';
      const hasAvailableATM = filial.atms.some((a) => a.estado === 'DISPONIVEL');

      let branchStatus: 'OPEN' | 'PARTIAL' | 'CLOSED' = 'CLOSED';
      if (depositOpen || customerOpen) {
        branchStatus = 'OPEN';
      } else if (hasAvailableATM) {
        branchStatus = 'PARTIAL';
      }

      const depositHorario = depositDb?.horarios[0];
      const customerHorario = customerDb?.horarios[0];

      const depositService: BranchService = {
        status: depositOpen ? 'AVAILABLE' : 'UNAVAILABLE',
        hours: {
          operatingHours: depositHorario
            ? `${depositHorario.horaAbertura} — ${depositHorario.horaFecho}`
            : '08:00 — 15:30',
          scheduleDetails: formatScheduleDetails(depositDb?.horarios || []),
          notes: 'Depósitos em numerário e cheque ao balcão',
        },
      };

      const customerService: BranchService = {
        status: customerOpen ? 'AVAILABLE' : 'UNAVAILABLE',
        hours: {
          operatingHours: customerHorario
            ? `${customerHorario.horaAbertura} — ${customerHorario.horaFecho}`
            : '08:00 — 15:30',
          scheduleDetails: formatScheduleDetails(customerDb?.horarios || []),
          notes: 'Abertura de contas, cartões e operações de caixa',
        },
      };

      const atms: PublicATM[] = filial.atms.map((atm) => {
        const isAvailable = atm.estado === 'DISPONIVEL';
        return {
          id: atm.id,
          code: atm.code,
          label: atm.label,
          locationDetails: atm.locationDetails || 'Área de autoatendimento',
          status:
            atm.estado === 'DISPONIVEL'
              ? 'AVAILABLE'
              : atm.estado === 'INDISPONIVEL'
              ? 'UNAVAILABLE'
              : 'MAINTENANCE',
          dispensesCash: isAvailable,
          acceptsDeposit: atm.numero === 3,
          notes:
            atm.numero === 3
              ? 'A pagar • Depósitos automáticos activos'
              : 'A pagar notas de 200, 500 e 1000 MT',
          lastChecked: formatBranchLastUpdated(new Date(atm.updatedAt)),
        };
      });

      return {
        id: filial.id,
        name: filial.nome,
        shortName: filial.nome,
        referenceLocation: filial.referenceLocation,
        city: 'Pemba',
        status: branchStatus,
        depositService,
        customerService,
        atms,
        lastUpdated: branchLastUpdated,
      };
    });

    const formattedLastGlobalUpdate =
      globalMaxTimestamp > 0
        ? formatBranchLastUpdated(new Date(globalMaxTimestamp))
        : 'hoje às 10:42';

    return NextResponse.json({
      filiais,
      rawFiliais: filiaisDb,
      lastGlobalUpdate: formattedLastGlobalUpdate,
    });
  } catch (error) {
    console.error('Erro ao consultar filiais:', error);
    return NextResponse.json(
      { error: 'Erro interno ao consultar filiais' },
      { status: 500 }
    );
  }
}
