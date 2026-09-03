import express from 'express';
import cors from 'cors';
import gatewayRouter from './routes/gateway';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', uptime: process.uptime() });
});

// Mount multi-tenant gateway router
app.use('/api/gateway', gatewayRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
