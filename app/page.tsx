'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CharacterAvatar from '@/components/CharacterAvatar';

const characters = [
  { 
    id: 'josh', 
    name: 'Josh', 
    title: '勇者',
    description: '标准难度 - 适合有一定数学基础的玩家',
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
    description: '难度自动降低一级 - 适合初学者',
    hp: 100,
    attack: 20,
    defense: 10,
    color: '#5D4037',
    bgGradient: 'from-amber-800 via-amber-600 to-yellow-600',
    difficulty: 'MEDIUM',
    skills: ['精准射击', '快速闪避', '魔法箭'],
    sprite: '🏹',
    avatar: '🎯'
  },
];

export default function Home() {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (selectedUser) {
      setShowWelcome(true);
      const character = characters.find(c => c.id === selectedUser);
      localStorage.setItem('currentUser', selectedUser);
      localStorage.setItem('userDifficulty', character?.difficulty || 'EASY');
      
      setTimeout(() => {
        window.location.href = '/hub';
      }, 2500);
    }
  }, [selectedUser]);

  const handleUserSelect = (userId: string) => {
    setSelectedUser(userId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-hidden relative">
      {/* 塞尔达风格背景 */}
      <div className="absolute inset-0">
        {/* 背景图案 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.05) 35px, rgba(255,255,255,.05) 70px)`,
          }}></div>
        </div>
        
        {/* 发光粒子效果 */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -40, -20],
              opacity: [0.2, 1, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8 safe-top safe-bottom">
        {/* 游戏标题 */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="relative">
            {/* 标题边框装饰 */}
            <div className="absolute inset-0 -m-4 border-4 border-yellow-600 rounded-lg opacity-50"></div>
            <div className="absolute inset-0 -m-2 border-2 border-yellow-400 rounded-lg"></div>
            
            <h1 className="text-5xl ipad:text-6xl font-bold mb-4 text-yellow-300 relative px-8 py-4"
                style={{
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(255,215,0,0.5)',
                  fontFamily: 'Georgia, serif',
                  letterSpacing: '2px'
                }}>
              数学地下城
            </h1>
            <p className="text-lg ipad:text-xl text-gray-300 font-medium">
              选择你的英雄，开始冒险
            </p>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {!showWelcome ? (
            <motion.div 
              key="selection"
              className="grid grid-cols-1 ipad:grid-cols-2 gap-8 max-w-4xl w-full"
            >
              {characters.map((character, index) => (
                <motion.div
                  key={character.id}
                  initial={{ x: index === 0 ? -100 : 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleUserSelect(character.id)}
                  className="relative cursor-pointer"
                >
                  {/* 角色卡片 */}
                  <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg overflow-hidden border-2 border-yellow-600 shadow-2xl">
                    {/* 顶部装饰 */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
                    
                    <div className="p-6">
                      {/* 角色精灵 */}
                      <div className="relative h-32 mb-4">
                        <motion.div
                          animate={{ x: [0, 10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <CharacterAvatar character={character.id as 'josh' | 'abby'} size="xl" />
                        </motion.div>
                        
                        {/* HP/攻击力显示 */}
                        <div className="absolute top-0 left-0 bg-black/50 rounded px-2 py-1">
                          <div className="text-xs text-red-400">HP: {character.hp}</div>
                          <div className="text-xs text-yellow-400">ATK: {character.attack}</div>
                          <div className="text-xs text-blue-400">DEF: {character.defense}</div>
                        </div>
                      </div>

                      {/* 角色信息 */}
                      <div className="text-center mb-4">
                        <h3 className="text-2xl font-bold text-yellow-300 mb-1">
                          {character.name}
                        </h3>
                        <p className="text-sm text-gray-400 mb-2">{character.title}</p>
                        <p className="text-xs text-gray-500">{character.description}</p>
                      </div>

                      {/* 技能列表 */}
                      <div className="space-y-1 mb-4">
                        {character.skills.map((skill, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <span className="text-yellow-500">▸</span>
                            <span className="text-gray-300">{skill}</span>
                          </div>
                        ))}
                      </div>

                      {/* 选择按钮 */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full py-2 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white font-bold rounded border border-yellow-500 hover:from-yellow-500 hover:to-yellow-600 transition-all"
                      >
                        选择此角色
                      </motion.button>
                    </div>

                    {/* 底部装饰 */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="welcome"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="text-center relative"
            >
              {/* 背景光环效果 */}
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 -z-10"
              >
                <div className={`w-96 h-96 mx-auto bg-gradient-to-br ${characters.find(c => c.id === selectedUser)?.bgGradient} rounded-full blur-3xl`}></div>
              </motion.div>
              
              <motion.div
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-9xl mb-8 relative"
              >
                {characters.find(c => c.id === selectedUser)?.sprite}
                
                {/* 闪光效果 */}
                <motion.div
                  animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute top-0 right-0 text-5xl"
                >
                  ✨
                </motion.div>
              </motion.div>
              
              <h2 className="text-4xl ipad:text-5xl font-black mb-4 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                准备好了，{characters.find(c => c.id === selectedUser)?.name}！
              </h2>
              <p className="text-xl ipad:text-2xl text-gray-600 mb-8 font-medium">
                数学冒险即将开始...
              </p>
              
              {/* 加载动画 */}
              <div className="flex justify-center gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      y: [0, -20, 0],
                      backgroundColor: ["#FFD700", "#FF69B4", "#9370DB", "#FFD700"]
                    }}
                    transition={{ 
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                    className="w-4 h-4 rounded-full"
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 底部装饰 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 text-center"
        >
          <p className="text-sm text-gray-400">
            家长模式：长按屏幕3秒
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