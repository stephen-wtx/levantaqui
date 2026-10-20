import 'dotenv/config';
import { PrismaClient } from '@/app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

/**
 * Criação da instância singleton do PrismaClient com PrismaPg Adapter (Prisma 7).
 */
const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('A variável de ambiente DATABASE_URL não está configurada.');
  }

  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;

// Re-exporta enums, models e tipos gerados pelo Prisma 7 para conveniência
export * from '@/app/generated/prisma/client';
