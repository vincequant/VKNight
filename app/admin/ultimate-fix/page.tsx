'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UltimateFixPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const ultimateFix = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const res = await fetch('/api/admin/ultimate-fix', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        }
      });
      
      const data = await res.json();
      setResult(data);
    } catch (error) {
      setResult({ 
        success: false, 
        error: error.message || '修复失败' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">终极修复工具</h1>
        
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-6">自适应数据库修复</h2>
          
          <div className="bg-purple-900/30 border border-purple-600 rounded-lg p-6 mb-6">
            <p className="text-purple-400 mb-4">🔧 智能修复</p>
            <ul className="list-disc list-inside text-sm text-left max-w-md mx-auto">
              <li>自动检测数据库结构</li>
              <li>处理新旧schema兼容性</li>
              <li>自动创建必要的用户记录</li>
              <li>Josh: 等级5, 35.2 ETH（包含30 ETH奖励）</li>
              <li>Abby: 等级4, 3.8 ETH</li>
              <li>显示详细的执行过程</li>
            </ul>
          </div>
          
          <button
            onClick={ultimateFix}
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-12 py-4 rounded-lg font-bold text-xl shadow-lg transform hover:scale-105 transition-all"
          >
            {loading ? '修复中...' : '执行终极修复'}
          </button>
        </div>
        
        {/* 结果显示 */}
        {result && (
          <div className={`mt-8 p-6 rounded-lg ${result.success ? 'bg-green-900/30 border-green-600' : 'bg-red-900/30 border-red-600'} border`}>
            <h3 className="text-xl font-bold mb-4">
              {result.success ? '✅ 修复成功！' : '⚠️ 部分成功'}
            </h3>
            
            <div className="space-y-4">
              <p className="text-lg">{result.message}</p>
              
              {result.results && (
                <div className="space-y-2">
                  {result.results.map((r: any, index: number) => (
                    <div key={index} className={`p-3 rounded ${r.success ? 'bg-green-800/30' : 'bg-red-800/30'}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold">
                            {r.type === 'josh' ? '🗡️ Josh (骑士)' : 
                             r.type === 'abby' ? '🔮 Abby (法师)' : 
                             r.type === 'user' ? '👤 用户' :
                             r.type === 'cleanup' ? '🧹 清理' :
                             r.type === 'verification' ? '✅ 验证' : r.type}
                          </p>
                          <p className="text-sm">{r.message}</p>
                          {r.error && <p className="text-xs text-red-400 mt-1">错误: {r.error}</p>}
                        </div>
                        <span className={`text-2xl ${r.success ? '✅' : '❌'}`}></span>
                      </div>
                      {r.data && (
                        <pre className="text-xs mt-2 overflow-auto bg-black/30 p-2 rounded">
                          {JSON.stringify(r.data, null, 2)}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-4 mt-6">
                <p className="font-bold text-yellow-400 mb-2">下一步：</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => {
                      localStorage.clear();
                      localStorage.setItem('currentUser', 'josh');
                      window.location.href = '/hub';
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-bold"
                  >
                    玩Josh
                  </button>
                  
                  <button
                    onClick={() => {
                      localStorage.clear();
                      localStorage.setItem('currentUser', 'abby');
                      window.location.href = '/hub';
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-bold"
                  >
                    玩Abby
                  </button>
                  
                  <button
                    onClick={() => window.location.href = '/admin/check-data'}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-bold"
                  >
                    检查数据
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => router.push('/admin')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded font-bold"
          >
            返回管理面板
          </button>
        </div>
      </div>
    </div>
  );
}