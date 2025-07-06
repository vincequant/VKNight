'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Question } from '@/types';

interface MagicBreakdownProps {
  question: Question;
  onComplete: () => void;
  onCancel: () => void;
}

export default function MagicBreakdown({ question, onComplete, onCancel }: MagicBreakdownProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showMagicEffect, setShowMagicEffect] = useState(true);

  useEffect(() => {
    // Auto-advance through steps
    const timer = setTimeout(() => {
      if (currentStep < getBreakdownSteps().length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        onComplete();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [currentStep]);

  const getBreakdownSteps = () => {
    const { num1, num2, operator } = question;
    
    if (operator === '+' && num1 + num2 > 10) {
      // 凑十法
      const toTen = 10 - num1;
      const remaining = num2 - toTen;
      
      return [
        { text: `${num1} + ${num2} = ?`, highlight: 'all' },
        { text: `把 ${num2} 分成 ${toTen} 和 ${remaining}`, highlight: 'split' },
        { text: `${num1} + ${toTen} = 10`, highlight: 'ten' },
        { text: `10 + ${remaining} = ${num1 + num2}`, highlight: 'result' }
      ];
    } else if (operator === '-' && num1 > 10) {
      // 破十法
      const fromTen = num2 - (num1 - 10);
      
      return [
        { text: `${num1} - ${num2} = ?`, highlight: 'all' },
        { text: `把 ${num1} 分成 10 和 ${num1 - 10}`, highlight: 'split' },
        { text: `10 - ${num2} = ${10 - num2}`, highlight: 'ten' },
        { text: `${10 - num2} + ${num1 - 10} = ${num1 - num2}`, highlight: 'result' }
      ];
    } else if (operator === '*') {
      // 乘法分解
      return [
        { text: `${num1} × ${num2} = ?`, highlight: 'all' },
        { text: `${num1} 个 ${num2} 相加`, highlight: 'explain' },
        { text: Array(num1).fill(num2).join(' + '), highlight: 'expand' },
        { text: `= ${num1 * num2}`, highlight: 'result' }
      ];
    } else if (operator === '/') {
      // 除法可视化
      return [
        { text: `${num1} ÷ ${num2} = ?`, highlight: 'all' },
        { text: `把 ${num1} 平均分成 ${num2} 份`, highlight: 'explain' },
        { text: `每份是 ${num1 / num2}`, highlight: 'result' }
      ];
    } else {
      // 简单运算
      return [
        { text: `${num1} ${operator} ${num2} = ?`, highlight: 'all' },
        { text: `= ${question.answer}`, highlight: 'result' }
      ];
    }
  };

  const steps = getBreakdownSteps();
  const currentStepData = steps[currentStep];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
        onClick={onCancel}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-xl p-8 max-w-2xl w-full border-4 border-purple-500 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Magic Header */}
          <div className="text-center mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-block text-6xl mb-4"
            >
              ✨
            </motion.div>
            <h2 className="text-3xl font-bold text-white">魔法拆解术！</h2>
            <p className="text-purple-300 mt-2">让数学变得简单</p>
          </div>

          {/* Breakdown Steps */}
          <div className="bg-black/30 rounded-lg p-6 mb-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                className="text-center"
              >
                <div className={`text-4xl font-bold mb-4 ${
                  currentStepData.highlight === 'result' ? 'text-green-400' :
                  currentStepData.highlight === 'ten' ? 'text-blue-400' :
                  currentStepData.highlight === 'split' ? 'text-yellow-400' :
                  'text-white'
                }`}>
                  {currentStepData.text}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-full"
                  animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-4 h-4 rounded-full ${
                      index <= currentStep ? 'bg-purple-500' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Magic Effects */}
          {showMagicEffect && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-purple-400 rounded-full"
                  initial={{
                    x: Math.random() * 400 - 200,
                    y: Math.random() * 400 - 200,
                    opacity: 0
                  }}
                  animate={{
                    x: Math.random() * 400 - 200,
                    y: Math.random() * 400 - 200,
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-bold"
            >
              跳过
            </button>
            <button
              onClick={() => setCurrentStep(Math.min(currentStep + 1, steps.length - 1))}
              className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-3 rounded-lg font-bold"
            >
              下一步
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}