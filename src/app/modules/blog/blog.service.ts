import { cloudinary } from "../../config/cloudinary.config";
import { IBlog } from "./blog.interface";
import fs from "fs"
import { Blog } from "./blog.model";

class BlogService {
    async createBlog(payload : Partial<IBlog>){
        return Blog.create(payload);
    }

    async getAllBlogs(): Promise<IBlog[]>{
        return Blog.find()
    }

    async getBlogById(id: string): Promise<IBlog | null>{
        return Blog.findById(id)
    }
    async updateBlog(id: string, payload: Partial<IBlog>): Promise<IBlog | null> {
        return await Blog.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true
        });
    }
    async deleteBlog(id: string): Promise<IBlog | null>{
        return await Blog.findByIdAndDelete(id)
    }
}

export const blogService = new BlogService();

