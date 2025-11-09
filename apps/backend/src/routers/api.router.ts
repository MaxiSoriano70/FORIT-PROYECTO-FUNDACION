import { Router } from "express";
import routerAuth from "./api/auth.router.js";
import routerCategory from "./api/category.router.js";
import routerCourse from "./api/course.router.js";
import routerRegistration from "./api/registration.router.js";
import routerUser from "./api/user.router.js";
import routerInformation from "./api/information.router.js";

const routerApi: Router = Router();

routerApi.use("/auth", routerAuth);
routerApi.use("/category", routerCategory);
routerApi.use("/course", routerCourse);
routerApi.use("/registration", routerRegistration);
routerApi.use("/user", routerUser);
routerApi.use("/information", routerInformation);

export default routerApi;
