'use client';

import { motion } from 'framer-motion';
import { Question } from '@/types';
import { useEffect, useState } from 'react';

interface QuestionDisplayProps {
  question: Question;
  showResult: 'correct' | 'incorrect' | null;
}

export default function QuestionDisplay({ question, showResult }: QuestionDisplayProps) {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (question.type === 'addition' && question.visualElements) {
      setShowAnimation(true);
    }
  }, [question]);

  return (
    <div className="text-center mb-8">
      {/* 题目展示 */}
      <motion.div
        key={question.id}
        initial={{ scale: 0.8, opacity: 0, y: -20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="relative inline-block"
      >
        {/* 背景装饰 */}
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute inset-0 -z-10"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 to-pink-200 rounded-3xl blur-2xl opacity-50"></div>
        </motion.div>
        
        <h2 className="text-5xl ipad:text-6xl font-black mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent p-6 relative">
          {question.question}
          
          {/* 装饰星星 */}
          <motion.span
            animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-4 -right-4 text-3xl"
          >
            ⭐
          </motion.span>
        </h2>
      </motion.div>

      {question.visualElements && showAnimation && (
        <div className="relative h-48 mb-8">
          {question.visualElements.map((element, index) => (
            <motion.div
              key={index}
              initial={{ 
                x: element.position?.x || 0,
                y: element.position?.y || 0,
                scale: 0 
              }}
              animate={{ 
                x: element.position?.x || 0,
                y: element.position?.y || 0,
                scale: 1 
              }}
              transition={{ 
                delay: index * 0.05,
                type: "spring",
                stiffness: 300
              }}
              className="absolute w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold shadow-lg"
              style={{ backgroundColor: element.color }}
            >
              {element.value}
            </motion.div>
          ))}
        </div>
      )}

      {/* 结果反馈 */}
      {showResult && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, repeat: 2 }}
            className={`text-7xl mb-4 ${
              showResult === 'correct' 
                ? 'drop-shadow-[0_0_30px_rgba(34,197,94,0.5)]' 
                : 'drop-shadow-[0_0_30px_rgba(239,68,68,0.5)]'
            }`}
          >
            {showResult === 'correct' ? (
              <span className="text-green-500">✨</span>
            ) : (
              <span className="text-red-500">💫</span>
            )}
          </motion.div>
          
          {/* 反馈文字 */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`text-2xl font-bold ${
              showResult === 'correct' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {showResult === 'correct' ? '太棒了！' : '再试一次！'}
          </motion.p>
        </motion.div>
      )}
    </div>
  );
}