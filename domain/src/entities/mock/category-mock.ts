import { faker } from "@faker-js/faker";
import { Category } from "../category";

export function categoryMock(opts?: Partial<Category>): Category {
    return {
        ...opts,
        id: opts?.id ?? faker.string.uuid(),
        name: opts?.name ?? faker.commerce.product(),
        description: opts?.description ?? faker.lorem.paragraph(),
    };
}
