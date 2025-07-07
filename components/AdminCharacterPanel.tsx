'use client';

import { useState, useEffect } from 'react';
import { Character, Equipment } from '@/types/game';
import { calculateCharacterStats } from '@/types/game';
import AdminCharacterEditor from './AdminCharacterEditor';
import AdminDataExport from './AdminDataExport';

export default function AdminCharacterPanel() {
  const [characters, setCharacters] = useState<{ josh: Character | null; abby: Character | null }>({
    josh: null,
    abby: null,
  });
  const [selectedCharacter, setSelectedCharacter] = useState<'josh' | 'abby'>('josh');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [backups, setBackups] = useState<{ josh: Character | null; abby: Character | null }>({
    josh: null,
    abby: null,
  });

  // Load characters from cloud
  const loadCharacters = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const joshResponse = await fetch('/api/admin/character/josh');
      const abbyResponse = await fetch('/api/admin/character/abby');

      const joshData = await joshResponse.json();
      const abbyData = await abbyResponse.json();

      const newCharacters = {
        josh: joshData.character ? parseCharacterData(joshData.character) : null,
        abby: abbyData.character ? parseCharacterData(abbyData.character) : null,
      };

      setCharacters(newCharacters);
      // Create backups
      setBackups({
        josh: newCharacters.josh ? { ...newCharacters.josh } : null,
        abby: newCharacters.abby ? { ...newCharacters.abby } : null,
      });
      
      setMessage({ type: 'success', text: 'Characters loaded successfully' });
    } catch (error) {
      console.error('Error loading characters:', error);
      setMessage({ type: 'error', text: 'Failed to load characters' });
    } finally {
      setIsLoading(false);
    }
  };

  // Parse character data from API response
  const parseCharacterData = (data: any): Character => {
    const character: Character = {
      id: data.id || data.type,
      type: data.type,
      level: data.level,
      experience: data.experience,
      expToNextLevel: data.expToNextLevel,
      eth: BigInt(data.eth || '0'),
      hp: data.hp || data.baseHp,
      maxHp: data.maxHp || data.baseHp,
      mp: data.mp || data.baseMp || 0,
      maxMp: data.maxMp || data.baseMp || 0,
      attack: data.attack || data.baseAttack,
      defense: data.defense || data.baseDefense,
      baseHp: data.baseHp,
      baseMp: data.baseMp || 0,
      baseAttack: data.baseAttack,
      baseDefense: data.baseDefense,
      stagesCleared: data.stagesCleared || [],
      stagesPaidFor: data.stagesPaidFor || [],
      inventory: data.inventory || [],
      weapon: data.weapon,
      armor: data.armor,
      shield: data.shield,
    };

    return calculateCharacterStats(character);
  };

  // Save character to cloud
  const saveCharacter = async (character: Character) => {
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/character/${character.type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          character: {
            ...character,
            eth: character.eth.toString(),
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save character');
      }

      setMessage({ type: 'success', text: `${character.type} saved successfully` });
      
      // Update backup
      setBackups(prev => ({
        ...prev,
        [character.type]: { ...character },
      }));
    } catch (error) {
      console.error('Error saving character:', error);
      setMessage({ type: 'error', text: 'Failed to save character' });
    } finally {
      setIsLoading(false);
    }
  };

  // Restore from backup
  const restoreFromBackup = (characterType: 'josh' | 'abby') => {
    const backup = backups[characterType];
    if (backup) {
      setCharacters(prev => ({
        ...prev,
        [characterType]: { ...backup },
      }));
      setMessage({ type: 'success', text: `Restored ${characterType} from backup` });
    }
  };

  // Update character data
  const updateCharacter = (character: Character) => {
    setCharacters(prev => ({
      ...prev,
      [character.type]: character,
    }));
  };

  useEffect(() => {
    loadCharacters();
  }, []);

  const currentCharacter = characters[selectedCharacter];

  return (
    <div className="space-y-6">
      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-600/20 border border-green-600 text-green-400'
              : 'bg-red-600/20 border border-red-600 text-red-400'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Character Selector */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Select Character</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setSelectedCharacter('josh')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              selectedCharacter === 'josh'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Josh (Knight)
          </button>
          <button
            onClick={() => setSelectedCharacter('abby')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              selectedCharacter === 'abby'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Abby (Archer)
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={loadCharacters}
            disabled={isLoading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            Reload from Cloud
          </button>
          <button
            onClick={() => currentCharacter && saveCharacter(currentCharacter)}
            disabled={isLoading || !currentCharacter}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            Save to Cloud
          </button>
          <button
            onClick={() => restoreFromBackup(selectedCharacter)}
            disabled={!backups[selectedCharacter]}
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors disabled:opacity-50"
          >
            Restore from Backup
          </button>
        </div>
      </div>

      {/* Character Editor */}
      {currentCharacter ? (
        <AdminCharacterEditor
          character={currentCharacter}
          onUpdate={updateCharacter}
        />
      ) : (
        <div className="bg-gray-800 rounded-lg p-6">
          <p className="text-gray-400">No character data found. Click "Reload from Cloud" to load characters.</p>
        </div>
      )}

      {/* Export/Import */}
      <AdminDataExport
        characters={characters}
        onImport={(imported) => {
          setCharacters(imported);
          setMessage({ type: 'success', text: 'Characters imported successfully' });
        }}
      />
    </div>
  );
}