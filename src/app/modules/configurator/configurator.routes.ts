import { Router } from 'express';
import configuratorController from './configurator.controller';
// import { authenticate } from '../middlewares/auth.middleware'; // If you need auth

const router = Router();

// Public routes
router.post('/', configuratorController.createConfiguration);

// Protected routes (uncomment if you need authentication)
// router.use(authenticate);
router.get('/', configuratorController.getAllConfigurations);
router.get('/:id', configuratorController.getConfigurationById);
router.get('/email/:email', configuratorController.getConfigurationsByEmail);
router.delete('/:id', configuratorController.deleteConfiguration);

export const ConfiguratorRouter = router;