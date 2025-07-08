'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface QuestionTimerProps {
  timeLimit: number; // 秒
  onTimeout: () => void;
  isActive: boolean;
}

export default function QuestionTimer({ timeLimit, onTimeout, isActive }: QuestionTimerProps) {
  const [remainingTime, setRemainingTime] = useState(timeLimit);
  const [isWarning, setIsWarning] = useState(false);
  
  useEffect(() => {
    // 重置计时器
    setRemainingTime(timeLimit);
    setIsWarning(false);
  }, [timeLimit]);
  
  useEffect(() => {
    if (!isActive || remainingTime <= 0) return;
    
    const timer = setInterval(() => {
      setRemainingTime(prev => {
        const newTime = prev - 1;
        
        // 警告状态（剩余20%时间）
        if (newTime <= timeLimit * 0.2 && !isWarning) {
          setIsWarning(true);
        }
        
        // 时间到
        if (newTime <= 0) {
          onTimeout();
          return 0;
        }
        
        return newTime;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isActive, remainingTime, timeLimit, onTimeout, isWarning]);
  
  const percentage = (remainingTime / timeLimit) * 100;
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  
  return (
    <div className="absolute top-4 right-4 z-20">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`relative ${isWarning ? 'animate-pulse' : ''}`}
      >
        {/* 圆形进度条 */}
        <svg width="80" height="80" className="transform -rotate-90">
          <circle
            cx="40"
            cy="40"
            r="35"
            stroke="#4a5568"
            strokeWidth="8"
            fill="none"
          />
          <motion.circle
            cx="40"
            cy="40"
            r="35"
            stroke={isWarning ? "#f56565" : "#48bb78"}
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 35}`}
            strokeDashoffset={`${2 * Math.PI * 35 * (1 - percentage / 100)}`}
            strokeLinecap="round"
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: `${2 * Math.PI * 35 * (1 - percentage / 100)}` }}
            transition={{ duration: 0.3 }}
          />
        </svg>
        
        {/* 时间文字 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <motion.div
              className={`text-2xl font-bold ${
                isWarning ? 'text-red-400' : 'text-white'
              }`}
              animate={isWarning ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              {minutes > 0 ? `${minutes}:${seconds.toString().padStart(2, '0')}` : `${seconds}s`}
            </motion.div>
            {isWarning && (
              <div className="text-xs text-red-400">快点！</div>
            )}
          </div>
        </div>
      </motion.div>
      
      {/* 警告效果 */}
      {isWarning && (
        <motion.div
          className="absolute inset-0 rounded-full bg-red-500"
          initial={{ scale: 1, opacity: 0.3 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </div>
  );
}