import { Router } from "express";
import routerAuth from "./api/auth.router.js";
import routerCategory from "./api/category.router.js";
import routerCourse from "./api/course.router.js";
import routerRegistration from "./api/registration.router.js";
import routerUser from "./api/user.router.js";

const routerApi = Router();

routerApi.use("/auth", routerAuth);
routerApi.use("/category", routerCategory);
routerApi.use("/course", routerCourse);
routerApi.use("/registration", routerRegistration);
routerApi.use("/user", routerUser);

export default routerApi;