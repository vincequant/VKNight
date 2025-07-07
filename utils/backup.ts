import { Character } from '@/types/game';
import { serializeCharacter, deserializeCharacter } from './characterStorage';

const BACKUP_KEY_PREFIX = 'character_backup_';
const MAX_BACKUPS = 5;

export interface Backup {
  id: string;
  timestamp: Date;
  character: Character;
  label?: string;
}

export function createBackup(character: Character, label?: string): string {
  const backupId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const backup: Backup = {
    id: backupId,
    timestamp: new Date(),
    character,
    label: label || `自动备份 - 等级${character.level}`,
  };
  
  const key = `${BACKUP_KEY_PREFIX}${character.type}_${backupId}`;
  localStorage.setItem(key, JSON.stringify({
    ...backup,
    character: serializeCharacter(character),
  }));
  
  // Clean up old backups
  cleanupOldBackups(character.type);
  
  return backupId;
}

export function getBackups(characterType: string): Backup[] {
  const backups: Backup[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(`${BACKUP_KEY_PREFIX}${characterType}_`)) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        backups.push({
          ...data,
          timestamp: new Date(data.timestamp),
          character: deserializeCharacter(data.character),
        });
      } catch (error) {
        console.error('Error loading backup:', error);
      }
    }
  }
  
  // Sort by timestamp, newest first
  return backups.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export function restoreBackup(characterType: string, backupId: string): Character | null {
  const key = `${BACKUP_KEY_PREFIX}${characterType}_${backupId}`;
  const data = localStorage.getItem(key);
  
  if (!data) return null;
  
  try {
    const backup = JSON.parse(data);
    return deserializeCharacter(backup.character);
  } catch (error) {
    console.error('Error restoring backup:', error);
    return null;
  }
}

export function deleteBackup(characterType: string, backupId: string): void {
  const key = `${BACKUP_KEY_PREFIX}${characterType}_${backupId}`;
  localStorage.removeItem(key);
}

function cleanupOldBackups(characterType: string): void {
  const backups = getBackups(characterType);
  
  // Keep only the most recent MAX_BACKUPS
  if (backups.length > MAX_BACKUPS) {
    const toDelete = backups.slice(MAX_BACKUPS);
    toDelete.forEach(backup => {
      deleteBackup(characterType, backup.id);
    });
  }
}

export function createCheckpoint(character: Character, eventLabel: string): void {
  createBackup(character, `检查点: ${eventLabel}`);
}