-- 迁移脚本：移除设备ID依赖，使角色数据完全基于云端

-- 1. 创建新的Character表（不依赖User）
CREATE TABLE "Character_new" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "experience" INTEGER NOT NULL DEFAULT 0,
    "expToNextLevel" INTEGER NOT NULL DEFAULT 100,
    "eth" TEXT NOT NULL,
    "baseHp" INTEGER NOT NULL DEFAULT 100,
    "baseMp" INTEGER NOT NULL DEFAULT 50,
    "baseAttack" INTEGER NOT NULL DEFAULT 20,
    "baseDefense" INTEGER NOT NULL DEFAULT 10,
    "inventory" TEXT NOT NULL DEFAULT '[]',
    "weaponId" TEXT,
    "armorId" TEXT,
    "shieldId" TEXT,
    "currentStageId" TEXT,
    "stagesCleared" TEXT NOT NULL DEFAULT '[]',
    "totalEnemiesDefeated" INTEGER NOT NULL DEFAULT 0,
    "totalQuestionsAnswered" INTEGER NOT NULL DEFAULT 0,
    "totalCorrectAnswers" INTEGER NOT NULL DEFAULT 0,
    "ownedEquipment" TEXT NOT NULL DEFAULT '[]',
    "stagesPaidFor" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- 2. 复制现有数据，为每个角色类型只保留最新的记录
INSERT INTO "Character_new" 
SELECT 
    c.id,
    c.type,
    c.level,
    c.experience,
    c.expToNextLevel,
    c.eth,
    c.baseHp,
    c.baseMp,
    c.baseAttack,
    c.baseDefense,
    c.inventory,
    c.weaponId,
    c.armorId,
    c.shieldId,
    c.currentStageId,
    c.stagesCleared,
    c.totalEnemiesDefeated,
    c.totalQuestionsAnswered,
    c.totalCorrectAnswers,
    c.ownedEquipment,
    c.stagesPaidFor,
    c.createdAt,
    c.updatedAt
FROM Character c
INNER JOIN (
    SELECT type, MAX(updatedAt) as maxUpdatedAt
    FROM Character
    GROUP BY type
) latest ON c.type = latest.type AND c.updatedAt = latest.maxUpdatedAt;

-- 3. 创建新的CharacterBackup表（不依赖User）
CREATE TABLE "CharacterBackup_new" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "characterType" TEXT NOT NULL,
    "backupName" TEXT NOT NULL,
    "backupData" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. 复制备份数据
INSERT INTO "CharacterBackup_new"
SELECT 
    cb.id,
    cb.characterType,
    cb.backupName,
    cb.backupData,
    cb.createdAt
FROM CharacterBackup cb;

-- 5. 删除旧表
DROP TABLE IF EXISTS "Achievement";
DROP TABLE IF EXISTS "Purchase";
DROP TABLE IF EXISTS "CharacterBackup";
DROP TABLE IF EXISTS "Character";
DROP TABLE IF EXISTS "User";

-- 6. 重命名新表
ALTER TABLE "Character_new" RENAME TO "Character";
ALTER TABLE "CharacterBackup_new" RENAME TO "CharacterBackup";

-- 7. 创建唯一索引确保每个角色类型只有一条记录
CREATE UNIQUE INDEX "Character_type_key" ON "Character"("type");

-- 8. 创建其他必要的索引
CREATE INDEX "CharacterBackup_characterType_idx" ON "CharacterBackup"("characterType");