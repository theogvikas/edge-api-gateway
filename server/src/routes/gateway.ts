import { Router, Request, Response } from 'express';
import Tenant from '../models/Tenant';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, tenantId, targetUrl, apiKey } = req.body;
    const existingTenant = await Tenant.findOne({ tenantId });
    
    if (existingTenant) {
      return res.status(400).json({ error: 'Tenant already exists' });
    }

    const tenant = new Tenant({ name, tenantId, targetUrl, apiKey });
    await tenant.save();
    return res.status(201).json({ message: 'Tenant registered successfully', tenant });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.all('/:tenantId/*', async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.params;
    const clientApiKey = req.headers['x-api-key'];

    const tenant = await Tenant.findOne({ tenantId, isActive: true });

    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found or inactive' });
    }

    if (tenant.apiKey && tenant.apiKey !== clientApiKey) {
      return res.status(401).json({ error: 'Unauthorized: Invalid or missing API Key' });
    }

    const subPath = req.params[0] || '';
    const targetUrl = `${tenant.targetUrl.replace(/\/$/, '')}/${subPath}`;

    const fetchOptions: RequestInit = {
      method: req.method,
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/json',
        'X-Forwarded-Tenant': tenant.tenantId
      }
    };

    if (!['GET', 'HEAD'].includes(req.method) && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl, fetchOptions);
    const data = await response.text();

    res.status(response.status);
    return res.send(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
