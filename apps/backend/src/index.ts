import 'dotenv/config';
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import router from './routers/index.router.js';
import errorHandler from './middlewares/errorHandler.mid.js';
import dbConnect from './helpers/dbConnect.helper.js';

/* Server */
const server = express();
const PORT: number = 8080;

/* Middlewares */
server.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
}));

server.use(express.urlencoded({ extended: true }));
server.use(express.json());

/* Router */
server.use("/", router);

/* Error Handler */
server.use((err: any, req: Request, res: Response, next: NextFunction) => {
    errorHandler(err, req, res, next);
});

/* Start Server */
const ready = (): void => {
    console.log(`✅ Server ready at http://localhost:${PORT}/`);
    dbConnect();
};

server.listen(PORT, ready);
