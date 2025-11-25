import { faker } from "@faker-js/faker";
import { User } from "../../entities";
import { UserRole } from "../../utils/enums/userRole";

export function userMock(opts?: Partial<User>): User {
    return {
        ...opts,
        id: opts?.id ?? faker.string.uuid(),
        firstName: opts?.firstName ?? faker.person.firstName(),
        lastName: opts?.lastName ?? faker.person.lastName(),
        email: opts?.email ?? faker.internet.email(),
        password: opts?.password ?? faker.internet.password(),
        phone: opts?.phone ?? faker.phone.number(),
        address: opts?.address ?? faker.location.streetAddress(),
        role: opts?.role ?? UserRole.STUDENT,
    };
}
