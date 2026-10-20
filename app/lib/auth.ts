import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import { prisma } from '@/app/lib/prisma';

export const SESSION_COOKIE_NAME = 'levantaqui_session';
export const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 horas

export interface SafeFilial {
  id: string;
  nome: string;
  codigo: string;
  referenceLocation: string;
}

export interface SafeUser {
  id: string;
  nome: string;
  username: string;
  filialId: string;
  filial: SafeFilial;
}

/**
 * Erro específico para falhas de autenticação
 */
export class AuthError extends Error {
  statusCode: number;

  constructor(message = 'Não autorizado', statusCode = 401) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = statusCode;
  }
}

/**
 * Gera um hash SHA-256 a partir de um token bruto
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Cria uma nova sessão na base de dados para o utilizador
 */
export async function createSession(utilizadorId: string): Promise<{ token: string; expiresAt: Date }> {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await prisma.sessao.create({
    data: {
      token: tokenHash,
      utilizadorId,
      expiresAt,
    },
  });

  return { token: rawToken, expiresAt };
}

/**
 * Define o cookie de sessão seguro no contexto Next.js
 */
export async function setSessionCookie(token: string, expiresAt: Date): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });
}

/**
 * Invalida a sessão na base de dados e remove o cookie
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (rawToken) {
    const tokenHash = hashToken(rawToken);
    try {
      await prisma.sessao.deleteMany({
        where: { token: tokenHash },
      });
    } catch {
      // Ignora erro se a sessão já não existir
    }
  }

  cookieStore.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

/**
 * Obtém o utilizador autenticado a partir do cookie de sessão.
 * Devolve null se não autenticado ou expirado.
 */
export async function getCurrentUser(): Promise<SafeUser | null> {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!rawToken) {
    return null;
  }

  try {

    const tokenHash = hashToken(rawToken);
    const session = await prisma.sessao.findUnique({
      where: { token: tokenHash },
      include: {
        utilizador: {
          include: {
            filial: true,
          },
        },
      },
    });

    if (!session) {
      return null;
    }

    // Verifica expiração
    if (session.expiresAt <= new Date()) {
      // Remove sessão expirada de forma assíncrona
      prisma.sessao.delete({ where: { id: session.id } }).catch(() => {});
      return null;
    }

    const { utilizador } = session;

    return {
      id: utilizador.id,
      nome: utilizador.nome,
      username: utilizador.username,
      filialId: utilizador.filialId,
      filial: {
        id: utilizador.filial.id,
        nome: utilizador.filial.nome,
        codigo: utilizador.filial.codigo,
        referenceLocation: utilizador.filial.referenceLocation,
      },
    };
  } catch (error) {
    console.error('Erro ao verificar utilizador actual:', error);
    return null;
  }
}

/**
 * Garante que existe um utilizador autenticado e devolve os seus dados seguros.
 * Lança AuthError (401) se não estiver autenticado.
 */
export async function requireAuth(): Promise<SafeUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new AuthError('Sessão inválida ou expirada. Inicie sessão novamente.', 401);
  }
  return user;
}
