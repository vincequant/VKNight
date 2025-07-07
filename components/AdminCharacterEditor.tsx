'use client';

import { useState } from 'react';
import { Character, Equipment } from '@/types/game';
import { calculateCharacterStats, calculateExpForLevel } from '@/types/game';
import { equipment } from '@/data/equipment';
import { stages } from '@/data/stages';

interface AdminCharacterEditorProps {
  character: Character;
  onUpdate: (character: Character) => void;
}

export default function AdminCharacterEditor({ character, onUpdate }: AdminCharacterEditorProps) {
  const [editedCharacter, setEditedCharacter] = useState<Character>(character);

  const handleNumberChange = (field: keyof Character, value: string) => {
    const numValue = parseInt(value) || 0;
    const updated = { ...editedCharacter, [field]: numValue };
    
    // Recalculate exp to next level if level changed
    if (field === 'level') {
      updated.expToNextLevel = calculateExpForLevel(numValue);
    }
    
    const calculated = calculateCharacterStats(updated);
    setEditedCharacter(calculated);
    onUpdate(calculated);
  };

  const handleETHChange = (value: string) => {
    try {
      const ethValue = BigInt(value || '0');
      const updated = { ...editedCharacter, eth: ethValue };
      setEditedCharacter(updated);
      onUpdate(updated);
    } catch (e) {
      // Invalid BigInt input
    }
  };

  const handleEquipmentChange = (type: 'weapon' | 'armor' | 'shield', equipmentId: string) => {
    const item = equipment[type].find(e => e.id === equipmentId) || undefined;
    const updated = { ...editedCharacter, [type]: item };
    const calculated = calculateCharacterStats(updated);
    setEditedCharacter(calculated);
    onUpdate(calculated);
  };

  const toggleStageCleared = (stageId: string) => {
    const stagesCleared = editedCharacter.stagesCleared.includes(stageId)
      ? editedCharacter.stagesCleared.filter(id => id !== stageId)
      : [...editedCharacter.stagesCleared, stageId];
    
    const updated = { ...editedCharacter, stagesCleared };
    setEditedCharacter(updated);
    onUpdate(updated);
  };

  const addInventoryItem = () => {
    const newItem = { id: `item_${Date.now()}`, quantity: 1 };
    const updated = {
      ...editedCharacter,
      inventory: [...editedCharacter.inventory, newItem],
    };
    setEditedCharacter(updated);
    onUpdate(updated);
  };

  const removeInventoryItem = (index: number) => {
    const updated = {
      ...editedCharacter,
      inventory: editedCharacter.inventory.filter((_, i) => i !== index),
    };
    setEditedCharacter(updated);
    onUpdate(updated);
  };

  return (
    <div className="space-y-6">
      {/* Basic Stats */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">Basic Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Level</label>
            <input
              type="number"
              value={editedCharacter.level}
              onChange={(e) => handleNumberChange('level', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              min="1"
              max="100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Experience</label>
            <input
              type="number"
              value={editedCharacter.experience}
              onChange={(e) => handleNumberChange('experience', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">ETH (in wei)</label>
            <input
              type="text"
              value={editedCharacter.eth.toString()}
              onChange={(e) => handleETHChange(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Base HP</label>
            <input
              type="number"
              value={editedCharacter.baseHp}
              onChange={(e) => handleNumberChange('baseHp', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Base Attack</label>
            <input
              type="number"
              value={editedCharacter.baseAttack}
              onChange={(e) => handleNumberChange('baseAttack', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Base Defense</label>
            <input
              type="number"
              value={editedCharacter.baseDefense}
              onChange={(e) => handleNumberChange('baseDefense', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Calculated Stats */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">Calculated Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <span className="text-gray-400 text-sm">Max HP:</span>
            <p className="text-white font-medium">{editedCharacter.maxHp}</p>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Attack:</span>
            <p className="text-white font-medium">{editedCharacter.attack}</p>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Defense:</span>
            <p className="text-white font-medium">{editedCharacter.defense}</p>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Exp to Next:</span>
            <p className="text-white font-medium">{editedCharacter.expToNextLevel}</p>
          </div>
        </div>
      </div>

      {/* Equipment */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">Equipment</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Weapon</label>
            <select
              value={editedCharacter.weapon?.id || ''}
              onChange={(e) => handleEquipmentChange('weapon', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
            >
              <option value="">None</option>
              {equipment.weapon.map(item => (
                <option key={item.id} value={item.id}>
                  {item.name} (Tier {item.tier}, +{item.attackBonus} ATK)
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Armor</label>
            <select
              value={editedCharacter.armor?.id || ''}
              onChange={(e) => handleEquipmentChange('armor', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
            >
              <option value="">None</option>
              {equipment.armor.map(item => (
                <option key={item.id} value={item.id}>
                  {item.name} (Tier {item.tier}, +{item.hpBonus} HP, +{item.defenseBonus} DEF)
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Shield</label>
            <select
              value={editedCharacter.shield?.id || ''}
              onChange={(e) => handleEquipmentChange('shield', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
            >
              <option value="">None</option>
              {equipment.shield.map(item => (
                <option key={item.id} value={item.id}>
                  {item.name} (Tier {item.tier}, +{item.defenseBonus} DEF)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stages Cleared */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">Stages Cleared</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {stages.map(stage => (
            <label key={stage.id} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editedCharacter.stagesCleared.includes(stage.id)}
                onChange={() => toggleStageCleared(stage.id)}
                className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-600"
              />
              <span className="text-gray-300 text-sm">{stage.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Inventory */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">Inventory</h3>
        <div className="space-y-2">
          {editedCharacter.inventory.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={item.id}
                onChange={(e) => {
                  const updated = { ...editedCharacter };
                  updated.inventory[index].id = e.target.value;
                  setEditedCharacter(updated);
                  onUpdate(updated);
                }}
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                placeholder="Item ID"
              />
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => {
                  const updated = { ...editedCharacter };
                  updated.inventory[index].quantity = parseInt(e.target.value) || 0;
                  setEditedCharacter(updated);
                  onUpdate(updated);
                }}
                className="w-24 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                min="0"
              />
              <button
                onClick={() => removeInventoryItem(index)}
                className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={addInventoryItem}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Add Item
          </button>
        </div>
      </div>
    </div>
  );
}