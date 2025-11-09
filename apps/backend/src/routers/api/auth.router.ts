import { Router } from "express";
import { login } from "../../controllers/auth/auth.controller.js";

const routerAuth = Router();

routerAuth.post("/login", login);

export default routerAuth;
