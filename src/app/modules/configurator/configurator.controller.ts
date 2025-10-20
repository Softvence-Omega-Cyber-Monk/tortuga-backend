import { Request, Response } from 'express';
import configuratorService from './configurator.service';

class ConfigurationController {
  // Create configuration
  async createConfiguration(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id; // From auth middleware
      const { guestUserInfo, products, totalPrice, notes } = req.body;

      // Validation
      if (!products || products.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Products are required'
        });
      }

      if (!totalPrice || totalPrice <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Valid total price is required'
        });
      }

      // Either userId or guestUserInfo required
      if (!userId && !guestUserInfo) {
        return res.status(400).json({
          success: false,
          message: 'User authentication or guest information is required'
        });
      }

      const configData: any = {
        products,
        totalPrice,
        notes
      };

      if (userId) {
        configData.userId = userId;
      } else {
        // Validate guest info
        if (!guestUserInfo.name || !guestUserInfo.email || !guestUserInfo.phone || !guestUserInfo.address) {
          return res.status(400).json({
            success: false,
            message: 'Complete guest information is required (name, email, phone, address)'
          });
        }
        configData.guestUserInfo = guestUserInfo;
      }

      const result = await configuratorService.createConfiguration(configData);
      
      return res.status(201).json(result);
    } catch (error: any) {
      console.error('Create configuration error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to create configuration'
      });
    }
  }

  // Get configuration by ID
  async getConfiguration(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await configuratorService.getConfigurationById(id);
      
      if (!result.success) {
        return res.status(404).json(result);
      }

      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Get configuration error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to get configuration'
      });
    }
  }

  // Get user's configurations
  async getUserConfigurations(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = parseInt(req.query.skip as string) || 0;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const result = await configuratorService.getUserConfigurations(userId, limit, skip);
      
      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Get user configurations error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to get user configurations'
      });
    }
  }

  // Get all configurations (admin)
  async getAllConfigurations(req: Request, res: Response) {
    try {
      const filters = {
        status: req.query.status as string,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string
      };
      const limit = parseInt(req.query.limit as string) || 20;
      const skip = parseInt(req.query.skip as string) || 0;

      const result = await configuratorService.getAllConfigurations(filters, limit, skip);
      
      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Get all configurations error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to get configurations'
      });
    }
  }

  // Update configuration
  async updateConfiguration(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const result = await configuratorService.updateConfiguration(id, updateData);
      
      if (!result.success) {
        return res.status(404).json(result);
      }

      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Update configuration error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to update configuration'
      });
    }
  }

  // Delete configuration
  async deleteConfiguration(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await configuratorService.deleteConfiguration(id);
      
      if (!result.success) {
        return res.status(404).json(result);
      }

      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Delete configuration error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to delete configuration'
      });
    }
  }

  // Get statistics
  async getStatistics(req: Request, res: Response) {
    try {
      const userId = req.query.userId as string;
      const result = await configuratorService.getConfigurationStats(userId);
      
      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Get statistics error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to get statistics'
      });
    }
  }
}

export default new ConfigurationController();
