import { Router } from 'express';

const router = Router();

// Example route - replace with your actual routes
router.get('/', (req, res) => {
  res.json({ message: 'API is working!' });
});

export { router as routes };
