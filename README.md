# VK数学乐园 - 儿童数学学习平台

一个专为5岁儿童设计的数学学习网站，通过游戏化和可视化教学帮助孩子掌握加减乘除。

## 功能特色

### 📚 个性化学习路径
- **妹妹路径**：从个位数加法到双位数加减法，配有借十法动画演示
- **哥哥路径**：进阶加减法和乘除法练习

### 🎮 游戏化设计
- 金币奖励系统
- 连击加成机制
- 成就解锁系统
- 虚拟商店购物

### 🎨 视觉化教学
- 借十法动画演示
- 可拖拽数字方块
- 步骤分解展示
- 色彩丰富的界面

### 📱 iPad优化
- 触控手势支持
- 横竖屏自适应
- 安全区域适配
- PWA离线支持

## 技术栈

- **前端**：Next.js 14 + TypeScript + Tailwind CSS
- **动画**：Framer Motion
- **数据库**：PostgreSQL + Prisma ORM
- **部署**：Railway Platform

## 本地开发

```bash
# 安装依赖
npm install

# 设置环境变量
cp .env.example .env.local

# 运行开发服务器
npm run dev
```

## Railway部署

1. 在Railway创建新项目
2. 连接GitHub仓库
3. 添加PostgreSQL服务
4. 设置环境变量：
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_APP_URL`

## 项目结构

```
vkmath-kids/
├── app/              # Next.js App Router页面
├── components/       # React组件
├── lib/             # 工具函数和配置
├── prisma/          # 数据库模型
├── public/          # 静态资源
└── types/           # TypeScript类型定义
```

## 使用说明

1. 打开网站，选择孩子的角色
2. 进入游戏界面开始答题
3. 正确答题获得金币奖励
4. 在商店使用金币购买虚拟物品
5. 家长可长按屏幕3秒进入监控模式

## 贡献指南

欢迎提交Issue和Pull Request来改进这个项目！

## 许可证

MIT License
