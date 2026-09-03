import { Router } from 'express';
import { validateTenantApiKey } from '../middleware/auth';

const router = Router();

// Apply API key validation middleware to all gateway tenant sub-routes
router.all('/:tenantId/*', validateTenantApiKey, async (req, res) => {
  const { tenantId } = req.params;
  const subPath = req.params[0];

  res.json({
    message: `Authenticated gateway request successful for tenant: ${tenantId}`,
    targetPath: `/${subPath}`,
    method: req.method,
    query: req.query
  });
});

export default router;
