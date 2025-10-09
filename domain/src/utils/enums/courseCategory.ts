export const CourseCategory = {
    PROGRAMACION: "Programación",
    DISEÑO: "Diseño",
    MARKETING: "Marketing",
    IDIOMAS: "Idiomas"
} as const;

export type CourseCategory = (typeof CourseCategory)[keyof typeof CourseCategory];
