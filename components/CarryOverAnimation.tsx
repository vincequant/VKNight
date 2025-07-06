'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CarryOverAnimationProps {
  num1: number;
  num2: number;
  onComplete?: () => void;
}

export default function CarryOverAnimation({ num1, num2, onComplete }: CarryOverAnimationProps) {
  const [step, setStep] = useState(0);
  const [showResult, setShowResult] = useState(false);
  
  const ones1 = num1 % 10;
  const tens1 = Math.floor(num1 / 10);
  const ones2 = num2 % 10;
  const tens2 = Math.floor(num2 / 10);
  
  const onesSum = ones1 + ones2;
  const needsCarry = onesSum >= 10;
  const carryAmount = needsCarry ? 1 : 0;
  const finalOnes = onesSum % 10;
  const finalTens = tens1 + tens2 + carryAmount;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (step < 4) {
        setStep(step + 1);
      } else {
        setShowResult(true);
        onComplete?.();
      }
    }, 1500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  return (
    <div className="relative w-full max-w-md mx-auto p-8 bg-white rounded-3xl shadow-xl">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">借十法演示</h3>
        <p className="text-gray-600">{num1} + {num2} = ?</p>
      </div>

      <div className="relative h-64">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="grid grid-cols-2 gap-8">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-6xl font-bold text-blue-500"
              >
                {tens1}{ones1}
              </motion.div>
            </div>
            
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-6xl font-bold text-green-500"
              >
                {tens2}{ones2}
              </motion.div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {step >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
            >
              <div className="bg-yellow-100 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-700 mb-2">先加个位数</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {ones1} + {ones2} = {onesSum}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {step >= 2 && needsCarry && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-0 left-1/2 transform -translate-x-1/2"
            >
              <div className="bg-orange-100 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-2">满十进一</p>
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: 2, duration: 0.5 }}
                  className="text-3xl font-bold text-orange-500 text-center"
                >
                  +1 ↑
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {step >= 3 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="absolute top-1/2 left-0 transform -translate-y-1/2"
            >
              <div className="bg-purple-100 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-2">再加十位数</p>
                <p className="text-2xl font-bold text-purple-600">
                  {tens1} + {tens2} {needsCarry && '+ 1'} = {finalTens}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-2xl"
            >
              <div className="text-center">
                <p className="text-2xl text-gray-600 mb-4">答案是</p>
                <p className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                  {finalTens}{finalOnes}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 flex justify-center gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ backgroundColor: '#E5E7EB' }}
            animate={{ 
              backgroundColor: i <= step ? '#8B5CF6' : '#E5E7EB' 
            }}
            className="w-3 h-3 rounded-full"
          />
        ))}
      </div>
    </div>
  );
}