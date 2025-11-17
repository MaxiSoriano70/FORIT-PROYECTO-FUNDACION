export const InformationStatus = {
    USUARIOAINFORMAR: "USUARIOAINFORMAR",
    INFORMAR: "INFORMAR",
    INFORMADO: "INFORMADO",
} as const;

export type InformationStatus = (typeof InformationStatus)[keyof typeof InformationStatus];
