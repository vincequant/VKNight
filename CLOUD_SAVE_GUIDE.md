# 云端存储实现指南

## 方案1：使用 Supabase（推荐）

### 1. 设置 Supabase
1. 访问 https://supabase.com 创建账号
2. 创建新项目
3. 获取项目 URL 和 API Key

### 2. 安装依赖
```bash
npm install @supabase/supabase-js
```

### 3. 创建数据库表
在 Supabase Dashboard 的 SQL Editor 中运行：

```sql
-- 用户表
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 角色数据表
CREATE TABLE characters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  character_type TEXT NOT NULL, -- 'josh' or 'abby'
  level INTEGER DEFAULT 1,
  experience INTEGER DEFAULT 0,
  exp_to_next_level INTEGER DEFAULT 100,
  eth TEXT NOT NULL, -- 存储为字符串因为是 bigint
  base_hp INTEGER DEFAULT 100,
  base_attack INTEGER DEFAULT 20,
  base_defense INTEGER DEFAULT 10,
  weapon_id TEXT,
  armor_id TEXT,
  shield_id TEXT,
  stages_cleared JSONB DEFAULT '[]',
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, character_type)
);

-- 自动更新时间戳
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_characters_updated_at BEFORE UPDATE
  ON characters FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
```

### 4. 环境变量
在 Railway 中添加：
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. 创建 Supabase 客户端
创建 `lib/supabase.ts`：
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 6. 更新存储逻辑
创建 `lib/cloudStorage.ts`：
```typescript
import { supabase } from './supabase'
import { Character } from '@/types/game'

// 获取或创建设备ID
function getDeviceId(): string {
  let deviceId = localStorage.getItem('deviceId')
  if (!deviceId) {
    deviceId = crypto.randomUUID()
    localStorage.setItem('deviceId', deviceId)
  }
  return deviceId
}

// 获取或创建用户
async function getOrCreateUser() {
  const deviceId = getDeviceId()
  
  const { data: user, error } = await supabase
    .from('users')
    .select('id')
    .eq('device_id', deviceId)
    .single()
  
  if (error && error.code === 'PGRST116') {
    // 用户不存在，创建新用户
    const { data: newUser } = await supabase
      .from('users')
      .insert({ device_id: deviceId })
      .select('id')
      .single()
    
    return newUser
  }
  
  return user
}

// 保存角色到云端
export async function saveCharacterToCloud(character: Character) {
  try {
    const user = await getOrCreateUser()
    if (!user) return
    
    const { error } = await supabase
      .from('characters')
      .upsert({
        user_id: user.id,
        character_type: character.type,
        level: character.level,
        experience: character.experience,
        exp_to_next_level: character.expToNextLevel,
        eth: character.eth.toString(),
        base_hp: character.baseHp,
        base_attack: character.baseAttack,
        base_defense: character.baseDefense,
        weapon_id: character.weapon?.id,
        armor_id: character.armor?.id,
        shield_id: character.shield?.id,
        stages_cleared: character.stagesCleared
      })
    
    if (error) {
      console.error('Error saving to cloud:', error)
    }
  } catch (error) {
    console.error('Error saving to cloud:', error)
  }
}

// 从云端加载角色
export async function loadCharacterFromCloud(characterType: string): Promise<Character | null> {
  try {
    const user = await getOrCreateUser()
    if (!user) return null
    
    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .eq('user_id', user.id)
      .eq('character_type', characterType)
      .single()
    
    if (error || !data) return null
    
    return {
      id: characterType,
      type: characterType as 'josh' | 'abby',
      level: data.level,
      experience: data.experience,
      expToNextLevel: data.exp_to_next_level,
      eth: BigInt(data.eth),
      hp: data.base_hp,
      maxHp: data.base_hp,
      attack: data.base_attack,
      defense: data.base_defense,
      baseHp: data.base_hp,
      baseAttack: data.base_attack,
      baseDefense: data.base_defense,
      stagesCleared: data.stages_cleared || []
    }
  } catch (error) {
    console.error('Error loading from cloud:', error)
    return null
  }
}
```

### 7. 整合到现有代码
更新 `utils/characterStorage.ts`：
```typescript
import { saveCharacterToCloud, loadCharacterFromCloud } from '@/lib/cloudStorage'

// 保存角色（本地 + 云端）
export async function saveCharacter(character: Character): Promise<void> {
  // 保存到本地
  const key = `character_${character.type}`
  localStorage.setItem(key, serializeCharacter(character))
  
  // 异步保存到云端
  saveCharacterToCloud(character)
}

// 加载角色（优先云端，降级到本地）
export async function loadCharacterWithCloud(userId: string): Promise<Character | null> {
  // 先尝试从云端加载
  const cloudChar = await loadCharacterFromCloud(userId)
  if (cloudChar) return cloudChar
  
  // 降级到本地存储
  return loadCharacter(userId)
}
```

## 方案2：使用 Railway PostgreSQL

### 优点
- 与 Railway 深度集成
- 使用现有的 Prisma 设置

### 缺点
- 需要付费数据库
- 配置较复杂

## 方案3：使用 Vercel KV

### 优点
- 简单的键值存储
- Vercel 生态系统

### 缺点
- 需要迁移到 Vercel
- 有免费额度限制

## 推荐实施步骤

1. **先使用 Supabase 免费版**
   - 每月 500MB 存储
   - 足够存储大量用户数据

2. **保持本地存储作为备份**
   - 网络错误时降级到本地
   - 提供离线游戏能力

3. **添加同步指示器**
   - 显示云端保存状态
   - 手动同步按钮

4. **实现设备迁移功能**
   - 通过设备ID恢复进度
   - 或添加简单的登录系统