import { Router } from "express";
import { registrationController } from "../../controllers/registration/registration.controller.js";

const routerRegistration = Router();

routerRegistration.get("/student/:studentId", registrationController.getByStudent);
routerRegistration.get("/course/:courseId", registrationController.getByCourse);

routerRegistration.get("/active/list", registrationController.getActive);
routerRegistration.get("/incomplete/list", registrationController.getIncomplete);

routerRegistration.patch("/:id/quota", registrationController.markQuotaPaid);
routerRegistration.patch("/:id/finish", registrationController.finishCourse);

routerRegistration.put("/:id/abandon", registrationController.abandon);
routerRegistration.put("/:id/activate", registrationController.activate);

routerRegistration.get("/", registrationController.getAll);
routerRegistration.post("/", registrationController.create);

routerRegistration.get("/:id", registrationController.getById);
routerRegistration.put("/:id", registrationController.update);
routerRegistration.delete("/:id", registrationController.delete);


export default routerRegistration;
