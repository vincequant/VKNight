'use client'

import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { useState } from 'react'
import CharacterAvatar from '@/components/CharacterAvatar'

interface Character {
  id: string
  name: string
  title: string
  description: string
  hp: number
  attack: number
  defense: number
  color: string
  bgGradient: string
  difficulty: string
  skills: string[]
  sprite: string
  avatar: string
}

interface CharacterCard3DProps {
  character: Character
  index: number
  onSelect: (id: string) => void
}

export default function CharacterCard3D({ character, index, onSelect }: CharacterCard3DProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"])
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }
  
  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }

  return (
    <motion.div
      initial={{ x: index === 0 ? -100 : 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: index * 0.2 }}
      whileHover={{ scale: 1.02 }}
      onClick={() => onSelect(character.id)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative cursor-pointer"
      style={{
        transformStyle: "preserve-3d",
        transform: isHovered ? "translateZ(50px)" : "translateZ(0)",
      }}
    >
      <motion.div
        style={{
          rotateX: rotateX,
          rotateY: rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative"
      >
        {/* 发光效果 */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute -inset-4 rounded-lg"
            style={{
              background: `radial-gradient(circle at center, ${character.color}40 0%, transparent 70%)`,
              filter: 'blur(20px)',
            }}
          />
        )}
        
        {/* 角色卡片 */}
        <div className={`relative bg-gray-800/90 backdrop-blur-sm rounded-lg overflow-hidden border ${isHovered ? 'border-yellow-600' : 'border-gray-700'} shadow-2xl transition-all duration-300`}
             style={{
               boxShadow: isHovered ? `0 20px 40px ${character.color}40` : '0 10px 30px rgba(0,0,0,0.5)',
               transform: "translateZ(20px)"
             }}>
          
          {/* 顶部渐变条 */}
          <motion.div 
            className={`h-2 bg-gradient-to-r ${character.bgGradient}`}
            animate={{ scaleX: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.3 }}
          />
          
          <div className="p-6">
            {/* 角色精灵 */}
            <div className="relative h-32 mb-4">
              <motion.div
                animate={{ 
                  x: isHovered ? [0, 5, -5, 0] : [0, 10, 0],
                  y: isHovered ? [0, -10, 0] : 0,
                  rotate: isHovered ? [0, 5, -5, 0] : 0
                }}
                transition={{ 
                  duration: isHovered ? 0.5 : 2, 
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="absolute inset-0 flex items-center justify-center"
                style={{ transform: "translateZ(30px)" }}
              >
                <CharacterAvatar character={character.id as 'josh' | 'abby'} size="xl" />
              </motion.div>
              
              {/* HP/攻击力显示 */}
              <motion.div 
                className="absolute top-0 left-0 bg-black/70 rounded px-2 py-1 backdrop-blur-sm"
                style={{ transform: "translateZ(40px)" }}
                whileHover={{ scale: 1.1 }}
              >
                <div className="text-xs text-red-400">HP: {character.hp}</div>
                <div className="text-xs text-yellow-400">ATK: {character.attack}</div>
                <div className="text-xs text-blue-400">DEF: {character.defense}</div>
              </motion.div>
            </div>

            {/* 角色信息 */}
            <div className="text-center mb-4" style={{ transform: "translateZ(25px)" }}>
              <h3 className="text-2xl font-bold mb-1"
                  style={{
                    background: isHovered ? 'linear-gradient(to right, #facc15, #fbbf24)' : 'none',
                    WebkitBackgroundClip: isHovered ? 'text' : 'unset',
                    WebkitTextFillColor: isHovered ? 'transparent' : '#fcd34d',
                    textShadow: isHovered ? '0 0 20px rgba(250, 204, 21, 0.5)' : 'none'
                  }}>
                {character.name}
              </h3>
              <p className="text-sm text-gray-400 mb-2">{character.title}</p>
              <p className="text-xs text-gray-500">{character.description}</p>
            </div>

            {/* 技能列表 */}
            <motion.div 
              className="space-y-1 mb-4"
              style={{ transform: "translateZ(20px)" }}
            >
              {character.skills.map((skill, idx) => (
                <motion.div 
                  key={idx} 
                  className="flex items-center gap-2 text-sm"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.2 + idx * 0.1 }}
                >
                  <span className="text-yellow-500">▸</span>
                  <span className="text-gray-300">{skill}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* 选择按钮 */}
            <motion.button
              whileHover={{ scale: 1.05, translateZ: 10 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 font-bold rounded-lg shadow-lg transition-all relative overflow-hidden"
              style={{
                boxShadow: isHovered ? '0 0 30px rgba(250, 204, 21, 0.5)' : '0 0 20px rgba(250, 204, 21, 0.3)',
                transform: "translateZ(30px)"
              }}
            >
              <span className="relative z-10">选择此角色</span>
              {isHovered && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-amber-400"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  style={{ opacity: 0.3 }}
                />
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}