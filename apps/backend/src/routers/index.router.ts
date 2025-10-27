import { Router } from "express";
import routerApi from "./api.router.js";

const router: Router = Router();

router.use("/api", routerApi);

export default router;
