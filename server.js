const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const tenants = {
  'tenant-123': { name: 'Alpha Corp', apiKey: 'key-123-abc', quota: 1000 },
  'acme-corp': { name: 'Acme Industries', apiKey: 'key-acme-999', quota: 5000 },
  'globex-s.a.': { name: 'Globex Corporation', apiKey: 'key-globex-777', quota: 10000 }
};

let requestLogs = [];

app.get('/health', (req, res) => {
  res.json({ status: 'OK', uptime: process.uptime(), activeTenants: Object.keys(tenants).length });
});

app.get('/api/metrics', (req, res) => {
  res.json({ totalRequests: requestLogs.length, recentLogs: requestLogs.slice(-10) });
});

app.get('/api/gateway/:tenantId/:subPath', (req, res) => {
  const { tenantId, subPath } = req.params;
  const apiKey = req.headers['x-api-key'];
  
  if (!tenants[tenantId] || tenants[tenantId].apiKey !== apiKey) {
    requestLogs.push({ tenantId, path: subPath, status: 401, timestamp: new Date() });
    return res.status(401).json({ error: 'Unauthorized: Invalid tenant ID or API key' });
  }

  requestLogs.push({ tenantId, path: subPath, status: 200, timestamp: new Date() });
  res.json({
    message: `Authenticated gateway request successful for tenant: ${tenantId}`,
    tenantName: tenants[tenantId].name,
    targetPath: `/${subPath}`,
    method: req.method,
    query: req.query,
    edgeNode: 'Global Cluster (US-East)',
    processedAt: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Gateway running on port ${PORT}`));
