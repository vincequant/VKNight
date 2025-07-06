'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error';

export default function CloudSyncIndicator() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  useEffect(() => {
    // Listen for custom sync events
    const handleSyncStart = () => setSyncStatus('syncing');
    const handleSyncSuccess = () => {
      setSyncStatus('synced');
      setLastSyncTime(new Date());
      setTimeout(() => setSyncStatus('idle'), 3000);
    };
    const handleSyncError = () => {
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 5000);
    };

    window.addEventListener('cloud-sync-start', handleSyncStart);
    window.addEventListener('cloud-sync-success', handleSyncSuccess);
    window.addEventListener('cloud-sync-error', handleSyncError);

    return () => {
      window.removeEventListener('cloud-sync-start', handleSyncStart);
      window.removeEventListener('cloud-sync-success', handleSyncSuccess);
      window.removeEventListener('cloud-sync-error', handleSyncError);
    };
  }, []);

  const getStatusIcon = () => {
    switch (syncStatus) {
      case 'syncing':
        return '🔄';
      case 'synced':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '☁️';
    }
  };

  const getStatusText = () => {
    switch (syncStatus) {
      case 'syncing':
        return '同步中...';
      case 'synced':
        return '已同步';
      case 'error':
        return '同步失败';
      default:
        return lastSyncTime ? `最后同步: ${lastSyncTime.toLocaleTimeString()}` : '云端存储';
    }
  };

  const getStatusColor = () => {
    switch (syncStatus) {
      case 'syncing':
        return 'text-blue-400';
      case 'synced':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={syncStatus}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`flex items-center gap-2 text-sm ${getStatusColor()}`}
      >
        <motion.span
          animate={syncStatus === 'syncing' ? { rotate: 360 } : {}}
          transition={syncStatus === 'syncing' ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
        >
          {getStatusIcon()}
        </motion.span>
        <span>{getStatusText()}</span>
      </motion.div>
    </AnimatePresence>
  );
}