export const RegistrationStatus = {
    ACTIVE: "ACTIVE",
    DROPPED: "DROPPED",
    COMPLETED: "COMPLETED",
} as const;

export type RegistrationStatus = (typeof RegistrationStatus) [keyof typeof RegistrationStatus];