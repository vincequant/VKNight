'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CharacterAvatar from '@/components/CharacterAvatar';
import MagicalParticles from '@/app/components/MagicalParticles';
import HomeNavbar from '@/app/components/HomeNavbar';
import CharacterCard3D from '@/app/components/CharacterCard3D';
import EnhancedLoadingScreen from '@/app/components/EnhancedLoadingScreen';
import { migrateStorageKeys } from '@/lib/migrateStorage';

const characters = [
  { 
    id: 'josh', 
    name: 'Josh', 
    title: '勇者',
    description: '标准模式 - 正常的题目难度和战斗伤害',
    hp: 120,
    attack: 25,
    defense: 15,
    color: '#2E7D32',
    bgGradient: 'from-green-800 via-green-600 to-emerald-600',
    difficulty: 'MEDIUM',
    skills: ['剑术精通', '盾牌格挡', '连击斩'],
    sprite: '🗡️',
    avatar: '⚔️'
  },
  { 
    id: 'abby', 
    name: 'Abby', 
    title: '弓箭手',
    description: '简单模式 - 更简单的题目、更多时间、伤害减半',
    hp: 100,
    attack: 20,
    defense: 10,
    color: '#5D4037',
    bgGradient: 'from-amber-800 via-amber-600 to-yellow-600',
    difficulty: 'EASY',
    skills: ['精准射击', '快速闪避', '魔法箭'],
    sprite: '🏹',
    avatar: '🎯'
  },
];

export default function Home() {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Run storage migration on app load
    migrateStorageKeys();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      setShowWelcome(true);
      const character = characters.find(c => c.id === selectedUser);
      localStorage.setItem('currentUser', selectedUser);
      localStorage.setItem('userDifficulty', character?.difficulty || 'EASY');
      
      // Clear any existing vince god mode data if selecting a normal character
      if (selectedUser !== 'vince') {
        // Remove vince data to prevent contamination
        const vinceData = localStorage.getItem('character_vince');
        if (vinceData) {
          // Check if current character has been contaminated with vince data
          const currentCharData = localStorage.getItem(`character_${selectedUser}`);
          if (currentCharData) {
            try {
              const charData = JSON.parse(currentCharData);
              // If character has unrealistic stats (higher than possible at level 30), remove the data
              // Max level 30 would have approximately: HP ~400, Attack ~110, Defense ~70
              if (charData.level > 50 || charData.baseHp > 500 || charData.baseAttack > 150 || charData.baseDefense > 100) {
                console.log(`Removing contaminated character data for ${selectedUser}`);
                localStorage.removeItem(`character_${selectedUser}`);
                localStorage.removeItem(`ownedEquipment_${selectedUser}`);
              }
            } catch (e) {
              // If JSON parsing fails, data might be in new format with bigint
              // Don't delete unless we're sure it's corrupted
              console.log('Character data in new format, skipping contamination check');
            }
          }
        }
      }
      
      setTimeout(() => {
        window.location.href = '/hub';
      }, 2500);
    }
  }, [selectedUser]);

  const handleUserSelect = (userId: string) => {
    setSelectedUser(userId);
  };

  return (
    <div className="min-h-screen bg-gray-900 overflow-hidden relative">
      {/* 背景图片 */}
      <div className="absolute inset-0 z-0">
        {/* 如果有背景图片，使用下面的代码 */}
        {/* <Image
          src="/images/backgrounds/fantasy_world_map.jpg"
          alt="Fantasy World Map"
          fill
          className="object-cover"
          priority
        /> */}
        
        {/* 临时渐变背景 */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900" />
        
        {/* 半透明遮罩层 */}
        <div className="absolute inset-0 bg-black/40" />
      </div>
      
      {/* 魔法粒子效果 */}
      <MagicalParticles />
      
      {/* 导航栏 */}
      <HomeNavbar />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8 pt-28 safe-bottom">
        {/* 英雄展示区 */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl ipad:text-7xl font-bold mb-6"
              style={{
                background: 'linear-gradient(to right, #facc15, #fbbf24)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 40px rgba(250, 204, 21, 0.5)',
                letterSpacing: '2px'
              }}>
            数学地下城
          </h1>
          <p className="text-xl ipad:text-2xl text-gray-300 mb-8">
            选择你的英雄，开始冒险
          </p>
          
          {/* 开始游戏按钮 */}
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-12 py-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 font-bold text-xl rounded-xl shadow-2xl shadow-yellow-500/30 hover:shadow-yellow-500/50 transition-all"
            onClick={() => document.getElementById('character-selection')?.scrollIntoView({ behavior: 'smooth' })}
          >
            开始选择英雄
          </motion.button>
        </motion.div>

        <AnimatePresence mode="wait">
          {!showWelcome ? (
            <motion.div 
              key="selection"
              id="character-selection"
              className="grid grid-cols-1 ipad:grid-cols-2 gap-8 max-w-4xl w-full"
            >
              {characters.map((character, index) => (
                <CharacterCard3D
                  key={character.id}
                  character={character}
                  index={index}
                  onSelect={handleUserSelect}
                />
              ))}
            </motion.div>
          ) : (
            <EnhancedLoadingScreen
              characterName={characters.find(c => c.id === selectedUser)?.name || ''}
              characterId={selectedUser as 'josh' | 'abby'}
            />
          )}
        </AnimatePresence>

        {/* 底部版本号 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 text-center"
        >
          <p className="text-xs text-gray-500">
            v0.3.0
          </p>
        </motion.div>
      </div>


      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}