import { Document } from "mongoose";
import Manager from "../manager.mongo.js";
import User, { IUser } from "../../models/user.model.js";
import { UserRole } from "../../../../utils/enums/userRole.js";

type Lean<T> = Omit<T, keyof Document>;

class UserManager extends Manager<IUser> {
    constructor() {
        super(User);
    }

    findByFirstName = async (firstName: string): Promise<Lean<IUser> | null> => {
        return (await this.model.findOne({ firstName }).lean()) as Lean<IUser> | null;
    };

    findByLastName = async (lastName: string): Promise<Lean<IUser> | null> => {
        return (await this.model.findOne({ lastName }).lean()) as Lean<IUser> | null;
    };

    findByEmail = async (email: string): Promise<Lean<IUser> | null> => {
        return (await this.model.findOne({ email }).lean()) as Lean<IUser> | null;
    };

    findByFullName = async (firstName: string, lastName: string): Promise<Lean<IUser> | null> => {
        return (await this.model.findOne({ firstName, lastName }).lean()) as Lean<IUser> | null;
    };

    changeRole = async (userId: string, newRole: UserRole): Promise<Lean<IUser> | null> => {
        if (!Object.values(UserRole).includes(newRole)) {
            throw new Error(`Rol inválido: ${newRole}`);
        }

        return (await this.model
            .findByIdAndUpdate(userId, { role: newRole }, { new: true })
            .lean()) as Lean<IUser> | null;
    };

    findByRole = async (role: UserRole): Promise<Lean<IUser>[]> => {
        return (await this.model.find({ role }).lean()) as Lean<IUser>[];
    };
}

const userManager = new UserManager();

export { userManager };
export default UserManager;
