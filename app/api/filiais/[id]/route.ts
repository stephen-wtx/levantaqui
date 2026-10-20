import { NextRequest, NextResponse, connection } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connection();

  try {
    const { id } = await params;

    const filial = await prisma.filial.findFirst({
      where: {
        OR: [
          { id },
          { codigo: id.toUpperCase() },
          { nome: id },
        ],
      },
      select: {
        id: true,
        nome: true,
        codigo: true,
        referenceLocation: true,
        createdAt: true,
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
            filialId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        servicos: {
          select: {
            id: true,
            tipo: true,
            estado: true,
            filialId: true,
            createdAt: true,
            updatedAt: true,
            horarios: {
              select: {
                id: true,
                diaSemana: true,
                horaAbertura: true,
                horaFecho: true,
                createdAt: true,
                updatedAt: true,
              },
              orderBy: { diaSemana: 'asc' },
            },
          },
        },
      },
    });

    if (!filial) {
      return NextResponse.json(
        { error: 'Filial não encontrada' },
        { status: 404 }
      );
    }

    const filialDates: Date[] = [
      filial.updatedAt,
      ...filial.atms.map((a) => a.updatedAt),
      ...filial.servicos.map((s) => s.updatedAt),
      ...filial.servicos.flatMap((s) => s.horarios.map((h) => h.updatedAt)),
    ];
    const latestTimestamp = Math.max(
      ...filialDates.map((d) => new Date(d).getTime())
    );

    const now = new Date();
    const d = new Date(latestTimestamp);
    const isToday =
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const lastUpdated = isToday
      ? `Hoje às ${hours}:${minutes}`
      : `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')} às ${hours}:${minutes}`;

    return NextResponse.json({
      filial: {
        ...filial,
        lastUpdated,
      },
    });
  } catch (error) {
    console.error('Erro ao consultar filial específica:', error);
    return NextResponse.json(
      { error: 'Erro interno ao consultar filial' },
      { status: 500 }
    );
  }
}
