import Manager from "./manager.mongo.js";
import User from "../../models/user.model.js";
import { UserRole } from "../../utils/enums/userRole.js";

class UserManager extends Manager {
    constructor() {
        super(User);
    }

    findByFirstName = async (firstName) => {
        return await this.model.findOne({ firstName }).lean();
    };

    findByLastName = async (lastName) => {
        return await this.model.findOne({ lastName }).lean();
    };

    findByEmail = async (email) => {
        return await this.model.findOne({ email }).lean();
    };

    findByFullName = async (firstName, lastName) => {
        return await this.model.findOne({ firstName, lastName }).lean();
    };

    changeRole = async (userId, newRole) => {
        if (!Object.values(UserRole).includes(newRole)) {
            throw new Error(`Rol inválido: ${newRole}`);
        }
        return await this.model.findByIdAndUpdate(
            userId,
            { role: newRole },
            { new: true }
        ).lean();
    };
}

const usersManager = new UserManager();

export { usersManager };
export default UserManager;
