export const UserRole = {
    ADMIN: "ADMIN",
    TEACHER: "PROFESOR",
    STUDENT: "ESTUDIANTE"
} as const;

export type UserRole = (typeof UserRole) [keyof typeof UserRole];