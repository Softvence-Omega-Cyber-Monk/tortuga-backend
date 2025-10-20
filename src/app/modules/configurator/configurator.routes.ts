import { Router } from 'express';
import configurationController from './configurator.controller';
// import { authenticate, optionalAuth } from '../middleware/auth.middleware'; // Your auth middleware

const router = Router();

// Public/Semi-public routes
router.post('/configurations', configurationController.createConfiguration);

// Protected routes (require authentication)
router.get('/configurations/my', configurationController.getUserConfigurations);
router.get('/configurations/:id', configurationController.getConfiguration);
router.put('/configurations/:id', configurationController.updateConfiguration);
router.delete('/configurations/:id', configurationController.deleteConfiguration);

// Admin routes (add admin middleware as needed)
router.get('/configurations', configurationController.getAllConfigurations);
router.get('/configurations/stats', configurationController.getStatistics);

export default router;