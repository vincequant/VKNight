'use client'

import { motion } from 'framer-motion'
import CharacterAvatar from '@/components/CharacterAvatar'
import { useEffect, useState } from 'react'

interface EnhancedLoadingScreenProps {
  characterName: string
  characterId: 'josh' | 'abby'
}

export default function EnhancedLoadingScreen({ characterName, characterId }: EnhancedLoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 2
      })
    }, 40)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
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
        <div className="w-96 h-96 mx-auto bg-gradient-to-br from-yellow-600/20 via-amber-500/20 to-orange-600/20 rounded-full blur-3xl"></div>
      </motion.div>
      
      {/* 剑的动画 */}
      <motion.div
        initial={{ y: -200, opacity: 0, rotate: 45 }}
        animate={{ 
          y: 0, 
          opacity: 1, 
          rotate: 0,
        }}
        transition={{ 
          type: "spring",
          stiffness: 100,
          damping: 10,
          duration: 1
        }}
        className="text-9xl mb-8 relative inline-block"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            filter: [
              "drop-shadow(0 0 20px rgba(250, 204, 21, 0.5))",
              "drop-shadow(0 0 40px rgba(250, 204, 21, 0.8))",
              "drop-shadow(0 0 20px rgba(250, 204, 21, 0.5))"
            ]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          ⚔️
        </motion.div>
        
        {/* 光环扩散效果 */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
        >
          <div className="w-20 h-20 rounded-full border-4 border-yellow-400" />
        </motion.div>
        
        {/* 火花粒子 */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full"
            initial={{ 
              x: 0, 
              y: 0,
              opacity: 0 
            }}
            animate={{
              x: Math.cos(i * 60 * Math.PI / 180) * 100,
              y: Math.sin(i * 60 * Math.PI / 180) * 100,
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeOut"
            }}
          />
        ))}
      </motion.div>
      
      {/* 角色立绘 */}
      <motion.div
        initial={{ scale: 0, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mb-8"
      >
        <CharacterAvatar character={characterId} size="2xl" />
      </motion.div>
      
      {/* 文字效果 */}
      <motion.h2 
        className="text-4xl ipad:text-5xl font-black mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <span className="bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 bg-clip-text text-transparent">
          准备好了，
        </span>
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2 }}
          className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent"
        >
          {characterName}！
        </motion.span>
      </motion.h2>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="text-xl ipad:text-2xl text-gray-400 mb-8 font-medium"
      >
        数学冒险即将开始...
      </motion.p>
      
      {/* 进度条 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6 }}
        className="max-w-xs mx-auto mb-6"
      >
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-yellow-400 to-amber-500"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">{progress}%</p>
      </motion.div>
      
      {/* 加载动画点 */}
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
      
      {/* 底部提示 */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 2 }}
        className="text-xs text-gray-600 mt-8"
      >
        家长模式：长按屏幕3秒
      </motion.p>
    </motion.div>
  )
}