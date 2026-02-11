import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import agentRoutes, { initializeServices } from './routes/agent';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Agent API routes
app.use('/api/agent', agentRoutes);

// Initialize services
initializeServices();

app.listen(PORT, () => {
  console.log(`🚀 BluePilot Agent API running on port ${PORT}`);
  console.log(`📡 Event monitoring active`);
  console.log(`🔗 Endpoints:`);
  console.log(`   GET  /health`);
  console.log(`   POST /api/agent/simulate`);
  console.log(`   POST /api/agent/execute`);
  console.log(`   GET  /api/agent/policy/:address`);
  console.log(`   GET  /api/agent/price/:token`);
  console.log(`   GET  /api/agent/alerts`);
});

export default app;
