'use client';

import { motion } from 'framer-motion';
import { soundManager } from '@/lib/sounds';
import { useState } from 'react';

interface AnswerPadProps {
  options: number[];
  onAnswer: (answer: number) => void;
  disabled: boolean;
}

const buttonColors = [
  'from-pink-400 to-rose-500',
  'from-purple-400 to-indigo-500',
  'from-blue-400 to-cyan-500',
  'from-emerald-400 to-teal-500',
];

export default function AnswerPad({ options, onAnswer, disabled }: AnswerPadProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleClick = (answer: number) => {
    if (!disabled) {
      soundManager.play('buttonClick');
      onAnswer(answer);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-6 mt-8 max-w-lg mx-auto">
      {options.map((option, index) => (
        <motion.button
          key={`${option}-${index}`}
          initial={{ scale: 0, rotate: Math.random() * 180 - 90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            delay: index * 0.1,
            type: "spring",
            stiffness: 260,
            damping: 20
          }}
          whileHover={{ scale: disabled ? 1 : 1.05, y: disabled ? 0 : -5 }}
          whileTap={{ scale: disabled ? 1 : 0.95 }}
          onHoverStart={() => setHoveredIndex(index)}
          onHoverEnd={() => setHoveredIndex(null)}
          onClick={() => handleClick(option)}
          disabled={disabled}
          className="relative group"
        >
          {/* 背景光晕 */}
          <motion.div
            animate={{ 
              opacity: hoveredIndex === index && !disabled ? 1 : 0,
              scale: hoveredIndex === index && !disabled ? 1.1 : 1
            }}
            className={`absolute inset-0 bg-gradient-to-br ${buttonColors[index % buttonColors.length]} rounded-3xl blur-xl`}
          />
          
          {/* 主按钮 */}
          <div className={`
            relative py-8 px-10 rounded-3xl text-4xl font-black shadow-xl
            transform transition-all duration-200 overflow-hidden
            ${disabled 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : `bg-gradient-to-br ${buttonColors[index % buttonColors.length]} text-white hover:shadow-2xl`
            }
          `}>
            {/* 内部装饰 */}
            {!disabled && (
              <>
                <motion.div
                  animate={{ 
                    x: hoveredIndex === index ? [0, 100, 0] : 0,
                    opacity: hoveredIndex === index ? [0, 0.3, 0] : 0
                  }}
                  transition={{ duration: 1 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                />
                
                {/* 装饰图标 */}
                <motion.span
                  animate={{ 
                    rotate: hoveredIndex === index ? 360 : 0,
                    scale: hoveredIndex === index ? [1, 1.2, 1] : 1
                  }}
                  transition={{ duration: 0.5 }}
                  className="absolute top-2 right-2 text-xl opacity-50"
                >
                  {index === 0 ? '🌟' : index === 1 ? '💫' : index === 2 ? '✨' : '⭐'}
                </motion.span>
              </>
            )}
            
            {/* 数字 */}
            <span className="relative z-10">{option}</span>
          </div>
        </motion.button>
      ))}
    </div>
  );
}