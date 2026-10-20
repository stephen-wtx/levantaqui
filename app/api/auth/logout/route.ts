import { NextResponse, connection } from 'next/server';
import { destroySession } from '@/app/lib/auth';

export async function POST() {
  await connection();
  try {
    await destroySession();
    return NextResponse.json({
      success: true,
      message: 'Sessão terminada com sucesso',
    });
  } catch (error) {
    console.error('Erro no endpoint de logout:', error);
    return NextResponse.json(
      { error: 'Erro ao terminar sessão' },
      { status: 500 }
    );
  }
}
