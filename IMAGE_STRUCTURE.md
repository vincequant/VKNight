# 图片资源文件夹结构（简化版）

请按照以下结构组织生成的图片：

```
public/
└── images/
    ├── characters/
    │   ├── josh/
    │   │   └── base/
    │   │       └── josh_knight.png      # 角色基础图片
    │   └── abby/
    │       └── base/
    │           └── abby_archer.png      # 角色基础图片
    │
    ├── enemies/
    │   ├── slime/
    │   │   └── forest_slime.png        # 森林史莱姆
    │   ├── bat/
    │   │   └── cave_bat.png           # 洞穴蝙蝠
    │   └── dragon/
    │       └── baby_dragon.png         # 火山幼龙
    │
    ├── equipment/
    │   ├── weapons/
    │   │   └── weapons_set.png        # 武器套装（5个等级）
    │   ├── armor/
    │   │   └── armor_set.png          # 护甲套装（5个等级）
    │   └── shields/
    │       └── shields_set.png         # 盾牌套装（5个等级）
    │
    ├── backgrounds/
    │   ├── game_hub.png               # 游戏大厅背景
    │   ├── forest_arena.png           # 森林战斗背景
    │   └── volcano_arena.png          # 火山战斗背景
    │
    └── ui/
        ├── eth_ui.png                 # ETH货币界面元素
        ├── effects/
        │   └── game_effects.png       # 游戏特效集合
        └── world_map.png              # 世界地图

```

## 图片规格要求

### 角色图片
- 尺寸：512x512 像素
- 格式：PNG（透明背景）
- 风格：Chibi卡通风格，类似塞尔达传说
- 单张静态图片，站立姿势

### 敌人图片
- 尺寸：384x384 像素
- 格式：PNG（透明背景）
- 风格：与角色保持一致
- 可爱友好，不吓人

### 装备图标
- 尺寸：256x256 像素（每个图标）
- 格式：PNG（透明背景）
- 风格：扁平化图标设计
- 套装图片包含5个等级的装备

### 背景图片
- 尺寸：1920x1080 像素（16:9）
- 格式：JPG或PNG
- 风格：绘画风格，明亮温暖
- 不要太复杂，避免干扰前景

### UI元素
- 尺寸：根据用途而定
- 格式：PNG（透明背景）
- 风格：现代游戏UI风格
- 保持ETH紫色主题

## 命名规范

1. 使用下划线（_）分隔单词
2. 全部使用小写字母
3. 描述性命名，易于理解
4. 例如：josh_knight.png, forest_slime.png

## 生成工具建议

### Midjourney
- 使用 `--v 7` 参数获得最佳效果
- 使用 `--ar 1:1` 生成正方形图片
- 使用 `--no shadow, dark, scary` 排除不需要的元素

### 后期处理
1. 使用 remove.bg 去除背景
2. 调整至推荐尺寸
3. 确保色彩一致性

## 临时解决方案

在等待图片生成期间，系统会显示emoji作为占位符：
- Josh: 🗡️ (剑)
- Abby: 🏹 (弓)
- 史莱姆: 🟢
- 蝙蝠: 🦇
- 龙: 🐲

这确保游戏可以正常运行，同时等待美术资源的完成。