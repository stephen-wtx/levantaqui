import { NextRequest, NextResponse, connection } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { requireAuth, AuthError } from '@/app/lib/auth';
import { atmUpdateSchema } from '@/app/lib/validation/api';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connection();

  try {
    // 1. & 2. & 3. Obtém utilizador autenticado e a sua filialId
    const user = await requireAuth();
    const { id } = await params;

    // 7. Valida o input com Zod
    const body = await req.json();
    const parseResult = atmUpdateSchema.safeParse(body);

    if (!parseResult.success) {
      const errorMessage =
        parseResult.error.issues[0]?.message || 'Estado de ATM inválido';
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    // 4. Procura o ATM na base de dados
    const atm = await prisma.aTM.findUnique({
      where: { id },
    });

    if (!atm) {
      return NextResponse.json({ error: 'ATM não encontrado' }, { status: 404 });
    }

    // 5. & 6. Verifica rigorosamente que ATM.filialId === utilizador.filialId
    if (atm.filialId !== user.filialId) {
      return NextResponse.json(
        { error: 'Acesso negado: o ATM não pertence à sua filial' },
        { status: 403 }
      );
    }

    // 8. Actualiza na base de dados
    const updatedAtm = await prisma.aTM.update({
      where: { id },
      data: {
        estado: parseResult.data.estado,
      },
      select: {
        id: true,
        numero: true,
        code: true,
        label: true,
        locationDetails: true,
        estado: true,
        filialId: true,
        updatedAt: true,
      },
    });

    // 9. Devolve o ATM actualizado sem dados privados
    return NextResponse.json({ atm: updatedAtm });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    console.error('Erro ao actualizar ATM:', error);
    return NextResponse.json(
      { error: 'Erro interno ao actualizar ATM' },
      { status: 500 }
    );
  }
}
