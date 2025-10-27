import 'dotenv/config';
import express, { Request, Response, NextFunction } from "express";
import router from './routers/index.router.js';
import errorHandler from './middlewares/errorHandler.mid.js';
import dbConnect from './helpers/dbConnect.helper.js';

/* Server */
const server = express();
const PORT: number = 8080;

const ready = (): void => {
    console.log(`Server ready http://localhost:${PORT}/`);
    dbConnect();
};

server.listen(PORT, ready);

/* Middlewares */
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

/* Router */
server.use("/", router);

/* Error Handler */
server.use((err: any, req: Request, res: Response, next: NextFunction) => {
    errorHandler(err, req, res, next);
});
