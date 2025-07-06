'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

type CharacterAction = 'idle' | 'attack' | 'defend' | 'hurt' | 'victory';

interface CharacterSpriteProps {
  character: 'josh' | 'abby';
  action: CharacterAction;
  size?: 'sm' | 'md' | 'lg';
}

export default function CharacterSprite({ character, action, size = 'md' }: CharacterSpriteProps) {
  const [imageError, setImageError] = useState(false);
  
  const sizeMap = {
    sm: { width: 64, height: 64 },
    md: { width: 128, height: 128 },
    lg: { width: 256, height: 256 }
  };

  const { width, height } = sizeMap[size];

  // 动画配置
  const animations = {
    idle: {
      y: [0, -5, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    },
    attack: {
      x: [0, 30, 0],
      rotate: [0, -15, 0],
      transition: {
        duration: 0.5,
        ease: "easeOut" as const
      }
    },
    defend: {
      scale: 0.9,
      x: -10,
      transition: {
        duration: 0.3
      }
    },
    hurt: {
      x: [-5, 5, -5, 5, 0],
      opacity: [1, 0.5, 1, 0.5, 1],
      transition: {
        duration: 0.5
      }
    },
    victory: {
      y: [0, -20, 0],
      rotate: [0, 360],
      transition: {
        duration: 1,
        ease: "easeOut" as const
      }
    }
  };

  // 临时占位符 - 将来替换为DALL-E生成的图片
  const placeholderEmojis = {
    josh: {
      idle: '🗡️',
      attack: '⚔️',
      defend: '🛡️',
      hurt: '😣',
      victory: '🎉'
    },
    abby: {
      idle: '🏹',
      attack: '✨',
      defend: '🔮',
      hurt: '😟',
      victory: '🌟'
    }
  };

  const imagePath = `/images/characters/${character}/${character}-${action}.png`;

  if (imageError) {
    // 如果图片加载失败，显示emoji占位符
    return (
      <motion.div
        animate={animations[action]}
        className="flex items-center justify-center"
        style={{ width, height, fontSize: width * 0.6 }}
      >
        {placeholderEmojis[character][action]}
      </motion.div>
    );
  }

  return (
    <motion.div
      animate={animations[action]}
      className="relative"
      style={{ width, height }}
    >
      <Image
        src={imagePath}
        alt={`${character} ${action}`}
        width={width}
        height={height}
        onError={() => setImageError(true)}
        className="pixelated"
        priority
      />
    </motion.div>
  );
}

// 敌人精灵组件
interface EnemySpriteProps {
  enemyType: string;
  action: 'idle' | 'attack' | 'hurt';
  size?: 'sm' | 'md' | 'lg';
}

export function EnemySprite({ enemyType, action, size = 'md' }: EnemySpriteProps) {
  const [imageError, setImageError] = useState(false);
  
  const sizeMap = {
    sm: { width: 64, height: 64 },
    md: { width: 128, height: 128 },
    lg: { width: 192, height: 192 }
  };

  const { width, height } = sizeMap[size];

  const animations = {
    idle: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    },
    attack: {
      x: [-20, 0],
      scale: [1.2, 1],
      transition: {
        duration: 0.5
      }
    },
    hurt: {
      rotate: [-10, 10, -10, 10, 0],
      opacity: [1, 0.5, 1],
      transition: {
        duration: 0.5
      }
    }
  };

  // 获取精灵图标（当前使用emoji，将来替换为图片）
  const getEnemyEmoji = () => {
    const emojiMap: { [key: string]: string } = {
      'slime-green': '🟢',
      'slime-blue': '🔵',
      'goblin': '👺',
      'wolf': '🐺',
      'bat': '🦇',
      'dragon': '🐲',
      'skeleton': '💀',
      'wizard': '🧙‍♂️'
    };
    
    return emojiMap[enemyType] || '👾';
  };

  const imagePath = `/images/enemies/${enemyType}/${enemyType}-${action}.png`;

  if (imageError) {
    return (
      <motion.div
        animate={animations[action]}
        className="flex items-center justify-center"
        style={{ width, height, fontSize: width * 0.6 }}
      >
        {getEnemyEmoji()}
      </motion.div>
    );
  }

  return (
    <motion.div
      animate={animations[action]}
      className="relative"
      style={{ width, height }}
    >
      <Image
        src={imagePath}
        alt={`${enemyType} ${action}`}
        width={width}
        height={height}
        onError={() => setImageError(true)}
        className="pixelated"
      />
    </motion.div>
  );
}