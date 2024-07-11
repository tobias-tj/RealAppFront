import { z } from "zod"

export const LoginSchema = z.object({
    email : z.string().email("El email no es valido."),
    code : z.string().length(6, "El codigo debe contener 6 caracteres."),
})

export type LoginType = z.infer<typeof LoginSchema>