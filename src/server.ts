import { Server } from "http";
import mongoose from "mongoose";
import app from "./app"


let server: Server;

let port = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await mongoose.connect("mongodb+srv://tortuga:admintortuga@cluster0.9o8rsbr.mongodb.net/tortuga?retryWrites=true&w=majority&appName=Cluster0");
        console.log("Connected to DB");


        server = app.listen(port, () => {
            console.log(`Server is listening to port ${port}`);
        })
    }
    catch (err) {
        console.log(err)
    }
}
startServer();