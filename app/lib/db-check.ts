import 'dotenv/config';
import { prisma } from './prisma';

export interface DatabaseCheckResult {
  ok: boolean;
  message: string;
  latencyMs?: number;
  details?: {
    filiaisCount: number;
    atmsCount: number;
    servicosCount: number;
    horariosCount: number;
  };
  error?: string;
}

/**
 * Função utilitária para verificar a saúde da conexão com o PostgreSQL via Prisma.
 * Executa uma contagem simples e mede a latência da consulta.
 */
export async function checkDatabaseConnection(): Promise<DatabaseCheckResult> {
  const start = Date.now();

  try {
    const [filiaisCount, atmsCount, servicosCount, horariosCount] =
      await Promise.all([
        prisma.filial.count(),
        prisma.aTM.count(),
        prisma.servico.count(),
        prisma.horario.count(),
      ]);

    const latencyMs = Date.now() - start;

    return {
      ok: true,
      message: 'Conexão com PostgreSQL estabelecida com sucesso.',
      latencyMs,
      details: {
        filiaisCount,
        atmsCount,
        servicosCount,
        horariosCount,
      },
    };
  } catch (err) {
    const latencyMs = Date.now() - start;
    const errorMessage = err instanceof Error ? err.message : String(err);

    return {
      ok: false,
      message: 'Falha ao conectar com a base de dados PostgreSQL.',
      latencyMs,
      error: errorMessage,
    };
  }
}

// Permite execução directa via CLI com tsx: npx tsx app/lib/db-check.ts
if (
  process.argv[1] &&
  (process.argv[1].endsWith('db-check.ts') ||
    process.argv[1].endsWith('db-check.js'))
) {
  checkDatabaseConnection()
    .then((result) => {
      console.log('Resultado da verificação da base de dados:');
      console.log(JSON.stringify(result, null, 2));
      process.exit(result.ok ? 0 : 1);
    })
    .catch((err) => {
      console.error('Erro inesperado no utilitário de teste:', err);
      process.exit(1);
    });
}
