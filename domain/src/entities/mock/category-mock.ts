import { faker } from "@faker-js/faker";
import { Category } from "../category";

export function categoryMock(opts?: Partial<Category>): Category{
    return{
        id: faker.string.uuid(),
        name: faker.commerce.product(),
        description: faker.lorem.paragraph(),
        ...opts
    }
}