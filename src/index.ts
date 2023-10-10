import "reflect-metadata";
import { AppDataSource } from "./data-source";
import express from "express";
import bodyParser from "body-parser";
import authRouter from "./routes/auth.routes";
import friendRouter from "./routes/friend.routes";
import { Server } from "socket.io";
import { createServer } from "http";

const isProd = process.argv.includes("--prod");
const port = isProd ? 8080 : 3000;
// initalize type orm
AppDataSource.initialize().then(async () => {
    console.log('Db Connected');

    const app = express();
    app.use(bodyParser.json())


    const httpServer = createServer(app);

    const io = new Server(httpServer);
    // app.listen(3000)
    // console.log('Server started at http://localhost:3000')

    httpServer.listen(port, () => {
        isProd?
         console.log('Connected to PROD DB\nStarted Server @localhost:8080'):
         console.log('Connected to DEV DB\nStarted Server @localhost:3000');
    });

    // Routes
    app.use("/user", authRouter)
    app.use("/friend", friendRouter)
}).catch((err: any) => {
    console.log(err)
})
