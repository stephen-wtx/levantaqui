import { NextRequest, NextResponse, connection } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { requireAuth, AuthError } from '@/app/lib/auth';
import { servicoUpdateSchema } from '@/app/lib/validation/api';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connection();

  try {
    const user = await requireAuth();
    const { id } = await params;

    const body = await req.json();
    const parseResult = servicoUpdateSchema.safeParse(body);

    if (!parseResult.success) {
      const errorMessage =
        parseResult.error.issues[0]?.message || 'Estado de serviço inválido';
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const servico = await prisma.servico.findUnique({
      where: { id },
    });

    if (!servico) {
      return NextResponse.json(
        { error: 'Serviço não encontrado' },
        { status: 404 }
      );
    }

    if (servico.filialId !== user.filialId) {
      return NextResponse.json(
        { error: 'Acesso negado: o serviço não pertence à sua filial' },
        { status: 403 }
      );
    }

    const updatedServico = await prisma.servico.update({
      where: { id },
      data: {
        estado: parseResult.data.estado,
      },
      select: {
        id: true,
        tipo: true,
        estado: true,
        filialId: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ servico: updatedServico });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    console.error('Erro ao actualizar serviço:', error);
    return NextResponse.json(
      { error: 'Erro interno ao actualizar serviço' },
      { status: 500 }
    );
  }
}
