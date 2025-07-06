# Railway 部署指南

## 部署步骤

1. **登录 Railway**
   ```bash
   railway login
   ```

2. **创建新项目（如果还没有）**
   ```bash
   railway init
   ```

3. **链接到现有项目（如果已经有项目）**
   ```bash
   railway link
   ```

4. **设置环境变量**
   ```bash
   railway variables set NODE_ENV=production
   railway variables set DATABASE_URL=your_database_url
   ```

5. **部署到 Railway**
   ```bash
   railway up
   ```

## 通过 GitHub 自动部署

1. 访问 [Railway Dashboard](https://railway.app/dashboard)
2. 点击 "New Project"
3. 选择 "Deploy from GitHub repo"
4. 选择 `vincequant/VKNight` 仓库
5. Railway 会自动检测到 Next.js 项目并配置部署

## 环境变量配置

在 Railway 项目设置中添加以下环境变量：

- `NODE_ENV`: production
- `DATABASE_URL`: 数据库连接字符串（如果使用）

## 构建命令

Railway 会自动使用以下命令：

- Build Command: `npm run build`
- Start Command: `npm start`

## 域名配置

部署成功后，Railway 会提供一个域名，格式如：
`https://vknight-production.up.railway.app`

你也可以在设置中配置自定义域名。

## 查看部署日志

```bash
railway logs
```

## 重新部署

每次推送到 GitHub 的 main 分支都会自动触发部署。

手动重新部署：
```bash
railway up
```