import { Configuration } from './configrator.model';
import { IConfigurationProduct, IGuestUserInfo } from './configurator.interface';

interface CreateConfigurationDTO {
  userId?: string;
  guestUserInfo?: IGuestUserInfo;
  products: IConfigurationProduct[];
  totalPrice: number;
  notes?: string;
}

interface UpdateConfigurationDTO {
  products?: IConfigurationProduct[];
  totalPrice?: number;
  status?: 'draft' | 'completed' | 'ordered';
  notes?: string;
}

class ConfigurationService {
  // Create a new configuration
  async createConfiguration(data: CreateConfigurationDTO) {
    try {
      const configuration = await Configuration.create(data);
      return {
        success: true,
        message: 'Configuration saved successfully',
        data: configuration
      };
    } catch (error: any) {
      throw new Error(`Failed to create configuration: ${error.message}`);
    }
  }

  // Get configuration by ID
  async getConfigurationById(configurationId: string) {
    try {
      const configuration = await Configuration.findById(configurationId)
        .populate('userId', 'name email')
        .populate('products.productId');

      if (!configuration) {
        return {
          success: false,
          message: 'Configuration not found',
          data: null
        };
      }

      return {
        success: true,
        message: 'Configuration retrieved successfully',
        data: configuration
      };
    } catch (error: any) {
      throw new Error(`Failed to get configuration: ${error.message}`);
    }
  }

  // Get all configurations for a user
  async getUserConfigurations(userId: string, limit = 10, skip = 0) {
    try {
      const configurations = await Configuration.find({ userId })
        .sort({ configurationDate: -1 })
        .limit(limit)
        .skip(skip)
        .populate('products.productId');

      const total = await Configuration.countDocuments({ userId });

      return {
        success: true,
        message: 'User configurations retrieved successfully',
        data: configurations,
        pagination: {
          total,
          limit,
          skip,
          hasMore: total > skip + limit
        }
      };
    } catch (error: any) {
      throw new Error(`Failed to get user configurations: ${error.message}`);
    }
  }

  // Get configurations by guest email
  async getGuestConfigurations(email: string, limit = 10, skip = 0) {
    try {
      const configurations = await Configuration.find({ 'guestUserInfo.email': email })
        .sort({ configurationDate: -1 })
        .limit(limit)
        .skip(skip);

      const total = await Configuration.countDocuments({ 'guestUserInfo.email': email });

      return {
        success: true,
        message: 'Guest configurations retrieved successfully',
        data: configurations,
        pagination: {
          total,
          limit,
          skip,
          hasMore: total > skip + limit
        }
      };
    } catch (error: any) {
      throw new Error(`Failed to get guest configurations: ${error.message}`);
    }
  }

  // Get all configurations (admin)
  async getAllConfigurations(filters: any = {}, limit = 20, skip = 0) {
    try {
      const query: any = {};

      if (filters.status) {
        query.status = filters.status;
      }

      if (filters.startDate || filters.endDate) {
        query.configurationDate = {};
        if (filters.startDate) {
          query.configurationDate.$gte = new Date(filters.startDate);
        }
        if (filters.endDate) {
          query.configurationDate.$lte = new Date(filters.endDate);
        }
      }

      const configurations = await Configuration.find(query)
        .sort({ configurationDate: -1 })
        .limit(limit)
        .skip(skip)
        .populate('userId', 'name email');

      const total = await Configuration.countDocuments(query);

      return {
        success: true,
        message: 'All configurations retrieved successfully',
        data: configurations,
        pagination: {
          total,
          limit,
          skip,
          hasMore: total > skip + limit
        }
      };
    } catch (error: any) {
      throw new Error(`Failed to get all configurations: ${error.message}`);
    }
  }

  // Update configuration
  async updateConfiguration(configurationId: string, data: UpdateConfigurationDTO) {
    try {
      const configuration = await Configuration.findByIdAndUpdate(
        configurationId,
        { $set: data },
        { new: true, runValidators: true }
      );

      if (!configuration) {
        return {
          success: false,
          message: 'Configuration not found',
          data: null
        };
      }

      return {
        success: true,
        message: 'Configuration updated successfully',
        data: configuration
      };
    } catch (error: any) {
      throw new Error(`Failed to update configuration: ${error.message}`);
    }
  }

  // Delete configuration
  async deleteConfiguration(configurationId: string) {
    try {
      const configuration = await Configuration.findByIdAndDelete(configurationId);

      if (!configuration) {
        return {
          success: false,
          message: 'Configuration not found'
        };
      }

      return {
        success: true,
        message: 'Configuration deleted successfully'
      };
    } catch (error: any) {
      throw new Error(`Failed to delete configuration: ${error.message}`);
    }
  }

  // Get configuration statistics
  async getConfigurationStats(userId?: string) {
    try {
      const query = userId ? { userId } : {};

      const stats = await Configuration.aggregate([
        { $match: query },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalValue: { $sum: '$totalPrice' },
            avgValue: { $avg: '$totalPrice' }
          }
        }
      ]);

      const total = await Configuration.countDocuments(query);

      return {
        success: true,
        message: 'Configuration statistics retrieved successfully',
        data: {
          total,
          byStatus: stats,
          totalValue: stats.reduce((sum, s) => sum + s.totalValue, 0)
        }
      };
    } catch (error: any) {
      throw new Error(`Failed to get configuration stats: ${error.message}`);
    }
  }
}

export default new ConfigurationService();