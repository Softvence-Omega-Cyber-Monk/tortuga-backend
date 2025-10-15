import express, { type Request, type Response } from "express";
import cors from "cors"
import dotenv from "dotenv"
import { ProductRoutes } from "./app/modules/product/product.routes";
import { UserRoutes } from "./app/modules/user/user.routes";

const app = express()


dotenv.config()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use("/api/users", UserRoutes)
app.use("/api/products", ProductRoutes)

app.get("/", (req: Request, res: Response) => {
    res.status(200).json("Welcome to tortuga backend");
})


export default app;