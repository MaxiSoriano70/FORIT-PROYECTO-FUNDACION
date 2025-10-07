export const UserRole = {
    ADMIN: "ADMIN",
    STUDENT: "ESTUDIANTE"
} as const;

export type UserRole = (typeof UserRole) [keyof typeof UserRole];