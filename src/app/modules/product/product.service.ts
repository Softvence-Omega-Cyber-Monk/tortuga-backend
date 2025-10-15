// src/modules/product/product.service.ts

import { Product } from "./product.model";
import {
  IProduct,
  CreateProductDTO,
  UpdateProductDTO,
  ProductCategory,
  CompatibleProductsResponse,
} from "./product.interface";

class ProductService {
  async createProduct(productData: CreateProductDTO & { imageUrl?: string }): Promise<IProduct> {
    const product = await Product.create(productData);
    return product;
  }
  async getAllProducts(filters?: {
    category?: ProductCategory;
    isActive?: boolean;
    isEOL?: boolean;
  }): Promise<IProduct[]> {
    const query: any = {};
    
    if (filters?.category) query.category = filters.category;
    if (filters?.isActive !== undefined) query.isActive = filters.isActive;
    if (filters?.isEOL !== undefined) query.isEOL = filters.isEOL;

    const products = await Product.find(query).sort({ createdAt: -1 });
    return products;
  }
  async getProductById(id: string): Promise<IProduct | null> {
    const product = await Product.findById(id);
    return product;
  }
  async updateProduct(id: string, updateData: UpdateProductDTO): Promise<IProduct | null> {
    const product = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    return product;
  }
  async deleteProduct(id: string): Promise<boolean> {
    const result = await Product.findByIdAndDelete(id);
    return !!result;
  }
  async getCompatibleProducts(selectedProductId: string): Promise<CompatibleProductsResponse[]> {
    const selectedProduct = await Product.findById(selectedProductId);
    
    if (!selectedProduct) {
      throw new Error("Selected product not found");
    }

    const compatibilityResults: CompatibleProductsResponse[] = [];
    for (const rule of selectedProduct.compatibilityRules) {
      const matchQuery: any = {
        category: rule.category,
        isActive: true,
      };
      Object.entries(rule.requiredAttributes).forEach(([key, value]) => {
        matchQuery[`attributes.${key}`] = value;
      });

      const compatibleProducts = await Product.find(matchQuery);

      compatibilityResults.push({
        category: rule.category,
        products: compatibleProducts,
      });
    }

    return compatibilityResults;
  }
  async getCompatibleProductsForConfiguration(
    selectedProductIds: string[]
  ): Promise<{ [key in ProductCategory]?: IProduct[] }> {
    const selectedProducts = await Product.find({
      _id: { $in: selectedProductIds },
    });

    if (selectedProducts.length === 0) {
      return this.getAllProductsByCategory();
    }
    const allCompatibilityRules = selectedProducts.flatMap(
      (product) => product.compatibilityRules
    );
    const rulesByCategory = allCompatibilityRules.reduce((acc, rule) => {
      if (!acc[rule.category]) {
        acc[rule.category] = [];
      }
      acc[rule.category]!.push(rule);
      return acc;
    }, {} as { [key in ProductCategory]?: any[] });
    const result: { [key in ProductCategory]?: IProduct[] } = {};

    for (const [category, rules] of Object.entries(rulesByCategory)) {
      const orConditions = rules.map((rule) => {
        const condition: any = {
          category: category,
          isActive: true,
        };

        Object.entries(rule.requiredAttributes).forEach(([key, value]) => {
          condition[`attributes.${key}`] = value;
        });

        return condition;
      });

      const products = await Product.find({ $or: orConditions });
      result[category as ProductCategory] = products;
    }

    return result;
  }
  async getAllProductsByCategory(): Promise<{ [key in ProductCategory]?: IProduct[] }> {
    const products = await Product.find({ isActive: true });

    const grouped = products.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category]!.push(product);
      return acc;
    }, {} as { [key in ProductCategory]?: IProduct[] });

    return grouped;
  }
  async toggleProductStatus(id: string): Promise<IProduct | null> {
    const product = await Product.findById(id);
    if (!product) return null;

    product.isActive = !product.isActive;
    await product.save();
    return product;
  }
  async toggleEOLStatus(id: string): Promise<IProduct | null> {
    const product = await Product.findById(id);
    if (!product) return null;

    product.isEOL = !product.isEOL;
    await product.save();
    return product;
  }
  async searchProducts(searchTerm: string): Promise<IProduct[]> {
    const products = await Product.find({
      $or: [
        { name: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
        { sku: { $regex: searchTerm, $options: "i" } },
      ],
      isActive: true,
    });
    return products;
  }
}

export const productService = new ProductService();