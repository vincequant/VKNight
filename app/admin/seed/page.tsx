'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SeedPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [seedResults, setSeedResults] = useState<any>(null);
  const [equipmentStatus, setEquipmentStatus] = useState<any>(null);

  const checkEquipmentStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/seed-equipment');
      const data = await res.json();
      setEquipmentStatus(data);
    } catch (error) {
      console.error('Error checking equipment:', error);
      alert('检查装备数据失败');
    } finally {
      setLoading(false);
    }
  };

  const seedEquipment = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/seed-equipment', {
        method: 'POST'
      });
      const data = await res.json();
      setSeedResults(data);
      
      if (data.success) {
        alert(`成功初始化 ${data.totalSuccess} 个装备！`);
        // Refresh status
        checkEquipmentStatus();
      }
    } catch (error) {
      console.error('Error seeding equipment:', error);
      alert('初始化装备失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">数据库初始化</h1>
        
        <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-yellow-400 mb-2">说明</h2>
          <p className="text-yellow-300">
            在恢复角色数据之前，需要先初始化装备数据到数据库中。
            这个操作只需要执行一次。
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={checkEquipmentStatus}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-bold"
          >
            检查装备数据状态
          </button>

          <button
            onClick={seedEquipment}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-bold"
          >
            初始化所有装备数据
          </button>
        </div>

        {/* Equipment Status */}
        {equipmentStatus && (
          <div className="mt-6 bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">数据库装备状态</h3>
            {equipmentStatus.success ? (
              <div>
                <p className="mb-4">数据库中有 {equipmentStatus.totalInDatabase} 个装备</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {equipmentStatus.equipment.map((eq: any) => (
                    <div key={eq.id} className="bg-gray-700 rounded p-2">
                      <span className="text-gray-400">T{eq.tier}</span> {eq.id}: {eq.name}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-red-400">加载失败: {equipmentStatus.error}</p>
            )}
          </div>
        )}

        {/* Seed Results */}
        {seedResults && (
          <div className="mt-6 bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">初始化结果</h3>
            {seedResults.success ? (
              <div>
                <p className="mb-4">
                  处理了 {seedResults.totalProcessed} 个装备，
                  成功 {seedResults.totalSuccess} 个
                </p>
                <div className="max-h-64 overflow-y-auto space-y-1 text-sm">
                  {seedResults.results.map((result: any, index: number) => (
                    <div 
                      key={index} 
                      className={`p-1 rounded ${
                        result.status === 'success' ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {result.id}: {result.name} - {result.status}
                      {result.error && <span className="ml-2">({result.error})</span>}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-red-400">初始化失败: {seedResults.error}</p>
            )}
          </div>
        )}

        <div className="mt-8 flex gap-4">
          <button
            onClick={() => router.push('/admin')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded font-bold"
          >
            返回管理面板
          </button>
          <button
            onClick={() => router.push('/admin/restore')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded font-bold"
          >
            前往恢复备份
          </button>
        </div>

        {loading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-gray-800 rounded-lg p-6">
              <p className="text-xl">处理中...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}