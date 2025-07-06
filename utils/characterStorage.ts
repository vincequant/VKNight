import { Character } from '@/types/game';

// Helper to serialize character data with bigint support
export function serializeCharacter(character: Character): string {
  return JSON.stringify(character, (key, value) => {
    if (typeof value === 'bigint') {
      return value.toString() + 'n'; // Add 'n' suffix to indicate bigint
    }
    return value;
  });
}

// Helper to deserialize character data with bigint support
export function deserializeCharacter(data: string): Character {
  return JSON.parse(data, (key, value) => {
    if (typeof value === 'string' && value.endsWith('n')) {
      return BigInt(value.slice(0, -1));
    }
    return value;
  });
}

// Save character to localStorage
export function saveCharacter(character: Character): void {
  const key = `character_${character.type}`;
  localStorage.setItem(key, serializeCharacter(character));
}

// Load character from localStorage
export function loadCharacter(userId: string): Character | null {
  const key = `character_${userId}`;
  const data = localStorage.getItem(key);
  if (!data) return null;
  
  try {
    return deserializeCharacter(data);
  } catch (error) {
    console.error('Error loading character:', error);
    return null;
  }
}