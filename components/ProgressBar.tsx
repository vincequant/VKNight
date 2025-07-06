'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  score: number;
  total: number;
  streak: number;
}

export default function ProgressBar({ score, total, streak }: ProgressBarProps) {
  const percentage = total > 0 ? (score / total) * 100 : 0;

  return (
    <motion.div 
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border-2 border-white/50"
    >
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* 正确率 */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="text-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4"
        >
          <div className="flex items-center justify-center gap-1 mb-2">
            <span className="text-lg">🎯</span>
            <p className="text-gray-600 text-sm font-medium">正确率</p>
          </div>
          <motion.p 
            key={percentage}
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-500"
          >
            {total > 0 ? Math.round(percentage) : 0}%
          </motion.p>
        </motion.div>
        
        {/* 答对题数 */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="text-center bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4"
        >
          <div className="flex items-center justify-center gap-1 mb-2">
            <span className="text-lg">📊</span>
            <p className="text-gray-600 text-sm font-medium">进度</p>
          </div>
          <motion.p 
            key={score}
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500"
          >
            {score}/{total}
          </motion.p>
        </motion.div>
        
        {/* 连击数 */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="text-center bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-4"
        >
          <div className="flex items-center justify-center gap-1 mb-2">
            <span className="text-lg">⚡</span>
            <p className="text-gray-600 text-sm font-medium">连击</p>
          </div>
          <div className="flex items-center justify-center gap-1">
            <motion.p 
              key={streak}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500"
            >
              {streak}
            </motion.p>
            {streak >= 3 && (
              <motion.span
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className="text-2xl"
              >
                🔥
              </motion.span>
            )}
          </div>
        </motion.div>
      </div>

      {/* 进度条 */}
      <div className="relative">
        <div className="w-full bg-gray-100 rounded-full h-6 overflow-hidden shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, type: "spring" }}
            className="h-full relative overflow-hidden"
          >
            {/* 渐变背景 */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400"></div>
            
            {/* 光泽效果 */}
            <motion.div
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            />
          </motion.div>
        </div>
        
        {/* 进度条装饰 */}
        {percentage > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{ left: `${Math.min(percentage, 95)}%` }}
            className="absolute -top-2 transform -translate-x-1/2"
          >
            <motion.span
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-2xl"
            >
              🌟
            </motion.span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}