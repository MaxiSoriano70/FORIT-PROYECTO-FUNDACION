export const RegistrationStatus = {
    ACTIVO: "ACTIVO",
    ABANDONADO: "ABANDONADO",
    COMPLETADO: "COMPLETADO",
} as const;

export type RegistrationStatus = (typeof RegistrationStatus)[keyof typeof RegistrationStatus];