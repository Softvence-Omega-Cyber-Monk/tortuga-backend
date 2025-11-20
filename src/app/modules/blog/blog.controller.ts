import { Request, Response, NextFunction } from "express";
import { blogService } from "./blog.service";
import { uploadToCloudinary } from "../../utils/cloudinaryUpload";

class BlogController {
    async createBlog(req: Request, res: Response) {
        try {
            let imageUrl = "";
            let cloudinaryId = "";
            
            if (req.file) {
                const uploadResult = await uploadToCloudinary(req.file.path, "blogs");
                imageUrl = uploadResult;
                cloudinaryId = req.file.filename;
            }

            const payload = {
                ...req.body,
                imageUrl: imageUrl,
                cloudinaryId
            };

            const blog = await blogService.createBlog(payload);
            
            res.status(201).json({
                success: true,
                message: "Blog created successfully",
                data: blog
            });
        } catch (err: any) {
            console.error("Create blog error:", err);
            res.status(500).json({
                success: false,
                message: err.message || "Failed to create blog",
            });
        }
    }

    async getAllBlogs(req: Request, res: Response, next: NextFunction) {
        try {
            const blogs = await blogService.getAllBlogs();
            res.status(200).json({
                success: true,
                message: "Blogs fetched successfully",
                data: blogs,
            });
        } catch (error) {
            next(error);
        }
    }

    async getBlogById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const blog = await blogService.getBlogById(id);

            if (!blog) {
                return res.status(404).json({
                    success: false,
                    message: "Blog not found",
                });
            }

            res.status(200).json({
                success: true,
                message: "Blog fetched successfully",
                data: blog,
            });
        } catch (error) {
            next(error);
        }
    }

    async updateBlog(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            let updatedData: any = { ...req.body };

            // ✅ FIXED: Use imageUrl instead of image
            if (req.file) {
                const uploadResult = await uploadToCloudinary(req.file.path, "blogs");
                updatedData.imageUrl = uploadResult;  // Changed from .image to .imageUrl
                updatedData.cloudinaryId = req.file.filename;
            }

            const blog = await blogService.updateBlog(id, updatedData);

            if (!blog) {
                return res.status(404).json({
                    success: false,
                    message: "Blog not found",
                });
            }

            res.status(200).json({
                success: true,
                message: "Blog updated successfully",
                data: blog,
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteBlog(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            
            // ✅ Get blog first to delete image from Cloudinary
            const blog = await blogService.getBlogById(id);
            
            if (!blog) {
                return res.status(404).json({
                    success: false,
                    message: "Blog not found",
                });
            }

            // Delete the blog
            await blogService.deleteBlog(id);

            res.status(200).json({
                success: true,
                message: "Blog deleted successfully",
                data: blog,
            });
        } catch (error) {
            next(error);
        }
    }
}

export const blogController = new BlogController();