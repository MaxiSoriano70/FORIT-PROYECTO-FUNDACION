import { Router } from "express";
import {
    getAllUsers,
    getUserById,
    getUserByFirstName,
    getUserByLastName,
    getUserByEmail,
    getUserByFullName,
    createUser,
    updateUser,
    deleteUser,
    changeUserRole,
} from "../../controllers/user/user.controller.js";

const routerUser = Router();

routerUser.get("/", getAllUsers);
routerUser.get("/:id", getUserById);
routerUser.get("/firstName/:firstName", getUserByFirstName);
routerUser.get("/lastName/:lastName", getUserByLastName);
routerUser.get("/email/:email", getUserByEmail);
routerUser.get("/fullName/:firstName/:lastName", getUserByFullName);

routerUser.post("/", createUser);
routerUser.put("/:id", updateUser);
routerUser.delete("/:id", deleteUser);
routerUser.patch("/:id/role", changeUserRole);

export default routerUser;
