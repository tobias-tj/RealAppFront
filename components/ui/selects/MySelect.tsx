import { FormControl, FormLabel, Select } from "@chakra-ui/react"
import { useFormContext } from "react-hook-form"

interface Props{
    fieldName: string
    label: string
    flex?: number
    options: readonly string[]
}

const MySelect = ({ label, fieldName, options, flex = 3 } : Props) => {
    const { 
        formState: { errors },
        register,
    } = useFormContext()
    return (
        <FormControl flex={flex}>
            <FormLabel>{label}</FormLabel>
            <Select placeholder='Seleccionar' {...register(fieldName)}>
                {options.map((op) => (
                    <option key={op} value={op}>{op}</option>
                ))}
            </Select>
        </FormControl>
    )
}

export default MySelect