import { describe, test, expect, vi } from "vitest";
import { MockedRegistrationService } from "../../services/mocks/mock-registration-service";
import { registrationMock } from "../../entities/mock";
import { deleteRegistration } from "./delete-registration";

describe("Eliminar inscripción", () => {
    const registration = registrationMock({
        id: "reg1",
    });

    test("Debería eliminar una inscripción existente", async () => {
        const registrationService = new MockedRegistrationService([registration]);
        const spyDelete = vi.spyOn(registrationService, "deleteById");

        await deleteRegistration("reg1", { registrationService });

        const allRegistrations = await registrationService.findAll();

        expect(spyDelete).toHaveBeenCalledTimes(1);
        expect(spyDelete).toHaveBeenCalledWith("reg1");
        expect(allRegistrations.length).toBe(0);
    });

    test("Debería lanzar error si la inscripción no existe", async () => {
        const registrationService = new MockedRegistrationService([]);

        await expect(deleteRegistration("noExiste", { registrationService }))
            .rejects
            .toThrowError("Registration con id noExiste no encontrado");
    });
});
