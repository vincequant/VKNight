'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Character } from '@/types/game';

interface SaveSlot {
  id: string;
  name: string;
  character: {
    type: string;
    level: number;
    eth: string;
  };
  createdAt: string;
}

interface SaveLoadModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character;
  onLoad: (character: Character) => void;
}

export default function SaveLoadModal({ isOpen, onClose, character, onLoad }: SaveLoadModalProps) {
  const [activeTab, setActiveTab] = useState<'save' | 'load'>('save');
  const [saves, setSaves] = useState<SaveSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadSaves();
      // 设置默认存档名称为当前日期时间
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setSaveName(`${year}-${month}-${day} ${hours}:${minutes}`);
    }
  }, [isOpen, character.type]);

  const loadSaves = async () => {
    try {
      const res = await fetch(`/api/saves/list?type=${character.type}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (data.success) {
        console.log('加载的存档数据:', data.saves);
        setSaves(data.saves);
      } else {
        console.error('Load saves failed:', data);
        setMessage(data.error || '获取存档列表失败');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Failed to load saves:', error);
      setMessage('获取存档列表失败');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleSave = async () => {
    if (!saveName.trim()) {
      setMessage('请输入存档名称');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/saves/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: saveName,
          character: character
        }, (key, value) => {
          if (typeof value === 'bigint') {
            return value.toString();
          }
          return value;
        })
      });

      const data = await res.json();
      if (data.success) {
        setMessage('存档成功！');
        setSaveName('');
        loadSaves();
        setTimeout(() => {
          setMessage('');
          onClose();
        }, 1500);
      } else {
        console.error('Save failed:', data);
        const errorMsg = data?.details ? `${data.error}: ${data.details}` : (data?.error || '存档失败');
        setMessage(errorMsg);
      }
    } catch (error) {
      console.error('Save error:', error);
      setMessage('存档失败：网络错误');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleLoad = async (saveId: string) => {
    console.log('尝试加载存档，ID:', saveId, '类型:', typeof saveId);
    setLoading(true);
    try {
      const res = await fetch(`/api/saves/load?id=${saveId}`);
      const data = await res.json();
      
      if (data.success && data.character) {
        // 转换BigInt
        const loadedChar = {
          ...data.character,
          eth: BigInt(data.character.eth),
          weapon: data.character.weapon ? {
            ...data.character.weapon,
            price: BigInt(data.character.weapon.price)
          } : undefined,
          armor: data.character.armor ? {
            ...data.character.armor,
            price: BigInt(data.character.armor.price)
          } : undefined,
          shield: data.character.shield ? {
            ...data.character.shield,
            price: BigInt(data.character.shield.price)
          } : undefined,
        };
        
        onLoad(loadedChar);
        setMessage('读档成功！');
        setTimeout(() => {
          setMessage('');
          onClose();
        }, 1500);
      } else {
        setMessage(data.error || '读档失败');
      }
    } catch (error) {
      setMessage('读档失败');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDelete = async (saveId: string) => {
    if (!confirm('确定要删除这个存档吗？')) return;

    try {
      const res = await fetch(`/api/saves/delete?id=${saveId}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        loadSaves();
        setMessage('删除成功');
        setTimeout(() => setMessage(''), 2000);
      }
    } catch (error) {
      setMessage('删除失败');
      setTimeout(() => setMessage(''), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative bg-gray-900 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-hidden"
        >
          <h2 className="text-2xl font-bold text-white mb-4">游戏存档</h2>
          
          {/* 标签页 */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab('save')}
              className={`px-4 py-2 rounded font-bold ${
                activeTab === 'save' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              存档
            </button>
            <button
              onClick={() => setActiveTab('load')}
              className={`px-4 py-2 rounded font-bold ${
                activeTab === 'load' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              读档
            </button>
          </div>

          {/* 存档标签页 */}
          {activeTab === 'save' && (
            <div className="space-y-4">
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-bold text-white mb-2">当前角色状态</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">角色：</span>
                    <span className="text-white ml-2">{character.type === 'josh' ? 'Josh (骑士)' : 'Abby (法师)'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">等级：</span>
                    <span className="text-white ml-2">{character.level}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">ETH：</span>
                    <span className="text-yellow-400 ml-2">{(Number(character.eth) / 1e18).toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">经验：</span>
                    <span className="text-white ml-2">{character.experience}/{character.expToNextLevel}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  placeholder="输入存档名称..."
                  className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg"
                  maxLength={30}
                />
                <button
                  onClick={handleSave}
                  disabled={loading || !saveName.trim()}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg font-bold"
                >
                  {loading ? '保存中...' : '保存'}
                </button>
              </div>
            </div>
          )}

          {/* 读档标签页 */}
          {activeTab === 'load' && (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {saves.length === 0 ? (
                <p className="text-gray-400 text-center py-8">暂无存档</p>
              ) : (
                saves.map((save) => {
                  console.log('存档对象:', save);
                  return (
                  <div key={save.id} className="bg-gray-800 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-white">{save.name}</h4>
                      <div className="text-sm text-gray-400">
                        等级 {save.character.level} · {(Number(save.character.eth) / 1e18).toFixed(2)} ETH
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(save.createdAt).toLocaleString('zh-CN')}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          console.log('点击读取按钮，save对象:', save);
                          console.log('save.id:', save.id, '类型:', typeof save.id);
                          const saveId = typeof save.id === 'string' ? save.id : String(save.id);
                          console.log('转换后的saveId:', saveId, '类型:', typeof saveId);
                          handleLoad(saveId);
                        }}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded font-bold text-sm"
                      >
                        读取
                      </button>
                      <button
                        onClick={() => {
                          const saveId = typeof save.id === 'string' ? save.id : String(save.id);
                          handleDelete(saveId);
                        }}
                        disabled={loading}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded font-bold text-sm"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                  );
                })
              )}
            </div>
          )}

          {/* 消息提示 */}
          {message && (
            <div className={`mt-4 p-3 rounded-lg text-center font-bold ${
              message.includes('成功') ? 'bg-green-600' : 'bg-red-600'
            }`}>
              {message}
            </div>
          )}

          {/* 关闭按钮 */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}