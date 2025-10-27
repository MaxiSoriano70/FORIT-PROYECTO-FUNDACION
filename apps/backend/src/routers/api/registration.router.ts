import { Router } from "express";
import { registrationController } from "../../controllers/ragistration/registration.controller.js";

const routerRegistration = Router();

routerRegistration.get("/", registrationController.getAll);
routerRegistration.get("/:id", registrationController.getById);
routerRegistration.get("/student/:studentId", registrationController.getByStudent);
routerRegistration.get("/course/:courseId", registrationController.getByCourse);

routerRegistration.post("/", registrationController.create);
routerRegistration.put("/:id", registrationController.update);
routerRegistration.delete("/:id", registrationController.delete);

routerRegistration.patch("/:id/quota", registrationController.markQuotaPaid);
routerRegistration.patch("/:id/finish", registrationController.finishCourse);

routerRegistration.get("/active/list", registrationController.getActive);
routerRegistration.get("/incomplete/list", registrationController.getIncomplete);

export default routerRegistration;
