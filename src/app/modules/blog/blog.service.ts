import { cloudinary } from "../../config/cloudinary.config";
import { IBlog } from "./blog.interface";
import { Blog } from "./blog.model";

class BlogService {
    async createBlog(payload: Partial<IBlog>): Promise<IBlog> {
        return Blog.create(payload);
    }

    async getAllBlogs(): Promise<IBlog[]> {
        return Blog.find().sort({ createdAt: -1 });
    }

    async getBlogById(id: string): Promise<IBlog | null> {
        return Blog.findById(id);
    }

    async updateBlog(id: string, payload: Partial<IBlog>): Promise<IBlog | null> {
        // ✅ Get the old blog to delete old image if new one is uploaded
        const oldBlog = await Blog.findById(id);
        
        if (!oldBlog) {
            return null;
        }

        // If new image is uploaded and old one exists, delete old image
        if (payload.imageUrl && oldBlog.cloudinaryId && payload.imageUrl !== oldBlog.imageUrl) {
            try {
                await cloudinary.uploader.destroy(oldBlog.cloudinaryId);
            } catch (error) {
                console.error("Failed to delete old image from Cloudinary:", error);
            }
        }

        return await Blog.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true
        });
    }

    async deleteBlog(id: string): Promise<IBlog | null> {
        const blog = await Blog.findById(id);
        
        if (!blog) {
            return null;
        }

        // ✅ Delete image from Cloudinary before deleting blog
        if (blog.cloudinaryId) {
            try {
                await cloudinary.uploader.destroy(blog.cloudinaryId);
            } catch (error) {
                console.error("Failed to delete image from Cloudinary:", error);
            }
        }

        return await Blog.findByIdAndDelete(id);
    }
}

export const blogService = new BlogService();