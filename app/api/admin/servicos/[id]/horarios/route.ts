import { NextRequest, NextResponse, connection } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { requireAuth, AuthError } from '@/app/lib/auth';
import { horariosUpdateSchema } from '@/app/lib/validation/api';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connection();

  try {
    const user = await requireAuth();
    const { id } = await params;

    const body = await req.json();
    const parseResult = horariosUpdateSchema.safeParse(body);

    if (!parseResult.success) {
      const errorMessage =
        parseResult.error.issues[0]?.message || 'Dados de horários inválidos';
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    // Procura o serviço na base de dados
    const servico = await prisma.servico.findUnique({
      where: { id },
    });

    if (!servico) {
      return NextResponse.json(
        { error: 'Serviço não encontrado' },
        { status: 404 }
      );
    }

    // Verifica se pertence à filial do utilizador autenticado
    if (servico.filialId !== user.filialId) {
      return NextResponse.json(
        { error: 'Acesso negado: o serviço não pertence à sua filial' },
        { status: 403 }
      );
    }

    // Actualiza os horários de forma segura numa transaction
    const updatedHorarios = await prisma.$transaction(async (tx) => {
      // Remove horários existentes deste serviço específico
      await tx.horario.deleteMany({
        where: { servicoId: id },
      });

      // Cria apenas os horários enviados
      const created = await Promise.all(
        parseResult.data.horarios.map((h) =>
          tx.horario.create({
            data: {
              servicoId: id,
              diaSemana: h.diaSemana,
              horaAbertura: h.horaAbertura,
              horaFecho: h.horaFecho,
            },
            select: {
              id: true,
              diaSemana: true,
              horaAbertura: true,
              horaFecho: true,
              servicoId: true,
            },
          })
        )
      );

      // Actualiza o timestamp do serviço
      await tx.servico.update({
        where: { id },
        data: { updatedAt: new Date() },
      });

      return created;
    });

    return NextResponse.json({
      success: true,
      horarios: updatedHorarios,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    console.error('Erro ao actualizar horários:', error);
    return NextResponse.json(
      { error: 'Erro interno ao actualizar horários' },
      { status: 500 }
    );
  }
}
