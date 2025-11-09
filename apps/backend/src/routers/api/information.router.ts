import { Router } from "express";
import {
    getAllInformation,
    getInformationById,
    createInformation,
    updateInformation,
    deleteInformation,
    convertInformationToUser,
} from "../../controllers/information/information.controller.js";

const routerInformation = Router();

routerInformation.get("/", getAllInformation);
routerInformation.get("/:id", getInformationById);
routerInformation.post("/", createInformation);
routerInformation.put("/:id", updateInformation);
routerInformation.delete("/:id", deleteInformation);
routerInformation.post("/:id/convert", convertInformationToUser);

export default routerInformation;
