// Prisma client singleton for Next.js with Turbopack compatibility
import { PrismaClient } from '@prisma/client';

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Helper function to ensure database connection
export async function ensureDbConnection() {
  try {
    await prisma.$connect();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Export a function to get prisma instance (for better Turbopack compatibility)
export function getPrismaClient() {
  return prisma;
}