'use client';

import { motion } from 'framer-motion';
import { formatWeiCompact, weiToEth, formatWeiAsInteger } from '@/utils/ethereum';

interface ETHDisplayProps {
  amount: bigint;
  showAnimation?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function ETHDisplay({ amount = BigInt(0), showAnimation = false, size = 'md' }: ETHDisplayProps) {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };
  
  const containerPadding = {
    sm: 'px-2 py-1',
    md: 'px-3 py-1.5',
    lg: 'px-4 py-2'
  };

  // Format wei in a compact, readable format
  const formattedAmount = formatWeiCompact(amount || BigInt(0));

  return (
    <motion.div
      initial={showAnimation ? { scale: 0, opacity: 0 } : {}}
      animate={showAnimation ? { scale: 1, opacity: 1 } : {}}
      transition={{ type: "spring", stiffness: 300 }}
      className={`
        inline-flex items-center gap-1 rounded-md
        bg-gradient-to-r from-purple-900/60 to-purple-700/60
        border border-purple-500/30
        ${containerPadding[size]} ${sizeClasses[size]}
      `}
    >
      {/* ETH Icon with glow effect */}
      <div className="relative">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`relative z-10 flex items-center justify-center ${iconSizes[size]}`}
        >
          <svg
            viewBox="0 0 256 417"
            preserveAspectRatio="xMidYMid"
            className="w-full h-full fill-purple-300"
          >
            <path d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z"/>
            <path d="M127.962 0L0 212.32l127.962 75.639V154.158z"/>
            <path d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z"/>
            <path d="M127.962 416.905v-104.72L0 236.585z"/>
            <path d="M127.961 287.958l127.96-75.637-127.96-58.162z"/>
            <path d="M0 212.32l127.96 75.638v-133.8z"/>
          </svg>
        </motion.div>
      </div>

      {/* Amount display */}
      <span className="font-semibold text-white">
        {formattedAmount} ETH
      </span>

      {/* Sparkle effects */}
      {showAnimation && (
        <>
          <motion.div
            initial={{ scale: 0, x: -20, y: -10 }}
            animate={{ scale: [0, 1, 0], x: 20, y: -20 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="absolute text-yellow-300"
          >
            ✨
          </motion.div>
          <motion.div
            initial={{ scale: 0, x: 10, y: 10 }}
            animate={{ scale: [0, 1, 0], x: -10, y: 20 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute text-yellow-300"
          >
            ✨
          </motion.div>
        </>
      )}
    </motion.div>
  );
}

// ETH change animation component
export function ETHChangeAnimation({ 
  amount, 
  isPositive = true 
}: { 
  amount: bigint; 
  isPositive?: boolean;
}) {
  return (
    <motion.div
      initial={{ y: 0, opacity: 1 }}
      animate={{ y: isPositive ? -50 : 50, opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
      className={`
        absolute text-2xl font-bold
        ${isPositive ? 'text-green-400' : 'text-red-400'}
      `}
      style={{
        textShadow: `0 0 10px ${isPositive ? 'rgba(74, 222, 128, 0.8)' : 'rgba(248, 113, 113, 0.8)'}`
      }}
    >
      {isPositive ? '+' : '-'}{formatWeiCompact(amount)} ETH
    </motion.div>
  );
}

// Gas fee indicator
export function GasIndicator({ gasUsed = BigInt(10000000000000) }: { gasUsed?: bigint }) {
  return (
    <div className="flex items-center gap-1 text-xs text-gray-400">
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-2 h-2 bg-orange-500 rounded-full"
      />
      <span>Gas: {formatWeiCompact(gasUsed)} ETH</span>
    </div>
  );
}