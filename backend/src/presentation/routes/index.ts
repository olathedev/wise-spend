import { Router } from 'express';
import { AIController } from '@presentation/controllers/AIController';

const router = Router();
const aiController = new AIController();

// Example route - replace with your actual routes
router.get('/', (req, res) => {
  res.json({ message: 'API is working!' });
});

// AI Routes
router.post('/ai/generate', (req, res, next) => aiController.generateText(req, res, next));
router.post('/ai/chat', (req, res, next) => aiController.chat(req, res, next));

export { router as routes };
