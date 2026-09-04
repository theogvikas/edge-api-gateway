'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [healthData, setHealthData] = useState<any>(null);
  const [tenantId, setTenantId] = useState('tenant-123');
  const [apiKey, setApiKey] = useState('key-123-abc');
  const [subPath, setSubPath] = useState('test-action');
  const [gatewayResponse, setGatewayResponse] = useState<any>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const API_URL = 'https://edge-api-gateway.onrender.com';

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 8000);
    return () => clearInterval(interval);
  }, []);

  const checkHealth = () => {
    fetch(`${API_URL}/health`)
      .then((res) => res.json())
      .then((data) => setHealthData(data))
      .catch((err) => setHealthData({ status: 'OFFLINE', error: err.message }));
  };

  const handlePreset = (tId: string, aKey: string) => {
    setTenantId(tId);
    setApiKey(aKey);
  };

  const testGateway = async () => {
    setLoading(true);
    setGatewayResponse(null);
    try {
      const res = await fetch(`${API_URL}/api/gateway/${tenantId}/${subPath}?source=dashboard`, {
        method: 'GET',
        headers: {
          'x-api-key': apiKey,
        },
      });
      setResponseStatus(res.status);
      const data = await res.json();
      setGatewayResponse(data);
    } catch (err: any) {
      setResponseStatus(500);
      setGatewayResponse({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#07090E] text-slate-100 p-6 md:p-14 font-sans relative overflow-hidden selection:bg-amber-400 selection:text-slate-950">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto space-y-10 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-6 gap-4 backdrop-blur-md">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center">
                <span className="absolute w-4 h-4 rounded-full bg-amber-400/40 animate-ping"></span>
                <span className="relative w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)]"></span>
              </div>
              <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-amber-200 bg-clip-text text-transparent">
                Edge API Gateway
              </h1>
            </div>
            <p className="text-slate-400 text-sm font-medium tracking-wide">Enterprise Multi-Tenant Routing & Security Control Hub</p>
          </div>

          <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 backdrop-blur-xl px-4 py-2.5 rounded-2xl text-xs shadow-2xl">
            <span className="text-slate-400 font-medium">Node Status:</span>
            <span className={`font-mono font-bold px-2.5 py-1 rounded-lg transition-all duration-300 ${healthData?.status === 'OK' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'bg-rose-500/15 text-rose-400 border border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.2)]'}`}>
              {healthData?.status === 'OK' ? 'SECURE / ONLINE' : 'OFFLINE'}
            </span>
            {healthData?.uptime && (
              <span className="text-slate-500 font-mono">({Math.floor(healthData.uptime)}s uptime)</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-3xl p-7 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] space-y-6 transition-all hover:border-amber-500/30">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2.5 tracking-wide">
                <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Request Configuration
              </h2>
              <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">Live Payload</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Quick Tenant Presets:</label>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => handlePreset('tenant-123', 'key-123-abc')}
                  className="text-xs bg-white/5 hover:bg-amber-400/10 text-amber-300 px-3.5 py-2 rounded-xl border border-white/10 hover:border-amber-400/30 transition-all duration-200 font-medium active:scale-95"
                >
                  Tenant 123 (Valid)
                </button>
                <button 
                  onClick={() => handlePreset('acme-corp', 'key-acme-999')}
                  className="text-xs bg-white/5 hover:bg-amber-400/10 text-amber-300 px-3.5 py-2 rounded-xl border border-white/10 hover:border-amber-400/30 transition-all duration-200 font-medium active:scale-95"
                >
                  Acme Corp (Valid)
                </button>
                <button 
                  onClick={() => handlePreset('tenant-123', 'wrong-key')}
                  className="text-xs bg-white/5 hover:bg-rose-500/10 text-rose-400 px-3.5 py-2 rounded-xl border border-white/10 hover:border-rose-500/30 transition-all duration-200 font-medium active:scale-95"
                >
                  Invalid Key (Test 401)
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Tenant ID</label>
                <input 
                  type="text" 
                  value={tenantId} 
                  onChange={(e) => setTenantId(e.target.value)}
                  className="w-full bg-[#04060A] border border-white/10 rounded-2xl px-4.5 py-3 text-sm text-slate-100 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all font-mono shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">API Key (x-api-key header)</label>
                <input 
                  type="text" 
                  value={apiKey} 
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-[#04060A] border border-white/10 rounded-2xl px-4.5 py-3 text-sm text-slate-100 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all font-mono shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Target Route Subpath</label>
                <input 
                  type="text" 
                  value={subPath} 
                  onChange={(e) => setSubPath(e.target.value)}
                  className="w-full bg-[#04060A] border border-white/10 rounded-2xl px-4.5 py-3 text-sm text-slate-100 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all font-mono shadow-inner"
                />
              </div>
            </div>

            <button 
              onClick={testGateway}
              disabled={loading}
              className="w-full relative group overflow-hidden rounded-2xl p-[1px] focus:outline-none transition-all active:scale-[0.99]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 rounded-2xl opacity-75 group-hover:opacity-100 transition-opacity blur-[1px]"></span>
              <div className="relative bg-slate-950 px-6 py-3.5 rounded-2xl flex items-center justify-center gap-3 transition-all group-hover:bg-opacity-90">
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-amber-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-amber-300 font-bold tracking-wide text-sm">Routing Edge Request...</span>
                  </>
                ) : (
                  <>
                    <span className="text-amber-300 font-bold tracking-wide text-sm">Send Authenticated Request</span>
                    <svg className="w-4 h-4 text-amber-300 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </div>
            </button>
          </div>

          <div className="lg:col-span-6 bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-3xl p-7 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] flex flex-col transition-all hover:border-emerald-500/30">
            <div className="flex justify-between items-center mb-5 border-b border-white/5 pb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2.5 tracking-wide">
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Gateway Inspector
              </h2>
              {responseStatus && (
                <span className={`text-xs font-mono px-3 py-1 rounded-xl font-bold transition-all animate-bounce ${responseStatus === 200 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.3)]'}`}>
                  HTTP {responseStatus} {responseStatus === 200 ? 'OK' : 'Unauthorized'}
                </span>
              )}
            </div>

            <div className="flex-1 bg-[#04060A] text-slate-300 border border-white/10 rounded-2xl p-5 font-mono text-xs overflow-auto min-h-[300px] max-h-[380px] shadow-inner relative group">
              <div className="absolute top-3 right-3 text-[10px] text-slate-600 font-mono tracking-widest uppercase">JSON Response</div>
              {gatewayResponse ? (
                <pre className="whitespace-pre-wrap text-amber-200/90">{JSON.stringify(gatewayResponse, null, 2)}</pre>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <svg className="w-6 h-6 stroke-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-slate-500 text-center font-sans text-xs">Ready for inspection. Trigger a request to view live encrypted tenant routing metrics.</p>
                </div>
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-white/5 text-xs text-slate-500 flex justify-between font-mono">
              <span>Edge Node: <strong className="text-slate-300">Global Cluster (US-East)</strong></span>
              <span>Latency: <strong className="text-emerald-400">12ms</strong></span>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
