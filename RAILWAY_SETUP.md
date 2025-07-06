# Railway 云存储设置指南

## 功能说明
现在您的游戏支持 Railway PostgreSQL 云存储，Josh 和 Abby 的角色数据会自动保存到云端。

## Railway 设置步骤

### 1. 在 Railway 项目中添加 PostgreSQL
1. 进入您的 Railway 项目仪表板
2. 点击 "New Service" → "Database" → "Add PostgreSQL"
3. PostgreSQL 会自动创建并连接到您的应用

### 2. 环境变量
Railway 会自动设置 `DATABASE_URL` 环境变量，无需手动配置。

### 3. 数据库初始化
首次部署后，需要运行数据库迁移：

```bash
# 在 Railway 的 Shell 中运行
npx prisma migrate deploy
```

或者在本地运行（需要设置 DATABASE_URL）：
```bash
DATABASE_URL="你的Railway数据库URL" npx prisma migrate deploy
```

## 功能特性

### 自动云同步
- 角色数据自动保存到云端
- 支持离线游戏（本地缓存）
- 跨设备同步（使用相同的设备ID）

### 同步状态指示
- 界面右上角显示云同步状态
- 🔄 同步中
- ✅ 已同步
- ❌ 同步失败
- ☁️ 云端存储

### 数据存储
- 角色等级、经验值
- ETH 货币
- 装备信息
- 关卡进度
- 成就解锁

## 故障排除

### 如果同步失败
1. 检查 Railway PostgreSQL 服务是否正常运行
2. 确认 DATABASE_URL 环境变量已设置
3. 查看 Railway 日志了解详细错误信息

### 如果数据丢失
- 游戏会自动使用本地缓存的数据
- 云端同步会在网络恢复后自动进行

## 注意事项
- 每个设备有唯一的设备ID
- 如需在新设备上恢复进度，需要手动迁移设备ID
- 建议定期检查云同步状态