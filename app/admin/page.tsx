'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Character } from '@/types/game';
import { saveCharacter, deserializeCharacter, serializeCharacter } from '@/utils/characterStorage';
import { formatWeiCompact } from '@/utils/ethereum';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [joshData, setJoshData] = useState<Character | null>(null);
  const [abbyData, setAbbyData] = useState<Character | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'josh' | 'abby'>('josh');
  const [cloudBackups, setCloudBackups] = useState<any[]>([]);
  const [showBackups, setShowBackups] = useState(false);

  useEffect(() => {
    // Check if already authenticated
    const auth = sessionStorage.getItem('adminAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      loadAllData();
    }
  }, []);

  const handleLogin = () => {
    // Simple password check - in production, use proper authentication
    if (password === 'admin123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'true');
      loadAllData();
      loadCloudBackups();
    } else {
      setMessage('密码错误');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      let loadedJosh = null;
      let loadedAbby = null;
      
      // Load from cloud first
      const [joshRes, abbyRes] = await Promise.all([
        fetch('/api/character/load?type=josh'),
        fetch('/api/character/load?type=abby')
      ]);

      if (joshRes.ok) {
        const joshJson = await joshRes.json();
        if (joshJson.success && joshJson.character) {
          const josh = joshJson.character;
          josh.eth = BigInt(josh.eth);
          loadedJosh = josh;
          setJoshData(josh);
        }
      }

      if (abbyRes.ok) {
        const abbyJson = await abbyRes.json();
        if (abbyJson.success && abbyJson.character) {
          const abby = abbyJson.character;
          abby.eth = BigInt(abby.eth);
          loadedAbby = abby;
          setAbbyData(abby);
        }
      }

      // Only check local storage if cloud data not found
      if (!loadedJosh) {
        const localJosh = localStorage.getItem('character_josh');
        if (localJosh) {
          try {
            const josh = deserializeCharacter(localJosh);
            setJoshData(josh);
            console.log('Loaded Josh from localStorage');
          } catch (e) {
            console.error('Error loading Josh from localStorage:', e);
          }
        }
      }
      
      if (!loadedAbby) {
        const localAbby = localStorage.getItem('character_abby');
        if (localAbby) {
          try {
            const abby = deserializeCharacter(localAbby);
            setAbbyData(abby);
            console.log('Loaded Abby from localStorage');
          } catch (e) {
            console.error('Error loading Abby from localStorage:', e);
          }
        }
      }

      setMessage('数据加载成功');
    } catch (error) {
      console.error('Load error:', error);
      setMessage('加载失败');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleSave = async (character: Character) => {
    setLoading(true);
    try {
      await saveCharacter(character, true); // Create backup
      setMessage(`${character.type} 保存成功`);
      loadAllData(); // Reload to confirm
    } catch (error) {
      console.error('Save error:', error);
      setMessage('保存失败');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleExport = (character: Character) => {
    const dataStr = JSON.stringify(character, (key, value) => {
      if (typeof value === 'bigint') {
        return value.toString();
      }
      return value;
    }, 2);
    
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${character.type}_backup_${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>, type: 'josh' | 'abby') => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      data.eth = BigInt(data.eth);
      
      if (type === 'josh') {
        setJoshData(data);
      } else {
        setAbbyData(data);
      }
      
      setMessage('导入成功');
    } catch (error) {
      console.error('Import error:', error);
      setMessage('导入失败');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const loadCloudBackups = async () => {
    try {
      const response = await fetch('/api/backup/list');
      if (response.ok) {
        const data = await response.json();
        setCloudBackups(data.backups || []);
      }
    } catch (error) {
      console.error('Load backups error:', error);
    }
  };

  const createCloudBackup = async (character: Character) => {
    setLoading(true);
    try {
      const response = await fetch('/api/backup/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterType: character.type,
          backupName: `管理后台备份 - 等级${character.level}`,
          characterData: character,
        }),
      });
      
      if (response.ok) {
        setMessage('云端备份创建成功');
        loadCloudBackups();
      } else {
        setMessage('云端备份失败');
      }
    } catch (error) {
      console.error('Create backup error:', error);
      setMessage('云端备份失败');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const restoreCloudBackup = async (backupId: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/backup/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ backupId }),
      });
      
      if (response.ok) {
        const data = await response.json();
        const character = data.characterData;
        character.eth = BigInt(character.eth);
        
        if (character.type === 'josh') {
          setJoshData(character);
        } else {
          setAbbyData(character);
        }
        
        setMessage('云端备份恢复成功');
        setShowBackups(false);
      } else {
        setMessage('恢复失败');
      }
    } catch (error) {
      console.error('Restore backup error:', error);
      setMessage('恢复失败');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const deleteCloudBackup = async (backupId: string) => {
    if (!confirm('确定要删除这个云端备份吗？')) return;
    
    try {
      const response = await fetch(`/api/backup/delete?id=${backupId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setMessage('备份删除成功');
        loadCloudBackups();
      }
    } catch (error) {
      console.error('Delete backup error:', error);
      setMessage('删除失败');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const updateCharacterField = (type: 'josh' | 'abby', field: string, value: any) => {
    const setter = type === 'josh' ? setJoshData : setAbbyData;
    const current = type === 'josh' ? joshData : abbyData;
    
    if (!current) return;
    
    setter({
      ...current,
      [field]: value
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-800 rounded-lg p-8 max-w-md w-full"
        >
          <h1 className="text-3xl font-bold text-white mb-6 text-center">管理后台</h1>
          
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="输入管理密码"
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg mb-4"
          />
          
          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black py-3 rounded-lg font-bold"
          >
            登录
          </button>
          
          {message && (
            <p className="text-red-400 text-center mt-4">{message}</p>
          )}
        </motion.div>
      </div>
    );
  }

  const currentData = activeTab === 'josh' ? joshData : abbyData;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">游戏管理后台</h1>
          <div className="flex gap-4">
            <button
              onClick={loadAllData}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              刷新数据
            </button>
            <button
              onClick={() => router.push('/hub')}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              返回游戏
            </button>
            <button
              onClick={() => setShowBackups(!showBackups)}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              云端备份 ({cloudBackups.length})
            </button>
          </div>
        </div>

        {/* Quick Access Tools */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">快速访问工具</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/admin/ultimate-fix" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold text-center">
              终极修复工具
            </Link>
            
            <Link href="/admin/add-eth" className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-bold text-center">
              添加ETH测试
            </Link>
            
            <Link href="/admin/check-data" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold text-center">
              检查数据
            </Link>
            
            <Link href="/admin/seed" className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold text-center">
              种子装备
            </Link>
            
            <Link href="/store" className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-bold text-center">
              前往商店
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('josh')}
            className={`px-6 py-3 rounded-lg font-bold ${
              activeTab === 'josh' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-700 text-gray-300'
            }`}
          >
            约什 (Josh)
          </button>
          <button
            onClick={() => setActiveTab('abby')}
            className={`px-6 py-3 rounded-lg font-bold ${
              activeTab === 'abby' 
                ? 'bg-amber-600 text-white' 
                : 'bg-gray-700 text-gray-300'
            }`}
          >
            艾比 (Abby)
          </button>
        </div>

        {/* Character Data Editor */}
        {currentData ? (
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">基本信息</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-1">等级</label>
                    <input
                      type="number"
                      value={currentData.level}
                      onChange={(e) => updateCharacterField(activeTab, 'level', parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-1">经验值</label>
                    <input
                      type="number"
                      value={currentData.experience}
                      onChange={(e) => updateCharacterField(activeTab, 'experience', parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-1">ETH (输入小数，如 0.5)</label>
                    <input
                      type="number"
                      step="0.001"
                      value={Number(currentData.eth) / 1000}
                      onChange={(e) => updateCharacterField(activeTab, 'eth', BigInt(Math.floor(parseFloat(e.target.value) * 1000)))}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">属性</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-1">基础生命值</label>
                    <input
                      type="number"
                      value={currentData.baseHp}
                      onChange={(e) => updateCharacterField(activeTab, 'baseHp', parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-1">基础攻击力</label>
                    <input
                      type="number"
                      value={currentData.baseAttack}
                      onChange={(e) => updateCharacterField(activeTab, 'baseAttack', parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-1">基础防御力</label>
                    <input
                      type="number"
                      value={currentData.baseDefense}
                      onChange={(e) => updateCharacterField(activeTab, 'baseDefense', parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="md:col-span-2">
                <h3 className="text-xl font-bold text-white mb-4">游戏进度</h3>
                
                <div>
                  <label className="block text-gray-300 mb-1">已通过关卡 (用逗号分隔，如: 1,2,3)</label>
                  <input
                    type="text"
                    value={currentData.stagesCleared?.map(s => s.replace('stage-', '')).join(',')}
                    onChange={(e) => {
                      const stages = e.target.value.split(',').map(s => s.trim()).filter(s => s).map(s => `stage-${s}`);
                      updateCharacterField(activeTab, 'stagesCleared', stages);
                    }}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="md:col-span-2 flex gap-4 mt-6">
                <button
                  onClick={() => handleSave(currentData)}
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-lg font-bold disabled:opacity-50"
                >
                  保存到云端
                </button>
                
                <button
                  onClick={() => handleExport(currentData)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
                >
                  导出JSON
                </button>
                
                <label className="px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 cursor-pointer">
                  导入JSON
                  <input
                    type="file"
                    accept=".json"
                    onChange={(e) => handleImport(e, activeTab)}
                    className="hidden"
                  />
                </label>
                
                <button
                  onClick={() => createCloudBackup(currentData)}
                  disabled={loading}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 disabled:opacity-50"
                >
                  创建云端备份
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <p className="text-gray-400">暂无数据，请点击刷新数据</p>
          </div>
        )}

        {/* Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg"
          >
            {message}
          </motion.div>
        )}

        {/* Cloud Backups Panel */}
        {showBackups && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowBackups(false)}
          >
            <div
              className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-white mb-4">云端备份管理</h2>
              
              {cloudBackups.length === 0 ? (
                <p className="text-gray-400 text-center py-8">暂无云端备份</p>
              ) : (
                <div className="space-y-4">
                  {cloudBackups.map((backup) => (
                    <div
                      key={backup.id}
                      className="bg-gray-700 rounded-lg p-4 flex justify-between items-center"
                    >
                      <div>
                        <h3 className="text-white font-bold">
                          {backup.characterType === 'josh' ? '约什' : '艾比'} - {backup.backupName}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          创建时间: {new Date(backup.createdAt).toLocaleString('zh-CN')}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => restoreCloudBackup(backup.id)}
                          disabled={loading}
                          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                        >
                          恢复
                        </button>
                        <button
                          onClick={() => deleteCloudBackup(backup.id)}
                          disabled={loading}
                          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowBackups(false)}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700"
                >
                  关闭
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}