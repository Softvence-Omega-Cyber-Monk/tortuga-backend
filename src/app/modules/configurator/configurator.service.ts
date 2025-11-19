import { Configurator } from "./configrator.model";
import { IConfigurator } from "./configurator.interface";
import { sendConfigurationEmail } from "../../utils/email.util";

class ConfiguratorService {
  async createConfiguration(data: IConfigurator) {
    try {
      // Validate that total price matches calculation
      const calculatedTotal = data.selectedProducts.reduce(
        (sum, product) => sum + (product.price * product.quantity),
        0
      );

      // Allow small floating point differences
      if (Math.abs(calculatedTotal - data.totalPrice) > 0.01) {
        throw new Error(
          `Total price mismatch. Expected ${calculatedTotal}, got ${data.totalPrice}`
        );
      }

      // Create configuration in database
      const configuration = await Configurator.create(data);

      return configuration;
    } catch (error: any) {
      throw new Error(`Failed to create configuration: ${error.message}`);
    }
  }

  async sendConfigurationEmail(
    email: string,
    name: string,
    pdfBase64: string,
    totalPrice: number,
    totalItems: number
  ) {
    try {
      await sendConfigurationEmail({
        to: email,
        name,
        pdfBase64,
        totalPrice,
        totalItems
      });
    } catch (error: any) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  async getAllConfigurations(page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const configurations = await Configurator.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Configurator.countDocuments();

      return {
        configurations,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error: any) {
      throw new Error(`Failed to fetch configurations: ${error.message}`);
    }
  }

  async getConfigurationById(id: string) {
    try {
      const configuration = await Configurator.findById(id);
      if (!configuration) {
        throw new Error('Configuration not found');
      }
      return configuration;
    } catch (error: any) {
      throw new Error(`Failed to fetch configuration: ${error.message}`);
    }
  }

  async getConfigurationsByEmail(email: string) {
    try {
      const configurations = await Configurator.find({ email })
        .sort({ createdAt: -1 });
      return configurations;
    } catch (error: any) {
      throw new Error(`Failed to fetch configurations: ${error.message}`);
    }
  }

  async deleteConfiguration(id: string) {
    try {
      const configuration = await Configurator.findByIdAndDelete(id);

      if (!configuration) {
        throw new Error('Configuration not found');
      }

      return configuration;
    } catch (error: any) {
      throw new Error(`Failed to delete configuration: ${error.message}`);
    }
  }
}

export default new ConfiguratorService();