/* eslint-disable @typescript-eslint/consistent-type-imports */
import { PaymentMethod } from "schemas/SaleSchema"

interface DefaultValues {
    [key: string]: PaymentMethod
}

const DEFAULT_VALUES: DefaultValues = {
  payment_method: {
    method: "Sin utilizacion Sist. Financiero",
    amount: 0,
    time_unit: "Meses",
    time_value: 0,
  },
} as const

export default DEFAULT_VALUES