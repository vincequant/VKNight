const fs = require('fs');
const path = require('path');

// 创建占位符音频文件的脚本
// 这些是空的MP3文件，实际音效需要后续替换

const soundFiles = [
  // 战斗音效
  'sword-swing.mp3',
  'bow-shoot.mp3',
  'magic-sparkle.mp3',
  'hit-soft.mp3',
  'shield-block.mp3',
  'player-hurt.mp3',
  
  // ETH系统音效
  'eth-collect.mp3',
  'eth-spend.mp3',
  'transaction-complete.mp3',
  
  // 升级与成就
  'level-up-fanfare.mp3',
  'achievement-unlock.mp3',
  'quest-complete.mp3',
  
  // 装备音效
  'equip-armor.mp3',
  'equip-weapon.mp3',
  'unequip.mp3',
  
  // 界面音效
  'menu-select.mp3',
  'menu-hover.mp3',
  'page-turn.mp3',
  
  // 特殊音效
  'combo-hit.mp3',
  'critical-strike.mp3',
  'math-correct.mp3',
  'math-incorrect.mp3'
];

// MP3文件的最小有效头部（静音）
const silentMp3Buffer = Buffer.from([
  0xFF, 0xFB, 0x90, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x49, 0x6E, 0x66, 0x6F
]);

const soundsDir = path.join(__dirname, '..', 'public', 'sounds');

// 创建sounds目录
if (!fs.existsSync(soundsDir)) {
  fs.mkdirSync(soundsDir, { recursive: true });
}

// 创建占位符音频文件
soundFiles.forEach(filename => {
  const filepath = path.join(soundsDir, filename);
  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, silentMp3Buffer);
    console.log(`Created placeholder: ${filename}`);
  } else {
    console.log(`Skipped (already exists): ${filename}`);
  }
});

// 创建一个README文件
const readmeContent = `# 音效文件说明

这些是占位符音效文件。请使用实际的音效文件替换它们。

## 音效来源建议：
1. Freesound.org - 免费音效库
2. Zapsplat.com - 需要注册的免费音效
3. OpenGameArt.org - 游戏音效资源
4. AI音效生成工具

## 文件格式要求：
- 格式：MP3
- 比特率：128kbps
- 采样率：44.1kHz
- 声道：立体声或单声道
- 音量标准化：-12dB

请确保所有音效适合儿童，避免过于刺激或吓人的声音。
`;

fs.writeFileSync(path.join(soundsDir, 'SOUNDS_README.md'), readmeContent);
console.log('\nCreated SOUNDS_README.md');
console.log('\nAll placeholder sound files created successfully!');
console.log('Please replace them with actual sound effects.');