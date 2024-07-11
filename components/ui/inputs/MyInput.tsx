import { FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react"
import { ReactNode } from "react"
import { useFormContext } from "react-hook-form"

interface Props{
    fieldName: string
    label: string
    placeholder?: string
    mb?: number
    flex?:number
}

const MyInput = ({fieldName, label, placeholder, mb = 5, flex = 3} : Props) => {
    const { formState: { errors }, register } = useFormContext()
    return(
        <FormControl marginBottom={mb} isInvalid={!!errors[fieldName]} flex={flex}>
                <FormLabel>{label}</FormLabel>
                <Input type="text" placeholder={placeholder || fieldName} {...register(fieldName)}/>
                <FormErrorMessage>{errors[fieldName]?.message as ReactNode}</FormErrorMessage>
        </FormControl>
    )
}

export default MyInput