import { Server } from "http";
import mongoose from "mongoose";
import app from "./app"


let server: Server;


const startServer = async () => {
    try {
        await mongoose.connect("mongodb+srv://tortuga:admintortuga@cluster0.9o8rsbr.mongodb.net/tortuga?retryWrites=true&w=majority&appName=Cluster0");
        console.log("Connected to DB");


        server = app.listen(5000, () => {
            console.log("Server is listening to port 5000");
        })
    }
    catch (err) {
        console.log(err)
    }
}
startServer();