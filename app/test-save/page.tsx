'use client';

import { useState } from 'react';

export default function TestSavePage() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testSave = async () => {
    setLoading(true);
    setResult('Testing save...\n');
    
    try {
      // 创建测试角色数据
      const testCharacter = {
        id: 'test-josh',
        type: 'josh',
        level: 5,
        experience: 250,
        expToNextLevel: 500,
        eth: '35200000000000000',
        hp: 150,
        maxHp: 150,
        mp: 50,
        maxMp: 50,
        attack: 35,
        defense: 20,
        baseHp: 150,
        baseMp: 50,
        baseAttack: 35,
        baseDefense: 20,
        stagesCleared: ['forest-1', 'forest-2'],
        stagesPaidFor: ['forest-1', 'forest-2'],
        inventory: []
      };

      setResult(prev => prev + 'Sending save request...\n');
      
      const response = await fetch('/api/saves/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `Test Save ${new Date().toISOString()}`,
          character: testCharacter
        })
      });

      const data = await response.json();
      setResult(prev => prev + `Response status: ${response.status}\n`);
      setResult(prev => prev + `Response data: ${JSON.stringify(data, null, 2)}\n`);
      
      if (!response.ok) {
        setResult(prev => prev + `Error: ${data.error || 'Unknown error'}\n`);
      }
    } catch (error: any) {
      setResult(prev => prev + `Catch error: ${error.message}\n`);
      setResult(prev => prev + `Stack trace: ${error.stack}\n`);
    } finally {
      setLoading(false);
    }
  };

  const testList = async () => {
    setLoading(true);
    setResult('Testing list saves...\n');
    
    try {
      const response = await fetch('/api/saves/list?type=josh');
      const data = await response.json();
      
      setResult(prev => prev + `Response status: ${response.status}\n`);
      setResult(prev => prev + `Response data: ${JSON.stringify(data, null, 2)}\n`);
    } catch (error: any) {
      setResult(prev => prev + `Error: ${error.message}\n`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">存档功能测试</h1>
      
      <div className="space-y-4 mb-8">
        <button
          onClick={testSave}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg disabled:opacity-50"
        >
          测试创建存档
        </button>
        
        <button
          onClick={testList}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg disabled:opacity-50 ml-4"
        >
          测试列出存档
        </button>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">结果输出：</h2>
        <pre className="whitespace-pre-wrap font-mono text-sm">
          {result || '点击按钮开始测试...'}
        </pre>
      </div>
    </div>
  );
}