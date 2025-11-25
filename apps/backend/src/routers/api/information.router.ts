import { Router } from "express";
import {
    getAllInformation,
    getInformationById,
    createInformation,
    updateInformation,
    deleteInformation,
    convertInformationToUser,
    markInformationAsInformed,
} from "../../controllers/information/information.controller.js";

const routerInformation = Router();

routerInformation.get("/", getAllInformation);
routerInformation.get("/:id", getInformationById);
routerInformation.post("/", createInformation);
routerInformation.put("/:id", updateInformation);
routerInformation.delete("/:id", deleteInformation);

routerInformation.post("/:id/convert", convertInformationToUser);

routerInformation.put("/:id/mark-as-informed", markInformationAsInformed);

export default routerInformation;
