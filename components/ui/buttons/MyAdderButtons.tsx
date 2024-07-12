/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
import { Button } from '@chakra-ui/react'
import React from 'react'
import { useFieldArray } from 'react-hook-form'
import {  PaymentMethod, ProductForState, Sale } from 'schemas/SaleSchema'

interface DefaultValues {
    [key: string]: PaymentMethod | ProductForState
}

const DEFAULT_VALUES: DefaultValues = {
  payment_method: {
    method: "Sin utilizacion Sist. Financiero",
    amount: 0,
    time_unit: "Meses",
    time_value: 0,
  },
  product: {
    code: "",
    name: "",
    qty: 0,
    unit_price: 0
  }
} as const  

interface Props {
    fieldName: keyof Sale
}   

const MyAdderButtons = ({ fieldName }: Props) => {
    const { append } = useFieldArray({
        name: fieldName
    })

    const defaultValue = DEFAULT_VALUES[fieldName]

  return (
    <Button
        size="xs"
        fontSize="1rem"
        py={4}
        colorScheme="blue"
        onClick={() => append(defaultValue)}
    >
        Agregar
    </Button>
  )
}

export default MyAdderButtons