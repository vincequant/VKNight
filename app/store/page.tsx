'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundManager } from '@/lib/sounds';
import { Character, Equipment, calculateCharacterStats } from '@/types/game';
import { EQUIPMENT_DATA } from '@/data/equipment';
import ETHDisplay from '@/components/ETHDisplay';
import { useRouter } from 'next/navigation';
import { migrateCharacterData } from '@/lib/characterMigration';
import { formatWeiCompact } from '@/utils/ethereum';
import { saveCharacter, deserializeCharacter } from '@/utils/characterStorage';

interface EquipmentWithOwned extends Equipment {
  owned: boolean;
  equipped: boolean;
}

export default function StorePage() {
  const router = useRouter();
  const [character, setCharacter] = useState<Character | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'weapon' | 'armor' | 'shield'>('weapon');
  const [equipment, setEquipment] = useState<EquipmentWithOwned[]>([]);
  const [showPurchaseConfirm, setShowPurchaseConfirm] = useState<Equipment | null>(null);
  const [showInsufficientFunds, setShowInsufficientFunds] = useState(false);
  const [showLevelRequirement, setShowLevelRequirement] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('currentUser') || 'abby';
    const savedCharacter = localStorage.getItem(`character_${user}`);
    
    if (savedCharacter) {
      let char;
      try {
        char = migrateCharacterData(deserializeCharacter(savedCharacter));
      } catch {
        // Fallback for old format
        char = migrateCharacterData(JSON.parse(savedCharacter));
      }
      setCharacter(calculateCharacterStats(char));
      
      // Load owned equipment and mark which ones are owned/equipped
      const ownedEquipment = JSON.parse(localStorage.getItem(`ownedEquipment_${user}`) || '[]');
      const equipmentWithStatus = EQUIPMENT_DATA.map(item => ({
        ...item,
        owned: ownedEquipment.includes(item.id),
        equipped: (
          (char.weapon?.id === item.id) ||
          (char.armor?.id === item.id) ||
          (char.shield?.id === item.id)
        )
      }));
      setEquipment(equipmentWithStatus);
    } else {
      router.push('/');
    }
  }, [router]);

  const handlePurchase = (item: Equipment) => {
    if (!character) return;
    
    if (character.eth < item.price) {
      setShowInsufficientFunds(true);
      setTimeout(() => setShowInsufficientFunds(false), 2000);
      return;
    }
    
    if (character.level < item.levelRequirement) {
      setShowLevelRequirement(true);
      setTimeout(() => setShowLevelRequirement(false), 2000);
      return;
    }
    
    setShowPurchaseConfirm(item);
  };

  const confirmPurchase = () => {
    if (!character || !showPurchaseConfirm) return;
    
    soundManager.play('coin');
    
    // Update character gold
    const updatedChar = {
      ...character,
      eth: character.eth - showPurchaseConfirm.price
    };
    setCharacter(updatedChar);
    saveCharacter(updatedChar);
    
    // Add to owned equipment
    const ownedEquipment = JSON.parse(localStorage.getItem(`ownedEquipment_${character.type}`) || '[]');
    ownedEquipment.push(showPurchaseConfirm.id);
    localStorage.setItem(`ownedEquipment_${character.type}`, JSON.stringify(ownedEquipment));
    
    // Update equipment list
    setEquipment(equipment.map(item => 
      item.id === showPurchaseConfirm.id ? { ...item, owned: true } : item
    ));
    
    soundManager.play('achievement');
    setShowPurchaseConfirm(null);
  };

  const categories = [
    { key: 'weapon', label: '武器', icon: '⚔️' },
    { key: 'armor', label: '护甲', icon: '🦺' },
    { key: 'shield', label: '盾牌', icon: '🔰' },
  ];

  const filteredEquipment = equipment.filter(item => item.type === selectedCategory);

  if (!character) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-blue-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 bg-black/30 rounded-lg p-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => router.push('/hub')}
            className="text-3xl bg-gray-800 rounded-full w-12 h-12 flex items-center justify-center"
          >
            ↩️
          </motion.button>
          
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
            装备商店
          </h1>
          
          <div className="flex items-center gap-4">
            <div className="text-white">
              <span className="text-sm text-gray-300">等级</span>
              <span className="text-xl font-bold ml-1">{character.level}</span>
            </div>
            <ETHDisplay amount={character.eth} />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-4 mb-8 justify-center">
          {categories.map((category) => (
            <motion.button
              key={category.key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.key as 'weapon' | 'armor' | 'shield')}
              className={`
                px-6 py-3 rounded-xl font-bold flex items-center gap-2
                ${selectedCategory === category.key 
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black shadow-lg' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }
              `}
            >
              <span className="text-2xl">{category.icon}</span>
              <span>{category.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Equipment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEquipment.map((item, index) => {
            const canAfford = character.eth >= item.price;
            const meetsLevel = character.level >= item.levelRequirement;
            const canPurchase = canAfford && meetsLevel && !item.owned;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  bg-gray-800 rounded-lg p-6 border-2 
                  ${item.equipped ? 'border-green-500' : 'border-gray-700'}
                  ${item.tier === 3 ? 'shadow-lg shadow-purple-500/30' : ''}
                  ${item.tier === 4 ? 'shadow-lg shadow-orange-500/30' : ''}
                  ${item.tier === 5 ? 'shadow-lg shadow-red-500/30' : ''}
                `}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="text-5xl">{item.icon}</div>
                  <div className="text-right">
                    <div className="flex gap-1">
                      {Array.from({ length: item.tier }).map((_, i) => (
                        <span key={i} className="text-yellow-400">⭐</span>
                      ))}
                    </div>
                    {item.equipped && (
                      <span className="text-green-400 text-sm">装备中</span>
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{item.description}</p>

                {/* Stats */}
                <div className="bg-gray-900 rounded p-3 mb-4">
                  <div className="text-sm space-y-1">
                    {item.hpBonus > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">生命值</span>
                        <span className="text-green-400">+{item.hpBonus}</span>
                      </div>
                    )}
                    {item.attackBonus > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">攻击力</span>
                        <span className="text-red-400">+{item.attackBonus}</span>
                      </div>
                    )}
                    {item.defenseBonus > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">防御力</span>
                        <span className="text-blue-400">+{item.defenseBonus}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Level Requirement */}
                <div className="text-sm text-gray-400 mb-4">
                  需要等级: {item.levelRequirement}
                  {!meetsLevel && <span className="text-red-400 ml-2">(等级不足)</span>}
                </div>

                {/* Purchase Button */}
                {item.owned ? (
                  <button
                    onClick={() => router.push('/equipment')}
                    className="w-full bg-gray-700 text-gray-300 py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors"
                  >
                    {item.equipped ? '已装备' : '前往装备'}
                  </button>
                ) : (
                  <motion.button
                    whileHover={{ scale: canPurchase ? 1.05 : 1 }}
                    whileTap={{ scale: canPurchase ? 0.95 : 1 }}
                    onClick={() => handlePurchase(item)}
                    disabled={!canPurchase}
                    className={`
                      w-full py-3 rounded-lg font-bold transition-all
                      ${canPurchase 
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-lg hover:shadow-xl' 
                        : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      }
                    `}
                  >
                    <span className="flex items-center justify-center gap-2">
                      {formatWeiCompact(item.price)} ETH
                      {!canAfford && <span className="text-sm">(ETH不足)</span>}
                    </span>
                  </motion.button>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Purchase Confirmation Modal */}
      <AnimatePresence>
        {showPurchaseConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowPurchaseConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="bg-gray-800 rounded-lg p-6 max-w-md w-full border-2 border-yellow-500"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-white mb-4">确认购买</h3>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-5xl">{showPurchaseConfirm.icon}</span>
                <div>
                  <p className="text-white font-bold">{showPurchaseConfirm.name}</p>
                  <p className="text-yellow-400">{formatWeiCompact(showPurchaseConfirm.price)} ETH</p>
                </div>
              </div>
              <p className="text-gray-300 mb-6">{showPurchaseConfirm.description}</p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowPurchaseConfirm(null)}
                  className="flex-1 bg-gray-700 text-white py-3 rounded-lg font-bold hover:bg-gray-600"
                >
                  取消
                </button>
                <button
                  onClick={confirmPurchase}
                  className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-black py-3 rounded-lg font-bold hover:shadow-lg"
                >
                  确认购买
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications */}
      <AnimatePresence>
        {showInsufficientFunds && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg"
          >
            ETH不足！继续战斗赚取更多ETH吧！
          </motion.div>
        )}
        
        {showLevelRequirement && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-orange-600 text-white px-6 py-3 rounded-lg shadow-lg"
          >
            等级不足！继续升级解锁更强装备！
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}