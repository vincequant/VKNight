'use client';

import { motion } from 'framer-motion';

interface CoinDisplayProps {
  coins: number;
}

export default function CoinDisplay({ coins }: CoinDisplayProps) {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-bold px-4 py-2 rounded-full flex items-center gap-2 shadow-lg"
    >
      <motion.span
        key={coins}
        initial={{ scale: 1.5, rotate: 360 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="text-2xl"
      >
        🪙
      </motion.span>
      <motion.span 
        key={`coin-${coins}`}
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        className="text-xl font-bold"
      >
        {coins}
      </motion.span>
    </motion.div>
  );
}