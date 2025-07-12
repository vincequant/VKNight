import { getPrismaClient } from './prisma';

async function detectDatabaseType(): Promise<'sqlite' | 'postgresql'> {
  const prisma = getPrismaClient();
  try {
    // 尝试运行PostgreSQL特有的查询
    await prisma.$queryRaw`SELECT version()`;
    return 'postgresql';
  } catch {
    return 'sqlite';
  }
}

export async function ensureCharacterBackupTable() {
  const prisma = getPrismaClient();
  try {
    // 尝试查询CharacterBackup表
    await prisma.characterBackup.findFirst();
    console.log('CharacterBackup table exists');
  } catch (error: any) {
    if (error.code === 'P2021' || error.message?.includes('table') || error.message?.includes('CharacterBackup')) {
      console.log('CharacterBackup table not found, creating...');
      
      const dbType = await detectDatabaseType();
      console.log(`Detected database type: ${dbType}`);
      
      try {
        if (dbType === 'postgresql') {
          // PostgreSQL版本
          await prisma.$executeRaw`
            CREATE TABLE IF NOT EXISTS "CharacterBackup" (
              id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
              "characterType" TEXT NOT NULL,
              "backupName" TEXT NOT NULL,
              "backupData" TEXT NOT NULL,
              "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
          `;
          
          await prisma.$executeRaw`
            CREATE INDEX IF NOT EXISTS "CharacterBackup_characterType_idx" ON "CharacterBackup"("characterType")
          `;
        } else {
          // SQLite版本
          await prisma.$executeRaw`
            CREATE TABLE IF NOT EXISTS CharacterBackup (
              id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(12)))),
              characterType TEXT NOT NULL,
              backupName TEXT NOT NULL,
              backupData TEXT NOT NULL,
              createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )
          `;
          
          await prisma.$executeRaw`
            CREATE INDEX IF NOT EXISTS CharacterBackup_characterType_idx ON CharacterBackup(characterType)
          `;
        }
        
        console.log('CharacterBackup table created successfully');
      } catch (createError) {
        console.error('Failed to create CharacterBackup table:', createError);
        throw createError;
      }
    } else {
      console.error('Database error:', error);
      throw error;
    }
  }
}

// 在应用启动时调用
ensureCharacterBackupTable().catch(console.error);