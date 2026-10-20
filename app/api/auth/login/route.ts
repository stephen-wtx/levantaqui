import { NextRequest, NextResponse, connection } from 'next/server';
import argon2 from 'argon2';
import { prisma } from '@/app/lib/prisma';
import { createSession, setSessionCookie } from '@/app/lib/auth';
import { loginSchema } from '@/app/lib/validation/auth';

export async function POST(req: NextRequest) {
  await connection();
  try {
    const body = await req.json();
    const parseResult = loginSchema.safeParse(body);

    if (!parseResult.success) {
      const errorMessage = parseResult.error.issues[0]?.message || 'Dados de login inválidos';
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }

    const { username, password, branch } = parseResult.data;

    // Procura utilizador pelo username
    const user = await prisma.utilizador.findUnique({
      where: { username },
      include: { filial: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    // Valida a password com argon2
    const isPasswordValid = await argon2.verify(user.passwordHash, password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    // Se o frontend tiver seleccionado um balcão específico, valida se corresponde à filial real
    if (branch && user.filial.nome.toLowerCase() !== branch.toLowerCase()) {
      return NextResponse.json(
        { error: 'Credenciais inválidas para o balcão seleccionado' },
        { status: 401 }
      );
    }

    // Cria sessão na base de dados e define cookie httpOnly seguro
    const { token, expiresAt } = await createSession(user.id);
    await setSessionCookie(token, expiresAt);

    // Devolve dados seguros do utilizador e da sua filial (nunca a passwordHash)
    return NextResponse.json({
      user: {
        id: user.id,
        nome: user.nome,
        username: user.username,
        filialId: user.filialId,
        filial: {
          id: user.filial.id,
          nome: user.filial.nome,
          codigo: user.filial.codigo,
          referenceLocation: user.filial.referenceLocation,
        },
      },
    });
  } catch (error) {
    console.error('Erro no endpoint de login:', error);
    return NextResponse.json(
      { error: 'Erro interno ao processar autenticação' },
      { status: 500 }
    );
  }
}
