import { z } from "zod"

export const DOC_TYPES = [
    "RUC",
    "Cédula",
    "Pasaporte",
    "Identificación exterior"
] as const



export const ClientSchema = z.object({
    firstname: z.string().min(3, "El nombre debe tener al menos tres caracteres!"),
    lastname: z.string().min(3, "El apellido debe tener al menos tres caracteres!"),
    email : z.string().email("El email no es valido."),
    document_type: z.enum(DOC_TYPES),
    document_value: z.string().min(4, "El documento debe tener al menos cuatro caracteres!"),
})

export type Client = z.infer<typeof ClientSchema>

export interface ClientFormProps{
    clientId? : string
}

export interface ClientFromDB extends Client{
    _id : string
    firstname: string
    sales?: {count: number, amount: number}
}

export interface ClientListProps {
    clients: ClientFromDB[];
}