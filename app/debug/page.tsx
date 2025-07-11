'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DebugPage() {
  const router = useRouter();
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDebugInfo();
  }, []);

  const loadDebugInfo = async () => {
    setLoading(true);
    try {
      const info: any = {};
      
      // Get device ID
      info.deviceId = localStorage.getItem('deviceId') || 'Not set';
      
      // Get local storage data
      info.localStorage = {};
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.includes('character') || key.includes('equipment')) {
          info.localStorage[key] = localStorage.getItem(key);
        }
      });
      
      // Try to load from cloud
      info.cloudData = {};
      try {
        const joshRes = await fetch('/api/character/load?type=josh');
        info.cloudData.joshResponse = {
          status: joshRes.status,
          ok: joshRes.ok,
          data: await joshRes.json()
        };
      } catch (e) {
        info.cloudData.joshError = e.message;
      }
      
      try {
        const abbyRes = await fetch('/api/character/load?type=abby');
        info.cloudData.abbyResponse = {
          status: abbyRes.status,
          ok: abbyRes.ok,
          data: await abbyRes.json()
        };
      } catch (e) {
        info.cloudData.abbyError = e.message;
      }
      
      setDebugInfo(info);
    } catch (error) {
      setDebugInfo({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const generateNewDeviceId = () => {
    const newId = crypto.randomUUID();
    localStorage.setItem('deviceId', newId);
    loadDebugInfo();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Debug Information</h1>
        
        <div className="flex gap-4 mb-8">
          <button
            onClick={loadDebugInfo}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            Refresh
          </button>
          <button
            onClick={generateNewDeviceId}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
          >
            Generate New Device ID
          </button>
          <button
            onClick={() => router.push('/admin')}
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
          >
            Back to Admin
          </button>
        </div>
        
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-6">
            <pre className="text-sm overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}
        
        <div className="mt-8 p-4 bg-yellow-900 rounded-lg">
          <h2 className="text-xl font-bold mb-2">说明</h2>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Device ID 用于在云端识别你的设备</li>
            <li>如果 Device ID 改变了，云端数据将无法加载</li>
            <li>localStorage 中的数据是本地保存的</li>
            <li>cloudData 是从服务器加载的数据</li>
            <li>如果云端没有数据，可能是因为从未保存过，或者 Device ID 不匹配</li>
          </ul>
        </div>
      </div>
    </div>
  );
}