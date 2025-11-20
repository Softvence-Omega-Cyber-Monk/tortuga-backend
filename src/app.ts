import dotenv from "dotenv";
// Load environment variables FIRST before any other imports
dotenv.config();

import express, { type Request, type Response } from "express";
import cors from "cors";
import { ProductRoutes } from "./app/modules/product/product.routes";
import { UserRoutes } from "./app/modules/user/user.routes";
import { ServiceRoutes } from "./app/modules/services/services.routes";
import { ConsultantRoutes } from "./app/modules/consultants/consultants.routes";
import { BookingRoutes } from "./app/modules/bookings/bookings.routes";
import { BlogRoutes } from "./app/modules/blog/blog.routes";
import { setupSwagger } from "./app/config/swagger";
import { ConfiguratorRouter } from "./app/modules/configurator/configurator.routes";

const app = express();

// CORS configuration - MUST be before other middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "https://tortuga7.com"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true
}));

// ✅ Increase payload limits for file uploads (50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

setupSwagger(app);
app.use("/api/users", UserRoutes);
app.use("/api/products", ProductRoutes);
app.use("/api/services", ServiceRoutes);
app.use("/api/consultants", ConsultantRoutes);
app.use("/api/bookings", BookingRoutes);
app.use("/api/blogs", BlogRoutes);
app.use("/api/configurator", ConfiguratorRouter)

app.get("/", (req: Request, res: Response) => {
    res.status(200).json("Welcome to tortuga backend");
});

export default app;