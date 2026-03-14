import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import fs from 'fs';
import path from 'path';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaUrl: string | undefined;
};

function findProjectRoot(startDir: string): string {
  let dir = startDir;
  while (true) {
    if (fs.existsSync(path.join(dir, 'package.json'))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) return startDir;
    dir = parent;
  }
}

function resolveSqliteUrl(url: string): string {
  if (!url.startsWith('file:')) return url;

  const filePath = url.slice(5);
  if (!filePath) {
    return `file:${path.join(findProjectRoot(process.cwd()), 'dev.db')}`;
  }

  if (path.isAbsolute(filePath)) return url;

  const projectRoot = findProjectRoot(process.cwd());
  return `file:${path.resolve(projectRoot, filePath)}`;
}

function createPrismaClient(url: string) {
  const adapter = new PrismaBetterSqlite3({ url });
  return new PrismaClient({ adapter });
}
const prismaUrl = resolveSqliteUrl(process.env.DATABASE_URL || 'file:./dev.db');

if (!globalForPrisma.prisma || globalForPrisma.prismaUrl !== prismaUrl) {
  globalForPrisma.prisma = createPrismaClient(prismaUrl);
  globalForPrisma.prismaUrl = prismaUrl;
}

export const prisma = globalForPrisma.prisma;

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaUrl = prismaUrl;
}
