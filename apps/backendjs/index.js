import 'dotenv/config.js';
import express from "express";
import router from "./src/routers/index.router.js";
import errorHandler from "./src/middlewares/errorHandler.mid.js";
import dbConnect from "./src/helpers/dbConnect.helper.js";

/* Server */
const server = express();
const PORT = 8080;

const ready = () => {
    console.log(`Server ready http://localhost:${PORT}/`);
    dbConnect();
}

server.listen(PORT, ready);

/* middlewares */
server.use(express.urlencoded({extended: true}));
server.use(express.json());

/* Router */
server.use("/", router);

server.use(errorHandler);