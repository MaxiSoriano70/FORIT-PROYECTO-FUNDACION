export const InformationStatus = {
    USUARIOAINFORMAR: "USUARIOAIFORMAR",
    INFORMAR: "INFORMAR",
    INFORMADO: "INFORMADO",
} as const;

export type InformationStatus = (typeof InformationStatus)[keyof typeof InformationStatus];