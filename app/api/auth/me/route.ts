import { NextResponse, connection } from 'next/server';
import { getCurrentUser } from '@/app/lib/auth';

export async function GET() {
  await connection();
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Erro no endpoint auth/me:', error);
    return NextResponse.json(
      { error: 'Erro interno ao consultar sessão' },
      { status: 500 }
    );
  }
}
