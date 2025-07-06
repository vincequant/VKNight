'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Character, Consumable } from '@/types/game';
import { getConsumableById } from '@/data/consumables';
import { soundManager } from '@/lib/sounds';

interface PotionBarProps {
  character: Character;
  onUsePotion: (potionId: string) => void;
  disabled?: boolean;
}

export default function PotionBar({ character, onUsePotion, disabled = false }: PotionBarProps) {
  const [showPotions, setShowPotions] = useState(false);

  // Get unique potions with their quantities
  const potions = character.inventory
    .filter(item => {
      const consumable = getConsumableById(item.id);
      return consumable && consumable.type === 'potion';
    })
    .map(item => ({
      item,
      consumable: getConsumableById(item.id)!
    }));

  const healthPotions = potions.filter(p => p.consumable.effect === 'heal');
  const manaPotions = potions.filter(p => p.consumable.effect === 'mana');

  const handleUsePotion = (potionId: string) => {
    if (disabled) return;
    
    soundManager.play('powerUp');
    onUsePotion(potionId);
    setShowPotions(false);
  };

  return (
    <div className="relative">
      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowPotions(!showPotions)}
        disabled={disabled}
        className={`
          px-4 py-2 rounded-lg font-bold flex items-center gap-2
          ${disabled ? 'bg-gray-700 text-gray-500' : 'bg-purple-600 hover:bg-purple-700 text-white'}
        `}
      >
        <span>🧪</span>
        <span>药水</span>
        {potions.length > 0 && (
          <span className="bg-white/20 px-2 py-0.5 rounded text-sm">
            {potions.reduce((sum, p) => sum + p.item.quantity, 0)}
          </span>
        )}
      </motion.button>

      {/* Potion Menu */}
      <AnimatePresence>
        {showPotions && potions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute bottom-full mb-2 left-0 bg-gray-800 rounded-lg p-4 min-w-[250px] border-2 border-purple-500 shadow-xl"
          >
            <h3 className="text-white font-bold mb-3">选择药水</h3>
            
            {/* Health Potions */}
            {healthPotions.length > 0 && (
              <div className="mb-4">
                <div className="text-sm text-gray-400 mb-2">生命药水</div>
                <div className="space-y-2">
                  {healthPotions.map(({ item, consumable }) => {
                    const isFullHp = character.hp >= character.maxHp;
                    const canUse = !isFullHp && !disabled;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleUsePotion(item.id)}
                        disabled={!canUse}
                        className={`
                          w-full p-3 rounded-lg flex items-center justify-between
                          ${canUse 
                            ? 'bg-red-600 hover:bg-red-700 text-white' 
                            : 'bg-gray-700 text-gray-500'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{consumable.icon}</span>
                          <div className="text-left">
                            <div className="font-bold">{consumable.name}</div>
                            <div className="text-sm opacity-80">
                              恢复 {consumable.value === 999999 ? '全部' : consumable.value} HP
                            </div>
                          </div>
                        </div>
                        <div className="text-xl font-bold">×{item.quantity}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Mana Potions */}
            {manaPotions.length > 0 && (
              <div>
                <div className="text-sm text-gray-400 mb-2">魔法药水</div>
                <div className="space-y-2">
                  {manaPotions.map(({ item, consumable }) => {
                    const isFullMp = character.mp >= character.maxMp;
                    const canUse = !isFullMp && !disabled;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleUsePotion(item.id)}
                        disabled={!canUse}
                        className={`
                          w-full p-3 rounded-lg flex items-center justify-between
                          ${canUse 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                            : 'bg-gray-700 text-gray-500'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{consumable.icon}</span>
                          <div className="text-left">
                            <div className="font-bold">{consumable.name}</div>
                            <div className="text-sm opacity-80">
                              恢复 {consumable.value === 999999 ? '全部' : consumable.value} MP
                            </div>
                          </div>
                        </div>
                        <div className="text-xl font-bold">×{item.quantity}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* HP/MP Status */}
            <div className="mt-4 pt-3 border-t border-gray-700">
              <div className="flex justify-between text-sm">
                <div className="text-red-400">
                  HP: {character.hp}/{character.maxHp}
                </div>
                <div className="text-blue-400">
                  MP: {character.mp}/{character.maxMp}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* No Potions Message */}
      <AnimatePresence>
        {showPotions && potions.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute bottom-full mb-2 left-0 bg-gray-800 rounded-lg p-4 min-w-[200px] border-2 border-purple-500"
          >
            <p className="text-gray-400">没有药水了！</p>
            <p className="text-sm text-gray-500 mt-1">去商店购买吧</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}