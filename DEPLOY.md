# Railway部署指南

## 前置准备

1. 注册Railway账号：https://railway.app
2. 安装Railway CLI（可选）：
   ```bash
   npm install -g @railway/cli
   ```
3. 准备GitHub账号并推送代码到仓库

## 部署步骤

### 1. 创建新项目

1. 登录Railway Dashboard
2. 点击 "New Project"
3. 选择 "Deploy from GitHub repo"
4. 授权Railway访问你的GitHub
5. 选择包含此项目的仓库

### 2. 添加PostgreSQL服务

1. 在项目页面点击 "New Service"
2. 选择 "Database" → "PostgreSQL"
3. 等待数据库创建完成
4. 数据库会自动注入`DATABASE_URL`环境变量

### 3. 配置环境变量

在项目设置中添加以下环境变量：

```
JWT_SECRET=your-super-secret-jwt-key-here-change-this
NEXT_PUBLIC_APP_NAME=VK数学乐园
NEXT_PUBLIC_APP_URL=https://your-app.up.railway.app
NODE_ENV=production
```

### 4. 数据库迁移

第一次部署后，需要运行数据库迁移：

1. 使用Railway CLI：
   ```bash
   railway run npx prisma migrate deploy
   ```

2. 或在Railway控制台运行：
   ```bash
   npx prisma migrate deploy
   ```

### 5. 自定义域名（可选）

1. 在项目设置中找到 "Domains"
2. 添加自定义域名
3. 按提示配置DNS记录

## 监控和维护

### 查看日志
- 在Railway Dashboard查看实时日志
- 使用CLI：`railway logs`

### 性能监控
- Railway自动提供CPU、内存、网络监控
- 设置告警通知

### 数据库备份
- Railway自动每日备份
- 可手动创建备份快照

## 常见问题

### 1. 构建失败
- 检查环境变量是否正确设置
- 确保`package.json`中的构建脚本正确

### 2. 数据库连接失败
- 确认`DATABASE_URL`环境变量存在
- 检查Prisma schema是否正确

### 3. 部署后白屏
- 检查`NEXT_PUBLIC_*`环境变量
- 查看浏览器控制台错误

## 成本优化

- 使用Railway免费层（每月500小时）
- 监控资源使用情况
- 合理设置缓存策略

## 更新部署

推送到GitHub主分支会自动触发部署：

```bash
git add .
git commit -m "Update features"
git push origin main
```

## 回滚

如需回滚到之前版本：
1. 在Railway Dashboard选择部署历史
2. 点击想要回滚的版本
3. 选择 "Rollback to this deployment"