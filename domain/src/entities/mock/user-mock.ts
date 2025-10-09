import { faker } from "@faker-js/faker";
import { User } from "../../entities";
import { UserRole } from '../../../dist/utils/enums/userRole';

export function userMock(opts?: Partial<User>): User {
    return {
        id: faker.string.uuid(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        role: UserRole.STUDENT,
        ...opts,
    };
}
