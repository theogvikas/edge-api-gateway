import { Request, Response, NextFunction } from 'express';

const tenantKeys: Record<string, string> = {
  'tenant-123': 'key-123-abc',
  'acme-corp': 'key-acme-999',
};

export const validateTenantApiKey = (req: Request, res: Response, next: NextFunction) => {
  const tenantId = req.params.tenantId;
  const apiKey = req.headers['x-api-key'] as string;

  if (!tenantId) {
    return res.status(400).json({ error: 'Tenant ID is required' });
  }

  const expectedKey = tenantKeys[tenantId];

  if (!expectedKey || expectedKey !== apiKey) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing API key for tenant' });
  }

  next();
};
