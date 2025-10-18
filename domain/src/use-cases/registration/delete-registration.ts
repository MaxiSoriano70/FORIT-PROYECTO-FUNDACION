import { RegistrationService } from "../../services";

export interface DeleteRegistrationDeps {
    registrationService: RegistrationService;
}

export async function deleteRegistration(
    id: string,
    deps: DeleteRegistrationDeps
) {
    const registration = await deps.registrationService.deleteById(id);
}
