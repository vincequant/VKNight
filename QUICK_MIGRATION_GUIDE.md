# 🚀 快速迁移指南

## 方法 1：使用迁移脚本（推荐）

在终端中运行：
```bash
./scripts/migrate-railway.sh
```

这个脚本会：
1. 连接到您的 Railway 项目
2. 自动运行数据库迁移
3. 创建所有必需的表

## 方法 2：手动执行

1. **登录 Railway CLI**
   ```bash
   railway login
   ```

2. **连接到项目**
   ```bash
   railway link
   ```
   选择您的工作空间和 VKNight 项目

3. **运行迁移**
   ```bash
   railway run npx prisma migrate deploy
   ```

## 方法 3：直接使用 DATABASE_URL

1. **从 Railway 复制 DATABASE_URL**
   - 在 Railway 网页中，点击 Postgres 服务
   - 点击 "Variables" 标签
   - 复制 DATABASE_URL 的值

2. **在本地运行**
   ```bash
   DATABASE_URL="复制的URL" npx prisma migrate deploy
   ```

## ✅ 验证迁移成功

1. 在 Railway 网页中，点击 Postgres 服务
2. 点击 "Data" 标签
3. 您应该看到以下表：
   - User
   - Character
   - Equipment
   - Stage
   - Purchase
   - Achievement

## 🎮 开始使用云存储

迁移成功后，您的游戏会自动：
- 保存角色等级、经验值
- 保存 ETH 余额
- 保存装备信息
- 保存关卡进度
- 关闭网页后重新打开，所有数据都还在！

## 🔍 查看云同步状态

游戏界面右上角会显示：
- ☁️ 云端存储（空闲）
- 🔄 同步中...
- ✅ 已同步
- ❌ 同步失败（会自动使用本地缓存）