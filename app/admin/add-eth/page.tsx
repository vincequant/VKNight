'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddEthPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const addEth = async (characterType: string, amount: number) => {
    setLoading(true);
    setResult(null);
    
    try {
      const res = await fetch('/api/admin/add-eth', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          characterType,
          ethAmount: amount
        })
      });
      
      const data = await res.json();
      setResult(data);
    } catch (error) {
      setResult({ 
        success: false, 
        error: error.message || '添加失败' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">添加ETH测试工具</h1>
        
        <div className="bg-gray-800 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">快速添加ETH</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Josh添加30 ETH */}
            <div className="bg-green-900/30 border border-green-600 rounded-lg p-6 text-center">
              <h3 className="text-xl font-bold text-green-400 mb-4">Josh (骑士)</h3>
              <p className="mb-4">添加30 ETH用于装备测试</p>
              <button
                onClick={() => addEth('josh', 30)}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-bold"
              >
                {loading ? '添加中...' : '添加30 ETH'}
              </button>
            </div>
            
            {/* Abby添加30 ETH */}
            <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-6 text-center">
              <h3 className="text-xl font-bold text-blue-400 mb-4">Abby (法师)</h3>
              <p className="mb-4">添加30 ETH用于装备测试</p>
              <button
                onClick={() => addEth('abby', 30)}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-bold"
              >
                {loading ? '添加中...' : '添加30 ETH'}
              </button>
            </div>
          </div>
          
          {/* 自定义添加 */}
          <div className="bg-purple-900/30 border border-purple-600 rounded-lg p-6">
            <h3 className="text-lg font-bold text-purple-400 mb-4">自定义添加</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => addEth('josh', 100)}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-4 py-2 rounded font-bold"
              >
                Josh +100 ETH
              </button>
              <button
                onClick={() => addEth('abby', 100)}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-4 py-2 rounded font-bold"
              >
                Abby +100 ETH
              </button>
            </div>
          </div>
        </div>
        
        {/* 结果显示 */}
        {result && (
          <div className={`mt-8 p-6 rounded-lg ${result.success ? 'bg-green-900/30 border-green-600' : 'bg-red-900/30 border-red-600'} border`}>
            <h3 className="text-xl font-bold mb-4">
              {result.success ? '✅ 添加成功！' : '❌ 添加失败'}
            </h3>
            
            {result.success ? (
              <div className="space-y-2">
                <p>{result.message}</p>
                {result.character && (
                  <div className="bg-black/30 rounded p-4 mt-4">
                    <p>角色: {result.character.type}</p>
                    <p>等级: {result.character.level}</p>
                    <p>之前ETH: {result.character.previousEth}</p>
                    <p>现在ETH: {result.character.newEth}</p>
                  </div>
                )}
                <button
                  onClick={() => window.location.href = '/hub'}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-bold mt-4"
                >
                  进入游戏
                </button>
              </div>
            ) : (
              <p className="text-red-400">{result.error}</p>
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
            onClick={() => window.location.href = '/store'}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded font-bold"
          >
            前往商店
          </button>
        </div>
      </div>
    </div>
  );
}