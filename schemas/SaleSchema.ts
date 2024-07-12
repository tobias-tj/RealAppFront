import { z } from "zod";

export const payment_methods_TYPES = [
    "Sin utilizacion Sist. Financiero",
    "Conpensacion de deudas",
    "Tarjetas de debito",
    "Tarjetas de credito",
    "Dinero Electronico",
    "Otros con utilizacion del sitema financiero",
    "Endoso de titulos",
] as const


export const TIME_UNITS = z.enum(["Dias", "Meses", "Años"]);

export const defaultPM: PaymentMethod = {
    method: "Sin utilizacion Sist. Financiero",
    amount: 0,
    time_unit: "Meses",
    time_value: 0,
}


export const saleProductShema = z.object({
    code: z.string(),
    name: z.string().optional(),
    qty: z.number(),
    unit_price: z.number(),
    discount: z.number().optional(),
})

export const salePaymentMethodShema = z.object({
    method: z.enum(payment_methods_TYPES),
    amount: z.number(),
    time_unit: TIME_UNITS,
    time_value: z.number(),
}) 


export const saleShema = z.object({
    operation_date: z.date(),
    product: z.array(saleProductShema),
    client_document: z.string(),
    payment_methods: z.array(salePaymentMethodShema),
})


export type Sale = z.infer<typeof saleShema>

export type PaymentMethod = z.infer<typeof salePaymentMethodShema>
export type ProductForState = z.infer<typeof saleProductShema>


export interface Product extends ProductForState{
    supplier_cost: number
    micro: number
    iva: number
    salvament_margin: number
    profit_margin: number
}
 
export interface ProductFormProps{
    saleId? : string
}
