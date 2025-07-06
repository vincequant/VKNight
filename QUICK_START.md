# 快速开始指南

## 当前状态
项目正在从简单的战斗游戏升级为完整的RPG系统。基础架构已完成，需要整合实现。

## 立即需要做的事

### 1. 修复游戏页面 (最紧急)
文件：`/app/game/page.tsx`

当前问题：
- 还在使用旧的Enemy和Player接口
- 没有整合Stage系统
- 没有经验值和升级机制

需要：
```typescript
// 1. 从hub页面获取选中的关卡
const selectedStage = JSON.parse(localStorage.getItem('selectedStage') || '{}');

// 2. 使用Character类型替代Player
const [character, setCharacter] = useState<Character | null>(null);

// 3. 从关卡数据加载敌人
const enemies = selectedStage.enemies || [];

// 4. 战斗胜利后增加经验值
const expGained = currentEnemy.expDrop;
const goldGained = currentEnemy.goldDrop;
```

### 2. 创建商店页面
文件：`/app/store/page.tsx`

使用已有数据：
- `/data/equipment.ts` - 所有装备数据
- `getAffordableEquipment()` - 获取可购买装备

### 3. 运行测试
```bash
# 重置数据库
rm prisma/dev.db
npx prisma db push

# 启动项目
npm run dev
```

## 用户核心需求
1. **商业级品质** - 不要简单丑陋的UI
2. **完整的RPG成长系统** - 等级、装备、属性
3. **使用DALL-E 3生成专业图片**

## API使用示例
```javascript
// 生成角色立绘
const response = await fetch('https://api.openai.com/v1/images/generations', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer sk-GLjZRbocrDPzRiNJOXL5E3SnWEF7DjfqYIVR9aioZkLMmjHe',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: "dall-e-3",
    prompt: "A cute chibi-style warrior character for a children's math learning game, Zelda art style",
    n: 1,
    size: "1024x1024"
  })
});
```

## 文件结构
```
/app
  /hub - 关卡选择（已完成）
  /game - 战斗系统（需要更新）
  /store - 商店（待创建）
  /equipment - 装备管理（待创建）
/data
  /equipment.ts - 装备数据（已完成）
  /stages.ts - 关卡数据（已完成）
/types
  /game.ts - 类型定义（已完成）
```

祝你成功！记住：品质第一！