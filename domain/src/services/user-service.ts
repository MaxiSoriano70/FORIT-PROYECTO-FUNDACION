import { User } from "../entities";
import { Service } from "../utils/types/service";

export interface UserService extends Service<User>{
    findByFirstName: (firstName: string) => Promise<User | undefined>;
    findByLastName: (lastName: string) => Promise<User | undefined>;
    findByEmail: ( email: string ) => Promise<User | undefined>;
}