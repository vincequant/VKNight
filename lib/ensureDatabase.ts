import { prisma } from './database';

export async function ensureCharacterBackupTable() {
  try {
    // 尝试查询CharacterBackup表
    await prisma.characterBackup.findFirst();
    console.log('CharacterBackup table exists');
  } catch (error: any) {
    if (error.code === 'P2021' || error.message?.includes('table') || error.message?.includes('CharacterBackup')) {
      console.log('CharacterBackup table not found, creating...');
      try {
        // 创建表 - 兼容PostgreSQL
        await prisma.$executeRaw`
          CREATE TABLE IF NOT EXISTS "CharacterBackup" (
            id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
            "characterType" TEXT NOT NULL,
            "backupName" TEXT NOT NULL,
            "backupData" TEXT NOT NULL,
            "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `;
        
        // 创建索引
        await prisma.$executeRaw`
          CREATE INDEX IF NOT EXISTS "CharacterBackup_characterType_idx" ON "CharacterBackup"("characterType")
        `;
        
        console.log('CharacterBackup table created successfully');
      } catch (createError) {
        console.error('Failed to create CharacterBackup table:', createError);
      }
    }
  }
}

// 在应用启动时调用
ensureCharacterBackupTable().catch(console.error);