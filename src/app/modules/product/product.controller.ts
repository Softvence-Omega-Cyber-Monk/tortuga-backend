// src/modules/product/product.controller.ts

import { Request, Response } from "express";
import { productService } from "./product.service";
import { uploadToCloudinary } from "../../utils/cloudinaryUpload";
import { ProductCategory } from "./product.interface";

class ProductController {
    async createProduct(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id || "admin";

            // Access files from multer.fields()
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };

            // Handle main image
            let imageUrl: string | undefined;
            if (files?.image && files.image[0]) {
                imageUrl = await uploadToCloudinary(files.image[0].path, "products");
            }

            // Handle gallery images
            let galleryUrls: string[] = [];
            if (files?.galleryImages && files.galleryImages.length > 0) {
                galleryUrls = await Promise.all(
                    files.galleryImages.map(file => uploadToCloudinary(file.path, "products/gallery"))
                );
            }

            // Parse JSON fields safely
            let attributes: any = {};
            let compatibilityRules: any = [];

            if (typeof req.body.attributes === "string") {
                attributes = JSON.parse(req.body.attributes);
            } else {
                attributes = req.body.attributes || {};
            }

            if (typeof req.body.compatibilityRules === "string") {
                compatibilityRules = JSON.parse(req.body.compatibilityRules);
            } else {
                compatibilityRules = req.body.compatibilityRules || [];
            }

            // Parse keyFeatures if provided
            let keyFeatures: string[] = [];
            if (req.body.keyFeatures) {
                if (typeof req.body.keyFeatures === "string") {
                    keyFeatures = JSON.parse(req.body.keyFeatures);
                } else {
                    keyFeatures = req.body.keyFeatures;
                }
            }

            // Build product data object
            const productData = {
                name: req.body.name,
                company: req.body.company,
                category: req.body.category as ProductCategory,
                description: req.body.description,
                price: parseFloat(req.body.price),
                attributes,
                compatibilityRules,
                keyFeatures,
                isActive: req.body.isActive === "true" || req.body.isActive === true,
                isEOL: req.body.isEOL === "true" || req.body.isEOL === true,
                stock: parseInt(req.body.stock),
                sku: req.body.sku,
                imageUrl,
                galleryUrls,
                createdBy: userId,
            };

            // Create product in database
            const product = await productService.createProduct(productData);

            res.status(201).json({
                success: true,
                message: "Product created successfully",
                data: product,
            });
        } catch (err: any) {
            console.error("Create product error:", err);
            res.status(400).json({
                success: false,
                message: err.message || "Failed to create product",
            });
        }
    }

    // Get all products
    async getAllProducts(req: Request, res: Response) {
        try {
            const { category, isActive, isEOL } = req.query;

            const filters: any = {};
            if (category) filters.category = category;
            if (isActive !== undefined) filters.isActive = isActive === "true";
            if (isEOL !== undefined) filters.isEOL = isEOL === "true";

            const products = await productService.getAllProducts(filters);

            res.status(200).json({
                success: true,
                count: products.length,
                data: products,
            });
        } catch (err: any) {
            console.error("Get all products error:", err);
            res.status(500).json({
                success: false,
                message: err.message || "Failed to fetch products",
            });
        }
    }

    // Get product by ID
    async getProductById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const product = await productService.getProductById(id);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found",
                });
            }

            res.status(200).json({
                success: true,
                data: product,
            });
        } catch (err: any) {
            console.error("Get product by ID error:", err);
            res.status(500).json({
                success: false,
                message: err.message || "Failed to fetch product",
            });
        }
    }

    // Update product - FIXED
    async updateProduct(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            const file = req.file as Express.Multer.File | undefined;

            let imageUrl: string | undefined;
            let galleryUrls: string[] = [];

            // Handle main image from single upload
            if (file) {
                imageUrl = await uploadToCloudinary(file.path, "products");
            }

            // Handle main image from fields upload
            if (files?.image && files.image[0]) {
                imageUrl = await uploadToCloudinary(files.image[0].path, "products");
            }

            // Handle gallery images
            if (files?.galleryImages && files.galleryImages.length > 0) {
                galleryUrls = await Promise.all(
                    files.galleryImages.map(file => uploadToCloudinary(file.path, "products/gallery"))
                );
            }

            const updateData: any = { ...req.body };

            // Parse JSON fields if they exist
            if (req.body.attributes) {
                updateData.attributes = typeof req.body.attributes === "string" 
                    ? JSON.parse(req.body.attributes) 
                    : req.body.attributes;
            }
            
            if (req.body.compatibilityRules) {
                updateData.compatibilityRules = typeof req.body.compatibilityRules === "string"
                    ? JSON.parse(req.body.compatibilityRules)
                    : req.body.compatibilityRules;
            }

            if (req.body.keyFeatures) {
                updateData.keyFeatures = typeof req.body.keyFeatures === "string"
                    ? JSON.parse(req.body.keyFeatures)
                    : req.body.keyFeatures;
            }

            if (imageUrl) {
                updateData.imageUrl = imageUrl;
            }

            if (galleryUrls.length > 0) {
                updateData.galleryUrls = galleryUrls;
            }

            // Convert string booleans to actual booleans
            if (req.body.isActive !== undefined) {
                updateData.isActive = req.body.isActive === "true" || req.body.isActive === true;
            }
            if (req.body.isEOL !== undefined) {
                updateData.isEOL = req.body.isEOL === "true" || req.body.isEOL === true;
            }

            // Convert numeric strings
            if (req.body.price) {
                updateData.price = parseFloat(req.body.price);
            }
            if (req.body.stock) {
                updateData.stock = parseInt(req.body.stock);
            }

            const product = await productService.updateProduct(id, updateData);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found",
                });
            }

            res.status(200).json({
                success: true,
                message: "Product updated successfully",
                data: product,
            });
        } catch (err: any) {
            console.error("Update product error:", err);
            res.status(400).json({
                success: false,
                message: err.message || "Failed to update product",
            });
        }
    }

    // Delete product
    async deleteProduct(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const deleted = await productService.deleteProduct(id);

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found",
                });
            }

            res.status(200).json({
                success: true,
                message: "Product deleted successfully",
            });
        } catch (err: any) {
            console.error("Delete product error:", err);
            res.status(500).json({
                success: false,
                message: err.message || "Failed to delete product",
            });
        }
    }

    // Get compatible products for a selected product
    async getCompatibleProducts(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const compatibleProducts = await productService.getCompatibleProducts(id);

            res.status(200).json({
                success: true,
                data: compatibleProducts,
            });
        } catch (err: any) {
            console.error("Get compatible products error:", err);
            res.status(500).json({
                success: false,
                message: err.message || "Failed to fetch compatible products",
            });
        }
    }

    // Get compatible products for configuration (multiple selected products)
    async getCompatibleProductsForConfiguration(req: Request, res: Response) {
        try {
            const { productIds } = req.body;

            if (!Array.isArray(productIds)) {
                return res.status(400).json({
                    success: false,
                    message: "productIds must be an array",
                });
            }

            const compatibleProducts = await productService.getCompatibleProductsForConfiguration(
                productIds
            );

            res.status(200).json({
                success: true,
                data: compatibleProducts,
            });
        } catch (err: any) {
            console.error("Get compatible products for configuration error:", err);
            res.status(500).json({
                success: false,
                message: err.message || "Failed to fetch compatible products",
            });
        }
    }

    // Get all products grouped by category
    async getProductsByCategory(req: Request, res: Response) {
        try {
            const products = await productService.getAllProductsByCategory();

            res.status(200).json({
                success: true,
                data: products,
            });
        } catch (err: any) {
            console.error("Get products by category error:", err);
            res.status(500).json({
                success: false,
                message: err.message || "Failed to fetch products by category",
            });
        }
    }

    // Toggle product active status
    async toggleProductStatus(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const product = await productService.toggleProductStatus(id);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found",
                });
            }

            res.status(200).json({
                success: true,
                message: `Product ${product.isActive ? "activated" : "deactivated"} successfully`,
                data: product,
            });
        } catch (err: any) {
            console.error("Toggle product status error:", err);
            res.status(500).json({
                success: false,
                message: err.message || "Failed to toggle product status",
            });
        }
    }

    // Toggle EOL status
    async toggleEOLStatus(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const product = await productService.toggleEOLStatus(id);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found",
                });
            }

            res.status(200).json({
                success: true,
                message: `Product EOL status updated successfully`,
                data: product,
            });
        } catch (err: any) {
            console.error("Toggle EOL status error:", err);
            res.status(500).json({
                success: false,
                message: err.message || "Failed to toggle EOL status",
            });
        }
    }

    // Search products
    async searchProducts(req: Request, res: Response) {
        try {
            const { q } = req.query;

            if (!q || typeof q !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "Search query is required",
                });
            }

            const products = await productService.searchProducts(q);

            res.status(200).json({
                success: true,
                count: products.length,
                data: products,
            });
        } catch (err: any) {
            console.error("Search products error:", err);
            res.status(500).json({
                success: false,
                message: err.message || "Failed to search products",
            });
        }
    }
}

export const productController = new ProductController();