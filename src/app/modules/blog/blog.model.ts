import { model, Schema } from "mongoose";
import { IBlog } from "./blog.interface";

const BlogSchema = new Schema<IBlog>({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    finalWords: {
        type: String,
        required: true,
        trim: true
    },
    cloudinaryId: {
        type: String
    }
}, {
    timestamps: true
})

export const Blog = model<IBlog>("Blog", BlogSchema)