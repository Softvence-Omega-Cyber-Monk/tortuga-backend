// src/modules/blog/blog.route.ts
import { Router } from "express";
import { blogController } from "./blog.controller";
import { multerUpload } from "../../middlewares/multer.upload";

const router = Router();

router.post("/", multerUpload, blogController.createBlog);
router.get("/", blogController.getAllBlogs);
router.get("/:id", blogController.getBlogById);
router.patch("/:id", multerUpload, blogController.updateBlog);
router.delete("/:id", blogController.deleteBlog);

export const BlogRoutes = router;
