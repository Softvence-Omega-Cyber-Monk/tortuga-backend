import { Configurator } from "./configrator.model";
import { IConfigurator } from "./configurator.interface";
import { sendConfigurationEmail } from "../../utils/email.util";

class ConfiguratorService {
  async createConfiguration(data: IConfigurator) {
    try {
      // Create configuration in database
      const configuration = await Configurator.create(data);

      // Send email with PDF (the PDF will be generated on frontend and sent as base64)
      // We'll return the configuration and let the frontend handle PDF generation
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
    productsCount: number
  ) {
    try {
      await sendConfigurationEmail({
        to: email,
        name,
        pdfBase64,
        totalPrice,
        productsCount
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