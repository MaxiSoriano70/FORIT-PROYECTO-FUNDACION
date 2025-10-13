import { User } from "../../entities/user";
import { UserRole } from "../../utils/enums/userRole";
import { UserService } from "../user-service";

export class MockedUserService implements UserService {
    private users: User[] = [];

    constructor(users: User[] = []) {
        this.users = users;
    }

    findAll = async (): Promise<User[]> => {
        return this.users;
    };

    findById = async (id: string): Promise<User | undefined> => {
        return this.users.find(u => u.id === id);
    };

    findByFirstName = async (firstName: string): Promise<User | undefined> => {
        return this.users.find(
            u => u.firstName.toLowerCase() === firstName.toLowerCase()
        );
    };

    findByLastName = async (lastName: string): Promise<User | undefined> => {
        return this.users.find(
            u => u.lastName.toLowerCase() === lastName.toLowerCase()
        );
    };

    findByEmail = async (email: string): Promise<User | undefined> => {
        return this.users.find(
            u => u.email.toLowerCase() === email.toLowerCase()
        );
    };

    findByFullName = async (firstName: string, lastName: string): Promise<User | undefined> => {
        return this.users.find(
            u =>
                u.firstName.toLowerCase() === firstName.toLowerCase() &&
                u.lastName.toLowerCase() === lastName.toLowerCase()
        );
    };

    editOne = async (id: string, data: Partial<User>): Promise<User> => {
        const index = this.users.findIndex(u => u.id === id);
        if (index === -1) {
            throw new Error(`Usuario con id ${id} no encontrado`);
        }
        this.users[index] = { ...this.users[index], ...data } as User;
        return this.users[index];
    };

    save = async (user: User): Promise<void> => {
        const exists = this.users.some(u => u.id === user.id);
        if (exists) {
            throw new Error(`Usuario con id ${user.id} ya existe`);
        }
        this.users.push(user);
    };

    deleteById = async (id: string): Promise<void> => {
        const index = this.users.findIndex(u => u.id === id);
        if (index === -1) {
            throw new Error(`Usuario con id ${id} no encontrado`);
        }
        this.users.splice(index, 1);
    };


    changeRole = async (userId: string, newRole: string | UserRole): Promise<User> => {
        const index = this.users.findIndex(u => u.id === userId);
        if (index === -1) {
            throw new Error(`Usuario con id ${userId} no encontrado`);
        }

        this.users[index] = { ...this.users[index], role: newRole as UserRole } as User;
        return this.users[index];
    };
}
