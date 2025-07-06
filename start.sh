#!/bin/bash

echo "🎮 启动 VK数学乐园..."
echo ""

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误：未找到 package.json 文件"
    echo "请确保在项目根目录运行此脚本"
    exit 1
fi

# 检查 node_modules 是否存在
if [ ! -d "node_modules" ]; then
    echo "📦 首次运行，正在安装依赖..."
    npm install
fi

# 检查数据库是否存在
if [ ! -f "prisma/dev.db" ]; then
    echo "🗄️  初始化数据库..."
    npx prisma db push
fi

echo ""
echo "🚀 启动开发服务器..."
echo "📱 游戏将在浏览器中打开：http://localhost:3000"
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""

npm run dev