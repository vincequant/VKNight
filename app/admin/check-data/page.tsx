'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckDataPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentDeviceId, setCurrentDeviceId] = useState('');

  useEffect(() => {
    // 获取当前设备ID
    if (typeof window !== 'undefined') {
      const deviceId = localStorage.getItem('deviceId') || '未设置';
      setCurrentDeviceId(deviceId);
    }
    
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/check-data');
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 flex items-center justify-center">
        <div className="text-2xl">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">数据检查工具</h1>
        
        {/* 当前设备信息 */}
        <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-blue-400 mb-4">当前浏览器信息</h2>
          <p className="font-mono">设备ID: {currentDeviceId}</p>
        </div>
        
        {/* 数据概览 */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">数据概览</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700 rounded p-4">
              <p className="text-lg">总用户数: {data?.totalUsers || 0}</p>
            </div>
            <div className="bg-gray-700 rounded p-4">
              <p className="text-lg">总角色数: {data?.totalCharacters || 0}</p>
            </div>
          </div>
        </div>
        
        {/* 所有角色 */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">所有角色（按更新时间排序）</h2>
          {data?.allCharacters?.length > 0 ? (
            <div className="space-y-4">
              {data.allCharacters.map((char: any, index: number) => (
                <div key={index} className="bg-gray-700 rounded-lg p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">角色</p>
                      <p className={`font-bold ${char.type === 'josh' ? 'text-green-400' : 'text-blue-400'}`}>
                        {char.type === 'josh' ? 'Josh' : 'Abby'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">等级</p>
                      <p className="font-bold">Level {char.level}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">ETH</p>
                      <p className="font-bold text-yellow-400">{char.eth}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">更新时间</p>
                      <p className="text-sm">{new Date(char.updatedAt).toLocaleString('zh-CN')}</p>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-600">
                    <p className="text-xs text-gray-400">
                      用户设备ID: {char.userDeviceId}
                      {char.userDeviceId === currentDeviceId && (
                        <span className="ml-2 text-green-400">✓ 当前设备</span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">暂无角色数据</p>
          )}
        </div>
        
        {/* 按用户分组 */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">按用户分组</h2>
          {data?.users?.length > 0 ? (
            <div className="space-y-4">
              {data.users.map((user: any, index: number) => (
                <div key={index} className="bg-gray-700 rounded-lg p-4">
                  <div className="mb-2">
                    <p className="text-sm text-gray-400">设备ID</p>
                    <p className="font-mono text-sm">{user.deviceId}</p>
                    {user.deviceId === currentDeviceId && (
                      <span className="text-green-400 text-sm">✓ 当前设备</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mb-2">拥有 {user.charactersCount} 个角色</p>
                  {user.characters.length > 0 && (
                    <div className="space-y-2">
                      {user.characters.map((char: any, idx: number) => (
                        <div key={idx} className="bg-gray-800 rounded p-2 text-sm">
                          <span className={char.type === 'josh' ? 'text-green-400' : 'text-blue-400'}>
                            {char.type}
                          </span>
                          {' - '}
                          Level {char.level} - {char.eth}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">暂无用户数据</p>
          )}
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={() => router.push('/admin')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded font-bold"
          >
            返回管理面板
          </button>
          <button
            onClick={loadData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-bold"
          >
            刷新数据
          </button>
          <button
            onClick={() => window.location.href = '/admin/add-eth'}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded font-bold"
          >
            添加ETH
          </button>
        </div>
      </div>
    </div>
  );
}