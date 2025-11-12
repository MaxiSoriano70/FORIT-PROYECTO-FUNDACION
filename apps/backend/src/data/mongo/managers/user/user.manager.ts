import { Document } from "mongoose";
import Manager from "../manager.mongo.js";
import User, { IUser } from "../../models/user.model.js";
import { UserRole } from "../../../../utils/enums/userRole.js";

type Lean<T> = Omit<T, keyof Document>;

class UserManager extends Manager<IUser> {
    constructor() {
        super(User);
    }

    override save = async (data: Partial<IUser>): Promise<Lean<IUser>> => {
        if (data.password) {
            const salt = await bcrypt.genSalt(10);
            data.password = await bcrypt.hash(data.password, salt);
        }
        const newUser = new this.model(data);
        await newUser.save();
        return newUser.toObject() as Lean<IUser>;
    };

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
}

const userManager = new UserManager();

export { userManager };
export default UserManager;
