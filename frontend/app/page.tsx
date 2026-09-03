'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [healthData, setHealthData] = useState<any>(null);
  const [tenantId, setTenantId] = useState('tenant-123');
  const [apiKey, setApiKey] = useState('key-123-abc');
  const [gatewayResponse, setGatewayResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then((res) => res.json())
      .then((data) => setHealthData(data))
      .catch((err) => setHealthData({ error: err.message }));
  }, [API_URL]);

  const testGateway = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/gateway/${tenantId}/test-action?foo=bar`, {
        method: 'GET',
        headers: {
          'x-api-key': apiKey,
        },
      });
      const data = await res.json();
      setGatewayResponse(data);
    } catch (err: any) {
      setGatewayResponse({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Edge API Gateway Dashboard</h1>
      
      <section style={{ margin: '1.5rem 0', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h3>Backend Health Check</h3>
        <pre>{JSON.stringify(healthData, null, 2)}</pre>
      </section>

      <section style={{ margin: '1.5rem 0', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h3>Multi-Tenant Gateway Test</h3>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Tenant ID:</label>
          <input 
            type="text" 
            value={tenantId} 
            onChange={(e) => setTenantId(e.target.value)}
            style={{ padding: '0.5rem', width: '100%', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>API Key:</label>
          <input 
            type="text" 
            value={apiKey} 
            onChange={(e) => setApiKey(e.target.value)}
            style={{ padding: '0.5rem', width: '100%', boxSizing: 'border-box' }}
          />
        </div>
        <button 
          onClick={testGateway}
          style={{ padding: '0.5rem 1rem', background: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {loading ? 'Testing...' : 'Send Authenticated Request'}
        </button>
        {gatewayResponse && (
          <div style={{ marginTop: '1rem' }}>
            <h4>Gateway Response:</h4>
            <pre style={{ background: '#f4f4f4', padding: '0.5rem' }}>{JSON.stringify(gatewayResponse, null, 2)}</pre>
          </div>
        )}
      </section>
    </main>
  );
}
