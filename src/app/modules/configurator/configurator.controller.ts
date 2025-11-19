import { Request, Response } from 'express';
import configuratorService from './configurator.service';
import { catchAsync } from '../../utils/catchAsync';

class ConfiguratorController {
  createConfiguration = catchAsync(async (req: Request, res: Response) => {
    const { name, email, phone, selectedProducts, totalPrice, pdfBase64 } = req.body;

    // Validate request
    if (!name || !email || !phone || !selectedProducts || !totalPrice) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    if (!Array.isArray(selectedProducts) || selectedProducts.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one product must be selected'
      });
    }

    // Validate that all products have quantity
    const invalidProducts = selectedProducts.filter(
      product => !product.quantity || product.quantity < 1
    );

    if (invalidProducts.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'All products must have a valid quantity (at least 1)'
      });
    }

    // Calculate total items
    const totalItems = selectedProducts.reduce(
      (sum, product) => sum + (product.quantity || 0), 
      0
    );

    // Create configuration
    const configuration = await configuratorService.createConfiguration({
      name,
      email,
      phone,
      selectedProducts,
      totalPrice
    });

    // Send email with PDF if pdfBase64 is provided
    if (pdfBase64) {
      try {
        await configuratorService.sendConfigurationEmail(
          email,
          name,
          pdfBase64,
          totalPrice,
          totalItems
        );
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Continue even if email fails
      }
    }

    res.status(201).json({
      success: true,
      message: 'Configuration saved successfully',
      data: configuration
    });
  });

  getAllConfigurations = catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await configuratorService.getAllConfigurations(page, limit);

    res.status(200).json({
      success: true,
      data: result.configurations,
      pagination: result.pagination
    });
  });

  getConfigurationById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const configuration = await configuratorService.getConfigurationById(id);

    res.status(200).json({
      success: true,
      data: configuration
    });
  });

  getConfigurationsByEmail = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.params;
    const configurations = await configuratorService.getConfigurationsByEmail(email);

    res.status(200).json({
      success: true,
      data: configurations
    });
  });

  async deleteConfiguration(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await configuratorService.deleteConfiguration(id);

      res.status(200).json({
        success: true,
        message: 'Configuration deleted successfully'
      });
    } catch (error: any) {
      console.error('❌ Delete error:', error);
      res.status(404).json({
        success: false,
        message: error.message || 'Failed to delete configuration'
      });
    }
  }
}

export default new ConfiguratorController();