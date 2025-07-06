#!/bin/bash

echo "🚀 Railway 数据库迁移脚本"
echo "========================"
echo ""
echo "请确保您已经登录 Railway CLI"
echo "如果还没登录，请先运行: railway login"
echo ""
echo "按 Enter 继续..."
read

# Link to project
echo "📎 连接到 Railway 项目..."
railway link

# Run migration
echo ""
echo "🔄 运行数据库迁移..."
railway run npx prisma migrate deploy

echo ""
echo "✅ 迁移完成！"
echo ""
echo "现在您可以在 Railway PostgreSQL 的 Data 标签页查看创建的表。"
echo "您的游戏数据将自动保存到云端！"