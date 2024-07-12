/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react"
import { ReactNode } from "react"
import { useFormContext } from "react-hook-form"

interface Props<T>{
    fieldName: string
    label: string
    placeholder?: string 
    mb?: number
    valueAsNumber?: boolean
    flex?:number
    type?:string
    showLabel?: boolean
}

function MyInput<T>({
    fieldName,
    label,
    flex = 4,
    showLabel = true,
    type = "text",
    placeholder,
    valueAsNumber = false,
    mb = 5,
  }: Props<T>) {
    const { formState: { errors }, register } = useFormContext()
    return(
        <FormControl marginBottom={mb} isInvalid={!!errors[fieldName]} flex={flex}>
                {showLabel && <FormLabel>{label}</FormLabel>}
                <Input type={type} placeholder={placeholder || fieldName} {...register(fieldName)}/>
                <FormErrorMessage>{errors[fieldName]?.message as ReactNode}</FormErrorMessage>
        </FormControl>
    )
}

export default MyInput