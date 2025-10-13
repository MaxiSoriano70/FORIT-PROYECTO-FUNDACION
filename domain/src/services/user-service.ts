import { User } from "../entities";
import { UserRole } from "../utils/enums/userRole";
import { Service } from "../utils/types/service";

export interface UserService extends Service<User>{
    findByFirstName: (firstName: string) => Promise<User | undefined>;
    findByLastName: (lastName: string) => Promise<User | undefined>;
    findByEmail: ( email: string ) => Promise<User | undefined>;
    findByFullName: (firstName: string, lastName: string) => Promise<User | undefined>;
    changeRole: (userId: string, newRole: string | UserRole) => Promise<User>;
}