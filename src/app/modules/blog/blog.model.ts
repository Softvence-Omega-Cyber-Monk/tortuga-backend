import { model, Schema } from "mongoose";
import { IBlog } from "./blog.interface";

const BlogSchema = new Schema<IBlog>({
    title: {
        type: String,
        required: [true, "Blog title is required"],
        trim: true
    },
    content: {
        type: String,
        required: [true, "Blog content is required"],
        trim: true
    },
    imageUrl: {
        type: String,
        required: [true, "Blog image is required"]
    },
    finalWords: {
        type: String,
        required: [true, "Final words are required"],
        trim: true
    },
    cloudinaryId: {
        type: String,
        required: false  // ✅ Made optional
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ✅ Add index for better performance
BlogSchema.index({ createdAt: -1 });
BlogSchema.index({ title: 'text', content: 'text' });

export const Blog = model<IBlog>("Blog", BlogSchema);